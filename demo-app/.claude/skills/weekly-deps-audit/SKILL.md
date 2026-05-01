---
name: weekly-deps-audit
description: Audit the project's dependencies for outdated versions and known security advisories. Use when the user asks to "check for outdated deps", "audit dependencies", "is anything stale", "what needs upgrading", or invokes /weekly-deps-audit. Designed as a /schedule target for a weekly background routine. Reports a punch list of upgrade candidates with severity flags.
---

# weekly-deps-audit

## What to do

1. Run `npm outdated --json` and capture the result.
2. Run `npm audit --json` and capture the result.
3. Parse both into a single report.

## How to report

Group findings:

- **Security advisories** (any from `npm audit`): list each affected dep with severity (critical / high / moderate / low) and the version range that fixes it. These are highest priority.
- **Major version drift** (current vs latest, major bump): list each dep with current and latest. These are intentional upgrade decisions, not routine.
- **Patch / minor drift** (current vs latest, non-major bump): list each. Safe to bump in batch.

For each finding:

    <package>: <current> -> <latest>  [<severity if any>]

End with a one-line summary: counts for security, major, and patch/minor.

## What not to do

- Do not run `npm install` or `npm update` automatically. Audit only -- the upgrade decision is the user's.
- Do not propose specific version pinning unless asked. The default is "report what is stale."
- If the project has no dependencies (or only devDependencies and they are all current), say so in one line and stop.

## When to schedule

This skill is shaped to run weekly via /schedule. The recommended cadence is Monday morning -- catches drift before the work week starts. Configure with `/schedule "weekly on Monday at 9am" weekly-deps-audit`.
