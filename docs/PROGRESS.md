# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** (date)
**Current phase / step:** P1.7
**Mode default:** Build

---

## Phase tracker

| Phase | Name | Status | Notes |
|---|---|---|---|
| P1 | Setup, tokens & chrome | ⬜ Not started | |
| P2 | Stage engine | ⬜ Not started | |
| P3 | Five pages (static data) | ⬜ Not started | Need Experience + Get In Touch layouts (O3) |
| P4 | Neon data → LAUNCH | ⬜ Not started | Launch gate |
| P5 | Dashboard | ⬜ Not started | |
| P6 | Polish & finish | ⬜ Not started | |

Legend: ⬜ not started · 🟦 in progress · ✅ done · ⛔ blocked

---

## Current phase checklist

- [x] P1.1 Skipped — defaults from CLAUDE.md §10 accepted
- [x] P1.2 Scaffold
- [x] P1.3 Neon + Drizzle, GitHub, Vercel deploy, docs into `docs/`
- [x] P1.4 Tokens + fonts
- [x] P1.5 Primitives + backgrounds
- [x] P1.6 TopBar + StatusFooter
- [ ] P1.7 Dock + mobile tab bar

---

## Decisions since last update

- D12 — Default branch is master; repo is portfolio-v2
- D13 — Text tokens named fg-high/medium/low/faint; accent is one token pair (accent / on-accent); motion durations are CSS variables in :root
- D14 — Pill = status capsule with optional dot; Chip = mono tag; ButtonLink handles anchors (next/link for internal, new tab for external); background layers are @utility classes in globals.css; hover/transition animates transform only, border and shadow switch instantly until the card spotlight in P3.8
- D15 — Component convention: arrow functions, default export (named when a file holds several), `export function` for non-components, per-folder `index.ts` barrels (see CLAUDE.md §7)
- D16 — Persistent chrome components live in `components/chrome/` (TopBar, StatusFooter, LiveClock, ProfileBadge; Dock joins in P1.7); placeholder profile data lives in `data/seed.ts`, typed by `types/profile.ts`, and is replaced by the DB in P4
- D17 — Clock uses `useSyncExternalStore` and wakes once per minute (no per-second re-render, no hydration mismatch); footer shows only availability, hosting note, location and year; no status or latency claims; chrome uses no `backdrop-filter` (budget kept for the dock)

## Open questions

- O1 Phones: inner scroll allowed?
- O2 Tech Stack top-right toggle
- O3 Experience + Get In Touch layouts
- O4 Bilingual EN/ID
- O5 Domain
- O6 Real location/timezone in footer

## Known issues

_None yet._

---

## Handoff template (fill at end of each chat)

```
### Handoff — <date> — <phase/steps>
Done:
-
Files created/changed:
-
Decisions:
-
Verified (viewports / devices):
-
Known issues:
-
Next step (ID + one-line goal):
-
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Phase: <id>. Step: <id>. Mode: Build. Goal: <one sentence>.
```

## Handoff log

_Newest first. Keep the last 3 entries in full; collapse older ones to one line each._
