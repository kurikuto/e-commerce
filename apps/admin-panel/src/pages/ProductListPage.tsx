/**
 * 商品一覧ページ
 * 
 * 商品の一覧表示と基本的なCRUD操作を提供します。
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  SearchBox,
  Spinner,
  makeStyles,
  tokens,
  Badge,
} from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';
import { PageHeader, DataTable, DataTableColumn } from '@ecommerce/ui-core';
import { formatPrice, formatDateTime } from '@ecommerce/shared-utils';
import { Product } from '@types/product';
import { fetchProducts } from '@services/productService';

const useStyles = makeStyles({
  filters: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalL,
  },
  content: {
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalXXL,
    boxShadow: tokens.shadow4,
  },
});

/**
 * 商品ステータスバッジ
 */
function ProductStatusBadge({ status }: { status: Product['status'] }) {
  const statusConfig = {
    DRAFT: { color: 'warning' as const, label: '下書き' },
    ACTIVE: { color: 'success' as const, label: '公開中' },
    INACTIVE: { color: 'danger' as const, label: '非公開' },
    ARCHIVED: { color: 'subtle' as const, label: 'アーカイブ' },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;

  return (
    <Badge appearance="filled" color={config.color}>
      {config.label}
    </Badge>
  );
}

/**
 * ProductListPageコンポーネント
 * 
 * 商品一覧ページのメインコンポーネントです。
 * React Queryによるデータフェッチとキャッシングを使用します。
 */
export default function ProductListPage() {
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // React Queryでデータ取得
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['products', page],
    queryFn: () =>
      fetchProducts({
        tenantId: 'demo-tenant', // TODO: 認証から取得
        page,
        pageSize: 20,
      }),
  });

  // テーブルの列定義
  const columns: DataTableColumn<Product>[] = [
    {
      key: 'sku',
      label: 'SKU',
      width: 120,
      render: (product) => <code>{product.sku}</code>,
    },
    {
      key: 'name',
      label: '商品名',
      render: (product) => product.name,
    },
    {
      key: 'price',
      label: '価格',
      width: 120,
      render: (product) => formatPrice(Number(product.price)),
    },
    {
      key: 'stock',
      label: '在庫数',
      width: 100,
      render: (product) => product.stockQuantity.toLocaleString(),
    },
    {
      key: 'status',
      label: 'ステータス',
      width: 120,
      render: (product) => <ProductStatusBadge status={product.status} />,
    },
    {
      key: 'updatedAt',
      label: '更新日時',
      width: 180,
      render: (product) => formatDateTime(Number(product.updatedAt)),
    },
  ];

  return (
    <>
      <PageHeader
        title="商品管理"
        description="商品の一覧表示と編集を行います"
        actions={
          <Button appearance="primary" icon={<Add24Regular />}>
            新規商品を追加
          </Button>
        }
      >
        <div className={styles.filters}>
          <SearchBox
            placeholder="商品名やSKUで検索..."
            value={searchQuery}
            onChange={(_, data) => setSearchQuery(data.value)}
            style={{ width: '400px' }}
          />
        </div>
      </PageHeader>

      <div className={styles.content}>
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Spinner size="large" label="商品を読み込んでいます..." />
          </div>
        )}

        {isError && (
          <div style={{ padding: '40px', textAlign: 'center', color: tokens.colorPaletteRedForeground1 }}>
            エラーが発生しました: {error instanceof Error ? error.message : '不明なエラー'}
          </div>
        )}

        {productsData && (
          <>
            <DataTable
              data={productsData.products}
              columns={columns}
              getRowKey={(product) => product.id}
              emptyMessage="商品が登録されていません"
            />

            <div
              style={{
                marginTop: tokens.spacingVerticalL,
                textAlign: 'center',
                color: tokens.colorNeutralForeground2,
              }}
            >
              ページ {productsData.currentPage} / {productsData.totalPages} (全{' '}
              {productsData.totalCount} 件)
            </div>
          </>
        )}
      </div>
    </>
  );
}
