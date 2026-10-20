# Portfolio v2 — Roadmap (lean)

> Six phases, step by step. One phase (or a few steps) per chat. Step IDs (`P2.3`) are used in `PROGRESS.md` and chat starters.
>
> Sizes: **S** ≤ 1 day · **M** 2–4 days · **L** ~1 week (part-time stretches these).
>
> **Launch gate = end of Phase 4.** Don't let Phases 5–6 delay applications or outreach.

| Phase | Name | Size | Outcome |
|---|---|---|---|
| P1 | Setup, tokens & chrome | M | Repo, Neon, Vercel; top bar, dock, footer match the screenshots |
| P2 | Stage engine | L | Book-style page turn with wheel/keys/touch/URL/a11y |
| P3 | Five pages (static data) | L | Every page fits one screen at every QA viewport |
| P4 | Neon data → **LAUNCH** | M | Site fully database-driven and live |
| P5 | Dashboard | M | Secure admin to edit all content |
| P7 | Project details | L | Overlay with a structured write-up (D106, D112–D122); built after P5, before P6 |
| P6 | Polish & finish | S–M | Remaining animations, perf pass, OG images, final content check |

---

## P1 — Setup, tokens & chrome (M)

| Step | Task |
|---|---|
| P1.1 | **Content audit:** list every claim, metric, tech, project status planned for the site; mark *true / measurable / remove* (R4). Settle O1–O6 or accept defaults and log them. |
| P1.2 | Scaffold: Next.js, TS strict, Tailwind v4, ESLint, folder skeleton (CLAUDE.md §7), `lib/env.ts`. |
| P1.3 | Neon project + Drizzle connected (no tables yet). Push to GitHub, deploy the empty shell to Vercel. Move docs into `docs/`. |
| P1.4 | Port tokens from the reference HTML to `@theme`; fonts via `next/font` (Inter, JetBrains Mono). |
| P1.5 | Primitives: `GlassCard`, `Pill`, `Chip`, `Button`, `SectionHeader`; background layers (obsidian gradient, glow, grain). |
| P1.6 | `TopBar` (brand, live clock, avatar + status), `StatusFooter` (clock/location/availability — no fake metrics). |
| P1.7 | `Dock` + `DockTile` (default / hover / focus / active, ping dot) with the small icon map; mobile bottom tab bar. |

**Acceptance:** empty app deploys on Vercel; chrome matches screenshots at 1440×900 and 390×844; focus states visible; content-audit list exists.

---

## P2 — Stage engine (L) — *highest risk, built early with placeholder pages*

| Step | Task |
|---|---|
| P2.1 | **Plan chat (no code):** confirm thresholds, transition spec, URL strategy, a11y behavior; update CLAUDE.md §4.2 if anything changes. |
| P2.2 | Stage reducer/context (`idle / transitioning / cooldown`) and track + panels layout with `translate3d` transition; inactive panels `inert`. |
| P2.3 | Custom wheel intent state machine: axis rule, one-page-per-gesture lock, notch vs trackpad stream handling, data-stage-scroll exemption. |
| P2.4 | Keyboard (← → PageUp/Down Home/End 1–5), dock click, touch swipe. |
| P2.5 | URL sync (replaceState) driven by Stage state, per-section title, SSR deep links via [[...section]]; Dock/TabBar active tile reads Stage state. |
| P2.6 | Visuals: outgoing scale/dim, parallax layer, edge shadow, rubber-band at first/last page. |
| P2.7 | Dock ring glide synced to Stage state (the active tile already follows the Stage since P2.5). |
| P2.8 | A11y: live region, focus management, reduced-motion crossfade. |
| P2.9 | **Manual device pass** (checklist below). |

**Stage manual checklist**
- [x] Mouse wheel: one notch-burst = one page
- [x] Mac trackpad: a hard flick = exactly one page (no double skip)
- [x] Windows precision touchpad: same
- [x] Phone: swipe left/right pages; vertical inner scroll still works where allowed
- [x] Keyboard only: all five pages reachable, focus visible
- [x] Direct load of `/projects` shows the right page with no flash
- [x] Reduced motion on: crossfade only
- [x] Wheel over an inner scrollable area scrolls it instead of turning the page
- [x] Page turn smooth with 4× CPU throttle

