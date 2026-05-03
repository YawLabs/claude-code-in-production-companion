# Structure

What lives at each tag. Use this as a map when diffing your own work against the reference.

The book builds a Claude Code overlay on top of a small TypeScript codebase across chapters 2-11's Try-this exercises. The codebase itself stays nearly stable across modules; what changes is the *overlay* -- the rules, settings, skills, hooks, and memory that turn a bare Claude Code session into a production-discipline setup.

Each module has both a `module-N-start` and a `module-N-final` tag. The start tag is where the exercise begins (typically the previous module's end state); the final tag is the canonical end state of that module.

## `module-1-start` and `module-1-final`

`module-1-start` is the demo app with four review-shaped bugs seeded into the source -- no overlay yet. `module-1-final` is the same demo plus the minimum useful overlay.

`module-1-final` layout:

```
demo-app/
+-- src/
|   +-- evaluate.ts       # feature-flag evaluator
|   +-- load-flags.ts     # JSON config loader
|   +-- index.ts          # tiny CLI: --user --flags
+-- tests/
|   +-- evaluate.test.ts
|   +-- load-flags.test.ts
+-- package.json
+-- package-lock.json
+-- tsconfig.json
+-- biome.json
+-- README.md             # demo install/run notes
+-- .claude/
    +-- CLAUDE.md         # one project file, four standing rules
    +-- settings.json     # model + effort + starter allowlist (11 entries)
    +-- skills/
        +-- review-changes/
            +-- SKILL.md  # "review the recent changes for bugs/perf/UX"
```

`LICENSE` and `.gitignore` are at the repo root and apply to everything including the demo.

`.claude/CLAUDE.md` is one flat file at this stage, holding four standing rules. The pattern of splitting into discipline-specific files lands in module 2 -- module 1 is about getting the loop closed: real session, real rules, real skill. The chapter-1 / chapter-2 Try-this exercises land you here.

`.claude/settings.json` pins `model: claude-opus-4-7` and `effortLevel: xhigh`. Permission allowlist is curated -- read-only tools (`Read`, `Glob`, `Grep`) and edit tools (`Edit`, `Write`) allowed unconditionally; the project's specific Bash subcommands (`npm test`, `npm run build`, `npm run lint:fix`, `git status`, `git diff`, `git log`) allowed; everything else still prompting.

`.claude/skills/review-changes/SKILL.md` is one skill. Description that fires on natural-language phrasings of "review what just changed". Body that lists what to look for and how to report.

The shape that proves you finished module 1: you start a session in this project, ask the agent to review your last commit, and the skill fires correctly -- catching at least three of the four seeded bugs.

## `module-2-start` and `module-2-final`

`module-2-start` is the same commit as `module-1-final`. `module-2-final` adds the expanding contract: rule layering, more skills, the start of memory.

Differences from module 1, all under `demo-app/.claude/`:

```
+-- CLAUDE.md         # short manifest plus @-includes; project-specific rule still inline
+-- rules/
|   +-- scope.md      # finish-what-was-asked discipline
|   +-- self-state.md # verify-before-claiming discipline
|   +-- terminal.md   # ASCII-output discipline
+-- settings.json     # tuned allowlist (21 entries; +10 from module 1)
+-- skills/
|   +-- review-changes/    # unchanged
|   +-- ship-ready/        # "audit a branch for shippability"
|   +-- status/            # "inspect mode/model/effort tier"
+-- memory/
    +-- MEMORY.md          # index of three entries
    +-- feedback_skill_description_voice.md
    +-- feedback_allowlist_tuning.md
    +-- project_demo_bugs.md
```

The big shift in module 2: `CLAUDE.md` is no longer a single flat file. It's a short manifest that pulls in three discipline-specific rule files via `@`-includes plus a project-specific section that stays inline. The discipline is enforced by the routing test -- when a new rule comes up, the question is which file it belongs in.

Two new skills land. `ship-ready` audits the current change against a checklist (golden path, error UI, loading, empty, destructive confirmations, hygiene). `status` is a one-shot lookup that reports model, effort, mode, and active overlay -- no inference, just a check.

The memory store gets its first entries. `MEMORY.md` is the index. Two `feedback_*.md` files capture lessons (skill descriptions are triggers, not docs; allowlists tighten in response to real prompts, not preemptively). One `project_*.md` captures the demo's intentional bugs.

The allowlist grows from 11 entries to 21 via a `fewer-permission-prompts` pass -- the additions are the commands real sessions actually surface as repeat prompts (`npx vitest`, `npx biome`, `git show`, `git branch`, `ls`, `pwd`, `cat`, etc.).

## `module-3-start` and `module-3-final`

`module-3-start` is the same commit as `module-2-final`. `module-3-final` adds reliability: hooks, subagents, long-running primitives.

Differences from module 2, all under `demo-app/.claude/`:

```
+-- CLAUDE.md         # manifest now @-includes 5 rule files
+-- rules/
|   +-- (existing 3 from module 2)
|   +-- subagents.md    # "trust but verify -- spot-check three before reporting done"
|   +-- capacity.md     # "capacity decisions belong to the user"
+-- settings.json       # adds hooks block; allowlist gains npm outdated/audit
+-- hooks/
|   +-- pre-commit-lint.sh   # PostToolUse(Edit|Write) -- runs lint:fix
|   +-- stop-notify.sh       # Stop event -- rings terminal bell
+-- skills/
|   +-- (existing 3 from module 2)
|   +-- weekly-deps-audit/   # /schedule target -- weekly background routine
+-- memory/                  # unchanged (still 3 entries)
```

A `.gitattributes` at the repo root also lands in module 3 -- pins text files to LF line endings, fixes a Windows-checkout biome failure that surfaced building this module.

Two hooks land. `pre-commit-lint.sh` fires on `PostToolUse(Edit|Write)` and runs the project's auto-formatter so the codebase stays consistently formatted. `stop-notify.sh` fires on `Stop` and rings the terminal bell so you notice when the session is idle.

Subagent invocation patterns get demonstrated. Module 3's exercise includes briefing a `Plan` agent for a refactor, an `Explore` agent for a search, and a `full-pass` agent for a module sweep -- with the verification spot-check applied to each result.

A `/loop` is wired for an in-session monitoring task with cache-window-aware delays. A `/schedule` is registered for a weekly dependency audit (the `weekly-deps-audit` skill is the target).

Two new rule files. `subagents.md` encodes the trust-but-verify discipline. `capacity.md` encodes the don't-second-guess-capacity-choices rule.

## `module-4-start` and `module-4-final`

`module-4-start` is the same commit as `module-3-final`. `module-4-final` reframes the overlay as a team contract.

Differences from module 3:

```
demo-app/
+-- .claude/
|   +-- CLAUDE.md         # six-line manifest -- every rule lives in rules/ now
|   +-- rules/            # 6 files, all team-shared
|   |   +-- (existing 5 from module 3)
|   |   +-- pre-commit-checklist.md   # promoted from inline-in-CLAUDE.md
|   +-- settings.json                # team-shared baseline (no content change)
|   +-- settings.local.json.example  # template for personal overrides
|   +-- (hooks/, skills/ unchanged from module 3)
|   +-- memory/
|       +-- MEMORY.md     # split section headers: shared + personal
|       +-- shared/       # the three module-2 entries moved here
|       +-- personal/     # gitignored, per-developer (no files shipped)
+-- .github/
|   +-- workflows/
|       +-- claude-review.yml   # PR-triggered agent review
|       +-- claude-format.yml   # nightly auto-fix on lint warnings
+-- CONTRIBUTING.md       # new-collaborator onboarding for the demo
```

The repo's `.gitignore` already excludes `.claude/settings.local.json` and `.claude/memory/personal/`, so the gitignored paths just work.

The big shift in module 4: every part of the overlay that was in `.claude/` gets re-evaluated with the question "is this safe to share with a team?" Things that pass: the model + effort pin, the baseline allowlist, the rules, the team-shared memories, the hooks and skills. Things that don't: secrets (never), personal preferences (split into `settings.local.json`), private memories (split into `memory/personal/`).

The pre-commit checklist is promoted from an inline section in `CLAUDE.md` to its own rule file. The team-contract version forbids `--no-verify` shortcuts and is explicit that `lint:fix` runs before tests, tests must pass, and the staged diff gets a senior-reviewer read.

CI integration lands. `claude-review.yml` is a workflow that fires on pull request, runs `/review` and `/security-review` against the diff, and posts findings as inline comments. `claude-format.yml` is a scheduled workflow that runs nightly, applies auto-fixes for lint warnings, and opens a PR for human review. Both use an `ANTHROPIC_API_KEY` repository secret.

`CONTRIBUTING.md` at the demo-app root is the new-teammate onboarding doc. It covers: what `.claude/` is, first-time setup, the shared-vs-personal split for settings and memory, the pre-commit checklist, how the CI workflows fire, where to file issues.

The book finishes with a setup that a team of three to five engineers can adopt without further configuration -- the floor is in place, the personal overrides are clearly delineated, the CI integration is doing the agent-side reviewing, and the overlay is something a new collaborator can ramp into in a single session.

## What changes between tags

The most useful study artifact is the diff. For each module's content, run:

```bash
git diff module-1-start module-1-final -- demo-app/
git diff module-2-start module-2-final -- demo-app/.claude/
git diff module-3-start module-3-final
git diff module-4-start module-4-final
```

Each diff is the shape of one chapter's exercise applied to a real codebase.
