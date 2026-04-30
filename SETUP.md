# Setup

How to get the reference repo running locally and wired up to Claude Code.

## Prerequisites

* **Claude Code installed.** The course assumes a working Claude Code installation. If you are on the Anthropic-managed CLI, you are good. If you are on a custom build, the rule and skill paths in the reference may sit in a slightly different place; the SETUP notes per module call out the differences.
* **Node.js 20 or later.** The demo app is a small TypeScript project; the build assumes a modern Node.
* **Git.** You will be checking out tags and producing diffs.
* **A terminal you trust to run agentic sessions.** If your terminal mangles Unicode (Windows ConPTY is the most common offender), Chapter 10 of the book covers the ASCII-discipline workaround. The course examples already use ASCII-safe output everywhere terminal output appears.

## Clone and check out a module

```bash
git clone https://github.com/YawLabs/production-claude-code
cd production-claude-code
git checkout module-1-final
```

You are now sitting on the final state of module 1. The `main` branch holds documentation only; the actual content lives at the tags.

## Install the demo app

```bash
npm install
npm run build
npm test
```

If those three commands all succeed, the demo app is good. The course modules will exercise this app -- you'll ask Claude Code to fix bugs in it, refactor pieces of it, and review your changes.

## Wire up Claude Code

The repo's `.claude/` directory contains the overlay for this checkout. Claude Code will pick it up automatically when you start a session in this directory. You should see, on session start, that the project's `CLAUDE.md` is loaded and the project's `settings.json` model and effort tier are in effect.

To verify, in a Claude Code session, run:

```
/yaw-status
```

(Module 2 onwards has a `status` skill that reports mode, model, effort, active overlay. Module 1 doesn't have it yet; check by inspecting the model field in the harness UI.)

## Personal overrides

After module 4, the overlay distinguishes between team-shared (`settings.json`) and personal (`settings.local.json`) configuration. The repo includes a `settings.local.json.example` at the module-4 tag; copy it to `settings.local.json` and fill in any per-developer credentials or preferences. The `.gitignore` already excludes `settings.local.json` from version control.

For modules 1-3, all configuration is in `settings.json` because the course hasn't reached the team-posture material yet.

## MCP servers

If a module requires a specific MCP server (modules 3 and 4 do, for the dependency audit and the cost-monitoring patterns), the README at that tag will document which one and how to configure it. You bring your own credentials for any third-party services -- the course never asks you to share keys with the reference materials.

## Diffing your work against the reference

The most useful study pattern: open the reference checkout in one terminal, your own work in another, and run:

```bash
diff -ru /path/to/your-overlay/.claude /path/to/reference/.claude
```

Or, if your work is in git, compare commit ranges:

```bash
cd /path/to/your-work
git log --oneline module-2-start..HEAD -- .claude/
```

The differences are usually informative. Some are improvements over what I shipped here; some are drift you'll want to clean up before module 3 builds on top.

## Common setup issues

See `TROUBLESHOOTING.md` for the issues that come up most often. The short list:

* Claude Code can't find the `.claude/` directory -- you started the session in the wrong working directory.
* The model field in `settings.json` doesn't match what you're running -- your harness has a global override that's winning.
* A skill isn't firing -- the description doesn't match the natural-language phrasings the course expects you to use.
* A hook isn't firing -- it's registered but hitting the typo or matcher mismatch covered in TROUBLESHOOTING.

## Getting help

If you're stuck after reading TROUBLESHOOTING and diffing against the reference, check the course Discord. If the issue is with the reference materials themselves, file an issue on this repo. If the course content is unclear, email me directly: jeff@yaw.sh.
