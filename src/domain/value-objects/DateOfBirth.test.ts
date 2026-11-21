import { describe, expect, it } from 'vitest';

import { createDateOfBirth, latestDateOfBirth } from './DateOfBirth';

const today = { year: 2026, month: 10, day: 20 }; // Nov 20, 2026

describe('DateOfBirth', () => {
  it('accepts someone who turns 18 today', () => {
    expect(createDateOfBirth({ year: 2008, month: 10, day: 20 }, today).ok).toBe(true);
  });

  it('rejects someone who turns 18 tomorrow (exact day, not month)', () => {
    expect(createDateOfBirth({ year: 2008, month: 10, day: 21 }, today)).toEqual({ ok: false, error: { code: 'underage' } });
  });

  it('rejects impossible dates', () => {
    expect(createDateOfBirth({ year: 1990, month: 1, day: 30 }, today)).toEqual({ ok: false, error: { code: 'invalidDate' } });
  });

  it('handles leap-day birthdays for the max date', () => {
    expect(latestDateOfBirth({ year: 2026, month: 1, day: 28 })).toEqual({ year: 2008, month: 1, day: 28 });
    expect(latestDateOfBirth({ year: 2028, month: 1, day: 29 })).toEqual({ year: 2010, month: 1, day: 28 });
  });
});
