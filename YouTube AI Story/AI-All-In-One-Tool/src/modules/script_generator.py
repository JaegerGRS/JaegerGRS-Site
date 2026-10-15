"""
Script Generator - Converts ideas into human-like video scripts with emotion markers
"""
import json
import re
from typing import Dict, List

try:
    import ollama
except ImportError:
    ollama = None

from src.config import OLLAMA_MODEL


class ScriptGenerator:
    def __init__(self, model: str = OLLAMA_MODEL):
        self.model = model
    
    def generate_script(self, idea: Dict, character: Dict = None, 
                        duration: int = 45, format_type: str = "shorts") -> Dict:
        """Generate a complete script with emotion markers and scene directions."""
        
        char_name = character.get('name', 'Host') if character else 'Host'
        char_personality = character.get('personality', 'friendly and energetic') if character else 'friendly and energetic'
        char_voice = character.get('voice_style', 'natural conversational') if character else 'natural conversational'
        
        prompt = f"""You are an expert YouTube scriptwriter. Write a {duration}-second YouTube {format_type} script based on this idea:

TITLE: {idea.get('title')}
HOOK: {idea.get('hook')}
CONCEPT: {idea.get('concept')}
EMOTION: {idea.get('emotion', 'excitement')}

Host Character:
- Name: {char_name}
- Personality: {char_personality}
- Voice style: {char_voice}

Requirements:
- Must be 100% original (do NOT copy any existing video)
- Sound natural and human, not robotic
- Use conversational language, contractions, and casual phrases
- Include emotional beats and voice direction
- Add [PAUSE], [EXCITED], [WHISPER], [SUSPENSE], [HAPPY], [SERIOUS] markers
- Add [VISUAL: description] markers for B-roll
- End with a strong call-to-action
- Keep it family-friendly and age-appropriate
- Optimize for retention: hook in first 3 seconds, cliffhangers throughout

Return ONLY valid JSON with this exact structure:
{{
  "title": "exact video title",
  "duration_seconds": {duration},
  "format": "{format_type}",
  "target_audience": "all_ages",
  "scenes": [
    {{
      "scene_number": 1,
      "start_time": 0.0,
      "end_time": 5.0,
      "visual": "what appears on screen",
      "dialogue": "what the host says",
      "voice_direction": "excited whisper",
      "emotion": "excitement",
      "broll_keyword": "search term for B-roll"
    }}
  ],
  "full_script": "complete script text",
  "hashtags": ["tag1", "tag2", "tag3"],
  "cta": "subscribe/follow call to action"
}}

JSON:"""

        try:
            response = ollama.chat(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response['message']['content']
            content = self._extract_json(content)
            script = json.loads(content)
            return self._validate_script(script, idea, duration)
            
        except Exception as e:
            print(f"⚠️ Script generation failed: {e}")
            return self._fallback_script(idea, character, duration)
    
    def _extract_json(self, text: str) -> str:
        """Extract JSON from text response."""
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return text[start:end+1]
        return text
    
    def _validate_script(self, script: Dict, idea: Dict, duration: int) -> Dict:
        """Ensure script has all required fields."""
        required = ['title', 'scenes', 'full_script', 'hashtags', 'cta']
        for key in required:
            if key not in script:
                script[key] = idea.get(key, '') if key != 'scenes' else []
        
        script['duration_seconds'] = duration
        script['format'] = script.get('format', 'shorts')
        script['source_idea'] = idea
        
        # Clean dialogue for voiceover
        script['voiceover_text'] = self._clean_for_voiceover(script['full_script'])
        
        return script
    
    def _clean_for_voiceover(self, text: str) -> str:
        """Remove visual markers but keep emotion markers for voice."""
        # Remove [VISUAL: ...] markers
        text = re.sub(r'\[VISUAL:[^\]]*\]', '', text)
        # Keep emotion markers (TTS will use them)
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def _fallback_script(self, idea: Dict, character: Dict, duration: int) -> Dict:
        """Fallback script if AI fails."""
        char_name = character.get('name', 'Host') if character else 'Host'
        
        return {
            "title": idea.get('title', 'Amazing Video'),
            "duration_seconds": duration,
            "format": "shorts",
            "target_audience": "all_ages",
            "scenes": [
                {
                    "scene_number": 1,
                    "start_time": 0,
                    "end_time": 3,
                    "visual": "host close-up with eye-catching background",
                    "dialogue": idea.get('hook', 'Wait until you see this!'),
                    "voice_direction": "excited",
                    "emotion": "excitement",
                    "broll_keyword": "excited person"
                },
                {
                    "scene_number": 2,
                    "start_time": 3,
                    "end_time": duration - 3,
                    "visual": "B-roll demonstrating the concept",
                    "dialogue": idea.get('concept', 'Here is something amazing you need to know.'),
                    "voice_direction": "conversational",
                    "emotion": "curiosity",
                    "broll_keyword": idea.get('niche', 'tutorial')
                },
                {
                    "scene_number": 3,
                    "start_time": duration - 3,
                    "end_time": duration,
                    "visual": "host pointing to subscribe button",
                    "dialogue": "Like and subscribe for more!",
                    "voice_direction": "happy",
                    "emotion": "happiness",
                    "broll_keyword": "subscribe"
                }
            ],
            "full_script": f"{idea.get('hook')} {idea.get('concept')} Like and subscribe for more!",
            "voiceover_text": f"{idea.get('hook')} {idea.get('concept')} Like and subscribe for more!",
            "hashtags": ["viral", "shorts", "trending"],
            "cta": "Like and subscribe for more amazing content!",
            "source_idea": idea
        }


if __name__ == "__main__":
    from src.modules.idea_generator import IdeaGenerator
    
    idea_gen = IdeaGenerator()
    ideas = idea_gen.generate_ideas("brainrot", count=1)
    
    character = {
        "name": "Brot",
        "personality": "chaotic, funny, Gen-Z brainrot character",
        "voice_style": "high energy, meme-style, exaggerated"
    }
    
    script_gen = ScriptGenerator()
    script = script_gen.generate_script(ideas[0], character, duration=45)
    print(json.dumps(script, indent=2))
