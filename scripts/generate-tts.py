#!/usr/bin/env python3
"""Generate TTS audio for FCE listening extracts and vocabulary.

Usage:
  pip install openai pyyaml
  export OPENAI_API_KEY=sk-...   (or OEPNAI_VOICE_GEN)

  # Generate all listening audio
  python scripts/generate-tts.py listening

  # Generate all vocab pronunciation
  python scripts/generate-tts.py vocab

  # Generate specific IDs
  python scripts/generate-tts.py listening L001 L002 L003
  python scripts/generate-tts.py vocab V0001 V0002

  # Force regeneration (overwrite existing files)
  python scripts/generate-tts.py listening --force

Requires: ffmpeg (for concatenating audio segments)
"""

import argparse
import os
import subprocess
import sys
import tempfile
import time
from pathlib import Path

import yaml

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package not installed. Run: pip install openai")
    sys.exit(1)

# ---------------------------------------------------------------------------
#  Paths
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
LISTENING_YAML_DIR = REPO_ROOT / "website" / "src" / "data" / "english" / "fce" / "listening"
VOCAB_YAML_DIR = REPO_ROOT / "website" / "src" / "data" / "english" / "fce" / "vocab"
LISTENING_AUDIO_DIR = REPO_ROOT / "website" / "public" / "audio" / "english" / "fce" / "listening"
VOCAB_AUDIO_DIR = REPO_ROOT / "website" / "public" / "audio" / "english" / "fce" / "vocab"

# ---------------------------------------------------------------------------
#  TTS helpers
# ---------------------------------------------------------------------------

client: OpenAI | None = None


def get_client() -> OpenAI:
    global client
    if client is None:
        api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("OEPNAI_VOICE_GEN")
        if not api_key:
            print("Error: Set OPENAI_API_KEY or OEPNAI_VOICE_GEN environment variable.")
            sys.exit(1)
        client = OpenAI(api_key=api_key)
    return client


def generate_speech_to_file(text: str, voice: str, output_path: Path) -> bool:
    """Generate speech and save directly to mp3 file."""
    c = get_client()
    try:
        response = c.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
            response_format="mp3",
        )
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(response.content)
        return True
    except Exception as e:
        print(f"    TTS API error: {e}")
        return False


def make_silence_mp3(duration_ms: int, output_path: Path) -> bool:
    """Create a silent mp3 file using ffmpeg."""
    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-f", "lavfi",
                "-i", f"anullsrc=r=24000:cl=mono",
                "-t", str(duration_ms / 1000),
                "-c:a", "libmp3lame", "-q:a", "9",
                str(output_path),
            ],
            capture_output=True,
            check=True,
        )
        return True
    except Exception:
        return False


def concat_mp3_files(file_list: list[Path], output_path: Path) -> bool:
    """Concatenate multiple mp3 files using ffmpeg."""
    if len(file_list) == 1:
        # Just copy
        import shutil
        shutil.copy2(file_list[0], output_path)
        return True

    # Write concat list file
    with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=False) as f:
        for p in file_list:
            f.write(f"file '{p}'\n")
        list_path = f.name

    try:
        subprocess.run(
            [
                "ffmpeg", "-y", "-f", "concat", "-safe", "0",
                "-i", list_path,
                "-c", "copy",
                str(output_path),
            ],
            capture_output=True,
            check=True,
        )
        return True
    except Exception as e:
        print(f"    ffmpeg concat error: {e}")
        return False
    finally:
        os.unlink(list_path)


# ---------------------------------------------------------------------------
#  Listening generation
# ---------------------------------------------------------------------------