---

## P3 — Five pages with static data (L)

| Step | Task |
|---|---|
| P3.1 | **Design chat:** layouts for **Experience** and **Get In Touch** (links-only) in the same style; settle O1–O3, O6; define density tiers per page. |
| P3.2 | Typed static data in `types/` + temporary `data/seed.ts` mirroring the 4 tables. |
| P3.3 | **Overview:** headline, tagline, chips, portrait with radial mask, CV button, 3 featured projects. |
| P3.4 | **Tech Stack:** 4 group cards (carousel below 1280 px), one-line highlights, no strip. |
| P3.5 | **Projects:** filter pills, carousel (reuse `Carousel`), arrows, counter, status badges, link buttons. |
| P3.6 | **Experience** per P3.1 design. |
| P3.7 | **Get In Touch:** statement, email/LinkedIn/GitHub/resume buttons, availability. |
| P3.8 | Entrance choreography (catalog C) on activation; card spotlight (D). |
| P3.9 | **Fit QA** at all 8 viewports; fix overflow with density tiers. |

**Acceptance:** zero page-level scroll at all desktop/tablet viewports; phones follow O1; text readable at compact tier.

---

## P4 — Neon data → LAUNCH (M)

| Step | Task |
|---|---|
| P4.1 | Plan chat (no code): finalize the 4-table schema and JSON column shapes. |
| P4.2 | Types become `as const` tuples and gain `slug` fields (D64, D65); Drizzle schema, `db:*` scripts, migration (review SQL, apply to Neon). |
| P4.3 | Zod schemas in `validators/`; `scripts/seed.ts` via `tsx`, idempotent (D71); add "testnet" to the Chainkuns and DarkMint summaries (D76). |
| P4.4 | `getStageData()` queries (D68); swap all panels to DB data; `revalidate = 3600` (D69); ESLint guard on `@/data/*` (D72); remove static seed from runtime imports. |
| P4.5 | SEO basics: per-section metadata, canonical, sitemap, robots, JSON-LD `Person`, OG image. |
| P4.6 | **Launch checklist:** re-run content audit (R4), Lighthouse, deploy to production, update LinkedIn/GitHub/Upwork/CV links. |

**Acceptance:** editing a row in Neon updates the site after the revalidate window (D69) or a redeploy; Lighthouse mobile ≥ 90; no hardcoded content left. **→ LAUNCH**

---

## P5 — Dashboard (M)

Plan locked in the P5 plan chat (D82–D97). 🎨 steps are visual: they stop at the verify command until approved. Prepare the env vars and accounts listed in the PROGRESS.md handoff.

| Step | Task |
|---|---|
| P5.1 | Auth: `next-auth@beta`, GitHub provider, JWT sessions, allowlist by GitHub id (D82, D83); `lib/auth/env.ts`; `requireAdmin()`; `proxy.ts` guard; bare login page and signed-in placeholder (D84, D85) |
| P5.2 🎨 | Dashboard shell: own form primitives in `components/dashboard/ui` (Input, Textarea, Select, Switch, ConfirmDialog on native `<dialog>`, D93); layout, nav, Toaster, noindex; overview with counts and links |
| P5.3a | Action pattern (`adminAction`, `ActionResult`, `revalidateSite`, field primitives; D87, D88) and the Profile editor without uploads; admin profile query (D90) |
| P5.3b 🎨 | Vercel Blob uploads for avatar, portrait and resume (D94); delete replaced blobs; `next.config.ts` changes |
| P5.4a 🎨 | Projects list: `types/limits.ts` (featured cap), admin query, visibility, reorder within a filter, delete with confirm, featured cap of 3 (D91) |
| P5.4b 🎨 | Projects create/edit form (with the validator base split, D89): status, filter, tags (any number), two link slots, icon and logo upload; slug set at creation (D103, D104) |
| P5.4c 🎨 | Project categories: `project_categories` table, categories editor, the project form reads it, public pills come from visible categories (D105); migration dev then production; fit check with more pills |
| P5.5 🎨 | Tech Stack editor: edit, reorder and hide groups; items (up to 7) with an icon found from the name, highlights (up to 5), limits visible; card numbers follow the order; fit QA with full cards at the QA viewports (D92, D98, D107, D108) |
| P5.6 🎨 | Experience editor: Work and Learning items, shipped projects (max 3), three core bullets kept first (D92) |
| P5.7 | Hardening: `--yes-overwrite` guard on the seed (D97); build-time guard check (D111); empty-state test; every route and action tried signed out; revoke test; "view on site" links; Known issues cleanup |

