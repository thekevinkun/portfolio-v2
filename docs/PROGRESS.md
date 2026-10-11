# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-11
**Current phase / step:** P4.4
**Mode default:** Build

---

## Phase tracker

| Phase | Name                     | Status         | Notes                                       |
| ----- | ------------------------ | -------------- | ------------------------------------------- |
| P1    | Setup, tokens & chrome   | ✅ Done        |                                             |
| P2    | Stage engine             | ✅ Done | Device pass passed (P2.9); spec in CLAUDE.md §4.2.1      |
| P3    | Five pages (static data) | ✅ Done        | Fit QA passed at all eight viewports (P3.9) |
| P4    | Neon data → LAUNCH       | 🟦 in progress | P4.1–P4.3 done; launch gate                 |
| P5    | Dashboard                | ⬜ Not started |                                             |
| P6    | Polish & finish          | ⬜ Not started |                                             |

Legend: ⬜ not started · 🟦 in progress · ✅ done · ⛔ blocked

---

## Current phase checklist

- [x] P4.1 Plan chat (no code): finalize the 4-table schema and JSON column shapes
- [x] P4.2 Types as `as const` tuples + `slug` fields; Drizzle schema, `db:*` scripts, migration applied to Neon
- [x] P4.3 Zod schemas; `scripts/seed.ts` via `tsx`, idempotent; testnet wording for Chainkuns/DarkMint (D76)
- [ ] P4.4 `getStageData()` queries; swap all panels to DB data; remove static seed from runtime imports
- [ ] P4.5 SEO basics: per-section metadata, canonical, sitemap, robots, JSON-LD `Person`, OG image
- [ ] P4.6 Launch checklist: re-run content audit (R4), Lighthouse, deploy to production, update LinkedIn/GitHub/Upwork/CV links

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
- D54–D63: see CLAUDE.md §10.
- D64–D78: see CLAUDE.md §10.

## Open questions

None. O4 and O5 settled (D73, D74).

## Known issues

- P3 contract from the Stage: every panel's heading must have the id `heading-<section id>` (D37); inner scrollers get `data-stage-scroll`, and the carousel gets `data-stage-swipe-ignore` (R2)
- Retargeting back to a page that was mid-leave replays its parallax/shadow (small pop)
- A hover lift in progress when the dock ring starts to glide can pop the ring by ~4px
- TabBar indicator does not glide (static)
- Heading focus and the live region can both speak (double announce); full screen-reader pass in P6.3
- Canonical, sitemap and descriptions wait for P4.5 (domain, O5)
- Top-bar badge still uses the placeholder avatar SVG, not the portrait
- Firefox only: a brief white outline flashes around a dock tile while it scales on hover (cosmetic, left unresolved; Chrome is fine)
- Tech Stack highlights are written for ~280 px cards (≤ ~38 characters); longer text would truncate with "…"
- Web3, C/C++ and Git no longer appear on the Tech Stack page (strip removed); Projects filters cover Web3 and C/C++
- Carousel: a swipe that starts on the cards can't turn the page and stops at the last card; the header, controls row, dock and tab bar still turn pages (add edge hand-off only if testing shows people getting stuck)
- OpenAI, AWS and pgvector use generic lucide icons, not brand logos
- Projects: at 3-up the last page can repeat cards (Full Stack has 5, so page 2 shows cards 3–5)
- Projects: filter reflow animation (auto-animate) and rolling counter digits (number-flow) wait for P6.1
- Projects: after a filter click, later visits to Projects start their cards with no wait instead of waiting for the page slide
- Experience: slide classes target the Learning card by position (`nth-1`), so they assume one Learning item before the Work items; revisit if the dashboard allows several (P5.6)
- Experience: in the wide layout Learning is moved last with CSS order, so reading order differs from visual order there (the cards have no links, so tab order is unaffected)
- Experience: the long Work summary and Shipped bullets 4–5 show only outside the wide layout (D62); on phones shorter than 580 px the trimmed cards also hide Learning tags; the P5.6 editor must keep the three core bullets first
- Experience at 2-up: the last carousel page holds a single card (Bookshop)
- Experience at 1366×768 (panel 511) is the tightest wide layout; if the Learning band ever touches the footer, hide its tag chips in that range with a dedicated variant
- Experience: `--i-wide` (entrance order) follows viewport width ≥ 1280 px, while the wide layout also needs 500 px of height, so a wide but short window shows the carousel animating in wide order (harmless)
- Get In Touch: the UTC offset label is computed at build time (fine for Asia/Makassar, no DST); revisit if the timezone becomes editable in P5.3
- Entrance timing is tuned by feel: default 650 ms / 55 ms step / 300 ms wait after a turn (`:root` in globals.css); Overview 800 ms / 110 ms (`[data-section="overview"]`), featured cards offset 850 ms / step 220 ms / 900 ms, portrait 1600 ms (OverviewPanel.tsx)
- Carousel slides must keep `overflow-clip`: animated cards would otherwise change the track's scroll size and break Carousel's page measurement and the wheel guard
- Spotlight border sheen uses `mask-composite`; spot-check Safari and Firefox in P6.2, and check entrances plus spotlight at 4× CPU throttle there
- Density thresholds (D60) were measured on the eight QA viewports plus one 1536×791 laptop window; if a real device shows a problem, tune the variants in `app/globals.css`
- The validator limits (5 skill items, 4 highlights of at most 40 characters, 3–5 shipped bullets per project) must be visible in the P5.5 and P5.6 editors
- Experience: the Shipped card says "Padel Court" while the project title is "Padel Batu Alam Permai" (D75, left as is)
- Nothing caps `featured` at 3 rows; add the check in the P5.4 validators

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

