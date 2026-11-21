import { describe, expect, it } from 'vitest';

import { applyMask, formatPhone, formatSsn, formatZip } from './masks';

describe('masks', () => {
  it('formats a US phone progressively', () => {
    expect(formatPhone('3')).toBe('(3');
    expect(formatPhone('3055')).toBe('(305) 5');
    expect(formatPhone('3055550123')).toBe('(305) 555-0123');
  });

  it('drops a leading country code 1 when pasted', () => {
    expect(formatPhone('+1 305 555 0123')).toBe('(305) 555-0123');
  });

  it('formats SSN and ZIP', () => {
    expect(formatSsn('123456789')).toBe('123-45-6789');
    expect(formatSsn('1234')).toBe('123-4');
    expect(formatZip('33131-1234')).toBe('33131');
  });

  it('leaves text untouched without mask', () => {
    expect(applyMask('none', 'Maria')).toBe('Maria');
  });
});
