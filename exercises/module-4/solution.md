# Module 4 -- Solution walk-through

[module-4] companion solution. Pairs with chapters 6 and 11 of *Claude Code in Production*.

One canonical answer for module 4. The canonical content lives at `module-4-final`; this doc is the *reasoning*.

## The shared/personal split is the central move

Module 4's whole shape comes from one question: "is this safe to share with a team?" Apply it to every part of the overlay.

Things that pass the question -- the model + effort pin, the rule files, the allowlist baseline, the hooks, the skills, the project memory about the demo's bugs, the feedback memories about skill-description voice and allowlist tuning. These stay in `.claude/` and get checked in.

Things that do not pass -- secrets (never), personal preferences (someone else's max-effort tier is not yours), private memories (your in-progress notes on a refactor are not the team's). These go in `settings.local.json` or `memory/personal/`, both gitignored.

The split is the central teaching artifact of module 4. Once you have it, the rest of the module is mechanical -- move the entries, write the templates, document the conventions.

## Memory: shared/ and personal/

The three module-2 memory entries all pass the team test:

- `project_demo_bugs.md` -- the demo's intentional bugs are the same demo for every collaborator. Shared.
- `feedback_skill_description_voice.md` -- the lesson applies to anyone writing skills. Shared.
- `feedback_allowlist_tuning.md` -- the lesson applies to anyone tuning an allowlist. Shared.

All three move to `memory/shared/`.

`memory/personal/` is gitignored at the repo root. Readers create entries there as needed; they never appear in checked-in state. The promotion path is: write a personal entry, see it earn its keep across sessions, promote to `shared/` so the team gets the benefit.

`MEMORY.md` is reorganized with two section headers (Shared / Personal) so the index makes the split obvious.

## Pre-commit checklist as a rule

Modules 1-3 kept the project-specific pre-commit discipline inline in `CLAUDE.md`:

```
## Pre-edit and pre-commit discipline for this app
**Why:** ...
**How to apply:** ...
```

Inline was fine when the manifest pattern was new and the project-specific bit was the only thing that did not fit. Module 4 promotes the discipline to a proper rule file. Two reasons:

1. **Every rule lives in `rules/`.** The manifest is now a manifest -- nothing else. The boundary between "things in CLAUDE.md" and "things in rules/" is sharp.
2. **The rule sharpens.** The team-contract version forbids `--no-verify` shortcuts, distinguishes `lint:fix` from `lint`, and is explicit that "do not bypass; fix the underlying issue." The inline version was softer because it was project-specific commentary; the rule-file version is a contract.

`CLAUDE.md` drops to a six-line manifest. Some teams will keep one or two project-specific rules inline; others (like this one) push everything to `rules/`. Either is defensible; the canonical answer goes all-in on the manifest pattern because clean separation reads better at a glance.

## settings.local.json.example

A clean JSON template, no comments (JSON does not support them):

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

Two common personal overrides shown:

- `effortLevel: max` -- a developer who has seen `xhigh` fall short on a specific work shape can bump to `max` locally without changing the team default.
- `Bash(npm install:*)`, `Bash(npm run start:*)` -- state-mutating commands the team baseline deliberately keeps un-allowlisted. A developer who runs `npm install` constantly during dependency work might add it locally; the team default stays cautious.

The example is intentionally short -- two overrides cover the most common cases. Readers add more as their workflow demands.

## CONTRIBUTING.md

The new-teammate onboarding doc. Five sections worth landing in any team's CONTRIBUTING:

1. **What `.claude/` is** -- explains the overlay so a new collaborator understands what they are looking at.
2. **First-time setup** -- the literal commands to run on day one.
3. **Settings: shared vs personal** -- explains the two-file split and how to use it.
4. **Memory: shared vs personal** -- same shape for memory.
5. **The pre-commit checklist** -- references the rule file, makes the team contract visible.
6. **CI** -- explains the workflows so collaborators know what fires on their PRs.
7. **Filing issues** -- where to file demo bugs vs Claude Code bugs.

The doc reads cold -- someone joining the team can do their first-time setup from this doc alone, without needing to ask a teammate "what is .claude/?"

## CI: agent-as-reviewer + agent-as-formatter

Two workflows, two distinct shapes:

`claude-review.yml` is **agent-as-reviewer**. Fires on pull request. The agent runs the team's review skills (`/review`, `/security-review`) against the PR diff and posts findings as inline comments. The agent never merges or modifies the PR -- it is purely advisory. The reviewer of the PR sees the agent's findings alongside human reviewer findings.

`claude-format.yml` is **agent-as-formatter**. Fires nightly. Runs `npm run lint:fix` on main and opens a PR with the result. The agent never pushes to main directly -- every change goes through the same review path as a human PR. The team reviews the auto-format PR like any other.

Both workflows live under `demo-app/.github/workflows/` because the demo is the module-4 reference shape. A team copying the demo to their own repo gets them at the repo root automatically. The workflows are templates -- the action invocation and skill names will need adaptation to whatever Claude Code GitHub action version is current.

The `ANTHROPIC_API_KEY` repository secret is the only configuration required.

## What this overlay can do that module 1's could not

A team of three to five engineers can clone the demo, run `npm install`, copy `settings.local.json.example`, and start working with the same agent posture as everyone else. New collaborators ramp in a single session. Personal preferences live in clearly-delineated places. CI runs the agent on every PR without anyone having to manually invoke it. The pre-commit checklist is a contract, not a hope.

That is the difference between "I have a Claude Code overlay" and "we have a Claude Code overlay." Module 4 closes that gap.

## Verifying

```bash
git diff module-4-start module-4-final
```

Compare against your work. Differences you should expect:

- Different rule choices for what to keep in `rules/` vs. inline -- some teams keep one or two project-specific rules in `CLAUDE.md`. The canonical answer is more aggressive about the manifest split; either is defensible.
- Different settings.local.json.example shapes -- yours might cover different personal overrides depending on your workflow.
- Different CI workflow specifics -- the action versions and skill names will drift; the shape (PR-triggered review, nightly format) is the durable artifact.

If a new teammate can clone, set up, and work productively from `CONTRIBUTING.md` alone -- without needing to read the rest of the docs -- the overlay works. You have shipped a team-shareable Claude Code overlay.

The companion progression is done. Go build.
