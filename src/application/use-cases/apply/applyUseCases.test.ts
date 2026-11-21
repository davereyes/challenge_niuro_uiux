import { describe, expect, it } from 'vitest';

import { err, ok } from '@shared/types/result';
import { createEmptyDraft, type ApplicationDraft, type PersistableDraft } from '@domain/entities/ApplicationDraft';
import type { ApplicationDraftRepository } from '@domain/repositories/ApplicationDraftRepository';
import type { BusinessName } from '@domain/value-objects/BusinessName';
import type { Email } from '@domain/value-objects/Email';
import type { PersonName } from '@domain/value-objects/PersonName';
import type { UsPhone } from '@domain/value-objects/UsPhone';

import type { ApplicantCheckService } from '../../ports/ApplicantCheckService';
import type { ApplicationApi } from '../../ports/ApplicationApi';
import { networkError } from '../../ports/ServiceError';
import { SearchAddressesUseCase } from './AddressUseCases';
import { GetApplicationDraftUseCase, StartOverUseCase } from './DraftLifecycle';
import { RunApplicantCheckUseCase } from './RunApplicantCheckUseCase';
import { StepPersistence } from './StepPersistence';
import { SubmitContactUseCase, SubmitHomeAddressUseCase, SubmitIdentityUseCase, SubmitIncomeSourceUseCase } from './SubmitSteps';

const NOW = new Date('2026-11-20T12:00:00Z');
const clock = { now: () => NOW };

class MemoryRepository implements ApplicationDraftRepository {
  stored: PersistableDraft | null = null;
  async load() {
    return this.stored;
  }
  async save(draft: PersistableDraft) {
    this.stored = draft;
  }
  async clear() {
    this.stored = null;
  }
}

const onlineApi: ApplicationApi = { saveStep: async () => ok(undefined) };
const offlineApi: ApplicationApi = { saveStep: async () => err(networkError) };

const setup = (api: ApplicationApi = onlineApi) => {
  const repository = new MemoryRepository();
  const persistence = new StepPersistence(api, repository, clock);
  return { repository, persistence };
};

const afterOwnership: ApplicationDraft = {
  ...createEmptyDraft(NOW),
  contact: { phone: '3055550123' as UsPhone, email: 'maria@example.com' as Email, accountConsent: true, promoConsent: false },
  name: { first: 'Maria' as PersonName, last: 'Lopez' as PersonName },
  incomeSource: 'business',
  business: { name: 'Rivera Plumbing' as BusinessName, startedOn: { year: 2021, month: 2 } },
  ownership: 'majority',
  furthestProgress: 79,
};

describe('Submit steps', () => {
  it('returns field errors without calling the backend', async () => {
    const { persistence, repository } = setup();
    const result = await new SubmitContactUseCase(persistence).execute(createEmptyDraft(NOW), {
      phone: '305',
      email: 'maria@gmail',
      accountConsent: true,
      promoConsent: false,
    });
    expect(result).toEqual({
      ok: false,
      error: { kind: 'validation', errors: { phone: { code: 'incomplete' }, email: { code: 'format' } } },
    });
    expect(repository.stored).toBeNull();
  });

  it('keeps data and reports a network error when the backend fails (2I)', async () => {
    const { persistence } = setup(offlineApi);
    const result = await new SubmitContactUseCase(persistence).execute(createEmptyDraft(NOW), {
      phone: '3055550123',
      email: 'maria@example.com',
      accountConsent: true,
      promoConsent: true,
    });
    expect(result).toEqual({ ok: false, error: { kind: 'network' } });
  });

  it('saves the step, advances progress and returns the next step', async () => {
    const { persistence, repository } = setup();
    const result = await new SubmitContactUseCase(persistence).execute(createEmptyDraft(NOW), {
      phone: '(305) 555-0123',
      email: 'Maria@Example.com',
      accountConsent: true,
      promoConsent: false,
    });
    expect(result.ok && result.value.destination).toEqual({ kind: 'step', step: 'name' });
    expect(result.ok && result.value.draft.furthestProgress).toBe(29);
    expect(repository.stored?.contact?.email).toBe('maria@example.com');
  });

  it('routes "A job or other income" to not eligible (2E)', async () => {
    const { persistence } = setup();
    const result = await new SubmitIncomeSourceUseCase(persistence).execute(afterOwnership, 'job');
    expect(result.ok && result.value.destination).toEqual({ kind: 'outcome', outcome: 'incomeNotEligible' });
  });

  it('blocks unserved states with an inline error (2G)', async () => {
    const { persistence } = setup();
    const result = await new SubmitHomeAddressUseCase(persistence).execute(afterOwnership, {
      line1: '742 Market St, Apt 5',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
    });
    expect(result).toEqual({ ok: false, error: { kind: 'validation', errors: { state: { code: 'notServed' } } } });
  });

  it('never caches identity data on the device', async () => {
    const { persistence, repository } = setup();
    const result = await new SubmitIdentityUseCase(persistence, clock).execute(afterOwnership, {
      dateOfBirth: { year: 1990, month: 5, day: 4 },
      ssn: '123-45-6789',
    });
    expect(result.ok && result.value.draft.identity?.ssn).toBe('123456789');
    expect(repository.stored).not.toHaveProperty('identity');
  });
});

