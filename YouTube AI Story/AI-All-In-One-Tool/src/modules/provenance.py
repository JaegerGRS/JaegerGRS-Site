"""Local project manifests for retaining creation history and file integrity."""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable

from src.config import DB_DIR


class ProjectProvenance:
    """Write a local, tamper-evident record for each generated project."""

    def __init__(self, manifest_dir: Path | None = None):
        self.manifest_dir = manifest_dir or DB_DIR / "project_manifests"
        self.manifest_dir.mkdir(parents=True, exist_ok=True)

    def create_manifest(self, project_id: str, project: Dict[str, Any], files: Iterable[Path]) -> Path:
        file_records = [self._file_record(Path(file_path)) for file_path in files]
        payload = {
            "manifest_version": 1,
            "project_id": project_id,
            "created_at_utc": datetime.now(timezone.utc).isoformat(),
            "storage": "local_only",
            "ownership_notice": (
                "This manifest was created locally and records the creation time, "
                "project inputs, and SHA-256 hashes of generated files. It supports "
                "record keeping but is not a legal registration or proof of copyright ownership."
            ),
            "project": project,
            "files": file_records,
        }
        manifest_path = self.manifest_dir / f"{project_id}.json"
        manifest_path.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")
        return manifest_path

    @staticmethod
    def _file_record(file_path: Path) -> Dict[str, Any]:
        record = {"path": str(file_path), "exists": file_path.exists()}
        if file_path.exists() and file_path.is_file():
            digest = hashlib.sha256()
            with file_path.open("rb") as file_handle:
                for chunk in iter(lambda: file_handle.read(1024 * 1024), b""):
                    digest.update(chunk)
            record.update({"size_bytes": file_path.stat().st_size, "sha256": digest.hexdigest()})
        return record
