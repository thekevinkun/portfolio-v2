# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-10
**Current phase / step:** P3.9
**Mode default:** Build

---

## Phase tracker

| Phase | Name                     | Status         | Notes                                       |
| ----- | ------------------------ | -------------- | ------------------------------------------- |
| P1    | Setup, tokens & chrome   | ✅ Done        |                                             |
| P2    | Stage engine             | ✅ Done | Device pass passed (P2.9); spec in CLAUDE.md §4.2.1      |
| P3    | Five pages (static data) | 🟦 in progress | P3.1–P3.8 done; fit QA next |
| P4    | Neon data → LAUNCH       | ⬜ Not started | Launch gate                                 |
| P5    | Dashboard                | ⬜ Not started |                                             |
| P6    | Polish & finish          | ⬜ Not started |                                             |

Legend: ⬜ not started · 🟦 in progress · ✅ done · ⛔ blocked

---

## Current phase checklist

- [x] P3.1 Design chat: Experience + Get In Touch layouts, settle O1–O3 and O6, density tiers
- [x] P3.2 Typed static data + data/seed.ts for the 4 tables
- [x] P3.3 Overview
- [x] P3.4 Tech Stack
- [x] P3.5 Projects
- [x] P3.6 Experience
- [x] P3.7 Get In Touch
- [x] P3.8 Entrance choreography + card spotlight
- [ ] P3.9 Fit QA at all 8 viewports

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
- D39: see CLAUDE.md §10.
- D40–D43: see CLAUDE.md §10.
- D44–D46: see CLAUDE.md §10.
- D47–D50: see CLAUDE.md §10.
- D51–D53: see CLAUDE.md §10.
- D54–D59: see CLAUDE.md §10.

## Open questions

- O4 Bilingual EN/ID
- O5 Domain

## Known issues

- P3 contract from the Stage: every panel's heading must have the id `heading-<section id>` (D37); inner scrollers get `data-stage-scroll`, and the carousel gets `data-stage-swipe-ignore` (R2)
- Retargeting back to a page that was mid-leave replays its parallax/shadow (small pop)
- A hover lift in progress when the dock ring starts to glide can pop the ring by ~4px
- TabBar indicator does not glide (static)
- Heading focus and the live region can both speak (double announce); full screen-reader pass in P6.3
- Canonical, sitemap and descriptions wait for P4.5 (domain, O5)
- Tier thresholds (500 / 640 px panel height) are estimates; 1280×720 may keep the intro; tune in P3.9
- Top-bar badge still uses the placeholder avatar SVG, not the portrait
- Overview chips and focus areas are new profile columns; add them in the P4.2 schema
- Firefox only: a brief white outline flashes around a dock tile while it scales on hover (cosmetic, left unresolved; Chrome is fine)
- Chainkuns / DarkMint marked `live`: confirm testnet vs mainnet before launch (R4)
- Tech Stack header copy and bottom strip in the reference HTML contain unsupported claims; rewrite in P3.4
- Tech Stack highlights are written for ~280 px cards (≤ ~38 characters); longer text would truncate with "…"
- Tech Stack at 360×640 is the tightest fit (subtitle hidden, compact spacing); recheck in P3.9
- Web3, C/C++ and Git no longer appear on the Tech Stack page (strip removed); Projects filters cover Web3 and C/C++
- Carousel: a swipe that starts on the cards can't turn the page and stops at the last card; the header, controls row, dock and tab bar still turn pages (add edge hand-off only if testing shows people getting stuck)
- OpenAI, AWS and pgvector use generic lucide icons, not brand logos
- Projects: at 3-up the last page can repeat cards (Full Stack has 5, so page 2 shows cards 3–5)
- Projects: filter reflow animation (auto-animate) and rolling counter digits (number-flow) wait for P6.1
- Experience: the slide classes target the Learning card by its position, so they assume one Work item and one Learning item; revisit if the dashboard allows several (P5.6)
- Experience: on wide screens Learning is moved last with CSS order, so reading order differs from visual order there (the cards have no links, so tab order is unaffected)
- Experience: the long Work summary and Shipped bullets 4–5 are hidden at ≥1280 px by design (D56); the P5.6 editor must keep the three core bullets first
- Experience: `shipped` and `summaryShort` are new `experience_items` columns; add them in the P4.2 schema
- Experience at 2-up: the last carousel page holds a single card (Bookshop)
- Get In Touch: `contactHeadline` and `contactIntro` are new `profile` columns; add them in the P4.2 schema and the P5.3 editor
- Get In Touch: the UTC offset label is computed at build time (fine for Asia/Makassar, no DST); revisit if the timezone becomes editable in P5.3
- Get In Touch at 360×640 is the tightest fit (intro hidden, compact spacing); recheck in P3.9
- Entrance timing is tuned by feel: default 650 ms / 55 ms step / 300 ms wait after a turn (`:root` in globals.css); Overview 800 ms / 110 ms (`[data-section="overview"]`), featured cards offset 850 ms / step 220 ms / 900 ms, portrait 1600 ms (OverviewPanel.tsx)
- Carousel slides must keep `overflow-clip`: animated cards would otherwise change the track's scroll size and break Carousel's page measurement and the wheel guard
- Projects: after a filter click, later visits to Projects start their cards with no wait instead of waiting for the page slide
- Spotlight border sheen uses `mask-composite`; spot-check Safari and Firefox in P6.2, and check entrances plus spotlight at 4× CPU throttle there

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

