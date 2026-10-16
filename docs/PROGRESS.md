# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-16
**Current phase / step:** P7.2b
**Mode default:** Build

---

## Phase tracker

| Phase | Name                     | Status         | Notes                                       |
| ----- | ------------------------ | -------------- | ------------------------------------------- |
| P1    | Setup, tokens & chrome   | ✅ Done        |                                             |
| P2    | Stage engine             | ✅ Done | Device pass passed (P2.9); spec in CLAUDE.md §4.2.1      |
| P3    | Five pages (static data) | ✅ Done        | Fit QA passed at all eight viewports (P3.9) |
| P4    | Neon data → LAUNCH       | ✅ Done        | Launched on kevinmahendra.vercel.app        |
| P5    | Dashboard                | ✅ Done        | Dashboard live (D82–D111)
| P6    | Polish & finish          | ⬜ Not started |                                             |
| P7    | Project details          | 🟦 In progress | P7.2a done (D123); next P7.2b               |

Legend: ⬜ not started · 🟦 in progress · ✅ done · ⛔ blocked

---

## Current phase checklist

- [x] P7.1 Plan chat (no code): D112–D122
- [x] P7.2a Types, limits, Zod schema (`hasDetails` moved to P7.2b, D123)
- [ ] P7.2b Column and migration (dev, then production), `hasDetails`, queries
- [ ] P7.3a Dashboard editor: text, role, timeframe, video id
- [ ] P7.3b Screenshots: upload, captions, reorder, references
- [ ] P7.4a Overlay shell: dialog, animation, history, Stage guard
- [ ] P7.4b Overlay content and layouts
- [ ] P7.5 Triggers on cards, YouTube facade, performance pass

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
- D64–D81: see CLAUDE.md §10.
- D82–D111: see CLAUDE.md §10.
- D112–D123: see CLAUDE.md §10.

## Open questions

None. O4 and O5 settled (D73, D74).

## Known issues

