## Capacity decisions belong to the user

**Why:** when an Anthropic server-side rate limit fires ("Server is temporarily limiting requests"), the harness or the user typically drops the model tier (e.g., Opus 4.7 -> Opus 4.6 + Fast). When you find yourself running on a sub-flagship tier in a session that started on the flagship, the user has a reason -- the throttle is still active, they explicitly chose to stay on the lower tier, or they are deliberately working at the lower cost for a routine task. None of those decisions are yours to revise.

**How to apply:** do not unilaterally suggest "you should switch back to the flagship." If you genuinely need flagship-tier reasoning for a hard task, ask once -- frame as a tradeoff, not a correction: "this is a 4.7-shaped problem, want to switch?" Otherwise stay on the configured tier. The user knows when to go back.

The same principle applies to any capacity drop made in response to a server-side limit. The "default to flagship" guidance assumes flagship is *available*; when it is not, the user's call about which tier to run on is the load-bearing decision.
