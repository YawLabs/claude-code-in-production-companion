# Troubleshooting

Common issues that come up while working through the course, in roughly the order you'll hit them.

## "Claude Code doesn't seem to be loading the project's CLAUDE.md"

You started the session in the wrong directory. Claude Code reads `CLAUDE.md` (or `.claude/CLAUDE.md`, depending on your harness version) from the working directory the session was launched in. If you launched from `/home/you` and the project is in `/home/you/production-claude-code`, the project file isn't loaded.

Fix: `cd` into the project directory and start the session there. Verify by asking Claude Code "what rules are loaded for this project" -- if the project rules aren't visible, the working directory is wrong.

## "The model and effort tier in settings.json aren't taking effect"

Two possible causes:

1. **Your global `~/.claude/settings.json` has the same fields and is winning.** Some harness versions resolve configuration in a way that lets the global file override the project file. Check your global settings. If it has a `model` or `effortLevel` field that conflicts, decide whether you want the global or project value -- and remove the loser.
2. **You're on a wrapper or overlay (Yaw Mode, etc.) that injects its own model/effort.** The wrapper's setting may take precedence. Check for environment variables (`CLAUDE_CONFIG_DIR`, `YAW_MODE`, etc.) that point at a different config directory.

To check which model and effort are actually in effect, in a Claude Code session, ask: "what model are you running on, and what effort tier?" The agent has a way to introspect this; the answer is authoritative.

## "A skill I wrote isn't firing"

Three common causes, in order of how often each is the actual problem:

1. **The description doesn't match how you actually phrase the work.** This is the most common case. Re-read the description aloud. Is the language the language you'd use to describe the task? If not, rewrite it in your natural phrasing. (Chapter 4 of the book covers this in depth.)
2. **The skill isn't in the right directory.** Skills live in `~/.claude/skills/<name>/SKILL.md` for global skills, or `.claude/skills/<name>/SKILL.md` for project-scoped skills. The directory name and the `name` field in the frontmatter should match.
3. **The skill has a syntax error in the frontmatter.** Run a YAML linter on the frontmatter, or just read it carefully -- a missing `---` line, an unquoted colon, a tab where there should be a space.

Test by invoking the skill explicitly with `/skill-name`. If the explicit invocation works, the skill itself is fine -- the description is what's failing.

## "A hook isn't firing"

Five-question debugging loop:

1. **Is the hook registered?** Check `settings.json` for the `hooks` block. Look for typos in the event name, the matcher, the command path.
2. **Is the hook being invoked?** Wrap the hook command in a logging wrapper that writes to a trace file. Run a session that should trigger the hook. Check the trace.
3. **Is the matcher matching?** Print the event payload to your trace log and confirm the matcher fits.
4. **Is the exit code doing what you think?** A `PreToolUse` hook returns 0 to allow, non-zero to block. Check.
5. **Is the hook fast enough?** Hooks have timeouts. A slow hook (anything over a few seconds) gets killed.

The five-question loop catches the overwhelming majority of "didn't fire" cases.

## "The agent ran my hook and broke the session"

A hook that returns the wrong exit code, hangs, or produces unexpected stdout can wedge a session. Symptoms: tool calls fail with a generic error, the session goes silent, or every tool call is mysteriously blocked.

Recovery:

1. Disable the hook (comment it out in `settings.json` or move it aside).
2. Restart the session.
3. Confirm the session works without the hook.
4. Re-enable the hook with the trace wrapper from above and reproduce.

The trace will tell you exactly what went wrong.

## "Subagent reports look fine but my code is broken"

Read Chapter 5 of the book. The subagent's report describes what it intended to do, not what it did. The fix is the spot-check: pick three claims from the report at random and verify them by hand. If the spot-check passes, the rest is probably fine. If it fails, treat the report as suspect.

This is *the* most-common shape of subagent failure, and the only way to catch it reliably is the spot-check discipline.

## "I'm getting throttled / rate-limited"

The `Server is temporarily limiting requests` error means Anthropic is server-side throttling your account on the current model tier. Drop a tier (Opus 4.7 -> Opus 4.6, or Opus -> Sonnet) for the duration of the throttle.

If your harness has a wrapper terminal that detects throttles, it may handle this automatically. If not, the manual steps:

```
/model claude-opus-4-6
/fast
```

Set yourself a reminder for thirty minutes from now to check whether the throttle has cleared. If it has, switch back. If not, keep working on the lower tier.

Chapter 9 of the book covers the recovery flow in detail.

## "My memory entries aren't being recalled"

Two possible causes:

1. **The index entry is too generic.** The agent decides whether to fetch a memory body based on the index entry's match against the current conversation. An entry like "Notes on database access" is generic; an entry like "Skip @yawlabs/foo-mcp -- here's the test" is specific and will fire when the test phrase comes up.
2. **The body falls out of context after fetch.** A memory you wrote earlier in the session has a body that's no longer in active context; only the index entry is. If the topic resurfaces, re-read the file -- don't trust "I remember what I wrote" (Chapter 6 covers this).

## "The course module exercises don't match the reference at the tag"

If you're following a module's exercise document and the result doesn't match the reference at `module-N-final`, two possibilities:

1. **You diverged in module N-1.** Your starting point isn't what the exercise expected. Diff your current state against `module-(N-1)-final` and reconcile.
2. **The course materials drifted from the reference.** Less likely but possible if the reference has been updated. File an issue on this repo with what you expected vs what you got.

## "Claude Code thinks today is the wrong date"

The agent's training cutoff is in the past. If today's date matters (you're cutting a release, you're checking a deadline), the agent may default to the cutoff date instead of today's date.

Fix: a `UserPromptSubmit` hook that injects today's date at the start of every prompt. The course's module 3 covers the pattern. The short version:

```bash
#!/usr/bin/env bash
# .claude/hooks/inject-date.sh
echo "[Today's date is $(date +%Y-%m-%d).]"
```

Register on the `UserPromptSubmit` event. The agent now sees today's date on every turn.

## Anything else

If you're stuck on something that isn't covered here, the course Discord is the place. If you find an issue with the reference materials themselves, file it on this repo.