- P3 contract from the Stage: every panel's heading must have the id `heading-<section id>` (D37); inner scrollers get `data-stage-scroll`, and the carousel gets `data-stage-swipe-ignore` (R2)
- Retargeting back to a page that was mid-leave replays its parallax/shadow (small pop)
- A hover lift in progress when the dock ring starts to glide can pop the ring by ~4px
- TabBar indicator does not glide (static)
- Heading focus and the live region can both speak (double announce); full screen-reader pass in P6.3
- Firefox only: a brief white outline flashes around a dock tile while it scales on hover (cosmetic, left unresolved; Chrome is fine)
- Tech Stack highlights are written for ~280 px cards (≤ ~38 characters); longer text would truncate with "…"
- Web3, C/C++ and Git no longer appear on the Tech Stack page (strip removed); Projects filters cover Web3 and C/C++
- Carousel: a swipe that starts on the cards can't turn the page and stops at the last card; the header, controls row, dock and tab bar still turn pages (add edge hand-off only if testing shows people getting stuck)
- OpenAI, AWS and pgvector items keep their built-in generic icons; the editor can switch any item to a Simple Icons or lucide name (D108)
- Projects: at 3-up the last page can repeat cards (Full Stack has 5, so page 2 shows cards 3–5)
- Projects: filter reflow animation (auto-animate) and rolling counter digits (number-flow) wait for P6.1
- Projects: after a filter click, later visits to Projects start their cards with no wait instead of waiting for the page slide
- Experience: slide classes target the Learning card by position (`nth-1`), so they assume one Learning item before the Work items; revisit if the dashboard allows several (the editor edits the two existing items only, D92; several Work items arrive with the work timeline, D110, and Learning stays single)
- Experience: in the wide layout Learning is moved last with CSS order, so reading order differs from visual order there (the cards have no links, so tab order is unaffected)
- Experience: the long Work summary and Shipped bullets 4–5 show only outside the wide layout (D62); on phones shorter than 580 px the trimmed cards also hide Learning tags; the editor hint says the first three bullets show in the wide layout (D109)
- Experience at 2-up: the last carousel page holds a single card (Bookshop)
- Experience at 1366×768 (panel 511) is the tightest wide layout; if the Learning band ever touches the footer, hide its tag chips in that range with a dedicated variant
- Experience: editable content is limited to 4 Learning bullets and 8 tags per item (D109); the Work card cannot hold more than one role until the work timeline (D110)
- Experience: `--i-wide` (entrance order) follows viewport width ≥ 1280 px, while the wide layout also needs 500 px of height, so a wide but short window shows the carousel animating in wide order (harmless)
- Get In Touch: the UTC offset label is computed when the page is generated, so it refreshes on each dashboard save and hourly; the timezone is editable since P5.3a, and a DST timezone could show a wrong offset for up to an hour around a clock change
- Entrance timing is tuned by feel: default 650 ms / 55 ms step / 300 ms wait after a turn (`:root` in globals.css); Overview 800 ms / 110 ms (`[data-section="overview"]`), featured cards offset 850 ms / step 220 ms / 900 ms, portrait 1600 ms (OverviewPanel.tsx)
- Carousel slides must keep `overflow-clip`: animated cards would otherwise change the track's scroll size and break Carousel's page measurement and the wheel guard
- Spotlight border sheen uses `mask-composite`; spot-check Safari and Firefox in P6.2, and check entrances plus spotlight at 4× CPU throttle there
- Density thresholds (D60) were measured on the eight QA viewports plus one 1536×791 laptop window; if a real device shows a problem, tune the variants in `app/globals.css`
- Tech Stack: full cards (7 items, 5 highlights) were fit-checked at the QA viewports in P5.5 (D107); 360×640 is 4 px taller than its area, absorbed by the gap and padding, and 1024×768 has 7 px of slack and is the tightest; re-check both if the card spacing changes
- Dashboard sign-in works only on localhost and the production domain (two OAuth apps, D85); preview URLs cannot sign in
- Dashboard: the open `Select` list is drawn by the browser, so its look can differ between browsers (options carry their own colors, D99); spot-check in P5.4b where the selects are used
- Profile editor: socials are always exactly LinkedIn and GitHub, both required (D57); adding another kind needs a form and layout change
- A tab closed during the few seconds of a profile save can leave one orphan file in the Blob store; a failed save uploads the new files and deletes them again (validating the text fields on the server first would avoid that)
- P5.4b must add project logos to `lib/blob/references.ts`, so `discardAsset` never deletes a logo a saved project uses
- The Vercel Blob list can lag after a delete; confirm a delete with `curl -sI "<url>?check=1"` (404 = gone)
- Next's dev warning flags the Overview portrait as the LCP image and suggests `priority`; fold it into the P6.2 LCP check (a blanket `priority` would preload the portrait on every landing page)
- The login page and the signed-in placeholder are unstyled stand-ins until P5.2
- Experience: the Shipped card says "Padel Court" while the project title is "Padel Batu Alam Permai" (D75, left as is)
- A bad row in Neon (for example a live project with no live link) fails the build; whether a failed hourly regeneration keeps serving the last good page was not tested (check before launch, P4.6)
- Unused files in `public/`: the five default Next SVGs (`file`, `globe`, `next`, `vercel`, `window`) and `placeholder/avatar.svg`; delete in P6; `logo.png` is not in the repo yet (added with the feature that shows it)
- Content changes go through the dashboard; `data/` is seed input for a fresh database only, and `db:seed --update` needs `--yes-overwrite` (D97, D111)
- Lighthouse at launch: mobile 92 / 98 / 100 / 100 with LCP 3.1 s and Speed Index 4.2 s red; the Overview portrait fade is the suspect (P6.2); accessibility 98 (P6.3)
- The project logo (the large image) is stored but shown nowhere until P7 (D104, D106)
- Categories: hiding one removes its tab only, its projects stay visible (D105); the tabs wrap onto more lines and were fit-checked with eight tabs at the five QA viewports, more than that is untested
- Tech Stack icons: a brand missing from the installed `react-icons` Simple Icons set falls back to a letter; type a different brand, a lucide name or `lucide:<name>` in the item's icon box (D108)
- Uploads keep the `profile/` path prefix even for project screenshots (D120); only the name is misleading, and `discardAsset` relies on it

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

