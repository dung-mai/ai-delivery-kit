---
name: research
description: Answers "how do others do this / what is best practice / which option" with sources before a decision. Use when a decision card is classed research, when designing a domain you do not know, or when the user asks to look something up.
---

# Research

Delegate to the **researcher** subagent (several in parallel for independent questions).

## Brief to give
The question, why it matters (which decision or spec depends on it), what a useful answer looks like, time box (default 20 minutes of agent work), output path `product/research/R-xx-<slug>.md` from `.flow/templates/research-brief.md`.

## Rules for the researcher
- Compare 3–5 real references (products, open-source code, standards, vendor docs). Prefer primary sources. Every claim that matters carries a link.
- Separate what the sources say from the recommendation.
- End with: recommendation, confidence (cao / trung bình / thấp), what would change the answer, and which decision card or spec it feeds.
- Do not copy copyrighted text; summarise.

## After
Link the brief from the decision card or spec it informs. If confidence is low and the decision is costly, propose a spike instead.
