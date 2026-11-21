import type { StepId } from '@domain/entities/ApplicationDraft';
import type { FlowDestination, FlowOutcome } from '@domain/services/applyFlow';

export const LANDING_PATH = '/';
export const APPLY_PATH = '/apply';

export const STEP_SEGMENTS: Readonly<Record<StepId, string>> = {
  contact: 'contact',
  name: 'name',
  income: 'income',
  business: 'business',
  ownership: 'ownership',
  checking: 'checking',
  address: 'address',
  identity: 'identity',
};

export const OUTCOME_SEGMENTS: Readonly<Record<FlowOutcome, string>> = {
  incomeNotEligible: 'not-eligible',
  gigBranch: 'next/gig',
  minorityOwnerBranch: 'next/ownership',
  bankConnection: 'next/bank',
};

export const stepPath = (step: StepId): string => `${APPLY_PATH}/${STEP_SEGMENTS[step]}`;

export const outcomePath = (outcome: FlowOutcome): string => `${APPLY_PATH}/${OUTCOME_SEGMENTS[outcome]}`;

export const destinationPath = (destination: FlowDestination): string =>
  destination.kind === 'step' ? stepPath(destination.step) : outcomePath(destination.outcome);
