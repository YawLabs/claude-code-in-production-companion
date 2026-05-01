# demo-app

A tiny feature-flag evaluator. Pure functions, easy to test. The course uses it as the codebase Claude Code sessions run on top of.

## Install and run

```bash
npm install
npm test
npm start -- --user u-123 --flags ./flags.json
```

The demo intentionally ships with a few bugs you are expected to find via the `/review-changes` skill.
