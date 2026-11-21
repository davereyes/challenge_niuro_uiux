import { err, type Result } from '@shared/types/result';
import type { ApplicationDraft, IncomeSource, Ownership } from '@domain/entities/ApplicationDraft';
import {
  validateBusiness,
  validateContact,
  validateIdentity,
  validateIncomeSource,
  validateName,
  validateOwnership,
  type BusinessField,
  type BusinessInput,
  type ContactField,
  type ContactInput,
  type IdentityField,
  type IdentityInput,
  type NameField,
  type NameInput,
} from '@domain/services/stepValidation';
import { toCalendarDate } from '@domain/value-objects/CalendarDate';
import { createHomeAddress, type HomeAddressField, type HomeAddressInput } from '@domain/value-objects/HomeAddress';

import type { StepSubmission, StepSubmissionError } from '../../dto/StepSubmission';
import type { Clock } from '../../ports/Clock';
import type { StepPersistence } from './StepPersistence';

type Submission<Field extends string> = Promise<Result<StepSubmission, StepSubmissionError<Field>>>;

/** 1B */
export class SubmitContactUseCase {
  private readonly persistence: StepPersistence;

  constructor(persistence: StepPersistence) {
    this.persistence = persistence;
  }

  async execute(draft: ApplicationDraft, input: ContactInput): Submission<ContactField> {
    const contact = validateContact(input);
    if (!contact.ok) return err({ kind: 'validation', errors: contact.error });
    // New contact data invalidates a previous account check.
    const changed = draft.contact?.email !== contact.value.email || draft.contact?.phone !== contact.value.phone;
    return this.persistence.commit('contact', contact.value, { ...draft, contact: contact.value, check: changed ? null : draft.check });
  }
}

/** 1C */
export class SubmitNameUseCase {
  private readonly persistence: StepPersistence;

  constructor(persistence: StepPersistence) {
    this.persistence = persistence;
  }

  async execute(draft: ApplicationDraft, input: NameInput): Submission<NameField> {
    const name = validateName(input);
    if (!name.ok) return err({ kind: 'validation', errors: name.error });
    return this.persistence.commit('name', name.value, { ...draft, name: name.value });
  }
}

/** 1D: business → 1E · gig → (undesigned branch) · job → not eligible (2E). */
export class SubmitIncomeSourceUseCase {
  private readonly persistence: StepPersistence;

  constructor(persistence: StepPersistence) {
    this.persistence = persistence;
  }

  async execute(draft: ApplicationDraft, value: IncomeSource | null): Submission<'incomeSource'> {
    const income = validateIncomeSource(value);
    if (!income.ok) return err({ kind: 'validation', errors: income.error });
    return this.persistence.commit('income', income.value, { ...draft, incomeSource: income.value });
  }
}

/** 1E */
export class SubmitBusinessUseCase {
  private readonly persistence: StepPersistence;
  private readonly clock: Clock;

  constructor(persistence: StepPersistence, clock: Clock) {
    this.persistence = persistence;
    this.clock = clock;
  }

  async execute(draft: ApplicationDraft, input: BusinessInput): Submission<BusinessField> {
    const business = validateBusiness(input, toCalendarDate(this.clock.now()));
    if (!business.ok) return err({ kind: 'validation', errors: business.error });
    return this.persistence.commit('business', business.value, { ...draft, business: business.value });
  }
}

/** 1G: 51%+ → Checking · 50% or less → (undesigned branch). */
export class SubmitOwnershipUseCase {
  private readonly persistence: StepPersistence;

  constructor(persistence: StepPersistence) {
    this.persistence = persistence;
  }

  async execute(draft: ApplicationDraft, value: Ownership | null): Submission<'ownership'> {
    const ownership = validateOwnership(value);
    if (!ownership.ok) return err({ kind: 'validation', errors: ownership.error });
    return this.persistence.commit('ownership', ownership.value, { ...draft, ownership: ownership.value });
  }
}

/** 1H: unserved states (CA/NY) come back as a validation error on `state` (2G). */
export class SubmitHomeAddressUseCase {
  private readonly persistence: StepPersistence;

  constructor(persistence: StepPersistence) {
    this.persistence = persistence;
  }

  async execute(draft: ApplicationDraft, input: HomeAddressInput): Submission<HomeAddressField> {
    const address = createHomeAddress(input);
    if (!address.ok) return err({ kind: 'validation', errors: address.error });
    return this.persistence.commit('address', address.value, { ...draft, address: address.value });
  }
}

/** 1I: identity is sent to the backend and kept in memory, never cached on the device. */
export class SubmitIdentityUseCase {
  private readonly persistence: StepPersistence;
  private readonly clock: Clock;

  constructor(persistence: StepPersistence, clock: Clock) {
    this.persistence = persistence;
    this.clock = clock;
  }

  async execute(draft: ApplicationDraft, input: IdentityInput): Submission<IdentityField> {
    const identity = validateIdentity(input, toCalendarDate(this.clock.now()));
    if (!identity.ok) return err({ kind: 'validation', errors: identity.error });
    return this.persistence.commit('identity', identity.value, { ...draft, identity: identity.value });
  }
}
