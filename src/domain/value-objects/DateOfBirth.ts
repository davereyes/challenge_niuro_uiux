import { err, ok, type Result } from '@shared/types/result';

import { invalid, type ValidationError } from '../errors/ValidationError';
import { ageOn, isValidCalendarDate, yearsBefore, type CalendarDate } from './CalendarDate';

export type DateOfBirthError = ValidationError<'required' | 'invalidDate' | 'underage' | 'tooOld'>;

export const MINIMUM_AGE = 18;
/** Oldest year offered by the wheel (canvas). */
export const DATE_OF_BIRTH_MIN_YEAR = 1926;
/** Where the wheels start when empty (canvas). */
export const DATE_OF_BIRTH_DEFAULT: CalendarDate = { year: 1990, month: 0, day: 1 };

/** 1I/1J: required, real date, 18+ on the exact day (the prototype only checks the month). */
export const createDateOfBirth = (value: CalendarDate | null, today: CalendarDate): Result<CalendarDate, DateOfBirthError> => {
  if (!value) return err(invalid('required'));
  if (!isValidCalendarDate(value)) return err(invalid('invalidDate'));
  if (value.year < DATE_OF_BIRTH_MIN_YEAR) return err(invalid('tooOld'));
  if (ageOn(value, today) < MINIMUM_AGE) return err(invalid('underage'));
  return ok(value);
};

/** Latest date someone can be born on to be 18 today. */
export const latestDateOfBirth = (today: CalendarDate): CalendarDate => yearsBefore(today, MINIMUM_AGE);
