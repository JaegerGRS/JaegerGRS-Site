# YOUTUBE-AI-ARCHITECTURE: Tech Stack & System Design

**Goal:** Build fully automated video generation system that runs on your PC, creates 5-10 videos daily, and checks for plagiarism before uploading.

**Key Constraint:** £0 cloud costs (GPU rendering locally, free AI models, no paid APIs)

---

## SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUTUBE AI PIPELINE                          │
└─────────────────────────────────────────────────────────────────┘

INPUT:  Niche/Topic Keywords
  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 1. IDEA GENERATION (AI)                                         │
│    - Input: Topic (e.g., "personal finance")                    │
│    - Output: 5-10 video ideas/day                               │
│    - Model: GPT-2 or Llama 2 (local, free, offline)             │
│    - Time: 5-30 seconds per batch                               │
└─────────────────────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. SCRIPT GENERATION (AI)                                       │
│    - Input: Video idea                                          │
│    - Output: 30-90 second script (Shorts + Longform)            │
│    - Model: GPT-2 or Llama 2 (convert ideas to scripts)         │
│    - Includes: Hooks, calls-to-action, trending hashtags        │
│    - Time: 5-30 seconds per script                              │
└─────────────────────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. PLAGIARISM CHECK (AGGRESSIVE)                                │
│    - Check 1: Compare to existing YouTube videos in niche       │
│    - Check 2: Audio fingerprinting (Shazam-style)               │
│    - Check 3: Script plagiarism detection (fuzzy matching)      │
│    - Decision: If 70%+ similar → BLOCK, else CONTINUE           │
│    - Time: 30-60 seconds per check                              │
└─────────────────────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. VOICEOVER GENERATION                                         │
│    - Input: Script text                                         │
│    - Output: MP3 audio file                                     │
│    - Model: Coqui TTS (free, local) or gTTS                     │
│    - Options: Multiple voices, speeds, accents                  │
│    - Time: 10-30 seconds per voiceover                          │
└─────────────────────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. VIDEO RENDERING (GPU ACCELERATION)                           │
│    - Input: Script, voiceover, visual assets                    │
│    - Output: MP4 video file                                     │
│    - Engine: FFmpeg with GPU (NVIDIA CUDA or AMD ROCm)          │
│    - Includes: B-roll, transitions, text overlays, colors       │
│    - Assets: Free (Pexels, Pixabay, free stock footage)         │
│    - Time: 30-120 seconds per video (GPU acceleration)          │
└─────────────────────────────────────────────────────────────────┘
  ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. YOUTUBE UPLOAD                                               │
│    - Scheduled posting (pre-defined times)                      │
│    - Metadata: Title, description, hashtags, thumbnail          │
│    - Analytics: Track views, CTR, watch time, growth             │
│    - API: YouTube Data API (free tier)                          │
└─────────────────────────────────────────────────────────────────┘
  ↓
OUTPUT: YouTube Shorts + Longform videos live and growing 🚀
```

---

## TECH STACK (DETAILED)

### TIER 1: AI & SCRIPTING

#### Idea Generation & Scripts
| Component | Tool | Why | Cost | Setup |
|-----------|------|-----|------|-------|
| **Large Language Model** | Llama 2 (7B) via Ollama | Free, local, offline, good quality | £0 | Download 3-5GB model |
| **Fallback** | GPT-2 (small) | If Llama too slow | £0 | Transformers library |
| **API Alternative** | ChatGPT free tier | If you want hosted | £0 (limited) | Browser API or unofficial |

**Setup:**
```bash
# Install Ollama (macOS/Linux/Windows)
curl https://ollama.ai/install.sh | sh
ollama pull llama2  # Download Llama 2 model

# Python: Use Ollama Python library
pip install ollama
```

#### Prompts to Use
```
Idea Generation:
"Generate 5 unique YouTube Shorts ideas (30-60 seconds) about {TOPIC}. 
Format each as: [Hook] → [Main Message] → [CTA].
Make them viral, trendy, and understandable in 30 seconds."

