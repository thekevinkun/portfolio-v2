# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-07
**Current phase / step:** P2.7 (dock ring)
**Mode default:** Build

---

## Phase tracker

| Phase | Name                     | Status         | Notes                                       |
| ----- | ------------------------ | -------------- | ------------------------------------------- |
| P1    | Setup, tokens & chrome   | ✅ Done        |                                             |
| P2    | Stage engine             | 🟦 in progress | Spec locked in P2.1 (CLAUDE.md §4.2.1)      |
| P3    | Five pages (static data) | ⬜ Not started | Need Experience + Get In Touch layouts (O3) |
| P4    | Neon data → LAUNCH       | ⬜ Not started | Launch gate                                 |
| P5    | Dashboard                | ⬜ Not started |                                             |
| P6    | Polish & finish          | ⬜ Not started |                                             |

Legend: ⬜ not started · 🟦 in progress · ✅ done · ⛔ blocked

---

## Current phase checklist

- [x] P2.1 Plan chat (spec in CLAUDE.md §4.2.1)
- [x] P2.2 Reducer + track
- [x] P2.3 Wheel
- [x] P2.4 Keyboard, swipe, dock
- [x] P2.5 URL sync + SSR deep links
- [x] P2.6 Visuals
- [ ] P2.7 Dock ring
- [ ] P2.8 A11y
- [ ] P2.9 Manual device pass

---

## Decisions since last update

- D20–D23 — see CLAUDE.md §10 (D12–D19 moved there).
- D24 — see CLAUDE.md §10.
- D25–D26 — see CLAUDE.md §10.
- D27–D28: see CLAUDE.md §10.
- D29–D31: see CLAUDE.md §10.
- D32–D33: see CLAUDE.md §10.

## Open questions

- O1 Phones: inner scroll allowed?
- O2 Tech Stack top-right toggle
- O3 Experience + Get In Touch layouts
- O4 Bilingual EN/ID
- O5 Domain
- O6 Real location/timezone in footer

## Known issues

- Placeholder panels use <h2>; the heading structure (one h1 vs five) is settled in P3.3.

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

### Handoff — 2026-10-07 — P2.6
Done:
- Panel state attributes, outgoing scale/dim, incoming parallax + edge shadow, rubber-band at the first/last page (new bouncing phase)
Files created/changed:
- types/stage.ts; lib/stage/{config,motion,reducer}.ts; components/stage/{Stage,StagePanel,StageProvider,StageTrack}.tsx; app/globals.css
Decisions:
- D32 CSS-only visuals keyed off data attributes · D33 bounce as a phase, token-driven duration
Verified (viewports / devices):
- <fill in: 1440×900 + 390×844, all inputs, edge bounce with wheel/keys/swipe, reduced-motion emulation, 4× throttle>
Known issues:
- Retargeting back to a page that was mid-leave replays its parallax/shadow (small pop)
- Effects are off under reduced motion; the crossfade replacement lands in P2.8
- Visual numbers (scale, dim, parallax, shadow, bounce) are tokens in :root; final taste tuning in P2.9
Next step (ID + one-line goal):
- P2.7 — dock ring glide synced to the Stage (the active tile already follows since P2.5)
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Phase: P2. Step: P2.7. Mode: Build. Goal: Dock ring that glides between tiles (Motion LazyMotion shared layout), synced to the Stage.

### Handoff — 2026-10-07 — P2.5
Done:
- Per-section titles in server metadata, useStageUrl (replaceState + document.title on every move, any input), Dock/TabBar active tile reads Stage state
Files created/changed:
- lib/stage/{section-title,useStageUrl,useActiveSection}.ts; components/stage/{StageUrlSync,index}; app/(site)/[[...section]]/{layout,page}.tsx
Decisions:
- D29 URL + title sync from Stage state · D30 canonical moved to P4.5 · D31 useActiveSection pulled forward from P2.7
Verified (viewports / devices):
- <fill in: 1440×900 all five URLs + all input sources, 390×844, Back-button test, Network tab shows no RSC fetch on turns, 4× throttle>
Known issues:
- No edge bounce until P2.6. Canonical, sitemap and descriptions wait for P4.5 (domain, O5).
Next step (ID + one-line goal):
- P2.6 — outgoing scale/dim, parallax layer, edge shadow, rubber-band at the edges
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Phase: P2. Step: P2.6. Mode: Build. Goal: Panel state attributes, outgoing scale and dim, parallax layer, edge shadow and rubber-band at the edges.

### Handoff — 2026-10-07 — P2.4
Done:
- Keyboard paging (arrows, Page keys, Home/End, 1–5), touch swipe (axis lock, distance/flick commit), Dock and TabBar tiles drive the Stage via useStageNav
Files created/changed:
- lib/stage/{useStageKeys,useStageSwipe,useStageNav,config}.ts; components/stage/{StageInputs,Stage}.tsx; components/chrome/{Dock,DockTile,TabBar}.tsx
Decisions:
- D27 link click intercepted, real hrefs, prefetch off · D28 key repeat ignored, page keys defer to inner scroller, swipes scoped to the stage viewport
Verified (viewports / devices):
- <fill in: 1440×900 keyboard + dock, 390×844 touch emulation, real phone if available, 4× throttle>
Known issues:
- Dock/TabBar active tile and the URL still follow the URL only, not the Stage (P2.5, P2.7). No edge bounce until P2.6. Safari's screen-edge back swipe can't be blocked.
Next step (ID + one-line goal):
- P2.5 — replaceState URL sync, per-section metadata, title and canonical
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Phase: P2. Step: P2.5. Mode: Build. Goal: URL sync with replaceState, per-section metadata, document title and canonical.

### Handoff — 2026-10-07 — P2.3
- P2.3: implemented custom wheel intent machine, scroll guard, `useStageWheel` on `window`, and `overscroll-behavior: none`; D25 wheel handling and D26 camelCase hook naming established.

### Handoff — 2026-10-07 — P2.2
- P2.2: implemented Stage reducer/provider, CSS track transition, placeholder panels and inert handling; D24 established StageProvider in the section layout.

### Handoff — 2026-10-06 — P2.1 (plan chat)
- P2.1 plan: locked Stage thresholds, transition spec, URL strategy, a11y spec; split P2.2–P2.9 into commit-sized steps. See prior handoff for full details.

_Newest first. Keep the last 3 entries in full; collapse older ones to one line each._
