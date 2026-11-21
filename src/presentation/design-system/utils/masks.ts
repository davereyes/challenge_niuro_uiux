/**
 * Display masks for inputs. Pure functions: they only format what the user sees.
 * Validation (is this a valid phone/SSN/ZIP?) belongs to the domain layer.
 */
export type InputMask = 'none' | 'phone' | 'ssn' | 'zip';

export const digitsOnly = (value: string): string => value.replace(/\D/g, '');

/** US phone: (305) 555-0123. A leading country code "1" from paste/autofill is dropped. */
export const formatPhone = (value: string): string => {
  let digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

/** SSN: 123-45-6789 */
export const formatSsn = (value: string): string => {
  const digits = digitsOnly(value).slice(0, 9);
  if (digits.length < 4) return digits;
  if (digits.length < 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
};

/** ZIP: 5 digits */
export const formatZip = (value: string): string => digitsOnly(value).slice(0, 5);

export const applyMask = (mask: InputMask, value: string): string => {
  switch (mask) {
    case 'phone':
      return formatPhone(value);
    case 'ssn':
      return formatSsn(value);
    case 'zip':
      return formatZip(value);
    case 'none':
      return value;
  }
};

/** Max visible length per mask (used as maxLength). */
export const MASK_MAX_LENGTH: Record<Exclude<InputMask, 'none'>, number> = {
  phone: 14,
  ssn: 11,
  zip: 5,
};
