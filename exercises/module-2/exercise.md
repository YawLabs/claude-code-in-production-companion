# Module 2 -- The Expanding Contract

[module-2] companion exercise. Pairs with chapters 4-6 of *Claude Code in Production*.

## Goal

Take the minimum overlay you built in module 1 and expand it. By the end you will have:

- `CLAUDE.md` split into a manifest plus three discipline-specific rule files (rule-layering)
- Two new skills: `ship-ready` (audit a branch for shippability) and `status` (one-shot session-state lookup)
- A memory store -- `MEMORY.md` index plus a few entries that capture lessons from this module
- A tuned permission allowlist that grew by 8-12 entries from prompts you actually saw

The shape of module 2 is the shape of an overlay that earns its keep on a daily basis.

## Starting state

```bash
git checkout module-2-start
cd demo-app
npm install
npm test
```

Tests pass. You have the module-1 overlay in place (one `CLAUDE.md`, one `settings.json`, one `review-changes` skill). Module 2 builds on top.

## Build

### Rule layering

Refactor `demo-app/.claude/CLAUDE.md` from a single flat file into a manifest. Move three of the disciplines into separate files under `demo-app/.claude/rules/` -- one rule per file. Keep any project-specific rule in `CLAUDE.md` itself; generic disciplines layer, project-specific rules do not.

The pattern uses `@` includes:

```markdown
@./rules/<rule-name>.md
```

Pick three rules that make sense to scope as separate files. The canonical answer at `module-2-final` uses `self-state.md` (verify-before-claiming), `terminal.md` (ASCII output), `scope.md` (finish-task-before-pivoting). You can pick others if they better match your context.

### Two new skills

Add `demo-app/.claude/skills/ship-ready/SKILL.md`. Description fires on natural phrasings of "is this ready to ship?", "audit this for release", "is this branch shippable?", "is this good to go". Body is a checklist (golden path, error UI, loading, empty states, destructive confirmations, hygiene) and an output shape with `[done] / [missing] / [blocked]` per finding, blocked-first.

Add `demo-app/.claude/skills/status/SKILL.md`. Description fires on `/status`, "what mode am I in?", "what model am I running?". Body reports model, effort, overlay path, mode -- all verbatim, none inferred from skill names.

### Memory store

Create `demo-app/.claude/memory/`. Add `MEMORY.md` as the index plus three first entries. Each entry is a separate file with frontmatter (`name`, `description`, `type`) and a body. Suggested topics:

- One `project` entry capturing the demo's intentional bugs (so a future session does not "discover" them as if they were unknown).
- Two `feedback` entries capturing lessons -- e.g., "skill descriptions are triggers, not docs" and "tighten allowlist after seeing prompts, not before."

### Tune the allowlist

Run a few real sessions on the demo. Each time you hit a permission prompt for a command that is benign and routine, add it to `settings.json`'s allow list. Aim for 8-12 new entries from your module-1 baseline. State-mutating commands (`git push`, `npm install`, `rm`) should NOT be added.

If you have a `fewer-permission-prompts` skill (Yaw Mode provides one), use it -- it scans recent transcripts for repeat prompts and proposes additions.

## Done when

1. `CLAUDE.md` is a manifest plus 1-2 inline rules. Discipline rules live in their own files under `rules/`.
2. Asking the agent "is this ready to ship?" fires `ship-ready`. Asking "what mode am I in?" fires `status`. Both produce useful structured output.
3. Memory entries surface in conversation when their topics come up.
4. The allowlist has grown by 8-12 entries from your module-1 baseline.

## If you get stuck

The canonical answer is at `module-2-final`. The diff against `module-2-start` is one valid module-2 overlay:

```bash
git diff module-2-start module-2-final -- demo-app/.claude/
```

Read `solution.md` for the walk-through.
