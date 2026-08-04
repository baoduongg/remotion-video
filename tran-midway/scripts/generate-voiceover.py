#!/usr/bin/env python3
"""Generate voiceover mp3s from a script JSON via edge-tts, report real durations.

Usage:
    python3 scripts/generate-voiceover.py path/to/voiceover.json [--fps 30]

Input JSON: [{"id": "vo_01", "text": "...", "voice": "vi-VN-NamMinhNeural"}, ...]
"voice" is optional, defaults to DEFAULT_VOICE.

Output: public/audio/vo/<id>.mp3 for each line, plus
        public/audio/vo/manifest.json: {id: {durationSec, durationInFrames}}

Why this exists: manually calling `edge-tts` per line and eyeballing Sequence
timing was the slowest, most error-prone part of the old workflow (see
WORKFLOW.md). This makes it one command with real ffprobe-measured durations.
"""
import json
import subprocess
import sys
from pathlib import Path

DEFAULT_VOICE = "vi-VN-NamMinhNeural"
OUT_DIR = Path.cwd() / "public" / "audio" / "vo"  # run from project root


def ffprobe_duration(path: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def generate_line(id_: str, text: str, voice: str, attempts: int = 3) -> float:
    out_path = OUT_DIR / f"{id_}.mp3"
    last_err = None
    for attempt in range(1, attempts + 1):
        result = subprocess.run(
            ["edge-tts", "--voice", voice, "--text", text, "--write-media", str(out_path)],
            capture_output=True, text=True,
        )
        if result.returncode == 0 and out_path.exists() and out_path.stat().st_size > 0:
            return ffprobe_duration(out_path)
        last_err = result.stderr
        print(f"  retry {attempt}/{attempts} for {id_} after edge-tts error: {last_err.strip().splitlines()[-1] if last_err else 'empty output'}")
    raise RuntimeError(f"edge-tts failed for {id_} after {attempts} attempts: {last_err}")


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    script_path = Path(sys.argv[1])
    fps = 30
    if "--fps" in sys.argv:
        fps = int(sys.argv[sys.argv.index("--fps") + 1])

    lines = json.loads(script_path.read_text())
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest = {}
    for line in lines:
        id_, text = line["id"], line["text"]
        voice = line.get("voice", DEFAULT_VOICE)
        duration = generate_line(id_, text, voice)
        manifest[id_] = {
            "durationSec": round(duration, 3),
            "durationInFrames": round(duration * fps),
        }
        print(f"{id_}: {duration:.2f}s ({manifest[id_]['durationInFrames']} frames @ {fps}fps)")

    manifest_path = OUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False))
    print(f"\nWrote {len(manifest)} lines -> {manifest_path}")


if __name__ == "__main__":
    main()