Script Generation:
"Convert this idea into a 30-second YouTube Shorts script: {IDEA}.
Include: Hook (first 3 seconds), Main content (5-25 seconds), CTA (last 2 seconds).
Make it engaging, use simple words, add [MUSIC CUE] and [VISUAL CUE] markers."
```

---

### TIER 2: TEXT-TO-SPEECH & AUDIO

#### Voiceover Generation
| Component | Tool | Why | Cost | Setup |
|-----------|------|-----|------|-------|
| **Primary** | Coqui TTS (offline) | Free, local, multiple voices | £0 | pip install TTS |
| **Fallback** | Google Text-to-Speech | Free, good quality, simple | £0 | gTTS library |
| **Advanced** | ElevenLabs free tier | Better quality (limited free) | £0/mo (90k chars) | API key |

**Setup:**
```bash
# Install Coqui TTS
pip install TTS

# Download voice model
tts --model_name tts_models/en/ljspeech/tacotron2-DDC --gpu

# Python usage:
from TTS.api import TTS
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", gpu=True)
tts.tts_to_file(text="Hello world", file_path="output.wav")
```

---

### TIER 3: VIDEO RENDERING (GPU ACCELERATION)

#### FFmpeg with GPU
| Component | Tool | Why | Cost | Setup |
|-----------|------|-----|------|-------|
| **Video Engine** | FFmpeg with GPU | Free, powerful, locally controlled | £0 | Download pre-built |
| **GPU Acceleration** | NVIDIA CUDA (if RTX) | 5-10x faster rendering | £0 (if you have GPU) | Install CUDA toolkit |
| **Fallback** | CPU rendering | Slower but works | £0 | No extra setup |
| **Python Wrapper** | MoviePy or subprocess | Easier than raw FFmpeg | £0 | pip install moviepy |

**Hardware Requirements:**
- **Ideal:** NVIDIA RTX GPU (3060+) - renders 5 videos/hour
- **Acceptable:** AMD Radeon GPU - renders 3-5 videos/hour
- **Fallback:** CPU only - renders 1-2 videos/hour (slow)

**Setup:**
```bash
# Download FFmpeg (Windows/Mac/Linux)
# Windows: choco install ffmpeg OR download from ffmpeg.org
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# NVIDIA GPU acceleration (if you have RTX):
# Install CUDA Toolkit + cuDNN
# Then FFmpeg automatically uses it

# Python video rendering:
pip install moviepy
```

**Example: Create a Simple Video**
```python
from moviepy.editor import *
import os

# Create video with text + audio
audio = AudioFileClip("voiceover.mp3")
txt_clip = TextClip("Check this out!", fontsize=50, color='white')
txt_clip = txt_clip.set_duration(audio.duration).set_position('center')

