"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAudio } from "./audio-provider";
import { clock, PlayIcon } from "./essay-player";

/**
 * Docked bar shown once the reader has navigated away from the essay they are
 * listening to. On the essay's own page the header player is the control, so
 * this stays hidden to avoid two sets of transport buttons for one stream.
 */
export function MiniPlayer() {
  const { track, playing, time, duration, pause, play, close } = useAudio();
  const pathname = usePathname();

  if (!track) return null;
  const here = pathname === track.href || pathname === `${track.href}/`;
  if (here) return null;

  const total = duration || track.duration;
  const pct = total ? Math.min(100, (time / total) * 100) : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="h-0.5 w-full bg-line">
        <div className="h-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-6 py-3">
        <button
          type="button"
          onClick={() => (playing ? pause() : play(track))}
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
            href={track.href}
            className="block truncate text-[15px] font-semibold text-ink hover:text-accent"
          >
            {track.title}
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
