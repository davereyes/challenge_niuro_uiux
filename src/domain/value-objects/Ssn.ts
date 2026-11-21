import { err, ok, type Result } from '@shared/types/result';

import { invalid, type ValidationError } from '../errors/ValidationError';

export type SsnError = ValidationError<'required' | 'incomplete' | 'format'>;

declare const brand: unique symbol;
/** 9 digits, no dashes. Never persisted (kept in memory only). */
export type Ssn = string & { readonly [brand]: 'Ssn' };

/**
 * 1I: required, 9 digits. Also rejects numbers the SSA never issues:
 * area 000, 666 or 900–999; group 00; serial 0000.
 */
export const createSsn = (raw: string): Result<Ssn, SsnError> => {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return err(invalid('required'));
  if (digits.length < 9) return err(invalid('incomplete'));
  if (digits.length > 9) return err(invalid('format'));
  const area = digits.slice(0, 3);
  const group = digits.slice(3, 5);
  const serial = digits.slice(5);
  if (area === '000' || area === '666' || area.startsWith('9') || group === '00' || serial === '0000') {
    return err(invalid('format'));
  }
  return ok(digits as Ssn);
};

/** "•••-••-6789" for display after submission. */
export const maskSsn = (ssn: Ssn): string => `•••-••-${ssn.slice(5)}`;
