# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-10-12
**Current phase / step:** P5.2
**Mode default:** Build

---

## Phase tracker

| Phase | Name                     | Status         | Notes                                       |
| ----- | ------------------------ | -------------- | ------------------------------------------- |
| P1    | Setup, tokens & chrome   | ✅ Done        |                                             |
| P2    | Stage engine             | ✅ Done | Device pass passed (P2.9); spec in CLAUDE.md §4.2.1      |
| P3    | Five pages (static data) | ✅ Done        | Fit QA passed at all eight viewports (P3.9) |
| P4    | Neon data → LAUNCH       | ✅ Done        | Launched on kevinmahendra.vercel.app        |
| P5    | Dashboard                | 🟦 In progress | P5.1–P5.3a done (D82–D100) |
| P6    | Polish & finish          | ⬜ Not started |                                             |

Legend: ⬜ not started · 🟦 in progress · ✅ done · ⛔ blocked

---

## Current phase checklist

- [x] P5.1 Auth: next-auth@beta, GitHub allowlist, `requireAdmin()`, `proxy.ts`, bare login page
- [x] P5.2 Dashboard shell: own form primitives, layout, nav, overview
- [x] P5.3a Action pattern + Profile editor (no uploads)
- [ ] P5.3b Blob uploads (avatar, portrait, resume)
- [ ] P5.4a Projects list: visibility, reorder, delete, featured cap
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
- D82–D100: see CLAUDE.md §10.

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
- The login page and the signed-in placeholder are unstyled stand-ins until P5.2
- Experience: the Shipped card says "Padel Court" while the project title is "Padel Batu Alam Permai" (D75, left as is)
- Nothing caps `featured` at 3 rows; the P5.4 project actions add the check (D89)
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

### Handoff — 2026-10-12 — P5.3a
Done:
- Server-action pattern: `adminAction`, `ActionResult`, field errors keyed by path, `revalidateSite()`; form helpers (`readText`, `readLines`, `toFormErrors`), `FormSection`, `TextField`
- Profile editor without uploads: admin query (unparsed, D90), `updateProfile` action using the P4.3 schema, form with Identity, Overview, Get In Touch, Links, Location & availability and SEO sections, sticky save bar
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
Done:
- Dashboard shell: `(admin)` layout with `requireAdmin()`, sticky top bar on phones and fixed sidebar from `lg`, nav with active state, sign-out, sonner Toaster
- Own form primitives (Input, Textarea, Select, Switch, FieldRow, ConfirmDialog), no shadcn
- Styled login page; overview with live counts, per-area cards and "View site"; temporary stub for the editor routes
- Fixes after review: `ConfirmDialog` `onConfirm` accepts any return value; readable `Select` options; danger button colors
Files created/changed:
- components/dashboard/{DashboardShell,DashboardNav,SignOutForm,nav-items,index}; components/dashboard/ui/{Input,Textarea,Select,Switch,FieldRow,ConfirmDialog,Toaster,field-styles,index}; app/dashboard/(admin)/{layout,page}.tsx and [area]/page.tsx; app/dashboard/login/page.tsx; lib/db/admin-queries.ts; types/admin.ts; app/globals.css (danger tokens); package.json (sonner); docs (CLAUDE.md, PROGRESS.md)
Decisions:
- D99
Verified (viewports / devices):
- Typecheck, lint, build; overview, nav, stubs, styled login, guards and the primitives (temporary preview page, deleted) at 1440×900 and 390×844; keyboard focus; dialog centered, Esc and backdrop close; public site unchanged
Known issues:
- Editor stub to delete in P5.7; open `Select` list is browser-drawn
Next step (ID + one-line goal):
- P5.3a — action pattern and the Profile editor (no uploads)
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: the P5 section of ROADMAP.md, package.json, next.config.ts, eslint.config.mjs, lib/env.ts, lib/auth/index.ts, lib/auth/require-admin.ts, lib/db/schema.ts, lib/db/queries.ts, lib/db/admin-queries.ts, types/profile.ts, validators/shared.ts, validators/profile.ts, data/seed.ts, app/manifest.ts, app/dashboard/(admin)/layout.tsx, app/dashboard/(admin)/page.tsx, components/dashboard/index.ts, components/dashboard/ui/index.ts and every file in components/dashboard/ui/. Phase: P5 — Dashboard. Step: P5.3a. Mode: Build. Follow WORKFLOW.md §11. Goal: Build the server-action pattern (adminAction, ActionResult, revalidateSite, form field primitives for string lists and socials) and the Profile editor without uploads, verifying that the helper compiles as a "use server" export and whether a profile edit refreshes the manifest.

### Handoff — 2026-10-11 — P5.1
Done:
- Auth.js (`next-auth@beta`, GitHub, JWT sessions, no adapter) with the numeric-id allowlist, `requireAdmin()` / `getAdminSession()`, the `proxy.ts` guard for `/dashboard`, a bare login page, a signed-in placeholder with sign-out, and `noindex` on the dashboard
Files created/changed:
- lib/auth/{env,index,require-admin}.ts; types/next-auth.d.ts; app/api/auth/[...nextauth]/route.ts; proxy.ts; app/dashboard/layout.tsx, login/page.tsx, (admin)/page.tsx; .env.example; package.json; docs (PROGRESS.md)
Decisions:
- D82–D85 implemented as planned; no new decisions
Verified (viewports / devices):
- Typecheck, lint, build (public routes still static); signed-out redirect; your account in and out; wrong account rejected; revocation by changing `ADMIN_GITHUB_ID`; public site unchanged; preview green; production sign-in
Known issues:
- Preview URLs cannot sign in; login and placeholder pages are unstyled until P5.2
Next step (ID + one-line goal):
- P5.2 — Dashboard shell: own form primitives, layout, nav, overview with counts
Prompt for the next chat:
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Repo files: <git ls-files output>. Also pasted: the P5 section of ROADMAP.md, package.json, tsconfig.json, app/globals.css, lib/cn.ts, components/ui/index.ts, components/ui/Button.tsx, components/ui/GlassCard.tsx, components/ui/Pill.tsx, components/ui/Chip.tsx, lib/auth/index.ts, lib/auth/require-admin.ts, app/dashboard/layout.tsx, app/dashboard/login/page.tsx, app/dashboard/(admin)/page.tsx, lib/db/schema.ts. Phase: P5 — Dashboard. Step: P5.2. Mode: Build. Follow WORKFLOW.md §11. Goal: Build the dashboard shell with its own form primitives (no shadcn): the (admin) layout with sidebar/top-bar nav, the small primitives (Input, Textarea, Select, Switch, ConfirmDialog, FieldRow), sonner toasts, styled login page, and an overview page with counts and links.

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
