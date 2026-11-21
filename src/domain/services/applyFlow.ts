import type { ApplicationDraft, StepId } from '../entities/ApplicationDraft';

export const STEP_ORDER: readonly StepId[] = [
  'contact',
  'name',
  'income',
  'business',
  'ownership',
  'checking',
  'address',
  'identity',
];

/** Numbered steps of the stepper (pickers and Checking are not steps). */
export const NUMBERED_STEPS: readonly StepId[] = ['contact', 'name', 'income', 'business', 'ownership', 'address', 'identity'];
export const TOTAL_STEPS = NUMBERED_STEPS.length;

/** Progress shown on arrival to each screen (canvas: 14, 29, 43, 57, 71, 79, 86, 100). */
export const STEP_PROGRESS: Readonly<Record<StepId, number>> = {
  contact: 14,
  name: 29,
  income: 43,
  business: 57,
  ownership: 71,
  checking: 79,
  address: 86,
  identity: 100,
};

/** Cached progress lifetime [Assumed, canvas 2C]. */
export const DRAFT_TTL_DAYS = 30;

/** Terminal places the flow can send the user to (not steps). */
export type FlowOutcome =
  /** 1D "Gig or contract work": branch not in the prototype. */
  | 'gigBranch'
  /** 1D "A job or other income": not eligible (2E). */
  | 'incomeNotEligible'
  /** 1G "50% or less": branch not in the prototype. */
  | 'minorityOwnerBranch'
  /** After step 7: Plaid / Decision Logic. Out of scope. */
  | 'bankConnection';

export type FlowDestination = { kind: 'step'; step: StepId } | { kind: 'outcome'; outcome: FlowOutcome };

export const stepNumber = (step: StepId): number | null => {
  const index = NUMBERED_STEPS.indexOf(step);
  return index >= 0 ? index + 1 : null;
};

export const isStepSkipped = (draft: ApplicationDraft, step: StepId): boolean =>
  draft.check?.skippedSteps.includes(step) ?? false;

/** A step is complete when its data lets the flow continue past it. */
export const isStepComplete = (draft: ApplicationDraft, step: StepId): boolean => {
  switch (step) {
    case 'contact':
      return draft.contact !== null;
    case 'name':
      return draft.name !== null;
    case 'income':
      return draft.incomeSource === 'business';
    case 'business':
      return draft.business !== null;
    case 'ownership':
      return draft.ownership === 'majority';
    case 'checking':
      return draft.check !== null;
    case 'address':
      return draft.address !== null;
    case 'identity':
      return draft.identity !== null;
  }
};

const isDone = (draft: ApplicationDraft, step: StepId) => isStepComplete(draft, step) || isStepSkipped(draft, step);

/** First step the user still has to do, or null when everything is done. */
export const firstIncompleteStep = (draft: ApplicationDraft): StepId | null =>
  STEP_ORDER.find((step) => !isDone(draft, step)) ?? null;

/** Deep-link guard: a step is reachable only when every previous step is done. */
export const canAccessStep = (draft: ApplicationDraft, step: StepId): boolean =>
  STEP_ORDER.slice(0, STEP_ORDER.indexOf(step)).every((previous) => isDone(draft, previous));

/** Where to go after the user completes `from` (draft already updated). */
export const nextDestination = (draft: ApplicationDraft, from: StepId): FlowDestination => {
  if (from === 'income' && draft.incomeSource === 'gig') return { kind: 'outcome', outcome: 'gigBranch' };
  if (from === 'income' && draft.incomeSource === 'job') return { kind: 'outcome', outcome: 'incomeNotEligible' };
  if (from === 'ownership' && draft.ownership === 'minority') return { kind: 'outcome', outcome: 'minorityOwnerBranch' };
  const next = firstIncompleteStep(draft);
  return next ? { kind: 'step', step: next } : { kind: 'outcome', outcome: 'bankConnection' };
};

/** Back keeps data and skips the automatic Checking screen and steps skipped for returning customers. */
export const previousStep = (draft: ApplicationDraft, from: StepId): StepId | null => {
  for (let index = STEP_ORDER.indexOf(from) - 1; index >= 0; index -= 1) {
    const step = STEP_ORDER[index];
    if (step && step !== 'checking' && !isStepSkipped(draft, step)) return step;
  }
  return null;
};

/** Progress never decreases, including after Checking and when going back. */
export const progressFor = (draft: ApplicationDraft, step: StepId): number =>
  Math.max(STEP_PROGRESS[step], draft.furthestProgress);

export const withProgressAt = (draft: ApplicationDraft, step: StepId): ApplicationDraft => ({
  ...draft,
  furthestProgress: Math.max(draft.furthestProgress, STEP_PROGRESS[step]),
});

export const hasProgress = (draft: ApplicationDraft): boolean => draft.contact !== null;

export const isDraftExpired = (draft: ApplicationDraft, now: Date): boolean =>
  now.getTime() - new Date(draft.updatedAt).getTime() > DRAFT_TTL_DAYS * 24 * 60 * 60 * 1000;
