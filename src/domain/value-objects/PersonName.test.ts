import { describe, expect, it } from 'vitest';

import { createPersonName } from './PersonName';

describe('PersonName', () => {
  it.each(['Maria', "O'Brien", 'Mary-Jane', 'De la Cruz', 'José', 'Zoë'])('accepts %s', (name) => {
    expect(createPersonName(name).ok).toBe(true);
  });

  it('trims and collapses spaces', () => {
    expect(createPersonName('  De   la Cruz ')).toEqual({ ok: true, value: 'De la Cruz' });
  });

  it.each([
    ['', 'required'],
    ['   ', 'required'],
    ['M4ria', 'format'],
    ['-Maria', 'format'],
    ['A'.repeat(51), 'tooLong'],
  ])('rejects %j with %s', (raw, code) => {
    expect(createPersonName(raw)).toEqual({ ok: false, error: { code } });
  });
});
