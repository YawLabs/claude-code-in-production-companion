# Module 2 -- The Expanding Contract

[OPEN: title card; cut to desk]

Welcome to module 2.

In module 1 you built the minimum useful overlay -- one `CLAUDE.md`, one `settings.json`, one skill. That overlay closed a real loop: a session in `demo-app/`, a `review-changes` skill, four bugs caught.

Module 2 is what happens when that minimum starts to feel small.

You add a second skill. Then a third rule. Then you realize you keep telling the agent the same fact ("the demo's bugs are intentional, do not fix them"), so you write that down. Then your allowlist grows -- there is a command you keep approving, every session.

The single flat `CLAUDE.md` from module 1 was fine for four rules. By eight, you cannot route a new rule to its home. By twelve, you have forgotten what is in the file.

This module is the pattern for handling that growth. Rule layering. Memory. Allowlist tuning. Two new skills.

Three new mechanics, all small. None of them complicated. The shape they produce is the shape of an overlay that earns its keep daily.

[BEAT]

## Rule layering

[CAPTURE: scroll through module-1 CLAUDE.md, then module-2 CLAUDE.md and the rules/ directory]

The single `CLAUDE.md` from module 1 had four rules. They were grouped by section heading, but the file was one flat document.

In module 2 you split it. The new `CLAUDE.md` starts using `@`-includes -- the disciplines live in separate files under `rules/`, one rule per file, and the manifest pulls them in. A project-specific section stays inline for now; module 4 promotes it to its own rule file.

```
@./rules/self-state.md
@./rules/terminal.md
@./rules/scope.md
```

Three things this fixes.

One: a new rule has a home. When something comes up that should become a standing rule, you ask "which file does this go in?" If the answer is one of the existing files, add it there. If the answer is "none of them," you have a new discipline and you create a new file. The question is sharper than "which section of the flat file?" -- and it surfaces unclear discipline boundaries early.

Two: rules of different shape stop drifting into each other. A "verify state" rule and an "ASCII output" rule have nothing to do with each other. When they live in the same file, the second one bleeds shape into the first ("when verifying state, prefer ASCII...") and you end up with confused rules. Separate files keep them separate.

Three: project-specific rules and general rules live in different places. The general disciplines are the rule files -- they would apply to any project. Project-specific rules stay inline in `CLAUDE.md`. That split makes the general rules portable -- you can copy `rules/` into a new project's `.claude/` directly without dragging the project-specific stuff with them.

[SEGMENT BREAK]

## Two new skills

Module 1 had one skill. Module 2 adds two -- `ship-ready` and `status`. Both follow the same pattern as `review-changes`: a frontmatter description that is the trigger, a body that is the instructions, a "what not to do" section that prevents over-reach.

[CAPTURE: ship-ready/SKILL.md frontmatter]

`ship-ready` audits a branch for shippability. The trigger phrases -- "is this ready to ship?", "audit this for release", "is this branch shippable?" -- are the things you actually type when you want this work done. The body checklist covers the categories that turn out to matter at ship time: golden path, error UI, loading states, empty states, destructive confirmations, hygiene. The output shape groups blocked-first so the gating items land at the top of the report.

The "what not to do" line is "do not run the full test suite as part of this audit." That is there because without it, the agent helpfully runs `npm test` and the audit takes ten times longer for no reason. Correctness on tested paths is `npm test`'s job. `ship-ready` is for the things tests do not catch.

[CAPTURE: status/SKILL.md]

`status` is one-shot session introspection. The trigger is `/status`, "what mode am I in?", "what model am I running?", "is the overlay active?". The body reports model, effort, overlay path, mode -- all verbatim, none inferred from skill names or surface signals.

The discipline encoded in this skill is "verify, do not guess." Reading skill names to infer mode is unreliable -- skill names overlap across modes and Claude Code versions. The skill exists to encode the discipline that the agent should always answer "let me check" rather than "I'm in mode X because I see skill Y."

The "do not refuse to report because verification is incomplete" line is in there because of a real session where the agent refused to answer about model state because one signal was missing. The user wanted the partial answer; they got a refusal. The skill says: partial truth is more useful than refusal.

[SEGMENT BREAK]

## Memory

[CAPTURE: memory/ directory, then MEMORY.md]

In module 1 the agent forgot everything between sessions. Module 2 introduces the memory store.

The pattern: a `MEMORY.md` file at `.claude/memory/MEMORY.md` is always loaded into context. It is an index -- one line per memory entry, pointing at a separate file in the same directory. The separate file holds the actual content, with frontmatter (`name`, `description`, `type`) and a body.

