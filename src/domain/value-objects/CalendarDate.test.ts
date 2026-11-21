import { describe, expect, it } from 'vitest';

import { ageOn, isValidCalendarDate } from './CalendarDate';

describe('CalendarDate', () => {
  it('validates real dates', () => {
    expect(isValidCalendarDate({ year: 2024, month: 1, day: 29 })).toBe(true);
    expect(isValidCalendarDate({ year: 2023, month: 1, day: 29 })).toBe(false);
  });

  it('computes age on a given day', () => {
    expect(ageOn({ year: 1990, month: 5, day: 4 }, { year: 2026, month: 5, day: 3 })).toBe(35);
    expect(ageOn({ year: 1990, month: 5, day: 4 }, { year: 2026, month: 5, day: 4 })).toBe(36);
  });
});
