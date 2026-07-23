# web

The Next.js site for Damian Paszkowski's personal website, built as a fully static export (`output: "export"` in `next.config.js`) and deployed to Cloudflare Workers (see the root `README.md`).

## Getting started

```bash
pnpm turbo dev --filter=web
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Content

Editable copy — page text, nav, essays, projects, portfolio chapters — lives in `content/` (JSON for structured data, MDX for prose-heavy pages like essays and projects), not hardcoded in components. It's loaded through typed helpers in `lib/content.ts`; pages only render what those helpers return.

## Fonts

Fonts are loaded with `next/font/google` in `app/layout.tsx`: Archivo (sans), Newsreader (serif), and JetBrains Mono (monospace).

## Building

```bash
pnpm turbo build --filter=web
```

This emits a static export to `out/`, deployable to any static host with no Node server — see the root `README.md` for how it ships to Cloudflare.
