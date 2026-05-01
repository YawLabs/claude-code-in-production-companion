---
name: status
description: Inspect Claude Code session state -- model, effort tier, mode, and active overlay. Use when the user types "/status", asks "what mode are you in?", "what model am I running?", "what effort tier?", "is the overlay active?", "is my CLAUDE.md loaded?", or wants to verify what configuration is loaded for this session. Reports verbatim observations, never inferred from skill names or surface signals.
---

# status

## What to report

In one short response, list:

- **Model.** The exact model id (e.g., `claude-opus-4-7`). Read from the actual session state -- never guess.
- **Effort tier.** The current effort level (e.g., `xhigh`, `max`).
- **Active overlay.** The path to the loaded `.claude/` directory. If a global `~/.claude/CLAUDE.md` is also active, mention it.
- **Mode.** Whether any wrapper or environment-level mode is in effect. Check environment variables (`YAW_MODE`, `CLAUDE_CONFIG_DIR`, ...) for signals.

## How to verify

Do not guess from skill names or built-in command names. Surface signals like which skills are loaded or which slash commands exist tell you nothing reliable about the runtime. Read the environment with concrete commands; report what you observe.

For environment vars on bash: `echo $YAW_MODE`. On PowerShell: `echo $env:YAW_MODE`. Pick the syntax that matches the shell your tool spawns.

## How to report

```
model:    <model id>
effort:   <effort tier>
overlay:  <path to active overlay, or "none">
mode:     <mode name, or "vanilla Claude Code">
```

If a value cannot be verified, say so explicitly:

```
model:    claude-opus-4-7
effort:   xhigh
overlay:  ./demo-app/.claude
mode:     cannot verify (YAW_MODE unset, CLAUDE_CONFIG_DIR unset)
```

## What not to do

- Do not infer state from skill names or command names. Those overlap across modes and Claude Code versions, and "I see skill X, so I must be in mode Y" is unreliable pattern-matching.
- Do not refuse to report state because verification is incomplete. Partial truth -- "model verified, mode unverified" -- is more useful than a refusal.
- Do not gate the user's task behind a status check. If asked to do work, do the work. Status is a separate concern.
