#!/usr/bin/env python3
"""
Setup script for YouTube AI Video Creator
"""
import subprocess
import sys
from pathlib import Path


def run_command(command, description):
    """Run a shell command and show status."""
    print(f"\n🔧 {description}")
    print(f"   Running: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"❌ Failed: {description}")
        return False
    print(f"✅ Completed: {description}")
    return True


def main():
    print("=" * 60)
    print("🎬 YouTube AI Video Creator - Setup")
    print("=" * 60)
    
    # Check Python version
    if sys.version_info[:2] not in [(3, 10), (3, 11)]:
        print("❌ This app requires Python 3.10 or 3.11 for the ML/TTS stack.")
        print(f"Current version: {sys.version.split()[0]}")
        print("Please install Python 3.11 and rerun setup.")
        return
    
    print(f"✅ Python {sys.version}")
    
    # Install Python dependencies
    if not run_command("pip install -r requirements.txt", "Installing Python packages"):
        return
    
    # Install FFmpeg if not present
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        print("✅ FFmpeg already installed")
    except:
        print("⚠️ FFmpeg not found. Please install FFmpeg manually:")
        print("   Windows: https://ffmpeg.org/download.html (add to PATH)")
        print("   Mac: brew install ffmpeg")
        print("   Linux: sudo apt install ffmpeg")
    
    # Install Ollama if not present
    try:
        subprocess.run(["ollama", "--version"], capture_output=True, check=True)
        print("✅ Ollama already installed")
    except:
        print("⚠️ Ollama not found. Please install Ollama:")
        print("   https://ollama.ai/download")
    
    # Pull Llama 2 model
    print("\n🤖 Pulling Llama 2 model (this may take a few minutes)...")
    run_command("ollama pull llama2", "Downloading AI model")
    
    # Create directories
    print("\n📁 Creating directories...")
    dirs = [
        "assets/voices", "assets/music", "assets/broll",
        "output/videos", "output/thumbnails", "db"
    ]
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
    print("✅ Directories ready")
    
    print("\n" + "=" * 60)
    print("🎉 Setup complete!")
    print("=" * 60)
    print("\nTo start the app:")
    print("   python src/app.py")
    print("\nThen open your browser: http://localhost:5000")


if __name__ == "__main__":
    main()
