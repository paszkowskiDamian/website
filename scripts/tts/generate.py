#!/usr/bin/env python3
"""Narrate the site's essays locally with Kokoro, and keep the audio in step with the prose.

The speakable text is derived from the MDX and hashed. An essay is only re-synthesised
when that hash changes, so audio and article cannot silently diverge — and rerunning
this after a typo fix costs nothing for the essays you did not touch.

    scripts/tts/run.sh                 # generate whatever is stale
    scripts/tts/run.sh --force         # redo everything
    scripts/tts/run.sh --only <slug>
    scripts/tts/run.sh --voices bm_george,af_heart --sample   # short voice audition

Output: apps/web/public/audio/<slug>.mp3, plus apps/web/content/audio.json (the
manifest the site reads for duration and availability).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import time
from pathlib import Path

import lameenc
import numpy as np
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parents[2]
ESSAYS = ROOT / "apps/web/content/essays"
AUDIO_OUT = ROOT / "apps/web/public/audio"
MANIFEST = ROOT / "apps/web/content/audio.json"
MODEL = Path(__file__).resolve().parent / "models/kokoro-v1.0.onnx"
VOICES = Path(__file__).resolve().parent / "models/voices-v1.0.bin"

DEFAULT_VOICE = "am_michael"
DEFAULT_SPEED = 1.25  # narrated faster by default; the player still starts at 1x
MP3_BITRATE = 64  # mono speech; ~0.5 MB per minute

SAMPLE_TEXT = (
    "This passage is for comparing voices before narrating the site. Listen for pacing "
    "across a long sentence, how a question lands, and whether the voice would still be "
    "pleasant to hear for ten minutes. Does it?"
)


# --------------------------------------------------------------------------- text

def _say_scientific(m: re.Match[str]) -> str:
    mantissa, exp = m.group(1), int(m.group(2))
    sign = "minus " if exp < 0 else ""
    return f"{mantissa} times ten to the {sign}{abs(exp)}"


# Applied in order. Keep this list short and obvious — it exists because a depth-map
# essay is full of notation that a narrator would otherwise read as punctuation.
SPOKEN = [
    (re.compile(r"(\d(?:\.\d+)?)e(-?\d+)"), _say_scientific),
    (re.compile(r"\bn·v\b"), "n dot v"),
    (re.compile(r"·"), " dot "),
    (re.compile(r"≈"), " approximately "),
    (re.compile(r"×"), " times "),
    (re.compile(r"→"), " to "),
    (re.compile(r"±"), " plus or minus "),
    (re.compile(r"√"), " the square root of "),
    (re.compile(r"(\d)\s*°"), r"\1 degrees"),
    (re.compile(r"(\d)\s*%"), r"\1 percent"),
    (re.compile(r"(\d)\s*mm\b"), r"\1 millimetres"),
    (re.compile(r"(\d)\s*px\b"), r"\1 pixels"),
    (re.compile(r"\+Z\b"), "plus Z"),
    (re.compile(r"\bz = f\(x, y\)"), "z equals f of x y"),
    (re.compile(r"\bDA-?V2\b"), "D A V two"),
    (re.compile(r"\bMoGe-2\b"), "Mo Gee two"),
    (re.compile(r"\bPSD\b"), "P S D"),
    (re.compile(r"\bMTF\b"), "M T F"),
    (re.compile(r"\bAO\b"), "ambient occlusion"),
    (re.compile(r"\bDAG\b"), "dag"),
    (re.compile(r"\bJSON\b"), "Jason"),
    (re.compile(r"\bLoRA\b"), "Lora"),
    (re.compile(r"\bViT-S\b"), "V I T small"),
]


def speakable(md: str) -> list[tuple[str, float]]:
    """MDX body -> [(text, pause_after_seconds)], one entry per spoken block."""
    md = re.sub(r"^---\n.*?\n---\n", "", md, flags=re.S)          # frontmatter
    md = re.sub(r"```.*?```", "", md, flags=re.S)                  # code blocks
    md = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", md)                   # figures

    # Pull quotes are body copy, not decoration — read them.
    def _quote(m: re.Match[str]) -> str:
        attrs = m.group(0)
        q = re.search(r'quote="([^"]*)"', attrs)
        a = re.search(r'attribution="([^"]*)"', attrs)
        if not q:
            return ""
        return f"\n\n{q.group(1)}{'. ' + a.group(1) if a else ''}\n\n"

    md = re.sub(r"<PullQuote[\s\S]*?/>", _quote, md)
    md = re.sub(r"<[^>]+>", "", md)                                # any other JSX

    blocks: list[tuple[str, float]] = []
    for raw in md.split("\n\n"):
        raw = raw.strip()
        if not raw:
            continue
        pause = 0.45
        if raw.startswith("#"):
            raw = re.sub(r"^#+\s*", "", raw)
            pause = 0.8                                            # breathe at a section
        raw = re.sub(r"^\s*[-*]\s+", "", raw, flags=re.M)          # bullets
        raw = re.sub(r"^\s*\d+\.\s+", "", raw, flags=re.M)         # numbered
        raw = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", raw)         # links
        raw = re.sub(r"[*_]{1,3}([^*_]+)[*_]{1,3}", r"\1", raw)    # emphasis
        raw = raw.replace("`", "")
        raw = raw.replace("&nbsp;", " ").replace("&mdash;", "—")
        for pat, rep in SPOKEN:
            raw = pat.sub(rep, raw)
        raw = re.sub(r"\s+", " ", raw).strip()
        if raw:
            blocks.append((raw, pause))
    return blocks


def script_for(path: Path) -> tuple[str, list[tuple[str, float]]]:
    src = path.read_text()
    fm = re.match(r"^---\n(.*?)\n---\n", src, flags=re.S)
    title = ""
    if fm:
        t = re.search(r"^title: (.+)$", fm.group(1), flags=re.M)
        if t:
            title = t.group(1).strip()
    blocks = speakable(src)
    if title:
        blocks.insert(0, (title + ".", 0.9))
    return title, blocks


# ---------------------------------------------------------------------- synthesis

def synthesise(kok: Kokoro, blocks, voice: str, speed: float):
    chunks, rate = [], 24000
    for i, (text, pause) in enumerate(blocks):
        samples, rate = kok.create(text, voice=voice, speed=speed, lang="en-gb"
                                   if voice.startswith(("b",)) else "en-us")
        chunks.append(samples.astype(np.float32))
        if i != len(blocks) - 1:
            chunks.append(np.zeros(int(rate * pause), dtype=np.float32))
    return np.concatenate(chunks), rate


def to_mp3(samples: np.ndarray, rate: int, dest: Path) -> None:
    peak = float(np.max(np.abs(samples))) or 1.0
    pcm = (samples / peak * 0.89 * 32767).astype("<i2")
    enc = lameenc.Encoder()
    enc.set_bit_rate(MP3_BITRATE)
    enc.set_in_sample_rate(rate)
    enc.set_channels(1)
    enc.set_quality(2)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(enc.encode(pcm.tobytes()) + enc.flush())


# --------------------------------------------------------------------------- main

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", default=DEFAULT_VOICE)
    ap.add_argument("--speed", type=float, default=DEFAULT_SPEED)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--only", help="one essay slug")
    ap.add_argument("--sample", action="store_true", help="audition voices on a short passage")
    ap.add_argument("--voices", help="comma-separated voices, with --sample")
    args = ap.parse_args()

    if not MODEL.exists():
        print(f"missing model: {MODEL}\nsee scripts/tts/README.md", file=sys.stderr)
        return 1

    kok = Kokoro(str(MODEL), str(VOICES))

    if args.sample:
        out = ROOT / "scripts/tts/samples"
        for v in (args.voices or "bm_george,bm_fable,am_michael,af_heart").split(","):
            v = v.strip()
            t0 = time.time()
            s, r = synthesise(kok, [(SAMPLE_TEXT, 0)], v, args.speed)
            to_mp3(s, r, out / f"{v}.mp3")
            print(f"  {v:12s} {len(s)/r:5.1f}s audio in {time.time()-t0:4.1f}s")
        print(f"\nsamples in {out.relative_to(ROOT)}")
        return 0

    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    files = sorted(ESSAYS.glob("*.mdx"))
    if args.only:
        files = [f for f in files if f.stem == args.only]
        if not files:
            print(f"no essay {args.only!r}", file=sys.stderr)
            return 1

    changed = 0
    for path in files:
        slug = path.stem
        title, blocks = script_for(path)
        text = "\n".join(b for b, _ in blocks)
        digest = hashlib.sha256(
            f"{args.voice}|{args.speed}|{text}".encode()
        ).hexdigest()[:16]

        prev = manifest.get(slug)
        dest = AUDIO_OUT / f"{slug}.mp3"
        # Essays narrated outside this script (Breeze TTS 2 on a Hugging Face Job)
        # keep that recording until a re-narration is asked for with --force.
        if prev and str(prev.get("voice", "")).startswith("breeze-") and not args.force:
            print(f"  ~ {slug} (narrated with {prev['voice']}; --force to replace)")
            continue
        if prev and prev.get("hash") == digest and dest.exists() and not args.force:
            print(f"  = {slug}")
            continue

        t0 = time.time()
        samples, rate = synthesise(kok, blocks, args.voice, args.speed)
        to_mp3(samples, rate, dest)
        dur = len(samples) / rate
        manifest[slug] = {
            "src": f"/audio/{slug}.mp3",
            "duration": round(dur, 1),
            "bytes": dest.stat().st_size,
            "voice": args.voice,
            "speed": args.speed,
            "hash": digest,
        }
        changed += 1
        print(f"  + {slug}  {dur/60:4.1f} min  {dest.stat().st_size/1e6:4.1f} MB  "
              f"(synth {time.time()-t0:.0f}s)")

    # drop entries whose essay no longer exists
    live = {f.stem for f in ESSAYS.glob("*.mdx")}
    for gone in [s for s in manifest if s not in live]:
        manifest.pop(gone)
        (AUDIO_OUT / f"{gone}.mp3").unlink(missing_ok=True)
        print(f"  - {gone} (essay removed)")

    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")
    print(f"\n{changed} regenerated, {len(manifest)} narrated in total")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
