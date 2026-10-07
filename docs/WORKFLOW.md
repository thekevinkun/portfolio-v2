# Build Workflow Playbook

> Project-agnostic. Attach this file to any new project chat (or keep it as `~/.claude/CLAUDE.md` for Claude Code), next to the project's own `CLAUDE.md`.
> This file says **how we work**. The project's `CLAUDE.md` says **what we build** and its conventions. If they conflict, the project's `CLAUDE.md` wins.

---

## 1. Principles

1. **Small steps.** One step = one branch = one PR. A step fits in one sitting.
2. **The default branch is always deployable.** Nothing lands without a PR and a green preview.
3. **Every step is delivered the same way** (section 2), so nothing is guessed and nothing is skipped.
4. **Verify before merge.** The step ends with concrete checks, not "looks fine".
5. **Docs move with the code.** Progress and decisions are updated in the same PR.
6. **No scope creep.** Anything not in the step goes to "Risks / follow-ups" in the PR.
7. **No new library or service without a logged decision.**
8. **Don't create documents nobody asked for.** Build.

---

## 2. Anatomy of a step (the delivery format)

Every step is answered in this order, in one response:

| # | Part | What it contains |
|---|---|---|
| 1 | **Title + one-line goal** | Step ID (e.g. `P1.4`) and what it delivers |
| 2 | **Branch** | Exact commands: switch to default branch, pull, create `type/step-id-short-name` |
| 3 | **Commits, in order** | For each commit: a heading, then **where** (full file path) and **what** (the complete file, or an exact edit: "inside block X, add...", "replace line A with B"), then the exact `git add` and `git commit -m "..."` |
| 4 | **Verify** | Commands to run, then visual and behavior checks at named viewports. Includes temporary previews that are **not committed** (and the `git restore` to discard them) |
| 5 | **Docs** | Exact edits to the progress file (tick the step, log decisions with IDs) and any convention changes, as their own commit |
| 6 | **Push + PR** | Push command, PR title, and the full PR body |
| 7 | **Merge + cleanup** | Squash-merge, then switch, pull, delete the branch |
| 8 | **Next step** | One sentence on what comes next |

Rules for part 3:

- **Complete files with full paths.** Never "update the function"; show the whole file or an unambiguous edit.
- **One commit = one logical change that builds.** Order commits so each one typechecks on its own.
- Install commands go in the commit that needs them (`package.json` and lockfile together).
- Comments in code are short and say *why*, not *what*.
- Temporary preview code is never committed.

---

## 3. Commit messages

Conventional Commits: `type(scope): imperative summary`, 72 characters or fewer, no trailing period.

| Type | Use for |
|---|---|
| `feat` | New user-visible capability or component |
| `fix` | Bug fix |
| `chore` | Tooling, deps, config, scaffolding |
| `docs` | Documentation only |
| `refactor` | Behavior unchanged |
| `perf` | Performance only |
| `test` | Tests (if the project has them) |

- Scope is the area: `theme`, `ui`, `chrome`, `stage`, `db`, `layout`.
- Add a body only when the *why* isn't obvious.
- Squash-merge: the **PR title** becomes the final commit on the default branch, so it follows the same format and ends with the step ID in parentheses: `feat(ui): primitives and background layers (P1.5)`.

---

## 4. Pull request template

```md
## Summary
<what and why, with the step ID>

## Changes
- <one bullet per meaningful change>

## Screenshots / recording
<UI steps: at least desktop and phone sizes>

## How to verify
1. <exact commands and checks>

## Checklist
- [ ] Meets the step's acceptance criteria
- [ ] Typecheck, lint and build pass
- [ ] UI steps: checked at the QA viewports
- [ ] Interactive steps: keyboard and reduced motion checked
- [ ] No new `any`, hardcoded content or arbitrary values
- [ ] Docs updated, decisions logged

## Risks / follow-ups
<deferred work, new dependencies, known limits>
```

---

## 5. Definition of Done (every step)

- [ ] Acceptance criteria from the roadmap are met
- [ ] Typecheck, lint and build pass
- [ ] Verified at the project's QA viewports (UI steps)
- [ ] Keyboard and reduced-motion verified (interactive steps)
- [ ] Docs and decisions updated in the same PR
- [ ] Vercel (or CI) preview is green before merge

---

## 6. Phases, chats and handoff

- Work is split into **phases** in a `ROADMAP.md`; each phase has numbered steps (`P2.3`).
- **One phase per chat**, so context stays light. Risky or architectural phases start with a **plan chat (no code)**.
- Start every chat with:

```
Attached: WORKFLOW.md, CLAUDE.md, PROGRESS.md.
Repo files: <paste output of: git ls-files | grep -v lock>
Phase: <id> — Step: <id>.
Mode: Build.
Goal: <one sentence>.
```

- **End of a phase or chat:** update `PROGRESS.md` (tracker, decisions, known issues) and give the starter prompt for the next chat.
- Anything undecided is logged as an open decision, never silently put into code.

---

## 7. Project setup checklist (do once, at the start)

Decide and write these into the project's `CLAUDE.md` before step 1:

- [ ] Default branch name (`main` or `master`) and repo name
- [ ] Package manager
- [ ] Stack and the "deliberately not used" list
- [ ] Code conventions (e.g. component style, export style, barrels, file size limits, naming)
- [ ] QA viewports and accessibility basics
- [ ] Folder structure
- [ ] Branch protection: PR required, no force pushes, preview check required, linear history

---

## 8. When something breaks

1. Paste the exact error (command and output).
2. Diagnose the **root cause** first, in a sentence or two.
3. Fix it as a **small commit on the same branch** (`chore: ...` or `fix: ...`), with the verify commands again.
4. If the cause is a wrong assumption in the docs, correct the docs in the same PR.

---

## 9. Using this in Claude Code

The structure stays the same; the mechanics change:

- Put this file in your user-level `~/.claude/CLAUDE.md`, or reference it from each repo's `CLAUDE.md`, so it loads automatically.
- Claude Code edits files and runs commands itself, so it does **not** need to print full files. It still follows the loop: branch, small commits with Conventional Commit messages, verify, docs, PR text.
- **Stop points:** after the verify checks and before `git push`, Claude Code reports results and waits for your go. It never merges or force-pushes.
- Ask it to print the PR title and body at the end, using section 4.
- Check the current Claude Code documentation for the best way to turn a recurring workflow into a reusable command or skill.

---

## 10. Quick reference: the step loop

```
default branch -> pull -> new branch
  -> commit 1 ... commit N (each builds)
  -> verify (commands + visual checks)
  -> docs commit
  -> push -> PR (title + body)
  -> preview green -> squash-merge
  -> switch, pull, delete branch
  -> next step
```
