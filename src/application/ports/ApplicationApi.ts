import type { Result } from '@shared/types/result';
import type { StepId } from '@domain/entities/ApplicationDraft';

import type { ServiceError } from './ServiceError';

/** Backend that receives each completed step ("Any Continue that calls the server", canvas 2H). */
export interface ApplicationApi {
  saveStep(step: StepId, payload: unknown): Promise<Result<void, ServiceError>>;
}
