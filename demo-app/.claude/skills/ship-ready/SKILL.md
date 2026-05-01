---
name: ship-ready
description: Audit a branch or feature for shippability before merging to main, cutting a release tag, or declaring a feature done. Use when the user says "is this ready to ship?", "audit this for release", "is this branch shippable?", "check if this is ready", "is this good to go", or asks for a final pass before merge. Returns a checklist of done / missing / blocked covering golden path, error UI, loading states, empty states, destructive confirmations, and hygiene.
---

# ship-ready

## What to audit

For the changes in scope (the current branch's diff against `main`, or the working tree if not yet committed), check each of the following. Note any that are done, missing, or blocked.

- **Golden path.** Does the happy path work end-to-end? Run it manually if you can; otherwise read through the code path.
- **Error UI / error paths.** What happens on the most-likely failure modes (network error, malformed input, missing dependency, permission denied)? Does the user see something useful, or does the app silently fail?
- **Loading states.** For anything async, is there feedback while it is loading?
- **Empty states.** What does the app show when there is no data yet? "No results" should not look like a broken state.
- **Destructive confirmations.** Anything that deletes, overwrites, or sends should require deliberate confirmation.
- **Hygiene.** Dead code, debug log statements, hardcoded test values, secrets, broken imports.

## How to report

For each finding, one of:

    [done]      <area> -- one-line summary.
    [missing]   <area> -- what is missing.
    [blocked]   <area> -- what blocks it and what would unblock.

Group `[blocked]` first (these gate the merge), then `[missing]`, then `[done]`. End with a one-line shippability verdict: `ship`, `fix-then-ship`, or `block`.

## What not to do

- Do not run the full test suite as part of this audit -- that is `npm test`. The audit is about shippability, not correctness on already-tested paths.
- Do not propose new features. Audit shippability of what is in scope.
- If a finding requires more than a one-line fix, capture it as a follow-up note rather than blocking on it.
