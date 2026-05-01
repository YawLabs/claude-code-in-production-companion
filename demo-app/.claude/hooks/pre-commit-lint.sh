#!/usr/bin/env bash
# Fires after every Edit or Write tool call. Runs the project's auto-
# formatter so the codebase stays consistently formatted as Claude
# edits files. Failures are intentionally swallowed -- this is a
# convenience, not a gate.

set +e

DEMO_APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Only run if biome is actually installed -- avoids errors on a fresh
# checkout that has not yet run npm install.
if [ -f "$DEMO_APP_DIR/package.json" ] && [ -d "$DEMO_APP_DIR/node_modules/@biomejs/biome" ]; then
  cd "$DEMO_APP_DIR" && npm run lint:fix --silent >/dev/null 2>&1 || true
fi

exit 0
