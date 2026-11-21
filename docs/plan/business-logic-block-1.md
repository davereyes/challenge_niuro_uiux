# Business logic — Apply Now (block 1 · Flow)

> Source: provided by the product owner. `[Assumed]` items are assumptions to validate.

## Global
- Stepper: 7 steps. Pickers (1F, 1J) and "Checking" (1G→) are NOT steps.
  1B Contact (1) · 1C Name (2) · 1D Income source (3) · 1E Business (4) · 1G Ownership (5) · 1H Home address (6) · 1I Identity (7)
- Progress only moves forward; never decreases, including after "Checking".
- "Continue" stays disabled until every required field on the step is valid.
- Back keeps all entered data. Progress is saved per step so the user can resume. [Assumed]
- After step 7 → bank connection (Plaid / Decision Logic) → decision → offer. Out of scope.

## 1B · Contact
- Email: required, valid format.
- Mobile: required, US 10 digits.
- Consent "account-related calls and texts": required to continue. [Assumed]
- Consent "promotional texts": optional.
- Marketing consent is never bundled with Terms acceptance.

## 1C · Name
- First name and last name: required, letters only, min 1 character.

## 1D · Income source (single choice)
- "My own business" → continue to 1E.
- "Gig or contract work" → branch not in the prototype. Do not design.
- "A job or other income" → not eligible: "explore other options". Destination not in the prototype.

## 1E · Business (+ 1F picker)
- Business name: required, min 2 characters, must match the bank account name.
- Start date: month + year in one field; future months are not selectable.
- Public requirement: 3+ months in business. Validated in the backend, not blocked in the UI. [Assumed]

## 1G · Ownership (single choice)
- 51% or more → continue.
- 50% or less → branch not in the prototype. Do not design.

## 1G→ · Checking your information (automatic, no input)
- Runs after Ownership and checks:
  1. Whether the user already has an account (email / phone).
  2. Which steps the user can skip.
- Returning customer → skip already-known steps and land on the first missing one. [Assumed]
- New customer → continue to 1H.
- Advances automatically; no button.

## 1H · Home address
- Address with autocomplete; selecting a suggestion fills city, state and ZIP.
- ZIP: 5 digits.
- State defines eligibility: not available in CA or NY (public). Unserved state → not eligible. Screen not in the prototype. [Assumed]

## 1I · Identity (+ 1J picker)
- Date of birth: required, picked from month/day/year wheels; must be 18+; invalid dates bounce.
- SSN: required, 9 digits, masked with a show/hide toggle.
- "Continue" → bank connection.

## Public eligibility rules (backend, for reference)
- 3+ months in business
- $1,500+/month average deposits
- Bank account that connects via Plaid / Decision Logic
- No open bankruptcy
- Not available in CA or NY
