import { describe, expect, it } from 'vitest';

import { createUsPhone } from './UsPhone';

describe('UsPhone', () => {
  it('accepts formatted numbers and a leading country code', () => {
    expect(createUsPhone('(305) 555-0123')).toEqual({ ok: true, value: '3055550123' });
    expect(createUsPhone('+1 305 555 0123')).toEqual({ ok: true, value: '3055550123' });
  });

  it.each([
    ['', 'required'],
    ['305555', 'incomplete'],
    ['1055550123', 'format'], // area code cannot start with 1
    ['3051550123', 'format'], // exchange cannot start with 1
  ])('rejects %j with %s', (raw, code) => {
    expect(createUsPhone(raw)).toEqual({ ok: false, error: { code } });
  });
});
