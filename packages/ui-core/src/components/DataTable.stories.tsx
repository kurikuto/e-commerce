/**
 * DataTable コンポーネントのストーリー
 *
 * データテーブルコンポーネントの使用例を提供します。
 */

import { Badge, Button } from '@fluentui/react-components';
import { DeleteRegular, EditRegular } from '@fluentui/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable, DataTableColumn } from './DataTable';

/**
 * サンプルデータの型定義
 */
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
}

/**
 * サンプルデータ
 */
const sampleProducts: Product[] = [
  { id: '1', name: 'ノートパソコン', category: '電子機器', price: 120000, stock: 15, status: 'active' },
  { id: '2', name: 'ワイヤレスマウス', category: 'アクセサリー', price: 3500, stock: 50, status: 'active' },
  { id: '3', name: 'USB-Cケーブル', category: 'アクセサリー', price: 1200, stock: 0, status: 'inactive' },
  { id: '4', name: '外付けSSD 1TB', category: 'ストレージ', price: 15000, stock: 25, status: 'active' },
  { id: '5', name: 'Bluetoothスピーカー', category: 'オーディオ', price: 8500, stock: 10, status: 'draft' },
];

/**
 * 列定義のサンプル
 */
const columns: DataTableColumn<Product>[] = [
  {
    key: 'name',
    label: '商品名',
    width: '30%',
    render: (item) => item.name,
    sortable: true,
  },
  {
    key: 'category',
    label: 'カテゴリー',
    width: '20%',
    render: (item) => item.category,
    sortable: true,
  },
  {
    key: 'price',
    label: '価格',
    width: '15%',
    render: (item) => `¥${item.price.toLocaleString()}`,
    sortable: true,
  },
  {
    key: 'stock',
    label: '在庫',
    width: '15%',
    render: (item) => (
      <span style={{ color: item.stock === 0 ? '#d13438' : undefined }}>
        {item.stock}個
      </span>
    ),
    sortable: true,
  },
  {
    key: 'status',
    label: 'ステータス',
    width: '20%',
    render: (item) => {
      const statusConfig = {
        active: { color: 'success', label: '公開中' },
        inactive: { color: 'danger', label: '非公開' },
        draft: { color: 'warning', label: '下書き' },
      } as const;

      const config = statusConfig[item.status];
      return <Badge appearance="filled" color={config.color}>{config.label}</Badge>;
    },
  },
];

/**
 * アクション列を含む列定義
 */
const columnsWithActions: DataTableColumn<Product>[] = [
  ...columns,
  {
    key: 'actions',
    label: 'アクション',
    width: '150px',
    render: () => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          size="small"
          icon={<EditRegular />}
          appearance="subtle"
          aria-label="編集"
        />
        <Button
          size="small"
          icon={<DeleteRegular />}
          appearance="subtle"
          aria-label="削除"
        />
      </div>
    ),
  },
];

/**
 * DataTableは、Fluent UIのTableコンポーネントをベースにした
 * 汎用的なデータテーブルコンポーネントです。
 *
 * ## 主な用途
 * - 商品一覧、ユーザー一覧などのリスト表示
 * - データの可視化とフィルタリング
 * - ソート可能なテーブル
 *
 * ## 機能
 * - カスタマイズ可能な列定義
 * - ソート機能（sortable指定時）
 * - 空データ時の表示
 * - レスポンシブ対応
 */
const meta = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'データをテーブル形式で表示する汎用コンポーネント。ソート機能や空データ時の表示をサポートします。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      control: false,
      description: 'テーブルの列定義',
      table: {
        type: { summary: 'DataTableColumn<T>[]' },
      },
    },
    data: {
      control: false,
      description: '表示するデータの配列',
      table: {
        type: { summary: 'T[]' },
      },
    },
    getRowKey: {
      control: false,
      description: '各行の一意なキーを取得する関数',
      table: {
        type: { summary: '(item: T, index: number) => string' },
      },
    },
    emptyMessage: {
      control: 'text',
      description: 'データが空の時に表示するメッセージ',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'データがありません' },
      },
    },
  },
} satisfies Meta<typeof DataTable<Product>>;

