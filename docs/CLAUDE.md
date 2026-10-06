# Portfolio v2 — Project Bible (CLAUDE.md)

> **How to use.** Stable context for every chat. At the start of a chat, attach this file + `PROGRESS.md`, and paste only the phase you're working on from `ROADMAP.md`. When a decision changes, update Section 10 in the same chat.
>
> Status: **P1 done; P2 (Stage engine) in progress.**
>
> Working method: follow `docs/WORKFLOW.md` for how every step is delivered (branch, commits, verify, docs, PR).

---

## 1. What we're building

A personal portfolio for Kevin Mahendra (Kun) that feels like a console UI (PS5-style) instead of a scrolling page.

- Five pages, one at a time: **Overview, Tech Stack, Projects, Experience, Get In Touch**.
- Each page fits exactly one screen (100dvh). **No vertical page scrolling.**
- Mouse wheel turns the page **sideways like a book**: wheel down → next page slides in from the right; wheel up → previous page slides back from the left.
- A 5-tile dock at the top shows the active page and is also the navigation.
- Content lives in **Neon Postgres**, managed from a private **Dashboard**. No redeploy needed to change content.
- Animations feel premium but cost almost nothing at runtime.
- **Get In Touch has no form** — just email, LinkedIn, GitHub, resume download, and availability.

**Audience:** recruiters, hiring managers, potential clients who give the site 30–60 seconds.

---

## 2. Rules

| #   | Rule                                                                                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **One screen per page** on desktop/tablet: fits `100dvh`, no page-level scroll. Designed to a density tier (5.3), not squeezed afterwards.                                                                                      |
| R2  | **Scroll = turn the page.** Vertical wheel/swipe intent changes page. Horizontal input inside a component (carousel) belongs to that component.                                                                                 |
| R3  | **Content from the database** after Phase 4. No hardcoded copy, projects, or links in components.                                                                                                                               |
| R4  | **Honest content.** Every claim must survive an interview question. No fake metrics. A technology is "used" only if it shipped in a real project, else "learning". Projects show a status (`live` / `in-progress` / `planned`). |
| R5  | **Fast and lean.** Lighthouse mobile ≥ 90. Page turn stays smooth with 4× CPU throttle.                                                                                                                                         |
| R6  | **Accessible basics.** Keyboard navigation, visible focus, `prefers-reduced-motion` respected, page changes announced.                                                                                                          |
| R7  | **Crawlable.** All five sections are server-rendered.                                                                                                                                                                           |
| R8  | **Ship early.** Public launch at the end of Phase 4, before the dashboard exists.                                                                                                                                               |
| R9  | **Stay minimal.** No new library or service without logging a decision in Section 10.                                                                                                                                           |

---

## 3. Stack

### Decided

