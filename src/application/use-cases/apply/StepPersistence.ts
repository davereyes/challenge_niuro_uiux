import { err, ok, type Result } from '@shared/types/result';
import { toPersistable, type ApplicationDraft, type StepId } from '@domain/entities/ApplicationDraft';
import type { ApplicationDraftRepository } from '@domain/repositories/ApplicationDraftRepository';
import { nextDestination, withProgressAt } from '@domain/services/applyFlow';

import type { StepSubmission, StepSubmissionError } from '../../dto/StepSubmission';
import type { ApplicationApi } from '../../ports/ApplicationApi';
import type { Clock } from '../../ports/Clock';

/**
 * Shared commit of a validated step: send it to the backend, update the draft,
 * move progress forward (never back) and cache it on the device without identity data.
 */
export class StepPersistence {
  private readonly api: ApplicationApi;
  private readonly repository: ApplicationDraftRepository;
  private readonly clock: Clock;

  constructor(api: ApplicationApi, repository: ApplicationDraftRepository, clock: Clock) {
    this.api = api;
    this.repository = repository;
    this.clock = clock;
  }

  async commit(
    step: StepId,
    payload: unknown,
    updated: ApplicationDraft,
  ): Promise<Result<StepSubmission, StepSubmissionError<never>>> {
    const saved = await this.api.saveStep(step, payload);
    if (!saved.ok) return err({ kind: 'network' });

    const stamped: ApplicationDraft = { ...updated, updatedAt: this.clock.now().toISOString() };
    const destination = nextDestination(stamped, step);
    const draft = destination.kind === 'step' ? withProgressAt(stamped, destination.step) : stamped;

    await this.repository.save(toPersistable(draft));
    return ok({ draft, destination });
  }
}
