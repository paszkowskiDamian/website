"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAudio, type AudioTrack } from "./audio-provider";
import { clock, PlayIcon } from "./essay-player";

/**
 * Docked bar at the bottom of the viewport. It slides up whenever the header
 * player cannot be seen: on any page other than the essay being listened to,
 * and on that essay's own page once the reader has scrolled past its header
 * player. It slides back down when the header player comes back into view or
 * the track is closed, so only one set of transport buttons is on screen.
 */
export function MiniPlayer() {
  const { track, playing, time, duration, pause, play, close, inlineVisible } = useAudio();
  const pathname = usePathname();

  // Keep the last track after it is closed, so the bar still has content while
  // it slides out.
  const [shown, setShown] = useState<AudioTrack | null>(track);
  if (track && track !== shown) setShown(track);

  // Start below the viewport and move up on the next frame, so the first
  // appearance slides in too.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!shown) return;
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [shown]);

  if (!shown) return null;

  const here = pathname === shown.href || pathname === `${shown.href}/`;
  // On the essay's own page, stay down until the header player has reported
  // (null) and while it is on screen (true).
  const docked = entered && track !== null && (!here || inlineVisible === false);

  const total = duration || shown.duration;
  const pct = total ? Math.min(100, (time / total) * 100) : 0;

  return (
    <div
      aria-hidden={!docked}
      inert={!docked}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur transition-transform duration-300 ease-out supports-[backdrop-filter]:bg-paper/80 motion-reduce:transition-none ${
        docked ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="h-0.5 w-full bg-line">
        <div className="h-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-6 py-3">
        <button
          type="button"
          onClick={() => (playing ? pause() : play(shown))}
          aria-label={playing ? "Pause narration" : "Resume narration"}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-accent"
        >
          <PlayIcon playing={playing} />
        </button>

        <div className="min-w-0 flex-1">
          <span className="block font-mono text-meta uppercase tracking-wider text-muted">
            {playing ? "Now playing" : "Paused"}
          </span>
          <Link
            href={shown.href}
            className="block truncate text-[15px] font-semibold text-ink hover:text-accent"
          >
            {shown.title}
          </Link>
        </div>

        <span className="flex-none font-mono text-meta tabular-nums text-muted">
          {clock(time)} / {clock(total)}
        </span>

        <button
          type="button"
          onClick={close}
          aria-label="Close player"
          className="flex-none rounded px-2 py-1 font-mono text-meta text-muted transition-colors hover:text-ink"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
