"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * One <audio> element for the whole site.
 *
 * It is mounted by the root layout, which the App Router keeps alive across
 * client-side navigations — so narration continues while the reader moves to
 * another essay. Every player on the page is only a set of controls pointed at
 * this element; nothing else is allowed to own an <audio> tag.
 */

export interface AudioTrack {
  /** Essay slug — identity for "is this the thing currently loaded". */
  id: string;
  src: string;
  title: string;
  /** Where the track came from, so the mini player can link back. */
  href: string;
  /** Seconds, from the generator's manifest. Used before metadata loads. */
  duration: number;
}

interface AudioState {
  track: AudioTrack | null;
  playing: boolean;
  time: number;
  duration: number;
  rate: number;
  /** True between a play() call and the first frame of audio. */
  loading: boolean;
  play: (track: AudioTrack) => void;
  toggle: (track: AudioTrack) => void;
  pause: () => void;
  seek: (seconds: number) => void;
  skip: (delta: number) => void;
  setRate: (rate: number) => void;
  close: () => void;
  /** Essays whose narration could not be loaded. Both players hide for these. */
  unavailable: ReadonlySet<string>;
  markUnavailable: (id: string) => void;
  /**
   * Whether the header player on the current page is on screen. Null when the
   * page has no header player, or it has not reported yet. The mini player
   * docks on the loaded essay's own page once this turns false.
   */
  inlineVisible: boolean | null;
  setInlineVisible: (visible: boolean | null) => void;
}

const Ctx = createContext<AudioState | null>(null);

const RATES = [1, 1.25, 1.5, 1.75, 2] as const;
const POSITION_KEY = "essay-audio-position";
const SESSION_KEY = "essay-audio-session";

export function useAudio(): AudioState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [track, setTrack] = useState<AudioTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRateState] = useState(1);
  const [loading, setLoading] = useState(false);
  const [unavailable, setUnavailable] = useState<ReadonlySet<string>>(() => new Set());
  const [inlineVisible, setInlineVisible] = useState<boolean | null>(null);
  const markUnavailable = useCallback((id: string) => {
    setUnavailable((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  // Remember where the listener got to, per essay, so returning to a page
  // resumes rather than restarting. Per-browser only; never leaves the device.
  const positions = useRef<Record<string, number>>({});
  useEffect(() => {
    try {
      positions.current = JSON.parse(sessionStorage.getItem(POSITION_KEY) ?? "{}");
    } catch {
      positions.current = {};
    }
  }, []);

  const remember = useCallback((id: string, at: number) => {
    positions.current[id] = at;
    try {
      sessionStorage.setItem(POSITION_KEY, JSON.stringify(positions.current));
    } catch {
      /* private mode — resuming is a nicety, not a requirement */
    }
  }, []);

  const play = useCallback(
    (next: AudioTrack) => {
      const el = ref.current;
      if (!el) return;
      if (track?.id !== next.id) {
        if (track) remember(track.id, el.currentTime);
        setTrack(next);
        setDuration(next.duration);
        el.src = next.src;
        const resumeAt = positions.current[next.id] ?? 0;
        el.currentTime = resumeAt;
        setTime(resumeAt);
      }
      el.playbackRate = rate;
      setLoading(true);
      void el.play().catch(() => setLoading(false));
    },
    [track, rate, remember],
  );

  const pause = useCallback(() => {
    ref.current?.pause();
  }, []);

  const toggle = useCallback(
    (next: AudioTrack) => {
      if (track?.id === next.id && playing) pause();
      else play(next);
    },
    [track, playing, play, pause],
  );

  const seek = useCallback((seconds: number) => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(seconds, el.duration || seconds));
    setTime(el.currentTime);
  }, []);

  const skip = useCallback((delta: number) => {
    const el = ref.current;
    if (el) seekTo(el, el.currentTime + delta, setTime);
  }, []);

  const setRate = useCallback((next: number) => {
    setRateState(next);
    if (ref.current) ref.current.playbackRate = next;
  }, []);

  const close = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.pause();
      if (track) remember(track.id, el.currentTime);
    }
    setTrack(null);
    setPlaying(false);
    // Dismissing is a decision, not a pause: don't resurrect this on the next load.
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* private mode */
    }
  }, [track, remember]);

  // Persist progress on unload as well as on track switch, and record which
  // track was loaded so a *hard* load (refresh, new tab, a link in from
  // elsewhere) can put the listener back where they were.
  useEffect(() => {
    const onLeave = () => {
      const el = ref.current;
      if (!el || !track) return;
      remember(track.id, el.currentTime);
      try {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ track, time: el.currentTime, rate: el.playbackRate }),
        );
      } catch {
        /* private mode */
      }
    };
    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, [track, remember]);

  // Restore that track on mount — cued up and paused, never auto-playing.
  // Browsers block playback without a fresh user gesture, and a page that
  // starts talking on load would be obnoxious even where it is permitted.
  useEffect(() => {
    let raw: string | null = null;
    try {
      raw = sessionStorage.getItem(SESSION_KEY);
    } catch {
      return;
    }
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { track: AudioTrack; time: number; rate?: number };
      if (!saved?.track?.src) return;
      const el = ref.current;
      if (!el) return;
      setTrack(saved.track);
      setDuration(saved.track.duration);
      setTime(saved.time ?? 0);
      el.src = saved.track.src;
      el.currentTime = saved.time ?? 0;
      if (saved.rate) {
        setRateState(saved.rate);
        el.playbackRate = saved.rate;
      }
    } catch {
      /* malformed — start clean */
    }
  }, []);

  const value = useMemo<AudioState>(
    () => ({
      track,
      playing,
      time,
      duration,
      rate,
      loading,
      play,
      toggle,
      pause,
      seek,
      skip,
      setRate,
      close,
      unavailable,
      markUnavailable,
      inlineVisible,
      setInlineVisible,
    }),
    [
      track,
      playing,
      time,
      duration,
      rate,
      loading,
      play,
      toggle,
      pause,
      seek,
      skip,
      setRate,
      close,
      unavailable,
      markUnavailable,
      inlineVisible,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* No <track>: this is a spoken rendering of the page's own prose, which is
          already on screen as text — the article is the transcript. */}
      <audio
        ref={ref}
        preload="none"
        onPlay={() => {
          setPlaying(true);
          setLoading(false);
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false);
          if (track) remember(track.id, 0);
        }}
        onError={() => {
          // The manifest promised audio the server cannot deliver — most often an
          // essay narrated locally but never published. Hide both players for it
          // rather than leave a control that silently does nothing.
          if (!track) return;
          markUnavailable(track.id);
          setTrack(null);
          setPlaying(false);
          setLoading(false);
          try {
            sessionStorage.removeItem(SESSION_KEY);
          } catch {
            /* private mode */
          }
        }}
      />
    </Ctx.Provider>
  );
}

function seekTo(el: HTMLAudioElement, to: number, set: (t: number) => void) {
  el.currentTime = Math.max(0, Math.min(to, el.duration || to));
  set(el.currentTime);
}

export { RATES };