describe('RunApplicantCheckUseCase', () => {
  it('lets a returning customer skip known steps (2F)', async () => {
    const repository = new MemoryRepository();
    const service: ApplicantCheckService = {
      check: async () =>
        ok({ found: true, firstName: 'Maria', knownAddress: { line1: '1450 Brickell Ave', city: 'Miami', state: 'FL', zip: '33131' } }),
    };
    const result = await new RunApplicantCheckUseCase(service, repository, clock).execute(afterOwnership);
    expect(result.ok && result.value.returningCustomer).toBe(true);
    expect(result.ok && result.value.destination).toEqual({ kind: 'step', step: 'identity' });
    expect(result.ok && result.value.draft.furthestProgress).toBe(100);
  });

  it('continues as a new customer when the service fails', async () => {
    const repository = new MemoryRepository();
    const service: ApplicantCheckService = { check: async () => err(networkError) };
    const result = await new RunApplicantCheckUseCase(service, repository, clock).execute(afterOwnership);
    expect(result.ok && result.value.destination).toEqual({ kind: 'step', step: 'address' });
    expect(result.ok && result.value.returningCustomer).toBe(false);
  });
});

describe('Draft lifecycle', () => {
  it('offers to resume cached progress (2D)', async () => {
    const repository = new MemoryRepository();
    repository.stored = { ...afterOwnership, updatedAt: NOW.toISOString() };
    const loaded = await new GetApplicationDraftUseCase(repository, clock).execute();
    expect(loaded.canResume).toBe(true);
    expect(loaded.resumeStep).toBe('checking');
  });

  it('drops progress older than 30 days', async () => {
    const repository = new MemoryRepository();
    repository.stored = { ...afterOwnership, updatedAt: '2026-10-01T00:00:00Z' };
    const loaded = await new GetApplicationDraftUseCase(repository, clock).execute();
    expect(loaded.canResume).toBe(false);
    expect(repository.stored).toBeNull();
  });

  it('starts over by clearing the cache', async () => {
    const repository = new MemoryRepository();
    repository.stored = { ...afterOwnership };
    const draft = await new StartOverUseCase(repository, clock).execute();
    expect(draft.contact).toBeNull();
    expect(repository.stored).toBeNull();
  });
});

describe('SearchAddressesUseCase', () => {
  it('waits for 3 characters before searching', async () => {
    let calls = 0;
    const useCase = new SearchAddressesUseCase({
      search: async () => {
        calls += 1;
        return ok([]);
      },
    });
    await useCase.execute('12');
    await useCase.execute('120');
    expect(calls).toBe(1);
  });
});
