import { describe, expect, it } from 'vitest';

import { createBusinessStartDate, latestBusinessStart } from './BusinessStartDate';

const today = { year: 2026, month: 10, day: 20 }; // Nov 20, 2026

describe('BusinessStartDate', () => {
  it('accepts the current and past months', () => {
    expect(createBusinessStartDate({ year: 2026, month: 10 }, today).ok).toBe(true);
    expect(createBusinessStartDate({ year: 2021, month: 2 }, today).ok).toBe(true);
  });

  it('rejects future months and empty values', () => {
    expect(createBusinessStartDate({ year: 2026, month: 11 }, today)).toEqual({ ok: false, error: { code: 'future' } });
    expect(createBusinessStartDate(null, today)).toEqual({ ok: false, error: { code: 'required' } });
  });

  it('does not block businesses younger than 3 months (backend rule)', () => {
    expect(createBusinessStartDate({ year: 2026, month: 9 }, today).ok).toBe(true);
  });

  it('exposes the latest selectable month', () => {
    expect(latestBusinessStart(today)).toEqual({ year: 2026, month: 10 });
  });
});
