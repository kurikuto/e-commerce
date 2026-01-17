/**
 * バリデーションユーティリティ
 *
 * Zodを使用したスキーマ定義とバリデーションを提供します。
 * Protocol Buffersとは別に、アプリケーション層での
 * より詳細なバリデーションを行います。
 */

import { z } from 'zod';

/**
 * UUID v4 バリデーションスキーマ
 *
 * 例: "550e8400-e29b-41d4-a716-446655440000"
 */
export const uuidSchema = z.string().uuid('Invalid UUID format');

/**
 * テナントID バリデーションスキーマ
 *
 * 英数字とハイフンのみ、3-50文字
 */
export const tenantIdSchema = z
  .string()
  .min(3, 'Tenant ID must be at least 3 characters')
  .max(50, 'Tenant ID must be at most 50 characters')
  .regex(/^[a-zA-Z0-9-]+$/, 'Tenant ID must contain only alphanumeric characters and hyphens');

/**
 * 商品名 バリデーションスキーマ
 */
export const productNameSchema = z
  .string()
  .min(1, 'Product name is required')
  .max(200, 'Product name must be at most 200 characters')
  .trim();

/**
 * 価格 バリデーションスキーマ
 *
 * 0以上、100億円未満
 */
export const priceSchema = z
  .number()
  .int('Price must be an integer')
  .min(0, 'Price must be non-negative')
  .max(10_000_000_000, 'Price is too large');

/**
 * 在庫数 バリデーションスキーマ
 */
export const stockQuantitySchema = z
  .number()
  .int('Stock quantity must be an integer')
  .min(0, 'Stock quantity must be non-negative')
  .max(1_000_000, 'Stock quantity is too large');

/**
 * ページネーション パラメータ
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

/**
 * バリデーションヘルパー関数
 *
 * スキーマに対してデータをバリデーションし、
 * エラーがあれば詳細なメッセージを返します。
 */
export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): {
  success: boolean;
  data?: T;
  errors?: Array<{ path: string; message: string }>;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    })),
  };
}
