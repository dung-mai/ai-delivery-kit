---
name: knowledge
description: Looks up and grows the project knowledge base in knowledge/ - domain rules, law, hard cases, integration cards, glossary - so agents stop guessing and stop re-researching. Use before drafting a spec, design or test in a domain, when explore finishes a reusable answer, and in retro.
---

# Knowledge

`knowledge/` holds answers the team needs again and again, with sources. It is small on purpose and grows from use. Layout and rules: `knowledge/README.md`.

## Look up (every drafting step)
Before ba, architect, qa or researcher drafts anything in a domain: list `knowledge/`, read the files whose names match the capability, and cite them in the output as `knowledge/<file>#<heading>`. A spec rule that contradicts knowledge must say why (or the knowledge is wrong: propose a fix).

## Promote (end of explore, retro)
Promote an answer when it was needed twice, or when it is law/standard every capability depends on. One file per topic, ≤ ~150 lines, each fact with a source link or "client answer D-xx (date)", plus `Chủ sở hữu:` (BA for business, SA for tech) and `Xem lại:` (date). Propose the change; the owner confirms (the learn loop never writes knowledge on its own).

## Never
Client personal data, real transactions, credentials, or anything copied verbatim from a paid standard.