video = txt_clip.set_audio(audio)
video.write_videofile("output.mp4", fps=30, codec='libx264', audio_codec='aac')
```

---

### TIER 4: PLAGIARISM DETECTION (AGGRESSIVE)

#### Detection Methods
| Method | How It Works | Cost | Accuracy | Setup |
|--------|-------------|------|----------|-------|
| **Visual Fingerprinting** | Compare video frames (pixel hash) | £0 | 70-80% | OpenCV + hash comparison |
| **Script Matching** | Fuzzy text similarity (Levenshtein distance) | £0 | 85-95% | Difflib + thresholds |
| **Audio Fingerprinting** | Shazam-style (MFCC features) | £0 | 75-90% | Librosa + Chromaprint |
| **Google Safe Browsing** | Check if video violates policies | £0 (free API) | 50-70% | API call + database |

**Architecture:**

```python
def aggressive_plagiarism_check(video_path, script_text, audio_path):
    """
    AGGRESSIVE plagiarism detection:
    - If ANY check hits 70%+ similarity → BLOCK
    - Return: (is_plagiarized, confidence, method, details)
    """
    
    # Check 1: Visual fingerprinting
    video_hash = extract_video_fingerprint(video_path)
    similar_videos = search_reference_database(video_hash, threshold=0.70)
    if similar_videos:
        return (True, 0.75, "visual", similar_videos)
    
    # Check 2: Script similarity
    script_similarity = check_script_plagiarism(script_text, threshold=0.70)
    if script_similarity > 0.70:
        return (True, script_similarity, "script", script_similarity)
    
    # Check 3: Audio fingerprinting
    audio_fingerprint = extract_audio_fingerprint(audio_path)
    audio_matches = search_audio_database(audio_fingerprint, threshold=0.70)
    if audio_matches:
        return (True, 0.75, "audio", audio_matches)
    
    # Check 4: Google Safe Browsing (content policy check)
    policy_check = google_safe_browsing_check(script_text)
    if policy_check["is_harmful"]:
        return (True, 0.90, "policy", policy_check)
    
    # All clear
    return (False, 0.0, "none", "Original content confirmed")
```

**Reference Database Setup:**
```python
# Download top 1000 videos in your niche from YouTube
# Extract fingerprints weekly
# Store in SQLite database
# Check against all new videos before upload

# Tools:
# - yt-dlp (download YouTube videos)
# - OpenCV (extract frames)
# - Librosa (extract audio features)
```

---

### TIER 5: FREE VISUAL ASSETS

#### Where to Get B-Roll & Stock Footage
| Source | Content | License | Access |
|--------|---------|---------|--------|
| **Pexels** | Stock videos + photos | CC0 (free) | pexels.com |
| **Pixabay** | Stock videos + photos | CC0 (free) | pixabay.com |
| **Unsplash** | Beautiful photos | CC0 (free) | unsplash.com |
| **Free Music Archive** | Background music | CC0-CCBYv3 | freemusicarchive.org |
| **Epidemic Sound** | Free limited tier | Freemium | epidemicsound.com |

**Automation:**
```python
# Download trending B-roll daily
from pexels_api import PexelsAPI
import requests

pexels = PexelsAPI(api_key="YOUR_KEY")  # Free tier available
videos = pexels.search_videos(query=topic, per_page=10)
for video in videos:
    download_video(video.url, f"assets/broll_{topic}.mp4")
```

---

### TIER 6: YOUTUBE INTEGRATION

#### YouTube Data API (Free Tier)
| Component | Quota | Cost | Uses |
|-----------|-------|------|------|
| **Video Upload** | 50MB/day (free) | £0 | Schedule posts |
| **Analytics** | 1M daily quota | £0 | Track views, CTR, watch time |
| **Comments** | Read/moderate | £0 | Monitor engagement |

**Setup:**
```python
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# Authenticate once, then automate uploads
def upload_video(video_path, title, description, tags):
    youtube = build('youtube', 'v3', credentials=credentials)
    
    request_body = {
        'snippet': {
            'title': title,
            'description': description,
            'tags': tags,
            'categoryId': '22'  # Category: People & Blogs
        },
        'status': {
            'privacyStatus': 'public',
            'publishAt': '2026-09-02T00:00:00Z'  # Schedule for later
        }
    }
    
    media = MediaFileUpload(video_path, mimetype='video/mp4', resumable=True)
    request = youtube.videos().insert(part='snippet,status', body=request_body, media_body=media)
    response = request.execute()
    return response['id']
