---
name: work-on-board-task
description: Pick up and deliver a task from the "website" Trello board. Use this whenever the user asks to take, start, pick up, grab, or continue a task from the board, backlog, or Trello — e.g. "take the first task", "work on the next task that can be implemented", "start card #4", "what should be worked on next" — even if they don't say "Trello" explicitly. Covers task selection (unblocked TODO cards only), board hygiene (INPROGRESS → INREVIEW → DONE moves), branching, opening the PR, and reporting what changed back on the card.
---

# Working on a task from the website board

The project's tasks live on the "website" Trello board. This skill describes the full
lifecycle: pick an implementable card, keep the board in sync with reality, ship the
work as a PR, and leave a record of what changed on the card.

## The board

- Board: https://trello.com/b/PT63MPoF/website
- Board ARI: `ari:cloud:trello::board/workspace/60c15f214584f367dac792a7/6a614262a502b8f34a7304d4`
- Lists (position order):

| List | ARI suffix | Meaning |
|---|---|---|
| DRAFT | `6a614378133b75a472a64cc7` | Not fully specced — never pick from here |
| TODO | `6a61437b5b261024f1770d1c` | Ready to be picked up |
| INPROGRESS | `6a61437ea526e0359ba35abd` | Someone is actively working on it |
| INREVIEW | `6a6143819c2e2f5199be426f` | PR open, awaiting review |
| DONE | `6a6143849bf035cb88b710b5` | Merged / finished |

Full list ARIs are `ari:cloud:trello::list/workspace/60c15f214584f367dac792a7/<suffix>`.
Use the Trello MCP tools (`mcp__Trello__trelloReadCard`, `mcp__Trello__trelloWriteCard`,
etc. — load them via ToolSearch if they aren't in context). If an ARI here ever fails,
re-discover the board with `trelloReadBoard`/`trelloReadList` rather than guessing —
the board may have been reorganized.

## Picking a card

1. List the cards with `trelloReadCard` (`action: "list_by_board"`).
2. Consider only the TODO list. DRAFT cards are not ready; INPROGRESS cards are taken.
3. Read each candidate's description — cards document **Dependencies** and **Blocks**
   at the bottom. A card is *not* implementable when:
   - a hard blocker ("hard blocker", "Blocks: …" pointing at it from an unfinished
     card) is not yet in DONE, or
   - the remaining work needs access the session doesn't have (e.g. a hosting
     dashboard, an external account signup). Soft dependencies ("soft", "coordinate
     with") don't block — just note them and avoid conflicting changes.
4. Take the **first implementable card in list order** unless the user names one.
5. Immediately move it to INPROGRESS (`trelloWriteCard`, `action: "move"`) — before
   writing any code, so the board reflects reality while the work happens.

## Branch, implement, verify

- Work on a fresh branch cut from the latest `origin/main`. If the session/harness
  designates a branch, use that one; otherwise name it `claude/<short-card-slug>`.
- Implement exactly the card's **Scope** section. If the description says another card
  will handle something (e.g. "removed wholesale by card #5"), leave that thing alone
  and say so in the PR rather than doing adjacent work.
- Verify before pushing: `pnpm turbo build check-types lint --filter=<changed packages>`
  (include `storybook` when `packages/ui` or any stories changed). For content/copy
  refactors, also grep the static export in `apps/web/out/` to confirm the rendered
  output is unchanged.

## PR and reporting back

1. Commit with a clear message and push with `git push -u origin <branch>`.
2. Open a PR against `main`. The body should link the Trello card, list what changed
   and what was deliberately left out (with the why), and state how it was verified.
3. Move the card to INREVIEW.
4. Record what changed on the card. The Trello MCP has no comment action, so append a
   section to the card description (`trelloWriteCard`, `action: "update"` — pass the
   full description, it replaces the old one):

   ```
   ---

   **✅ Implemented — in review:** <PR url>

   What changed (<date>, by Claude):
   - <bullet summary of the changes>
   - <anything deliberately left out, and why>
   - Verified: <build/lint/test results>
   ```

   Keep the description under Trello's 2048-char limit — condense the original text
   (drop "Current state" prose that the implementation made stale) before appending
   if needed.
## Watching the PR

Opening the PR is not the end of the task — drive it to merged. Immediately after
opening it, call `subscribe_pr_activity` (owner, repo, pull number). Events then
arrive in the session as `<github-webhook-activity>` messages; never poll or `sleep`
while waiting.

Handle each event:

- **Review comment / requested change** — address it: push the fix if it's right and
  in scope, or reply on the thread explaining why not (with the attribution footer).
  Every reviewer request gets a visible outcome — a commit or a reply, never silence.
- **CI failure** — diagnose and push a fix; repeat on each new failure until green.
  If the same failure reproduces on `main` (pre-existing), say so once on the thread
  instead of "fixing" it, and re-check when the base recovers.
- **Merge conflict notice** — merge the latest `main` into the branch, resolve,
  re-run the local checks, push.
- **Echoes of your own comments, or duplicates** of something already handled — skip
  silently.

Don't narrate every push with a PR comment — the diff is the record. Comment when a
round resolves the review, hits a real blocker, or needs the reviewer's input.

Webhooks miss some transitions (CI success, merges), so before ending the turn,
schedule a self check-in with `send_later` (~1 hour out): re-check PR state and CI,
act on anything actionable, re-arm the next check-in silently if nothing changed.

When the PR **merges**: move the card to DONE, unsubscribe (`unsubscribe_pr_activity`),
and stop the check-ins. If the PR is closed unmerged, unsubscribe and move the card
back to TODO (or INPROGRESS if continuing another way) with a note on the card
explaining what happened.
