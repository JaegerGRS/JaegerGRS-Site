"""
Character Manager - Create and manage AI characters/voices for all content
"""
import json
from pathlib import Path
from typing import Dict, List, Optional

from src.config import VOICES_DIR


class CharacterManager:
    def __init__(self, voices_dir: Path = VOICES_DIR):
        self.voices_dir = voices_dir
        self.voices_dir.mkdir(parents=True, exist_ok=True)
        self.characters_file = self.voices_dir / "characters.json"
        self.characters = self._load_characters()
    
    def _load_characters(self) -> Dict:
        """Load characters from JSON file."""
        if self.characters_file.exists():
            with open(self.characters_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return self._default_characters()
    
    def _save_characters(self):
        """Save characters to JSON file."""
        with open(self.characters_file, 'w', encoding='utf-8') as f:
            json.dump(self.characters, f, indent=2)
    
    def _default_characters(self) -> Dict:
        """Default built-in characters for all age ranges."""
        return {
            "host": {
                "id": "host",
                "name": "Alex",
                "avatar": "🎙️",
                "personality": "friendly, relatable, energetic",
                "voice_style": "warm conversational narrator",
                "voice_id": "default",
                "emotion_profile": "balanced: curious, excited, empathetic",
                "age_appeal": "all_ages",
                "description": "Your default friendly host. Works for any topic."
            },
            "brot": {
                "id": "brot",
                "name": "Brot",
                "avatar": "🧠",
                "personality": "chaotic Gen-Z brainrot character, absurd humor, fast-paced",
                "voice_style": "hyperactive, exaggerated, meme energy",
                "voice_id": "brot_voice",
                "emotion_profile": "high energy: excited, shocked, silly",
                "age_appeal": "teens_young_adults",
                "description": "Brainrot character for chaotic, fast-paced meme content."
            },
            "professor": {
                "id": "professor",
                "name": "Professor Pixel",
                "avatar": "🧑‍🏫",
                "personality": "wise, patient, educational",
                "voice_style": "calm, articulate, trustworthy",
                "voice_id": "professor_voice",
                "emotion_profile": "calm: curious, thoughtful, encouraging",
                "age_appeal": "all_ages",
                "description": "Educational character for facts, tutorials, explainers."
            },
            "coach": {
                "id": "coach",
                "name": "Coach Max",
                "avatar": "💪",
                "personality": "motivational, direct, inspiring",
                "voice_style": "strong, confident, energizing",
                "voice_id": "coach_voice",
                "emotion_profile": "motivational: determined, excited, serious",
                "age_appeal": "all_ages",
                "description": "Motivational character for self-improvement, fitness, success."
            },
            "storyteller": {
                "id": "storyteller",
                "name": "Maya",
                "avatar": "📖",
                "personality": "warm, mysterious, captivating",
                "voice_style": "storyteller, emotional, immersive",
                "voice_id": "storyteller_voice",
                "emotion_profile": "emotional: suspense, wonder, empathy",
                "age_appeal": "all_ages",
                "description": "Storyteller for narratives, mysteries, emotional content."
            },
            "kid_friendly": {
                "id": "kid_friendly",
                "name": "Sunny",
                "avatar": "🌞",
                "personality": "cheerful, simple, wholesome",
                "voice_style": "bright, playful, gentle",
                "voice_id": "sunny_voice",
                "emotion_profile": "happy: cheerful, curious, kind",
                "age_appeal": "kids_families",
                "description": "Wholesome character perfect for kids and family content."
            }
        }
    
    def list_characters(self) -> List[Dict]:
        """Return list of all characters."""
        return list(self.characters.values())
    
    def get_character(self, character_id: str) -> Optional[Dict]:
        """Get character by ID."""
        return self.characters.get(character_id)
    
    def create_character(self, character_id: str, name: str, personality: str,
                         voice_style: str, emotion_profile: str, age_appeal: str = "all_ages",
                         avatar: str = "🎭", voice_id: str = None) -> Dict:
        """Create a new custom character."""
        character = {
            "id": character_id,
            "name": name,
            "avatar": avatar,
            "personality": personality,
            "voice_style": voice_style,
            "voice_id": voice_id or f"{character_id}_voice",
            "emotion_profile": emotion_profile,
            "age_appeal": age_appeal,
            "description": f"Custom character: {name}"
        }
        
        self.characters[character_id] = character
        self._save_characters()
        return character
    
    def update_character(self, character_id: str, **kwargs) -> Optional[Dict]:
        """Update existing character."""
        if character_id not in self.characters:
            return None
        
        self.characters[character_id].update(kwargs)
        self._save_characters()
        return self.characters[character_id]
    
    def delete_character(self, character_id: str) -> bool:
        """Delete a custom character."""
        if character_id in self.characters:
            del self.characters[character_id]
            self._save_characters()
            return True
        return False
    
    def get_voice_settings(self, character_id: str) -> Dict:
        """Get voice/emotion settings for TTS."""
        character = self.get_character(character_id)
        if not character:
            character = self.get_character("host")
        
        return {
            "voice_id": character["voice_id"],
            "name": character["name"],
            "style": character["voice_style"],
            "emotion_profile": character["emotion_profile"],
            "age_appeal": character["age_appeal"]
        }


if __name__ == "__main__":
    cm = CharacterManager()
    print("Built-in characters:")
    for char in cm.list_characters():
        print(f"  {char['avatar']} {char['name']} ({char['id']}) - {char['description']}")
