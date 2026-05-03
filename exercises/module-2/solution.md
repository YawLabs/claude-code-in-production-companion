# Module 2 -- Solution walk-through

[module-2] companion solution. Pairs with chapters 4-6 of *Claude Code in Production*.

One canonical answer for the module-2 exercise. The canonical content lives at `module-2-final`; this doc is the *reasoning* behind the choices.

## Why rule layering matters

In module 1, four rules in one file was fine. By eight rules across three different disciplines, one file is a grab bag -- you cannot route a new rule to its home, and unrelated disciplines drift into each other.

The fix is to scope rules by file. Each rule file holds one discipline. The manifest pulls them in via `@` includes. New rules now have a clear home; reading any single file gives you one coherent thread of thought.

The discipline test for rule placement: when a new rule comes up, ask which existing file it belongs in. If none, you have a new discipline -- create a new file. If the answer is "two of them," your discipline boundaries are unclear and you should refactor.

## The three rule files chosen

The canonical answer pulls these three out:

- `self-state.md` -- verify-before-claiming. The highest-leverage discipline for any session; it stops the agent from fabricating state.
- `terminal.md` -- ASCII over Unicode in terminal output. Environment-specific (matters more on Windows ConPTY) but cheap to apply universally.
- `scope.md` -- finish-what-was-asked-before-pivoting. Prevents mid-task scope creep that turns a 1-hour task into 4.

Each file got a small expansion compared to its module-1 counterpart -- self-state added the don't-infer-from-surface-signals clause; scope added the don't-redesign-on-frustration clause. Both durable disciplines that earn their keep on day one.

## ship-ready

The frontmatter trigger phrases are deliberately specific:

```
"is this ready to ship?", "audit this for release", "is this branch
shippable?", "check if this is ready", "is this good to go"
```

Each phrasing reflects a different way you might describe the same work. The agent fires the skill if any matches.

The body's checklist (golden path, error UI, loading, empty states, destructive confirmations, hygiene) covers the categories that turn out to matter when something ships. The output shape (`[done] / [missing] / [blocked]` grouped blocked-first) puts gating items at the top of the report.

The "what not to do" section includes "do not run the full test suite as part of this audit." Without that, the agent will helpfully run `npm test` and the audit takes ten times longer for no reason -- correctness on already-tested paths is `npm test`'s job, not `ship-ready`'s.

## status

`status` exists because runtime state is a thing the agent cannot reliably introspect from skill names or surface signals. The discipline encoded in the skill: read the environment with concrete commands, report verbatim observations, never guess.

The canonical body has one specific anti-pattern: "do not refuse to report state because verification is incomplete." A previous version of this skill, on a real session, refused to answer because one signal was missing. The user wanted the partial answer ("I can confirm model and effort; mode is unverified"); they got a refusal. Fixed by codifying the partial-truth-is-useful default in the skill body.

## Memory entries

Three entries land in module 2. Each is a separate file under `memory/`, with `MEMORY.md` as the always-loaded index.

- **`project_demo_bugs.md`** captures the four intentional bugs in the demo. Without this entry, every fresh session would "discover" them as if they were unknown problems and propose fixes. The entry says: these are companion-repo content, do not fix unprompted.
- **`feedback_skill_description_voice.md`** captures the lesson that skill descriptions are triggers, not documentation. Lead with the verbatim phrasings users actually say.
- **`feedback_allowlist_tuning.md`** captures the lesson that allowlists grow in response to real prompts seen, not preemptively.

The `feedback` entries are durable -- they apply to any project, any session. The `project` entry is local -- it only matters for this codebase. When you copy your `rules/` into a new project's `.claude/`, you copy the `feedback` memories too. The `project` memories stay behind.

## The allowlist tune

The module-1 allowlist had 11 entries (read tools plus a few project Bash subcommands). Module-2-final has 21. The 10 additions are commands a real session on this codebase actually surfaces as repeat prompts:

- `npx vitest:*`, `npx biome:*`, `npx tsc:*` -- the tools npm scripts wrap
- `npm run lint:*` (without fix) -- read-only lint
- `git show:*`, `git branch:*`, `git rev-parse:*` -- read-only git
- `ls:*`, `pwd:*`, `cat:*` -- basic shell read commands

What did NOT get added: anything that mutates external state. `npm install`, `npm run start`, `git push`, `git reset`, `rm` -- these stay un-allowlisted so they require a deliberate yes. The principle from module 1 holds.

## Verifying

```bash
git diff module-2-start module-2-final -- demo-app/.claude/
```

Compare against your work. Differences you should expect:

- Different rule files, depending on which disciplines you chose to scope.
- Different memory entries, depending on what you actually learned in the module's exercise sessions.
- Different allowlist additions, depending on which prompts you hit.

If `ship-ready` and `status` fire on your natural phrasings, the rule files load via `@`-includes, and memory index entries surface in conversation when relevant, the overlay works. Move on to module 3.
