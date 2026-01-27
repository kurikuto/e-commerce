import { describe, expect, it } from 'vitest';
import { fetchProduct, fetchProducts } from './productService';

describe('productService', () => {
  describe('fetchProducts', () => {
    it('should return products list', async () => {
      const request = {
        tenantId: 'demo-tenant',
        page: 1,
        pageSize: 10,
      };

      const response = await fetchProducts(request);

      expect(response).toBeDefined();
      expect(response.products).toBeInstanceOf(Array);
      expect(response.products.length).toBeGreaterThan(0);
      expect(response.totalCount).toBeGreaterThan(0);
      expect(response.currentPage).toBe(1);
    });

    it('should return products with correct structure', async () => {
      const request = {
        tenantId: 'demo-tenant',
        page: 1,
        pageSize: 10,
      };

      const response = await fetchProducts(request);
      const product = response.products[0];

      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('tenantId');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('stockQuantity');
      expect(product).toHaveProperty('status');
      expect(product).toHaveProperty('createdAt');
      expect(product).toHaveProperty('updatedAt');
    });

    it('should handle pagination', async () => {
      const request = {
        tenantId: 'demo-tenant',
        page: 1,
        pageSize: 2,
      };

      const response = await fetchProducts(request);

      expect(response.products.length).toBeLessThanOrEqual(2);
    });

    it('should handle different pages', async () => {
      const request1 = {
        tenantId: 'demo-tenant',
        page: 1,
        pageSize: 2,
      };

      const request2 = {
        tenantId: 'demo-tenant',
        page: 2,
        pageSize: 2,
      };

      const response1 = await fetchProducts(request1);
      const response2 = await fetchProducts(request2);

      expect(response1.products.length).toBeGreaterThan(0);
      expect(response2.products.length).toBeGreaterThan(0);
      expect(response1.products[0]?.id).not.toBe(response2.products[0]?.id);
    });

    it('should calculate total pages correctly', async () => {
      const request = {
        tenantId: 'demo-tenant',
        page: 1,
        pageSize: 2,
      };

      const response = await fetchProducts(request);

      expect(response.totalPages).toBeGreaterThan(0);
      expect(response.totalPages).toBe(Math.ceil(response.totalCount / 2));
    });
  });

  describe('fetchProduct', () => {
    it('should return product by ID', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440001';

      const product = await fetchProduct(productId, 'demo-tenant');

      expect(product).toBeDefined();
      expect(product!.id).toBe(productId);
      expect(product!.tenantId).toBe('demo-tenant');
    });

    it('should return null for non-existent product', async () => {
      const product = await fetchProduct('non-existent-id', 'demo-tenant');

      expect(product).toBeNull();
    });

    it('should return product with all properties', async () => {
      const productId = '550e8400-e29b-41d4-a716-446655440001';

      const product = await fetchProduct(productId, 'demo-tenant');

      expect(product).not.toBeNull();
      expect(product!.name).toBeTruthy();
      expect(product!.price).toBeGreaterThan(0);
      expect(product!.status).toBeDefined();
    });
  });
});
