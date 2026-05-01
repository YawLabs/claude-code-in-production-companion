## Verify state before claiming it

**Why:** assertions about repo state, command behavior, or file contents that turn out wrong waste a debugging cycle and erode trust in your future answers. The cost of a verify step is one tool call; the cost of a wrong assertion is much more.

**How to apply:** before claiming a file exists, that a test passes, or that any other state is true, run the command or read the file. If you cannot verify, say so plainly ("I can't tell from here") rather than guessing.

Do not infer runtime state from skill names, slash commands, or the shape of system reminders. Surface signals overlap across modes and Claude Code versions, and "I can tell I'm in mode X because I see skill Y" is unreliable. Read the environment with concrete commands; report what you observe.
