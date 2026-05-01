# Module 3 -- Reliability and Verification

[OPEN: title card; cut to desk]

Welcome to module 3.

In module 1 you closed the loop -- a real session, a real overlay, a real demo. In module 2 you expanded the loop -- rule layering, two more skills, memory, allowlist tuning.

Module 3 is about making the loop *reliable*.

You have hooks now -- code that runs automatically on session events, without your explicit invocation. You have subagents -- agents you dispatch for specific work, whose reports you have to verify because they describe intent, not execution. You have `/loop` for in-session monitoring and `/schedule` for true background routines. The agent starts to do work when you are not looking.

That is the shift. Modules 1 and 2 kept you in every loop. Module 3 lets you step out.

[BEAT]

## Two new rules

[CAPTURE: rules/subagents.md and rules/capacity.md]

Two rule files land in module 3 because the disciplines they encode are easy to forget under pressure.

`subagents.md` -- trust-but-verify. When you dispatch a subagent and it returns a digest, that digest describes what the agent *intended* to do. Not what it did. The agent reports its own work; "all findings verified" inside the report is not a verification. The rule says: pick three claims at random, open the file, run the test, check the diff. If the spot-check passes, the rest is probably fine. If any claim fails, treat the report as suspect.

This is the most-violated discipline when working with subagents. Without it written down, you slide into accepting reports at face value because they sound confident. With it, you actively spot-check, which catches the cases the agent confused its own intent for execution.

`capacity.md` -- capacity decisions belong to the user. After an Anthropic-side throttle fires, the harness or the user typically drops to a sub-flagship tier. The agent's instinct (per "default to flagship") is to suggest switching back. The capacity rule overrides: the user picked the lower tier for a reason. Do not second-guess.

[SEGMENT BREAK]

## Hooks -- two shapes

[CAPTURE: hooks/pre-commit-lint.sh, then hooks/stop-notify.sh]

Hooks are shell commands that fire on session events. Two shapes land in module 3:

`pre-commit-lint.sh` fires on `PostToolUse` with the matcher `Edit|Write`. Every Edit or Write the agent makes runs through `npm run lint:fix` so the codebase stays consistently formatted regardless of which agent touches what. The hook swallows failures (`|| true`, `set +e`) -- it is a convenience, not a gate. A failing biome run should not break tool calls.

`stop-notify.sh` fires on `Stop` -- when the session finishes a response and is waiting for input. The hook rings the terminal bell and writes a marker to stderr. Cross-platform (works on macOS, Linux, Windows Git Bash).

[CAPTURE: settings.json hooks block]

Both are registered in `settings.json` under a `hooks` block. PostToolUse hooks need a matcher (a regex against the tool name). Stop hooks do not -- there is no tool name to match.

[BEAT]

## The +x bit -- the platform footgun

[CAPTURE: git ls-tree showing 100644 vs 100755]

On Windows git's default config, `chmod +x` does not propagate to the git index because `core.fileMode` is off. You commit files as `100644` (non-executable) and Linux/Mac course-takers get scripts that fail to run silently.

The fix is `git update-index --chmod=+x <files>`. This sets the executable mode in the index regardless of which platform you are on.

I tripped on this myself building this very module. The first commit captured the hooks as `100644`. Verification (`git ls-tree`) caught it; a quick `update-index --chmod=+x` and a follow-up commit fixed it.

The lesson: when you commit shell scripts, verify the +x bit. `git ls-tree HEAD -- <path>` shows the mode.

## Subagent invocation practice

[CAPTURE: dispatching an Explore agent, then a Plan agent, then a full-pass agent]

Three subagent shapes you will use most often:

`Explore` for "find me X across the codebase" -- pattern-match-shaped questions. "Where is rule-matching defined?", "Which files import from node:crypto?", "What is the shape of our test files?". The agent reads excerpts; you get a digest of where things live.

