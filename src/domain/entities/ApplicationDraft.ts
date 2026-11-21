import type { BusinessName } from '../value-objects/BusinessName';
import type { CalendarDate, YearMonth } from '../value-objects/CalendarDate';
import type { Email } from '../value-objects/Email';
import type { HomeAddress } from '../value-objects/HomeAddress';
import type { PersonName } from '../value-objects/PersonName';
import type { Ssn } from '../value-objects/Ssn';
import type { UsPhone } from '../value-objects/UsPhone';

/** Screens of the Apply Now flow. `checking` is automatic and is not a numbered step. */
export type StepId = 'contact' | 'name' | 'income' | 'business' | 'ownership' | 'checking' | 'address' | 'identity';

export type IncomeSource = 'business' | 'gig' | 'job';

/** 1G: "51% or more" / "50% or less". */
export type Ownership = 'majority' | 'minority';

export interface ContactInfo {
  readonly phone: UsPhone;
  readonly email: Email;
  /** Required to continue [Assumed]. */
  readonly accountConsent: true;
  /** Optional, never bundled with Terms. */
  readonly promoConsent: boolean;
}

export interface FullName {
  readonly first: PersonName;
  readonly last: PersonName;
}

export interface BusinessInfo {
  readonly name: BusinessName;
  readonly startedOn: YearMonth;
}

/** Result of 1G→ (existing account + skippable steps). */
export interface ApplicantCheck {
  readonly returningCustomer: boolean;
  readonly firstName: string | null;
  readonly skippedSteps: readonly StepId[];
}

/** Sensitive: kept in memory only, never persisted. */
export interface Identity {
  readonly dateOfBirth: CalendarDate;
  readonly ssn: Ssn;
}

export interface ApplicationDraft {
  readonly contact: ContactInfo | null;
  readonly name: FullName | null;
  readonly incomeSource: IncomeSource | null;
  readonly business: BusinessInfo | null;
  readonly ownership: Ownership | null;
  readonly check: ApplicantCheck | null;
  readonly address: HomeAddress | null;
  readonly identity: Identity | null;
  /** 0–100. Only moves forward (business rule). */
  readonly furthestProgress: number;
  /** ISO timestamp of the last save (cache lifetime). */
  readonly updatedAt: string;
}

/** What may be stored on the device: everything except identity data. */
export type PersistableDraft = Omit<ApplicationDraft, 'identity'>;

export const createEmptyDraft = (now: Date): ApplicationDraft => ({
  contact: null,
  name: null,
  incomeSource: null,
  business: null,
  ownership: null,
  check: null,
  address: null,
  identity: null,
  furthestProgress: 0,
  updatedAt: now.toISOString(),
});

export const toPersistable = ({ identity: _identity, ...rest }: ApplicationDraft): PersistableDraft => rest;

export const fromPersisted = (persisted: PersistableDraft): ApplicationDraft => ({ ...persisted, identity: null });
