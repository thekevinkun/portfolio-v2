# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-13
**Current phase / step:** P5.4b
**Mode default:** Build

---

## Phase tracker

| Phase | Name                     | Status         | Notes                                       |
| ----- | ------------------------ | -------------- | ------------------------------------------- |
| P1    | Setup, tokens & chrome   | ✅ Done        |                                             |
| P2    | Stage engine             | ✅ Done | Device pass passed (P2.9); spec in CLAUDE.md §4.2.1      |
| P3    | Five pages (static data) | ✅ Done        | Fit QA passed at all eight viewports (P3.9) |
| P4    | Neon data → LAUNCH       | ✅ Done        | Launched on kevinmahendra.vercel.app        |
| P5    | Dashboard                | 🟦 In progress | P5.1–P5.4a done (D82–D102) |
| P6    | Polish & finish          | ⬜ Not started |                                             |

Legend: ⬜ not started · 🟦 in progress · ✅ done · ⛔ blocked

---

## Current phase checklist

- [x] P5.1 Auth: next-auth@beta, GitHub allowlist, `requireAdmin()`, `proxy.ts`, bare login page
- [x] P5.2 Dashboard shell: own form primitives, layout, nav, overview
- [x] P5.3a Action pattern + Profile editor (no uploads)
- [x] P5.3b Blob uploads (avatar, portrait, resume)
- [x] P5.4a Projects list: visibility, reorder, delete, featured cap
- [ ] P5.4b Projects create/edit form
- [ ] P5.5 Tech Stack editor
- [ ] P5.6 Experience editor
- [ ] P5.7 Hardening and cleanup

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
- D82–D102: see CLAUDE.md §10.

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
- OpenAI, AWS and pgvector use generic lucide icons, not brand logos
- Projects: at 3-up the last page can repeat cards (Full Stack has 5, so page 2 shows cards 3–5)
- Projects: filter reflow animation (auto-animate) and rolling counter digits (number-flow) wait for P6.1
- Projects: after a filter click, later visits to Projects start their cards with no wait instead of waiting for the page slide
- Experience: slide classes target the Learning card by position (`nth-1`), so they assume one Learning item before the Work items; revisit if the dashboard allows several (the v1 editor edits the two existing items only, D92)
- Experience: in the wide layout Learning is moved last with CSS order, so reading order differs from visual order there (the cards have no links, so tab order is unaffected)
- Experience: the long Work summary and Shipped bullets 4–5 show only outside the wide layout (D62); on phones shorter than 580 px the trimmed cards also hide Learning tags; the P5.6 editor must keep the three core bullets first
- Experience at 2-up: the last carousel page holds a single card (Bookshop)
- Experience at 1366×768 (panel 511) is the tightest wide layout; if the Learning band ever touches the footer, hide its tag chips in that range with a dedicated variant
- Experience: `--i-wide` (entrance order) follows viewport width ≥ 1280 px, while the wide layout also needs 500 px of height, so a wide but short window shows the carousel animating in wide order (harmless)
- Get In Touch: the UTC offset label is computed when the page is generated, so it refreshes on each dashboard save and hourly; the timezone is editable since P5.3a, and a DST timezone could show a wrong offset for up to an hour around a clock change
- Entrance timing is tuned by feel: default 650 ms / 55 ms step / 300 ms wait after a turn (`:root` in globals.css); Overview 800 ms / 110 ms (`[data-section="overview"]`), featured cards offset 850 ms / step 220 ms / 900 ms, portrait 1600 ms (OverviewPanel.tsx)
- Carousel slides must keep `overflow-clip`: animated cards would otherwise change the track's scroll size and break Carousel's page measurement and the wheel guard
- Spotlight border sheen uses `mask-composite`; spot-check Safari and Firefox in P6.2, and check entrances plus spotlight at 4× CPU throttle there
- Density thresholds (D60) were measured on the eight QA viewports plus one 1536×791 laptop window; if a real device shows a problem, tune the variants in `app/globals.css`
- The validator limits (5 skill items, 4 highlights of at most 40 characters, 3–5 shipped bullets per project) must be visible in the P5.5 and P5.6 editors
- Tech Stack cards were fit-tested with 5 items and 4 highlights (P3.9); D98 raises the limits to 7 and 5 in P5.5, which must re-run fit QA with full cards (a short panel such as 1366×768 is the likeliest to overflow)
- Dashboard sign-in works only on localhost and the production domain (two OAuth apps, D85); preview URLs cannot sign in
- Dashboard: `app/dashboard/(admin)/[area]/page.tsx` is a temporary stub for the editors that don't exist yet; delete it in P5.7
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
- Until P5, content changes go through `data/` and `npm run db:seed -- --update`, which overwrites every row
- Lighthouse at launch: mobile 92 / 98 / 100 / 100 with LCP 3.1 s and Speed Index 4.2 s red; the Overview portrait fade is the suspect (P6.2); accessibility 98 (P6.3)

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

