/** Calendar helpers for the date wheels. Month is 0-based (0 = January), like Date. */
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export interface YearMonth {
  year: number;
  month: number;
}

export interface CalendarDate extends YearMonth {
  /** 1-based day of month */
  day: number;
}

export const daysInMonth = (year: number, month: number): number => new Date(year, month + 1, 0).getDate();

/** Years from `from` down to `to` (inclusive), newest first — as in the canvas wheels. */
export const yearsDescending = (from: number, to: number): number[] =>
  Array.from({ length: Math.max(0, from - to + 1) }, (_, index) => from - index);

export const formatYearMonth = ({ year, month }: YearMonth): string => `${MONTH_NAMES[month] ?? ''} ${year}`;

export const formatCalendarDate = ({ year, month, day }: CalendarDate): string =>
  `${MONTH_NAMES[month] ?? ''} ${day}, ${year}`;
