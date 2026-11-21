import { describe, expect, it } from 'vitest';

import { validateBusiness, validateContact, validateIdentity, validateName } from './stepValidation';

const today = { year: 2026, month: 10, day: 20 };

describe('stepValidation', () => {
  it('requires the account consent but not the promo one (1B)', () => {
    const result = validateContact({ phone: '(305) 555-0123', email: 'maria@example.com', accountConsent: false, promoConsent: false });
    expect(result).toEqual({ ok: false, error: { accountConsent: { code: 'required' } } });
    expect(validateContact({ phone: '3055550123', email: 'maria@example.com', accountConsent: true, promoConsent: false }).ok).toBe(true);
  });

  it('returns every field error at once', () => {
    expect(validateName({ first: '', last: 'L0pez' })).toEqual({
      ok: false,
      error: { first: { code: 'required' }, last: { code: 'format' } },
    });
  });

  it('validates business with the clock', () => {
    expect(validateBusiness({ name: 'Rivera Plumbing', startedOn: { year: 2027, month: 0 } }, today)).toEqual({
      ok: false,
      error: { startedOn: { code: 'future' } },
    });
  });

  it('validates identity', () => {
    expect(validateIdentity({ dateOfBirth: { year: 1990, month: 5, day: 4 }, ssn: '123-45-6789' }, today).ok).toBe(true);
    expect(validateIdentity({ dateOfBirth: null, ssn: '' }, today)).toEqual({
      ok: false,
      error: { dateOfBirth: { code: 'required' }, ssn: { code: 'required' } },
    });
  });
});
