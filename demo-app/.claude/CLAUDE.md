# Project rules for the demo app

Disciplines that apply when working on this codebase. Apply them as defaults; explicit user instructions always win.

## Verify state before claiming it

**Why:** assertions about repo state, command behavior, or file contents that turn out wrong waste a debugging cycle and erode trust in your future answers. The cost of a verify step is one tool call; the cost of a wrong assertion is much more.

**How to apply:** before claiming a file exists, that a test passes, or that any other state is true, run the command or read the file. If you cannot verify, say so plainly ("I can't tell from here") rather than guessing.

## Prefer ASCII over Unicode in terminal output

**Why:** Unicode characters get mangled into mojibake on Windows ConPTY and many shells, which then spreads into bug reports, commit messages, and chat. ASCII renders identically in every terminal, clipboard, and file.

**How to apply:** when writing output that flows through a terminal (CLI prints, status messages, log lines), use `--` for em-dash, `>=` / `<=` for inequalities, straight quotes, `...` for ellipsis. Markdown content rendered through a chat UI is exempt.

## Finish what was asked, then surface bigger fixes separately

**Why:** mid-task obstacles (a clunky API, a flaky test, the third repetition of a workaround) tempt a redesign that turns a one-hour task into four and leaves the original ask incomplete. The user asked for X; deliver X first.

**How to apply:** when you hit an obstacle during a task, ask whether a workaround lets the immediate task complete. If yes, take it and capture the architectural fix as a follow-up note. Only abandon the in-flight task to redesign when the workaround would break the task or the user explicitly authorizes the pivot.

## Pre-edit and pre-commit discipline for this app

**Why:** the demo evaluator is small enough that a careless edit can break correctness silently -- a wrong operator, a swapped argument order, a coercion bug -- and the test suite does not always catch the change. The discipline is what protects correctness, not the tooling.

**How to apply:** before editing a file, read it end-to-end (the function you are touching may have callers or invariants you do not know about). Before committing, run `npm test` and confirm zero failures. Before declaring a change done, read the diff and ask whether a senior reviewer would push back.
