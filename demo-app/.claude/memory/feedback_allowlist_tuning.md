---
name: Tighten allowlist after seeing prompts, not before
description: When tuning a project's permission allowlist, start narrow and add entries based on actual prompts seen during real sessions. Do not preemptively allowlist commands you have not yet needed.
type: feedback
---

The right allowlist is the one that exactly matches the work you do in this project -- nothing more, nothing less. The way to find that match is to start narrow (read tools unconditionally; specific Bash subcommands you know you use), run real sessions, and add entries when a particular prompt repeats.

**Why:** preemptive allowlisting is guessing. You either over-include (allowlist commands you never run, expanding the trust surface and inviting mistakes) or under-include (still get prompted on the commands you actually use, which is what you were trying to avoid). Both are worse than the small upfront cost of being prompted once for a new command and then deciding whether to allowlist it.

**How to apply:** ship the initial allowlist with read tools (`Read`, `Glob`, `Grep`) unconditional, plus the project's main test/build/lint Bash subcommands. Run sessions normally. Each time a prompt fires for a command that is genuinely benign and routine, add it -- ideally via a `fewer-permission-prompts` skill that batches the additions. State-mutating commands (`git push`, `rm`, `npm install`, network calls) stay un-allowlisted by default; the deliberate "yes" is the safety check.
