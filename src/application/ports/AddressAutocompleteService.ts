import type { Result } from '@shared/types/result';
import type { UsStateCode } from '@domain/value-objects/UsState';

import type { ServiceError } from './ServiceError';

export interface AddressSuggestion {
  readonly id: string;
  readonly line1: string;
  readonly city: string;
  readonly state: UsStateCode;
  readonly zip: string;
}

/** 1H: selecting a suggestion fills city, state and ZIP. */
export interface AddressAutocompleteService {
  search(query: string): Promise<Result<readonly AddressSuggestion[], ServiceError>>;
}
