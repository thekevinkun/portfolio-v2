# Portfolio v2 — Progress & Handoff

> Update at the **end of every chat**. Attach with `CLAUDE.md` at the start of the next one. Keep it short — a handoff, not a diary.

**Last updated:** 2026-11-1
**Current phase / step:** none open (P1–P7 done); next is I4
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
| P6    | Polish & finish          | ✅ Done        | D130–D136; improvements I1–I3 followed      |
| P7    | Project details          | ✅ Done        | Overlay live (D112–D129)                    |

Legend: ⬜ not started · 🟦 in progress · ✅ done · ⛔ blocked

---

## Current phase checklist

- [x] P6.1 Remaining animations: rolling counter and clock digits, ambient background (D130)
- [x] P6.2 Performance pass: icon sets out of the public JS and guarded (D131); mobile 91 (`/`) and 84 (`/projects`); LCP 3.0 s left as a known trade-off (entrance fade on the first text)
- [x] P6.3 Quick accessibility pass: `main` landmark added (D132); keyboard, screen-reader and reduced-motion spot checks passed
- [x] P6.4 Final content review (R4), project status check, domain decision (O5) done (D136); details write-ups moved to an improvement
- [x] P6.5 README.md and PROGRESS.md to complete
- [x] I1 Top bar clock follows the visitor's time zone, Contact keeps the owner's (D133)
- [x] I2 One page per wheel burst, however hard the swipe (D134)
- [x] I3 Get In Touch: Upwork card, no Email card (D135)
- [ ] I4 Details write-ups for Kundesk, Padel Batu Alam Permai and Kun Bookshop (written by Kun, formatted in a later chat)

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
- D112–D129: see CLAUDE.md §10.
- D130: see CLAUDE.md §10.
- D131: see CLAUDE.md §10.
- D132: see CLAUDE.md §10.
- D133: see CLAUDE.md §10.
- D134–D136: see CLAUDE.md §10.

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
- Profile editor: LinkedIn and GitHub are required, Upwork is optional (D135); another kind needs the tuple, an icon, the form and a layout check
- A tab closed during the few seconds of a profile save can leave one orphan file in the Blob store; a failed save uploads the new files and deletes them again (validating the text fields on the server first would avoid that)
- P5.4b must add project logos to `lib/blob/references.ts`, so `discardAsset` never deletes a logo a saved project uses
- The Vercel Blob list can lag after a delete; confirm a delete with `curl -sI "<url>?check=1"` (404 = gone)
- Next's dev warning flags the Overview portrait as the LCP image and suggests `priority`; fold it into the P6.2 LCP check (a blanket `priority` would preload the portrait on every landing page)
- The login page and the signed-in placeholder are unstyled stand-ins until P5.2
- Experience: the Shipped card says "Padel Court" while the project title is "Padel Batu Alam Permai" (D75, left as is)
- A bad row in Neon (for example a live project with no live link) fails the build; whether a failed hourly regeneration keeps serving the last good page was not tested (check before launch, P4.6)
- `logo.png` is not in the repo yet (added with the feature that shows it); the unused default files in `public/` are gone
- Content changes go through the dashboard; `data/` is seed input for a fresh database only, and `db:seed --update` needs `--yes-overwrite` (D97, D111)
- Lighthouse at launch: mobile 92 / 98 / 100 / 100 with LCP 3.1 s and Speed Index 4.2 s red; the Overview portrait fade is the suspect (P6.2); accessibility 98 (P6.3)
- The project logo (a wide image with the name) shows only at the top right of the project overlay (D128); a logo with dark text disappears on the dark page, so it needs a light version
- Categories: hiding one removes its tab only, its projects stay visible (D105); the tabs wrap onto more lines and were fit-checked with eight tabs at the five QA viewports, more than that is untested
- Tech Stack icons: a brand missing from the installed `react-icons` Simple Icons set falls back to a letter; type a different brand, a lucide name or `lucide:<name>` in the item's icon box (D108)
- Project icons and logos uploaded before P7.3b still sit in `profile/` in the Blob store; new project images go to `projects/` (D126), and `discardAsset` accepts both folders
- Details editor: edits are lost if you leave the page before saving (no unsaved-changes warning)
- Project overlay: after a reload while it is open, the history entry it added stays, so one Back goes to the same page (D127); the overlay has no deep link
- Project overlay: the screenshot viewer loads the original file (up to 2 MB), only after the first click
- Project overlay: the video keeps playing under the screenshot viewer, and Esc does not close the overlay while focus is inside the YouTube player (click outside it first)
- Project overlay: a video's cover is YouTube's thumbnail, so opening the overlay on a project with a video makes one request to `i.ytimg.com` (D129)
- Overview featured cards open the details from the title only; there is no Details button there (D129)
- Lighthouse mobile after the P6.2 icon fix: `/` 91, `/projects` 84 (TBT 190 and 410 ms, LCP 3.0 s on both); the `/projects` TBT may be run noise, re-check
- Mobile LCP is a text paragraph (Overview intro, Projects subtitle) with an element render delay of 1.84 s and 1.21 s and no download, so its entrance animation is the suspect; to be confirmed and decided in P6.2
- `check:client` reads source text and follows no chains; if the main chunk grows again, run `npx next experimental-analyze` (D131)
- Lighthouse flags 14 KiB of legacy JS, 77 KiB of unused JS and 14.9 KiB of render-blocking CSS in framework chunks; left as is
- Rolling digits: a wrap such as 9 → 0 rolls back up through the column instead of continuing downward (barely visible on the counter and the once-a-minute clock, D130)
- `cn()` (tailwind-merge) drops a `leading-*` class when `className` has a `text-*` size; put a line height that must survive on an inner element (found in `RollingText`, D130)
- Wheel: the 350 ms quiet time (D134) was measured on one laptop trackpad only and the mouse is untested; if a device still double-turns, raise `WHEEL_RELEASE_QUIET_MS` in `lib/stage/config.ts`; flicks chained faster than that are ignored on purpose
- The Kundesk landing page shows a made-up testimonial and "19+ / Ribuan" numbers; to be fixed in the Kundesk project (R4, D136)
- Padel Batu Alam Permai is a demo; its demo site has placeholder text ("#1 Padel Club", "500+ Happy Players", "Bali" for a Samarinda club, a sample phone number)
- The Kun Bookshop demo link is `http` on an EC2 hostname, so browsers warn "Not secure"; fixable with a custom domain (D136); the hostname also changes if the server's IP does
- Contact: the email address is no longer shown as text, only behind "Email me" (D135)

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

