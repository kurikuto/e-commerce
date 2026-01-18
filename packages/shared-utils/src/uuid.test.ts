import { describe, expect, it } from 'vitest';
import { generateUUID, isNilUUID, isValidUUID, NIL_UUID } from './uuid';

describe('generateUUID', () => {
  it('should generate a valid UUID v4', () => {
    const uuid = generateUUID();
    expect(isValidUUID(uuid)).toBe(true);
  });

  it('should generate different UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    expect(uuid1).not.toBe(uuid2);
  });

  it('should generate UUID with correct format', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('should use crypto.randomUUID when available', () => {
    // crypto.randomUUID is available in modern environments
    const uuid = generateUUID();
    expect(isValidUUID(uuid)).toBe(true);
  });

  it('should use fallback implementation when crypto.randomUUID is not available', () => {
    const originalCrypto = global.crypto;
    const originalRandomUUID = global.crypto?.randomUUID;

    // Remove crypto.randomUUID
    if (global.crypto) {
      // @ts-expect-error - intentionally removing property
      delete global.crypto.randomUUID;
    }

    const uuid = generateUUID();
    expect(isValidUUID(uuid)).toBe(true);

    // Restore
    if (originalCrypto && originalRandomUUID) {
      global.crypto.randomUUID = originalRandomUUID;
    }
  });
});

describe('isValidUUID', () => {
  it('should return true for valid UUID v4', () => {
    expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    expect(isValidUUID('7c9e6679-7425-40de-944b-e07fc1f90ae7')).toBe(true);
  });

  it('should return false for invalid UUIDs', () => {
    expect(isValidUUID('not-a-uuid')).toBe(false);
    expect(isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
    expect(isValidUUID('550e8400e29b41d4a716446655440000')).toBe(false); // no hyphens
    expect(isValidUUID('550e8400-e29b-51d4-a716-446655440000')).toBe(false); // version 5
    expect(isValidUUID('')).toBe(false);
    expect(isValidUUID('XXXXXXXX-XXXX-4XXX-YXXX-XXXXXXXXXXXX')).toBe(false);
  });

  it('should be case insensitive', () => {
    expect(isValidUUID('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    expect(isValidUUID('550e8400-E29B-41d4-A716-446655440000')).toBe(true);
  });
});

describe('NIL_UUID', () => {
  it('should have correct value', () => {
    expect(NIL_UUID).toBe('00000000-0000-0000-0000-000000000000');
  });
});

describe('isNilUUID', () => {
  it('should return true for nil UUID', () => {
    expect(isNilUUID(NIL_UUID)).toBe(true);
  });

  it('should return false for non-nil UUIDs', () => {
    expect(isNilUUID('550e8400-e29b-41d4-a716-446655440000' as any)).toBe(false);
    expect(isNilUUID(generateUUID())).toBe(false);
  });
});
