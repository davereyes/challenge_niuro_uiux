import { describe, expect, it } from 'vitest';

import { daysInMonth, formatCalendarDate, formatYearMonth, yearsDescending } from './calendar';

describe('calendar', () => {
  it('knows month lengths including leap years', () => {
    expect(daysInMonth(2024, 1)).toBe(29);
    expect(daysInMonth(2023, 1)).toBe(28);
    expect(daysInMonth(2026, 10)).toBe(30);
  });

  it('lists years newest first', () => {
    expect(yearsDescending(2026, 2024)).toEqual([2026, 2025, 2024]);
  });

  it('formats like the canvas', () => {
    expect(formatYearMonth({ year: 2021, month: 2 })).toBe('March 2021');
    expect(formatCalendarDate({ year: 1990, month: 5, day: 4 })).toBe('June 4, 1990');
  });
});