### Handoff — 2026-10-31 — P6.5 (P6 closed)
- P6.5: project README (what it is, stack, setup, scripts, dashboard, deploying, docs table) replaces the starter one; unused placeholder removed; the tracker is complete. Open: I4 (details write-ups for Kundesk, Padel Batu Alam Permai and Kun Bookshop, written by Kun), the Kundesk testimonial in its own project, and the Bookshop `http` link (a domain would fix it).
Prompt for the next chat (I4):
  Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md. Goal: Format the details write-ups for <project> to the D112 limits (problem ≤ 700, role ≤ 40, timeframe ≤ 30, features ≤ 6 with title ≤ 50 and text ≤ 220, notes ≤ 3 with title ≤ 60 and body ≤ 900, screenshots ≤ 8 with alt ≤ 140 and caption ≤ 140, video id), using only claims already true and supported by my facts (R4). I will paste the dashboard text myself.

### Handoff — 2026-10-31 — I3, P6.4
- I3: Get In Touch shows LinkedIn, Upwork and GitHub (Upwork optional, fixed order) and no Email card; D135. P6.4: content review closed; Tech Stack highlight updated, Bookshop on EC2, testimonial and Padel notes logged; D136. Next: P6.5 (README, close the tracker), then I4 (details write-ups) in a new chat.

