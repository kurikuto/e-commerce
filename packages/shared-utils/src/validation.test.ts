import { describe, expect, it } from 'vitest';
import {
  priceSchema,
  productNameSchema,
  stockQuantitySchema,
  tenantIdSchema,
  uuidSchema,
  validate,
} from './validation';

describe('uuidSchema', () => {
  it('should accept valid UUIDs', () => {
    expect(uuidSchema.parse('550e8400-e29b-41d4-a716-446655440000')).toBe(
      '550e8400-e29b-41d4-a716-446655440000'
    );
    expect(uuidSchema.parse('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    );
  });

  it('should reject invalid UUIDs', () => {
    expect(() => uuidSchema.parse('not-a-uuid')).toThrow();
    expect(() => uuidSchema.parse('550e8400-e29b-41d4-a716')).toThrow();
    expect(() => uuidSchema.parse('')).toThrow();
  });
});

describe('tenantIdSchema', () => {
  it('should accept valid tenant IDs', () => {
    expect(tenantIdSchema.parse('abc')).toBe('abc');
    expect(tenantIdSchema.parse('tenant-123')).toBe('tenant-123');
    expect(tenantIdSchema.parse('MY-TENANT-ID')).toBe('MY-TENANT-ID');
  });

  it('should reject tenant IDs that are too short', () => {
    expect(() => tenantIdSchema.parse('ab')).toThrow('Tenant ID must be at least 3 characters');
  });

  it('should reject tenant IDs that are too long', () => {
    expect(() => tenantIdSchema.parse('a'.repeat(51))).toThrow(
      'Tenant ID must be at most 50 characters'
    );
  });

  it('should reject tenant IDs with invalid characters', () => {
    expect(() => tenantIdSchema.parse('tenant_123')).toThrow();
    expect(() => tenantIdSchema.parse('tenant.123')).toThrow();
    expect(() => tenantIdSchema.parse('tenant 123')).toThrow();
  });
});

describe('productNameSchema', () => {
  it('should accept valid product names', () => {
    expect(productNameSchema.parse('Product Name')).toBe('Product Name');
    expect(productNameSchema.parse('  Product Name  ')).toBe('Product Name'); // trimmed
  });

  it('should reject empty product names', () => {
    expect(() => productNameSchema.parse('')).toThrow('Product name is required');
  });

  it('should reject product names that are too long', () => {
    expect(() => productNameSchema.parse('a'.repeat(201))).toThrow(
      'Product name must be at most 200 characters'
    );
  });
});

describe('priceSchema', () => {
  it('should accept valid prices', () => {
    expect(priceSchema.parse(0)).toBe(0);
    expect(priceSchema.parse(100)).toBe(100);
    expect(priceSchema.parse(9_999_999_999)).toBe(9_999_999_999);
  });

  it('should reject negative prices', () => {
    expect(() => priceSchema.parse(-1)).toThrow('Price must be non-negative');
  });

  it('should reject prices that are too large', () => {
    expect(() => priceSchema.parse(10_000_000_001)).toThrow('Price is too large');
  });

  it('should reject non-integer prices', () => {
    expect(() => priceSchema.parse(100.5)).toThrow('Price must be an integer');
  });
});

describe('stockQuantitySchema', () => {
  it('should accept valid stock quantities', () => {
    expect(stockQuantitySchema.parse(0)).toBe(0);
    expect(stockQuantitySchema.parse(1)).toBe(1);
    expect(stockQuantitySchema.parse(999999)).toBe(999999);
  });

  it('should reject negative quantities', () => {
    expect(() => stockQuantitySchema.parse(-1)).toThrow('Stock quantity must be non-negative');
  });

  it('should reject quantities that are too large', () => {
    expect(() => stockQuantitySchema.parse(1_000_001)).toThrow('Stock quantity is too large');
  });

  it('should reject non-integer quantities', () => {
    expect(() => stockQuantitySchema.parse(10.5)).toThrow('Stock quantity must be an integer');
  });
});

describe('validate', () => {
  it('should return success for valid data', () => {
    const result = validate(priceSchema, 1000);

    expect(result.success).toBe(true);
    expect(result.data).toBe(1000);
    expect(result.errors).toBeUndefined();
  });

  it('should return errors for invalid data', () => {
    const result = validate(priceSchema, -100);

    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.errors).toBeDefined();
    expect(result.errors).toHaveLength(1);
    expect(result.errors![0].message).toContain('non-negative');
  });

  it('should return multiple errors for nested validation', () => {
    const result = validate(productNameSchema, '');

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
