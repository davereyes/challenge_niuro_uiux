import { err, ok, type Result } from '@shared/types/result';

import { invalid, type ValidationError } from '../errors/ValidationError';

export type PersonNameError = ValidationError<'required' | 'format' | 'tooLong'>;

declare const brand: unique symbol;
export type PersonName = string & { readonly [brand]: 'PersonName' };

/**
 * Letters only (any alphabet), allowing single spaces, hyphens and apostrophes *between* letters:
 * "Mary-Jane", "O'Brien", "De la Cruz". Edge case beyond the brief ("letters only").
 */
const NAME_PATTERN = /^\p{L}+(?:[ '’-]\p{L}+)*$/u;
const MAX_LENGTH = 50;

/** 1C: first/last name. Required, letters only, min 1 character. */
export const createPersonName = (raw: string): Result<PersonName, PersonNameError> => {
  const value = raw.trim().replace(/\s+/g, ' ');
  if (!value) return err(invalid('required'));
  if (value.length > MAX_LENGTH) return err(invalid('tooLong'));
  if (!NAME_PATTERN.test(value)) return err(invalid('format'));
  return ok(value as PersonName);
};