Three first entries land in module 2.

[CAPTURE: project_demo_bugs.md]

One `project` entry captures the demo's intentional bugs. Without this, every session that touches `evaluate.ts` "discovers" the bugs as if they were unknown problems and helpfully proposes fixes. The entry says: these are course content, do not fix unprompted.

[CAPTURE: feedback_skill_description_voice.md]

Two `feedback` entries capture lessons. One: skill descriptions are triggers, not docs -- write them in the language users actually type. Two: allowlists tighten in response to real prompts seen, not preemptively.

The split between `project` and `feedback` types is intentional. `feedback` entries are portable -- they apply to any project. `project` entries are local -- they only matter for this codebase. When you copy your `rules/` into a new project's `.claude/`, you copy the `feedback` memories too. The `project` memories stay behind.

[BEAT]

The agent decides whether to fetch a memory body based on the index entry's match against the current conversation. So the index entries matter. Generic ("notes on database access") will rarely fire. Specific ("skip @yawlabs/foo-mcp -- here is the workaround") will fire when the workaround topic comes up.

The discipline that earns memory its keep: when something surprising happens or a hard-won lesson lands, write it down. Future-you will not remember.

## Allowlist tuning

[CAPTURE: settings.json from module 1, then module 2]

Module 1's allowlist had 11 entries. Module 2's has 21. The ten additions are not preemptive -- they reflect ten commands that real sessions on this codebase actually surfaced as repeat prompts.

The principle: start narrow, grow in response to prompts, never preemptively. Read tools (`Read`, `Glob`, `Grep`) are unconditional. State-mutating commands (`npm install`, `git push`, `rm`, network calls) stay un-allowlisted so they require a deliberate yes.

The mechanism: a `fewer-permission-prompts` skill scans recent prompts you have hit and proposes additions. You review the proposed list, decide which ones to keep, and the skill writes them to `settings.json`. The interactive form is much faster than tuning by hand.

The `feedback_allowlist_tuning.md` memory is the lesson learned: preemptive allowlisting is guessing. You either over-include (expand the trust surface) or under-include (still get prompted on the commands you actually use). The allowlist is tuned by usage, not by anticipation.

[SEGMENT BREAK]

## What you build, what you skip

Things to build in module 2:

- Refactor `CLAUDE.md` to manifest + 3 rule files via `@` includes.
- Add `ship-ready` and `status` skills.
- Add `memory/` with `MEMORY.md` index and 3 entries (1 project, 2 feedback).
- Grow the allowlist by 8-12 entries via a `fewer-permission-prompts` pass.

Things to skip in module 2:

- Hooks. Module 3 -- once you understand event timing.
- Subagents. Module 3 -- once trust-but-verify is in your toolkit.
- Long-running and recurring routines (`/loop`, `/schedule`). Module 3.
- Team-shared layer (`settings.local.json` split). Module 4.
- CI integration. Module 4.

The temptation in module 2 is to start hooking events. Resist it. The mechanics in this module -- rule layering, memory, allowlist tuning -- earn their keep on every session you run, and they need to land before hooks make sense.

## The loop you should be able to close

By the end of module 2:

1. Your `CLAUDE.md` is a short manifest. Discipline rules live in their own files under `rules/`. You can route a new rule to its home in seconds.
2. `/ship-ready` and `/status` (or the natural phrasings that fire them) work in real sessions. The output shapes are what you wanted.
3. Memory entries surface in conversation when their topics come up. The agent does not re-derive lessons it has already learned.
4. The allowlist has grown by 8-12 entries from your module-1 baseline. Permission prompts now fire only on deliberate state-mutation, which is when you want to see them.

## What module 3 builds on top

Module 3 introduces hooks (events that fire `PostToolUse`, `Stop`, etc.), subagent invocation patterns (briefing prompts that work; the trust-but-verify spot-check discipline), and long-running primitives (`/loop` for in-session monitoring, `/schedule` for true background routines).

Module 3 is also where reliability becomes the through-line. Module 1 was about the loop closing. Module 2 was about the loop expanding. Module 3 is about the loop running unattended.

## Wrap

The exercise for module 2 is in `exercises/module-2/exercise.md`. Check out `module-2-start`, build the additions, and run the loop above. The canonical answer is at `module-2-final` and `solution.md` walks the reasoning.

Five mechanics. One closed loop, expanded. That is module 2.

Module 3, next.
