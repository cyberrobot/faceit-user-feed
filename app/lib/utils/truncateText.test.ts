import { describe, expect, it } from 'vitest';
import { truncateText } from './truncateText';

describe('truncateText', () => {
  it('returns text shorter than 100 characters unchanged', () => {
    expect(truncateText('Hello world')).toBe('Hello world');
  });

  it('does not truncate exactly 100 characters', () => {
    const text = 'a'.repeat(100);

    expect(truncateText(text)).toBe(text);
  });

  it('truncates text exceeding 100 characters', () => {
    const text = 'a'.repeat(101);

    expect(truncateText(text)).toBe(`${'a'.repeat(99)}…`);
    expect(truncateText(text)).toHaveLength(100);
  });

  it('supports a custom character limit', () => {
    expect(truncateText('Hello world', 6)).toBe('Hello…');
  });

  it('removes trailing whitespace before the ellipsis', () => {
    expect(truncateText('Hello world', 7)).toBe('Hello…');
  });

  it('handles an empty string', () => {
    expect(truncateText('')).toBe('');
  });

  it('returns an empty string for non-positive limits', () => {
    expect(truncateText('Hello', 0)).toBe('');
    expect(truncateText('Hello', -1)).toBe('');
  });
});
