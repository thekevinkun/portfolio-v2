# Portfolio v2 — Project Bible (CLAUDE.md)

> **How to use.** Stable context for every chat. At the start of a chat, attach this file + `PROGRESS.md`, and paste only the phase you're working on from `ROADMAP.md`. When a decision changes, update Section 10 in the same chat.
>
> Status: **P1–P4 done (launched); P5 (dashboard) done (D82–D111); P7 (project details) in progress (D112–D124), P7.3a is next.**
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
| R4  | **Honest content.** Every claim must survive an interview question. No fake metrics. A technology is "used" only if it shipped in a real project, else "learning". Projects show a status (`live`/`in-progress`/`planned`/`completed`). |
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
| Dashboard UI | our own primitives in components/dashboard/ui plus native form elements (D93), React 19 `useActionState` for forms                                        |
| Auth         | Auth.js (`next-auth@beta`) with GitHub login, JWT sessions, no adapter, allowlisted by GitHub user id (D82, D83)                                               |
| Images       | Vercel Blob (public store, upload through a server action, save the URL in the field, D94), `next/image`                                                   |
| Hosting      | Vercel (its build's typecheck is the safety net)                                                        |

### Small libraries (each earns its place)

| Library                                                | Used for                                                |
| ------------------------------------------------------ | ------------------------------------------------------- |
| Native scroll-snap `Carousel` component (no library)   | Tech Stack and Projects carousels                       |
| `@formkit/auto-animate`                                | Filter-pill reflow (P6.1).                              |
| `@number-flow/react` (optional)                        | Rolling digits for the `01 / 04` counter and clock      |
| `clsx` + `tailwind-merge`                              | Class handling                                          |
| `sonner`                                               | Dashboard toasts                                        |
| `react-icons` (Simple Icons set) + `lucide-react`      | Tech logos + UI icons; a small key→icon map (~40 icons) |
| `@vercel/analytics` (optional)                         | Visitor counts                                          |
| `tsx` (dev only)                                       | Runs `scripts/seed.ts` (D71)                            |

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
- **URL:** history.replaceStateat the start of each move (Back leaves the site). Updatedocument.title per section. The canonical link is emitted server-side per URL in P4.5 (needs the domain, O5).
- **State:** small React reducer/context: `index`, `direction`, `phase` (`idle | transitioning | cooldown`).
- **Reduced motion:** 150 ms crossfade, no parallax/choreography.
- **A11y:** labelled `<section>` per panel, `aria-current="page"` on the dock tile, polite live region ("Projects, page 3 of 5"), focus moves to the page heading after a change.

### 4.2.1 Stage spec (P2.1)

All numbers live in `lib/stage/config.ts`. Durations and easing come from the CSS motion tokens (`--duration-page`, page easing); JS reads them once on mount for the fallback timer.

**Wheel**

### §4.2.1 Wheel

| Rule             | Value                                                                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Axis             | Act only when `\|dy\| > \|dx\|`; horizontal wheel belongs to carousels                                                                                                                         |
| Normalize        | `deltaMode` 1 (lines) × 16; 2 (pages) × viewport height                                                                                                                                        |
| Noise floor      | Ignore `\|dy\| < 2`                                                                                                                                                                            |
| Accumulator      | Sum `dy` per gesture; reset after 100 ms with no events                                                                                                                                        |
| Trigger          | Accumulated `\|dy\| ≥ 40` fires one next/prev and locks the gesture                                                                                                                            |
| Notch vs stream  | The first event of a gesture with `\|dy\| ≥ 80`, or any line/page `deltaMode` event, is a mouse notch; anything else is a trackpad stream                                                      |
| Notch unlock     | When the stage is idle again (transition end + 120 ms cooldown)                                                                                                                                |
| Stream unlock    | After transition end: 120 ms of quiet, or a new gesture (delta ≥ 1.3× previous and ≥ 30, or direction flip with `\|dy\| ≥ 30`)                                                                 |
| Safety cap       | Force unlock 2000 ms after the trigger                                                                                                                                                         |
| Inner scroll     | Decided once at the start of each gesture (after 120 ms of quiet): if the target (or a scrollable ancestor, or `data-stage-scroll`) can scroll in that direction, the whole gesture is ignored |
| Browser gestures | `overscroll-behavior: none` on `html`/`body`                                                                                                                                                   |

The wheel listener is on `window` (chrome included); `ctrl`+wheel (zoom) is ignored. |

**Touch:** pointer events, `touch` only; `touch-action: pan-y` on the stage (inner vertical scroll on phones, O1). Axis lock after 10 px. Commit on release at |dx| ≥ 60 px, or at velocity ≥ 0.4 px/ms when it travelled at least 24 px; left swipe = next. No finger-following in v1. Swipes starting inside `data-stage-swipe-ignore` (carousel) belong to that element. Swipes are scoped to [data-stage-viewport]; the Stage sets touch-action: pan-y.

**Keyboard:** ← → PageUp PageDown Home End 1–5. Ignored in input/textarea/select/contenteditable or with Ctrl/Meta/Alt. ↑/↓ are not bound. Key repeat is ignored (one page per press). PageUp/PageDown/Home/End defer to a focused inner scroller (same guard as the wheel) before turning the page.

**Dock / TabBar:** real `<a href>` links; `onClick` → `preventDefault()` + `goTo(i)` (except modified clicks). Both use useStageNav; modified clicks and middle-click fall through to the browser; links set prefetch={false}; source is dock for both.

**Locking:** gesture inputs (wheel, swipe) are ignored unless phase is `idle`. Discrete inputs (keyboard, dock) are accepted in any phase and retarget mid-flight.

**Edges:** a step past the first or last page (any input, only from `idle`) runs a rubber-band instead of moving: 20 px out in 140 ms, back in 280 ms (`--duration-bounce` 420 ms, 0 under reduced motion), no navigation, no URL change. The stage is busy for the bounce, then the normal 120 ms cooldown.

**Transition**

| Item | Value |
| --- | --- |
| Mechanism | Track `translate3d(-index*100%,0,0)` with a CSS transition; phase advances on `transitionend` with a `duration + 100 ms` timeout fallback |
| Duration / easing | `--duration-page` (650 ms) / out-expo style, for every move |
| Outgoing panel | scale 1 → 0.96, opacity 1 → 0.55 |
| Parallax | Inner layer of the incoming panel starts offset 6% of panel width in the travel direction, settles to 0 |
| Edge shadow | Leading edge of incoming panel, 0.5 → 0 opacity |
| Cooldown | 120 ms minimum after the transition before the next gesture |
| `will-change` | On the track during transition only |
| State | `{ index (target), from, direction, phase, source, bounce }`; phases `idle → transitioning → cooldown → idle` and `idle → bouncing → cooldown → idle` |
| Panel attributes | `data-state="active\|outgoing\|idle"`, `data-side="before\|after"` (the side a page arrives from), `data-direction="next\|prev\|none"`, `data-animate` (present after the first move), `data-section` (the section id, so CSS can tune one page's entrance). Inner `data-stage-layer` (parallax) and `data-stage-shadow`. All visuals key off these in `globals.css`, inside `prefers-reduced-motion: no-preference`. |
| Inactive panels | `inert` + animations paused; `inert` removed from the incoming panel at transition start, applied to the outgoing one at transition end |
| Reduced motion | --duration-page becomes 150 ms and --duration-bounce 0 ms. The track has no transition (it jumps), the incoming page fades in over --duration-page, and parallax, shadow, outgoing scale/dim and the bounce are off. The move ends from the provider's fallback timer (duration + 100 ms). The Dock ring jumps (MotionConfig reducedMotion="user"). |

**URL:** one route `app/(site)/[[...section]]/page.tsx`; valid slugs `tech-stack`, `projects`, `experience`, `contact` (empty = Overview); anything else `notFound()`; `generateStaticParams` + `generateMetadata` per section (title, description, canonical and share tags from `lib/seo/metadata.ts`, D80). The server derives the initial index so the track renders already positioned (no flash). Client: `useStageUrl` calls `history.replaceState` + sets `document.title` whenever the Stage target changes (any input), except for the initial render. It reads Stage state, never `usePathname()`. Browser back/forward is not a Stage input (Back leaves the site). The Dock/TabBar active tile reads Stage state (`useActiveSection`).

**A11y:** each panel is `<section aria-labelledby>` and its heading must have the id `heading-<section id>`; `aria-current="page"` on the active dock tile; one polite live region (`StageLiveRegion`, empty until the first move) speaks "Projects, page 3 of 5" 150 ms (debounced) after a move starts, never on first load or on an edge bounce. After the transition ends, `useStageFocus` moves focus to the incoming panel heading (`tabindex="-1"` set at runtime, `preventScroll`, no focus ring) when the source was keyboard/dock, or when focus was inside a page when the move began; wheel and swipe otherwise never steal focus.

### 4.3 Content flow

```
Neon → Drizzle queries (parallel) → getStageData() → Stage (SSR, all 5 panels)
Dashboard save → server action → write → revalidatePath on the public routes
```

Every dashboard write calls `revalidateSite()` (D88); `export const revalidate = 3600` on the route stays as the fallback (D69).

Every dashboard mutation: **auth check → Zod validate → write → revalidate.** No exceptions.

### 4.4 Data model (5 tables)

| Table               | Contents                                                                                                                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `profile` (one row, `id` fixed to 1) | name, username, handle, role label, headline, intro, contact headline + intro, location label, timezone, email, availability + short availability, avatar/portrait/resume URLs (nullable), socials (JSON: kind, label, url), Overview chips (text array), focus areas (text array), SEO title + description |
| `project_categories` | slug (unique), label, sort, visible; the tabs on the Projects page (D105) |
| `skill_groups`      | slug (unique), index label, title, subtitle, badge text, icon key, **items** (JSON: name, icon key, `used`/`learning`), **highlights** (text array), sort, visible                                                                         |
| `projects`          | slug (unique), title, kicker label, summary, category slug (text, foreign key to `project_categories`, D105), **status** (enum: live, in-progress, planned, completed), icon URL, logo URL, tech tags (text array, any number), **links** (JSON: kind `live`/`repo`, label, url), **details** (optional JSON for the project overlay, D112), featured flag, sort, visible |
| `experience_items`  | slug (unique), kind (enum: `work`, `freelance`, `education`, `milestone`), title, organization, start/end (`YYYY-MM` text, end null = present), summary, optional short summary, bullets (text array), **shipped** (optional JSON: project name + bullets), tags (text array), sort, visible |

All list tables also carry a uuid `id`. Auth uses JWT sessions, so there are no auth tables (D82).

### 4.5 Dashboard

Private `/dashboard`, single admin. Routes: `/dashboard/login` (public) and an `(admin)` group for everything else. R1 and R2 do not apply here (D95).

| Screen     | Does (v1, D92)                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| Overview   | Counts (visible / hidden), links to each editor, "view site"                                                     |
| Profile    | Identity, intro, contact copy, availability, socials, chips, focus areas, SEO; upload avatar, portrait, resume   |
| Tech Stack | Edit, reorder, hide the groups; items (≤ 7) with an icon found from the name and used/learning; highlights (≤ 5, ≤ 40 chars)     |
| Projects   | Create/edit/delete, status, filter type, two link slots, tags, icon and logo, featured (≤ 3 visible) + visible, up/down reorder within a filter |
| Categories | Add, rename, reorder, hide the Projects page tabs; delete only when it has no projects (D105) |
| Experience | Edit the Work and Learning items; shipped projects add/remove/reorder (≤ 3); no create/delete of top-level items until the work timeline (D110) |

Principles: confirm deletes (and suggest hiding), toasts for results, slug read-only after creation, every write validated by the P4.3 schemas on the server (D89).

### 4.6 Security (short list)

`proxy.ts` redirects signed-out visitors, but the boundary is `requireAdmin()` in every dashboard page, layout and server action (D84). GitHub allowlist by numeric user id, re-checked against `ADMIN_GITHUB_ID` on every call (D83). Env vars validated at startup (`lib/env.ts`, `lib/auth/env.ts`, `lib/blob/env.ts`, D85). Uploads limited by type and size, no SVG (D94). Local dev and Preview use a Neon dev branch (D86). No secrets in client bundles; default Next security headers.

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
- **Density tiers** by the panel's own height (measured, D60): `tier-snug` ≥ 350 · `tier-regular` ≥ 500 · `tier-roomy` ≥ 580 · `tier-spacious` ≥ 640 px; base styles are the compact tier. On desktop the panel height is the viewport height − 257 px. Combined variants `tier-tight`, `tier-pills` and `tier-wide` are defined in D60.
- QA viewports: 1920×1080, 1440×900, 1366×768, 1280×720, 1024×768, 768×1024, 390×844, 360×640.
- The reference screenshots are ~4:3 and leave dead vertical space; balance content for 16:9 / 16:10.
- **Phones:** same swipe paging, dock becomes a bottom glass tab bar, pages designed compact. Every page fits. When a set of cards can't fit, use a horizontal carousel (full cards, arrows and page dots, next card peeking at 1-up) instead of hiding card content; hide only decorative or duplicated content (e.g. the Overview featured cards, which Projects shows). Inner vertical scroll is a last resort. A carousel is the one gesture exception (`data-stage-swipe-ignore`). Only if a page still can't fit does its **inner content scroll** (hidden scrollbar, with a scroll hint), and only as a last resort. The one gesture exception is a horizontal carousel (data-stage-swipe-ignore).

---

## 6. Animation

**Rules**

1. Animate `transform` and `opacity` only.
2. One signature motion (page turn) + a few reused micro-interactions.
3. Durations: micro 150–250 ms, entrances ≈ 650 ms (Overview, the landing page, is slower: 800 ms, with a 1.6 s portrait fade), page turn ≈ 650 ms. Stagger 55 ms (Overview 110–220 ms), ≤ 8 slots.
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
| C        | **Entrance choreography** — headline mask-reveal, subtext fade, chips/pills/buttons rise 12 px + fade with stagger, cards use one effect per page (D58), portrait fades in slowly |
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
│   ├── api/auth/[...nextauth]/route.ts  ← Auth.js handlers
│   └── dashboard/                       ← admin: login/ and (admin)/ editors
├── components/  stage/ · panels/ · ui/ · chrome/ · dashboard/
├── lib/         db/ (schema, queries, admin-queries) · auth/ · dashboard/ (actions) · blob/ · stage/ · env.ts
├── types/       ← all shared types (never inline)
├── validators/  ← Zod schemas (JSON columns, enums from types/)
├── proxy.ts     ← redirects signed-out visitors from /dashboard/** (D84)
├── scripts/     ← seed.ts (run with tsx)
├── drizzle/     ← generated SQL migrations
└── docs/        ← CLAUDE.md, ROADMAP.md, PROGRESS.md
```

- TypeScript strict, zero `any`; shared types in `types/`.
- Tailwind **tokens only** — no arbitrary hex values.
- `lib/db/schema.ts` imports from `types/` with relative paths, because drizzle-kit loads it without the `@/` alias (D77).
- Server Components by default; `"use client"` only for Stage, Dock, carousel, dashboard forms.
- **Components** are arrow functions with props typed in the parameter (no `React.FC`): `const GlassCard = ({ ... }: GlassCardProps) => { ... }`. One component per file uses `export default`; a file holding several related components (e.g. `Button` + `ButtonLink`) uses named exports.
- **Everything that is not a component** (layouts, pages, helpers, config, server actions) uses `export function` / `export default function`.
- **Barrels:** every folder under `components/` has an `index.ts` that re-exports its components; import through it (`@/components/ui`). Files inside the same folder import each other directly (avoids circular imports). Never create one barrel across folders, and never import `components/dashboard` from public code (keeps admin code out of public bundles, R5). `components/dashboard/index.ts` re-exports server components only; client components there (forms) are imported by file path (D100).
- Server Actions for dashboard mutations.
- **Content:** read it through `lib/db/queries.ts` only; `@/data/*` is blocked by ESLint outside `scripts/` and `data/` (D72).
- **Lint (React Compiler):** never return a component from a function during render; index a module-level map instead (`TECH_ICONS[key]`, with typed keys). Never set state synchronously inside an effect; use observers or event callbacks.
- **Gestures:** `data-stage-scroll` only on elements that really scroll; swipeable rows use `components/ui/Carousel` (D51); every new panel states its density tiers with the `tier-regular:` / `tier-spacious:` variants (D47).
- Components ≲ 150 lines; Conventional Commits.
- **Never:** vertical page scroll (except the phone exception), layout-property animations, a second UI kit in the public bundle, hardcoded content after Phase 4, fake metrics.

---

## 8. Working agreement with AI

- **Modes** (set per chat; default **Build**): _Build_ = complete files in one response · _Coach_ = AI guides, Kun writes.
- **Plan before produce** for anything architectural.
- **One phase (or a few steps) per chat**; state the step ID.
- **Output:** complete files with full paths, one response, short logical code chunks with simple inline comments, exact commands, a short "how to verify" list.
- **Tree first:** before creating or overwriting a file, check the pasted file list. Never label a file "new" without seeing the tree; if a file may already exist, ask.
- **Working rules:** follow `docs/WORKFLOW.md` §11 (UI approval gate, exact doc edits, ask for unseen files, honest recommendations).
- Respect Sections 2 and 7. If a request conflicts, say so and ask before breaking it.
- Anything undecided goes to Section 10, not silently into code.
- **End of chat:** produce the `PROGRESS.md` handoff.

**Chat starter**

```
Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md.
Repo files: <paste output of: git ls-files | grep -v lock>
Also pasted: <the files this step builds on, listed in the previous handoff>
Phase: <id> — <name>. Step: <id>.
Mode: Build. Follow WORKFLOW.md §11.
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

| ID | Decision |
| --- | --- |
| D1 | Next.js + TS strict + Tailwind v4 |
| D2 | No Ant Design; no shadcn/ui either (D93); the dashboard uses our own primitives |
| D3 | Neon + Drizzle; 4 tables with JSON/array columns |
| D4 | One Stage component serves all 5 URLs; SSR all sections; `replaceState` URL sync |
| D5 | Persistent chrome; only content slides |
| D6 | Monochrome palette from screenshots; single accent token |
| D7 | Motion with LazyMotion for the dock ring and entrances (see D20, D21) |
| D8 | **No contact form** — Get In Touch is links only |
| D9 | Auth.js + GitHub allowlist; Vercel Blob for images |
| D10 | No automated test suite, Redis, Resend, Sentry/PostHog; manual QA checklists instead |
| D11 | Public launch at the end of Phase 4 |
| D12 | Default branch is `master`; repo is `portfolio-v2` |
| D13 | Text tokens named `fg-high`/`medium`/`low`/`faint`; accent is one token pair (`accent` / `on-accent`); motion durations are CSS variables in `:root` |
| D14 | Pill = status capsule with optional dot; Chip = mono tag; ButtonLink handles anchors (`next/link` for internal, new tab for external); background layers are `@utility` classes in `globals.css`; hover/transition animates transform only, border and shadow switch instantly until the card spotlight in P3.8 |
| D15 | Component convention: arrow functions, default export (named when a file holds several), `export function` for non-components, per-folder `index.ts` barrels (see §7) |
| D16 | Persistent chrome lives in `components/chrome/` (TopBar, StatusFooter, LiveClock, ProfileBadge, Dock); placeholder profile data in `data/seed.ts`, typed by `types/profile.ts`, replaced by the DB in P4 |
| D17 | Clock uses `useSyncExternalStore` and wakes once per minute; footer shows only availability, hosting note, location and year; no status or latency claims; chrome uses no `backdrop-filter` |
| D18 | Dock and TabBar read `useActiveSection()` (URL-based now; P2.7 switches it to Stage state); active tile scales via `transform`; arrival ping plays once; no `backdrop-filter` in the chrome |
| D19 | On phones the bottom TabBar replaces the footer; availability and location are shown on the Get In Touch page |
| D20 | Wheel, swipe and keyboard are custom code; `@use-gesture/react` dropped (inertia logic is custom regardless; fewer deps, R9) |
| D21 | Page-turn track uses a CSS transform transition driven by the motion tokens, with `transitionend` advancing the phase; Motion is reserved for the dock ring and entrances |
| D22 | URL sync is `replaceState` at transition start; browser back/forward is not a Stage input; dock and tab-bar items are real `<a href>` links |
| D23 | Gesture inputs lock during a transition; keyboard and dock inputs retarget mid-flight |
| D24 | `StageProvider` lives in `app/(site)/[[...section]]/layout.tsx`, so chrome and panels share Stage state and the server knows the initial index from the route param (no `usePathname`) |
| D25 | The wheel listener is on `window` (chrome included), mounted through `StageInputs` inside the provider; the inner-scroll exemption is decided once per gesture; `ctrl`+wheel is ignored |
| D26 | Hook files are camelCase (`useStageWheel.ts`), matching `useActiveSection.ts` |
| D27 | Dock and TabBar keep real hrefs; a plain click is intercepted by `useStageNav` and calls `goTo(index, "dock")` (router navigation would remount the layout and reset Stage state); links use `prefetch={false}` |
| D28 | Keyboard ignores key repeat; Page/Home/End defer to a focused inner scroller; swipes are scoped to `[data-stage-viewport]`, and a flick needs at least 24 px of travel |
| D29 | `useStageUrl` syncs the URL (`replaceState`) and `document.title` from Stage state at the start of every move, for every input source; it skips the initial render and swallows history rate-limit errors |
| D30 | Canonical moves from P2.5 to P4.5 (needs the domain, O5); no client-side canonical sync, since each URL's canonical comes from its own server-rendered head; server metadata is title only until P4.5 |
| D31 | `useActiveSection` reads Stage state (pulled forward from P2.7); P2.7 keeps only the ring glide |
| D32 | Page-turn visuals (outgoing scale/dim, incoming parallax, edge shadow) are CSS-only, keyed off panel data attributes, with tokens in `:root`, wrapped in `prefers-reduced-motion: no-preference`; they play only after the first move (`data-animate`) |
| D33 | Edge bounce is a bouncing phase entered by stepping past an edge when idle (any input source); it animates the track's separate `translate` property via a CSS keyframe; its duration is the `--duration-bounce` token, which the provider timer reads |
| D34 | The dock ring is its own element (m.span layoutId="dock-ring") inside an unscaled wrapper in the active tile, so it glides between tiles with a spring (DOCK_RING_SPRING in config.ts); tiles only scale their icon; the hover lift lives on the wrapper; the arrival ping and glow dot ride on the ring with a --dock-ring-ping-delay token; reduced motion jumps (MotionConfig reducedMotion="user"); the TabBar indicator stays static |
| D35 | motion installed (approved by D7); LazyMotion loads domMax asynchronously (layout animations need it) via lib/motion-features.ts; components use m from motion/react-m with strict |
| D36 | StageLiveRegion is a single role="status" element mounted in the section layout; it announces getSectionAnnouncement (label, page n of N) debounced by ANNOUNCE_DEBOUNCE_MS, skipping the initial render and edge bounces |
| D37 | useStageFocus focuses #heading-<section id> when a transition ends if the source was keyboard/dock or focus was inside a panel when the move began (retargets keep the pending flag); panels must expose that heading id; the Stage sets tabindex="-1" itself |
| D38 | Reduced motion = shorter duration token + no track transition (jump) + CSS fade-in of the active panel; the provider's fallback timer ends the move |
| D39 | Stage tuning values (wheel thresholds, swipe thresholds, durations, visual tokens, ring spring) stay as shipped after the P2.9 device pass; revisit only if a real device or a P3 page shows a problem |
| D40 | Experience page: Work + Learning cards, no milestones; experience_items gains optional tags text[]; no logo images or color fields in v1 |
| D41 | Get In Touch: statement left; right = email / LinkedIn / GitHub link cards + info row with live Samarinda time; buttons email (primary) + resume (secondary); no phone number |
| D42 | Density tiers key off panel container height (container-type: size), thresholds in app/globals.css (provisional 640 / 500, tuned in P3.9) |
| D43 | Phones fit one screen by hiding secondary content, with inner scroll only as a last resort (O1 revised in P3.3); Tech Stack header toggle removed (O2); location is Samarinda, Asia/Makassar WITA UTC+8 (O6) |
| D44 | Project status adds `completed` (finished, repo-only) beside `live` / `in-progress` / `planned`; `systems` filter type covers C/C++ |
| D45 | Static data lives in `data/skill-groups.ts`, `data/projects.ts`, `data/experience.ts`, re-exported from `data/seed.ts`; dates are `"YYYY-MM"` with `endDate: null` = present; only Kundesk, Padel Court and Kun Bookshop are `featured`; `logoUrl` is null until P5 uploads; the Tech Stack page has no bottom strip (D52). The placeholder profile stays in data/seed.ts with the real location (Samarinda), timezone (Asia/Makassar) and availability. |
| D46 | Education bullets are one-line strings starting with the course name; no phone number on the site (O7) and no certificate links (O8) |
| D47 | Density tiers are Tailwind custom variants `tier-regular:` (panel height ≥ 500 px) and `tier-spacious:` (≥ 640 px) defined in `app/globals.css`, because container queries can't read CSS variables; panel roots use the `tier-container` utility (`container-type: size`); base styles are the compact tier |
| D48 | Panels are server components that take their data as props (`OverviewPanel` gets `profile` + `featured`); until P4.4 the page reads `data/seed.ts`; featured = `featured && visible`, sorted by `sort`, first 3; only Overview renders an `<h1>`; Overview text is top-aligned under the dock on tablet and desktop, the featured cards have a min height of `min(30cqh, 13rem)`, and below 768 px the cards are hidden so nothing scrolls |
| D49 | `ButtonLink` renders a plain anchor when `download` is set; portrait and resume live in `public/images/` and `public/resume/`; `profile` gains `roleLabel`, `headline`, `intro`, `email`, `portraitUrl`, `resumeUrl`, `socials`, `chips`, `focusAreas` |
| D50 | `data-stage-scroll` exempts the wheel unconditionally, so it goes only on elements that really scroll, never on a panel wrapper; every page fits one screen at every size, and the only inner gesture allowed is a horizontal carousel (Tech Stack, Projects) |
| D51 | Carousels are a native scroll-snap component (`components/ui/Carousel.tsx`), no library; the consumer sets slide widths and snap points in CSS and pages are measured from the layout; controls are Previous/Next buttons plus page dots (row height reserved, shown only when there is more than one page) and, at 1-up, a peeking next card; `data-stage-swipe-ignore` is set on the track only while it can scroll; the track has `overscroll-x-contain` and `tabIndex={-1}` so browser back-swipe is blocked and ← → still turn pages; reduced motion jumps instead of gliding |
| D52 | Tech Stack: 4 cards from 1280 px, 2 cards sliding 2 from 640 px, 1 card sliding 1 with the next card peeking below 640 px (breakpoints follow the ~280 px a one-line highlight needs); every card always shows all its content (index, badge, icon, 5 items, 4 highlights of ≤ ~38 characters on one line); short panels only tighten spacing and hide the page subtitle; no bottom strip (`techStrip` data removed; Web3 and C/C++ are covered by the Projects filters) |
| D53 | Tech logos use `react-icons` (Simple Icons) where the export is certain and lucide stand-ins otherwise; icon keys are a typed union (`TechIconKey` in `types/skills.ts`) and the map is indexed directly (`TECH_ICONS[key]`), because the React Compiler lint rejects components returned from a function; the P5 icon picker and Zod schema must use the same keys |
| D54 | Projects page: filter pills Full Stack (default), Frontend, Game, Web3, C/C++ (only filters that have visible projects; labels in `lib/projects/filters.ts`, `systems` shows as "C/C++"; no "All" pill); `ProjectsPanel` is a client component that takes `projects` as props; cards show kicker, status badge (LIVE solid, others glass), title, full summary, every tech tag and its links (Repo is the primary button when there is no demo); no hover lift inside the carousel; changing the filter remounts the carousel (`key`) so it starts at page 1 and announces the count in a polite live region; reflow animation (auto-animate) and rolling counter digits wait for P6.1 |
| D55 | `Carousel` gains `indicator` ("dots" or "counter"); Projects pages by width: 3 cards from 1280 px, 2 from 640 px, 1 with the next card peeking below 640 px, with snap points on the first card of each page (`xl:nth-[3n+1]`, `sm:max-xl:odd`); the last page can repeat cards when the count doesn't divide evenly; the counter is page-based and sits bottom right |
| D56 | Experience page: five cards from `experienceItems`: Work (role, summary, tags), one Shipped card per project from the Work item's optional `shipped` JSON (`{ name, bullets[] }[]`, a JSON column in P4.2), and Learning. Carousel order is Learning → Work → Shipped…; from 1280 px it is a plain row of four (Work + 3 Shipped) and Learning moves last as a full-width band (CSS order), with no carousel; 640–1279 px is 2-up sliding 2, below 640 px 1-up with the next card peeking (same breakpoints as D52). `summary` is the long text and optional `summaryShort` the wide-layout text; each project keeps 5 bullets and the wide layout shows the first 3 (`xl:hidden` on the rest). This is the one deliberate exception to D52's nothing-hidden rule. The Work item's `bullets` are empty (the card renders bullets only when present); D40's no-milestones stands. |
| D57 | Get In Touch page: statement (`contactHeadline`, `contactIntro` on `profile`, new columns), availability pill and Email / Resume buttons on the left; email, LinkedIn and GitHub link cards plus an info card (location and live local time via `LiveClock`, UTC offset derived with `Intl`) on the right; two columns from 1024 px, stacked below, no carousel; intro shows from 768 px; availability and location live here because the footer is hidden on phones (D19); the heading is an `<h2>` with id `heading-contact` (Overview owns the only `<h1>`); icons come from the typed `CONTACT_ICONS` map (lucide `Mail`, react-icons `FaLinkedin` / `FaGithub`) per D53; no form, no phone number (D8, D41, O7). |
| D58 | Entrance choreography is CSS only, keyed off the active panel (`data-state="active"`), so it replays on every visit (no visited tracking); content waits 100 ms on first load and 300 ms after a page turn. Elements opt in with `data-reveal="<effect>"` through `reveal(effect, slot, options?)` in `lib/reveal.ts`; slots stagger by `--reveal-step` (capped at 8) and `--i-wide` reorders slots from 1280 px (Experience). Header and text are the same on every page (title mask-reveal, text fade, chips/pills/buttons rise); cards differ per page: Overview rise (portrait slow fade, featured cards rise 44 px one by one), Tech Stack from-left cascade, Projects from-right, Experience unfold, Get In Touch drop. Default timing 650 ms with a 55 ms step; Overview overrides it with `[data-section="overview"]` in globals.css (800 ms, 110 ms). Carousel slides keep `overflow-clip` so entrance transforms don't change the track's scroll size. After a Projects filter click the new cards cascade in with no wait. Reduced motion: no entrances. |
| D59 | Card spotlight: every `GlassCard` carries `data-spotlight` unless `spotlight={false}`; one delegated `pointermove` listener (`components/ui/Spotlight.tsx`, mounted in the page) writes `--mx` / `--my` once per frame; the glow and a 1 px border sheen are `::before` / `::after` that fade in on hover, only on `(hover: hover) and (pointer: fine)` and not under reduced motion; the lift stays on `interactive` cards and cards inside carousels don't lift (D54). |
| D60 | Density variants are measured, not estimated. Desktop chrome (top bar + dock + footer) is 257 px, so panel height = viewport height − 257 (1280×720 → 463, 1366×768 and 1024×768 → 511, 1536×791 → 534, 1440×900 → 643). Below 768 px the footer is hidden and the tab bar replaces it (D19), about 129 px of chrome (360×640 → 511). Variants in `app/globals.css`: `tier-snug` ≥ 350, `tier-regular` ≥ 500, `tier-roomy` ≥ 580, `tier-spacious` ≥ 640 (declare in this order; later wins), `tier-tight` < 580, `tier-pills` (≥ 580, or ≥ 350 on screens ≥ 1280 wide), `tier-wide` (≥ 1280 wide and ≥ 500 tall). These replace the provisional thresholds of D42 and D47. |
| D61 | Overview fit: the text column (eyebrow, name, headline, intro, chips, button) is complete from `tier-snug` on tablet and desktop; the focus pills use `tier-pills`, so they hide only on screens narrower than 1280 px and shorter than 580 px (1024×768); the featured cards are always full (kicker, links, logo, title, two-line summary; no tech line) and show from 500 px of panel height and 768 px of width, below that Projects shows them (§5.3); between 500 and 580 px spacing is tighter (smaller gaps and button). Phones keep their own rules (intro and chips from 500, focus pills from 640). |
| D62 | Experience picks its layout by width and height: the wide layout (a row of four with Learning as a full-width band) needs `tier-wide`; anything else is the Carousel (2-up from 640 px, 1-up below, order Learning → Work → Shipped). The summary and bullet variants of D56 key off the same variant (wide: short summary and 3 bullets per project; otherwise long summary and 5). The subtitle shows from 500 px like the other pages. On phones (below 640 px wide) shorter than 580 px the cards are trimmed (3 bullets, short summary, Learning tags hidden) instead of hiding the subtitle. This replaces the width-only 1280 px rule of D56 and the D52 breakpoints for this page. |
| D63 | Vertical alignment by width: on phones (below 768 px) and from 1024 px a page's header stays on top and its content is centered in the space below; from 768 to 1023 px the header and content (on Overview the hero text and the cards) are one block centered in the panel (`my-auto`, which falls back to top-aligned if the block is too tall). Get In Touch is a single centered block at every size. |
| D64 | Enum-like values have one source: `as const` tuples in `types/` (`PROJECT_FILTERS`, `PROJECT_STATUSES`, `PROJECT_LINK_KINDS`, `SKILL_STATUSES`, `SOCIAL_KINDS`, `EXPERIENCE_KINDS`, `TECH_ICON_KEYS`), with the union types derived from them; `pgEnum` and the Zod schemas in `validators/` read the same tuples, so the three cannot drift (D53's icon-key rule included) |
| D65 | Keys and rows: `projects`, `skill_groups` and `experience_items` have a uuid `id` plus a unique `slug` (added to the `SkillGroup` and `ExperienceItem` types and data: `frontend`, `backend`, `data`, `ai-cloud`; `independent-full-stack`, `self-directed-learning`); `profile` is one row with integer `id` fixed to 1 by a CHECK; list tables carry `sort` (integer, default 0, no unique constraint so reorders can swap) and `visible` (boolean, default true); no timestamp columns until P5 needs them |
| D66 | Column types: string lists are native `text[]` (`chips`, `focus_areas`, `highlights`, `tech`, `bullets`, `tags`); objects are `jsonb` typed with `$type<>` (`socials`, `items`, `links`, `shipped`); `project_filter`, `project_status` and `experience_kind` are Postgres enums; `icon_key` stays `text`, validated by Zod, so a new icon never needs a migration; dates stay `"YYYY-MM"` text (D45) with a CHECK on the format; the TypeScript field `filter` maps to the column `filter_type` |
| D67 | `profile` gains `seoTitle` and `seoDescription` (site-wide defaults used in P4.5); per-section titles stay in `lib/stage/section-title.ts` as UI labels |
| D68 | Read path: `lib/db/queries.ts` has one `cache()`-wrapped getter per table (the layout and the page share one query each) and `getStageData()` runs them in parallel; getters return only `visible` rows ordered by `sort`, strip `id`, map `null` to `undefined` for optional fields so the existing types and panels stay unchanged, and parse every JSON column with the Zod schemas; bad data or a missing `profile` row throws instead of rendering blank; server-only, no client component imports `lib/db` or `validators/` |
| D69 | Until P5, freshness is time-based: `export const revalidate = 3600` on the route; a hand edit in Neon shows within an hour (the first visit after the window serves the old page and triggers the refresh) or after a redeploy; P5 adds `revalidatePath`; no webhook route |
| D70 | Migrations: edit `lib/db/schema.ts`, `drizzle-kit generate`, review the SQL, `drizzle-kit migrate`; `drizzle/` is committed; npm scripts `db:generate`, `db:migrate`, `db:seed`; one Neon database serves local, preview and production during P4, so migrations stay additive while production reads it |
| D71 | Seed: `scripts/seed.ts`, run with `tsx` (new dev dependency, approved here per R9; Node's native TypeScript stripping cannot resolve the `@/` alias); loads `.env.local` like `drizzle.config.ts`; validates the static data with the Zod schemas; inserts by `slug` and by default only adds missing rows, so re-running never overwrites dashboard edits; `--update` overwrites on purpose |
| D72 | R3 guard: an ESLint `no-restricted-imports` rule blocks `@/data/*` everywhere except `scripts/` and `data/`; after P4.4 `data/` is seed input only |
| D73 | O4 settled: English only at launch, no locale columns; adding a language later means a translation layer on all four tables and a locale route segment |
| D74 | O5 settled for launch: `kevinmahendra.vercel.app`; the site URL comes from a `SITE_URL` env var validated in `lib/env.ts` and feeds canonical, sitemap and JSON-LD in P4.5; the custom domain question returns in P6.4 and needs no schema change |
| D75 | `shipped[].name` is free text, not a reference to a project (v1); the P5.6 editor must say so |
| D76 | Testnet projects (Chainkuns, DarkMint) keep status `live` (deployed and reachable); their summaries say they run on a testnet (R4); no new status value; the wording is applied in the P4.3 seed data |
| D77 | Schema details settled in P4.2: `lib/db/schema.ts` uses relative imports (drizzle-kit has no `@/` alias); `ProjectLinkKind` and `SocialKind` are tuples too (`PROJECT_LINK_KINDS`, `SOCIAL_KINDS`) for the P4.3 Zod schemas; `icon_key` is `text` typed `TechIconKey`; every `text[]` column except the two `profile` lists defaults to `'{}'`; check constraints are named (`profile_singleton`, `experience_start_format`, `experience_end_format`); the site-wide SEO copy lives on `profile` (`seoTitle`, `seoDescription`); first migration is `drizzle/0000_silly_living_tribunal.sql` |
| D78 | Validators and seed settled in P4.3: `lib/env.ts` defaults `NODE_ENV` to `development` so tsx scripts can import it; the schemas in `validators/` (`shared`, `profile`, `projects`, `skills`, `experience`) are `z.strictObject` and end in `satisfies z.ZodType<Type>`; rules beyond shape: a `live` project needs a `live` link, a skill group has at most 5 items and 4 highlights of at most 40 characters (D52), shipped bullets number 3–5 (D56), `endDate` is not before `startDate`, the timezone is a real IANA id, link URLs are http(s), asset URLs are a site path or http(s); `scripts/seed.ts` loads `.env.local` and then imports `lib/db` dynamically, validates everything before writing, runs row by row, and has three modes: default (add missing rows by slug), `--update` (overwrite) and `--check` (validate only, no database); run with `npm run db:seed`; Chainkuns and DarkMint summaries say testnet (D76); Neon holds the seeded rows |
| D79 | P4.4 shipped D68, D69 and D72 with these details: `lib/db/queries.ts` has plain `async function` loaders exported through `cache()` (`getProfile`, `getSkillGroups`, `getProjects`, `getExperienceItems`, `getStageData`); rows are filtered by `visible` and ordered by `sort` then `slug` in SQL, `id` is dropped, and each row is parsed by the P4.3 schemas (the error names the table and slug); `null` becomes `undefined` for `summaryShort` and `shipped`; `revalidate = 3600` is a literal in `page.tsx` only; the five pages build as static (SSG) from Neon and a hand edit in Neon appeared after the revalidate window (tested with a 10 s value); the ESLint rule blocks `@/data` and `@/data/*` except in `scripts/` and `data/` (relative imports are not covered); no `server-only` package: `lib/env.ts` throws if `lib/db` reaches a client bundle; `data/` is seed input only |
| D80 | P4.5 shipped D67 and D74 with these details: `SITE_URL` is a required env var (trailing slash stripped), the same production value in every Vercel environment; the root layout's `generateMetadata` supplies `metadataBase`, the default title and description, and the icons (`app/favicon.ico`, 16 and 32 px favicons and the apple-touch-icon from `public/`); `getSectionMetadata` (`lib/seo/metadata.ts`) gives each URL its title (Overview = `profile.seoTitle`, the others `<Label> \| <name>`), the `profile.seoDescription`, its own canonical (D30), Open Graph tags and a `summary_large_image` twitter card using `public/og-image.jpg` (1200×630); the five titles are computed on the server (`getSectionTitles`) and passed to `StageUrlSync`, so the tab title matches the server title; `app/manifest.ts` builds the manifest from the profile (theme color `#050505`, keep it in step with `--color-canvas`; a profile edit shows after the next redeploy); `app/robots.ts` disallows `/dashboard` and links the sitemap; `app/sitemap.ts` lists the five URLs with no `lastModified`; JSON-LD `Person` (name, url, jobTitle, description, image, `sameAs`; no email, no address) comes from `lib/seo/person.ts` with `<` escaped and renders on every URL |
| D81 | P4.6 launch audit (R4): every claim on the site was checked against the owner's project facts and confirmed; the Work card organization reads "Independent / Personal Projects" (not "Self-Employed"); the CS50 line reads "CS50x (Harvard University, free online course)"; the top-bar avatar is the portrait (`/images/profile-picture.png`); until the dashboard exists, content changes are made in `data/` and applied with `npm run db:seed -- --update` (overwrites every row); launch measurements: Lighthouse desktop 99 / 98 / 100 / 100, mobile 92 / 98 / 100 / 100 (mobile LCP 3.1 s, Speed Index 4.2 s); production smoke test passed (five pages 200, unknown paths and `/dashboard` 404) |
| D82 | Auth stack: `next-auth@beta` (Auth.js v5) with the GitHub provider, JWT sessions, no database adapter and therefore no auth tables; exact version pinned at install (R9); Auth.js now lives under Better Auth but supports Next 16, so D9 stands and switching library would need a new decision |
| D83 | Allowlist: one GitHub numeric user id in `ADMIN_GITHUB_ID` (not the username); the `signIn` callback rejects every other account, the id is copied into the JWT, and `requireAdmin()` compares it to the env var on every call, so changing the variable ends existing sessions; session lifetime 7 days |
| D84 | Guard: `proxy.ts` (named export `proxy`, matcher `/dashboard/:path*`, Node runtime on Next 16) only redirects signed-out visitors to `/dashboard/login`; the boundary is `requireAdmin()` called by every dashboard page, layout and server action (it redirects when there is no admin session); public routes are never matched by the proxy |
| D85 | Config: auth variables are validated in `lib/auth/env.ts` (`AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `ADMIN_GITHUB_ID`) and the Blob token in `lib/blob/env.ts`, outside `lib/env.ts` so `npm run db:seed` needs neither; they are set in Vercel Production and Preview because the build imports these modules; two GitHub OAuth apps (localhost and production), so sign-in works only on those two origins, not on preview URLs |
| D86 | Data safety: local development and Vercel Preview use a Neon dev branch seeded with `db:seed`; only Production uses the main branch, so testing create and delete never touches live content; migrations are applied to both (additive, D70); this amends D70's single shared database |
| D87 | Action pattern: every dashboard mutation is a server action in `lib/dashboard/actions/<area>.ts` built on one `adminAction` helper: `requireAdmin()` → Zod parse → write → `revalidateSite()` → typed `ActionResult` (field errors keyed by path, never thrown for user input); forms are client components with `useActionState` sending one JSON `payload` field; row actions (visibility, reorder, delete) run in `startTransition`; results show as sonner toasts; P5.3a verifies the helper works as a `"use server"` export, with an explicit `await requireAdmin()` as the first line of each action as the fallback |
| D88 | Revalidation: `revalidateSite()` calls `revalidatePath("/", "layout")` after every successful write (five routes and the root-layout SEO metadata); `revalidate = 3600` stays as a fallback; P5.3a tests whether a profile edit refreshes the manifest |
| D89 | Validators: the P4.3 schemas stay the single source; base object shapes are split from their refinements so form schemas omit `sort` and `visible`; limits move to `types/limits.ts`, shared by validators and editor hints, so client code never imports `validators/` or Zod (D68); new rules: `shipped` has at most 3 projects, and at most 3 `featured && visible` projects (cross-row check in the project actions); the slug is set at creation and read-only afterwards; new rows get `sort = max + 1` and `visible = true` |
| D90 | Admin reads: `lib/db/admin-queries.ts` returns every row (hidden too) with `id`, `sort` and `visible`, not strictly parsed, so a hand-broken row can still be opened and fixed; public queries are unchanged; dashboard pages are dynamic |
| D91 | Reorder is up/down buttons (no drag library): one action takes `id` and a direction, swaps within the group (Projects: same filter type; others: the whole list) and renumbers `sort` 0..n-1 for all rows in one `db.batch`; visibility is an immediate switch; delete is an AlertDialog that suggests hiding |
| D92 | v1 editor scope: Profile all fields; Projects full CRUD, reorder, visibility, featured, two fixed link slots; Tech Stack edit, reorder and hide groups (no create or delete, the design is four cards, D52) with items and highlights within the validator limits; Experience edit the Work and Learning items only, shipped projects add/remove/reorder (at most 3), no create, delete, reorder or hide of top-level items (D56, D62); revisit when the layouts allow it |
| D93 | Dashboard UI primitives: no shadcn/ui and no Radix (amends D2); `components/dashboard/ui` holds a few small components built on our tokens and the existing `GlassCard`, `Button`, `Pill` and `Chip`: Input, Textarea, Select (native `<select>`), Switch (native checkbox with `role="switch"`), ConfirmDialog (native `<dialog>`, which gives the focus trap and Esc), FieldRow; toasts use `sonner`; no dashboard theme CSS, `lib/cn` is used as is |
| D94 | Blob: `@vercel/blob`, public store, `put` through a server action with `addRandomSuffix`; `serverActions.bodySizeLimit` is `4mb` in `next.config.ts`; limits: png/jpeg/webp up to 2 MB, PDF up to 4 MB, no SVG; `images.remotePatterns` for `*.public.blob.vercel-storage.com`; the upload returns a URL into form state and is saved with the form; a replaced or removed Blob URL is deleted after a successful save (best effort, site paths never); orphans from abandoned uploads are accepted |
| D95 | Dashboard UI: dark, same tokens and fonts, desktop-first; R1 and R2 do not apply (normal scrolling, no wheel paging); QA at 1440×900 and 390×844; visible focus; sidebar on desktop, top bar on phones; `noindex` |
| D96 | R9 log for P5: new dependencies `next-auth@beta`, `@vercel/blob` and `sonner`; not added: shadcn/ui and Radix, auto-animate (stays P6.1), dnd-kit, react-hook-form, TanStack Table, an auth adapter |
| D97 | Seed after the dashboard: default `db:seed` (add missing rows) stays safe; `--update` overwrites dashboard edits, so P5.7 makes it require `--yes-overwrite`; content changes go through the dashboard from P5.3 on |
| D98 | Tech Stack card limits go from 5 items and 4 highlights to 7 items and 5 highlights per group (highlights stay at most 40 characters) so new skills can be added; amends D52 and D78; the numbers live in `types/limits.ts` (D89) and change in P5.5, not earlier; P3.9 fit QA was done at 5 and 4, so P5.5 starts from measured panel heights, re-runs fit QA at all eight viewports with a full card (7 items, 5 highlights), and may tune the density tiers in `TechStackPanel` or lower the limits if a viewport overflows (R1) |
| D99 | P5.2 shell details: the `(admin)` layout calls `requireAdmin()` and mounts the sonner `Toaster`; one `<aside>` is a sticky top bar on phones and a fixed 16rem sidebar from `lg`; the primitives in `components/dashboard/ui` (Input, Textarea, Select, Switch, FieldRow, ConfirmDialog, Toaster) are thin wrappers over native elements sharing `field-styles.ts`, with `ref` as an ordinary prop (no `forwardRef`); `Select` options carry their own dark colors because the browser draws the open list; `ConfirmDialog` is a native `<dialog>` whose `onConfirm` may return any value; two new tokens: `--color-danger` (`#f87171`: errors and outlines) and `--color-danger-solid` (`#dc2626`: solid red buttons with white text); overview counts are computed in JS in `lib/db/admin-queries.ts` (`getAdminCounts`); `app/dashboard/(admin)/[area]/page.tsx` is a temporary "arrives in P5.x" stub that P5.7 deletes |
| D100 | P5.3a action pattern (amends D87): forms call the action with a typed object inside `useTransition`, with no `useActionState` and no hidden JSON field, so the input type comes straight from the Zod schema and row actions use the same helper; `adminAction(schema, handler)` in `lib/dashboard/admin-action.ts` runs `requireAdmin()` (outside the try, so its redirect isn't swallowed), then `safeParse`, then the handler, then `revalidateSite()` on success, and returns `ActionResult` (`{ ok: true, data }` or `{ ok: false, error, fieldErrors }`, keys like `socials.0.url` or `_form`, helpers `ok` and `fail`); `export const x = adminAction(...)` works as a `"use server"` export; forms are uncontrolled and read with `FormData` on submit, string lists are one item per line; the profile editor requires both social links (D57) and sends the three file URLs unchanged until P5.3b; `signOutAdmin` in `lib/dashboard/actions/auth.ts` is the only action without an admin check; inline `"use server"` is not allowed in the client graph and the dashboard barrel exports server components only; revalidateSite()` (D88) is `revalidatePath("/", "layout")` and that alone refreshes the manifest after a profile edit |
| D101 | P5.3b uploads (amends D94): two Blob stores, `portfolio-dev` (Development and Preview) and `portfolio-prod` (Production), because a copy of the dev Neon branch can carry production file URLs and a replace on dev would delete production's file; `serverActions.bodySizeLimit` is `4.5mb`; `uploadAsset` checks size and the file's magic bytes (`lib/blob/sniff.ts`: PNG, JPEG, WebP, PDF), refuses SVG and uses random-suffix names; `adminAction` takes `{ revalidate: false }` for actions that change no site content; nothing is uploaded until the profile is saved: the browser keeps picked files in memory (a local `blob:` preview, `lib/dashboard/pending-asset.ts`), and on Save uploads each changed file with `uploadAsset` (one request per file, so the request limit holds) and then calls `updateProfile` with the final URLs; if an upload or the save fails, files already uploaded during that save are deleted with `discardAsset`, which refuses a file a saved row uses (`lib/blob/references.ts`; project logos join in P5.4b) and anything outside `profile/`; after a successful save, replaced Blob URLs are deleted (`deleteBlobs`, logged, warning toast if a delete fails) and site paths never are; a tab closed in the few seconds of a save can still leave one orphan file; the logo stays a file in `public/images/logo.png`, outside the dashboard, like the favicons, manifest icons and the OG image |
| D102 | P5.4a projects list: `/dashboard/projects` lists every project, hidden ones too (`getAdminProjects`, type `AdminProject` = `Project` + `id`), grouped by filter in the public pill order and labels, empty groups skipped; row actions in `lib/dashboard/actions/projects.ts`: `setProjectVisible`, `setProjectFeatured`, `moveProject` and `deleteProject`, each through `adminAction`; the featured cap is `MAX_FEATURED_PROJECTS = 3` in `types/limits.ts` and counts rows that are both visible and featured (what Overview shows, D48), checked when turning Featured on and when showing a featured project, with the message "Turn off Featured on another visible project first"; `moveProject` swaps with the nearest neighbor in the same filter, renumbers `sort` 0..n-1 over the global order and writes only the changed rows in one `db.batch`; because Overview reads the global order, a move cannot cross filters (known limitation) and the page says so; moves give no toast, switches and delete do, and errors always do; deleting a project also deletes its Blob logo if it has one; the list refreshes through `revalidateSite()`, with no optimistic updates; the validator base split from D89 moves to P5.4b, where the form first needs it, and `types/limits.ts` starts with the featured cap only |
| D103 | P5.4b project form: `/dashboard/projects/new` and `/dashboard/projects/<slug>` use one `ProjectForm` (edit mode when given a project); it edits slug, title, kicker, summary, filter, status, tech tags, two fixed link slots (Live demo and Repository; an empty URL hides the button) and the icon and logo; featured, visible and order stay in the list, and a new project is visible, not featured and last in order; the slug is generated from the title when left empty, is read-only after creation, and `new` is reserved; `createProject` and `updateProject` use `projectFormSchema`, which shares `contentShape` with `projectSchema` (D89); images upload only on Save with the D101 flow (changed files, one request each, deleted again with `discardAsset` if the save fails) and replaced or removed files are deleted after the save; creating returns to the list, editing stays on the form; `lib/blob/references.ts` also checks project icons and logos, and deleting a project deletes both files |
| D104 | Project images and tags: `projects.icon_url` (new, nullable) is the small square on the cards (PNG, JPEG or WebP, up to 1 MB) and `projects.logo_url` is the large image for the project details (up to 2 MB); cards use the icon only and show the first letter without one, never the logo; tech tags have no maximum, the Projects card shows the first `MAX_CARD_TECH` (5, `types/limits.ts`) and a "+N" chip (amends D54) and the details will show all of them; the Projects card pins the tags and the link buttons to the bottom so they line up across cards whatever the summary length; the migration `ADD COLUMN icon_url` is applied to the dev branch, then to production before the code merges (D86) |
| D105 | Project categories (amends D3, D54, D64, D66): the `project_filter` enum became the `project_categories` table (slug unique, label, sort, visible) and `projects.filter_type` is text with a foreign key to the category slug; a project has one category; the migration creates the table, inserts the five original filters, converts the column with `USING "filter_type"::text`, adds the foreign key and drops the enum (generated SQL edited by hand for the order and the cast), applied to dev, then to production before the code merged, with a backup branch; `slug` is made from the label when a category is added and never changes, labels are at most `MAX_CATEGORY_LABEL` (20) characters; the Projects page shows a tab only for a visible category with at least one visible project, in `sort` order, and the first tab opens by default; hiding a category removes its tab only: its projects stay visible, so a featured one still shows on Overview and the featured cap stays correct; a category with projects cannot be deleted and the last category cannot be deleted; `/dashboard/categories` adds, renames, reorders (swap and renumber in one `db.batch`, D91), hides and deletes; the project form's Filter select lists every category, hidden ones marked; `createProject` and `updateProject` check that the category exists; `ProjectsPanel` takes the categories as props and `lib/projects/filters.ts` keeps only the status labels; `data/categories.ts` seeds the five originals |
| D106 | Project details (phase P7, planned in P7.1, amended by D112–D122): the title or a Details button on a project card opens a full-width, full-height overlay with an open animation, scrolling like a normal page; content is structured, not free markdown (D112); no deep link at first (the data model allows adding one); a history entry on open so Back closes it (D116); a native `<dialog>` opened with `showModal()`, with a Stage guard (D117); a deliberate exception to R2 and D50 because it is an overlay, not a page; every claim in it follows R4 |
| D107 | P5.5 Tech Stack editor (implements D92 and D98): `/dashboard/tech-stack` lists the groups (edit, up/down reorder with swap and renumber in one `db.batch`, visible switch; no create or delete) and `/dashboard/tech-stack/<slug>` edits a group: label, title, subtitle, badge, a group icon limited to `GROUP_ICON_KEYS` (monitor, terminal, database, zap), items and highlights; the slug is read-only; the limits live in `types/limits.ts` and the validator reads them: `MAX_SKILL_ITEMS` 7, `MAX_SKILL_HIGHLIGHTS` 5, `MAX_HIGHLIGHT_LENGTH` 40; hiding the last visible group is refused; a new item starts as "Learning" (R4); blank highlight rows are dropped on save and a blank item name is an error; row keys are counters so server and browser ids match; the public panel keys groups by slug and cards key list rows with their position; the card number follows the card's position among the visible cards (`formatIndexLabel` in `lib/skills/index-label.ts`): the stored label has no number and a typed leading number is stripped on save and on display; fit QA with a full card (7 items, 5 highlights) passed; slack in px (negative = taller than its area) at 1920×1080 367, 1536×791 78, 1440×900 187, 1366×768 55, 1280×720 96, 1024×768 7, 390×844 200 and 360×640 −4 (absorbed by the gap above the controls and the bottom padding); 1024×768 is the tightest |
| D108 | Item icons are found, not listed (amends D53): `SkillItem.iconKey` is free text and empty means "find it from the name"; `resolveTechIcon` (`components/panels/resolve-tech-icon.ts`) tries a built-in key (`TECH_ICON_KEYS`, so existing items keep their icons), then `lucide:<name>` to force lucide, then the typed name or the item name in Simple Icons (`react-icons/si`, with symbol spelling such as `nodedotjs` and `cplusplus`, a few aliases and trailing words such as "API") and then in lucide (letters and digits only, so `shield-check` and `shieldcheck` match); no match shows the first letter in a small box (`TechLogo`); the icon sets load on demand and once (`loadIconSets`): on the server for the public cards (`SkillGroupCard` is an async server component) and in the browser only in the dashboard editor for the live preview, so they never join a public bundle (R5, checked by searching the public chunks for an icon name); the editor says when nothing was found; `TECH_ICON_KEYS` and `TECH_ICONS` remain for the built-in keys and the group icons |
| D109 | P5.6 Experience editor (implements D92): `/dashboard/experience` lists the two items (no switch, reorder, create or delete; a "Hidden" tag if one ever is) and `/dashboard/experience/<slug>` edits one: title, organization, start and end (`YYYY-MM`, an empty end means Present), summary and tags; Work (kinds `work` and `freelance`) also has the short summary and the Shipped list, Learning (`education`) also has its bullets; Work bullets stay empty (D56); `updateExperienceItem` applies the fields by the row's real kind and never touches kind, sort or visible; limits live in `types/limits.ts` and the validators read them: `MAX_SHIPPED_PROJECTS` 3, shipped bullets 3–5 (`MIN_`/`MAX_SHIPPED_BULLETS`), `SHIPPED_COMPACT_BULLETS` 3 (the first three show in the wide layout), `MAX_EXPERIENCE_BULLETS` 4 (Learning) and `MAX_EXPERIENCE_TAGS` 8, the last two estimated from the content and confirmed by the fit QA with content at the limits (passed at the QA viewports); a fully empty shipped row is dropped on save, a half-filled one is an error; the Shipped name is free text (D75); `experienceItemFormSchema` and `experienceItemSchema` share one `contentShape` (D89); `nonEmpty` reports "Required."; `moved` (`lib/dashboard/list.ts`) and `splitLines` are shared helpers; the public cards key list rows with their position, and shipped cards by index, so equal values cannot clash |
| D110 | Work timeline (planned, built when the first job or client exists): the Work card becomes a compact list of roles (kinds `work` and `freelance`), current roles first and then newest start first, each with title, organization, dates and one line; the three Shipped cards and the Learning band keep their shape, so the wide layout still fits one screen, with a fit check of three roles at 1366×768 and in the carousel; at most 4 roles, ordered automatically, no reorder buttons; an ongoing Upwork engagement or several gigs is its own `freelance` role, separate from Independent / Personal Projects, while a single notable gig can be a Shipped card; the dashboard then allows creating and deleting work and freelance items up to 4 (lifts D92 for them only), and Learning stays single; no migration (kinds and dates exist); a role's detailed achievements go to the project-style overlay (D106); every claim follows R4, with client names kept generic when confidential |
| D111 | P5.7 hardening (implements D84 and D97): `db:seed --update` needs `--yes-overwrite` and every write run prints the database host (no password); `scripts/check-actions.ts` runs at the start of `npm run build` (`check:actions`) and fails the build when a file in `lib/dashboard/actions` doesn't start with "use server", when an export there isn't built with `adminAction` (the only exception is `signOutAdmin`), or when a page under `app/dashboard/(admin)` doesn't call `requireAdmin()`; the temporary `[area]` stub is deleted; the Projects page shows "No projects to show right now." when no category has a visible project; every dashboard route redirects to the login page when signed out, a signed-out or revoked-session action redirects and changes nothing, and each public page was checked with its content hidden; content changes go through the dashboard from now on, and `data/` is seed input for a fresh database only |
| D112 | Project details content model: one nullable `projects.details` jsonb column parsed by a Zod schema, no new table; fields `problem` (≤ 700), `role` (≤ 40), `timeframe` (≤ 30), `features` (≤ 6, title ≤ 50, text ≤ 220), `notes` (≤ 3, title ≤ 60, body ≤ 900), `screenshots` (≤ 8, url, alt ≤ 140, caption ≤ 140) and `videoId` (11 characters); summary, links, status, category, logo and tech come from existing columns; a section shows only when filled; an empty form saves `null`; limits live in `types/limits.ts` |
| D113 | Details loading: the public `Project` gains `hasDetails`; `getProjectDetails()` (cached) returns entries only for projects that have details and feeds the overlay alone; the overlay renders only while open, so nothing loads or ships to the DOM before; size estimated at about 7 KB per fully filled project (not measured); fallback is loading on open through a server action; the migration is an additive `ADD COLUMN details jsonb`, applied to dev, then to production before the code merges (D86) |
| D114 | One overlay for the site, mounted outside the Stage panels (a modal inside an inert panel would be inert) and opened through a context; it opens over the current page with the URL unchanged (amends D106); triggers are a Details button and the title on `ProjectCard` and `FeaturedProjectCard`, shown only when `hasDetails`; no whole-card click |
| D115 | Overlay animation: fade plus a 24 px rise and slight scale on the dialog, backdrop fade, transform and opacity only; `--duration-overlay` 400 ms (150 ms and fade only under reduced motion); open is `showModal()` then a data attribute on the next frame, close removes it, waits one duration and calls `close()`; no grow-from-card effect (carousel slides clip) |
| D116 | History: opening does `pushState` with a marker and the same URL, Back closes, the close button and Esc call `history.back()` when the entry was pushed (Esc through the dialog's `cancel` event), a leftover marker on load is removed with `replaceState`, Forward reopens; the only exception to D22, and only while open; Next's `popstate` handling is untested until P7.4a |
| D117 | Stage guard: `<html>` gets `data-stage-locked` while the overlay is open and the key, wheel and swipe hooks return early through `lib/stage/modal-guard.ts`; the swipe hook needs it because the dialog sits under `[data-stage-viewport]`; the dock and tab bar are inert while a modal dialog is open; the dialog scroller has `data-stage-scroll`; the browser returns focus to the trigger on close; `useStageFocus` is unchanged |
| D118 | Overlay layout: full width and height, own scroll, content about 72 rem; header with logo, kicker, status, title, summary and link buttons; from 1024 px two columns (left Problem, What it does, Engineering notes; right video, screenshots in a `Carousel` with a 16:10 frame, an "At a glance" card and all tech chips), not sticky; below 1024 px one column with a sticky close bar; the exact order and fit are measured in P7.4b |
| D119 | Video: a click-to-load facade, then an iframe on `youtube-nocookie.com/embed/<id>` (autoplay after the click, `rel=0`, `playsinline`, title, `allow`, `referrerPolicy`); no request to YouTube before the click; poster is the first screenshot or a plain panel; the dashboard takes a YouTube URL or an id and stores only the id; a CSP, if ever added, needs `frame-src` for youtube-nocookie; embedding is checked in P7.5 |
| D120 | Screenshots: upload kind `screenshot` (separate from `PROJECT_ASSET_KINDS`), PNG, JPEG or WebP up to 2 MB, no SVG, up to 8 per project, D101 flow (upload on Save, one request each, rollback on failure, cleanup after save), `profile/` path prefix kept so `discardAsset` is unchanged; `isReferenced` also checks `details` with a jsonb containment query; public frame is 16:10 with `object-cover object-top`, upload about 1600×1000, so no image sizes are stored |
| D121 | Details editor: `/dashboard/projects/<slug>/details`, linked from the project form and list, `updateProjectDetails` built on `adminAction` with `projectDetailsSchema`; the project list shows a "Has details" tag; features, notes and screenshots reorder with up/down buttons (D91); the first version keeps existing screenshots unchanged until P7.3b |
| D122 | First details content is written by Kun in the dashboard for Kundesk, Padel Batu Alam Permai and Kun Bookshop; nothing invented is seeded (R4); no new dependency (R9) |
| D123 | P7.2a details types and validator: `types/details.ts` holds the types and `YOUTUBE_ID_PATTERN` (one source for the editor and the schema); `features`, `notes` and `screenshots` are always present and may be empty, while `problem`, `role`, `timeframe` and `videoId` are optional strings left out when empty; a screenshot needs `alt`, its `caption` is optional and its `url` is a site path or http(s); `projectDetailsSchema` (`validators/details.ts`, strict, limits from `types/limits.ts`) rejects blank strings because the editor drops blank rows first (D109), and `detailsOrNull` turns an empty result into `null` for the column; `hasDetails` moves from P7.2a to P7.2b, because adding it to `Project` changes `ProjectContent`, `projectSchema`, `AdminProject`, the seed data and the public query together and needs the column |
| D124 | P7.2b details storage (implements D113): `projects.details` is a nullable jsonb column typed `ProjectDetails`, added by an additive migration (dev, then production before the code merged, D86); the stored fields are `StoredProject` and the public `Project` is `StoredProject` plus `hasDetails`; `projectSchema`, `ProjectContent`, the seed data and `AdminProject` build on `StoredProject`, so the strict schemas, the seed and the dashboard form never see `details`; `AdminProject` also carries `details` (null or the object) for the editor; `loadProjects` drops `details` before the strict parse and sets `hasDetails` from `details !== null`; `getProjectDetails()` (cached) returns one `ProjectDetailsEntry` per visible project with details, in public order, with the category label looked up among all categories (hidden ones included, D105), the logo, tech, links and the details parsed by `projectDetailsSchema`, and a bad value throws like any bad row (D68); `db:seed` never writes `details`, so `--update` keeps them, and `updateProject` leaves them untouched |

### Open

| ID  | Question                                                                 | Default                                    |
| --- | ------------------------------------------------------------------------ | ------------------------------------------ |

---

## 11. Content notes from design review

- Footer and Get In Touch use Samarinda, ID (UTC+8, Asia/Makassar).
- Remove or make true: "99.9% uptime", "Latency <18ms", "Multi-Region Edge Caching", and any stack items not actually used (e.g. AWS ECS, BullMQ, LangChain).
- Verify versions (mock says Next.js 15).
- Unfinished projects show an honest status badge.
- Experience: frame as a journey + shipped-milestones timeline rather than a job list — settle in P3.
