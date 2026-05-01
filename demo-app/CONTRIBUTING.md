# Contributing to the demo app

This is the team contract for working on the demo with Claude Code. New collaborators: read this before your first session.

## What is `.claude/`?

The `.claude/` directory is the project's Claude Code overlay -- the layer that pins the model, allowlists permissions, holds the discipline rules, and registers the skills, hooks, and memory store. Everything in `.claude/` (except `settings.local.json` and `memory/personal/`) is team-shared and checked in.

When you run a Claude Code session in `demo-app/`, the agent loads:

- `.claude/CLAUDE.md` -- the manifest of standing rules.
- The `@`-included rule files under `.claude/rules/`.
- `.claude/settings.json` -- model, effort, permission allowlist, hooks.
- `.claude/settings.local.json` -- your personal overrides (if you have one).
- All skills under `.claude/skills/`.
- The memory index `.claude/memory/MEMORY.md` plus any `.claude/memory/personal/` entries.

## First-time setup

1. Clone the repo and check out the relevant module tag (or `main` for the latest docs).
2. `cd demo-app && npm install`. The hooks expect `node_modules/@biomejs/biome` to exist before they will run.
3. Copy `.claude/settings.local.json.example` to `.claude/settings.local.json` if you want personal overrides. The real file is gitignored.
4. Start a Claude Code session in `demo-app/`. The agent should confirm it loaded the project `CLAUDE.md` and the model + effort pin.
5. Verify the hooks: make a small Edit/Write, watch `pre-commit-lint.sh` fire. End a session, watch `stop-notify.sh` fire.

## Settings: shared vs personal

`.claude/settings.json` is the team baseline. It pins the model and effort tier, the permission allowlist, and the hooks block. Changes here affect everyone -- discuss before editing.

`.claude/settings.local.json` is yours. It is gitignored. Use it for personal overrides: a different effort tier (`max` for hard-problem sessions), an allowlist for commands the team baseline deliberately keeps un-allowlisted (`npm install`, `npm run start`), or any other per-developer preference.

The template at `.claude/settings.local.json.example` shows the shape. Copy and edit.

## Memory: shared vs personal

Memory entries live in two places:

- `.claude/memory/shared/` is checked in. Entries here are useful to the whole team -- project context (the demo's intentional bugs), durable feedback lessons (skill descriptions are triggers, not docs).
- `.claude/memory/personal/` is gitignored. Entries here are local to you -- private notes, feedback memories you have not yet validated as team-useful, anything you do not want to put in front of teammates.

When a personal memory has earned its keep across multiple sessions, promote it to `shared/` so the team gets the benefit. `MEMORY.md` is the always-loaded index; it lists shared entries by default.

## The pre-commit checklist

The `.claude/rules/pre-commit-checklist.md` rule encodes what every commit on the demo runs:

1. `npm run lint:fix` (not just `lint`) -- biome formatting diffs that survive into a commit break CI later.
2. `npm test` -- confirm zero failures.
3. Read the staged diff -- ask whether a senior reviewer would push back.

Do not bypass with `--no-verify`. If a step fails, fix the underlying issue. The discipline is what protects correctness; the tooling is the floor.

## CI

Two GitHub workflows fire automatically:

- `.github/workflows/claude-review.yml` runs on every pull request. The agent runs `/review` and `/security-review` on the PR diff and posts findings as inline comments.
- `.github/workflows/claude-format.yml` runs nightly. It auto-fixes lint warnings and opens a PR for human review.

You do not need to invoke these manually. They use the team's `ANTHROPIC_API_KEY` repository secret.

## Filing issues

Bugs in the demo or the overlay: open an issue with the module tag you are on (`module-N-final`), what you tried, what happened, what you expected.

Bugs in Claude Code itself: file with Anthropic, not here.