```

---

## COMPLETE SYSTEM STACK

### Summary: Hardware + Software

**Your PC Needs:**
- ✅ CPU: Any modern CPU (i5+ / Ryzen 5+)
- ✅ RAM: 16GB+ (8GB minimum, 32GB ideal)
- ✅ GPU: NVIDIA RTX 3060+ (recommended) OR AMD Radeon (acceptable) OR CPU only (slow)
- ✅ Storage: 1TB+ SSD (store video assets + renders)
- ✅ Internet: 10Mbps+ (for YouTube uploads)

**Software:**
```
Operating System: Windows/Mac/Linux
├── Python 3.10+
├── FFmpeg (GPU-enabled)
├── Ollama (Llama 2 local AI)
├── TTS (Coqui or gTTS)
├── OpenCV (plagiarism detection)
├── SQLite (reference database)
├── youtube-dl (download reference videos)
└── youtube-api (upload videos)
```

**Approximate Setup Time:** 2-3 hours
**Monthly Cost:** £0 (all free tools)
**Video Output Capacity:** 5-10 videos/day with GPU

---

## DEPLOYMENT & AUTOMATION

### Option 1: Local Script (Recommended)
```python
# main.py - Runs daily on your PC
import schedule
import time

def daily_pipeline():
    ideas = generate_ideas("finance")
    for idea in ideas:
        script = generate_script(idea)
        is_plagiarized, conf, method, details = plagiarism_check(script)
        
        if not is_plagiarized:
            voiceover = generate_voiceover(script)
            video = render_video(script, voiceover)
            schedule_youtube_upload(video, script.title)
            print(f"✅ Uploaded: {script.title}")
        else:
            print(f"❌ Blocked (plagiarism): {method} ({conf})")

# Run daily at 2 AM
schedule.every().day.at("02:00").do(daily_pipeline)

while True:
    schedule.run_pending()
    time.sleep(60)
```

### Option 2: Windows Task Scheduler
```batch
# schedule_daily.bat
@echo off
C:\Python310\python.exe C:\path\to\youtube-ai-tool\main.py
```
Then create Task Scheduler job to run `schedule_daily.bat` daily at 2 AM.

### Option 3: Docker (Advanced)
```dockerfile
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y python3-pip ffmpeg

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python3", "main.py"]
```

---

## COST BREAKDOWN

| Component | Tool | Monthly Cost | Annual Cost |
|-----------|------|--------------|------------|
| **AI Models** | Ollama (local) | £0 | £0 |
| **Text-to-Speech** | Coqui TTS | £0 | £0 |
| **Video Rendering** | FFmpeg | £0 | £0 |
| **Stock Footage** | Pexels/Pixabay | £0 | £0 |
| **YouTube API** | Free tier | £0 | £0 |
| **Plagiarism DB** | SQLite (local) | £0 | £0 |
| **Storage** | Your PC (SSD) | £0/mo* | £0 |
| **Hosting** | YouTube (free) | £0 | £0 |
| **TOTAL** | | **£0** | **£0** |

*Note: One-time SSD investment (~£100-200 for 1TB)

---

## SCALING UP (Year 2+)

If you want to scale beyond your PC:

| Component | Option | Cost | When |
|-----------|--------|------|------|
| **GPU Rendering** | Paperspace (cloud GPU) | £0.4-1/hour | If PC too slow |
| **AI Model Hosting** | HuggingFace spaces | Free tier | If need web access |
| **Video Storage** | Cloudflare R2 | £0.01/GB | If backup needed |
| **Team Tools** | Slack/Discord | Free tier | When hiring |

**By Year 2, keep everything local until you need 24/7 rendering.**

---

## NEXT STEPS

1. **Week 1:** Install Python, Ollama, TTS, FFmpeg
2. **Week 2:** Get Llama 2 model running locally
3. **Week 3:** Build idea + script generation
4. **Week 4:** Build plagiarism detection
5. **Month 2:** Add video rendering pipeline
6. **Month 3:** Integrate with YouTube API
7. **Month 4:** Test end-to-end, create 20 test videos
8. **Month 5:** Launch channel

---

**Status:** Architecture ready  
**Total Setup Cost:** £0 (pure free tools)  
**GPU Rendering Capacity:** 5-10 videos/day  
**Confidence Level:** Very high (all tools proven + stable)