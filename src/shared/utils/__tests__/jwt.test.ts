import { describe, expect, it } from 'vitest';
import { isExpired } from '../jwt';

describe('jwt util', () => {
  it('isExpired should return true for null', () => {
    expect(isExpired(null)).toBe(true);
  });

  it('isExpired should return false for future timestamp', () => {
    expect(isExpired(Date.now() + 10_000)).toBe(false);
  });
});
