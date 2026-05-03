# Module 1 -- The Minimum Useful Overlay

[module-1] companion walk-through. Pairs with chapters 2-3 of *Claude Code in Production*.

The goal of this module is small on purpose. You will build a Claude Code overlay -- one project `CLAUDE.md`, one `settings.json`, and one skill -- and run a real session in front of it. By the end you will have something tangible: a directory you can point at, a session that loads it, and a demo where the work the overlay does is visible to you immediately.

That is the whole arc. Three files, one demo, one closed loop.

The rest of the walk-through covers three questions. First: why an overlay at all? Second: what is the minimum shape that earns its keep? Third: what is the loop you should be able to close by the end of an hour?

## Why an overlay

When you open a vanilla Claude Code session in a fresh repo, you are running on the agent's defaults. Default model. Default effort tier. Default permission posture, where everything prompts. No knowledge of your codebase's conventions, your team's discipline, your personal pet peeves. The agent is competent at the basics, but every session starts from zero.

An overlay is how you stop that. The overlay is a directory of files -- typically `.claude/` -- that the agent loads whenever you start a session in this project. The files tell the agent what model to use, what level of effort to apply, what permissions are pre-approved, what disciplines apply, and what skills are available. In later modules they also carry hooks, memory, and team-shared configuration.

The minimum overlay is small. We are not building infrastructure. We are tilting the agent's defaults toward the work *you* actually do.

A useful test: if you took your overlay away, what would you notice? If the answer is "nothing," the overlay is not earning its keep. The disciplines you put in `CLAUDE.md` should be ones that, without them, you would catch the agent doing the wrong thing. The allowlist you put in `settings.json` should be the one that, without it, you would be clicking through prompts every other tool call. The skills you write should be ones you actually use, with descriptions that fire on the language *you* use.

Build it small. Build it real. Layer more later.

## What is in the minimum

The minimum useful overlay has three pieces.

**One**, a project `CLAUDE.md` with three or four standing rules. The rules should be disciplines, not preferences. The difference matters. "Always use tabs" is a preference -- the agent's defaults are usually fine, and even if they are not, your formatter handles it. "Verify state before claiming it" is a discipline -- without it the agent will fabricate "the test passes" answers, and that erodes trust permanently.

In the canonical answer at `module-1-final` you will see four rules. Three of them are general -- verify state, prefer ASCII output on Windows-style terminals, finish-what-was-asked-before-pivoting. The fourth is project-specific -- read before editing, run tests before committing, read the diff with a senior reviewer's eye.

That shape -- three general plus one project-specific -- is one that travels well across many projects. The general rules anchor the agent's posture; the project-specific rule encodes what it means to ship discipline *here*.

**Two**, a `settings.json` that pins your model and effort tier. The flagship is `claude-opus-4-7`; the recommended effort for coding is `xhigh`. There is a `max` tier above `xhigh` -- save it for genuinely hard problems where you have seen `xhigh` fall short. The default of `xhigh` is what almost every session of yours should run on.

The `settings.json` also carries a permission allowlist. The principle: anything read-tool-shaped is unconditionally allowed; specific Bash subcommands you use in this project are allowed; anything else still prompts. Read tools never mutate state -- there is no reason to prompt for `Read`, `Glob`, or `Grep`. State-mutating commands like `git push` should *not* be allowlisted -- they should require a deliberate "yes" until you decide otherwise.

The allowlist is the lowest-leverage of the three pieces but the highest-frustration if you skip it. Without an allowlist you click through twenty permission prompts in your first session. With one, you see prompts only when something deliberate is happening -- which is when you actually want to see them.

**Three**, one skill. `review-changes` -- "review the most recent changes for bugs, performance issues, and UX issues."

The skill is a markdown file with frontmatter and a body. The frontmatter has two fields that matter: `name` and `description`. The description is the entire trigger. The agent decides whether to fire a skill based on how well its description matches what you just typed -- which means the description has to use the language *you* use. Not jargon. Not formal phrasing. The verbatim phrases you actually type when you want this work done.

If you describe code review with "review my changes" and "look over my diff" and "audit this," put all three of those phrasings in the description. If you sometimes say "can you check this," put that in too. The description is not documentation -- it is a trigger.

