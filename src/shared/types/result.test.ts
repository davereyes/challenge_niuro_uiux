import { describe, expect, it } from 'vitest';

import { err, ok } from './result';

describe('Result', () => {
  it('wraps a success value', () => {
    expect(ok(42)).toEqual({ ok: true, value: 42 });
  });

  it('wraps a failure', () => {
    const error = new Error('boom');
    expect(err(error)).toEqual({ ok: false, error });
  });
});
