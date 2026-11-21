import { describe, expect, it } from 'vitest';

import { createHomeAddress } from './HomeAddress';
import { isStateServed } from './UsState';

const valid = { line1: '1450 Brickell Ave, Apt 2101', city: 'Miami', state: 'FL', zip: '33131' };

describe('HomeAddress', () => {
  it('accepts a complete address in a served state', () => {
    expect(createHomeAddress(valid).ok).toBe(true);
  });

  it('flags CA and NY as not served (2G)', () => {
    expect(createHomeAddress({ ...valid, state: 'CA' })).toEqual({ ok: false, error: { state: { code: 'notServed' } } });
    expect(isStateServed('NY')).toBe(false);
    expect(isStateServed('TX')).toBe(true);
  });

  it('reports every invalid field', () => {
    const result = createHomeAddress({ line1: '12', city: '', state: '', zip: '3313' });
    expect(result).toEqual({
      ok: false,
      error: {
        line1: { code: 'tooShort' },
        city: { code: 'required' },
        state: { code: 'required' },
        zip: { code: 'format' },
      },
    });
  });
});
