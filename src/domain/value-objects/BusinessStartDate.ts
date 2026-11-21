import { err, ok, type Result } from '@shared/types/result';

import { invalid, type ValidationError } from '../errors/ValidationError';
import { compareYearMonths, type CalendarDate, type YearMonth } from './CalendarDate';

export type BusinessStartDateError = ValidationError<'required' | 'future' | 'tooOld'>;

/** Oldest year offered by the wheel (canvas). */
export const BUSINESS_START_MIN_YEAR = 1980;

/**
 * 1E/1F: month + year, future months are not selectable.
 * The "3+ months in business" requirement is validated by the backend, not here (business rule).
 */
export const createBusinessStartDate = (
  value: YearMonth | null,
  today: CalendarDate,
): Result<YearMonth, BusinessStartDateError> => {
  if (!value) return err(invalid('required'));
  if (compareYearMonths(value, { year: today.year, month: today.month }) > 0) return err(invalid('future'));
  if (value.year < BUSINESS_START_MIN_YEAR) return err(invalid('tooOld'));
  return ok(value);
};

/** Latest selectable month for the picker. */
export const latestBusinessStart = (today: CalendarDate): YearMonth => ({ year: today.year, month: today.month });
