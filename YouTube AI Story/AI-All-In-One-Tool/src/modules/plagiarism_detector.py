"""
Plagiarism Detector - Aggressive multi-layer originality checker
"""
import json
import pickle
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional

from difflib import SequenceMatcher
from fuzzywuzzy import fuzz
import imagehash
from PIL import Image

try:
    import cv2
except ImportError:
    cv2 = None

try:
    import librosa
    HAS_LIBROSA = True
except ImportError:
    HAS_LIBROSA = False

from src.config import (
    VISUAL_PLAGIARISM_THRESHOLD,
    SCRIPT_PLAGIARISM_THRESHOLD,
    AUDIO_PLAGIARISM_THRESHOLD,
    DB_DIR
)


class PlagiarismDetector:
    """
    AGGRESSIVE plagiarism detection system.
    Rule: Ideas/concepts OK. Exact copies of videos/scripts/audio BLOCKED.
    """
    
    def __init__(self, db_dir: Path = DB_DIR):
        self.db_dir = db_dir
        self.db_dir.mkdir(parents=True, exist_ok=True)
        
        self.visual_db_path = db_dir / "visual_fingerprints.pkl"
        self.script_db_path = db_dir / "script_fingerprints.pkl"
        self.audio_db_path = db_dir / "audio_fingerprints.pkl"
        self.audit_log_path = db_dir / "plagiarism_audit.jsonl"
        
        self.visual_db = self._load_db(self.visual_db_path)
        self.script_db = self._load_db(self.script_db_path)
        self.audio_db = self._load_db(self.audio_db_path)
    
    def _load_db(self, path: Path) -> Dict:
        """Load fingerprint database."""
        if path.exists():
            with open(path, 'rb') as f:
                return pickle.load(f)
        return {}
    
    def _save_db(self, data: Dict, path: Path):
        """Save fingerprint database."""
        with open(path, 'wb') as f:
            pickle.dump(data, f)
    
    def check_video(self, video_path: Path, script_text: str, audio_path: Path,
                    video_title: str = "") -> Dict:
        """
        Run complete aggressive plagiarism check.
        Returns detailed results with pass/fail decision.
        """
        results = {
            'is_plagiarized': False,
            'confidence': 0.0,
            'method': None,
            'details': [],
            'all_checks': [],
            'timestamp': datetime.now().isoformat(),
            'video_title': video_title
        }
        
        print(f"🔍 Running plagiarism check for: {video_title or video_path.name}")
        
        # Check 1: Visual fingerprinting
        visual_result = self._check_visual(video_path)
        results['all_checks'].append(visual_result)
        if visual_result['failed']:
            results['is_plagiarized'] = True
            results['confidence'] = visual_result['similarity']
            results['method'] = 'visual_fingerprinting'
            results['details'] = visual_result['matches']
        
        # Check 2: Script plagiarism (if not already failed)
        if not results['is_plagiarized']:
            script_result = self._check_script(script_text)
            results['all_checks'].append(script_result)
            if script_result['failed']:
                results['is_plagiarized'] = True
                results['confidence'] = script_result['similarity']
                results['method'] = 'script_plagiarism'
                results['details'] = script_result['matches']
        
        # Check 3: Audio fingerprinting (if not already failed)
        if not results['is_plagiarized']:
            audio_result = self._check_audio(audio_path)
            results['all_checks'].append(audio_result)
            if audio_result['failed']:
                results['is_plagiarized'] = True
                results['confidence'] = audio_result['similarity']
                results['method'] = 'audio_fingerprinting'
                results['details'] = audio_result['matches']
        
        # Check 4: Content policy
        policy_result = self._check_content_policy(script_text)
        results['all_checks'].append(policy_result)
        if policy_result['failed']:
            results['is_plagiarized'] = True
            results['confidence'] = 1.0
            results['method'] = 'content_policy'
            results['details'] = policy_result['violations']
        
        # Log result
        self._log_check(results)
        
        # Print summary
        if results['is_plagiarized']:
            print(f"❌ BLOCKED: {results['method']} ({results['confidence']:.1%})")
        else:
            print("✅ PASSED: Original content confirmed")
        
        return results
    
    def _check_visual(self, video_path: Path) -> Dict:
        """Check video against visual fingerprint database."""
        result = {'type': 'visual', 'failed': False, 'similarity': 0.0, 'matches': []}
        
        if not cv2 or not video_path.exists() or not self.visual_db:
            return result
        
        try:
            new_fingerprint = self._extract_visual_fingerprint(video_path)
            
            for ref_name, ref_fingerprint in self.visual_db.items():
                similarity = self._compare_visual_fingerprints(new_fingerprint, ref_fingerprint)
                
                if similarity >= VISUAL_PLAGIARISM_THRESHOLD:
                    result['matches'].append({
                        'reference': ref_name,
                        'similarity': similarity
                    })
                
                result['similarity'] = max(result['similarity'], similarity)
            
            if result['matches']:
                result['failed'] = True
                result['matches'].sort(key=lambda x: x['similarity'], reverse=True)
                
        except Exception as e:
            print(f"⚠️ Visual check error: {e}")
        
        return result
    
    def _extract_visual_fingerprint(self, video_path: Path, frames_per_second: float = 0.2) -> List:
        """Extract perceptual hashes from video frames."""
        cap = cv2.VideoCapture(str(video_path))
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = max(1, int(fps / frames_per_second))
        
        hashes = []
        frame_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % frame_interval == 0:
                frame_small = cv2.resize(frame, (256, 256))
                pil_image = Image.fromarray(cv2.cvtColor(frame_small, cv2.COLOR_BGR2RGB))
                hash_value = imagehash.phash(pil_image)
                hashes.append(hash_value)
            
            frame_count += 1
        
        cap.release()
        return hashes
    
    def _compare_visual_fingerprints(self, fp1: List, fp2: List) -> float:
        """Compare two visual fingerprints. Returns 0-1 similarity."""
        if not fp1 or not fp2:
            return 0.0
        
        matches = 0
        for h1 in fp1:
            for h2 in fp2:
                distance = h1 - h2  # imagehash hamming distance
                similarity = 1.0 - (distance / 64.0)
                if similarity > 0.7:
                    matches += 1
                    break
        
        max_matches = min(len(fp1), len(fp2))
        return matches / max_matches if max_matches > 0 else 0.0
    
    def _check_script(self, script_text: str) -> Dict:
        """Check script against reference scripts."""
        result = {'type': 'script', 'failed': False, 'similarity': 0.0, 'matches': []}
        
        if not self.script_db:
            return result
        
        normalized = self._normalize_text(script_text)
        
        for ref_name, ref_text in self.script_db.items():
            ref_normalized = self._normalize_text(ref_text)
            
            # Fuzzy matching
            similarity = fuzz.token_sort_ratio(normalized, ref_normalized) / 100.0
            
            # Substring matching for copied passages
            longest_substring = self._longest_common_substring(normalized, ref_normalized)
            substring_ratio = len(longest_substring) / max(len(normalized), 1)
            
            # Use higher of the two
            final_similarity = max(similarity, substring_ratio)
            
            if final_similarity >= SCRIPT_PLAGIARISM_THRESHOLD:
                result['matches'].append({
                    'reference': ref_name,
                    'similarity': final_similarity,
                    'method': 'fuzzy' if similarity > substring_ratio else 'substring'
                })
            
            result['similarity'] = max(result['similarity'], final_similarity)
        
        if result['matches']:
            result['failed'] = True
            result['matches'].sort(key=lambda x: x['similarity'], reverse=True)
        
        return result
    
    def _normalize_text(self, text: str) -> str:
        """Normalize text for comparison."""
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def _longest_common_substring(self, s1: str, s2: str) -> str:
        """Find longest common substring between two strings."""
        if not s1 or not s2:
            return ""
        
        m, n = len(s1), len(s2)
        max_len = 0
        end_pos = 0
        
        # Dynamic programming
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if s1[i-1] == s2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                    if dp[i][j] > max_len:
                        max_len = dp[i][j]
                        end_pos = i
        
        return s1[end_pos - max_len:end_pos]
    
    def _check_audio(self, audio_path: Path) -> Dict:
        """Check audio against reference audio fingerprints."""
        result = {'type': 'audio', 'failed': False, 'similarity': 0.0, 'matches': []}
        
        if not HAS_LIBROSA or not audio_path.exists() or not self.audio_db:
            return result
        
        try:
            y, sr = librosa.load(str(audio_path), sr=22050, duration=30)
            new_mfcc = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13), axis=1)
            
            for ref_name, ref_mfcc in self.audio_db.items():
                # Cosine similarity
                from numpy.linalg import norm
                cosine_sim = np.dot(new_mfcc, ref_mfcc) / (norm(new_mfcc) * norm(ref_mfcc) + 1e-8)
                
                if cosine_sim >= AUDIO_PLAGIARISM_THRESHOLD:
                    result['matches'].append({
                        'reference': ref_name,
                        'similarity': float(cosine_sim)
                    })
                
                result['similarity'] = max(result['similarity'], float(cosine_sim))
            
            if result['matches']:
                result['failed'] = True
                result['matches'].sort(key=lambda x: x['similarity'], reverse=True)
                
        except Exception as e:
            print(f"⚠️ Audio check error: {e}")
        
        return result
    
    def _check_content_policy(self, script_text: str) -> Dict:
        """Check for content policy violations."""
        result = {'type': 'content_policy', 'failed': False, 'violations': []}
        
        blocked_patterns = [
            # Hate/violence
            r'\b(kill|murder|attack|violence|hate speech)\b',
            # Adult content
            r'\b(sex|porn|nude|explicit)\b',
            # Dangerous
            r'\b(bomb|weapon|terrorist|drug)\b',
            # Spam/scams
            r'\b(free money|get rich quick|click here|buy now)\b',
            # Misinformation
            r'\b(fake news|conspiracy)\b'
        ]
        
        text_lower = script_text.lower()
        for pattern in blocked_patterns:
            matches = re.findall(pattern, text_lower)
            if matches:
                result['violations'].extend(matches)
        
        if result['violations']:
            result['failed'] = True
        
        return result
    
    def add_reference(self, video_path: Path = None, script_text: str = None,
                      audio_path: Path = None, name: str = None):
        """Add a reference to the plagiarism database."""
        if not name:
            name = f"ref_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        if video_path and cv2 and video_path.exists():
            self.visual_db[name] = self._extract_visual_fingerprint(video_path)
        
        if script_text:
            self.script_db[name] = script_text
        
        if audio_path and HAS_LIBROSA and audio_path.exists():
            y, sr = librosa.load(str(audio_path), sr=22050, duration=30)
            self.audio_db[name] = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13), axis=1)
        
        self._save_db(self.visual_db, self.visual_db_path)
        self._save_db(self.script_db, self.script_db_path)
        self._save_db(self.audio_db, self.audio_db_path)
        
        print(f"✅ Added reference: {name}")
    
    def _log_check(self, results: Dict):
        """Log plagiarism check to audit file."""
        with open(self.audit_log_path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(results, default=str) + '\n')


if __name__ == "__main__":
    detector = PlagiarismDetector()
    print(f"Plagiarism detector ready. DB size: {len(detector.visual_db)} visual, {len(detector.script_db)} script, {len(detector.audio_db)} audio")