| Area         | Choice                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| Framework    | Next.js (App Router), React, TypeScript strict (zero `any`)                                             |
| Styling      | Tailwind CSS v4 (CSS-first `@theme` tokens). Port the reference HTML (Tailwind v3 CDN) — don't copy it. |
| Animation    | Motion (formerly Framer Motion) with `LazyMotion` + CSS for ambient/hover effects                       |
| Database     | Neon + Drizzle (`@neondatabase/serverless`)                                                             |
| Validation   | Zod (server-side, for dashboard writes)                                                                 |
| Dashboard UI | shadcn/ui (dashboard only), React 19 `useActionState` for forms                                         |
| Auth         | Auth.js with GitHub login, allowlisted to Kun's account                                                 |
| Images       | Vercel Blob (save the URL in the field), `next/image`                                                   |
| Hosting      | Vercel (its build's typecheck is the safety net)                                                        |

### Small libraries (each earns its place)

| Library                                                | Used for                                                |
| ------------------------------------------------------ | ------------------------------------------------------- |
| Embla Carousel (or keen-slider, or native scroll-snap) | Projects carousel                                       |
| `@formkit/auto-animate`                                | Filter-pill reflow, dashboard lists                     |
| `@number-flow/react` (optional)                        | Rolling digits for the `01 / 04` counter and clock      |
| `clsx` + `tailwind-merge`                              | Class handling                                          |
| `sonner`                                               | Dashboard toasts                                        |
| `react-icons` (Simple Icons set) + `lucide-react`      | Tech logos + UI icons; a small key→icon map (~40 icons) |
| `@vercel/analytics` (optional)                         | Visitor counts                                          |

### Deliberately NOT used

Ant Design · Vitest/Playwright · Redis/Upstash · Resend and any contact form · Zustand · react-hook-form · TanStack Table · dnd-kit · Sentry/PostHog · custom CI · cache tags · media library · markdown case studies. Revisit only if a real need appears (R9).

---

## 4. Architecture

### 4.1 Routes

```
/  /tech-stack  /projects  /experience  /contact   → the same Stage component, different initial page
/dashboard/**                                        → private admin (own layout)
```

After load, moving between pages is client-side with no remount; only the URL changes.

### 4.2 The Stage (core mechanism — built first)

- **Persistent chrome:** top bar, dock, footer never unmount; only the content area slides.
- **Track:** five panels side by side; page change = `translate3d` on the track + light parallax on inner layers + outgoing panel scales ~0.96 and dims.
- **Panels:** all five server-rendered and mounted; inactive ones are `inert` and pause their animations.
- **Inputs → intent** (next, prev, goTo(i)): vertical wheel, keyboard (← → PageUp/PageDown, Home/End, 1–5), horizontal touch swipe, dock/tab-bar tap (real links), deep links.
- **Wheel rules:**
  - Act only when `|deltaY| > |deltaX|`.
  - Exactly **one page per gesture** for both mouse wheels and trackpads (trackpad inertia must not skip a page): lock until the transition ends and the wheel stream pauses or a clearly new gesture begins.
  - Don't hijack the wheel over an element marked `data-stage-scroll` (or a scrollable ancestor).
- **Edges:** first page + up / last page + down → small rubber-band bounce, no navigation.
- **URL:** `history.replaceState` (Back leaves the site). Update `document.title` and canonical per section.
- **State:** small React reducer/context: `index`, `direction`, `phase` (`idle | transitioning | cooldown`).
- **Reduced motion:** 150 ms crossfade, no parallax/choreography.
- **A11y:** labelled `<section>` per panel, `aria-current="page"` on the dock tile, polite live region ("Projects, page 3 of 5"), focus moves to the page heading after a change.

### 4.2.1 Stage spec (P2.1)

All numbers live in `lib/stage/config.ts`. Durations and easing come from the CSS motion tokens (`--duration-page`, page easing); JS reads them once on mount for the fallback timer.

**Wheel**

| Rule             | Value                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Axis             | Act only when `\|dy\| > \|dx\|`; horizontal wheel belongs to carousels                                                         |
| Normalize        | `deltaMode` 1 (lines) × 16; 2 (pages) × viewport height                                                                        |
| Noise floor      | Ignore `\|dy\| < 2`                                                                                                            |
| Accumulator      | Sum `dy` per gesture; reset after 100 ms with no events                                                                        |
| Trigger          | Accumulated `\|dy\| ≥ 40` fires one next/prev and locks the gesture                                                            |
| Notch vs stream  | A single event ≥ 80 after ≥ 150 ms of quiet is a mouse notch; anything else is a trackpad stream                               |
| Notch unlock     | Transition end + 100 ms (no quiet period needed)                                                                               |
| Stream unlock    | After transition end: 120 ms of quiet, or a new gesture (delta ≥ 1.3× previous and ≥ 30, or direction flip with `\|dy\| ≥ 30`) |
| Safety cap       | Force unlock 2000 ms after the trigger                                                                                         |
| Inner scroll     | If the target (or a scrollable ancestor, or `data-stage-scroll`) can scroll in that direction, ignore the whole gesture        |
| Browser gestures | `overscroll-behavior: none` on html/body                                                                                       |

**Touch:** pointer events, `touch` only; `touch-action: pan-y` on the stage (inner vertical scroll on phones, O1). Axis lock after 10 px. Commit on release at `|dx| ≥ 60 px` or velocity ≥ 0.4 px/ms; left swipe = next. No finger-following in v1. Swipes starting inside `data-stage-swipe-ignore` (carousel) belong to that element.

**Keyboard:** ← → PageUp PageDown Home End 1–5. Ignored in input/textarea/select/contenteditable or with Ctrl/Meta/Alt. ↑/↓ are not bound.

**Dock / TabBar:** real `<a href>` links; `onClick` → `preventDefault()` + `goTo(i)` (except modified clicks).

**Locking:** gesture inputs (wheel, swipe) are ignored unless phase is `idle`. Discrete inputs (keyboard, dock) are accepted in any phase and retarget mid-flight.

**Edges:** first page + up / last page + down = rubber-band (20 px out in 140 ms, back in 280 ms), no navigation, 300 ms cooldown.

**Transition**

| Item              | Value                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------- |
| Mechanism         | Track `translate3d(-index*100%,0,0)` with a CSS transition; phase advances on `transitionend` with a `duration + 100 ms` timeout fallback |
| Duration / easing | `--duration-page` (650 ms) / out-expo style, for every move                                                                               |
| Outgoing panel    | scale 1 → 0.96, opacity 1 → 0.55                                                                                                          |
| Parallax          | Inner layer of the incoming panel starts offset 6% of panel width in the travel direction, settles to 0                                   |
| Edge shadow       | Leading edge of incoming panel, 0.5 → 0 opacity                                                                                           |
| Cooldown          | 120 ms minimum after the transition before the next gesture                                                                               |
| `will-change`     | On the track during transition only                                                                                                       |
| State             | `{ index (target), from, direction, phase, source }`; phases `idle → transitioning → cooldown → idle`                                     |
| Panel attributes  | `data-state="active                                                                                                                       | outgoing | idle"`+`data-direction`; all visuals key off these |
| Inactive panels   | `inert` + animations paused; `inert` removed from the incoming panel at transition start, applied to the outgoing one at transition end   |
| Reduced motion    | Duration token overridden to 150 ms; track jumps, incoming panel fades in; no parallax/scale/shadow                                       |

**URL:** one route `app/(site)/[[...section]]/page.tsx`; valid slugs `tech-stack`, `projects`, `experience`, `contact` (empty = Overview); anything else `notFound()`; `generateStaticParams` + `generateMetadata` per section. Server derives the initial index so the track renders already positioned (no flash). Client: `history.replaceState` at transition start + `document.title` + canonical. The Stage does not read `usePathname()`. Browser back/forward is not a Stage input (Back leaves the site).

**A11y:** each panel is `<section aria-labelledby>`; `aria-current="page"` on the active dock tile; one polite live region ("Projects, page 3 of 5") updated at transition start, debounced 150 ms; after the transition, focus moves to the incoming panel heading (`tabindex="-1"`, `preventScroll`) when the source was keyboard/dock or focus was inside the outgoing panel; wheel/swipe never steal focus.

### 4.3 Content flow

```
Neon → Drizzle queries (parallel) → getStageData() → Stage (SSR, all 5 panels)
Dashboard save → server action → write → revalidatePath on the public routes
```

Every dashboard mutation: **auth check → Zod validate → write → revalidate.** No exceptions.

### 4.4 Data model (4 tables)

| Table               | Contents                                                                                                                                                                                                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile` (one row) | name, headline, tagline/intro, role label, location label, timezone, email, availability text, avatar/portrait/resume URLs, socials (JSON array), SEO title/description, optional Tech Stack bottom-strip items (JSON) |
| `skill_groups`      | index label, title, subtitle, badge text, icon key, **items** (JSON: name, icon key, `used`/`learning`), **highlights** (text array), sort, visible                                                                    |
| `projects`          | slug, title, kicker label, summary, filter type (`full-stack`, `frontend`, `game`, `web3`, `systems`), **status**, logo URL, tech tags (text array), **links** (JSON: kind, label, url), featured flag, sort, visible  |
| `experience_items`  | kind (`work`, `freelance`, `education`, `milestone`), title, organization, start, end/present, summary, bullets (text array), sort, visible                                                                            |

Auth tables come from Auth.js.

### 4.5 Dashboard

Private `/dashboard`, single admin.

| Screen     | Does                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------- |
| Overview   | Links to each editor + "view site"                                                                |
| Profile    | Edit identity, intro, availability, socials, SEO; upload avatar/portrait/resume                   |
| Tech Stack | Groups, items, highlights, strip; up/down reorder; icon picker                                    |
| Projects   | Create/edit/delete, status, filter type, links, tags, featured + visible toggles, up/down reorder |
| Experience | Timeline items CRUD + reorder                                                                     |

Principles: confirm deletes, toasts for results, prefer hide (`visible=false`) over delete.

### 4.6 Security (short list)

Dashboard guarded by `proxy.ts` **and** re-checked in every server action; GitHub allowlist; env vars validated at startup; no secrets in client bundles; default Next security headers.

---

## 5. Design system

### 5.1 Source of truth

- **Visual direction:** the screenshots + HTML (monochrome PS5-style, glass cards, white focus ring on the active tile; Inter + JetBrains Mono).
- **Interaction reference:** `DESIGN.md` — glass spec, 1.05 focus scale, 250 ms ease-out, 16 px card radius, pill buttons, 72 px top bar, 3.5 rem / 1.25 rem margins, bottom glass tabs on mobile.
- **Conflict:** `DESIGN.md` is cyan + Sora; screenshots are monochrome. **Follow the screenshots.** One `--accent` token (white now) makes cyan a one-line swap later.

### 5.2 Tokens (names; values set from the reference HTML)

obsidian / charcoal backgrounds · glass surface + border · text high/medium/low · `--accent` · radii (card 16, tile 22, pill full) · shadows (`glass-card`, `tile-active`, `glow-white`) · motion (`micro 200`, `enter 500`, `page 650`, out-expo-style easing).

### 5.3 Fit-to-screen (how R1 works)

- `dvh`, `clamp()`, `min()` — no fixed pixel section heights.
- **Density tiers** by viewport height: _spacious_ (≥ ~900 px) full content · _regular_ (~720–900) tighter · _compact_ (< ~720) hide secondary details (e.g. Tech Stack check-lists).
- QA viewports: 1920×1080, 1440×900, 1366×768, 1280×720, 1024×768, 768×1024, 390×844, 360×640.
- The reference screenshots are ~4:3 and leave dead vertical space; balance content for 16:9 / 16:10.
- **Phones:** same swipe paging, dock becomes a bottom glass tab bar, pages designed compact. If a page still can't fit, its **inner content scrolls** (hidden scrollbar) with chrome fixed — the only allowed exception.

---

## 6. Animation

**Rules**

1. Animate `transform` and `opacity` only.
2. One signature motion (page turn) + a few reused micro-interactions.
3. Durations: micro 150–250 ms, entrances 400–600 ms, page turn ≈ 650 ms. Stagger ≤ 40 ms, ≤ 8 items.
4. Springs only for the dock ring; everything else cubic-bezier.
5. Entrances run once per activation. Only ambient effects loop (CSS-only, paused when hidden/inactive).
6. Real `backdrop-filter` blur on ≤ 3 visible layers (top bar/dock). Cards use faked glass: translucent gradient + 1 px highlight.
7. Hover-only effects only on `(hover: hover)` devices. Reduced motion → crossfade.
8. Check every animation at 4× CPU throttle.

**Catalog**

| ID       | Effect                                                                                                                              |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| A        | **Page turn** — slide + parallax + outgoing scale/dim + soft edge shadow                                                            |
| B        | **Dock ring** — active ring glides between tiles (shared-layout), ping dot on arrival, hover/focus lift 1.05×                       |
| C        | **Entrance choreography** — headline mask-reveal, subtext fade, chips/cards rise 12 px + fade with stagger, portrait eases 1.04 → 1 |
| D        | **Card spotlight** — cursor-following radial highlight (CSS vars), border sheen, 4 px lift                                          |
| E        | **Projects** — carousel with arrows, rolling `01 / 04` counter, filter reflow via auto-animate                                      |
| F        | **Live clock** — ticking clock in the top bar (real timezone)                                                                       |
| G        | **Ambient background** — slow gradient drift (CSS) + static grain                                                                   |
| Optional | Boot intro (≤ 1.4 s, skippable, once per session) · portrait mouse-parallax (±6 px)                                                 |

---

## 7. Conventions

```
portfolio/
├── app/
│   ├── (site)/[[...section]]/layout.tsx ← chrome + StageProvider (initial index from the URL)
│   ├── (site)/[[...section]]/page.tsx   ← Stage entry for all public URLs
│   └── dashboard/                       ← admin
├── components/  stage/ · panels/ · ui/ · chrome/ · dashboard/
├── lib/         db/ (schema, queries) · auth/ · stage/ · env.ts
├── types/       ← all shared types (never inline)
├── validators/  ← Zod schemas
└── docs/        ← CLAUDE.md, ROADMAP.md, PROGRESS.md
```

- TypeScript strict, zero `any`; shared types in `types/`.
- Tailwind **tokens only** — no arbitrary hex values.
- Server Components by default; `"use client"` only for Stage, Dock, carousel, dashboard forms.
- **Components** are arrow functions with props typed in the parameter (no `React.FC`): `const GlassCard = ({ ... }: GlassCardProps) => { ... }`. One component per file uses `export default`; a file holding several related components (e.g. `Button` + `ButtonLink`) uses named exports.
- **Everything that is not a component** (layouts, pages, helpers, config, server actions) uses `export function` / `export default function`.
- **Barrels:** every folder under `components/` has an `index.ts` that re-exports its components; import through it (`@/components/ui`). Files inside the same folder import each other directly (avoids circular imports). Never create one barrel across folders, and never import `components/dashboard` from public code (keeps admin code out of public bundles, R5).
- Server Actions for dashboard mutations.
- Components ≲ 150 lines; Conventional Commits.
- **Never:** vertical page scroll (except the phone exception), layout-property animations, a second UI kit in the public bundle, hardcoded content after Phase 4, fake metrics.

---

## 8. Working agreement with AI

- **Modes** (set per chat; default **Build**): _Build_ = complete files in one response · _Coach_ = AI guides, Kun writes.
- **Plan before produce** for anything architectural.
- **One phase (or a few steps) per chat**; state the step ID.
- **Output:** complete files with full paths, one response, short logical code chunks with simple inline comments, exact commands, a short "how to verify" list.
- Respect Sections 2 and 7. If a request conflicts, say so and ask before breaking it.
- Anything undecided goes to Section 10, not silently into code.
- **End of chat:** produce the `PROGRESS.md` handoff.

**Chat starter**

```
Attached: CLAUDE.md, PROGRESS.md.
Phase: P2 — Stage engine. Step: P2.3.
Mode: Build.
Goal: <one sentence>
```

---

## 9. Definition of Done (per step)

- [ ] Meets the step's acceptance criteria in `ROADMAP.md`
- [ ] Typecheck + lint pass; build succeeds
- [ ] UI steps: checked at the QA viewports, no page-level scroll
- [ ] Interactive/animated steps: keyboard + reduced-motion verified; smooth at 4× throttle
- [ ] No new `any`, hardcoded content, or arbitrary hex values
- [ ] `PROGRESS.md` updated; decisions logged

---

## 10. Decisions

### Decided

| ID  | Decision                                                                                                                                                                                                                                                                                                        |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Next.js + TS strict + Tailwind v4                                                                                                                                                                                                                                                                               |
| D2  | No Ant Design; shadcn/ui in the dashboard only                                                                                                                                                                                                                                                                  |
| D3  | Neon + Drizzle; 4 tables with JSON/array columns                                                                                                                                                                                                                                                                |
| D4  | One Stage component serves all 5 URLs; SSR all sections; `replaceState` URL sync                                                                                                                                                                                                                                |
| D5  | Persistent chrome; only content slides                                                                                                                                                                                                                                                                          |
| D6  | Monochrome palette from screenshots; single accent token                                                                                                                                                                                                                                                        |
| D7  | Motion with LazyMotion for the dock ring and entrances (see D20, D21)                                                                                                                                                                                                                                           |
| D8  | **No contact form** — Get In Touch is links only                                                                                                                                                                                                                                                                |
| D9  | Auth.js + GitHub allowlist; Vercel Blob for images                                                                                                                                                                                                                                                              |
| D10 | No automated test suite, Redis, Resend, Sentry/PostHog; manual QA checklists instead                                                                                                                                                                                                                            |
| D11 | Public launch at the end of Phase 4                                                                                                                                                                                                                                                                             |
| D12 | Default branch is `master`; repo is `portfolio-v2`                                                                                                                                                                                                                                                              |
| D13 | Text tokens named `fg-high`/`medium`/`low`/`faint`; accent is one token pair (`accent` / `on-accent`); motion durations are CSS variables in `:root`                                                                                                                                                            |
| D14 | Pill = status capsule with optional dot; Chip = mono tag; ButtonLink handles anchors (`next/link` for internal, new tab for external); background layers are `@utility` classes in `globals.css`; hover/transition animates transform only, border and shadow switch instantly until the card spotlight in P3.8 |
| D15 | Component convention: arrow functions, default export (named when a file holds several), `export function` for non-components, per-folder `index.ts` barrels (see §7)                                                                                                                                           |
| D16 | Persistent chrome lives in `components/chrome/` (TopBar, StatusFooter, LiveClock, ProfileBadge, Dock); placeholder profile data in `data/seed.ts`, typed by `types/profile.ts`, replaced by the DB in P4                                                                                                        |
| D17 | Clock uses `useSyncExternalStore` and wakes once per minute; footer shows only availability, hosting note, location and year; no status or latency claims; chrome uses no `backdrop-filter`                                                                                                                     |
| D18 | Dock and TabBar read `useActiveSection()` (URL-based now; P2.7 switches it to Stage state); active tile scales via `transform`; arrival ping plays once; no `backdrop-filter` in the chrome                                                                                                                     |
| D19 | On phones the bottom TabBar replaces the footer; availability and location are shown on the Get In Touch page                                                                                                                                                                                                   |
| D20 | Wheel, swipe and keyboard are custom code; `@use-gesture/react` dropped (inertia logic is custom regardless; fewer deps, R9)                                                                                                                                                                                    |
| D21 | Page-turn track uses a CSS transform transition driven by the motion tokens, with `transitionend` advancing the phase; Motion is reserved for the dock ring and entrances                                                                                                                                       |
| D22 | URL sync is `replaceState` at transition start; browser back/forward is not a Stage input; dock and tab-bar items are real `<a href>` links                                                                                                                                                                     |
| D23 | Gesture inputs lock during a transition; keyboard and dock inputs retarget mid-flight                                                                                                                                                                                                                           |
| D24 | `StageProvider` lives in `app/(site)/[[...section]]/layout.tsx`, so chrome and panels share Stage state and the server knows the initial index from the route param (no `usePathname`) |

### Open

| ID  | Question                                                                 | Default                                    |
| --- | ------------------------------------------------------------------------ | ------------------------------------------ |
| O1  | Phones: allow inner scroll when a page can't fit?                        | Yes, phones only                           |
| O2  | What does the small toggle at the top-right of the Tech Stack header do? | Remove it                                  |
| O3  | Designs for **Experience** and **Get In Touch** (links-only)             | Propose layouts in P3 in the same style    |
| O4  | Bilingual EN/ID?                                                         | English only for v1                        |
| O5  | Domain                                                                   | Keep current Vercel subdomain until launch |
| O6  | Footer location/timezone (mock shows Jakarta / UTC+7)                    | Use the real location and timezone         |

---

## 11. Content notes from design review

- Replace "Jakarta, UTC+7" with the real location/timezone.
- Remove or make true: "99.9% uptime", "Latency <18ms", "Multi-Region Edge Caching", and any stack items not actually used (e.g. AWS ECS, BullMQ, LangChain).
- Verify versions (mock says Next.js 15).
- Unfinished projects show an honest status badge.
- Experience: frame as a journey + shipped-milestones timeline rather than a job list — settle in P3.
