import type { Result } from '@shared/types/result';
import type { AddressAutocompleteService, AddressSuggestion } from '@application/ports/AddressAutocompleteService';
import type { ServiceError } from '@application/ports/ServiceError';
import type { UsStateCode } from '@domain/value-objects/UsState';

import { simulateRequest } from '../http/networkSimulation';

const STREETS: readonly [street: string, city: string, state: UsStateCode, zip: string][] = [
  ['Main St', 'Houston', 'TX', '77002'],
  ['Maple Ave', 'Austin', 'TX', '78701'],
  ['Oak Ln', 'Dallas', 'TX', '75201'],
  ['Brickell Ave', 'Miami', 'FL', '33131'],
  ['Market St', 'San Francisco', 'CA', '94103'],
  ['Broadway', 'New York', 'NY', '10012'],
];

/**
 * Prototype behavior (canvas 1H): keeps the typed house number and offers matching streets.
 * Typing a street name filters the list (e.g. "742 market" → San Francisco, CA to test 2G).
 * Replace with Google Places / Smarty implementing the same port.
 */
export class MockAddressAutocompleteService implements AddressAutocompleteService {
  search(query: string): Promise<Result<readonly AddressSuggestion[], ServiceError>> {
    return simulateRequest(() => {
      const number = query.match(/^\d+/)?.[0] ?? '1200';
      const words = query.replace(/^\d+\s*/, '').toLowerCase().trim();
      const matches = STREETS.filter(([street]) => !words || street.toLowerCase().startsWith(words.slice(0, street.length)) || street.toLowerCase().includes(words));
      const list = (matches.length > 0 ? matches : STREETS).slice(0, 3);
      return list.map(([street, city, state, zip]) => ({ id: `${number}-${street}-${zip}`, line1: `${number} ${street}`, city, state, zip }));
    }, 250);
  }
}
