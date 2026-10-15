#!/bin/bash
# YouTube AI Video Creator - Portable Launcher (Mac/Linux)

clear
echo "============================================================"
echo " 🎬 YouTube AI Video Creator - Portable Launcher"
echo "============================================================"
echo ""

# Get the directory where this script is located
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$APP_DIR" || exit 1

echo "📁 App location: $APP_DIR"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found."
    echo "Please install Python 3.10 or 3.11 from https://python.org"
    echo "Or run ./install-portable.sh first."
    exit 1
fi

if ! python3 -c "import sys; raise SystemExit(0 if sys.version_info[:2] in [(3, 10), (3, 11)] else 1)"; then
    echo "❌ Python 3.10 or 3.11 is required for this app's ML/TTS stack."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"

echo "📦 Bootstrapping app dependencies and local AI runtime..."
python3 -c "from src.bootstrap import ensure_runtime; ensure_runtime()"
if [ $? -ne 0 ]; then
    echo "❌ App bootstrap failed."
    exit 1
fi

echo "✅ App environment ready"

# Start the web app
echo ""
echo "🚀 Starting YouTube AI Creator..."
echo "Open your browser: http://localhost:5000"
echo ""
echo "Press CTRL+C to stop."
echo ""

python3 src/app.py