The body of the skill is the instructions once the trigger fires. Checklist of what to look for. Format for findings. Things not to do (over-reach into related work, run the test suite as part of the review).

That is the minimum overlay. Three pieces. None of them complicated.

## The demo and what it earns

The companion repo's demo is a small TypeScript feature-flag evaluator. Pure functions, easy to test, easy to read. It exists for one reason: it is the target your overlay does work on.

The demo intentionally ships with four review-shaped bugs. Bugs that pass the test suite but are visible to a careful reader. Off-by-one in a rollout boundary. An undefined-attribute branch that returns `true` when it should return `false`. A docstring that claims one semantic while the code implements another. A silent JSON parse failure that returns an empty array on bad input.

These are the kind of bugs production code actually ships with. Not toy bugs. Bugs that shipped.

When you run your `review-changes` skill against this demo, the skill should flag at least three of the four bugs as findings. That is the closing of the loop. The overlay you built -- three files in `.claude/` -- just made four real bugs visible to you in one session that you would not have seen otherwise.

That is what "earns its keep" means. You can ship the minimum overlay in an hour. The skill catches three of four bugs. The model and effort pin produces consistent output across sessions. The allowlist stops the prompt fatigue. The rules anchor the agent's posture so it stops fabricating "tests pass" answers.

Without these, you are at the agent's defaults forever.

## What you build, what you skip

Things to build in module 1:

- `CLAUDE.md` -- three or four standing rules, in a `**Why:**` / `**How to apply:**` shape.
- `settings.json` -- model, effort, permission allowlist scoped to read-tools and the project's specific Bash subcommands.
- `skills/review-changes/SKILL.md` -- one skill with a description that uses the language you actually use.

Things to skip in module 1:

- Multiple skills. One is enough; you will add more in module 2.
- Memory. The auto-memory pattern lands in module 2 with `MEMORY.md` and the file-per-entry shape.
- Hooks. Hooks belong in module 3 once you understand what events fire and how to debug them.
- A subagent layer. Subagents are module 3 too -- the trust-but-verify discipline depends on understanding the basics first.
- A team-shared layer. The split between `settings.json` and `settings.local.json` lands in module 4. For module 1, everything is in one place.

The temptation in module 1 is to build more than the minimum. Resist it. The point of module 1 is closing the loop on a real session with a real overlay -- not building production infrastructure. You will layer all of it in modules 2 through 4.

## The loop you should be able to close

By the end of module 1, you should be able to do this:

1. Start a Claude Code session in `demo-app/`. The agent acknowledges loading your project `CLAUDE.md` and confirms it is running on `claude-opus-4-7` at `xhigh` effort.
2. Stage a small change to the demo -- add a unit test, fix a typo, anything. Ask the agent to "review my changes" or whatever phrasing you put in your skill description. Your `review-changes` skill fires.
3. Run the skill against the bug-seeded demo. The skill produces a punch list of findings. At least three of the four seeded bugs are flagged with the right file and line.

If those three steps work, you have shipped a minimum useful overlay. That is the entire deliverable for module 1.

## What module 2 builds on top

Module 2 takes the single flat `CLAUDE.md` and splits it into a manifest plus discipline-specific rule files. The pattern is called rule-layering -- as the overlay grows, you stop putting everything in one file and start scoping rules by discipline (scope, terminal, self-state, ...). Each rule lives in its own file. The manifest pulls them in via @-includes.

Module 2 also adds two skills (`ship-ready` for branch audits, `status` for one-shot lookups), introduces the memory store, and tunes the permission allowlist with a `fewer-permission-prompts` pass that gathers the prompts you have hit and proposes additions.

The shape of module 2 is the shape of an overlay that earns its keep on a daily basis. Module 1 is the entry point.

## Wrap

The exercise for module 1 is in `exercises/module-1/exercise.md`. Check out `module-1-start`, build your overlay, and run the loop above. If you get stuck, the canonical answer is at `module-1-final` and `solution.md` walks the reasoning behind each choice.

Three files. One closed loop. That is module 1.

Module 2 is next.
