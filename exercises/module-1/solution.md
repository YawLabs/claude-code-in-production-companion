# Module 1 -- Solution walk-through

[module-1] companion solution. Pairs with chapters 2-3 of *Claude Code in Production*.

One canonical answer for the module-1 exercise. Many shapes work; this is the one shipped at `module-1-final`. The point of this doc is the *reasoning*, not the content -- the content is in the tag.

## The four bugs in the demo

Knowing what is wrong helps you sanity-check that your skill is doing real work.

1. **Rollout off-by-one** in `src/evaluate.ts`. `hashBucket(user.id) <= flag.rollout` should be `<`. At rollout 0, ~1% of users wrongly get the flag.
2. **Undefined-attribute defaults to true** in `src/evaluate.ts` `matchesRule`. When the user lacks the rule's attribute, the function returns `true` (rule matches). The intuitive semantic is "no attribute -- rule doesn't apply -- return false."
3. **Doc / code mismatch** in `src/evaluate.ts`. The JSDoc on `evaluate` claims an empty `rules` list means "no users match." The code disagrees -- empty rules falls through to the rollout-or-true check, matching everyone.
4. **Silent JSON parse failure** in `src/load-flags.ts`. Body wrapped in `try { ... } catch { return []; }`, swallowing parse errors. A flag system that silently turns every flag off when its config is malformed will burn someone.

A `review-changes` skill that catches at least three of these on the first pass is doing its job.

## The CLAUDE.md -- four rules and why each one

### Verify state before claiming it

The highest-leverage rule for module 1. Nothing erodes trust faster than an agent saying "the test passes" when it doesn't. The dividend is immediate -- the agent stops fabricating "I ran the tests, all green" answers it cannot actually produce.

### Prefer ASCII over Unicode in terminal output

Environment-specific. On Windows ConPTY, Unicode gets mangled into mojibake at the codepage boundary, then spreads through copy-paste into bug reports and commit messages. ASCII renders identically everywhere. If you are on macOS or Linux exclusively, swap this for something else.

### Finish what was asked, then surface bigger fixes separately

The instinct is to fix every bug you trip over. The reality is that mid-task pivots stretch a one-hour task into four. The rule names the trap and gives a default behavior -- take the workaround, capture the bigger fix as a follow-up note.

### Pre-edit and pre-commit discipline for this app

The other three rules are general; this one is project-specific. It encodes the local discipline: read before editing, run tests before committing, read the diff with a senior reviewer's eye. Three general rules plus one project-specific is a shape you will use across many projects.

## The settings.json -- model, effort, allowlist

Model is `claude-opus-4-7`; effort is `xhigh`. The flagship at the vendor's recommended tier for coding. `xhigh` is the right ceiling -- `max` is for genuinely hard problems where `xhigh` has demonstrably fallen short.

The allowlist follows one principle: anything read-tool-shaped is unconditionally allowed; Bash is scoped to what you actually use; everything else still prompts. Specifically:

- `Read`, `Glob`, `Grep` -- unconditional. These never mutate state.
- `Edit`, `Write` -- unconditional. Code edits in the working tree are the agent's bread and butter.
- `Bash(npm test:*)`, `Bash(npm run build:*)`, `Bash(npm run lint:fix:*)` -- the project's test, build, and lint commands.
- `Bash(git status:*)`, `Bash(git diff:*)`, `Bash(git log:*)` -- read-only git.

`git push`, `git reset`, `rm`, and any other state-mutating commands are deliberately not allowlisted. Anything that affects shared state should require a deliberate "yes" until you decide otherwise.

## The review-changes skill -- description matters more than body

The frontmatter `description` is what fires the skill. The agent decides whether to invoke based on how well the description matches what you just typed. So it has to use the language *you* use:

```
Use when the user says "review my changes", "review what just changed",
"look over my diff", "audit this", or asks for a check on recent work.
```

Those verbatim phrasings are doing the work. If you describe code review with different words ("can you check this", "give it a once-over"), add those too. The description is the trigger; the body is the instructions once the trigger fires.

The body itself: a checklist of what to look for (correctness, type safety, doc / code mismatch, hygiene) and a structured output shape (file:line + summary + suggested fix, grouped by severity). The "what not to do" section keeps the agent from over-reaching -- "do not run the test suite as part of this review" is there because otherwise the agent will helpfully try to run tests and the review takes ten times longer.

## Verifying

```bash
git diff module-1-start module-1-final -- demo-app/.claude/
```

That is the shipped overlay. Compare against yours. Differences you should expect:

- **Rule choices.** Verify-state and finish-the-task-before-pivoting are core. The other two have valid substitutes -- if you swapped the ASCII rule for "match existing test style" or swapped the project rule for something more specific to your workflow, that is fine.
- **Allowlist scope.** Yours probably has different Bash subcommands depending on which ones you reached for during the exercise. Tighter is fine; broader is fine if you can explain each entry.
- **Skill description phrasings.** The trigger phrases reflect how *you* talk. They will not match the canonical exactly.

If your skill flagged at least three of the four bugs, the overlay works. Move on to module 2.
