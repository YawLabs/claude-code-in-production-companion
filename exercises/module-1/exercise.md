# Module 1 -- Build the minimum useful overlay

## Goal

Build a Claude Code overlay for the small TypeScript demo at `demo-app/`. By the end you will have:

- A project `CLAUDE.md` with three or four standing rules
- A `settings.json` that pins your model and effort tier and allowlists the project's common Bash subcommands
- One skill (`review-changes`) that reviews recent edits

Many overlay shapes are valid. The structure described in `STRUCTURE.md` is the floor, not the ceiling.

## Starting state

```bash
git checkout module-1-start
cd demo-app
npm install
npm test
```

Tests pass. The demo is a small feature-flag evaluator with four review-shaped bugs deliberately seeded into the source. The bugs are visible to a careful reader but pass the test suite -- your overlay's job is to make them visible to *you*.

## Build

Create `demo-app/.claude/` with:

1. **`CLAUDE.md`** -- three or four standing rules. Disciplines, not preferences -- "verify state before claiming it" or "match the existing test style," not "use tabs." Use a `**Why:**` / `**How to apply:**` structure for each. Don't ship more than four to start; you can layer more in module 2.
2. **`settings.json`** -- pin your model and effort tier (`claude-opus-4-7` + `xhigh` is a reasonable floor). Add a permission allowlist that covers Read tools unconditionally and the project's common Bash subcommands (`npm test`, `npm run build`, `git status`, `git diff`, `git log`, ...) so you stop seeing prompts for routine reads.
3. **`skills/review-changes/SKILL.md`** -- one skill. The frontmatter `description` should fire when you describe wanting a code review in the way *you* phrase it ("review my changes", "look over my diff", "audit this" -- all the variants you actually use). The body is a checklist of what to look for and how to report findings.

## Done when

1. Start a Claude Code session in `demo-app/`. The agent confirms it loaded your `CLAUDE.md` and the model + effort pin.
2. Make a small change to the demo (add a test, fix a typo). Ask the agent to "review my changes" using the natural phrasings your skill description targets. The skill fires.
3. Run the skill against the bug-seeded source. Your skill flags at least three of the four bugs.

If those three steps work, you have shipped a minimum useful overlay.

## If you get stuck

The canonical answer lives at `module-1-final`. The diff is one valid module-1 overlay:

```bash
git diff module-1-start module-1-final -- demo-app/.claude/
```

Read `solution.md` for the walk-through and the reasoning behind each choice.
