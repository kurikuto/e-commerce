/**
 * 商品型定義
 *
 * Protocol Buffersスキーマに対応した型定義です。
 */

/**
 * 商品ステータス
 */
export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

/**
 * 商品エンティティ
 */
export interface Product {
  /** 商品ID（UUID） */
  id: string;

  /** テナントID */
  tenantId: string;

  /** 商品名 */
  name: string;

  /** 商品説明 */
  description: string;

  /** 価格（円） */
  price: string | number;

  /** 在庫数 */
  stockQuantity: number;

  /** カテゴリID */
  categoryId?: string;

  /** SKU（在庫管理コード） */
  sku: string;

  /** ステータス */
  status: ProductStatus;

  /** 作成日時（Unix timestamp, ミリ秒） */
  createdAt: string | number;

  /** 更新日時（Unix timestamp, ミリ秒） */
  updatedAt: string | number;
}

/**
 * 商品一覧レスポンス
 */
export interface ListProductsResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/**
 * 商品一覧リクエストパラメータ
 */
export interface ListProductsRequest {
  tenantId: string;
  page?: number;
  pageSize?: number;
  nameFilter?: string;
  categoryIdFilter?: string;
  statusFilter?: ProductStatus;
}
