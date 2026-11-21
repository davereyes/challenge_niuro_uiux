import { describe, expect, it } from 'vitest';

import { createBusinessName } from './BusinessName';

describe('BusinessName', () => {
  it('requires at least 2 characters', () => {
    expect(createBusinessName('Rivera Plumbing LLC').ok).toBe(true);
    expect(createBusinessName('A')).toEqual({ ok: false, error: { code: 'tooShort' } });
    expect(createBusinessName(' ')).toEqual({ ok: false, error: { code: 'required' } });
  });
});
