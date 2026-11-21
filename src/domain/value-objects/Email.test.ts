import { describe, expect, it } from 'vitest';

import { createEmail } from './Email';

describe('Email', () => {
  it('normalizes valid emails', () => {
    expect(createEmail('  Maria.Lopez@Gmail.com ')).toEqual({ ok: true, value: 'maria.lopez@gmail.com' });
  });

  it.each([
    ['', 'required'],
    ['maria.lopez@gmail', 'format'],
    ['maria@', 'format'],
    ['maria lopez@gmail.com', 'format'],
  ])('rejects %j with %s', (raw, code) => {
    expect(createEmail(raw)).toEqual({ ok: false, error: { code } });
  });
});
