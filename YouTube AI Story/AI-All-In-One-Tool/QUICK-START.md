# How to Run

## Quick Start (Windows)

### 1. Install Python 3.10 or 3.11
The local ML/TTS stack does not support Python 3.12. Install Python 3.10 or 3.11 and ensure it is on PATH.

### 2. Install Dependencies
```bash
python setup.py
```

Or manually:
```bash
pip install -r requirements.txt
```

### 3. Install Ollama + AI Model
Download Ollama from https://ollama.ai/download

Then run:
```bash
ollama pull llama2
```

### 4. Install FFmpeg
Download from https://ffmpeg.org/download.html and add to PATH.

### 5. Start the App
```bash
python src/app.py
```

### 6. Open Browser
Go to: http://localhost:5000

---

## Features

- ✅ Web dashboard (clean UI)
- ✅ AI idea + script generation (local Llama 2)
- ✅ Emotional human-like voices (XTTS v2)
- ✅ Custom characters (including brainrot character)
- ✅ GPU + CPU + RAM rendering (uses all hardware)
- ✅ Vertical Shorts + horizontal Longform
- ✅ Aggressive plagiarism detection
- ✅ Auto thumbnails
- ✅ Age-appropriate content filtering

---

## Troubleshooting

### "Ollama not found"
- Install Ollama and make sure it's running
- Check: `ollama --version`

### "FFmpeg not found"
- Download FFmpeg and add `bin` folder to PATH
- Restart terminal

### "No GPU detected"
- Tool works on CPU too (slower)
- Install NVIDIA/AMD drivers for GPU acceleration

### "XTTS model too big"
- The tool falls back to gTTS automatically
- Or manually: use a smaller TTS model
