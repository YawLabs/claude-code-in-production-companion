---
name: review-changes
description: Review the most recent changes (working tree or last commit) for bugs, performance issues, and UX issues before committing or opening a PR. Use when the user says "review my changes", "review what just changed", "look over my diff", "audit this", or asks for a check on recent work. Returns a punch list with file:line, what is wrong, and a suggested fix.
---

# review-changes

## What to look for

Walk the diff. For each changed hunk, ask:

- **Correctness.** Does the new behavior match the function's contract? Are edge cases (empty input, undefined attributes, max/min boundaries, off-by-one) handled?
- **Type safety.** Any place where a wider type (string-or-array, optional fields) could carry surprise behavior? Loose equality where strict was meant?
- **Doc / code mismatch.** Does any docstring or comment claim something the code does not do?
- **Hygiene.** Dead code, swallowed errors, log statements left in, broken imports.

## How to report

For each finding, one line in this shape:

    file:line -- one-line summary of the issue.
      Suggested fix: <what to change>.

Group by severity: **Will-break** (correctness bug, broken contract), then **Should-fix** (subtle bug, doc drift, swallowed error), then **Worth-noting** (cleanup, style).

If the diff is clean, say so in one line and stop.

## What not to do

- Do not list every changed line. Only flag findings.
- Do not propose refactors that go beyond the diff scope.
- Do not run the test suite as part of this review -- that is a separate skill.
