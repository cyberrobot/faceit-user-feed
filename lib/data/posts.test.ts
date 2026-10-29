import { describe, expect, it } from 'vitest';
import { getPostById } from './posts';

describe('getPostById', () => {
  it('finds a post from the second feed page', () => {
    const post = getPostById('post-025');

    expect(post?.id).toBe('post-025');
  });

  it('returns undefined for an unknown post', () => {
    expect(getPostById('invalid')).toBeUndefined();
  });
});
