/**
 * 商品サービス
 *
 * バックエンドAPIとの通信を行います。
 * 本番環境ではgRPC-Webを使用しますが、
 * ここでは簡易的にREST APIを想定したモックデータを返します。
 */

import { ListProductsRequest, ListProductsResponse, Product } from '@/types/product';

/**
 * モックデータ
 *
 * 開発時のテスト用データです。
 * 実際のバックエンド実装後は、gRPC-Webクライアントに置き換えます。
 */
const MOCK_PRODUCTS: Product[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    tenantId: 'demo-tenant',
    name: 'プレミアム・コーヒー豆（200g）',
    description: 'エチオピア産の高品質なアラビカ種コーヒー豆です。',
    price: 1800,
    stockQuantity: 150,
    categoryId: 'cat-001',
    sku: 'COFFEE-001',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    tenantId: 'demo-tenant',
    name: 'オーガニック・ティーセット',
    description: '5種類の厳選された有機栽培茶葉のセットです。',
    price: 2400,
    stockQuantity: 80,
    categoryId: 'cat-002',
    sku: 'TEA-SET-001',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    tenantId: 'demo-tenant',
    name: 'ステンレスマグボトル（500ml）',
    description: '真空二重構造で保温・保冷効果抜群。',
    price: 3200,
    stockQuantity: 45,
    categoryId: 'cat-003',
    sku: 'MUG-001',
    status: 'ACTIVE',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    tenantId: 'demo-tenant',
    name: '限定・桜フレーバーティー',
    description: '春限定の桜の香りが楽しめる特別なお茶です。',
    price: 1500,
    stockQuantity: 0,
    categoryId: 'cat-002',
    sku: 'TEA-SAKURA-2024',
    status: 'INACTIVE',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 7,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    tenantId: 'demo-tenant',
    name: '新商品・抹茶ラテミックス',
    description: '開発中の新商品です。近日公開予定。',
    price: 980,
    stockQuantity: 0,
    categoryId: 'cat-002',
    sku: 'MATCHA-LATTE-001',
    status: 'DRAFT',
    createdAt: Date.now() - 86400000 * 1,
    updatedAt: Date.now() - 3600000,
  },
];

/**
 * 商品一覧を取得
 *
 * @param params リクエストパラメータ
 * @returns 商品一覧レスポンス
 */
export async function fetchProducts(params: ListProductsRequest): Promise<ListProductsResponse> {
  // モック: 実際のAPIコールをシミュレート
  await new Promise((resolve) => setTimeout(resolve, 500));

  const { page = 1, pageSize = 20 } = params;

  // TODO: 実際のgRPC-Web実装に置き換え
  // const client = new CatalogServiceClient(...);
  // const response = await client.listProducts(request);

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = MOCK_PRODUCTS.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    totalCount: MOCK_PRODUCTS.length,
    currentPage: page,
    totalPages: Math.ceil(MOCK_PRODUCTS.length / pageSize),
  };
}

/**
 * 商品詳細を取得
 *
 * @param id 商品ID
 * @param tenantId テナントID
 * @returns 商品詳細
 */
export async function fetchProduct(id: string, tenantId: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const product = MOCK_PRODUCTS.find((p) => p.id === id && p.tenantId === tenantId);

  return product || null;
}
