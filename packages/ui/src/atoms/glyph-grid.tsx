"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = [
  "+", "×", "·", "^", "v", "<", ">", "/", "\\", "[", "]", ":", "⌃", "⌄", "⌵", "{", "}", "—", "x", ".",
];

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!;
}

/* mulberry32 — the initial grid must be seeded, not Math.random(): pages are
 * prerendered to static HTML, so the first client render has to reproduce the
 * server's glyphs exactly or React reports a hydration mismatch. */
function mulberry32(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Cell {
  glyph: string;
  hot: boolean;
}

function makeGrid(cols: number, rows: number, seed: number): Cell[][] {
  const rnd = mulberry32(seed);
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      glyph: GLYPHS[Math.floor(rnd() * GLYPHS.length)]!,
      hot: false,
    })),
  );
}

/** Fixed width/height per cell, in `ch`/line-heights — glyphs cycle inside a
 * box that never resizes, even when a glyph falls back to a different font
 * with different metrics (some of the rarer symbols aren't in every
 * monospace font's own glyph set). */
const CELL_WIDTH_CH = 1.4;
const LINE_HEIGHT = 1.5;

export interface GlyphGridProps {
  cols: number;
  rows: number;
  /** Varies the initial pattern between grids that share the same cols/rows. */
  seed?: number;
  /** Milliseconds between refresh ticks. Set to 0 for a static, non-animated grid. */
  interval?: number;
  /** Text color utility for the resting (non-hot) glyphs. Defaults to the brand accent. */
  baseClassName?: string;
  /** Text color utility for momentarily-highlighted glyphs. Defaults to ink. */
  hotClassName?: string;
  className?: string;
}

/**
 * The brand's signature texture: folk-ornament patterns rebuilt as a cycling
 * grid of monospace glyphs. Used for rails, dividers, and background fields.
 */
export function GlyphGrid({
  cols,
  rows,
  seed = 7,
  interval = 280,
  baseClassName = "text-accent/90",
  hotClassName = "text-ink",
  className,
}: GlyphGridProps) {
  const [grid, setGrid] = useState<Cell[][]>(() =>
    makeGrid(cols, rows, seed + cols * 31 + rows * 131),
  );
  const gridRef = useRef(grid);
  gridRef.current = grid;

  useEffect(() => {
    setGrid(makeGrid(cols, rows, seed + cols * 31 + rows * 131));
  }, [cols, rows, seed]);

  useEffect(() => {
    if (!interval) return;
    // Purely decorative animation — halt it entirely for users who ask for
    // reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const next = gridRef.current.map((row) =>
        row.map((cell) => ({ ...cell, hot: false })),
      );
      const flips = Math.max(1, Math.round((rows * cols) / 30));
      for (let i = 0; i < flips; i++) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        next[r]![c] = { glyph: randomGlyph(), hot: Math.random() < 0.3 };
      }
      setGrid(next);
    }, interval);
    return () => clearInterval(id);
  }, [cols, rows, interval]);

  return (
    <div
      aria-hidden="true"
      className={`select-none font-mono text-sm font-bold tracking-[0.1em] ${className ?? ""}`}
      style={{
        width: `${cols * CELL_WIDTH_CH}ch`,
        height: `${rows * LINE_HEIGHT}em`,
        overflow: "hidden",
      }}
    >
      {grid.map((row, ri) => (
        <div key={ri} className="flex" style={{ lineHeight: LINE_HEIGHT, height: `${LINE_HEIGHT}em` }}>
          {row.map((cell, ci) => (
            <span
              key={ci}
              className={`inline-block overflow-hidden text-center transition-colors duration-500 ${
                cell.hot ? hotClassName : baseClassName
              }`}
              style={{ width: `${CELL_WIDTH_CH}ch` }}
            >
              {cell.glyph}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
