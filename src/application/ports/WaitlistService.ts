import type { Result } from '@shared/types/result';
import type { UsStateCode } from '@domain/value-objects/UsState';

import type { ServiceError } from './ServiceError';

/** 2G "Notify me when it's available": keeps the lead for unserved states [Assumed]. */
export interface WaitlistService {
  notifyWhenAvailable(lead: { email: string | null; state: UsStateCode }): Promise<Result<void, ServiceError>>;
}