### Handoff — 2026-10-10 — P3.8
Done:
- Entrance choreography on all five pages: header and text identical everywhere (title mask-reveal, text fade, chips/pills/buttons rise), a different card effect per page, replayed on every visit
- Overview timed slower and more cinematic: slow portrait fade, featured cards rise one by one
- Card spotlight (glow + border sheen) on mouse devices for every GlassCard
Files created/changed:
- types/reveal.ts; lib/reveal.ts; app/globals.css; components/stage/StagePanel.tsx; components/ui/{SectionHeader,GlassCard,Spotlight,index}; components/panels/{OverviewPanel,TechStackPanel,ProjectsPanel,ExperiencePanel,ContactPanel}; app/(site)/[[...section]]/page.tsx; docs (CLAUDE.md, PROGRESS.md)
Decisions:
- D58 entrance choreography (CSS only, replay on every visit, per-page card effects, Overview timing) · D59 card spotlight
Verified (viewports / devices):
- Verify list run by Kun and confirmed good
Known issues:
- See Known issues above (timing knobs, overflow-clip on carousel slides, Projects filter quirk, spotlight browser/perf checks)
Next step (ID + one-line goal):
- P3.9 — Fit QA at all 8 viewports; fix overflow with density tiers
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: app/globals.css, components/ui/Carousel.tsx, components/panels/OverviewPanel.tsx, components/panels/TechStackPanel.tsx, components/panels/ProjectsPanel.tsx, components/panels/ExperiencePanel.tsx, components/panels/ContactPanel.tsx. Phase: P3. Step: P3.9. Mode: Build. Follow WORKFLOW.md §11. Goal: Fit QA. Here is my table of which page overflows or looks cramped at which of the 8 viewports: <table>. Fix each problem with density tiers (tuning the 500 / 640 px tier thresholds if needed) in small commits, hiding only decorative content, and stop at the verify command for my approval.

### Handoff — 2026-10-09 — P3.7
Done:
- Get In Touch page: statement, availability pill, Email (primary) and Resume (secondary) buttons; email, LinkedIn and GitHub link cards; info card with location and live Samarinda time; two columns from 1024 px, stacked below, no carousel
- Statement copy moved onto `profile` (`contactHeadline`, `contactIntro`)
Files created/changed:
- types/profile.ts; data/seed.ts; lib/contact/format.ts; components/panels/{contact-icons,ContactLinkCard,ContactPanel,index}; app/(site)/[[...section]]/page.tsx; docs (CLAUDE.md, PROGRESS.md)
Decisions:
- D57 Get In Touch layout, copy on profile, typed icon map
Verified (viewports / devices):
- Verify list run by Kun and confirmed good
Known issues:
- See Known issues above (new profile columns, build-time UTC offset, 360×640 fit)
Next step (ID + one-line goal):
- P3.8 — Entrance choreography (catalog C) on page activation and the card spotlight (D)
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: app/globals.css, components/stage/StagePanel.tsx, components/stage/StageTrack.tsx, lib/stage/motion.ts, components/ui/GlassCard.tsx, components/panels/OverviewPanel.tsx, components/panels/ContactPanel.tsx, package.json. Phase: P3. Step: P3.8. Mode: Build. Follow WORKFLOW.md §11. Goal: Add the entrance choreography (catalog C: headline mask-reveal, subtext fade, chips and cards rise with stagger, portrait settles, once per activation) and the card spotlight (catalog D: cursor-following radial highlight, hover-only), start with a short decisions table on CSS vs Motion and how entrances hook into the panel's data-state, then stop at the verify command for my approval.

