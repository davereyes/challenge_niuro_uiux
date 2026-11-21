import { err, ok, type Result } from '@shared/types/result';

import type { BusinessInfo, ContactInfo, FullName, Identity, IncomeSource, Ownership } from '../entities/ApplicationDraft';
import { invalid, type FieldErrors, type ValidationError } from '../errors/ValidationError';
import { createBusinessName } from '../value-objects/BusinessName';
import { createBusinessStartDate } from '../value-objects/BusinessStartDate';
import type { CalendarDate, YearMonth } from '../value-objects/CalendarDate';
import { createDateOfBirth } from '../value-objects/DateOfBirth';
import { createEmail } from '../value-objects/Email';
import { createPersonName } from '../value-objects/PersonName';
import { createSsn } from '../value-objects/Ssn';
import { createUsPhone } from '../value-objects/UsPhone';

const collect = <Field extends string>(entries: [Field, Result<unknown, ValidationError>][]): FieldErrors<Field> => {
  const errors: FieldErrors<Field> = {};
  for (const [field, result] of entries) if (!result.ok) errors[field] = result.error;
  return errors;
};

const hasErrors = (errors: object) => Object.keys(errors).length > 0;

// 1B · Contact
export interface ContactInput {
  phone: string;
  email: string;
  accountConsent: boolean;
  promoConsent: boolean;
}
export type ContactField = 'phone' | 'email' | 'accountConsent';

export const validateContact = (input: ContactInput): Result<ContactInfo, FieldErrors<ContactField>> => {
  const phone = createUsPhone(input.phone);
  const email = createEmail(input.email);
  const consent: Result<true, ValidationError> = input.accountConsent ? ok(true) : err(invalid('required'));
  const errors = collect<ContactField>([
    ['phone', phone],
    ['email', email],
    ['accountConsent', consent],
  ]);
  if (hasErrors(errors) || !phone.ok || !email.ok) return err(errors);
  return ok({ phone: phone.value, email: email.value, accountConsent: true, promoConsent: input.promoConsent });
};

// 1C · Name
export interface NameInput {
  first: string;
  last: string;
}
export type NameField = keyof NameInput;

export const validateName = (input: NameInput): Result<FullName, FieldErrors<NameField>> => {
  const first = createPersonName(input.first);
  const last = createPersonName(input.last);
  const errors = collect<NameField>([
    ['first', first],
    ['last', last],
  ]);
  if (!first.ok || !last.ok) return err(errors);
  return ok({ first: first.value, last: last.value });
};

// 1D · Income source
export const validateIncomeSource = (value: IncomeSource | null): Result<IncomeSource, FieldErrors<'incomeSource'>> =>
  value ? ok(value) : err({ incomeSource: invalid('required') });

// 1E · Business
export interface BusinessInput {
  name: string;
  startedOn: YearMonth | null;
}
export type BusinessField = keyof BusinessInput;

export const validateBusiness = (
  input: BusinessInput,
  today: CalendarDate,
): Result<BusinessInfo, FieldErrors<BusinessField>> => {
  const name = createBusinessName(input.name);
  const startedOn = createBusinessStartDate(input.startedOn, today);
  const errors = collect<BusinessField>([
    ['name', name],
    ['startedOn', startedOn],
  ]);
  if (!name.ok || !startedOn.ok) return err(errors);
  return ok({ name: name.value, startedOn: startedOn.value });
};

// 1G · Ownership
export const validateOwnership = (value: Ownership | null): Result<Ownership, FieldErrors<'ownership'>> =>
  value ? ok(value) : err({ ownership: invalid('required') });

// 1I · Identity
export interface IdentityInput {
  dateOfBirth: CalendarDate | null;
  ssn: string;
}
export type IdentityField = keyof IdentityInput;

export const validateIdentity = (input: IdentityInput, today: CalendarDate): Result<Identity, FieldErrors<IdentityField>> => {
  const dateOfBirth = createDateOfBirth(input.dateOfBirth, today);
  const ssn = createSsn(input.ssn);
  const errors = collect<IdentityField>([
    ['dateOfBirth', dateOfBirth],
    ['ssn', ssn],
  ]);
  if (!dateOfBirth.ok || !ssn.ok) return err(errors);
  return ok({ dateOfBirth: dateOfBirth.value, ssn: ssn.value });
};
