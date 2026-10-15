@echo off
chcp 65001 >nul
cls
echo ============================================================
echo  🎬 YouTube AI Video Creator - Portable Launcher
echo ============================================================
echo.

REM Get the directory where this script is located
set "APP_DIR=%~dp0"
cd /d "%APP_DIR%"

echo 📁 App location: %APP_DIR%

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found in PATH.
    echo Please install Python 3.10 or 3.11 from https://python.org
    echo Or run install-portable.bat first.
    pause
    exit /b 1
)

python -c "import sys; raise SystemExit(0 if sys.version_info[:2] in [(3, 10), (3, 11)] else 1)" >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3.10 or 3.11 is required for this app's ML/TTS stack.
    pause
    exit /b 1
)

echo ✅ Python found

echo 📦 Bootstrapping app dependencies and local AI runtime...
python -c "from src.bootstrap import ensure_runtime; ensure_runtime()" 
if errorlevel 1 (
    echo ❌ App bootstrap failed.
    pause
    exit /b 1
)

echo ✅ App environment ready

REM Start the web app
echo.
echo 🚀 Starting YouTube AI Creator...
echo Open your browser: http://localhost:5000
echo.
echo Press CTRL+C to stop.
echo.

python src\app.py

pause