### Handoff — 2026-10-11 — P4.3
Done:
- Zod schemas for the four tables in `validators/`, tied to the types with `satisfies` and to the DB through the shared tuples
- `scripts/seed.ts` (default / `--update` / `--check`), `tsx` added, `db:seed` script; Neon seeded with profile, 4 skill groups, 15 projects and 2 experience items
- Chainkuns and DarkMint summaries say testnet; `NODE_ENV` defaults to development in `lib/env.ts`
Files created/changed:
- lib/env.ts; validators/{shared,profile,projects,skills,experience}.ts (`.gitkeep` removed); scripts/seed.ts; data/projects.ts; package.json and lockfile; docs (CLAUDE.md, PROGRESS.md)
Decisions:
- D78 validators, rules beyond shape, seed modes
Verified (viewports / devices):
- Typecheck, lint, build; `--check`, a bad `startDate` refused, two seed runs (first writes, second skips), rows read back in Neon, `--update` contract, Web3 cards at 1440×900 and 390×844
Known issues:
- Validator limits must show in the P5.5 and P5.6 editors
- Nothing caps `featured` at 3 rows (P5.4)
Next step (ID + one-line goal):
- P4.4 — `getStageData()` queries, panels read from Neon, `revalidate = 3600`, ESLint guard on `@/data/*`
Prompt for the next chat:
  (see the block in the chat)

### Handoff — 2026-10-11 — P4.2
Done:
- Types now derive their unions from `as const` tuples; `slug` added to skill groups and experience items; `seoTitle` and `seoDescription` added to profile (seed carries proposed copy)
- Drizzle schema for the four tables, `db:generate` and `db:migrate` scripts, first migration generated, reviewed and applied to Neon
Files created/changed:
- types/{profile,projects,skills,experience}.ts; data/{seed,skill-groups,experience}.ts; lib/db/schema.ts; package.json; drizzle/0000_silly_living_tribunal.sql and drizzle/meta/; docs (CLAUDE.md, ROADMAP.md, PROGRESS.md)
Decisions:
- D77 schema details (relative imports, extra tuples, array defaults, named checks)
Verified (viewports / devices):
- Typecheck, lint, build; generated SQL reviewed against the schema; table, constraint and enum check in the Neon SQL editor
Known issues:
- Seed outside Next: `lib/env.ts` requires `NODE_ENV`, which `tsx` usually leaves unset (P4.3)
- Nothing caps `featured` at 3 rows (P5.4)
Next step (ID + one-line goal):
- P4.3 — Zod schemas in `validators/` and an idempotent `scripts/seed.ts`
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: package.json, tsconfig.json, .env.example, lib/env.ts, lib/db/index.ts, lib/db/schema.ts, drizzle.config.ts, types/profile.ts, types/projects.ts, types/skills.ts, types/experience.ts, data/seed.ts, data/projects.ts, data/skill-groups.ts, data/experience.ts, eslint.config.mjs. Phase: P4 — Neon data. Step: P4.3. Mode: Build. Follow WORKFLOW.md §11. Goal: Write the Zod schemas in validators/ (reading the tuples from types/), add scripts/seed.ts run with tsx (add-missing by slug, --update to overwrite, D71), apply the testnet wording (D76), and stop at the verify command for my approval.

### Handoff — 2026-10-11 — P4.1 (plan chat)
Done:
- Planned the 4-table schema and JSON shapes from the real types and data; settled O4 and O5; fixed stale docs (tracker, duplicated §4.4 phrase, stray table cell in D59)
Files created/changed:
- docs only: CLAUDE.md, ROADMAP.md, PROGRESS.md
Decisions:
- D64–D76 (enum tuples, keys, column types, SEO columns, read path, revalidation, migrations, seed, R3 lint guard, English only, launch domain, free-text shipped names, testnet wording)
Verified (viewports / devices):
- n/a (no code)
Known issues:
- Seed outside Next needs NODE_ENV (P4.3); `next.config.ts` unseen; nothing caps `featured` at 3 (P5.4)
Next step (ID + one-line goal):
- P4.2 — types become `as const` tuples with `slug` fields; Drizzle schema, `db:*` scripts, migration
Prompt for the next chat:
  (see the block in the chat)

### Handoff — 2026-10-10 — P3.8–P3.9 (P3 closed)
- P3.8–P3.9: entrance choreography, card spotlight and fit QA at all eight viewports; D58–D63.

### Handoff — 2026-10-09 — P3.7
- P3.7: Get In Touch page (statement, availability, link cards, live Samarinda time, no form); D57.

### Handoff — 2026-10-09 — P3.6
- P3.6: Experience page (Work, Shipped and Learning cards, wide row or carousel by width and height); D56.

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
