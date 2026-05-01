# Project rules for the demo app

Disciplines that apply when working on this codebase. Apply them as defaults; explicit user instructions always win.

@./rules/self-state.md
@./rules/terminal.md
@./rules/scope.md
@./rules/subagents.md
@./rules/capacity.md

## Pre-edit and pre-commit discipline for this app

**Why:** the demo evaluator is small enough that a careless edit can break correctness silently -- a wrong operator, a swapped argument order, a coercion bug -- and the test suite does not always catch the change. The discipline is what protects correctness, not the tooling.

**How to apply:** before editing a file, read it end-to-end (the function you are touching may have callers or invariants you do not know about). Before committing, run `npm test` and confirm zero failures. Before declaring a change done, read the diff and ask whether a senior reviewer would push back.
