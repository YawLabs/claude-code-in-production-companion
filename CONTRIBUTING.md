# Contributing

This repo is the canonical reference companion for the book *Claude Code in Production*. Most "contributions" here are bug reports against the reference materials. Code-shaped contributions are welcome but the bar is unusual: every change has to make sense as part of a *teaching* artifact, not just as good code.

## What to file

**Bugs in the reference materials.** If a tag's overlay doesn't behave the way the book described, file an issue. Include: which tag you're on (`module-N-final`), which chapter's Try-this section you were following, what you tried, what happened, what you expected. The simpler the repro, the faster the fix.

**Drift between the materials and current Claude Code.** Claude Code ships fast. A reference written six months ago might use a hook event or skill format that's been updated. If you spot drift, file it.

**Typos and clarity issues.** Small docs improvements are welcome. PRs against `main` are fine for these.

## What not to file

**"This isn't how I'd build it."** Probably true. The reference is shaped to teach the concepts each chapter covers, not to be the most elegant possible setup. There are deliberate simplifications. If you have a better pattern, that's content for your own setup; the reference stays the way the book teaches.

**Book content feedback.** The book manuscript lives elsewhere; feedback on the prose belongs at the book's own repo (https://github.com/YawLabs/claude-code-in-production), not here.

**Bugs in Claude Code itself.** Those go to Anthropic, not here. If a Claude Code feature behaves differently than this repo expects, the reference materials are probably the side that needs to update.

## Pull requests

PRs against `main` (docs, typos, small clarifications) are welcome. PRs that modify a tag's overlay are *not* -- the tags are stable points readers diff against, and rewriting them would silently move ground under anyone working through the book. If a tag has a real bug, file an issue and I'll cut a new tag (`module-N-final-v2`) rather than rewrite the original.

## Code style

If a PR touches example code at any tag:

* Match the existing style. The reference is intentionally consistent across tags; your PR should not introduce a new pattern.
* Don't add comments that just describe what the code does. Comments should explain *why* a non-obvious choice was made (a workaround, a teaching simplification, a deliberate constraint).
* Run `npm run lint:fix` before submitting. The CI check is strict about formatting.

## Questions

Anything that isn't covered here, file an issue. Structural questions about the repo or the reference get answered there.
