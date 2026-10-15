@echo off
chcp 65001 >nul
cls
echo ============================================================
echo  📦 YouTube AI Video Creator - Portable Installer
echo ============================================================
echo.

set "APP_DIR=%~dp0"
cd /d "%APP_DIR%"

echo 📁 Installing in: %APP_DIR%

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found.
    echo.
    echo Please install Python 3.10 or 3.11 first:
    echo https://www.python.org/downloads/
    echo.
    echo Important: During installation, check "Add Python to PATH"
    pause
    exit /b 1
)

echo ✅ Python: 
python --version

python -c "import sys; raise SystemExit(0 if sys.version_info[:2] in [(3, 10), (3, 11)] else 1)" >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3.10 or 3.11 is required for this app's ML/TTS stack.
    pause
    exit /b 1
)

REM Upgrade pip
echo.
echo ⬆️  Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo.
echo 📦 Installing Python packages (this may take 5-10 minutes)...
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Installation failed.
    pause
    exit /b 1
)

REM Check/install FFmpeg
ffmpeg -version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  FFmpeg not found.
    echo Please download FFmpeg and add it to your PATH:
    echo https://ffmpeg.org/download.html
    echo.
    echo Or use this guide: https://www.wikihow.com/Install-FFmpeg-on-Windows
) else (
    echo ✅ FFmpeg found
)

REM Check/install Ollama
ollama --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  Ollama not found.
    echo Please download Ollama from: https://ollama.ai/download
    echo Then run this command: ollama pull llama2
) else (
    echo ✅ Ollama found
    echo 🤖 Downloading AI model (Llama 2)...
    ollama pull llama2
)

REM Create directories
echo.
echo 📁 Creating directories...
if not exist assets\voices mkdir assets\voices
if not exist assets\music mkdir assets\music
if not exist assets\broll mkdir assets\broll
if not exist output\videos mkdir output\videos
if not exist output\thumbnails mkdir output\thumbnails
if not exist db mkdir db

REM Create desktop shortcut
echo.
set /p CREATE_SHORTCUT="Create desktop shortcut? (y/n): "
if /i "%CREATE_SHORTCUT%"=="y" (
    powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\YouTube AI Creator.lnk'); $Shortcut.TargetPath = '%APP_DIR%start.bat'; $Shortcut.WorkingDirectory = '%APP_DIR%'; $Shortcut.IconLocation = '%SystemRoot%\System32\SHELL32.dll,14'; $Shortcut.Save()"
    echo ✅ Desktop shortcut created
)

echo.
echo ============================================================
echo  🎉 Installation complete!
echo ============================================================
echo.
echo To start the app, double-click: start.bat
echo Or run: python src\app.py
echo.
echo Open your browser: http://localhost:5000
echo.
pause
