import { err, ok, type Result } from '@shared/types/result';

import { invalid, type FieldErrors } from '../errors/ValidationError';
import { isStateServed, isUsStateCode, type UsStateCode } from './UsState';

export interface HomeAddress {
  readonly line1: string;
  readonly city: string;
  readonly state: UsStateCode;
  readonly zip: string;
}

export interface HomeAddressInput {
  line1: string;
  city: string;
  state: string;
  zip: string;
}

export type HomeAddressField = keyof HomeAddressInput;

const ZIP_PATTERN = /^\d{5}$/;

/**
 * 1H: address (min 5), city (min 2), state, ZIP (5 digits).
 * State defines eligibility: CA / NY → `notServed` on the state field (2G).
 */
export const createHomeAddress = (input: HomeAddressInput): Result<HomeAddress, FieldErrors<HomeAddressField>> => {
  const line1 = input.line1.trim().replace(/\s+/g, ' ');
  const city = input.city.trim().replace(/\s+/g, ' ');
  const zip = input.zip.trim();
  const errors: FieldErrors<HomeAddressField> = {};

  if (!line1) errors.line1 = invalid('required');
  else if (line1.length < 5) errors.line1 = invalid('tooShort');

  if (!city) errors.city = invalid('required');
  else if (city.length < 2) errors.city = invalid('tooShort');

  if (!input.state) errors.state = invalid('required');
  else if (!isUsStateCode(input.state)) errors.state = invalid('format');
  else if (!isStateServed(input.state)) errors.state = invalid('notServed');

  if (!zip) errors.zip = invalid('required');
  else if (!ZIP_PATTERN.test(zip)) errors.zip = invalid('format');

  if (Object.keys(errors).length > 0) return err(errors);
  return ok({ line1, city, state: input.state as UsStateCode, zip });
};
