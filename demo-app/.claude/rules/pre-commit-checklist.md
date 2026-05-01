## Pre-edit and pre-commit checklist

**Why:** the demo evaluator is small enough that a careless edit can break correctness silently -- a wrong operator, a swapped argument order, a coercion bug -- and the test suite does not always catch the change. The discipline is what protects correctness, not the tooling. Encoding the checklist in this file (rather than as inline prose in `CLAUDE.md`) makes it a team contract: every collaborator gets the same expectations on every session.

**How to apply:**

Before editing a file:

- Read it end-to-end. The function you are touching may have callers or invariants you do not know about.

Before committing:

- Run `npm run lint:fix` (not just `lint`). Biome formatting diffs that survive into a commit break CI later.
- Run `npm test`. Confirm zero failures. Do not commit with failing tests.
- Read the staged diff. Ask whether a senior reviewer would push back. If yes, address it before committing.

If a pre-commit step fails, fix the underlying issue rather than bypassing the check. Do not use `--no-verify`, do not skip lint, do not comment out a failing test.

This rule supersedes any session-level "I will run tests later" pattern. Tests run before each commit; commits do not land with red tests.