### Handoff — 2026-10-13 — P5.4a
Done:
- Projects list at `/dashboard/projects`: grouped by filter, each row with Visible and Featured switches, up/down reorder within the filter, and Delete with a confirm dialog that suggests hiding
- Actions `setProjectVisible`, `setProjectFeatured`, `moveProject`, `deleteProject`; featured cap of 3 (visible and featured) checked in both directions; reorder renumbers `sort` in one `db.batch`
Files created/changed:
- types/limits.ts; types/admin.ts; lib/db/admin-queries.ts (`getAdminProjects`); lib/dashboard/actions/projects.ts; components/dashboard/ProjectRow.tsx; app/dashboard/(admin)/projects/page.tsx; docs (CLAUDE.md, ROADMAP.md, PROGRESS.md)
Decisions:
- D102
Verified (viewports / devices):
- Typecheck, lint, build and `npm run start` on the Neon dev branch; list matches Neon; hiding and showing a project and a featured project updates the public Projects page and Overview; the cap blocks a 4th featured project and re-showing a hidden featured one; reorder within Frontend shows on the public site (`db.batch` works); delete removes the row and the public card; signed-out clicks redirect to login; phone layout; keyboard focus; public site unchanged
Known issues:
- Reorder cannot cross filters (Overview reads the global order)
Next step (ID + one-line goal):
- P5.4b — Projects create/edit form
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: the P5 section of ROADMAP.md, package.json, types/projects.ts, types/assets.ts, types/limits.ts, types/admin.ts, validators/projects.ts, validators/shared.ts, lib/db/schema.ts, lib/db/admin-queries.ts, lib/dashboard/admin-action.ts, lib/dashboard/form-data.ts, lib/dashboard/form-errors.ts, lib/dashboard/pending-asset.ts, lib/dashboard/actions/projects.ts, lib/dashboard/actions/assets.ts, lib/dashboard/actions/profile.ts, lib/blob/references.ts, lib/blob/cleanup.ts, lib/blob/url.ts, lib/projects/filters.ts, data/projects.ts, components/panels/ProjectCard.tsx, components/panels/FeaturedProjectCard.tsx, components/dashboard/AssetField.tsx, ProfileForm.tsx, TextField.tsx, FormSection.tsx, ProjectRow.tsx, every file in components/dashboard/ui/, and app/dashboard/(admin)/projects/page.tsx. Phase: P5 — Dashboard. Step: P5.4b. Mode: Build. Follow WORKFLOW.md §11. Goal: Build the project create/edit form: split validators/projects.ts into base shape and refinement (D89) so the form omits sort and visible, add the new project and edit routes, a slug generated at creation and read-only afterwards, status and filter selects, tech tags, two fixed link slots (Live and Repo), a logo upload that reuses the upload-on-Save flow from P5.3b, and add project logos to lib/blob/references.ts.

