"""
AI Idea Generator - Creates unique video ideas for any niche/audience
"""
import json
import random
from typing import List, Dict

try:
    import ollama
except ImportError:
    ollama = None

from src.config import OLLAMA_MODEL, OLLAMA_HOST


class IdeaGenerator:
    def __init__(self, model: str = OLLAMA_MODEL, host: str = OLLAMA_HOST):
        self.model = model
        self.host = host
        
    def generate_ideas(self, niche: str, count: int = 5, audience: str = "all_ages",
                       style: str = "entertaining") -> List[Dict]:
        """Generate viral video ideas for any niche."""
        
        prompt = f"""You are a YouTube content strategist. Generate {count} unique, original, and engaging YouTube Shorts ideas for the niche: {niche}.

Requirements:
- Audience: {audience} (must be appropriate for all age ranges)
- Style: {style}
- Each idea must be original (inspired by trends but NOT copied)
- Each idea should be 30-60 seconds long
- Include a strong hook in the first 3 seconds
- Must be safe, family-friendly, and suitable for monetization

Return ONLY a valid JSON array. Each object must have these exact keys:
- title: catchy video title
- hook: first 3-second grabber
- concept: 2-3 sentence description
- format: video format (e.g., "list", "story", "tutorial", "reaction")
- target_audience: age range this appeals to
- emotion: primary emotion (curiosity, excitement, shock, happiness, motivation)
- trending_angle: why this works right now

JSON:"""

        try:
            response = ollama.chat(
                model=self.model,
                messages=[{"role": "user", "content": prompt}]
            )
            content = response['message']['content']
            
            # Extract JSON from response
            content = self._extract_json(content)
            ideas = json.loads(content)
            
            # Add metadata
            for idea in ideas:
                idea['niche'] = niche
                idea['status'] = 'pending'
                
            return ideas
            
        except Exception as e:
            print(f"⚠️ AI generation failed: {e}")
            return self._fallback_ideas(niche, count, audience)
    
    def _extract_json(self, text: str) -> str:
        """Extract JSON from text response."""
        # Try to find JSON between brackets
        start = text.find('[')
        end = text.rfind(']')
        if start != -1 and end != -1:
            return text[start:end+1]
        return text
    
    def _fallback_ideas(self, niche: str, count: int, audience: str) -> List[Dict]:
        """Fallback ideas if AI fails."""
        templates = [
            {
                "title": f"3 {niche} Tricks That Actually Work",
                "hook": "Stop doing this wrong!",
                "concept": f"Show 3 practical {niche} tips with quick demonstrations.",
                "format": "list",
                "target_audience": audience,
                "emotion": "curiosity",
                "trending_angle": "List format gets high completion rate"
            },
            {
                "title": f"I Tried {niche} for 30 Days (Results)",
                "hook": "Day 1 vs Day 30 will shock you",
                "concept": f"Document a transformation journey related to {niche}.",
                "format": "story",
                "target_audience": audience,
                "emotion": "motivation",
                "trending_angle": "Transformation content performs well"
            },
            {
                "title": f"{niche} Myths Everyone Believes",
                "hook": "Everything you know is wrong",
                "concept": f"Debunk 3 common myths about {niche}.",
                "format": "educational",
                "target_audience": audience,
                "emotion": "shock",
                "trending_angle": "Myth-busting drives engagement"
            }
        ]
        return templates[:count]


if __name__ == "__main__":
    generator = IdeaGenerator()
    ideas = generator.generate_ideas("personal finance", count=3)
    print(json.dumps(ideas, indent=2))
