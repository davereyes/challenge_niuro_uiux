import { err, ok, type Result } from '@shared/types/result';

import { invalid, type ValidationError } from '../errors/ValidationError';

export type UsPhoneError = ValidationError<'required' | 'incomplete' | 'format'>;

declare const brand: unique symbol;
/** 10 digits, no formatting: "3055550123". */
export type UsPhone = string & { readonly [brand]: 'UsPhone' };

/** NANP: area code and exchange start with 2–9. */
const NANP_PATTERN = /^[2-9]\d{2}[2-9]\d{6}$/;

/** 1B: required, US 10 digits. Accepts formatting and a leading country code "1". */
export const createUsPhone = (raw: string): Result<UsPhone, UsPhoneError> => {
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (!digits) return err(invalid('required'));
  if (digits.length < 10) return err(invalid('incomplete'));
  if (digits.length > 10 || !NANP_PATTERN.test(digits)) return err(invalid('format'));
  return ok(digits as UsPhone);
};
