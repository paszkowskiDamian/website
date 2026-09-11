"use client";

import { useEffect, useRef } from "react";
import { RATES, useAudio, type AudioTrack } from "./audio-provider";

/** mm:ss, for durations that are always well under an hour. */
export function clock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      {playing ? (
        <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
      ) : (
        <path d="M8 5.5v13l11-6.5z" />
      )}
    </svg>
  );
}

function Scrubber({
  time,
  duration,
  onSeek,
  label,
}: {
  time: number;
  duration: number;
  onSeek: (t: number) => void;
  label: string;
}) {
  const max = duration || 1;
  return (
    <input
      type="range"
      min={0}
      max={max}
      step={0.5}
      value={Math.min(time, max)}
      aria-label={label}
      onChange={(e) => onSeek(Number(e.target.value))}
      className="audio-scrub h-1 w-full cursor-pointer appearance-none rounded-full bg-line"
      style={{
        backgroundImage: `linear-gradient(var(--color-accent), var(--color-accent))`,
        backgroundSize: `${(Math.min(time, max) / max) * 100}% 100%`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

/**
 * The player at the head of an essay. Owns no audio of its own — every control
 * talks to the single element in <AudioProvider>, which is what lets playback
 * survive a navigation away from this page.
 */
/** A visible acknowledgement of the voice model, when its license asks for one. */
export interface NarrationCredit {
  label: string;
  href: string;
}

export function EssayPlayer({ track, credit }: { track: AudioTrack; credit?: NarrationCredit }) {
  const {
    track: current,
    playing,
    time,
    duration,
    rate,
    loading,
    toggle,
    seek,
    skip,
    setRate,
    unavailable,
    markUnavailable,
    setInlineVisible,
  } = useAudio();
  const box = useRef<HTMLDivElement>(null);
  const isUnavailable = unavailable.has(track.id);

  // Report whether this player is on screen, so the mini player can slide in
  // once the reader scrolls past it and slide out when they scroll back.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInlineVisible(entry?.isIntersecting ?? false);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      setInlineVisible(null);
    };
  }, [isUnavailable, setInlineVisible]);

  // The manifest proves audio was generated, not that it was published. Ask the
  // server before trusting it, so an essay whose mp3 never reached storage ends up
  // with no player at all. Shown optimistically while the check runs: hiding it
  // until then would push every article down on every load, and a missing file
  // is the rare case.
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(track.src, { method: "HEAD", signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) markUnavailable(track.id);
      })
      .catch((err: unknown) => {
        if ((err as { name?: string } | null)?.name !== "AbortError") markUnavailable(track.id);
      });
    return () => ctrl.abort();
  }, [track.src, track.id, markUnavailable]);

  if (isUnavailable) return null;

  const active = current?.id === track.id;
  const at = active ? time : 0;
  const total = active && duration ? duration : track.duration;

  return (
    <div ref={box} className="my-8 border-y border-line py-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => toggle(track)}
          aria-label={active && playing ? `Pause ${track.title}` : `Listen to ${track.title}`}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-accent"
        >
          <PlayIcon playing={active && playing} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="font-mono text-meta uppercase tracking-wider text-muted">
              {active && loading ? "Loading…" : "Listen to this essay"}
            </span>
            <span className="font-mono text-meta tabular-nums text-muted">
              {clock(at)} / {clock(total)}
            </span>
          </div>
          <Scrubber
            time={at}
            duration={total}
            label={`Seek within ${track.title}`}
            onSeek={(t) => {
              if (!active) toggle(track);
              seek(t);
            }}
          />
        </div>

        <div className="flex flex-none items-center gap-1">
          <button
            type="button"
            onClick={() => skip(-15)}
            disabled={!active}
            aria-label="Back 15 seconds"
            className="rounded px-2 py-1 font-mono text-meta text-muted transition-colors hover:text-ink disabled:opacity-40"
          >
            −15s
          </button>
          <button
            type="button"
            onClick={() => setRate(RATES[(RATES.indexOf(rate as 1) + 1) % RATES.length]!)}
            aria-label={`Playback speed, currently ${rate} times`}
            className="rounded px-2 py-1 font-mono text-meta tabular-nums text-muted transition-colors hover:text-ink"
          >
            {rate}×
          </button>
        </div>
      </div>
      {credit && (
        <p className="mt-3 font-mono text-meta text-muted">
          Narrated with{" "}
          <a
            href={credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
          >
            {credit.label}
          </a>{" "}
          on Hugging Face
        </p>
      )}
    </div>
  );
}
