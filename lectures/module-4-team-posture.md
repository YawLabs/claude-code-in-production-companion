# Module 4 -- Team Posture

[OPEN: title card; cut to desk]

Welcome to module 4. The last one.

In modules 1, 2, and 3 you built an overlay for *you*. Your model pin, your skills, your memory, your hooks. Everything in `.claude/` was tuned for one developer -- which is fine when one developer is the team.

Module 4 is what happens when the team has three engineers. Or five. Or twenty.

The same overlay has to work for all of them. Some of what you built is genuinely team-shareable -- the model + effort pin, the discipline rules, the allowlist baseline, the project memory about the demo's bugs. Some of it is personal -- your specific effort tier overrides, your private notes on a refactor, the experimental skill you are still tuning. Mixing those gets you a `.claude/` that is half-team-half-personal, which is worse than either.

The central move of module 4 is the split. Apply one question to every piece of the overlay: *is this safe to share with the team?* Things that pass go in `.claude/` and get checked in. Things that do not pass go in `settings.local.json` (gitignored) or `memory/personal/` (gitignored).

That is the whole module, structurally. The rest is mechanics -- moving entries, writing templates, documenting conventions, wiring CI.

[BEAT]

## Memory: shared and personal

[CAPTURE: memory/ directory at module-3-final, then at module-4-final]

The three module-2 memory entries all pass the team test:

- `project_demo_bugs.md` -- the demo's intentional bugs are the same demo for every collaborator. Shared.
- `feedback_skill_description_voice.md` -- the lesson applies to anyone writing skills. Shared.
- `feedback_allowlist_tuning.md` -- the lesson applies to anyone tuning an allowlist. Shared.

All three move from `memory/` to `memory/shared/`. `MEMORY.md` gets reorganized with `## Shared` and `## Personal` headers so the index makes the split obvious.

`memory/personal/` is gitignored at the repo root. New entries land there by default if they are private to you -- your in-progress notes on a refactor, feedback memories you have not yet validated as team-useful, anything you do not want to put in front of teammates.

The promotion path: write a personal entry, see it earn its keep across multiple sessions, promote to `shared/` so the team gets the benefit. The promotion is just a `git mv` and an update to `MEMORY.md`.

## Settings: team baseline plus personal overrides

[CAPTURE: settings.json and settings.local.json.example side by side]

Modules 1-3 kept everything in `settings.json`. Module 4 splits it.

`settings.json` is the team baseline. Pinned model, pinned effort tier, the permission allowlist, the hooks block. Everyone who clones the repo gets these defaults. Changes here affect everyone -- discuss before editing.

`settings.local.json` is yours. Gitignored. Use it for personal overrides:

- A different effort tier. `max` for hard-problem sessions; nobody else's session bumps to `max` because of your decision.
- An allowlist for state-mutating commands the team baseline deliberately keeps un-allowlisted. `npm install` is the canonical example -- a developer doing dependency work might add it locally; the team default stays cautious.
- Per-developer credentials or paths.

The repo ships `settings.local.json.example` as a template:

```json
{
  "model": "claude-opus-4-7",
  "effortLevel": "max",
  "permissions": {
    "allow": [
      "Bash(npm install:*)",
      "Bash(npm run start:*)"
    ]
  }
}
```

New collaborators copy it to `settings.local.json` and edit. The real file never makes it into a teammate's checkout.

[SEGMENT BREAK]

## Pre-commit checklist as a rule

[CAPTURE: CLAUDE.md before/after]

Modules 1, 2, 3 kept the project-specific pre-commit discipline inline in `CLAUDE.md`. Module 4 promotes it to a rule file: `rules/pre-commit-checklist.md`.

Two reasons.

One: every rule lives in `rules/`. The manifest is now a manifest -- six lines, six `@`-includes, nothing else. The boundary between "things in CLAUDE.md" and "things in rules/" is sharp.

Two: the rule sharpens. The team-contract version forbids `--no-verify` shortcuts, distinguishes `lint:fix` from `lint`, and is explicit that "do not bypass; fix the underlying issue." The inline version was softer because it was project-specific commentary; the rule-file version is a contract.

[BEAT]

Some teams will keep one or two project-specific rules inline in `CLAUDE.md`. Others (like the canonical answer) push everything to `rules/`. Either is defensible. The clean-separation case is that `CLAUDE.md` reads better at a glance when it is purely a manifest -- you see the disciplines as a list, not buried inside prose.

## CONTRIBUTING.md

[CAPTURE: scroll through demo-app/CONTRIBUTING.md]

A new collaborator clones the repo. They open the overlay. They see `.claude/` and have no idea what is in it.

`CONTRIBUTING.md` at the demo-app root is the doc that closes that gap. Six sections:

