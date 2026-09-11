# Essay narration

Every essay gets an audio version, synthesised locally with
[Kokoro](https://huggingface.co/hexgrad/Kokoro-82M) (82M params, Apache-2.0) via
`kokoro-onnx`. Nothing is sent anywhere — no API, no key, no per-character bill.

The mp3s are **not** in git. They live in a Cloudflare R2 bucket (`codeberg-audio`) and
are served on the site's own origin by `worker/index.ts`, which handles `/audio/*` and
defers everything else to static assets. 24 MB of mp3 in git history would be permanent;
in R2 it is 0.24% of the free tier, with no egress charges.

Generation always happens on your machine. Cloudflare has no model and never runs one —
nothing in the build path can invoke it.

## Setup

Needs Python 3.13 — **not** 3.14, whose wheels for `blis`/`thinc` do not yet exist.

```sh
/opt/homebrew/opt/python@3.13/bin/python3.13 -m venv scripts/tts/.venv
scripts/tts/.venv/bin/pip install kokoro-onnx soundfile lameenc
```

Then the model weights (~350 MB, gitignored):

```sh
mkdir -p scripts/tts/models && cd scripts/tts/models
curl -L -O https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -L -O https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

## Use

```sh
scripts/tts/run.sh                    # narrate anything stale
scripts/tts/publish.sh                # upload changed audio to R2
scripts/tts/run.sh --force            # redo everything
scripts/tts/run.sh --only <slug>      # one essay
scripts/tts/run.sh --sample           # audition voices on a short passage
scripts/tts/run.sh --sample --voices bm_george,bf_emma
```

Synthesis runs at roughly 5× realtime on an M-series CPU, so the whole site is a few
minutes.

## How it stays in step with the prose

`generate.py` derives the **speakable text** from each `.mdx` — frontmatter and code
fences dropped, figures dropped, pull quotes kept (they are body copy), links reduced to
their text — then hashes that text together with the voice and speed. The hash is stored
in `apps/web/content/audio.json`.

Rerunning skips any essay whose hash is unchanged and re-synthesises any essay whose
hash moved. So the rule is simply: **edit an essay, then run `scripts/tts/run.sh` before
committing.** Changing `DEFAULT_VOICE` re-narrates the whole site on the next run, which
is intended — a half-swapped voice would be worse than either.

An essay with no manifest entry renders no player, so the site builds fine before any
audio exists.

## Pronunciation

`SPOKEN` in `generate.py` is a small ordered list of substitutions applied before
synthesis, because these essays are full of notation a narrator would otherwise read as
punctuation: `≈` → "approximately", `n·v` → "n dot v", `4e-16` → "4 times ten to the
minus 16", `40°` → "40 degrees", `518 px` → "518 pixels".

Add to it when a new essay introduces new notation. Check the result with:

```sh
scripts/tts/.venv/bin/python -c "
import sys; sys.path.insert(0,'scripts/tts')
from generate import script_for; from pathlib import Path
for t,_ in [script_for(Path('apps/web/content/essays/<slug>.mdx'))]: print(t)
"
```

## Playback

`apps/web/app/_audio/` holds one `<audio>` element for the whole site, mounted by the
root layout so narration survives client-side navigation. `EssayPlayer` (article header)
and `MiniPlayer` (docked bar, appears once you navigate away) are only controls pointed
at it. Nothing else should ever mount an `<audio>` tag.

A player only appears when the audio is really there. At build time, an essay with no
manifest entry renders no player. At runtime, `EssayPlayer` sends a `HEAD` for its mp3
and removes itself if the file is missing — the case where an essay was narrated but
`publish.sh` never ran. A playback error hides both players for that essay as well.

## Publishing to R2

One-time, with your Cloudflare account:

```sh
pnpm wrangler login
pnpm wrangler r2 bucket create codeberg-audio
```

Then, after any run of `run.sh`:

```sh
scripts/tts/publish.sh
```

`publish.sh` uploads only what changed. R2 sets an object's ETag to the MD5 of its
contents, and the Worker passes that through, so a HEAD against the live site says
exactly what the bucket holds — no download, no S3 keys, and no local state file that
could drift from the truth. `--dry-run` shows the plan; `--all` forces a full upload.

It checks the same address the sitemap and RSS feed use: `NEXT_PUBLIC_SITE_URL` if set,
otherwise the default in `apps/web/lib/site-url.ts`. Override it with `SITE_URL=…` — for
example to check a PR preview before merging. If that address isn't serving the Worker
yet, every file reads as missing and everything is uploaded: safe, just not incremental.

### Moving to a custom domain

Change the default in `apps/web/lib/site-url.ts`. That one line moves the sitemap, the
RSS feed, robots.txt and `publish.sh` together. Audio itself needs nothing: it is served
from the site's own origin at `/audio/*`, so it works on whatever domain serves the site.
Setting `NEXT_PUBLIC_SITE_URL` only in the Cloudflare dashboard would not reach
`publish.sh`, which runs on your machine — prefer the file.

The normal loop is therefore: **edit an essay → `run.sh` → `publish.sh` → commit.** The
first two are cheap for essays you did not touch, and the commit carries no audio.