### Handoff — 2026-10-16 — P7.2a
Done:
- `ProjectDetails` types, `YOUTUBE_ID_PATTERN`, the D112 limits and `projectDetailsSchema` with `detailsOrNull`; no database change
- `hasDetails` moved to P7.2b (D123)
Files created/changed:
- types/details.ts (new); types/limits.ts; validators/details.ts (new); docs (CLAUDE.md, ROADMAP.md, PROGRESS.md)
Decisions:
- D123
Verified (viewports / devices):
- Typecheck, lint, build; a temporary tsx script (not committed) checked valid and invalid details, the 7th feature, the 9th screenshot, a bad video id, an unknown key, a blank and an over-long string, and a `javascript:` screenshot URL
Known issues:
- Same as the Known issues list; the details limits are estimates until the P7.4b fit check
Next step (ID + one-line goal):
- P7.2b: add the `details` column and migration, `hasDetails` on `Project`, `getProjectDetails()`
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: lib/db/schema.ts, lib/db/queries.ts, lib/db/admin-queries.ts, types/projects.ts, types/admin.ts, types/details.ts, validators/projects.ts, validators/details.ts, data/projects.ts, scripts/seed.ts, drizzle/0002_heavy_roulette.sql, drizzle/meta/_journal.json, drizzle.config.ts. Phase: P7 — Project details. Step: P7.2b. Mode: Build. Follow WORKFLOW.md §11. Goal: Add the nullable `details` jsonb column with a migration (dev, then production), add `hasDetails` to `Project` and fix every file that builds one, and add the cached `getProjectDetails()` query.

### Handoff — 2026-10-15 — P7.1 (plan chat)
Done:
- Planned the project details overlay: content model, loading, mount, animation, history, Stage guard, layouts, video, screenshots, editor; split P7.2–P7.5; D112–D122
Files created/changed:
- docs (CLAUDE.md, ROADMAP.md, PROGRESS.md); stale first D105 row removed
Decisions:
- D112–D122
Verified (viewports / devices):
- Not applicable (plan chat). Untested assumptions: Next's popstate handling (D116), YouTube embedding (D119), payload size (D113)
Known issues:
- Same as the Known issues list
Next step (ID + one-line goal):
- P7.2a: types, limits and Zod schema for details
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: types/projects.ts, types/limits.ts, validators/projects.ts, validators/shared.ts, lib/db/queries.ts. Phase: P7 — Project details. Step: P7.2a. Mode: Build. Follow WORKFLOW.md §11. Goal: Add `types/details.ts` and the limits from D112, the `projectDetailsSchema` Zod validator (strict, limits read from `types/limits.ts`, YouTube id format, empty details saved as null), and `hasDetails` on `Project`, without touching the database yet.

### Handoff — 2026-10-15 — P5.7 (P5 closed)
Done:
- `db:seed --update` requires `--yes-overwrite` and prints the database host
- `scripts/check-actions.ts` runs first in `npm run build`: every dashboard action must use `adminAction` (except `signOutAdmin`) and every admin page must call `requireAdmin()`
- Deleted the `[area]` stub; Projects page shows "No projects to show right now." when no category has a visible project
- Tested: every dashboard route redirects when signed out, actions signed out and with a revoked `ADMIN_GITHUB_ID` change nothing, and each public page with its content hidden
Files created/changed:
- scripts/{seed,check-actions}.ts; package.json; components/panels/ProjectsPanel.tsx; app/dashboard/(admin)/[area]/page.tsx (deleted); docs (CLAUDE.md, ROADMAP.md, PROGRESS.md)
Decisions:
- D111
Verified (viewports / devices):
- Typecheck, lint, build (the guard check passed first) and `npm run start` on the Neon dev branch; the guard check fails on a temporary unguarded action; seed guard; signed-out routes and actions; revoked session; empty states of the public pages (no crashes, build succeeds); public site unchanged
Known issues:
- Same as the Known issues list; the Work timeline (D110) and the project details overlay (D106) are planned, not built
Next step (ID + one-line goal):
- P7.1 — Project details plan chat (no code)
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: the P7 section of ROADMAP.md, types/projects.ts, types/limits.ts, types/assets.ts, validators/projects.ts, lib/db/schema.ts, lib/db/queries.ts, components/panels/ProjectsPanel.tsx, ProjectCard.tsx, FeaturedProjectCard.tsx, OverviewPanel.tsx, components/ui/Carousel.tsx, components/stage/{Stage,StageProvider,StageInputs,StagePanel,StageFocus}.tsx, lib/stage/{config,reducer,stage-context,scroll-guard,useStageKeys,useStageWheel,useStageSwipe,useStageUrl}.ts, app/globals.css, components/dashboard/ProjectForm.tsx, AssetField.tsx, lib/dashboard/actions/{projects,assets}.ts, lib/blob/{sniff,cleanup,references,url}.ts, next.config.ts. Phase: P7 — Project details. Step: P7.1 (plan chat). Mode: Build, but this is a plan chat: no code. Follow WORKFLOW.md §11. Goal: Plan the project details overlay (D106) before building: the content model and limits, the open and close animation, the history entry and Back behavior, the Stage guard (keys, wheel, swipe, focus), the two-column and phone layouts, data size and loading, screenshots and the YouTube video, and the dashboard editor; split P7.2–P7.5 into commit-sized steps if needed, then give me the decision table and the exact docs edits and stop for my approval.

