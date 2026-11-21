import {
  GetApplicationDraftUseCase,
  NotifyWhenAvailableUseCase,
  RunApplicantCheckUseCase,
  SearchAddressesUseCase,
  StartOverUseCase,
  StepPersistence,
  SubmitBusinessUseCase,
  SubmitContactUseCase,
  SubmitHomeAddressUseCase,
  SubmitIdentityUseCase,
  SubmitIncomeSourceUseCase,
  SubmitNameUseCase,
  SubmitOwnershipUseCase,
} from '@application/use-cases/apply';
import type { UseCases } from '@application/use-cases/UseCases';
import { MockApplicationApi } from '@infrastructure/api/MockApplicationApi';
import { SystemClock } from '@infrastructure/clock/SystemClock';
import { MockAddressAutocompleteService } from '@infrastructure/services/MockAddressAutocompleteService';
import { MockApplicantCheckService } from '@infrastructure/services/MockApplicantCheckService';
import { MockWaitlistService } from '@infrastructure/services/MockWaitlistService';
import { LocalStorageDraftRepository } from '@infrastructure/storage/LocalStorageDraftRepository';

/**
 * Composition root. The ONLY place that knows concrete implementations.
 * Swap a Mock* adapter for the real one here; nothing else changes (Dependency Inversion).
 */
export const createContainer = (): UseCases => {
  const clock = new SystemClock();
  const repository = new LocalStorageDraftRepository();
  const api = new MockApplicationApi();
  const persistence = new StepPersistence(api, repository, clock);

  return {
    clock,
    apply: {
      getDraft: new GetApplicationDraftUseCase(repository, clock),
      startOver: new StartOverUseCase(repository, clock),
      submitContact: new SubmitContactUseCase(persistence),
      submitName: new SubmitNameUseCase(persistence),
      submitIncomeSource: new SubmitIncomeSourceUseCase(persistence),
      submitBusiness: new SubmitBusinessUseCase(persistence, clock),
      submitOwnership: new SubmitOwnershipUseCase(persistence),
      runApplicantCheck: new RunApplicantCheckUseCase(new MockApplicantCheckService(), repository, clock),
      submitHomeAddress: new SubmitHomeAddressUseCase(persistence),
      submitIdentity: new SubmitIdentityUseCase(persistence, clock),
      searchAddresses: new SearchAddressesUseCase(new MockAddressAutocompleteService()),
      notifyWhenAvailable: new NotifyWhenAvailableUseCase(new MockWaitlistService()),
    },
  };
};
