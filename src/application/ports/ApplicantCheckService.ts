import type { Result } from '@shared/types/result';
import type { Email } from '@domain/value-objects/Email';
import type { HomeAddress } from '@domain/value-objects/HomeAddress';
import type { UsPhone } from '@domain/value-objects/UsPhone';

import type { ServiceError } from './ServiceError';

export interface ApplicantCheckResult {
  /** An account already exists for this email/phone. */
  readonly found: boolean;
  readonly firstName: string | null;
  /** Data on file that lets the user skip steps. */
  readonly knownAddress: HomeAddress | null;
}

/** 1G→: "Checking if you already have an account" / "Seeing if you can skip some steps". */
export interface ApplicantCheckService {
  check(contact: { email: Email; phone: UsPhone }): Promise<Result<ApplicantCheckResult, ServiceError>>;
}
