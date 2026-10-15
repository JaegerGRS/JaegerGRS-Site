"""Runtime bootstrap for the app.

This keeps the app self-contained by auto-installing missing Python packages,
checking the required external tools (FFmpeg and Ollama), and selecting the best
available local model for the current machine.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
REQUIREMENTS_PATH = BASE_DIR / "requirements.txt"


def ensure_supported_python() -> bool:
    version = sys.version_info[:2]
    if version in [(3, 10), (3, 11)]:
        print(f"✅ Python {version[0]}.{version[1]} is supported for this app.")
        return True

    print("⚠️ This app requires Python 3.10 or 3.11 for the ML/TTS stack.")
    print(f"Current version: {sys.version.split()[0]}")
    print("Please install Python 3.11, then rerun the app.")
    return False


def run_command(command, description: str, capture_output: bool = False):
    print(f"\n🔧 {description}")
    print(f"   Running: {' '.join(command) if isinstance(command, list) else command}")
    result = subprocess.run(command, capture_output=capture_output, text=True)
    if result.returncode != 0:
        if capture_output:
            print(result.stdout)
            print(result.stderr)
        print(f"❌ Failed: {description}")
        return False
    print(f"✅ Completed: {description}")
    return True


def ensure_local_demo_folders() -> list[Path]:
    """Create the same repo-local folders used by the app and the demo workflow."""
    folders = [
        BASE_DIR / "assets",
        BASE_DIR / "assets" / "voices",
        BASE_DIR / "assets" / "music",
        BASE_DIR / "assets" / "broll",
        BASE_DIR / "output",
        BASE_DIR / "output" / "videos",
        BASE_DIR / "output" / "thumbnails",
        BASE_DIR / "db",
    ]
    for folder in folders:
        folder.mkdir(parents=True, exist_ok=True)
    return folders


def ensure_pip_dependencies() -> bool:
    if not REQUIREMENTS_PATH.exists():
        print("⚠️ requirements.txt not found; skipping dependency install.")
        return False

    ensure_local_demo_folders()

    env = os.environ.copy()
    env.setdefault("PIP_DISABLE_PIP_VERSION_CHECK", "1")

    if sys.executable:
        cmd = [sys.executable, "-m", "pip", "install", "-r", str(REQUIREMENTS_PATH)]
    else:
        cmd = ["pip", "install", "-r", str(REQUIREMENTS_PATH)]

    result = subprocess.run(cmd, capture_output=True, text=True, env=env)
    if result.returncode == 0:
        print("✅ Python dependencies installed successfully for this project folder.")
        return True

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)
    print("❌ Dependency install failed. The app will continue in demo mode without ML packages.")
    return False


def has_command(name: str) -> bool:
    return shutil.which(name) is not None


def ensure_ffmpeg() -> bool:
    if has_command("ffmpeg"):
        print("✅ FFmpeg found")
        return True

    print("⚠️ FFmpeg not found.")
    print("Install FFmpeg and add it to PATH to enable rendering and post-processing.")
    print("Windows: https://ffmpeg.org/download.html")
    print("Mac: brew install ffmpeg")
    print("Linux: sudo apt install ffmpeg")
    return False


def detect_best_ollama_model() -> str:
    """Prefer a modern model if available, with a safe fallback."""
    preferred = [
        "llama3.1",
        "llama3.2",
        "qwen2.5",
        "mistral",
        "llama2",
    ]

    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True, check=False)
        if result.returncode == 0:
            lines = result.stdout.strip().splitlines()
            if len(lines) > 1:
                model_names = []
                for line in lines[1:]:
                    parts = line.split()
                    if parts:
                        model_names.append(parts[0])
                for candidate in preferred:
                    if any(name.startswith(candidate) for name in model_names):
                        return candidate
    except Exception as exc:
        print(f"⚠️ Could not list Ollama models: {exc}")

    for candidate in preferred:
        if candidate in ["llama3.1", "llama3.2", "qwen2.5", "mistral", "llama2"]:
            return candidate
    return "llama2"


def ensure_ollama() -> bool:
    if not has_command("ollama"):
        print("⚠️ Ollama not found.")
        print("Install Ollama from: https://ollama.ai/download")
        return False

    try:
        result = subprocess.run(["ollama", "list"], capture_output=True, text=True, check=False)
        if result.returncode == 0:
            model = detect_best_ollama_model()
            print(f"✅ Ollama is available. Preferred model: {model}")
            return True
    except Exception as exc:
        print(f"⚠️ Could not verify Ollama readiness: {exc}")

    print("⚠️ Ollama is installed but is not ready yet.")
    print("The app will try to pull a local model when it starts.")
    return False


def ensure_ollama_model() -> str:
    model = detect_best_ollama_model()
    if not has_command("ollama"):
        return model

    try:
        subprocess.run(["ollama", "serve"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    except Exception as exc:
        print(f"⚠️ Could not start Ollama server: {exc}")

    try:
        list_result = subprocess.run(["ollama", "list"], capture_output=True, text=True, check=False)
        if list_result.returncode == 0 and model in list_result.stdout:
            print(f"✅ Model ready: {model}")
            return model
    except Exception as exc:
        print(f"⚠️ Could not list Ollama models: {exc}")

    print(f"📦 Pulling recommended local model: {model}...")
    pull = subprocess.run(["ollama", "pull", model], capture_output=True, text=True)
    if pull.returncode == 0:
        print(f"✅ Model pulled successfully: {model}")
        return model

    print("⚠️ Preferred model pull failed; falling back to llama2.")
    fallback = subprocess.run(["ollama", "pull", "llama2"], capture_output=True, text=True)
    if fallback.returncode == 0:
        return "llama2"
    return model


def ensure_runtime() -> dict:
    """Auto-bootstrap the app environment before startup."""
    print("============================================================")
    print(" 🔧 Checking runtime requirements for YouTube AI Creator")
    print("============================================================")

    ensure_local_demo_folders()

    if not ensure_supported_python():
        return {
            "dependencies": False,
            "ffmpeg": False,
            "ollama": False,
            "model": "llama2",
        }

    deps_ok = ensure_pip_dependencies()
    ffmpeg_ok = ensure_ffmpeg()
    ollama_ok = ensure_ollama()
    selected_model = ensure_ollama_model() if ollama_ok else detect_best_ollama_model()

    print("")
    print("============================================================")
    print(" Runtime check complete")
    print("============================================================")
    return {
        "dependencies": deps_ok,
        "ffmpeg": ffmpeg_ok,
        "ollama": ollama_ok,
        "model": selected_model,
    }


if __name__ == "__main__":
    ensure_runtime()
