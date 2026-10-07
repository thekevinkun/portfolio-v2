# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-07
**Current phase / step:** P2.4 (keyboard, swipe, dock)
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
- [ ] P2.4 Keyboard, swipe, dock
- [ ] P2.5 URL sync + SSR deep links
- [ ] P2.6 Visuals
- [ ] P2.7 Dock ring
- [ ] P2.8 A11y
- [ ] P2.9 Manual device pass

---

## Decisions since last update

- D20–D23 — see CLAUDE.md §10 (D12–D19 moved there).
- D24 — see CLAUDE.md §10.
- D25–D26 — see CLAUDE.md §10.

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

### Handoff — 2026-10-07 — P2.3
Done:
- Pure wheel intent machine (notch vs stream, accumulator, locks, new-gesture detection), scroll guard, useStageWheel on window, StageInputs mounted in the section layout, overscroll-behavior none
Files created/changed:
- lib/stage/{config,wheel-intent,scroll-guard,useStageWheel}.ts; components/stage/{StageInputs,index}; app/(site)/[[...section]]/layout.tsx; app/globals.css
Decisions:
- D25 wheel on window + per-gesture exemption · D26 camelCase hook files
Verified (viewports / devices):
- <fill in: mouse, Mac trackpad, Windows touchpad, 1440×900, 390×844, 4× throttle>
Known issues:
- Thresholds are still estimates; final tuning in P2.9. No edge bounce until P2.6.
Next step (ID + one-line goal):
- P2.4 — keyboard, touch swipe, dock and tab bar drive the stage
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Phase: P2. Step: P2.4. Mode: Build. Goal: Keyboard navigation, touch swipe, and Dock/TabBar links driving the Stage. (Also paste components/chrome/Dock.tsx, DockTile.tsx, TabBar.tsx and lib/stage/useActiveSection.ts.)

### Handoff — 2026-10-07 — P2.2
Done:
- Stage types, config, reducer (phases, gesture lock), provider + useStage, track/panels with CSS transform transition, inert handling, placeholder panels
Files created/changed:
- types/stage.ts; lib/stage/{config,motion,section-index,reducer,stage-context}.ts; components/stage/*; components/panels/*; app/(site)/[[...section]]/{layout,page}.tsx (layout moved from app/(site)/)
Decisions:
- D24 provider in the section layout
Verified (viewports / devices):
- 1440×900 and 390×844 via temporary buttons (not committed); 4× throttle; direct load of /projects
Known issues:
- Dock still URL-based until P2.7
Next step (ID + one-line goal):
- P2.3 — custom wheel intent machine, one page per gesture
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Phase: P2. Step: P2.3. Mode: Build. Goal: Wheel intent state machine, scroll guard and useStageWheel hook driving the Stage.

### Handoff — 2026-10-06 — P2.1 (plan chat)

Done:

- Locked Stage thresholds, transition spec, URL strategy, a11y spec
- Split P2.2–P2.9 into commit-sized steps
  Files created/changed:
- docs/CLAUDE.md (status, §3, §4.2, §4.2.1, §10), docs/ROADMAP.md (P2.3), docs/PROGRESS.md
  Decisions:
- D20 custom input code, no @use-gesture · D21 CSS track transition on motion tokens · D22 replaceState, no back/forward input, real links · D23 gesture lock, discrete retarget
  Verified (viewports / devices):
- n/a (docs only)
  Known issues:
- Trackpad thresholds are estimates; tuned in P2.9
  Next step (ID + one-line goal):
- P2.2 — stage reducer, provider, track and placeholder panels
  Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Phase: P2. Step: P2.2. Mode: Build. Goal: Stage reducer, provider and track with placeholder panels and a CSS transform transition.

_Newest first. Keep the last 3 entries in full; collapse older ones to one line each._