### Handoff — 2026-10-12 — P5.3b
Done:
- Vercel Blob uploads for avatar, portrait and resume: `uploadAsset` server action with size limit and magic-byte check (PNG, JPEG, WebP, PDF, no SVG); `AssetField` with local preview, Replace, Remove and Undo
- Files upload only when Save changes is pressed (one request per changed file); a failed save deletes the files uploaded during it; replaced files are deleted after a successful save (logged, warning toast on failure)
- Two Blob stores (dev and production), `bodySizeLimit` 4.5mb, `remotePatterns` for Blob
Files created/changed:
- lib/blob/{env,sniff,url,cleanup,references}.ts; types/assets.ts; lib/dashboard/{admin-action,pending-asset}.ts; lib/dashboard/actions/{assets,profile}.ts; components/dashboard/{AssetField,ProfileForm}.tsx; next.config.ts; .env.example; package.json (@vercel/blob); docs (CLAUDE.md, PROGRESS.md)
Decisions:
- D101 (amends D94)
Verified (viewports / devices):
- Typecheck, lint, build and `npm run start` on the dev branch and dev store; picking, replacing and undoing a file stores nothing; Save uploads exactly the changed files and deletes the replaced ones (server log, 404 on the old URL with the cache-bust curl, gone from the Vercel list); avatar, portrait and resume, also all three at once; Remove; oversize, text-as-png, SVG and wrong-type files rejected; signed-out save redirects to login; Overview, top bar and Get In Touch render after Remove and Replace; JSON-LD image is an absolute Blob URL; no token in client bundles
Known issues:
- A tab closed mid-save can leave one orphan file; P5.4b must add project logos to `lib/blob/references.ts`; the portrait LCP warning goes to P6.2
Next step (ID + one-line goal):
- P5.4a — Projects list: visibility, reorder within a filter, delete with confirm, featured cap
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: the P5 section of ROADMAP.md, package.json, types/projects.ts, validators/projects.ts, validators/shared.ts, lib/db/schema.ts, lib/db/admin-queries.ts, lib/dashboard/admin-action.ts, lib/dashboard/revalidate.ts, lib/dashboard/form-data.ts, lib/dashboard/form-errors.ts, lib/dashboard/actions/profile.ts, lib/blob/references.ts, data/projects.ts, lib/projects/filters.ts, components/panels/ProjectsPanel.tsx, components/panels/ProjectCard.tsx, components/panels/FeaturedProjectCard.tsx, components/dashboard/index.ts, every file in components/dashboard/ui/, and app/dashboard/(admin)/page.tsx. Phase: P5 — Dashboard. Step: P5.4a. Mode: Build. Follow WORKFLOW.md §11. Goal: Build the Projects list at /dashboard/projects: split the project validator into base shape and refinement and add types/limits.ts (D89), admin projects query, visibility switch, up/down reorder within a filter group with sort renumbering in one db.batch (D91), delete with ConfirmDialog, and the featured-visible cap of 3 checked in the actions.

### Handoff — 2026-10-12 — P5.3a
Done:
- Server-action pattern: `adminAction`, `ActionResult`, field errors keyed by path, `revalidateSite()`; form helpers (`readText`, `readLines`, `toFormErrors`), `FormSection`, `TextField`
- Profile editor without uploads: admin query (unparsed, D90), `updateProfile` action using the P4.3 schema, form with Identity, Overview, Get In Touch, Links, Location & availability and SEO sections, sticky save bar
- Projects list: reorder works only within a filter, while Overview reads the global order, so a project can't be moved across filters (D102)
- Fix: sign-out moved to `lib/dashboard/actions/auth.ts`; the dashboard barrel now exports server components only
Files created/changed:
- types/action.ts; lib/dashboard/{admin-action,revalidate,form-data,form-errors}.ts; lib/dashboard/actions/{profile,auth}.ts; lib/db/admin-queries.ts; components/dashboard/{FormSection,TextField,ProfileForm,profile-fields,SignOutForm,index}; app/dashboard/(admin)/profile/page.tsx; docs (CLAUDE.md, PROGRESS.md)
Decisions:
- D100 (amends D87)
Verified (viewports / devices):
- Typecheck, lint, build and `npm run start` on the Neon dev branch; save shows on the public site immediately; chips and focus pills; SEO description reaches page metadata; invalid email, timezone, empty name, empty and unsafe URLs are rejected with nothing saved; saving after sign-out redirects to login; 390×844; sign-out in sidebar and top bar; no auth code in client bundles
Known issues:
- Socials fixed to LinkedIn and GitHub; Get In Touch UTC label vs DST timezones
Next step (ID + one-line goal):
- P5.3b — Vercel Blob uploads for avatar, portrait and resume
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: the P5 section of ROADMAP.md, package.json, next.config.ts, lib/env.ts, lib/auth/require-admin.ts, lib/dashboard/admin-action.ts, lib/dashboard/revalidate.ts, lib/dashboard/form-data.ts, lib/dashboard/form-errors.ts, lib/dashboard/actions/profile.ts, types/action.ts, types/profile.ts, validators/shared.ts, validators/profile.ts, lib/db/admin-queries.ts, components/dashboard/ProfileForm.tsx, TextField.tsx, FormSection.tsx, every file in components/dashboard/ui/, and the components that show the three files (components/chrome/ProfileBadge.tsx, components/panels/OverviewPanel.tsx, components/panels/ContactPanel.tsx). Phase: P5 — Dashboard. Step: P5.3b. Mode: Build. Follow WORKFLOW.md §11. Goal: Add Vercel Blob uploads for avatar, portrait and resume through a server action (D94): `lib/blob/env.ts`, the `next.config.ts` changes (bodySizeLimit, remotePatterns), an AssetField component, and wiring into the profile form with cleanup of replaced blobs.

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
