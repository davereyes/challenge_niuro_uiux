import { err, ok, type Result } from '@shared/types/result';

import { invalid, type ValidationError } from '../errors/ValidationError';

export type EmailError = ValidationError<'required' | 'format'>;

declare const brand: unique symbol;
export type Email = string & { readonly [brand]: 'Email' };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LENGTH = 254;

/** 1B: required, valid format. Normalized: trimmed and lower-cased. */
export const createEmail = (raw: string): Result<Email, EmailError> => {
  const value = raw.trim().toLowerCase();
  if (!value) return err(invalid('required'));
  if (value.length > MAX_LENGTH || !EMAIL_PATTERN.test(value)) return err(invalid('format'));
  return ok(value as Email);
};
