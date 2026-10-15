"""
Flask Web Dashboard - Clean UI for creating AI videos
"""
import os
import sys
from pathlib import Path
from typing import Optional, TYPE_CHECKING

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from flask import Flask, render_template, request, jsonify, send_file

from src.modules.character_manager import CharacterManager
from src.modules.trend_research import TrendResearch

if TYPE_CHECKING:
    from src.pipeline import YouTubeAIPipeline

app = Flask(__name__, 
            template_folder='templates',
            static_folder='static')

# The pipeline loads models and renderer dependencies only for an explicit
# video-generation request, keeping the app lightweight while idle.
pipeline: Optional['YouTubeAIPipeline'] = None
character_manager = CharacterManager()
trend_research = TrendResearch()


def get_pipeline() -> 'YouTubeAIPipeline':
    """Initialize the heavy local video pipeline only when it is needed."""
    global pipeline
    if pipeline is None:
        from src.bootstrap import ensure_runtime
        from src.pipeline import YouTubeAIPipeline
        runtime = ensure_runtime()
        if not runtime['dependencies']:
            raise RuntimeError('Video dependencies are not ready. Run setup with Python 3.10 or 3.11.')
        pipeline = YouTubeAIPipeline()
    return pipeline


@app.route('/')
def dashboard():
    """Main dashboard page."""
    stats = idle_stats()
    characters = character_manager.list_characters()
    return render_template('dashboard.html', stats=stats, characters=characters)


@app.route('/api/stats')
def api_stats():
    """Get current system stats."""
    if pipeline is None:
        return jsonify(idle_stats())
    return jsonify(get_pipeline().get_stats() | {'pipeline_ready': True})


def idle_stats() -> dict:
    """Dashboard values available without loading video or ML dependencies."""
    return {
        'characters': len(character_manager.list_characters()),
        'pipeline_ready': False,
        'gpu_available': False,
        'cpu_cores': 'Idle',
        'ram_gb': 'Idle',
        'visual_references': 0,
        'script_references': 0,
        'audio_references': 0,
    }


@app.route('/api/characters')
def api_characters():
    """Get all characters."""
    return jsonify(character_manager.list_characters())


@app.route('/api/characters', methods=['POST'])
def api_create_character():
    """Create new character."""
    data = request.json
    character = character_manager.create_character(
        character_id=data.get('id'),
        name=data.get('name'),
        personality=data.get('personality'),
        voice_style=data.get('voice_style'),
        emotion_profile=data.get('emotion_profile'),
        age_appeal=data.get('age_appeal', 'all_ages'),
        avatar=data.get('avatar', '🎭')
    )
    return jsonify(character)


@app.route('/api/research')
def api_research():
    """Research YouTube and Google Trends signals for a proposed topic."""
    query = request.args.get('query', '').strip()
    region = request.args.get('region', 'GB').strip()
    youtube_api_key = request.headers.get('X-YouTube-Api-Key', '').strip()

    if not query:
        return jsonify({'error': 'A topic is required.'}), 400

    try:
        return jsonify(trend_research.get_research(query, region, youtube_api_key))
    except ValueError as error:
        return jsonify({'error': str(error)}), 400


@app.route('/api/create-video', methods=['POST'])
def api_create_video():
    """Create a new video."""
    data = request.json

    try:
        result = get_pipeline().create_video(
            niche=data.get('niche', 'interesting facts'),
            character_id=data.get('character_id', 'host'),
            format_type=data.get('format_type', 'shorts'),
            duration=int(data.get('duration', 45)),
            count=int(data.get('count', 1))
        )
    except RuntimeError as error:
        return jsonify({'error': str(error)}), 503
    
    return jsonify(result)


@app.route('/api/videos')
def api_videos():
    """List created videos."""
    from src.config import VIDEO_OUTPUT_DIR
    videos = []
    
    if VIDEO_OUTPUT_DIR.exists():
        for video_file in VIDEO_OUTPUT_DIR.glob('*.mp4'):
            videos.append({
                'name': video_file.name,
                'path': str(video_file),
                'size_mb': round(video_file.stat().st_size / (1024 * 1024), 2)
            })
    
    return jsonify(videos)


if __name__ == '__main__':
    print("🌐 Starting YouTube AI Dashboard...")
    print("Open your browser: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False, threaded=True)
