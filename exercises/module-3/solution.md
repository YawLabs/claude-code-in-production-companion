# Module 3 -- Solution walk-through

[module-3] companion solution. Pairs with chapters 5, 7, and 8 of *Claude Code in Production*.

One canonical answer for module 3. The canonical content lives at `module-3-final`; this doc is the *reasoning*.

## subagents.md and capacity.md

Two rule files added because the disciplines they encode lose meaning if you only learn them once.

`subagents.md` -- trust-but-verify. Subagent reports describe what the agent intended to do, not what it actually did. Confirmation bias is real, even for agents -- "all findings verified" inside a report is not a verification. The discipline says: pick three claims at random, verify by hand. If they pass, the rest is probably fine. If any fails, the entire report is suspect.

This is the most-violated discipline when working with subagents. Without the rule explicitly written down, you slide into accepting reports at face value because they sound confident. With the rule, you actively spot-check, which catches the cases where the agent confused its own intent for execution.

`capacity.md` -- capacity decisions belong to the user. After a throttle, the harness or the user typically drops to a sub-flagship tier. The agent's instinct (per the "default to flagship" rule from module 1) is to suggest switching back. The capacity rule overrides: the user picked the lower tier for a reason; do not second-guess.

This rule exists because the prior version of the agent kept volunteering "you should switch back to 4.7" during throttles. Annoying and wrong.

## The two hooks

`pre-commit-lint.sh` on `PostToolUse(Edit|Write)`:

```bash
#!/usr/bin/env bash
set +e
DEMO_APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [ -f "$DEMO_APP_DIR/package.json" ] && [ -d "$DEMO_APP_DIR/node_modules/@biomejs/biome" ]; then
  cd "$DEMO_APP_DIR" && npm run lint:fix --silent >/dev/null 2>&1 || true
fi
exit 0
```

Why: every Edit/Write the agent makes runs through biome's formatter. The codebase stays consistently formatted regardless of which agent touches what. Failures are swallowed (`|| true`, `set +e`) -- this is a convenience, not a gate. A failing biome run should not break tool calls.

The `if` guard handles fresh checkouts where node_modules does not exist yet.

`stop-notify.sh` on `Stop`:

```bash
#!/usr/bin/env bash
tput bel 2>/dev/null || printf '\a'
echo "[claude code session idle]" >&2
exit 0
```

Why: when the session finishes a response and is waiting for input, you might be in another window. The bell + stderr marker tells you to come back. Cross-platform (works on macOS, Linux, Windows Git Bash).

The two hooks together are the two shapes of hook a real overlay typically wants: one for in-session cleanup (PostToolUse), one for cross-tool notification (Stop).

## The +x bit issue

On Windows git's default config, `chmod +x` does not propagate to the git index because `core.fileMode` is off. You commit files as `100644` (non-executable) and Linux/Mac readers get scripts that fail to run.

Fix: `git update-index --chmod=+x <files>`. This sets the mode in the index regardless of platform.

The canonical answer at `module-3-final` has both hooks committed as `100755`.

## weekly-deps-audit

The skill exists to be a `/schedule` target. Most skills are reactive -- they fire when the user says something. `weekly-deps-audit` is proactive -- it runs on a cron schedule, scans for outdated deps and security advisories, and reports.

The body has three groupings (security advisories first, then major drift, then patch/minor) because the priority differs:

- Security advisories require attention now.
- Major drift is intentional upgrade work, not routine.
- Patch/minor drift is safe to bump in batch.

The "what not to do" line is "do not run `npm install` or `npm update` automatically." Without that, the skill would helpfully upgrade everything and break things. Audit reports; the user upgrades.

The allowlist additions (`Bash(npm outdated:*)`, `Bash(npm audit:*)`) cover the read-only commands the skill needs. `npm install` and `npm update` stay un-allowlisted -- they require deliberate confirmation.

## Subagent practice

The exercise's three subagent invocations cover the three shapes you will use most often:

- `Explore` for "find me X across the codebase" -- pattern-match-shaped questions.
- `Plan` for "design a refactor" -- step-by-step-design-shaped questions.
- `full-pass` for "sweep this module for issues" -- end-to-end-review-shaped questions.

Each one returns a digest. The discipline is the same: pick three claims, verify them. The exercise asks you to do this three times so the spot-check becomes muscle memory, not a thing you need to remember to do.

## /loop and /schedule

`/loop` is for in-session repeated work -- "check the build every 5 minutes during this debug session." `/schedule` is for true background routines -- the deps audit runs even when you are not in a session.

The cache-window-aware delay guidance: Claude's prompt cache TTL is 5 minutes. A `/loop` interval under 5 minutes keeps the cache warm; an interval over 5 minutes pays a cache-miss cost on each iteration. Default to 270 seconds (just under the TTL) for active monitoring, or 1200+ seconds (committing to the cache miss) for idle checks.

`/schedule` cadence depends on the work. Weekly on Monday at 9am for the deps audit catches drift before the work week starts. Daily for fast-moving deps; monthly for stable ones.

## Verifying

```bash
git diff module-3-start module-3-final -- demo-app/.claude/
```

Compare against your work. Differences you should expect:

- Different rule wording -- the disciplines are durable; the prose can vary.
- Different hook implementations -- the canonical hooks above are the simplest shape; you may have added trace logging or platform-specific notification logic.
- Different cron expressions on the `/schedule` -- pick what suits your workflow.

If the hooks fire on the right events, the spot-check catches a subagent report you would have otherwise trusted, and the deps audit produces a useful report, the overlay works. Move on to module 4.