**Acceptance:** unauthenticated access is rejected everywhere; only the allowlisted account signs in; create/edit/reorder/hide/delete each reflect on the public site on next load.

---

## P7 — Project details (L) — built after P5 and before P6

Decided in the P5.4b discussion (D106). Numbered P7 so the P6 references in PROGRESS.md stay valid; Polish (P6) stays last.

| Step | Task |
|---|---|
| P7.1 | **Plan chat (no code):** done, D112–D122 |
| P7.2a | Types, limits and `projectDetailsSchema` (`hasDetails` moved to P7.2b, D123) |
| P7.2b | `details` column and migration (dev, then production), `hasDetails` on `Project` and every file that builds one, `getProjectDetails()` |
| P7.3a | Dashboard editor page and action: text sections, role, timeframe, video id, reorder; screenshots passed through unchanged |
| P7.3b 🎨 | Screenshots: upload kind, picker with previews, captions and reorder, `isReferenced`, cleanup |
| P7.4a 🎨 | Overlay shell: `<dialog>`, context, open and close animation, history entry, Stage guard, focus return, reduced motion |
| P7.4b 🎨 | Overlay content and both layouts, fit measured at the QA viewports |
| P7.5 🎨 | Details button and title trigger on Projects and Overview cards, YouTube facade, performance pass |

**Acceptance:** a card opens its project details without leaving `/projects`; Esc, Back and the close button close it; the Stage does not turn behind it; Lighthouse mobile stays ≥ 90.

---

## Later — Work timeline (S–M, built when the first job or client exists)

Designed in the P5.6 discussion (D110). No migration: kinds and dates exist.

| Step | Task |
|---|---|
| L1 | Experience panel: the Work card lists up to 4 roles (current first, then newest), the Shipped cards and the Learning band stay as they are; the carousel order and the `nth-1` assumption are re-checked |
| L2 | Dashboard: create and delete Work and Freelance items (up to 4), automatic order, Learning stays single |
| L3 | Fit QA with three roles at 1366×768, 1280×720, 1024×768 and the phone carousel; update the profile texts, resume and LinkedIn |

---

## P6 — Polish & finish (S–M)

| Step | Task |
|---|---|
| P6.1 | Remaining animations: carousel counter + filter reflow (E), live clock digits (F), ambient background (G); optional boot intro and portrait parallax. |
| P6.2 | Perf pass at 4× throttle; confirm `LazyMotion`, no unused icons, dashboard code not in public chunks; image sizes/priority for the LCP image. Launch measurement: mobile LCP 3.1 s, Speed Index 4.2 s; check whether the Overview portrait fade is the LCP element. Re-run Lighthouse mobile on `/` and `/projects` after P7 (the P7 acceptance asks for 90 or more; it was not measured in P7.5) and confirm the lazy overlay chunk stays out of the landing JS. |
| P6.3 | Quick a11y pass (keyboard, contrast, screen-reader spot check). |
| P6.4 | Final content review (R4) and project status check; optional `@vercel/analytics`; domain decision (O5). |
| P6.5 | Short `README.md`; update `PROGRESS.md` to complete. |

---

## Viewport QA matrix (every page)

1920×1080 · 1440×900 · 1366×768 · 1280×720 · 1024×768 · 768×1024 · 390×844 · 360×640

## Risks

| Risk | Mitigation |
|---|---|
| Trackpad inertia causes double page skips | Build and device-test the wheel logic first (P2.3, P2.9) |
| Dense pages overflow on short screens (e.g. Tech Stack at 1366×768) | Density tiers designed in P3.1, verified in P3.9 |
| Scope creep before launch | Launch gate at P4; R9 (no new deps without a logged decision) |
| Mock content contains untrue claims | Content audit at P1.1, re-checked at P4.6 and P6.4 |
