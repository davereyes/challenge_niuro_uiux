import { describe, expect, it } from 'vitest';

import { createSsn, maskSsn, type Ssn } from './Ssn';

describe('Ssn', () => {
  it('accepts 9 digits with or without dashes', () => {
    expect(createSsn('123-45-6789')).toEqual({ ok: true, value: '123456789' });
  });

  it.each([
    ['', 'required'],
    ['12345', 'incomplete'],
    ['000-12-3456', 'format'],
    ['666-12-3456', 'format'],
    ['912-12-3456', 'format'],
    ['123-00-3456', 'format'],
    ['123-45-0000', 'format'],
  ])('rejects %j with %s', (raw, code) => {
    expect(createSsn(raw)).toEqual({ ok: false, error: { code } });
  });

  it('masks all but the last 4 digits', () => {
    expect(maskSsn('123456789' as Ssn)).toBe('•••-••-6789');
  });
});