### Handoff — 2026-10-14 — P5.6
- P5.6: Experience editor (Work and Learning items, shipped projects add/remove/reorder up to 3, limits in `types/limits.ts`); the server applies fields by the row's real kind; work timeline planned (D110); D109, D110.

### Handoff — 2026-10-14 — P5.5
- P5.5: Tech Stack editor (list, group form, items with icons found from the name, highlights), card numbers follow position, limits in `types/limits.ts`, fit QA with full cards; D107, D108.

### Handoff — 2026-10-14 — P5.4c
- P5.4c: `project_categories` table replaces the filter enum, categories editor, public tabs from the table; D105.

### Handoff — 2026-10-13 — P5.4b
- P5.4b: project create/edit form, icon and logo split, five tech tags on cards, tags and buttons pinned to the card bottom; D103, D104.

### Handoff — 2026-10-13 — P5.4a
- P5.4a: Projects list with visibility, featured cap, reorder within a filter, delete with confirm; D102.

### Handoff — 2026-10-12 — P5.3b
- P5.3b: Vercel Blob uploads on Save for avatar, portrait and resume, two stores, magic-byte check; D101.

### Handoff — 2026-10-12 — P5.3a
- P5.3a: action pattern (`adminAction`, `ActionResult`, `revalidateSite`) and the Profile editor without uploads; D100.

### Handoff — 2026-10-12 — P5.2
- P5.2: dashboard shell, own form primitives, styled login, overview with counts; D99.

### Handoff — 2026-10-11 — P5.1
- P5.1: Auth.js GitHub sign-in with numeric-id allowlist, `requireAdmin()`, `proxy.ts` guard, bare login page; D82–D85.

### Handoff — 2026-10-11 — P5 plan chat
- P5 plan: dashboard auth, action pattern, own primitives, Blob uploads, editor scope, Neon dev branch; P5.1–P5.7 split; D82–D98.

### Handoff — 2026-10-11 — P4.6 (P4 closed)
- P4.6: launch audit (R4), content fixes, Lighthouse and production smoke test; P4 closed; D81.

### Handoff — 2026-10-11 — P4.5
- P4.5: per-section metadata, canonical, Open Graph, manifest, robots, sitemap, Person JSON-LD, icons; D80.

### Handoff — 2026-10-11 — P4.4
- P4.4: cached query layer, `getStageData()`, `revalidate = 3600`, ESLint guard on `@/data/*`; D79.

### Handoff — 2026-10-11 — P4.3
- P4.3: Zod validators, idempotent tsx seed script (`--check`, `--update`), testnet wording; D78.

### Handoff — 2026-10-11 — P4.2
- P4.2: types as `as const` tuples with `slug` fields, Drizzle schema and first migration applied to Neon; D77.

### Handoff — 2026-10-11 — P4.1 (plan chat)
- P4.1: planned the four-table schema and JSON shapes; settled O4 and O5; D64–D76.

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
