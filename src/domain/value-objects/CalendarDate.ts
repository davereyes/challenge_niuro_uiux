/** Plain calendar date without time zone. `month` is 0-based (0 = January) like Date. */
export interface CalendarDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

export interface YearMonth {
  readonly year: number;
  readonly month: number;
}

export const daysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();

export const isValidCalendarDate = ({ year, month, day }: CalendarDate): boolean =>
  Number.isInteger(year) &&
  Number.isInteger(month) &&
  Number.isInteger(day) &&
  month >= 0 &&
  month <= 11 &&
  day >= 1 &&
  day <= daysInMonth(year, month);

export const compareDates = (a: CalendarDate, b: CalendarDate): number =>
  a.year - b.year || a.month - b.month || a.day - b.day;

export const compareYearMonths = (a: YearMonth, b: YearMonth): number => a.year - b.year || a.month - b.month;

export const toCalendarDate = (date: Date): CalendarDate => ({
  year: date.getFullYear(),
  month: date.getMonth(),
  day: date.getDate(),
});

/** Full years between `birth` and `today`. */
export const ageOn = (birth: CalendarDate, today: CalendarDate): number => {
  const hadBirthday = today.month > birth.month || (today.month === birth.month && today.day >= birth.day);
  return today.year - birth.year - (hadBirthday ? 0 : 1);
};

/** Same day N years earlier; Feb 29 falls back to Feb 28. */
export const yearsBefore = (date: CalendarDate, years: number): CalendarDate => {
  const year = date.year - years;
  return { year, month: date.month, day: Math.min(date.day, daysInMonth(year, date.month)) };
};
