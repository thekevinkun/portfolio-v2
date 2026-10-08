# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-08
**Current phase / step:** P3.4
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
- [ ] P3.4 Tech Stack
- [ ] P3.5 Projects
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
Done:
- Types for projects, skill groups, experience; seed data from the real portfolio data (15 projects, 4 skill groups + strip, work + education); top 3 featured
Files created/changed:
- types/{projects,skills,experience}.ts; data/{projects,skill-groups,experience}.ts; data/seed.ts (3 re-export lines; real location, timezone, availability in profile); docs
Decisions:
- D44 status `completed` · D45 data layout and conventions · D46 education bullets, no phone, no certificates
Verified (viewports / devices):
- n/a (no UI); typecheck, lint, build
Known issues:
- Profile row not seeded yet (needs types/profile.ts and data/seed.ts content)
Next step (ID + one-line goal):
- P3.3 — Overview, including extending the profile type and seed
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also paste types/profile.ts and data/seed.ts. Phase: P3. Step: P3.3. Mode: Build. Goal: Build the Overview page and extend the profile type and seed with headline, tagline, availability, socials and resume URL.

### Handoff — 2026-10-07 — P3.1 (design chat)
Done:
- Experience layout (Work + Learning cards, timeline rail), Get In Touch layout (statement + 3 link cards + live-time info row), density tiers per page, tier mechanics via container height
- Content audit findings: invalid phone prefix, "degree" wording, highlights need project mapping
Files created/changed:
- docs only (CLAUDE.md §4.4, §10, §11; PROGRESS.md)
Decisions:
- D40–D43; O1, O2, O3, O6 resolved; O7, O8 opened
Verified (viewports / devices):
- n/a (no code)
Known issues:
- Tier thresholds are estimates until chrome heights are measured in P3.2
- Highlight → project mapping must be confirmed before seeding (audit #4)
Next step (ID + one-line goal):
- P3.2 — typed static data in types/ and data/seed.ts for the 4 tables
Prompt for the next chat:
  Attached: CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Phase: P3. Step: P3.2. Mode: Build. Goal: Add typed static data and data/seed.ts mirroring the 4 tables, using the confirmed Experience and contact content.

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
