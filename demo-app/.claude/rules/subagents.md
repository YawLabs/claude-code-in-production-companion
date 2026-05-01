## Trust-but-verify subagent reports

**Why:** when you dispatch a subagent (Plan, Explore, full-pass, general-purpose) and it returns a digest, that digest describes what the agent intended to do, not necessarily what it actually did. The agent reports its own work; confirmation bias is real, even for agents. A subagent that "confirmed the refactor compiled" may not have actually run the build. The trust-but-verify discipline is the only reliable way to catch this.

**How to apply:** when a subagent reports a finding ("test passes", "this file does X", "I changed Y"), pick three claims at random from the report and verify them by hand. Open the file at the line cited, run the test it says passed, check the diff it claims to have produced. If the spot-check passes, the rest of the report is probably fine. If any claim fails, treat the entire report as suspect and re-do the work yourself or with a different agent.

This applies regardless of how confident the subagent sounded. "All findings verified" inside the report is not a verification -- your manual spot-check is.
