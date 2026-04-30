# Structure

What lives at each tag. Use this as a map when diffing your own work against the reference.

The course builds a Claude Code overlay on top of a small TypeScript codebase. The codebase itself stays nearly stable across modules; what changes is the *overlay* -- the rules, settings, skills, hooks, and memory that turn a bare Claude Code session into a production-discipline setup.

## `module-1-final`

The minimum useful overlay. One developer, one project, day-one shape.

```
demo-app/
+-- src/
|   +-- index.ts          # the demo app -- a small TypeScript thing to run sessions on
+-- package.json
+-- tsconfig.json
+-- README.md             # how to install and what the app does
+-- .claude/
|   +-- CLAUDE.md         # one project file, four standing rules
|   +-- settings.json     # model + effort + starter allowlist
|   +-- skills/
|       +-- review-changes/
|           +-- SKILL.md  # "review the recent changes for bugs/perf/UX"
+-- LICENSE
+-- .gitignore
```

`.claude/CLAUDE.md` is one file at this stage, holding three or four standing rules that apply to this project. The pattern of splitting into discipline-specific files lands in module 2 -- module 1 is about getting the loop closed: real session, real rules, real skill.

`.claude/settings.json` pins `model: claude-opus-4-7` and `effortLevel: xhigh`. Permission allowlist is curated -- read-only tools allowed unconditionally, the project's specific Bash subcommands (`npm test`, `npx tsc`, `git status`, `git diff`) allowed, everything else still prompting.

`.claude/skills/review-changes/SKILL.md` is one skill. Description that fires on natural-language phrasings of "review what just changed." Body that lists what to look for and how to report.

The shape that proves you finished module 1: you can start a session in this project, ask the agent to review your last commit, and the skill fires correctly.

## `module-2-final`

The expanding contract. The rule-layering pattern, more skills, the start of memory.

```
demo-app/
+-- src/                  # unchanged from module 1
+-- package.json          # unchanged
+-- .claude/
|   +-- CLAUDE.md         # short manifest plus @-includes
|   +-- rules/
|   |   +-- scope.md      # scope discipline rules
|   |   +-- self-state.md # verify-before-claiming rule
|   |   +-- terminal.md   # ASCII-output discipline
|   +-- settings.json     # tuned allowlist after fewer-permission-prompts pass
|   +-- skills/
|   |   +-- review-changes/
|   |   +-- ship-ready/   # "audit a branch for shippability"
|   |   +-- status/       # "inspect mode/model/effort tier"
|   +-- memory/
|       +-- MEMORY.md     # index, currently three entries
|       +-- feedback_*.md # two memories from real lessons in module 2
|       +-- project_*.md  # one project memory
+-- LICENSE
+-- .gitignore
```

The big shift in module 2: `CLAUDE.md` is no longer a single flat file. It's a short manifest that includes three discipline-specific rule files. The discipline is enforced by the routing test -- when a new rule is suggested, the question is which file it belongs in.

Two new skills land. `ship-ready` audits the current change against a checklist (golden path, error UI, loading, empty, destructive confirmations, hygiene). `status` is a one-shot lookup that reports model, effort, mode, and active overlay -- no inference, just a check.

The memory store gets its first entries. `MEMORY.md` is the index. Two `feedback_*.md` files capture lessons that came up during module 2's exercises. One `project_*.md` captures a time-bound fact about the demo app.

The allowlist gets a `fewer-permission-prompts` pass and grows by 8-12 entries -- the exact ones depending on what you reached for during the module's work.

## `module-3-final`

Reliability and verification. Hooks land. Subagents become first-class. Long-running and recurring work primitives are wired up.

