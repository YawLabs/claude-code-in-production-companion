---
name: Skill descriptions are triggers, not docs
description: When writing or editing a SKILL.md frontmatter description, lead with the verbatim language the user actually types -- not formal documentation phrasing. The description is the trigger.
type: feedback
---

Lead the description with the natural-language phrasings users actually say when they want this work done -- "review my changes", "look over my diff", "audit this", "is this shippable", whatever variants are real. Do not write the description as documentation prose ("This skill performs a comprehensive audit of...").

**Why:** the agent decides whether to fire a skill by matching its description against what the user just typed. A description written in formal prose matches nothing the user actually says. The skill never fires; the user thinks the skill does not work. The fix is upstream of any debugging effort -- write the trigger in the user's voice from the start.

**How to apply:** when adding or editing a SKILL.md, ask: "what would the user literally type when they want this?" Put those phrases verbatim in the description, in `Use when the user says "<phrase>", "<phrase>", or asks ...` form. Test by trying the natural phrasings in a real session and confirming the skill fires before the user has to invoke it explicitly with `/skill-name`.
