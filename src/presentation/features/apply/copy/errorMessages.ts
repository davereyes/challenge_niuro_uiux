import type { ValidationError } from '@domain/errors/ValidationError';

/**
 * User-facing copy for domain validation codes (UI copy in English, like the canvas).
 * Keys: field → code → message.
 */
const MESSAGES: Record<string, Record<string, string>> = {
  phone: {
    required: 'Enter your mobile number',
    incomplete: 'Enter a 10-digit US mobile number',
    format: 'Enter a valid US mobile number',
  },
  email: {
    required: 'Enter your email',
    format: 'Enter a valid email, like name@example.com',
  },
  first: { required: 'Enter your first name', format: 'Use letters only', tooLong: 'Use 50 characters or fewer' },
  last: { required: 'Enter your last name', format: 'Use letters only', tooLong: 'Use 50 characters or fewer' },
  businessName: {
    required: 'Enter your business name',
    tooShort: 'Enter at least 2 characters',
    tooLong: 'Use 100 characters or fewer',
  },
  startedOn: { required: 'Pick the month your business started', future: 'Pick a month that has already started' },
  line1: { required: 'Enter your street address', tooShort: 'Enter your full street address' },
  city: { required: 'Enter your city', tooShort: 'Enter your full city name' },
  state: { required: 'Pick your state', format: 'Pick your state' },
  zip: { required: 'Enter your ZIP code', format: 'Enter a 5-digit ZIP code' },
  dateOfBirth: {
    required: 'Pick your date of birth',
    invalidDate: 'Pick a valid date',
    underage: 'You must be 18 or older to apply',
    tooOld: 'Pick a valid date',
  },
  ssn: {
    required: 'Enter your Social Security number',
    incomplete: 'Enter all 9 digits',
    format: 'Enter a valid Social Security number',
  },
};

export const errorMessage = (field: string, error: ValidationError | undefined): string | undefined =>
  error ? (MESSAGES[field]?.[error.code] ?? 'Check this field') : undefined;
