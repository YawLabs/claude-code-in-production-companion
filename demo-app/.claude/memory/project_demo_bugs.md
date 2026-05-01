---
name: Demo's review-shaped bugs
description: Four seeded bugs in the demo evaluator that review-changes / ship-ready exist to catch. Reference when reasoning about what the skill is supposed to find, or when a session starts asking about behavior in evaluate.ts that looks wrong.
type: project
---

The demo at `demo-app/` carries four bugs deliberately seeded between the `module-1-start` and `module-1-final` tags. Documented here so a future session does not waste cycles "discovering" them as if they were unknown.

1. **Rollout off-by-one** in `src/evaluate.ts` -- `hashBucket(user.id) <= flag.rollout` should be `<`. At rollout 0, ~1% of users wrongly get the flag.
2. **Undefined-attribute defaults to true** in `src/evaluate.ts` `matchesRule` -- when the user lacks the rule's attribute, the function returns `true` (rule matches). Should be `false`.
3. **Doc / code mismatch** in `src/evaluate.ts` -- the JSDoc on `evaluate` claims an empty `rules` list means "no users match"; the code disagrees and matches everyone.
4. **Silent JSON parse failure** in `src/load-flags.ts` -- body wrapped in `try { ... } catch { return []; }`, swallowing parse errors.

**Why:** these are intentional course content, not bugs to fix unprompted. Module 1's exercise asks the reader to catch them via `review-changes`. The seeding commit (`2316a5f`) and the parallel-fix commit (`06b0b01` on `module-1-final-build`) bracket them.

**How to apply:** when working on `demo-app/src/evaluate.ts` or `load-flags.ts`, do not "helpfully fix" these issues unless explicitly asked to. They are the demo's reason for existing. If a session is asked to audit and finds them, point at this memory rather than re-reading the code line by line.
