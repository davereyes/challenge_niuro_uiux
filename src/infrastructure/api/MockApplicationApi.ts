import type { Result } from '@shared/types/result';
import type { ApplicationApi } from '@application/ports/ApplicationApi';
import type { ServiceError } from '@application/ports/ServiceError';
import type { StepId } from '@domain/entities/ApplicationDraft';

import { simulateRequest } from '../http/networkSimulation';

/** Stand-in for the Apply Now backend. Replace with an HTTP adapter implementing the same port. */
export class MockApplicationApi implements ApplicationApi {
  saveStep(_step: StepId, _payload: unknown): Promise<Result<void, ServiceError>> {
    return simulateRequest(() => undefined);
  }
}
