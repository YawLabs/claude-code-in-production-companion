# @yawlabs/claude-code-in-production-companion

Paid companion repo for the book *Claude Code in Production* by Yaw Labs.

This repo holds canonical end-of-chapter checkpoints for the overlay the book builds across chapters 2-11. Each checkpoint is preserved as a git tag so you can clone the repo, check out the tag matching the chapter you are reading, and compare it against your own work.

Book link: https://yaw.sh/claude-code-in-production

Note: `main` is documentation only. The overlay and the demo app live at the module tags (`module-1-final` through `module-4-final`) -- check one out before the SETUP.md commands will work.

## What this repo is (and isn't)

This is a **reference**, not a substitute for the book.

The book teaches you to build a production-grade Claude Code overlay from scratch. You will write the rules yourself, write the skills yourself, configure the hooks yourself, hit your own failure modes, and figure out the fixes. That work is where the learning happens. This repo exists for two situations:

1. **You are stuck.** You have spent a real chunk of time on something and you cannot see why it does not behave the way the book described. Diff your overlay against the matching tag and you will probably spot the gap inside a minute.
2. **You finished a chapter's exercise and want to review.** Read the canonical end state. Notice what you did differently. Some of those differences are improvements over what I shipped here; others will be drift you want to clean up before the next chapter builds on top.

What this repo is not:

- **Not a copy-paste shortcut.** You can clone the module-1-final tag and skip ahead. You will then hit chapter 3 with no idea why each piece of the overlay is shaped the way it is, and the rest of the book will feel like maintaining someone else's tooling. Build the overlay yourself.
- **Not a polished open-source project.** The code here is shaped to teach the concepts each chapter is about, not to be the most elegant possible setup. There are deliberate simplifications. The book explains why.
- **Not a place to file Claude Code bugs.** Those go to Anthropic. Issues here are for problems with the reference materials themselves.

## Per-chapter Try-this checkpoints

Chapters 2-11 close with a Try-this section that points at one of the module tags below. The four module-N tags collect the exercises into four coherent end states; a single chapter's Try-this typically lands you at a specific module tag, and several chapters share a tag where they build on the same overlay.

```
main                            (docs, exercises, lectures, .gitattributes, LICENSE)
+-- module-{1..4}-start         (per-chapter exercise starting state)
+-- module-{1..4}-final         (per-chapter canonical end state)
    +-- module-1-final          (the minimum overlay -- one CLAUDE.md, one skill)
    +-- module-2-final          (the expanding contract -- rule-layering, two more skills, memory)
    +-- module-3-final          (reliability -- hooks, subagents, /loop and /schedule)
    +-- module-4-final          (team posture -- shared/personal split, CI integration)
```

The start and final tags bracket each module's exercise. `module-N-start` is the state you check out before doing the exercise; `module-N-final` is the canonical answer. `module-N-start` for N > 1 is the same commit as `module-(N-1)-final`.

### Tag contents at a glance

**`module-1-final`** -- the minimum useful overlay. One project `CLAUDE.md` with three or four standing rules, a `settings.json` that pins model and effort tier and includes a starter permission allowlist, and a single skill that does something concrete. Demonstrates the smallest setup that earns its keep.

**`module-2-final`** -- the rule-layering pattern from Chapter 2. The single CLAUDE.md starts using `@`-includes -- the disciplines move into separate files under `rules/` and the manifest pulls them in; a project-specific section stays inline until module 4 promotes it. Two more skills land (a ship-readiness audit and a status inspection), bringing the total to three. The memory store gets its first three entries with `MEMORY.md` as the index. The permission allowlist is tuned via a `fewer-permission-prompts` pass and grows from 11 to 21 entries.

**`module-3-final`** -- reliability and verification. Adds hooks (a pre-commit lint hook on `PostToolUse`, a `Stop`-event notifier). Introduces subagent invocation patterns -- briefing prompts that work, the trust-but-verify spot-check discipline. Adds a `/loop` for a recurring task and a `/schedule` for a true background routine. The trust-boundary discipline from Chapter 8 is the through-line.

**`module-4-final`** -- team posture. The project `CLAUDE.md` becomes a team contract; the `settings.json` gets pinned defaults; `settings.local.json` is documented as the personal-overrides location. A pre-commit checklist is encoded. CI integration patterns are demonstrated (agent-as-reviewer on PRs; agent-as-formatter for routine fixes). The book finishes with a setup that's safe for a team to share.

## Access

This repo is private. Access is granted via GitHub collaborator invitation after purchase:

1. Buy the book at https://yaw.sh/claude-code-in-production
2. The LemonSqueezy fulfillment flow asks for your GitHub username and invites it as a collaborator on this repo. The automated email follows.
3. Accept the invitation. From then on, the repo behaves like any other GitHub repo you can read -- clone, fetch, check out tags.

If the invite does not arrive within a few minutes, the LemonSqueezy receipt has a "resend invite" link. Failing that, file an issue or reach out via the book page.

## How to use it

```bash
git clone https://github.com/YawLabs/claude-code-in-production-companion
cd claude-code-in-production-companion
git checkout module-2-final
```

From there, follow `SETUP.md` to wire it up to Claude Code, then diff against your own checkout in another window. The `git diff` between two adjacent tags is also a useful study artifact:

```bash
git diff module-1-final module-2-final
```

That diff is the shape of the chapter's exercise.

## License

Yaw Labs Course Materials -- End User License Agreement. See `LICENSE`.

This is paid material licensed for personal use by the purchasing licensee. You may apply the techniques and patterns to your own work, including commercial work you ship under your own name. You may not redistribute, mirror, or share the materials with anyone who has not separately purchased access. The full terms are in `LICENSE`.

## About

Yaw Labs.

- Book: https://yaw.sh/claude-code-in-production
- Book repo (manuscript, examples): https://github.com/YawLabs/claude-code-in-production
- Issues: file them on this repo for problems with the reference materials.

If a chapter is unclear, an exercise doesn't match the materials, or the reference at a tag is wrong, file an issue on this repo and we'll fix it.

## Repository layout

- `exercises/module-{1,2,3,4}/` -- exercise.md and solution.md per module (matched to chapter Try-this sections)
- `lectures/` -- module-N-*.md lecture-style walkthroughs that mirror the chapter material
- `recording/` -- production plans for any companion video sessions
- `ops/` -- operational guides (LemonSqueezy setup, fulfillment, etc.)