```
demo-app/
+-- src/                  # unchanged
+-- .claude/
|   +-- CLAUDE.md         # manifest now includes 5 rule files
|   +-- rules/
|   |   +-- scope.md
|   |   +-- self-state.md
|   |   +-- terminal.md
|   |   +-- subagents.md  # "trust but verify -- spot-check three before reporting done"
|   |   +-- capacity.md   # "capacity decisions belong to the user"
|   +-- settings.json     # adds a hooks block
|   +-- hooks/
|   |   +-- pre-commit-lint.sh
|   |   +-- stop-notify.sh
|   +-- skills/
|   |   +-- review-changes/
|   |   +-- ship-ready/
|   |   +-- status/
|   |   +-- weekly-deps-audit/   # /schedule target -- a weekly background routine
|   +-- memory/
|       +-- MEMORY.md     # 6 entries now
|       +-- ...
+-- LICENSE
+-- .gitignore
```

Two hooks land. `pre-commit-lint.sh` fires on `PostToolUse(Edit|Write)` and runs the project's auto-formatter. `stop-notify.sh` fires on `Stop` and pings the desktop so you know the session needs your attention.

Subagent invocation patterns get demonstrated. Module 3 includes recorded examples of briefing a `Plan` agent for a refactor, an `Explore` agent for a search, and a `full-pass` agent for a module sweep -- with the verification spot-check applied to each result.

A `/loop` is wired for an in-session monitoring task with cache-window-aware delays. A `/schedule` is registered for a weekly dependency audit (the `weekly-deps-audit` skill is the target).

Two new rule files land. `subagents.md` encodes the trust-but-verify discipline. `capacity.md` encodes the don't-second-guess-capacity-choices rule.

## `module-4-final`

Team posture. The overlay is now safe to share with collaborators and integrate with CI.

```
demo-app/
+-- src/                  # unchanged
+-- .claude/
|   +-- CLAUDE.md         # team-shared rules; shorter than module 3 because some moved out
|   +-- rules/            # 5 files, all team-shared
|   +-- settings.json     # team-shared: pinned model, effort, MCP servers, baseline allowlist
|   +-- settings.local.json.example  # template for personal overrides (gitignored)
|   +-- hooks/
|   +-- skills/
|   +-- memory/
|       +-- MEMORY.md     # split: shared/ and personal/ subdirectories
|       +-- shared/       # checked into the repo, useful to the whole team
|       +-- personal/     # gitignored, per-developer
+-- .github/
|   +-- workflows/
|       +-- claude-review.yml  # PR-triggered agent review
|       +-- claude-format.yml  # nightly auto-fix on lint warnings
+-- CONTRIBUTING.md       # how new collaborators set up Claude Code on this repo
+-- LICENSE
+-- .gitignore            # excludes settings.local.json + memory/personal/
```

The big shift in module 4: every part of the overlay that was in `.claude/` gets re-evaluated with the question "is this safe to share with a team?" Things that pass: the model + effort pin, the MCP server registry, the baseline allowlist, the rules, the team-shared memories. Things that don't: secrets (never), personal preferences (split into `settings.local.json`), private memories (split into `memory/personal/`).

A pre-commit checklist is encoded as a rule. The agent runs lint:fix, runs tests, confirms zero failures, and refuses to commit if any of those don't pass.

CI integration lands. `claude-review.yml` is a workflow that fires on pull request, runs a `/review` and `/security-review`, and posts the findings as PR comments. `claude-format.yml` is a scheduled workflow that runs nightly, applies auto-fixes for lint warnings, and opens a PR for human review.

`CONTRIBUTING.md` is the new-teammate onboarding doc. It covers: how to set up Claude Code, where to put credentials (`settings.local.json`), how the team's pre-commit checklist works, where to file friction with the overlay so it can be improved.

The course finishes with a setup that a team of three to five engineers can adopt without further configuration -- the floor is in place, the personal overrides are clearly delineated, the CI integration is doing the agent-side reviewing, and the overlay is something a new collaborator can ramp into in a single session.

## What changes between tags

The most useful study artifact is the diff. For each module's content, run:

```bash
git diff module-1-final module-2-final -- .claude/
git diff module-2-final module-3-final -- .claude/ .github/
git diff module-3-final module-4-final
```

Each diff shows the shape of one module's lessons applied to a real codebase.
