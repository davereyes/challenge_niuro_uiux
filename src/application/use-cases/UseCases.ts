import type {
  GetApplicationDraftUseCase,
  NotifyWhenAvailableUseCase,
  RunApplicantCheckUseCase,
  SearchAddressesUseCase,
  StartOverUseCase,
  SubmitBusinessUseCase,
  SubmitContactUseCase,
  SubmitHomeAddressUseCase,
  SubmitIdentityUseCase,
  SubmitIncomeSourceUseCase,
  SubmitNameUseCase,
  SubmitOwnershipUseCase,
} from './apply';
import type { Clock } from '../ports/Clock';

/**
 * Catalog of use cases exposed to the presentation layer.
 * Presentation depends on THIS contract, never on concrete adapters.
 */
export interface UseCases {
  readonly clock: Clock;
  readonly apply: {
    readonly getDraft: GetApplicationDraftUseCase;
    readonly startOver: StartOverUseCase;
    readonly submitContact: SubmitContactUseCase;
    readonly submitName: SubmitNameUseCase;
    readonly submitIncomeSource: SubmitIncomeSourceUseCase;
    readonly submitBusiness: SubmitBusinessUseCase;
    readonly submitOwnership: SubmitOwnershipUseCase;
    readonly runApplicantCheck: RunApplicantCheckUseCase;
    readonly submitHomeAddress: SubmitHomeAddressUseCase;
    readonly submitIdentity: SubmitIdentityUseCase;
    readonly searchAddresses: SearchAddressesUseCase;
    readonly notifyWhenAvailable: NotifyWhenAvailableUseCase;
  };
}
