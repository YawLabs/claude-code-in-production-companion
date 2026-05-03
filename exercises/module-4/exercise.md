# Module 4 -- Team Posture

[module-4] companion exercise. Pairs with chapters 6 and 11 of *Claude Code in Production*.

## Goal

Take the overlay you built across modules 1-3 and reshape it as a team contract. By the end you will have:

- A `CLAUDE.md` that is a manifest only -- every rule is in its own file, every rule is team-shareable
- A `settings.json` that is the team baseline; a `settings.local.json.example` template for personal overrides
- A memory store split into `shared/` (team, checked in) and `personal/` (gitignored)
- A pre-commit checklist promoted from inline prose to a proper rule file
- A `CONTRIBUTING.md` at the demo-app root that onboards new collaborators
- Two GitHub workflows -- agent-as-reviewer on PRs, agent-as-formatter nightly

This is the module where the overlay stops being yours and starts being the team's.

## Starting state

```bash
git checkout module-4-start
cd demo-app
npm install
npm test
```

Tests pass. You have the module-3 overlay: rule-layered `CLAUDE.md` with the project-specific pre-commit section inline, four skills, hooks, the unsplit memory store.

## Build

### Memory split

Move the existing entries in `demo-app/.claude/memory/` into a `shared/` subdirectory. Update `MEMORY.md` links to point at `shared/` paths. Document `personal/` as the home for gitignored personal entries.

The repo's `.gitignore` already excludes `.claude/memory/personal/` -- no change needed there.

### Promote the pre-commit checklist

Move the project-specific "Pre-edit and pre-commit discipline" section from inside `CLAUDE.md` to a new file `demo-app/.claude/rules/pre-commit-checklist.md`. Add a `@`-include for it in `CLAUDE.md`. Strengthen the prose -- the team contract version forbids `--no-verify` shortcuts and is explicit about lint:fix vs lint.

`CLAUDE.md` now drops to a manifest only -- every rule lives in `rules/`, every rule is team-shareable.

### Personal overrides template

Add `demo-app/.claude/settings.local.json.example`. Show two common personal-override shapes: a higher effort tier (`max`) for hard sessions, and an allowlist for state-mutating commands the team baseline deliberately keeps un-allowlisted (`npm install`, `npm run start`).

The repo's `.gitignore` already excludes `.claude/settings.local.json` -- new collaborators copy the example, edit, and never commit the result.

### CONTRIBUTING.md

Add `demo-app/CONTRIBUTING.md`. Cover: what `.claude/` is, first-time setup, the shared-vs-personal split for settings and memory, the pre-commit checklist, how the CI workflows work, where to file issues. This is the doc a new teammate reads before their first session on the repo.

### CI workflows

Add `demo-app/.github/workflows/claude-review.yml` and `claude-format.yml`. The first fires on pull request and runs the team's review skills against the PR diff. The second fires nightly and opens a PR with auto-fixes. Both use an `ANTHROPIC_API_KEY` repository secret.

The workflows ship under `demo-app/.github/` so a team copying the demo to their own repo gets them at the repo root automatically.

## Done when

1. `CLAUDE.md` is a six-line manifest. No inline rules; every discipline is a `@`-include.
2. Memory entries live in `shared/`; `MEMORY.md` documents the promotion path from `personal/`.
3. `settings.local.json.example` exists. Copying it to `settings.local.json` (gitignored) gives a working personal-override path.
4. `CONTRIBUTING.md` reads cold -- a new collaborator can do their first-time setup from the doc alone.
5. Pushing a PR triggers `claude-review.yml`. Findings appear as inline comments. (You will need an `ANTHROPIC_API_KEY` secret configured to actually exercise this.)

## If you get stuck

```bash
git diff module-4-start module-4-final
```

That is the canonical answer. Read `solution.md` for the walk-through.
