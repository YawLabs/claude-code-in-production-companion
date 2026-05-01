#!/usr/bin/env bash
# Fires on the Stop event -- the session has finished its current
# response and is waiting for the user. Rings the terminal bell so
# the user notices when their attention is needed.

# Bell, then a stderr marker in case the bell is silenced
tput bel 2>/dev/null || printf '\a'
echo "[claude code session idle]" >&2

exit 0
