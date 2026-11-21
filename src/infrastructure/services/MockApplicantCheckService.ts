import type { Result } from '@shared/types/result';
import type { ApplicantCheckResult, ApplicantCheckService } from '@application/ports/ApplicantCheckService';
import type { ServiceError } from '@application/ports/ServiceError';
import type { Email } from '@domain/value-objects/Email';
import type { UsPhone } from '@domain/value-objects/UsPhone';

import { simulateRequest } from '../http/networkSimulation';

/**
 * Demo data: any email starting with "returning" (e.g. returning@fundo.test) is an existing
 * customer "Maria" with an address on file → skips 1H and lands on Identity (2F).
 */
export class MockApplicantCheckService implements ApplicantCheckService {
  check({ email }: { email: Email; phone: UsPhone }): Promise<Result<ApplicantCheckResult, ServiceError>> {
    return simulateRequest<ApplicantCheckResult>(() =>
      email.startsWith('returning')
        ? {
            found: true,
            firstName: 'Maria',
            knownAddress: { line1: '1450 Brickell Ave, Apt 2101', city: 'Miami', state: 'FL', zip: '33131' },
          }
        : { found: false, firstName: null, knownAddress: null },
    );
  }
}
