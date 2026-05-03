# Module 3 -- Reliability and Verification

[module-3] companion exercise. Pairs with chapters 5, 7, and 8 of *Claude Code in Production*.

## Goal

Add the reliability primitives to your overlay. By the end you will have:

- Two more rule files (`subagents.md`, `capacity.md`) -- five total in the manifest
- Two hooks: `pre-commit-lint.sh` (PostToolUse(Edit|Write)) and `stop-notify.sh` (Stop)
- One more skill: `weekly-deps-audit` -- target of a `/schedule` for a recurring background routine
- Hands-on practice with subagent invocation patterns and the trust-but-verify spot-check
- A `/loop` configured for an in-session monitoring task and a `/schedule` registered for the deps audit

This is the module where the loop runs unattended.

## Starting state

```bash
git checkout module-3-start
cd demo-app
npm install
npm test
```

Tests pass. You have the module-2 overlay in place: rule-layered `CLAUDE.md`, three skills, memory store, tuned allowlist.

## Build

### Two new rule files

Add `demo-app/.claude/rules/subagents.md` -- the trust-but-verify discipline. When a subagent (Plan, Explore, full-pass, general-purpose) reports a finding, pick three claims at random and verify them by hand. Treat the report as suspect if any spot-check fails.

Add `demo-app/.claude/rules/capacity.md` -- capacity decisions belong to the user. After a throttle-driven tier drop, do not unilaterally suggest switching back to flagship.

Update `CLAUDE.md` to `@`-include both new rules.

### Two hooks

Add `demo-app/.claude/hooks/pre-commit-lint.sh`. Fires on `PostToolUse(Edit|Write)`. Runs `npm run lint:fix` on the demo so the codebase stays formatted as the agent edits files. Failures swallowed -- this is a convenience, not a gate.

Add `demo-app/.claude/hooks/stop-notify.sh`. Fires on `Stop`. Rings the terminal bell so you notice when the session is idle.

Make both scripts executable. On Linux/Mac: `chmod +x demo-app/.claude/hooks/*.sh`. On Windows git, also: `git update-index --chmod=+x demo-app/.claude/hooks/*.sh` so the +x bit is captured in the index.

Register both in `settings.json` under a `hooks` block. PostToolUse needs a matcher (`Edit|Write`); Stop does not.

### Weekly deps audit skill

Add `demo-app/.claude/skills/weekly-deps-audit/SKILL.md`. The skill runs `npm outdated --json` and `npm audit --json`, groups findings (security / major drift / patch-minor drift), and reports without auto-upgrading.

Add `Bash(npm outdated:*)` and `Bash(npm audit:*)` to your allowlist (both read-only). Do NOT add `npm install` or `npm update`.

### Subagent invocation practice

Run three real subagent invocations on the demo:

1. Dispatch an `Explore` agent to find every `.ts` file that imports from `node:crypto`. Spot-check three of its findings by hand.
2. Dispatch a `Plan` agent to design a refactor that extracts the rule-matching logic from `evaluate.ts` into its own file. Read the plan carefully; spot-check claims about callers and invariants.
3. Dispatch a `full-pass` agent on the demo's `src/` directory. Read its digest; verify three of its findings by opening the cited files.

This is the practice your `subagents.md` rule is for.

### `/loop` and `/schedule`

Wire a `/loop` for an in-session monitoring task (your choice -- e.g., `/loop 5m /weekly-deps-audit` to check deps every five minutes during a long session). Note the cache-window-aware delay guidance in the loop skill.

Register the deps audit as a `/schedule`: `/schedule "weekly on Monday at 9am" weekly-deps-audit`.

## Done when

1. `CLAUDE.md` has 5 `@`-includes. The two new rule files are pulled in correctly.
2. Make a small edit to a `.ts` file. The pre-commit-lint hook fires and lint:fix runs.
3. End a session. The stop-notify hook fires and you hear the bell.
4. Run a subagent task and apply the trust-but-verify spot-check. The discipline is visible to you in the moment.
5. The deps audit skill produces a structured report without auto-upgrading anything.

## If you get stuck

```bash
git diff module-3-start module-3-final -- demo-app/.claude/
```

That is the canonical answer. Read `solution.md` for the walk-through.
