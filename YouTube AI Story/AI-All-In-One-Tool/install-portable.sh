#!/bin/bash
# YouTube AI Video Creator - Portable Installer (Mac/Linux)

clear
echo "============================================================"
echo " 📦 YouTube AI Video Creator - Portable Installer"
echo "============================================================"
echo ""

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR" || exit 1

echo "📁 Installing in: $APP_DIR"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found."
    echo "Please install Python 3.10 or 3.11 first:"
    echo "https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python: $(python3 --version)"

if ! python3 -c "import sys; raise SystemExit(0 if sys.version_info[:2] in [(3, 10), (3, 11)] else 1)"; then
    echo "❌ Python 3.10 or 3.11 is required for this app's ML/TTS stack."
    exit 1
fi

# Upgrade pip
echo ""
echo "⬆️  Upgrading pip..."
python3 -m pip install --upgrade pip

# Install requirements
echo ""
echo "📦 Installing Python packages (this may take 5-10 minutes)..."
python3 -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Installation failed."
    exit 1
fi

# Check/install FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo ""
    echo "⚠️  FFmpeg not found."
    echo "Please install FFmpeg:"
    echo "  Mac: brew install ffmpeg"
    echo "  Linux: sudo apt install ffmpeg"
else
    echo "✅ FFmpeg found"
fi

# Check/install Ollama
if ! command -v ollama &> /dev/null; then
    echo ""
    echo "⚠️  Ollama not found."
    echo "Please download Ollama from: https://ollama.ai/download"
    echo "Then run: ollama pull llama2"
else
    echo "✅ Ollama found"
    echo "🤖 Downloading AI model (Llama 2)..."
    ollama pull llama2
fi

# Create directories
echo ""
echo "📁 Creating directories..."
mkdir -p assets/voices assets/music assets/broll output/videos output/thumbnails db

# Make scripts executable
echo ""
echo "🔧 Making scripts executable..."
chmod +x start.sh install-portable.sh

echo ""
echo "============================================================"
echo " 🎉 Installation complete!"
echo "============================================================"
echo ""
echo "To start the app, run: ./start.sh"
echo "Or run: python3 src/app.py"
echo ""
echo "Open your browser: http://localhost:5000"
echo ""
