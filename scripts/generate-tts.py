#!/usr/bin/env python3
"""Generate TTS audio for FCE listening extracts and vocabulary.

Usage:
  pip install openai pydub pyyaml
  export OPENAI_API_KEY=sk-...

  # Generate all listening audio
  python scripts/generate-tts.py listening

  # Generate all vocab pronunciation
  python scripts/generate-tts.py vocab

  # Generate specific IDs
  python scripts/generate-tts.py listening L001 L002 L003
  python scripts/generate-tts.py vocab V0001 V0002

  # Force regeneration (overwrite existing files)
  python scripts/generate-tts.py listening --force
"""

import argparse
import io
import os
import sys
import time
from pathlib import Path

import yaml

try:
    from openai import OpenAI
except ImportError:
    print("Error: openai package not installed. Run: pip install openai")
    sys.exit(1)

try:
    from pydub import AudioSegment
except ImportError:
    print("Error: pydub package not installed. Run: pip install pydub")
    sys.exit(1)


# ---------------------------------------------------------------------------
#  Paths
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
LISTENING_YAML_DIR = REPO_ROOT / "website" / "src" / "data" / "english" / "fce" / "listening"
VOCAB_YAML_DIR = REPO_ROOT / "website" / "src" / "data" / "english" / "fce" / "vocab"
LISTENING_AUDIO_DIR = REPO_ROOT / "website" / "public" / "audio" / "listening"
VOCAB_AUDIO_DIR = REPO_ROOT / "website" / "public" / "audio" / "vocab"

# ---------------------------------------------------------------------------
#  TTS helpers
# ---------------------------------------------------------------------------

client: OpenAI | None = None


def get_client() -> OpenAI:
    global client
    if client is None:
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            print("Error: OPENAI_API_KEY environment variable not set.")
            sys.exit(1)
        client = OpenAI(api_key=api_key)
    return client


def generate_speech(text: str, voice: str = "nova") -> AudioSegment:
    """Generate speech for a single text segment using OpenAI TTS API.

    Returns an AudioSegment (pydub).
    """
    c = get_client()
    response = c.audio.speech.create(
        model="tts-1",
        voice=voice,
        input=text,
        response_format="mp3",
    )
    audio_bytes = response.content
    return AudioSegment.from_mp3(io.BytesIO(audio_bytes))


def make_silence(duration_ms: int) -> AudioSegment:
    """Create a silent AudioSegment of the given duration."""
    return AudioSegment.silent(duration=duration_ms)


# ---------------------------------------------------------------------------
#  Listening generation
# ---------------------------------------------------------------------------

