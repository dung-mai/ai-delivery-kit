---
name: define
description: Lane 1, writing. Turns a confirmed interview log into capability specs a BA or client can verify - rules as decision tables with a basis for every rule, Given/When/Then scenarios with verification labels, example tables (normal, boundary, negative, combination), screens and fields, roles - then gets an independent critic pass and a clean spec-lint before the spec gate. Use after elicit has a confirmed shared understanding, or to update a spec from new answers.
---

# Define

## Precondition
`product/discovery/<slug>/interview.md` has a **Hiểu biết chung** with `- Xác nhận:`. If not, run **elicit** first. Do not write a spec from a request alone.

## Who
One **ba** subagent per capability (in parallel when the log covers several), then one **spec-critic** subagent per capability (read-only, never the writer). You merge, run the sensors, prepare the gate. Print `▶ Bước 5/6 · Viết spec · <CAP>` and tick the checklist.

## Writing rules (brief these to the ba subagent)
1. One folder per capability: `product/specs/<cap>/spec.md` (≤ ~300 lines, ≤ ~25 rules) and `examples.md`, from the templates.
2. **Every rule has a basis** in the `Căn cứ` column: `[<CAP>-Qnn]` (an answer in the log), `[TL <file> §x]`, `[CODE <path>]`, `[KB <file>]`, `[D-xx]`, or `[GĐ-nn]` (an assumption listed under `## Giả định` as `- GĐ-nn …`). No basis, no rule.
3. The writer adds no business decision of its own. If a rule needs a choice the log does not contain, stop and ask it as one short elicit round (or record it as `GĐ-nn` with the default and a client question).
4. Scenarios Given/When/Then tagged `[auto]`, `[semi]` or `[manual]`. Examples `<CAP>-EX-nn` with `Loại`: `thường`, `biên` for every limit, `âm` for every prohibition, `tổ hợp` where rules meet; numbers checkable with a calculator.
5. Money in the smallest integer unit; rounding place and direction stated; dates with inclusive/exclusive and time zone. No vague words.
6. Glossary terms only; new terms go to the glossary.

## Critic, sensors, gate
- **spec-critic**: findings only; fold blockers/majors back (a finding that needs a decision → one short elicit round). Max 2 rounds.
- `node .flow/sensors/flow.mjs examples`, `spec-lint` (0 errors; it shows the basis mix: answers / documents / code / assumptions), `questions` (client questionnaire covers every open client question).
- Gate **spec** (PO + SA): review pack with the interview log, basis mix and client questions; checklist `.flow/templates/gates.md`. After approval `flow.mjs review-pack --mark-approved`.
