# Questions for the client · Promotions at the POS

**Purpose:** six decisions we need from you to finish the promotions specification.
**From:** delivery team · **To:** marketing lead and finance / accounting on the client side · **How your answers are used:** each answer becomes a rule in the specification and in the automated tests. Until you answer, we build on the default shown under each question, so nothing is blocked.

## Context
We are specifying how the new POS applies promotions: which promotions are eligible, how several promotions combine on one basket, rounding and VAT, and what the receipt shows. Prices are VAT-inclusive, amounts are in THB to the satang, times are Bangkok time.

## How to answer
Reply under each question within one week. Choosing a letter is enough. "I don't know" or "ask <name>" is a useful answer too.

## Combining promotions

### D-01 · When several promotions apply to the same item, which ones can be used together?
_Why this matters: it decides the price of most baskets and cannot be guessed from the proposal._
- (A) Each promotion is either "exclusive" or "stackable"; the POS picks the combination that gives the customer the biggest discount; ties go to the higher priority.
- (B) Only the priority set by marketing decides; the POS does not compare discounts.
- (C) Custom exclusion groups (at most one promotion per group).
- **We recommend:** A. It matches "best deal" in the proposal and needs only two settings per promotion.
- **Until you answer we use:** A.

>

### D-02 · Two stackable percentage discounts on one item: one after the other, or both on the original price?
_Why this matters: milk at 45.00 THB with −10% and −5% costs 38.47 one way and 38.25 the other._
- (A) One after the other, in priority order.
- (B) Both on the original price.
- **We recommend:** A.
- **Until you answer we use:** A.

>

### D-06 · Is a basket threshold ("spend 300 THB or more") measured before or after item discounts?
- (A) After item discounts (what the customer actually pays).
- (B) Before item discounts.
- **We recommend:** A.
- **Until you answer we use:** A.

>

## Timing

### D-03 · Is a promotion checked when the item is scanned or when the cashier presses total?
_Why this matters: a promotion ending at 18:00, item scanned 17:58, total pressed 18:01._
- (A) When total is pressed; everything is recalculated at that moment.
- (B) When each item is scanned.
- **We recommend:** A. One moment for screen, receipt and reports.
- **Until you answer we use:** A.

>

## Rounding and VAT

### D-04 · How are discounts and VAT rounded: per line or per receipt?
_Please ask your accounting team; your current system may already have a rule._
- (A) Each discount rounded half up to the satang; VAT calculated once on the receipt total after discounts.
- (B) VAT calculated and rounded per line, then added up.
- **We recommend:** A, unless your accounting system uses B.
- **Until you answer we use:** A.

>

## Control

### D-05 · Must a second person approve a promotion before it reaches the stores?
- (A) Yes, the approver must be different from the creator.
- (B) No, anyone with marketing rights can publish.
- **We recommend:** A. A wrong promotion goes to every terminal at once.
- **Until you answer we use:** A.

>

## Anything else?
Anything we did not ask that we should know? Examples of 5–10 recent real promotions (with prices masked) would help us check these rules.

>
