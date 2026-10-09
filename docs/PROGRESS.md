# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-09
**Current phase / step:** P3.6
**Mode default:** Build

---

## Phase tracker

| Phase | Name                     | Status         | Notes                                       |
| ----- | ------------------------ | -------------- | ------------------------------------------- |
| P1    | Setup, tokens & chrome   | ✅ Done        |                                             |
| P2    | Stage engine             | ✅ Done | Device pass passed (P2.9); spec in CLAUDE.md §4.2.1      |
| P3    | Five pages (static data) | 🟦 in progress | Need Experience + Get In Touch layouts (O3) |
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
- [ ] P3.6 Experience
- [ ] P3.7 Get In Touch
- [ ] P3.8 Entrance choreography + card spotlight
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
- The P3.1 Experience tier table (compact drops details) predates D52; redo it nothing-hidden in P3.6

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

### Handoff — 2026-10-09 — P3.5
Done:
- Projects page: filter pills (Full Stack, Frontend, Game, Web3, C/C++), carousel (3 / 2 / 1 per page, next card peeking at 1-up) with Previous/Next and a "01 / 02" counter, status badges (LIVE solid, COMPLETED glass), every tech tag, Live Demo / Repo buttons
- Carousel gains an `indicator` option ("dots" | "counter")
Files created/changed:
- components/ui/Carousel.tsx; lib/projects/filters.ts; components/panels/{ProjectCard,ProjectsPanel,index}; app/(site)/[[...section]]/page.tsx; docs (CLAUDE.md, PROGRESS.md, WORKFLOW.md)
Decisions:
- D54 Projects page layout and filters · D55 Carousel indicator and per-page snap points · working rules added to WORKFLOW.md §11
Verified (viewports / devices):
- Verify list run by Kun and confirmed good (filters, 3/2/1-up, counter, touch, trackpad, keyboard, reduced motion)
Known issues:
- See Known issues above
Next step (ID + one-line goal):
- P3.6 — Experience page: Work + Learning cards, no milestones, nothing hidden
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: components/ui/Carousel.tsx, components/panels/TechStackPanel.tsx, components/panels/ProjectsPanel.tsx, components/panels/SkillGroupCard.tsx, app/(site)/[[...section]]/page.tsx, data/experience.ts, types/experience.ts. Phase: P3. Step: P3.6. Mode: Build. Follow WORKFLOW.md §11. Goal: Build the Experience page (Work + Learning cards from experienceItems, nothing hidden, a Carousel below 1024 px if the two cards don't fit) and stop at the verify command for my approval.

### Handoff — 2026-10-09 — P3.4
Done:
- Tech Stack page: 4 skill-group cards with icons, items and four one-line highlights each; reusable scroll-snap Carousel (arrows, page dots, peeking next card) for 2-up and 1-up below 1280 px; "Also used" strip removed
- Fixed: lint error on icon lookup (typed icon map indexed directly)
Files created/changed:
- package.json + lockfile (react-icons); types/skills.ts; components/ui/{Carousel,SectionHeader,index}; components/panels/{tech-icons,SkillGroupCard,TechStackPanel,index}; data/{skill-groups,seed}.ts; app/(site)/[[...section]]/page.tsx; docs
Decisions:
- D51 native scroll-snap Carousel and its swipe/keyboard rules · D52 Tech Stack breakpoints and no hidden content · D53 icon map and typed keys
Verified (viewports / devices):
- Verify list run by Kun and confirmed good (viewport matrix 1440×900 down to 360×640, touch swipe, trackpad, mouse wheel, keyboard, reduced motion)
Known issues:
- See Known issues above (360×640 fit, Web3/C++ not on the page, carousel end behavior, stand-in icons)
Next step (ID + one-line goal):
- P3.5 — Projects page: filter pills, Carousel reuse, arrows and counter, status badges, link buttons
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also paste components/ui/Carousel.tsx, components/panels/FeaturedProjectCard.tsx and package.json, and attach the projects reference HTML. Phase: P3. Step: P3.5. Mode: Build. Goal: Build the Projects page from the projects seed (filter pills, carousel, arrows, counter, status badges, link buttons), reusing the Carousel.

### Handoff — 2026-10-08 — P3.3
Done:
- Overview page: hero text under the dock, tech chips, focus pills, resume download, feathered portrait, 3 taller featured project cards, three density tiers via container-height variants; featured cards hidden on phones (no inner scroll)
- Profile type and seed extended; portrait and resume committed
- Fixed: wheel/trackpad blocked over Overview (`data-stage-scroll` on the panel wrapper)
Files created/changed:
- types/profile.ts; data/seed.ts; app/globals.css; components/ui/Button.tsx; components/panels/{OverviewPanel,FeaturedProjectCard,index}; app/(site)/[[...section]]/page.tsx; public/images/profile-picture.png; public/resume/Kevin_Mahendra_FullStackDeveloper_Resume.pdf; docs
Decisions:
- D47 tier variants in globals.css · D48 panels take props, one h1, hero layout, no phone scroll · D49 download anchors, profile fields, asset paths · D50 data-stage-scroll rule and fit-or-hide on phones
Verified (viewports / devices):
- <fill in: viewports and devices checked, keyboard, reduced motion, 4× throttle>
Known issues:
- See Known issues above (thresholds, badge avatar, schema columns, Firefox dock flash)
Next step (ID + one-line goal):
- P3.4 — Tech Stack page from the four skill groups, highlights and strip, with honest copy and density tiers
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also paste components/panels/OverviewPanel.tsx and package.json, and attach the tech stack reference HTML. Phase: P3. Step: P3.4. Mode: Build. Goal: Build the Tech Stack page from skillGroups and techStrip (icon map, density tiers) and replace the unsupported header copy.

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
