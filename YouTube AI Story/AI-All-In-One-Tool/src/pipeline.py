"""
Main Pipeline - Orchestrates the full video creation process
"""
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

from src.modules.idea_generator import IdeaGenerator
from src.modules.script_generator import ScriptGenerator
from src.modules.character_manager import CharacterManager
from src.modules.voice_engine import EmotionalVoiceEngine
from src.modules.video_renderer import VideoRenderer
from src.modules.plagiarism_detector import PlagiarismDetector
from src.modules.provenance import ProjectProvenance


class YouTubeAIPipeline:
    """
    Full pipeline:
    Idea → Script → Voiceover → Video → Plagiarism Check → Output
    """
    
    def __init__(self):
        print("🚀 Initializing YouTube AI Pipeline...")
        self.idea_generator = IdeaGenerator()
        self.script_generator = ScriptGenerator()
        self.character_manager = CharacterManager()
        self.voice_engine = EmotionalVoiceEngine()
        self.video_renderer = VideoRenderer()
        self.plagiarism_detector = PlagiarismDetector()
        self.provenance = ProjectProvenance()
        print("✅ Pipeline ready")
    
    def create_video(self, niche: str, character_id: str = "host",
                     format_type: str = "shorts", duration: int = 45,
                     emotion_override: str = None, count: int = 1) -> Dict:
        """
        Create one or more videos from a niche/topic.
        
        Args:
            niche: Topic/niche for content
            character_id: Which character to use
            format_type: "shorts" or "longform"
            duration: Video length in seconds
            emotion_override: Force specific emotion
            count: Number of videos to create
        
        Returns:
            Dictionary with results and created videos
        """
        results = {
            'created': [],
            'blocked': [],
            'failed': [],
            'niche': niche,
            'character': character_id,
            'format': format_type,
            'timestamp': datetime.now().isoformat()
        }
        
        character = self.character_manager.get_character(character_id)
        if not character:
            results['failed'].append(f"Character not found: {character_id}")
            return results
        
        # Generate ideas
        print(f"\n🎯 Generating {count} ideas for: {niche}")
        ideas = self.idea_generator.generate_ideas(
            niche=niche,
            count=count,
            audience="all_ages",
            style=character.get('personality', 'entertaining')
        )
        
        for idea in ideas:
            last_error = None
            best_attempt = None

            for take in range(1, 4):
                try:
                    print(f"\n📝 Idea: {idea.get('title')} | take {take}/3")

                    script = self.script_generator.generate_script(
                        idea=idea,
                        character=character,
                        duration=duration,
                        format_type=format_type
                    )
                    script['take_number'] = take

                    print("🎙️ Generating emotional voiceover...")
                    audio_path = self.voice_engine.generate_voiceover(script, character)

                    print("🎬 Rendering video...")
                    video_path = self.video_renderer.render_video(
                        script=script,
                        audio_path=audio_path,
                        character=character,
                        format_type=format_type
                    )

                    print("🔍 Checking for plagiarism...")
                    plagiarism_result = self.plagiarism_detector.check_video(
                        video_path=video_path,
                        script_text=script.get('full_script', ''),
                        audio_path=audio_path,
                        video_title=script.get('title', '')
                    )

                    video_result = {
                        'id': str(uuid.uuid4())[:8],
                        'title': script.get('title'),
                        'idea': idea,
                        'script': script,
                        'video_path': str(video_path),
                        'audio_path': str(audio_path),
                        'plagiarism': plagiarism_result,
                        'status': 'ready' if not plagiarism_result['is_plagiarized'] else 'blocked',
                        'created_at': datetime.now().isoformat(),
                        'take_number': take
                    }

                    manifest_path = self.provenance.create_manifest(
                        video_result['id'],
                        {
                            'title': video_result['title'],
                            'idea': idea,
                            'script': script,
                            'character_id': character_id,
                            'format_type': format_type,
                            'take_number': take,
                        },
                        [Path(video_path), Path(audio_path)],
                    )
                    video_result['local_manifest_path'] = str(manifest_path)

                    if plagiarism_result['is_plagiarized']:
                        print(f"⚠️ Take {take} blocked for plagiarism; retrying with new take...")
                        last_error = "plagiarism"
                        best_attempt = video_result if best_attempt is None else best_attempt
                        continue

                    print(f"✅ READY: {script.get('title')} (take {take})")
                    results['created'].append(video_result)
                    best_attempt = video_result
                    break

                except Exception as e:
                    last_error = str(e)
                    print(f"❌ Take {take} failed: {e}")
                    if take == 3:
                        break

            if not results['created'] or not any(item.get('idea', {}).get('title') == idea.get('title') for item in results['created']):
                if best_attempt:
                    if best_attempt.get('status') == 'blocked':
                        results['blocked'].append(best_attempt)
                    else:
                        results['created'].append(best_attempt)
                else:
                    results['failed'].append({
                        'idea': idea.get('title'),
                        'error': last_error or 'Unknown generation error'
                    })
        
        return results
    
    def get_stats(self) -> Dict:
        """Get pipeline statistics."""
        return {
            'characters': len(self.character_manager.list_characters()),
            'gpu_available': self.video_renderer.gpu_available,
            'cpu_cores': self.video_renderer.cpu_cores,
            'ram_gb': round(self.video_renderer.ram_gb, 1),
            'visual_references': len(self.plagiarism_detector.visual_db),
            'script_references': len(self.plagiarism_detector.script_db),
            'audio_references': len(self.plagiarism_detector.audio_db)
        }


if __name__ == "__main__":
    pipeline = YouTubeAIPipeline()
    
    print("\n" + "="*50)
    print("STATS:")
    print(json.dumps(pipeline.get_stats(), indent=2))
    print("="*50)
    
    # Test creation
    result = pipeline.create_video(
        niche="amazing animal facts",
        character_id="host",
        format_type="shorts",
        duration=30,
        count=1
    )
    
    print("\n" + "="*50)
    print("RESULTS:")
    print(f"Created: {len(result['created'])}")
    print(f"Blocked: {len(result['blocked'])}")
    print(f"Failed: {len(result['failed'])}")
