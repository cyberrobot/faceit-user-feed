import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats an ISO date using British formatting', () => {
    expect(formatDate('2026-10-28T14:30:00Z')).toBe('28 Oct 2026');
  });

  it('accepts a Date object', () => {
    const date = new Date('2026-01-05T09:00:00Z');

    expect(formatDate(date)).toBe('5 Jan 2026');
  });

  it('uses UTC consistently', () => {
    expect(formatDate('2026-10-28T23:30:00-02:00')).toBe('29 Oct 2026');
  });

  it('handles a date-only string', () => {
    expect(formatDate('2025-12-25')).toBe('25 Dec 2025');
  });

  it('returns a fallback for invalid dates', () => {
    expect(formatDate('invalid')).toBe('Invalid date');
    expect(formatDate(new Date(NaN))).toBe('Invalid date');
  });
});
