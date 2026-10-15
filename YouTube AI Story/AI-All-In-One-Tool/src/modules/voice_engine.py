"""
Emotional Voice Engine - Generates human-like voices with emotions
Supports both XTTS (GPU/CPU) and fallback gTTS
"""
import os
import re
import tempfile
from pathlib import Path
from typing import Dict, List, Optional

import numpy as np

from src.config import VOICES_DIR, TTS_MODEL


class EmotionalVoiceEngine:
    """
    Creates emotional, human-like voiceovers.
    Uses XTTS v2 for high quality (supports emotions + voice cloning)
    Falls back to gTTS if XTTS not available.
    """
    
    def __init__(self, voices_dir: Path = VOICES_DIR, offline_only: bool = True):
        self.voices_dir = voices_dir
        self.voices_dir.mkdir(parents=True, exist_ok=True)
        self.xtts = None
        self.synthesizer = None
        self.offline_only = offline_only
        self._init_tts()
    
    def _init_tts(self):
        """Initialize the best available TTS engine."""
        try:
            # Try XTTS v2 (best quality, supports emotions + cloning)
            from TTS.api import TTS
            print("🎙️ Loading XTTS v2 (this may take a minute)...")
            self.xtts = TTS(TTS_MODEL, gpu=True)
            print("✅ XTTS v2 loaded on GPU")
        except Exception as e:
            print(f"⚠️ Could not load XTTS on GPU: {e}")
            try:
                from TTS.api import TTS
                print("🎙️ Loading XTTS v2 on CPU...")
                self.xtts = TTS(TTS_MODEL, gpu=False)
                print("✅ XTTS v2 loaded on CPU")
            except Exception as e2:
                print(f"⚠️ Could not load XTTS: {e2}")
                if self.offline_only:
                    raise RuntimeError(
                        "Offline-only mode is enabled and XTTS could not be loaded. "
                        "Install the TTS package and a compatible voice model, or allow cloud TTS fallback."
                    )
                print("🎙️ Falling back to gTTS")
                self.xtts = None
    
    def generate_voiceover(self, script: Dict, character: Dict,
                           output_path: Optional[Path] = None) -> Path:
        """
        Generate emotional voiceover for a script.
        
        Args:
            script: Script dictionary with scenes/full_script
            character: Character dictionary with voice settings
            output_path: Where to save the audio file
        
        Returns:
            Path to generated audio file
        """
        text = script.get('voiceover_text', script.get('full_script', ''))
        
        if not output_path:
            output_path = self.voices_dir / f"voiceover_{character['id']}_{hash(text) % 1000000}.wav"
        
        # Clean text for voiceover
        text = self._clean_text(text)
        
        # Add emotional emphasis
        emotion = self._extract_emotion(character)
        text = self._apply_emotion(text, emotion)
        
        try:
            if self.xtts:
                return self._generate_xtts(text, character, output_path)
            else:
                if self.offline_only:
                    raise RuntimeError("Offline-only mode is enabled; cloud TTS fallback is not allowed.")
                return self._generate_gtts(text, character, output_path)
        except Exception as e:
            print(f"⚠️ Voice generation failed: {e}")
            if self.offline_only:
                raise
            return self._generate_gtts(text, character, output_path)
    
    def _clean_text(self, text: str) -> str:
        """Clean text for voice generation."""
        # Remove URLs
        text = re.sub(r'http\S+|www\.\S+', '', text)
        # Remove hashtags (but keep the word)
        text = re.sub(r'#(\w+)', r'\1', text)
        # Remove excessive punctuation
        text = re.sub(r'[!]{3,}', '!', text)
        text = re.sub(r'[?]{3,}', '?', text)
        # Keep emotion markers for XTTS
        return text.strip()
    
    def _extract_emotion(self, character: Dict) -> str:
        """Extract primary emotion from character profile."""
        profile = character.get('emotion_profile', 'neutral').lower()
        
        if any(word in profile for word in ['excited', 'hyper', 'chaotic', 'high energy']):
            return 'excited'
        elif any(word in profile for word in ['calm', 'thoughtful', 'wise', 'educational']):
            return 'calm'
        elif any(word in profile for word in ['suspense', 'mystery', 'serious']):
            return 'serious'
        elif any(word in profile for word in ['happy', 'cheerful', 'playful']):
            return 'happy'
        elif any(word in profile for word in ['motivational', 'determined', 'strong']):
            return 'motivational'
        else:
            return 'neutral'
    
    def _apply_emotion(self, text: str, emotion: str) -> str:
        """
        Apply emotional formatting to text.
        XTTS can understand emotional cues in brackets.
        """
        emotion_prefixes = {
            'excited': '[excited] ',
            'calm': '[calm] ',
            'serious': '[serious] ',
            'happy': '[happy] ',
            'motivational': '[motivational] ',
            'neutral': ''
        }
        
        prefix = emotion_prefixes.get(emotion, '')
        return prefix + text
    
    def _generate_xtts(self, text: str, character: Dict, output_path: Path) -> Path:
        """Generate high-quality emotional voice using XTTS."""
        speaker_wav = self._get_speaker_sample(character)
        
        # For XTTS, split long text into sentences
        sentences = self._split_into_sentences(text)
        audio_segments = []
        
        for sentence in sentences:
            if not sentence.strip():
                continue
            
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
                tmp_path = tmp.name
            
            self.xtts.tts_to_file(
                text=sentence,
                speaker_wav=speaker_wav,
                language="en",
                file_path=tmp_path
            )
            
            # Load audio segment
            from pydub import AudioSegment
            audio_segments.append(AudioSegment.from_wav(tmp_path))
            
            # Clean up temp file
            os.unlink(tmp_path)
        
        # Combine segments
        if audio_segments:
            from pydub import AudioSegment
            combined = sum(audio_segments[1:], audio_segments[0])
            combined.export(str(output_path), format="wav")
        
        return output_path
    
    def _generate_gtts(self, text: str, character: Dict, output_path: Path) -> Path:
        """Fallback to Google Text-to-Speech."""
        from gtts import gTTS
        
        mp3_path = output_path.with_suffix('.mp3')
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(str(mp3_path))
        
        # Convert to wav for consistency
        from pydub import AudioSegment
        audio = AudioSegment.from_mp3(str(mp3_path))
        audio.export(str(output_path), format="wav")
        
        mp3_path.unlink(missing_ok=True)
        return output_path
    
    def _get_speaker_sample(self, character: Dict) -> str:
        """Get or create a speaker sample for voice cloning."""
        sample_path = self.voices_dir / f"{character['id']}_sample.wav"
        
        if sample_path.exists():
            return str(sample_path)
        
        # Create a default sample based on character type
        return self._create_default_sample(character)
    
    def _create_default_sample(self, character: Dict) -> str:
        """Create a default voice sample for a character."""
        sample_path = self.voices_dir / f"{character['id']}_sample.wav"
        
        if sample_path.exists():
            return str(sample_path)
        
        sample_text = f"Hi, I'm {character['name']}. {character.get('personality', 'I am here to help you.')}".split('.')[0] + "."
        
        try:
            if self.offline_only:
                # Create a minimal silent WAV so XTTS has a file to reference.
                from pydub import AudioSegment
                silence = AudioSegment.silent(duration=1000)
                silence.export(str(sample_path), format="wav")
                print("⚠️ Created silent placeholder sample (offline-only mode).")
            else:
                from gtts import gTTS
                from pydub import AudioSegment
                
                mp3_path = sample_path.with_suffix('.mp3')
                tts = gTTS(text=sample_text, lang='en', slow=False)
                tts.save(str(mp3_path))
                
                audio = AudioSegment.from_mp3(str(mp3_path))
                audio.export(str(sample_path), format="wav")
                mp3_path.unlink(missing_ok=True)
        except Exception as e:
            print(f"⚠️ Could not create default sample: {e}")
        
        return str(sample_path)
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences for better TTS processing."""
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    def clone_voice(self, character_id: str, sample_audio_path: Path) -> bool:
        """
        Clone a voice from an audio sample.
        
        Args:
            character_id: Character to assign voice to
            sample_audio_path: Path to clean voice sample (10-30 seconds)
        """
        try:
            from pydub import AudioSegment
            
            output_sample = self.voices_dir / f"{character_id}_sample.wav"
            audio = AudioSegment.from_file(str(sample_audio_path))
            
            # Ensure sample is 10-30 seconds
            if len(audio) > 30000:
                audio = audio[:30000]
            elif len(audio) < 6000:
                print("⚠️ Sample too short (need at least 6 seconds)")
                return False
            
            audio.export(str(output_sample), format="wav")
            print(f"✅ Voice cloned for character: {character_id}")
            return True
            
        except Exception as e:
            print(f"❌ Voice cloning failed: {e}")
            return False


if __name__ == "__main__":
    engine = EmotionalVoiceEngine()
    
    character = {
        "id": "brot",
        "name": "Brot",
        "voice_style": "hyperactive brainrot energy",
        "emotion_profile": "high energy: excited, shocked, silly"
    }
    
    script = {
        "voiceover_text": "Wait, wait, wait! You actually believe that? No no no, let me show you the truth! This changes everything!"
    }
    
    audio_path = engine.generate_voiceover(script, character)
    print(f"🎙️ Generated: {audio_path}")