### Handoff — 2026-10-31 — I1–I2
- I1: the top bar clock follows the visitor's time zone, Contact keeps the owner's (D133). I2: one page turn per wheel burst, however hard the swipe, with a 350 ms quiet rule for trackpads and mice (D134). P6.4 content review done in chat (Bookshop on EC2 with Docker, Kundesk testimonial to fix in its own repo, Padel is a demo); details write-ups for Kundesk, Padel and Bookshop come later as an improvement. Next: P6.4 and P6.5 closing docs, then the next items.

### Handoff — 2026-10-24 — P6.2–P6.3
- P6.2: the 5 MB icon chunk removed from the landing JS (`ProjectCard` imported by path), `check:client` build guard; mobile 91 (`/`) and 84 (`/projects`), LCP 3.0 s left as a trade-off; D131. P6.3: `main` landmark, other checks passed; D132. Next: P6.4 final content review (R4), project status check, domain decision (O5), details content for the featured projects.

### Handoff — 2026-10-20 — P6.1
- P6.1: Added rolling digits for the Projects counter and live clock, plus slow ambient background drift; no new dependencies. Fixed line-height alignment with an inner span. D130. Passed typecheck, lint, build, animation, reduced-motion, and 4× CPU-throttle checks. Safari and Firefox spot-checks remain for P6.2; known issue: 9 → 0 rolls backward through the column.

### Handoff — 2026-10-20 — P7.5 (P7 closed)
- P7.5: Completed the project details flow: conditional title and Details triggers, click-to-load YouTube embeds with fallbacks, and idle-loaded overlay chunk. D129 (amends D119). Passed typecheck, lint, build, and functional checks on the Neon dev branch. Lighthouse and fit-slack measurements remain outstanding (P6.2).

### Handoff — 2026-10-20 — P7.4b
- P7.4b: Built the project details overlay content, responsive layouts, wide logo placement, and full-screen screenshot viewer with keyboard, swipe, and thumbnail navigation. D128 (amends D104, D118, D120). Passed typecheck, lint, build, and viewport/interaction QA. Remaining: video support, card triggers (P7.5), and dark-text logo visibility on dark backgrounds.

### Handoff — 2026-10-19 — P7.4a
- P7.4a: overlay shell (one native `<dialog>`, open and close animation, history entry, Stage lock, focus return); D127.

### Handoff — 2026-10-19 — P7.3b
- P7.3b: screenshots in the details editor (up to 8, alt text, caption, reorder, upload on Save with rollback), `screenshot` upload kind, project images stored under `projects/`, removed files deleted, `isReferenced` checks `details`; D126.

### Handoff — 2026-10-16 — P7.3a
- P7.3a: details editor at `/dashboard/projects/<slug>/details` (overview fields, features and notes with reorder, YouTube link or id), `updateProjectDetails`, "Has details" tag and links in the project list; D125.

### Handoff — 2026-10-16 — P7.2b
- P7.2b: `projects.details` jsonb column (applied to production only after the merge, so the first production build failed until it ran), `StoredProject` base type with `hasDetails` on `Project`, cached `getProjectDetails()`; D124.
  
### Handoff — 2026-10-16 — P7.2a
- P7.2a: `ProjectDetails` types, `YOUTUBE_ID_PATTERN`, the D112 limits and `projectDetailsSchema` with `detailsOrNull`; `hasDetails` moved to P7.2b; D123.

### Handoff — 2026-10-15 — P7.1 (plan chat)
- P7.1: planned the project details overlay (content model, loading, mount, animation, history, Stage guard, layouts, video, screenshots, editor); split P7.2–P7.5; D112–D122.

### Handoff — 2026-10-15 — P5.7 (P5 closed)
- P5.7: hardening: `db:seed --update` needs `--yes-overwrite`, build-time `check:actions` guard, empty states, signed-out and revoked-session probes; P5 closed; D111.

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
