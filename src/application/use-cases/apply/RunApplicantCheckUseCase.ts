import { ok, type Result } from '@shared/types/result';
import { toPersistable, type ApplicationDraft, type StepId } from '@domain/entities/ApplicationDraft';
import type { ApplicationDraftRepository } from '@domain/repositories/ApplicationDraftRepository';
import { nextDestination, withProgressAt } from '@domain/services/applyFlow';

import type { StepSubmission } from '../../dto/StepSubmission';
import type { ApplicantCheckService } from '../../ports/ApplicantCheckService';
import type { Clock } from '../../ports/Clock';

export interface ApplicantCheckOutcome extends StepSubmission {
  /** 2F "Welcome back": an existing account was found. */
  readonly returningCustomer: boolean;
}

/**
 * 1G→ automatic check. Never blocks the user: if the service fails, continue as a new customer.
 * Returning customers skip the steps already on file and land on the first missing one.
 */
export class RunApplicantCheckUseCase {
  private readonly service: ApplicantCheckService;
  private readonly repository: ApplicationDraftRepository;
  private readonly clock: Clock;

  constructor(service: ApplicantCheckService, repository: ApplicationDraftRepository, clock: Clock) {
    this.service = service;
    this.repository = repository;
    this.clock = clock;
  }

  async execute(draft: ApplicationDraft): Promise<Result<ApplicantCheckOutcome, never>> {
    const contact = draft.contact;
    const response = contact ? await this.service.check({ email: contact.email, phone: contact.phone }) : null;
    const found = response?.ok === true && response.value.found;
    const knownAddress = response?.ok ? response.value.knownAddress : null;

    const skippedSteps: StepId[] = found && knownAddress ? ['address'] : [];
    const checked: ApplicationDraft = {
      ...draft,
      address: found && knownAddress ? knownAddress : draft.address,
      check: {
        returningCustomer: found,
        firstName: found && response?.ok ? response.value.firstName : null,
        skippedSteps,
      },
      updatedAt: this.clock.now().toISOString(),
    };

    const destination = nextDestination(checked, 'checking');
    const updated = destination.kind === 'step' ? withProgressAt(checked, destination.step) : checked;
    await this.repository.save(toPersistable(updated));
    return ok({ draft: updated, destination, returningCustomer: found });
  }
}
