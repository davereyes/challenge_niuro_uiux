import { ok, type Result } from '@shared/types/result';
import type { UsStateCode } from '@domain/value-objects/UsState';

import type { AddressAutocompleteService, AddressSuggestion } from '../../ports/AddressAutocompleteService';
import type { ServiceError } from '../../ports/ServiceError';
import type { WaitlistService } from '../../ports/WaitlistService';

/** Minimum characters before asking for suggestions (canvas: 3). */
export const ADDRESS_QUERY_MIN_LENGTH = 3;

/** 1H autocomplete. Short queries return nothing without calling the service. */
export class SearchAddressesUseCase {
  private readonly service: AddressAutocompleteService;

  constructor(service: AddressAutocompleteService) {
    this.service = service;
  }

  async execute(query: string): Promise<Result<readonly AddressSuggestion[], ServiceError>> {
    const trimmed = query.trim();
    if (trimmed.length < ADDRESS_QUERY_MIN_LENGTH) return ok([]);
    return this.service.search(trimmed);
  }
}

/** 2G "Notify me when it's available". */
export class NotifyWhenAvailableUseCase {
  private readonly service: WaitlistService;

  constructor(service: WaitlistService) {
    this.service = service;
  }

  execute(lead: { email: string | null; state: UsStateCode }): Promise<Result<void, ServiceError>> {
    return this.service.notifyWhenAvailable(lead);
  }
}
