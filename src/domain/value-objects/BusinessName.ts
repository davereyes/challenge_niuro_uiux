import { err, ok, type Result } from '@shared/types/result';

import { invalid, type ValidationError } from '../errors/ValidationError';

export type BusinessNameError = ValidationError<'required' | 'tooShort' | 'tooLong'>;

declare const brand: unique symbol;
export type BusinessName = string & { readonly [brand]: 'BusinessName' };

const MIN_LENGTH = 2;
const MAX_LENGTH = 100;

/** 1E: required, min 2 characters (must match the bank account name — checked later by the bank step). */
export const createBusinessName = (raw: string): Result<BusinessName, BusinessNameError> => {
  const value = raw.trim().replace(/\s+/g, ' ');
  if (!value) return err(invalid('required'));
  if (value.length < MIN_LENGTH) return err(invalid('tooShort'));
  if (value.length > MAX_LENGTH) return err(invalid('tooLong'));
  return ok(value as BusinessName);
};