- **What `.claude/` is.** A new collaborator's first question.
- **First-time setup.** Literal commands. `npm install`, copy the settings template, start a session, verify the hooks fire.
- **Settings shared vs personal.** Where to put what.
- **Memory shared vs personal.** Same shape.
- **The pre-commit checklist.** Points at the rule file. Makes the team contract visible.
- **CI.** Explains what fires on every PR so collaborators are not surprised.
- **Filing issues.** Demo bugs go here; Claude Code bugs go to Anthropic.

The test for `CONTRIBUTING.md`: a new collaborator can do first-time setup from the doc alone, without needing to ask a teammate "what is `.claude/`?". If the answer to that question is in the doc, the doc is doing its job.

[SEGMENT BREAK]

## CI: agent-as-reviewer and agent-as-formatter

[CAPTURE: .github/workflows/claude-review.yml]

Two workflows, two distinct shapes.

`claude-review.yml` is **agent-as-reviewer**. Fires on every pull request. The agent runs the team's review skills against the PR diff and posts findings as inline comments. The agent never merges or modifies the PR -- it is purely advisory. The reviewer of the PR sees the agent's findings alongside the human reviewer's.

[CAPTURE: .github/workflows/claude-format.yml]

`claude-format.yml` is **agent-as-formatter**. Fires nightly. Runs `npm run lint:fix` on main and opens a PR with the result. The agent never pushes to main directly -- every change goes through the same review path as a human PR. The team reviews the auto-format PR like any other.

The split is deliberate. Agent-as-reviewer is *advisory* -- the agent reads, suggests, posts findings. The merge decision is the human's. Agent-as-formatter is *action with a checkpoint* -- the agent does work, but the result lands in a PR for human review before it touches main.

What the agent never does: push directly to main. Every change goes through the review path that humans use.

The workflows live under `demo-app/.github/workflows/`. They use `ANTHROPIC_API_KEY` as a repository secret. The exact action invocations and skill names will drift with Claude Code GitHub action versions -- the workflows are templates demonstrating the shape, not turnkey configuration.

[SEGMENT BREAK]

## What you build, what you skip

Things to build in module 4:

- Memory split into `shared/` and `personal/`. Move existing entries; document the promotion path.
- Pre-commit checklist promoted to `rules/pre-commit-checklist.md`. Drop the inline section from `CLAUDE.md`.
- `settings.local.json.example` template.
- `CONTRIBUTING.md` at the demo-app root.
- Two CI workflows under `demo-app/.github/workflows/`.

Things you do not need to build (or are already done):

- The `.gitignore` patterns for `settings.local.json` and `memory/personal/` -- the repo already has them.
- New skills. Module 3 wrapped the skill set; module 4 is restructuring, not adding.
- New hooks. Same -- the two hooks from module 3 still cover the cases.

## The loop you should be able to close

By the end of module 4:

1. A new collaborator clones the repo, runs `cd demo-app && npm install`, copies `.claude/settings.local.json.example` to `.claude/settings.local.json`, and starts working. The overlay loads. The hooks fire. The skills work.
2. The collaborator's session uses the team baseline (`xhigh` effort, the team allowlist, the team rules) but their personal overrides (whatever they wrote in `settings.local.json`) take precedence where set.
3. They open a PR. `claude-review.yml` fires. The agent posts review findings as inline comments. The PR's human reviewer sees both.
4. Overnight, `claude-format.yml` runs. If lint:fix produced changes, a PR opens for human review.
5. `MEMORY.md` lists shared entries by default. Their personal memories live in `memory/personal/` and are not in anyone else's checkout.

If those five things work for a new teammate without you intervening, the overlay is team-shareable. The course is done.

## What comes after

[CAPTURE: terminal showing git checkout module-4-final]

The course finishes here. What you have is a Claude Code overlay that:

- A new teammate can ramp into in a single session.
- Has explicit shared/personal boundaries on every piece (settings, memory, hooks).
- Runs the agent on every PR without manual invocation.
- Codifies the team's discipline as files, not as oral tradition.

That is the production posture for Claude Code. The same patterns scale up -- twenty engineers, multiple repos, more skills, more rules. The shape stays the same.

[BEAT]

What changes after module 4: nothing in this codebase. You have the overlay. The work now is using it -- shipping real software with it as your default agent posture, tuning what does not fit, promoting personal memories that earn their keep, opening PRs to refine the team contract over time.

The exercise for module 4 is in `exercises/module-4/exercise.md`. Check out `module-4-start`, build the team-posture additions, and verify a hypothetical new teammate could ramp in from `CONTRIBUTING.md` alone. The canonical answer is at `module-4-final` and `solution.md` walks the reasoning.

The course is done. Go build.
