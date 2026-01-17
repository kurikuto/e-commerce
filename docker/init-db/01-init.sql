-- ================================================================
-- データベース初期化スクリプト
-- ================================================================
-- PostgreSQLコンテナ起動時に自動実行されます。
-- ================================================================

-- 日本語対応の設定
SET client_encoding = 'UTF8';

-- タイムゾーン設定
SET timezone = 'Asia/Tokyo';

-- 拡張機能のインストール
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- UUID生成関数
CREATE EXTENSION IF NOT EXISTS "pg_trgm";     -- 全文検索の高速化

-- ================================================================
-- テーブル作成は Exposed ORM が自動で行うため、ここでは不要
-- ================================================================

-- テストデータの投入（開発環境用）
-- 注意: 本番環境では実行しないこと

-- デモテナントのテストデータ
INSERT INTO products (
    id,
    tenant_id,
    name,
    description,
    price,
    stock_quantity,
    category_id,
    sku,
    status,
    created_at,
    updated_at
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'demo-tenant',
    'プレミアム・コーヒー豆（200g）',
    'エチオピア産の高品質なアラビカ種コーヒー豆です。フルーティーな香りと豊かなコクが特徴。',
    1800,
    150,
    'cat-001',
    'COFFEE-001',
    2,  -- ACTIVE
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '2 days'
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'demo-tenant',
    'オーガニック・ティーセット',
    '5種類の厳選された有機栽培茶葉のセットです。ギフトにも最適。',
    2400,
    80,
    'cat-002',
    'TEA-SET-001',
    2,  -- ACTIVE
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '1 day'
);

-- インデックスの作成（パフォーマンス最適化）
CREATE INDEX IF NOT EXISTS idx_products_tenant_created 
    ON products (tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_products_tenant_status 
    ON products (tenant_id, status);

CREATE INDEX IF NOT EXISTS idx_products_name_trgm 
    ON products USING gin (name gin_trgm_ops);

-- 初期化完了メッセージ
DO $$
BEGIN
    RAISE NOTICE '✅ Database initialization completed!';
    RAISE NOTICE '📊 Test data inserted for tenant: demo-tenant';
END $$;
