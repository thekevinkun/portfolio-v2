# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-07
**Current phase / step:** P2.9 (manual device pass)
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
- [x] P2.7 Dock ring
- [x] P2.8 A11y
- [ ] P2.9 Manual device pass

---

## Decisions since last update

- D20–D23 — see CLAUDE.md §10 (D12–D19 moved there).
- D24 — see CLAUDE.md §10.
- D25–D26 — see CLAUDE.md §10.
- D27–D28: see CLAUDE.md §10.
- D29–D31: see CLAUDE.md §10.
- D32–D33: see CLAUDE.md §10.
- D34–D35: see CLAUDE.md §10.
- D36–D38: see CLAUDE.md §10.

## Open questions

- O1 Phones: inner scroll allowed?
- O2 Tech Stack top-right toggle
- O3 Experience + Get In Touch layouts
- O4 Bilingual EN/ID
- O5 Domain
- O6 Real location/timezone in footer

## Known issues

- Placeholder panels use <h2>; the heading structure (one h1 vs five) is settled in P3.3.
- Every real panel (P3) must give its heading the id heading-<section id> (D37).

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

### Handoff — 2026-10-07 — P2.8
Done:
- Polite live region for page turns, focus moves to the new page heading, reduced-motion crossfade (jump + 150ms fade-in)
Files created/changed:
- lib/stage/{config,section-title,useStageFocus}.ts; components/stage/{StageLiveRegion,StageFocus,index}; app/(site)/[[...section]]/layout.tsx; app/globals.css
Decisions:
- D36 live region · D37 focus management + heading id contract · D38 reduced-motion crossfade
Verified (viewports / devices):
- <fill in: 1440×900 keyboard-only run, console activeElement checks, reduced-motion emulation, 4× throttle, screen reader if available>
Known issues:
- Heading focus + live region can both speak (double announce); evaluate in P2.9
- Dock Enter moves focus to the page heading (follows spec); refine in P2.9 if it feels wrong
- Real panels must expose heading id heading-<section id> (P3)
Next step (ID + one-line goal):
- P2.9 — manual device pass, tune config values, final fixes
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Phase: P2. Step: P2.9. Mode: Build. Goal: Run the Stage manual checklist on real devices and fix what it finds; I will paste the findings.

### Handoff — 2026-10-07 — P2.7
Done:
- Dock ring glides between tiles (shared layoutId + spring), ring carries the ping/glow dot with an arrival delay, motion added with async domMax
Files created/changed:
- package.json + lockfile; lib/motion-features.ts; lib/stage/config.ts; components/chrome/{Dock,DockTile}.tsx; app/globals.css
Decisions:
- D34 ring as its own shared-layout element, unscaled wrapper · D35 motion dependency, async domMax, m from motion/react-m
Verified (viewports / devices):
- <fill in: 1440×900 all inputs, retarget mid-flight, reduced-motion emulation, 4× throttle, motion chunk loads after first render>
Known issues:
- TabBar indicator does not glide (static)
- A hover lift in progress when a glide starts can pop the ring by ~4px
- Spring numbers are estimates; taste tuning in P2.9
Next step (ID + one-line goal):
- P2.8 — live region, focus management, reduced-motion crossfade
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Phase: P2. Step: P2.8. Mode: Build. Goal: Polite live region, focus management after a page turn, and the reduced-motion crossfade (shorter duration token + fade-in).

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
- P2.5: implemented `replaceState` URL/title sync and Stage-driven active tiles; D29 URL/title sync, D30 canonical deferral to P4.5, and D31 `useActiveSection` pulled forward.

### Handoff — 2026-10-07 — P2.4
- P2.4: implemented keyboard paging, touch swipe, and Dock/TabBar Stage navigation via `useStageNav`; D27 real href interception and D28 input behavior established.

### Handoff — 2026-10-07 — P2.3
- P2.3: implemented custom wheel intent machine, scroll guard, `useStageWheel` on `window`, and `overscroll-behavior: none`; D25 wheel handling and D26 camelCase hook naming established.

### Handoff — 2026-10-07 — P2.2
- P2.2: implemented Stage reducer/provider, CSS track transition, placeholder panels and inert handling; D24 established StageProvider in the section layout.

### Handoff — 2026-10-06 — P2.1 (plan chat)
- P2.1 plan: locked Stage thresholds, transition spec, URL strategy, a11y spec; split P2.2–P2.9 into commit-sized steps. See prior handoff for full details.

_Newest first. Keep the last 3 entries in full; collapse older ones to one line each._