def load_listening_extracts() -> list[dict]:
    extracts = []
    if not LISTENING_YAML_DIR.exists():
        return extracts
    for yaml_file in sorted(LISTENING_YAML_DIR.glob("*.yaml")):
        try:
            with open(yaml_file, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
            if data and "extracts" in data:
                extracts.extend(data["extracts"])
        except Exception as e:
            print(f"  Error loading {yaml_file.name}: {e}")
    return extracts


def generate_listening_audio(extract: dict, output_path: Path) -> bool:
    script = extract.get("script", [])
    if not script:
        return False

    with tempfile.TemporaryDirectory() as tmpdir:
        parts: list[Path] = []

        # 1s silence at start
        silence_path = Path(tmpdir) / "silence_1s.mp3"
        if make_silence_mp3(1000, silence_path):
            parts.append(silence_path)

        # 0.5s gap between lines
        gap_path = Path(tmpdir) / "gap_500ms.mp3"
        make_silence_mp3(500, gap_path)

        for i, line in enumerate(script):
            voice = line.get("voice", "nova")
            text = line.get("text", "").strip()
            if not text:
                continue

            seg_path = Path(tmpdir) / f"seg_{i:03d}.mp3"
            print(f"    Line {i+1}/{len(script)} [{line.get('speaker', '?')}]...", end="", flush=True)
            ok = generate_speech_to_file(text, voice, seg_path)
            if not ok:
                print(" FAILED")
                return False
            print(" OK")
            parts.append(seg_path)

            # Add gap between lines (not after last)
            if i < len(script) - 1 and gap_path.exists():
                parts.append(gap_path)

            time.sleep(0.1)  # rate limit

        if not parts:
            return False

        output_path.parent.mkdir(parents=True, exist_ok=True)
        return concat_mp3_files(parts, output_path)


def cmd_listening(ids: list[str], force: bool) -> None:
    extracts = load_listening_extracts()
    if not extracts:
        print("No listening extracts found.")
        return

    if ids:
        id_set = set(ids)
        extracts = [e for e in extracts if e.get("id") in id_set]

    print(f"Found {len(extracts)} extract(s) to process.\n")
    LISTENING_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    success = skipped = failed = 0
    for extract in extracts:
        eid = extract.get("id", "unknown")
        output_path = LISTENING_AUDIO_DIR / f"{eid}.mp3"

        if output_path.exists() and not force:
            print(f"  [{eid}] Already exists, skipping")
            skipped += 1
            continue

        print(f"  [{eid}] Generating...")
        ok = generate_listening_audio(extract, output_path)
        if ok:
            size_kb = output_path.stat().st_size / 1024
            print(f"  [{eid}] Done ({size_kb:.0f} KB)\n")
            success += 1
        else:
            print(f"  [{eid}] FAILED\n")
            failed += 1

    print(f"\nListening: {success} generated, {skipped} skipped, {failed} failed")


# ---------------------------------------------------------------------------
#  Vocab pronunciation
# ---------------------------------------------------------------------------

def load_vocab_entries() -> list[dict]:
    entries = []
    if not VOCAB_YAML_DIR.exists():
        return entries
    for yaml_file in sorted(VOCAB_YAML_DIR.glob("*.yaml")):
        try:
            with open(yaml_file, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
            if data and "vocab" in data:
                entries.extend(data["vocab"])
            elif data and "vocabularyList" in data:
                entries.extend(data["vocabularyList"])
        except Exception as e:
            print(f"  Error loading {yaml_file.name}: {e}")
    return entries


def cmd_vocab(ids: list[str], force: bool) -> None:
    entries = load_vocab_entries()
    if not entries:
        print("No vocab entries found.")
        return

    if ids:
        id_set = set(ids)
        entries = [e for e in entries if e.get("id") in id_set]

    print(f"Found {len(entries)} word(s) to process.\n")
    VOCAB_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    success = skipped = failed = 0
    for entry in entries:
        vid = entry.get("id", "unknown")
        word = entry.get("word", "")
        if not word:
            failed += 1
            continue

        output_path = VOCAB_AUDIO_DIR / f"{vid}.mp3"
        if output_path.exists() and not force:
            skipped += 1
            continue

        print(f"  [{vid}] {word}...", end="", flush=True)
        ok = generate_speech_to_file(word, "nova", output_path)
        if ok:
            print(" OK")
            success += 1
        else:
            print(" FAILED")
            failed += 1

        time.sleep(0.1)

    print(f"\nVocab: {success} generated, {skipped} skipped, {failed} failed")


# ---------------------------------------------------------------------------
#  CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate TTS audio for FCE listening and vocabulary."
    )
    parser.add_argument("mode", choices=["listening", "vocab"])
    parser.add_argument("ids", nargs="*", help="Optional specific IDs")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    if args.mode == "listening":
        cmd_listening(args.ids, args.force)
    elif args.mode == "vocab":
        cmd_vocab(args.ids, args.force)


if __name__ == "__main__":
    main()
