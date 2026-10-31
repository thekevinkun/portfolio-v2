# Portfolio v2

The personal portfolio of Kevin Mahendra, built as a console-style UI (PS5-like) instead of a scrolling page.

**Live:** https://kevinmahendra.vercel.app

## What it is

- Five pages, one at a time: Overview, Tech Stack, Projects, Experience, Get In Touch. Each fits one screen, with no page scrolling.
- The mouse wheel, keyboard, touch swipe and the dock turn the pages like a book. One page per gesture, even for a very hard swipe.
- Project details open in an overlay, with screenshots, a video and an engineering write-up.
- All content lives in a Neon Postgres database and is edited from a private dashboard, so a content change needs no redeploy.
- Server-rendered, keyboard-accessible, and reduced-motion friendly. There is no contact form: just links, a resume download and availability.

## Stack

Next.js (App Router), React, TypeScript (strict), Tailwind CSS v4, Motion, Neon Postgres with Drizzle, Zod, Auth.js (GitHub login), Vercel Blob, hosted on Vercel. The decisions behind each choice are logged in `docs/CLAUDE.md`.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:migrate           # apply the SQL migrations
npm run db:seed              # add the starting content
npm run dev                  # http://localhost:3000
```

Use a separate Neon branch for local development and previews, so testing never touches the live content. Only production should use the main branch.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Runs the two guard checks, then `next build` |
| `npm run start` | Serves the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generates types and runs `tsc --noEmit` |
| `npm run db:generate` | Creates a migration from `lib/db/schema.ts` |
| `npm run db:migrate` | Applies the migrations in `drizzle/` |
| `npm run db:seed` | Adds the rows from `data/` that are missing (never overwrites) |
| `npm run check:actions` | Fails if a dashboard action or page skips the admin check |
| `npm run check:client` | Fails if a client file reaches the icon sets through a barrel |

Seed options: `npm run db:seed -- --check` validates the data without touching a database; `npm run db:seed -- --update --yes-overwrite` overwrites existing rows, so dashboard edits are lost.

## Dashboard

`/dashboard` is a private admin for the profile, projects and their details, categories, tech stack and experience. Sign-in is GitHub only and limited to one account. The sign-in is configured for localhost and the production domain, not for preview URLs.

## Deploying

Vercel builds from `master`. Set the same variables as in `.env.example` in each Vercel environment. `SITE_URL` must be the production URL everywhere. Apply a database migration to production before merging code that needs it, because the production build reads the new column.

## Project docs

| File | What it holds |
|---|---|
| `docs/CLAUDE.md` | Rules, architecture, design system and every logged decision (D1 to D136) |
| `docs/ROADMAP.md` | Phases and steps |
| `docs/PROGRESS.md` | Status, known issues and the handoff log |
| `docs/WORKFLOW.md` | How each step is built, verified and shipped |
| `docs/DESIGN.md` | The interaction reference (the colours follow the screenshots, not this file) |