import type { Result } from '@shared/types/result';
import type { ServiceError } from '@application/ports/ServiceError';
import type { WaitlistService } from '@application/ports/WaitlistService';
import type { UsStateCode } from '@domain/value-objects/UsState';

import { simulateRequest } from '../http/networkSimulation';

/** Keeps the lead for unserved states (2G). Replace with the CRM/marketing adapter. */
export class MockWaitlistService implements WaitlistService {
  notifyWhenAvailable(_lead: { email: string | null; state: UsStateCode }): Promise<Result<void, ServiceError>> {
    return simulateRequest(() => undefined, 400);
  }
}
