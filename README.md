# website

Personal website of Damian Paszkowski — a Turborepo monorepo with a Next.js static-export site in `apps/web`.

## What's inside?

- `apps/web` — the site itself: a Next.js app using the App Router, built as a fully static export (`output: "export"`). Editable copy lives in `apps/web/content/` (JSON + MDX), loaded through typed helpers in `apps/web/lib/content.ts`.
- `apps/storybook` — Storybook for the shared `@repo/ui` component library.
- `packages/ui` — the shared React component library (atoms/molecules) used by `apps/web` and documented in Storybook.
- `packages/eslint-config` — shared `eslint` configuration.
- `packages/typescript-config` — shared `tsconfig.json` bases.

Everything is TypeScript, managed with pnpm workspaces and Turborepo.

## Develop

```sh
pnpm install
pnpm turbo dev --filter=web       # site at http://localhost:3000
pnpm turbo dev --filter=storybook # component docs
```

## Build

```sh
pnpm turbo build                  # everything
pnpm turbo build --filter=web     # just the site → apps/web/out
```

Other common tasks: `pnpm turbo lint`, `pnpm turbo check-types`, all filterable the same way.

## Deployment

The site (`apps/web`, a Next.js static export) is deployed with [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/):

- **Production:** every push to `main` builds with `pnpm turbo build --filter=web` and deploys `apps/web/out` via `npx wrangler deploy` (config in `wrangler.jsonc`).
- **PR previews:** non-production branches run `npx wrangler versions upload`, and Cloudflare posts a preview URL + build status on the pull request.
