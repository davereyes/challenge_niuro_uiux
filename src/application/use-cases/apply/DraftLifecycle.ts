import {
  createEmptyDraft,
  fromPersisted,
  type ApplicationDraft,
  type StepId,
} from '@domain/entities/ApplicationDraft';
import type { ApplicationDraftRepository } from '@domain/repositories/ApplicationDraftRepository';
import { firstIncompleteStep, hasProgress, isDraftExpired } from '@domain/services/applyFlow';

import type { Clock } from '../../ports/Clock';

export interface LoadedDraft {
  readonly draft: ApplicationDraft;
  /** True when there is cached progress to offer "Continue application" (2D). */
  readonly canResume: boolean;
  /** First step still to do (for the resume sheet). */
  readonly resumeStep: StepId | null;
}

/** Loads cached progress (expired after 30 days) to resume the application. */
export class GetApplicationDraftUseCase {
  private readonly repository: ApplicationDraftRepository;
  private readonly clock: Clock;

  constructor(repository: ApplicationDraftRepository, clock: Clock) {
    this.repository = repository;
    this.clock = clock;
  }

  async execute(): Promise<LoadedDraft> {
    const now = this.clock.now();
    const persisted = await this.repository.load().catch(() => null);
    if (!persisted) return { draft: createEmptyDraft(now), canResume: false, resumeStep: 'contact' };

    const draft = fromPersisted(persisted);
    if (isDraftExpired(draft, now)) {
      await this.repository.clear();
      return { draft: createEmptyDraft(now), canResume: false, resumeStep: 'contact' };
    }
    return { draft, canResume: hasProgress(draft), resumeStep: firstIncompleteStep(draft) };
  }
}

/** 2D "Start over": clears the cache. */
export class StartOverUseCase {
  private readonly repository: ApplicationDraftRepository;
  private readonly clock: Clock;

  constructor(repository: ApplicationDraftRepository, clock: Clock) {
    this.repository = repository;
    this.clock = clock;
  }

  async execute(): Promise<ApplicationDraft> {
    await this.repository.clear();
    return createEmptyDraft(this.clock.now());
  }
}
