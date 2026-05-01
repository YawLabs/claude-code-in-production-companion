# @yawlabs/production-claude-code

Reference materials for the **Production Claude Code** course by Jefferson Hale.

This repo holds the canonical end-of-module checkpoints for the overlay you build during the course. Each module's final state is preserved as a git tag so you can clone the repo, check out the tag for whichever module you are working on, and compare it against your own work.

Companion course to *Claude Code in Production* (the book at `github.com/YawLabs/claude-code-in-production`). If the book is the discipline, this course is the worked example -- you build a real overlay across four modules, on a real codebase, and end with a setup that's ready to ship production software.

Course link: https://yaw.sh/courses/production-claude-code

Note: `main` is documentation only. The overlay and the demo app live at the module tags (`module-1-final` through `module-4-final`) -- check one out before the SETUP.md commands will work.

## What this repo is (and isn't)

This is a **reference**, not a substitute for the course.

The course teaches you to build a production-grade Claude Code overlay from scratch across four modules. You will write the rules yourself, write the skills yourself, configure the hooks yourself, hit your own failure modes, and figure out the fixes. That work is where the learning happens. This repo exists for two situations:

1. **You are stuck.** You have spent a real chunk of time on something and you cannot see why it does not behave the way the course described. Diff your overlay against the matching tag and you will probably spot the gap inside a minute.
2. **You finished the module and want to review.** Read the canonical end state. Notice what you did differently. Some of those differences are improvements over what I shipped here; others will be drift you want to clean up before the next module builds on top.

What this repo is not:

- **Not a copy-paste shortcut.** You can clone the module-1-final tag and skip ahead. You will then hit module 2 with no idea why each piece of the overlay is shaped the way it is, and the rest of the course will feel like maintaining someone else's tooling. Build the overlay yourself.
- **Not a polished open-source project.** The code here is shaped to teach the concepts the module is about, not to be the most elegant possible setup. There are deliberate simplifications. The course explains why.
- **Not a place to file Claude Code bugs.** Those go to Anthropic. Issues here are for problems with the reference materials themselves.

## Repo structure

The `main` branch holds this documentation and the tag definitions. The actual overlay (and the small demo codebase it sits on top of) lives at the tags below. `git checkout <tag>` to land on that module's final state.

```
main                            (docs, exercises, lectures, .gitattributes, LICENSE)
+-- module-{1..4}-start         (per-module exercise starting state)
+-- module-{1..4}-final         (per-module canonical end state)
    +-- module-1-final          (the minimum overlay -- one CLAUDE.md, one skill)
    +-- module-2-final          (the expanding contract -- rule-layering, two more skills, memory)
    +-- module-3-final          (reliability -- hooks, subagents, /loop and /schedule)
    +-- module-4-final          (team posture -- shared/personal split, CI integration)
```

The start and final tags bracket each module's exercise. `module-N-start` is the state you check out before doing module N's exercise; `module-N-final` is the canonical answer. `module-N-start` for N > 1 is the same commit as `module-(N-1)-final`.

### Tag contents at a glance

**`module-1-final`** -- the minimum useful overlay. One project `CLAUDE.md` with three or four standing rules, a `settings.json` that pins model and effort tier and includes a starter permission allowlist, and a single skill that does something concrete. Demonstrates the smallest setup that earns its keep.

**`module-2-final`** -- the rule-layering pattern from Chapter 2 of the book. The single CLAUDE.md gets split into a manifest plus discipline-specific rule files. Two more skills land (a ship-readiness audit and a status inspection), bringing the total to three. The memory store gets its first three entries with `MEMORY.md` as the index. The permission allowlist is tuned via a `fewer-permission-prompts` pass and grows from 11 to 21 entries.

**`module-3-final`** -- reliability and verification. Adds hooks (a pre-commit lint hook on `PostToolUse`, a `Stop`-event notifier). Introduces subagent invocation patterns -- briefing prompts that work, the trust-but-verify spot-check discipline. Adds a `/loop` for a recurring task and a `/schedule` for a true background routine. The trust-boundary discipline from Chapter 8 is the through-line.

**`module-4-final`** -- team posture. The project `CLAUDE.md` becomes a team contract; the `settings.json` gets pinned defaults; `settings.local.json` is documented as the personal-overrides location. A pre-commit checklist is encoded. CI integration patterns are demonstrated (agent-as-reviewer on PRs; agent-as-formatter for routine fixes). The course finishes with a setup that's safe for a team to share.

## How to use it

```bash
git clone https://github.com/YawLabs/production-claude-code
cd production-claude-code
git checkout module-2-final
```

From there, follow `SETUP.md` to wire it up to Claude Code, then diff against your own checkout in another window. The `git diff` between two adjacent tags is also a useful study artifact:

```bash
git diff module-1-final module-2-final
```

That diff is the shape of module 2.

## License

MIT. See `LICENSE`.

You are free to use, modify, and adapt this overlay. If you take the patterns and apply them to your own team's setup, that is the goal -- ship something good.

## Author

Jefferson Hale (Yaw Labs).

- Course: https://yaw.sh/courses/production-claude-code
- Book: https://github.com/YawLabs/claude-code-in-production
- Email: jeff@yaw.sh
- Issues: file them on this repo for problems with the reference materials.

If the course itself is the issue (a module is unclear, a video is broken, a script does not match the materials), email me directly and I will fix it.

## Repository layout

- `exercises/module-{1,2,3,4}/` -- exercise.md and solution.md per module
- `lectures/` -- module-N-*.md lecture scripts
- `recording/` -- production plans for the video sessions
- `ops/` -- operational guides (LemonSqueezy setup, fulfillment, etc.)
