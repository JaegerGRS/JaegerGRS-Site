# YouTube AI Video Creator - Project Structure

```
youtube-ai-creator/
│
├── README.md                           # Project overview
├── INDEX.md                            # Master navigation & roadmap
├── requirements.txt                    # Python dependencies
├── setup.py                            # One-click setup script
│
├── YOUTUBE-AI-ROADMAP.md               # 3-year plan to £100k+/month
├── YOUTUBE-AI-ARCHITECTURE.md          # Tech stack & system design
├── PLAGIARISM-DETECTION-SYSTEM.md      # Aggressive originality checker
├── CONTENT-STRATEGY.md                 # Niche/growth strategy
├── FOLDER-STRUCTURE.md                 # This file
│
├── src/                                # Main application code
│   ├── app.py                          # Flask web dashboard
│   ├── config.py                       # Configuration & paths
│   ├── pipeline.py                     # Main video creation pipeline
│   │
│   ├── modules/                        # Core modules
│   │   ├── idea_generator.py           # AI idea generation
│   │   ├── script_generator.py         # AI script writing
│   │   ├── character_manager.py        # Character/voice manager
│   │   ├── voice_engine.py             # Emotional TTS (XTTS/gTTS)
│   │   ├── video_renderer.py           # GPU/CPU video renderer
│   │   └── plagiarism_detector.py      # Multi-layer plagiarism check
│   │
│   ├── templates/                      # Web UI templates
│   │   └── dashboard.html              # Main dashboard
│   └── static/                         # CSS/JS assets (future)
│
├── assets/                             # Media assets
│   ├── voices/                         # Voice samples & cloned voices
│   ├── music/                          # Background music
│   └── broll/                          # Stock footage / B-roll
│
├── output/                             # Generated content
│   ├── videos/                         # Rendered MP4 videos
│   └── thumbnails/                     # Generated thumbnails
│
├── db/                                 # Local databases
│   ├── youtube_ai.db                   # SQLite metadata
│   ├── visual_fingerprints.pkl         # Plagiarism visual DB
│   ├── script_fingerprints.pkl         # Plagiarism script DB
│   ├── audio_fingerprints.pkl          # Plagiarism audio DB
│   └── plagiarism_audit.jsonl          # Audit log
│
├── tests/                              # Unit tests
│   └── (test files)
│
└── ARCHIVE_PROPOSAL_BUILDER/           # Old Proposal Builder docs
    └── (archived files)
```

## Key Files Explained

### Core Application
- **[src/app.py](src/app.py)** - Web dashboard (Flask)
- **[src/pipeline.py](src/pipeline.py)** - Orchestrates video creation
- **[src/config.py](src/config.py)** - Central config

### AI Modules
- **[src/modules/idea_generator.py](src/modules/idea_generator.py)** - Creates video ideas
- **[src/modules/script_generator.py](src/modules/script_generator.py)** - Writes scripts
- **[src/modules/character_manager.py](src/modules/character_manager.py)** - Manages characters
- **[src/modules/voice_engine.py](src/modules/voice_engine.py)** - Human-like emotional voices
- **[src/modules/video_renderer.py](src/modules/video_renderer.py)** - GPU/CPU rendering
- **[src/modules/plagiarism_detector.py](src/modules/plagiarism_detector.py)** - Originality checks

### Documentation
- **[YOUTUBE-AI-ROADMAP.md](YOUTUBE-AI-ROADMAP.md)** - 3-year execution plan
- **[YOUTUBE-AI-ARCHITECTURE.md](YOUTUBE-AI-ARCHITECTURE.md)** - Technical architecture
- **[PLAGIARISM-DETECTION-SYSTEM.md](PLAGIARISM-DETECTION-SYSTEM.md)** - Plagiarism rules
- **[CONTENT-STRATEGY.md](CONTENT-STRATEGY.md)** - Channel growth plan

## Workflow

1. **Setup** - Run `python setup.py`
2. **Start** - Run `python src/app.py`
3. **Open browser** - Go to `http://localhost:5000`
4. **Create** - Choose character, enter topic, click create
5. **Review** - Check rendered videos in `output/videos/`
6. **Upload** - Upload to YouTube (manual or API)

## Output Structure

```
output/videos/
├── Top_5_Money_Hacks_1234.mp4
├── Amazing_Animal_Facts_5678.mp4
└── ...

output/thumbnails/
├── Top_5_Money_Hacks_1234_thumb.jpg
├── Amazing_Animal_Facts_5678_thumb.jpg
└── ...
```

## Adding Content

### New Characters
- Edit `assets/voices/characters.json`
- Or use the web dashboard API

### New Music
- Add MP3 files to `assets/music/`
- Renderer picks randomly

### New B-Roll
- Add MP4/JPG files to `assets/broll/`
- Categorized by topic subfolders

## Scaling Up

As your channel grows:
1. Add more reference videos to plagiarism DB
2. Create more characters for different content types
3. Build B-roll library by topic
4. Add music library for different moods
5. Consider cloud GPU if local rendering bottleneck
