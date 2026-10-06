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
| P2.5 | URL sync (`replaceState`), per-section title/canonical, SSR deep links via `[[...section]]`. |
| P2.6 | Visuals: outgoing scale/dim, parallax layer, edge shadow, rubber-band at first/last page. |
| P2.7 | Dock ring glide synced to Stage state. |
| P2.8 | A11y: live region, focus management, reduced-motion crossfade. |
| P2.9 | **Manual device pass** (checklist below). |

**Stage manual checklist**
- [ ] Mouse wheel: one notch-burst = one page
- [ ] Mac trackpad: a hard flick = exactly one page (no double skip)
- [ ] Windows precision touchpad: same
- [ ] Phone: swipe left/right pages; vertical inner scroll still works where allowed
- [ ] Keyboard only: all five pages reachable, focus visible
- [ ] Direct load of `/projects` shows the right page with no flash
- [ ] Reduced motion on: crossfade only
- [ ] Wheel over an inner scrollable area scrolls it instead of turning the page
- [ ] Page turn smooth with 4× CPU throttle

---

## P3 — Five pages with static data (L)

| Step | Task |
|---|---|
| P3.1 | **Design chat:** layouts for **Experience** and **Get In Touch** (links-only) in the same style; settle O1–O3, O6; define density tiers per page. |
| P3.2 | Typed static data in `types/` + temporary `data/seed.ts` mirroring the 4 tables. |
| P3.3 | **Overview:** headline, tagline, chips, portrait with radial mask, CV button, 3 featured projects. |
| P3.4 | **Tech Stack:** 4 group cards, highlights, optional strip, density tiers. |
| P3.5 | **Projects:** filter pills, carousel, arrows, counter, status badges, link buttons. |
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
| P4.2 | Drizzle schema + migration (review SQL, apply to Neon). |
| P4.3 | Seed script from the static data (idempotent). |
| P4.4 | `getStageData()` queries; swap all panels to DB data; remove static seed from runtime imports. |
| P4.5 | SEO basics: per-section metadata, canonical, sitemap, robots, JSON-LD `Person`, OG image. |
| P4.6 | **Launch checklist:** re-run content audit (R4), Lighthouse, deploy to production, update LinkedIn/GitHub/Upwork/CV links. |

**Acceptance:** editing a row in Neon + revalidation updates the site; Lighthouse mobile ≥ 90; no hardcoded content left. **→ LAUNCH**

---

## P5 — Dashboard (M)

| Step | Task |
|---|---|
| P5.1 | Auth.js + GitHub allowlist; `proxy.ts` guard + `requireAdmin()` re-check in every action. |
| P5.2 | Dashboard layout (shadcn/ui, dark) + overview links. |
| P5.3 | Profile editor (incl. Blob uploads for avatar/portrait/resume). |
| P5.4 | Projects editor (CRUD, status, links, tags, featured/visible, up/down reorder). |
| P5.5 | Tech Stack editor (groups, items, highlights, strip, icon picker, reorder). |
| P5.6 | Experience editor. |
| P5.7 | Cross-cutting: Zod validation on every write, confirm deletes, toasts, `revalidatePath`, "view on site". |

**Acceptance:** unauthenticated access is rejected everywhere; only the allowlisted account signs in; create/edit/reorder/hide/delete each reflect on the public site on next load.

---

## P6 — Polish & finish (S–M)

| Step | Task |
|---|---|
| P6.1 | Remaining animations: carousel counter + filter reflow (E), live clock digits (F), ambient background (G); optional boot intro and portrait parallax. |
| P6.2 | Perf pass at 4× throttle; confirm `LazyMotion`, no unused icons, dashboard code not in public chunks; image sizes/priority for the LCP image. |
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