export default meta;
type Story = StoryObj<typeof DataTable<Product>>;

/**
 * デフォルトの表示
 *
 * 基本的なテーブルの表示です。
 */
export const Default: Story = {
  args: {
    columns: columns,
    data: sampleProducts,
    getRowKey: (item: Product) => item.id,
  },
};

/**
 * アクション列付き
 *
 * 各行にアクションボタン（編集・削除）を配置したテーブルです。
 */
export const WithActions: Story = {
  args: {
    columns: columnsWithActions,
    data: sampleProducts,
    getRowKey: (item: Product) => item.id,
  },
  parameters: {
    docs: {
      description: {
        story: '編集や削除などのアクションボタンを各行に配置できます。',
      },
    },
  },
};

/**
 * 空データ
 *
 * データが空の場合の表示です。
 */
export const EmptyState: Story = {
  args: {
    columns: columns,
    data: [],
    getRowKey: (item: Product) => item.id,
  },
  parameters: {
    docs: {
      description: {
        story: 'データが存在しない場合、空状態のメッセージが表示されます。',
      },
    },
  },
};

/**
 * カスタム空メッセージ
 *
 * 空データ時のメッセージをカスタマイズできます。
 */
export const CustomEmptyMessage: Story = {
  args: {
    columns: columns,
    data: [],
    getRowKey: (item: Product) => item.id,
    emptyMessage: '商品が登録されていません。「新規商品」ボタンから追加してください。',
  },
};

/**
 * 少量のデータ
 *
 * 数行のみのシンプルなテーブルです。
 */
export const SmallDataSet: Story = {
  args: {
    columns: columns,
    data: sampleProducts.slice(0, 2),
    getRowKey: (item: Product) => item.id,
  },
};

/**
 * 大量のデータ
 *
 * スクロール可能な大量データのテーブルです。
 */
export const LargeDataSet: Story = {
  args: {
    columns: columns,
    data: Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      name: `商品 ${i + 1}`,
      category: ['電子機器', 'アクセサリー', 'ストレージ', 'オーディオ'][i % 4],
      price: Math.floor(Math.random() * 100000) + 1000,
      stock: Math.floor(Math.random() * 100),
      status: (['active', 'inactive', 'draft'] as const)[i % 3],
    })),
    getRowKey: (item: Product) => item.id,
  },
  parameters: {
    docs: {
      description: {
        story: '大量のデータも適切にスクロール表示されます。',
      },
    },
  },
};

/**
 * シンプルな列定義
 *
 * 最小限の列だけを表示したシンプルなテーブルです。
 */
export const SimpleColumns: Story = {
  args: {
    columns: [
      {
        key: 'name',
        label: '商品名',
        render: (item: Product) => item.name,
      },
      {
        key: 'price',
        label: '価格',
        render: (item: Product) => `¥${item.price.toLocaleString()}`,
      },
    ] as DataTableColumn<Product>[],
    data: sampleProducts,
    getRowKey: (item: Product) => item.id,
  },
};

/**
 * 固定幅列
 *
 * 各列に固定幅を指定したテーブルです。
 */
export const FixedWidthColumns: Story = {
  args: {
    columns: [
      {
        key: 'name',
        label: '商品名',
        width: 300,
        render: (item: Product) => item.name,
      },
      {
        key: 'category',
        label: 'カテゴリー',
        width: 150,
        render: (item: Product) => item.category,
      },
      {
        key: 'price',
        label: '価格',
        width: 120,
        render: (item: Product) => `¥${item.price.toLocaleString()}`,
      },
    ] as DataTableColumn<Product>[],
    data: sampleProducts,
    getRowKey: (item: Product) => item.id,
  },
};