def load_listening_extracts() -> list[dict]:
    """Load all listening extract YAML files."""
    extracts = []
    if not LISTENING_YAML_DIR.exists():
        print(f"Warning: Listening YAML directory not found: {LISTENING_YAML_DIR}")
        return extracts

    for yaml_file in sorted(LISTENING_YAML_DIR.glob("*.yaml")):
        try:
            with open(yaml_file, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
            if data is None:
                continue
            # Handle both single-extract and multi-extract YAML files
            if isinstance(data, list):
                extracts.extend(data)
            elif isinstance(data, dict):
                if "extracts" in data:
                    extracts.extend(data["extracts"])
                else:
                    extracts.append(data)
        except Exception as e:
            print(f"  Error loading {yaml_file.name}: {e}")
    return extracts


def generate_listening_audio(extract: dict, output_path: Path) -> bool:
    """Generate concatenated TTS audio for a single listening extract.

    Each speaker line is generated with the assigned voice, then concatenated
    with 0.5s silence gaps. A 1s silence is added at the start (scene
    description is shown on screen, not spoken).

    Returns True on success, False on failure.
    """
    script = extract.get("script", [])
    if not script:
        print(f"  Skipping {extract['id']}: no script lines")
        return False

    segments: list[AudioSegment] = []

    # 1s silence at the start (scene is displayed on screen)
    segments.append(make_silence(1000))

    for i, line in enumerate(script):
        voice = line.get("voice", "nova")
        text = line.get("text", "")
        if not text.strip():
            continue

        try:
            audio = generate_speech(text, voice=voice)
            segments.append(audio)
        except Exception as e:
            print(f"  Error generating speech for line {i} ({line.get('speaker', '?')}): {e}")
            return False

        # 0.5s silence between lines (not after last line)
        if i < len(script) - 1:
            segments.append(make_silence(500))

    if len(segments) <= 1:
        print(f"  Skipping {extract['id']}: no audio generated")
        return False

    # Concatenate all segments
    combined = segments[0]
    for seg in segments[1:]:
        combined += seg

    # Export
    output_path.parent.mkdir(parents=True, exist_ok=True)
    combined.export(str(output_path), format="mp3")
    return True


def cmd_listening(ids: list[str], force: bool) -> None:
    """Generate listening audio for specified IDs (or all if empty)."""
    extracts = load_listening_extracts()
    if not extracts:
        print("No listening extracts found.")
        return

    if ids:
        id_set = set(ids)
        extracts = [e for e in extracts if e.get("id") in id_set]
        if not extracts:
            print(f"No extracts matched IDs: {ids}")
            return

    print(f"Found {len(extracts)} listening extract(s) to process.")
    LISTENING_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    success = 0
    skipped = 0
    failed = 0

    for extract in extracts:
        eid = extract.get("id", "unknown")
        output_path = LISTENING_AUDIO_DIR / f"{eid}.mp3"

        if output_path.exists() and not force:
            print(f"  [{eid}] Already exists, skipping (use --force to overwrite)")
            skipped += 1
            continue

        print(f"  [{eid}] Generating audio...")
        try:
            ok = generate_listening_audio(extract, output_path)
            if ok:
                size_kb = output_path.stat().st_size / 1024
                print(f"  [{eid}] Done ({size_kb:.0f} KB)")
                success += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  [{eid}] Failed: {e}")
            failed += 1

        # Brief pause to respect rate limits
        time.sleep(0.2)

    print(f"\nListening summary: {success} generated, {skipped} skipped, {failed} failed")


# ---------------------------------------------------------------------------
#  Vocab pronunciation generation
# ---------------------------------------------------------------------------

def load_vocab_entries() -> list[dict]:
    """Load all vocabulary YAML files."""
    entries = []
    if not VOCAB_YAML_DIR.exists():
        print(f"Warning: Vocab YAML directory not found: {VOCAB_YAML_DIR}")
        return entries

    for yaml_file in sorted(VOCAB_YAML_DIR.glob("*.yaml")):
        try:
            with open(yaml_file, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
            if data is None:
                continue
            if isinstance(data, list):
                entries.extend(data)
            elif isinstance(data, dict):
                if "words" in data:
                    entries.extend(data["words"])
                elif "vocab" in data:
                    entries.extend(data["vocab"])
                else:
                    entries.append(data)
        except Exception as e:
            print(f"  Error loading {yaml_file.name}: {e}")
    return entries


def cmd_vocab(ids: list[str], force: bool) -> None:
    """Generate vocab pronunciation audio for specified IDs (or all if empty)."""
    entries = load_vocab_entries()
    if not entries:
        print("No vocab entries found.")
        return

    if ids:
        id_set = set(ids)
        entries = [e for e in entries if e.get("id") in id_set]
        if not entries:
            print(f"No vocab entries matched IDs: {ids}")
            return

    print(f"Found {len(entries)} vocab word(s) to process.")
    VOCAB_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    success = 0
    skipped = 0
    failed = 0

    for entry in entries:
        vid = entry.get("id", "unknown")
        word = entry.get("word", "")
        if not word:
            print(f"  [{vid}] No word field, skipping")
            failed += 1
            continue

        output_path = VOCAB_AUDIO_DIR / f"{vid}.mp3"

        if output_path.exists() and not force:
            print(f"  [{vid}] Already exists, skipping")
            skipped += 1
            continue

        print(f"  [{vid}] Generating: {word}")
        try:
            audio = generate_speech(word, voice="nova")
            output_path.parent.mkdir(parents=True, exist_ok=True)
            audio.export(str(output_path), format="mp3")
            size_kb = output_path.stat().st_size / 1024
            print(f"  [{vid}] Done ({size_kb:.0f} KB)")
            success += 1
        except Exception as e:
            print(f"  [{vid}] Failed: {e}")
            failed += 1

        # Brief pause to respect rate limits
        time.sleep(0.1)

    print(f"\nVocab summary: {success} generated, {skipped} skipped, {failed} failed")


# ---------------------------------------------------------------------------
#  CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate TTS audio for FCE listening extracts and vocabulary."
    )
    parser.add_argument(
        "mode",
        choices=["listening", "vocab"],
        help="What to generate: 'listening' for extracts, 'vocab' for word pronunciation",
    )
    parser.add_argument(
        "ids",
        nargs="*",
        help="Optional specific IDs to generate (default: all)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing audio files",
    )

    args = parser.parse_args()

    if args.mode == "listening":
        cmd_listening(args.ids, args.force)
    elif args.mode == "vocab":
        cmd_vocab(args.ids, args.force)


if __name__ == "__main__":
    main()
