"""
YouTube AI Video Creator - Configuration
"""
import os
from pathlib import Path

# Base paths
BASE_DIR = Path(__file__).parent.parent
SRC_DIR = BASE_DIR / "src"
ASSETS_DIR = BASE_DIR / "assets"
OUTPUT_DIR = BASE_DIR / "output"
DB_DIR = BASE_DIR / "db"

# Subdirectories
VOICES_DIR = ASSETS_DIR / "voices"
MUSIC_DIR = ASSETS_DIR / "music"
BROLL_DIR = ASSETS_DIR / "broll"
VIDEO_OUTPUT_DIR = OUTPUT_DIR / "videos"
THUMBNAIL_OUTPUT_DIR = OUTPUT_DIR / "thumbnails"

# Ensure directories exist
for directory in [VOICES_DIR, MUSIC_DIR, BROLL_DIR, VIDEO_OUTPUT_DIR, THUMBNAIL_OUTPUT_DIR, DB_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Database
DATABASE_PATH = DB_DIR / "youtube_ai.db"

# AI Configuration
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama2")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

# Video Configuration
VIDEO_WIDTH = 1080
VIDEO_HEIGHT = 1920  # Vertical for Shorts
VIDEO_FPS = 30
SHORTS_DURATION = 60  # seconds max
LONGFORM_WIDTH = 1920
LONGFORM_HEIGHT = 1080

# Voice Configuration
DEFAULT_LANGUAGE = "en"
TTS_MODEL = os.getenv("TTS_MODEL", "tts_models/multilingual/multi-dataset/xtts_v2")

# Plagiarism thresholds
VISUAL_PLAGIARISM_THRESHOLD = 0.70
SCRIPT_PLAGIARISM_THRESHOLD = 0.85
AUDIO_PLAGIARISM_THRESHOLD = 0.75

# Age-appropriate content
AGE_RATING = "ALL_AGES"  # Filters out adult/violent content

# YouTube
YOUTUBE_UPLOAD_ENABLED = os.getenv("YOUTUBE_UPLOAD_ENABLED", "false").lower() == "true"
YOUTUBE_CLIENT_SECRETS = BASE_DIR / "client_secrets.json"
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

# Trend research
# Google has no general public Google Trends API. SerpApi is one supported
# provider for Google Trends results and can be replaced later if required.
GOOGLE_TRENDS_PROVIDER = os.getenv("GOOGLE_TRENDS_PROVIDER", "")
SERPAPI_KEY = os.getenv("SERPAPI_KEY", "")