### Handoff — 2026-10-09 — P3.6
Done:
- Experience page: Work, Shipped (one per project, from the resume) and Learning cards; wide layout is a row of four plus a full-width Learning band, carousel 2-up / 1-up below 1280 px
- Wide layout shows the short summary and 3 bullets per project; the carousel shows the long summary and 5 bullets
Files created/changed:
- types/experience.ts; data/experience.ts; lib/experience/format.ts; components/panels/{ExperienceParts,ExperienceRoleCard,ExperienceShippedCard,ExperienceLearningCard,ExperiencePanel,index}; app/(site)/[[...section]]/page.tsx; docs (CLAUDE.md, PROGRESS.md)
Decisions:
- D56 Experience cards, carousel order, long vs short content (exception to D52)
Verified (viewports / devices):
- Verify list run by Kun and confirmed good
Known issues:
- See Known issues above (Experience position-based classes, reading order, new schema columns)
Next step (ID + one-line goal):
- P3.7 — Get In Touch: statement, email / LinkedIn / GitHub link cards, resume button, live Samarinda time, no form (D41)
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: components/ui/Button.tsx, components/ui/GlassCard.tsx, components/panels/OverviewPanel.tsx, components/chrome/StatusFooter.tsx, data/seed.ts, types/profile.ts, app/(site)/[[...section]]/page.tsx. Phase: P3. Step: P3.7. Mode: Build. Follow WORKFLOW.md §11. Goal: Build the Get In Touch page (statement left; email, LinkedIn and GitHub link cards right; info row with live Samarinda time; email and resume buttons; no form, no phone) and stop at the verify command for my approval.

### Handoff — 2026-10-09 — P3.5
- P3.5: Projects page (filter pills, 3 / 2 / 1-up Carousel with counter, status badges, link buttons); D54–D55.

### Handoff — 2026-10-09 — P3.4
- P3.4: Tech Stack page (4 skill-group cards, scroll-snap Carousel below 1280 px, strip removed); D51–D53.

### Handoff — 2026-10-08 — P3.3
- P3.3: Overview page (hero, chips, portrait, 3 featured cards, density tiers); D47–D50.

### Handoff — 2026-10-07 — P3.2
- P3.2: typed static data (projects, skill groups, experience, education) and seed re-exports; D44–D46.

### Handoff — 2026-10-07 — P3.1 (design chat)
- P3.1: settled Experience and Get In Touch layouts and density tiers; D40–D43 logged; O1, O2, O3, O6 resolved.

### Handoff — 2026-10-07 — P2.9 (P2 closed)
- P2.9: completed the manual Stage device pass and final tuning; P2 closed with final interaction, transition, and motion values locked.

### Handoff — 2026-10-07 — P2.8
- P2.8: implemented the polite live region, post-turn focus management, and reduced-motion crossfade; completed the final Stage accessibility and motion behavior.

### Handoff — 2026-10-07 — P2.7
- P2.7: implemented the Dock ring glide with shared layout and spring motion, including the arrival ping/glow; D34 and D35 established.

### Handoff — 2026-10-07 — P2.6
- P2.6: implemented CSS-only page-turn visuals, panel state attributes, incoming parallax, edge shadow, outgoing scale/dim, and edge rubber-band bounce; D32 and D33 established.

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
