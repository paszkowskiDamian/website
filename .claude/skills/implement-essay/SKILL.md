---
name: implement-essay
description: Implement a blog essay from a Notion draft on this website — fetch the draft, add it as an MDX essay with PullQuote highlights, verify the build, push, open a PR, and watch that PR for review comments and CI failures until it's merged. Use this whenever the user shares a Notion link to an essay, draft, concept, or blog idea and wants it implemented, published, added to the site, or turned into a PR — even if they don't say "essay" explicitly (e.g. "take my draft live", "add this post to the blog", "implement this from Notion").
---

# Implement an essay from a Notion draft

Turn a Notion essay draft into a published-ready MDX essay on this site, delivered as a
watched pull request. The whole job has three acts: **get the draft**, **implement it
well**, and **shepherd the PR** until it's merged.

## 1. Fetch the draft from Notion

- Fetch the Notion URL with `notion-fetch` (load via ToolSearch if needed). If the URL
  contains a `?p=<id>` parameter, that id is the actual draft page — fetch it directly;
  the base URL is just the database/home page around it.
- Draft pages usually contain concept scaffolding (Thesis, Rough outline, Open
  questions) *and* a polished section like "Draft (first pass)". **Publish only the
  polished draft text.** Never include sections marked "not for publication",
  draft notes, outlines, or open questions.
- Note the page's properties (Title, Topic, Type, Status) — they inform frontmatter.

## 2. Create the MDX essay

Add one file: `apps/web/content/essays/<slug>.mdx`, where the slug is the
kebab-cased title. Frontmatter must match what `apps/web/lib/content.ts` requires
(look at the neighboring essays for live examples):

```yaml
---
title: <title from Notion>
date: <today, YYYY-MM-DD>
excerpt: <one sentence capturing the thesis — often a line from the draft itself>
readTime: <round(word count / 220)> min read
category: <reuse an existing category from the other essays when one fits>
tags:
  - <2–3 short tags>
---
```

Leave `featured` unset unless the user asks — setting it displaces the current
homepage feature. `heroImage`/`heroAlt`/`heroCaption` are optional.

### Rich quotes (PullQuote)

Highlight the essay's key moments with the `<PullQuote>` MDX component
(see `apps/web/lib/mdx-components.tsx`):

```mdx
<PullQuote
  quote="When you're a carpenter making a beautiful chest of drawers…"
  attribution="Steve Jobs, in Walter Isaacson's biography"
/>

<PullQuote quote="Garbage context in, garbage code out." />
```

- Use one for any real quotation with a source (pass `attribution`), pulled out of
  the paragraph rather than duplicated inline.
- Use one or two more for the essay's best standalone one-liners — usually a
  section's closing line. Omit `attribution` for the author's own words; the
  component hides the dash when there's no attribution.
- Two to three pull quotes per essay is the sweet spot; more dilutes them.

### Typography the reviewer will check

The site owner reviews rendered pages, not source. Known feedback patterns:

- **No orphan words.** A single word alone on a paragraph's last line will get
  flagged, especially in the opening paragraph (which renders with a drop cap).
  Bind the final two words with `&nbsp;` (e.g. `would ever&nbsp;see.`) — MDX
  renders it as a real non-breaking space — and keep opening sentences tight.

## 3. Verify the build

From the repo root: `pnpm install --frozen-lockfile` (if needed) then `pnpm build`.
Confirm the build output lists the new route under `/essays/<slug>`. When a change
affects rendering (quotes, entities), grep the exported HTML in `apps/web/out/` to
confirm it rendered as intended.

## 4. Ship it

- Commit the new essay (and nothing unrelated) with a descriptive message and push
  to the session's designated branch.
- Open a PR against `main` (GitHub MCP `create_pull_request`). Body: what the essay
  is, where it came from (Notion), which lines are pull-quoted, the frontmatter
  choices you made (date, category, featured or not), and that the build passes.

## 5. Watch the PR until merged

- Subscribe with `subscribe_pr_activity` for the new PR, then check the *current*
  state immediately (`pull_request_read`: `get_check_runs`, `get_comments`,
  `get_review_comments`) — comments may predate the subscription.
- For each review comment: if it's small and unambiguous (typography, component
  tweaks, copy edits), fix it, verify in the rendered output, push, and reply once
  summarizing what changed. Ask the user only for genuinely ambiguous or
  scope-changing requests.
- For CI failures: diagnose and push a fix; never end a CI-failure wake without a
  pushed fix or a reply explaining the blocker.
- Webhooks miss some transitions (CI success, merges). If `send_later` is
  available, schedule a check-in ~1 hour out; on each firing, re-check PR state,
  act if needed, and silently re-arm until the PR is merged or closed.
