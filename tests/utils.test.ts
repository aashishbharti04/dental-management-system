import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, getInitials } from '@/lib/utils';

describe('getInitials', () => {
  it('returns up to two uppercase initials', () => {
    expect(getInitials('jane mary doe')).toBe('JM');
  });
  it('handles a single name', () => {
    expect(getInitials('madonna')).toBe('M');
  });
  it('handles an empty string', () => {
    expect(getInitials('')).toBe('');
  });
});

describe('formatCurrency', () => {
  it('formats a value with thousands separators', () => {
    expect(formatCurrency(1234)).toContain('1,234');
  });
});

describe('formatDate', () => {
  it('returns an em dash for invalid input', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });
});
