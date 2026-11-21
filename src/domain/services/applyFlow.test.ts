import { describe, expect, it } from 'vitest';

import { createEmptyDraft, type ApplicationDraft } from '../entities/ApplicationDraft';
import type { BusinessName } from '../value-objects/BusinessName';
import type { Email } from '../value-objects/Email';
import type { PersonName } from '../value-objects/PersonName';
import type { Ssn } from '../value-objects/Ssn';
import type { UsPhone } from '../value-objects/UsPhone';
import {
  canAccessStep,
  firstIncompleteStep,
  isDraftExpired,
  nextDestination,
  previousStep,
  progressFor,
  stepNumber,
  withProgressAt,
} from './applyFlow';

const now = new Date('2026-11-20T12:00:00Z');
const empty = createEmptyDraft(now);

const upToOwnership: ApplicationDraft = {
  ...empty,
  contact: { phone: '3055550123' as UsPhone, email: 'maria@example.com' as Email, accountConsent: true, promoConsent: false },
  name: { first: 'Maria' as PersonName, last: 'Lopez' as PersonName },
  incomeSource: 'business',
  business: { name: 'Rivera Plumbing LLC' as BusinessName, startedOn: { year: 2021, month: 2 } },
  ownership: 'majority',
};

describe('applyFlow', () => {
  it('numbers only the 7 stepper steps', () => {
    expect(stepNumber('contact')).toBe(1);
    expect(stepNumber('address')).toBe(6);
    expect(stepNumber('identity')).toBe(7);
    expect(stepNumber('checking')).toBeNull();
  });

  it('routes income answers to their branches', () => {
    expect(nextDestination({ ...empty, incomeSource: 'business' }, 'income')).toEqual({ kind: 'step', step: 'contact' });
    expect(nextDestination({ ...empty, incomeSource: 'gig' }, 'income')).toEqual({ kind: 'outcome', outcome: 'gigBranch' });
    expect(nextDestination({ ...empty, incomeSource: 'job' }, 'income')).toEqual({ kind: 'outcome', outcome: 'incomeNotEligible' });
  });

  it('runs Checking after Ownership, then continues to the address', () => {
    expect(nextDestination(upToOwnership, 'ownership')).toEqual({ kind: 'step', step: 'checking' });
    const checked = { ...upToOwnership, check: { returningCustomer: false, firstName: null, skippedSteps: [] } };
    expect(nextDestination(checked, 'checking')).toEqual({ kind: 'step', step: 'address' });
  });

  it('sends minority owners to their (undesigned) branch', () => {
    expect(nextDestination({ ...upToOwnership, ownership: 'minority' }, 'ownership')).toEqual({
      kind: 'outcome',
      outcome: 'minorityOwnerBranch',
    });
  });

  it('lets returning customers skip known steps and land on the first missing one', () => {
    const returning = { ...upToOwnership, check: { returningCustomer: true, firstName: 'Maria', skippedSteps: ['address' as const] } };
    expect(nextDestination(returning, 'checking')).toEqual({ kind: 'step', step: 'identity' });
    expect(previousStep(returning, 'identity')).toBe('ownership');
  });

  it('finishes into bank connection after identity', () => {
    const complete: ApplicationDraft = {
      ...upToOwnership,
      check: { returningCustomer: false, firstName: null, skippedSteps: [] },
      address: { line1: '1450 Brickell Ave', city: 'Miami', state: 'FL', zip: '33131' },
      identity: { dateOfBirth: { year: 1990, month: 0, day: 1 }, ssn: '123456789' as Ssn },
    };
    expect(nextDestination(complete, 'identity')).toEqual({ kind: 'outcome', outcome: 'bankConnection' });
  });

  it('never goes back to Checking when pressing back', () => {
    expect(previousStep(upToOwnership, 'address')).toBe('ownership');
    expect(previousStep(upToOwnership, 'contact')).toBeNull();
  });

  it('guards deep links', () => {
    expect(canAccessStep(empty, 'business')).toBe(false);
    expect(canAccessStep(upToOwnership, 'checking')).toBe(true);
    expect(firstIncompleteStep(empty)).toBe('contact');
  });

  it('never decreases progress', () => {
    const atAddress = withProgressAt(upToOwnership, 'address');
    expect(progressFor(atAddress, 'name')).toBe(86);
    expect(progressFor(empty, 'name')).toBe(29);
  });

  it('expires cached drafts after 30 days', () => {
    expect(isDraftExpired(empty, new Date('2026-12-19T12:00:00Z'))).toBe(false);
    expect(isDraftExpired(empty, new Date('2026-12-21T12:00:00Z'))).toBe(true);
  });
});