`Plan` for "design a refactor" -- step-by-step-design-shaped questions. "What is the plan for extracting matchesRule into its own file?", "How should we restructure the test suite?". The agent thinks through the steps; you get a plan to review.

`full-pass` for "sweep this module" -- end-to-end-review-shaped questions. "Read every file in src/ and tell me what is fragile." The agent reads the whole module; you get a digest grouped by solid / fragile / worth-fixing-now / file-for-later.

Each returns a report. The discipline is the same -- pick three claims at random, verify by hand. The exercise has you dispatch all three at least once because the spot-check needs to become muscle memory, not a thing you remember to do.

[SEGMENT BREAK]

## /loop and /schedule

[CAPTURE: terminal showing /loop 5m /weekly-deps-audit]

`/loop` is for in-session repeated work. "Check the build every 5 minutes during this debug session." The agent fires the same task on a fixed interval until you stop it.

`/schedule` is for true background routines. The agent is not in your session at all -- a remote runner fires the task on a cron schedule. The classic example is a weekly dependency audit -- catches drift before the work week starts.

The `weekly-deps-audit` skill is the target of module 3's `/schedule` example. It runs `npm outdated --json` and `npm audit --json`, groups findings (security advisories first, then major drift, then patch/minor), and reports without auto-upgrading. The audit reports; the user upgrades.

[BEAT]

A note on `/loop` cadence. Claude's prompt cache TTL is five minutes. A `/loop` interval under 5 minutes keeps the cache warm; an interval over pays a cache-miss cost per iteration. Default to 270 seconds (just under the TTL) for active monitoring, or 1200+ seconds (commit to the cache miss) for idle checks. Anything in between -- five-minute round numbers -- is the worst-of-both: you pay the cache miss without amortizing it.

## What you build, what you skip

Things to build in module 3:

- Two rule files (`subagents.md`, `capacity.md`).
- Two hooks (`pre-commit-lint.sh`, `stop-notify.sh`), both executable, both registered.
- One skill (`weekly-deps-audit`).
- Hands-on practice with `Explore`, `Plan`, `full-pass` -- with the trust-but-verify spot-check applied each time.
- A `/loop` configured for an in-session monitoring task.
- A `/schedule` registered for the deps audit.

Things to skip in module 3:

- Team-shared layer. Module 4.
- CI integration. Module 4.
- The `settings.local.json` split for personal overrides. Module 4.
- A pre-commit checklist as a hook. Module 4.

The temptation in module 3 is to start codifying every CI workflow you wish you had. Resist it. Module 4 is the right place for cross-cutting team concerns.

## The loop you should be able to close

By the end of module 3:

1. Make a small edit to a `.ts` file. The `pre-commit-lint` hook fires and lint:fix runs without your intervention.
2. End a session. The `stop-notify` hook fires and you hear the bell.
3. Dispatch a subagent for real work. Apply the spot-check discipline -- pick three claims, verify them. The discipline is visible to you in the moment.
4. The deps audit skill produces a structured report without auto-upgrading anything.

## What module 4 builds on top

[CAPTURE: STRUCTURE.md showing module-4-final layout]

Module 4 is team posture. The `CLAUDE.md` becomes a team contract; the `settings.json` gets pinned defaults that survive the team; `settings.local.json` carries personal overrides outside version control. A pre-commit checklist is encoded as discipline. CI integration lands -- a workflow that runs `/review` and `/security-review` on pull requests, another that runs nightly auto-fixes. `CONTRIBUTING.md` becomes the new-teammate onboarding doc.

Module 4 is where the overlay stops being yours and starts being the team's.

## Wrap

The exercise for module 3 is in `exercises/module-3/exercise.md`. Check out `module-3-start`, build the additions, run real subagent practice, and verify the loop above. The canonical answer is at `module-3-final` and `solution.md` walks the reasoning.

Hooks. Subagents. Loop. Schedule. The loop runs unattended. That is module 3.

Module 4, next.
