## Prefer ASCII over Unicode in terminal output

**Why:** Unicode characters get mangled into mojibake on Windows ConPTY and many shells, which then spreads into bug reports, commit messages, and chat. ASCII renders identically in every terminal, clipboard, and file.

**How to apply:** when writing output that flows through a terminal (CLI prints, status messages, log lines), use `--` for em-dash, `>=` / `<=` for inequalities, straight quotes, `...` for ellipsis, `|` and `-` for table borders, and `*` for bullets. Markdown content rendered through a chat UI is exempt -- this rule applies to ephemeral terminal output, not to source files or chat responses.
