# Memory index

Shared memories (checked into the repo, useful to the whole team) live under `shared/`. Personal memories (gitignored, per-developer) live under `personal/`.

## Shared

- [Demo's review-shaped bugs](shared/project_demo_bugs.md) -- four seeded bugs in evaluate.ts and load-flags.ts; do not "helpfully fix" unprompted.
- [Skill descriptions are triggers, not docs](shared/feedback_skill_description_voice.md) -- write descriptions in the language users actually type.
- [Tighten allowlist after seeing prompts, not before](shared/feedback_allowlist_tuning.md) -- start narrow; add entries when prompts get repetitive.

## Personal

Personal memories live in `personal/` and are excluded from version control via the repo's `.gitignore`. Use them for facts that only matter to your local environment, your private notes on the codebase, or feedback memories that have not yet been validated as useful for the whole team.

When a personal memory has earned its keep across multiple sessions, promote it to `shared/` so the team gets the benefit.
