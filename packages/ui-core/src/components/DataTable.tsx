/**
 * データテーブルコンポーネント
 * 
 * Fluent UI のテーブルコンポーネントをラップし、
 * 一般的な機能を提供します。
 */

import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { ReactNode } from 'react';

const useStyles = makeStyles({
  container: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: '100%',
  },
  emptyState: {
    padding: tokens.spacingVerticalXXL,
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
});

/**
 * テーブルの列定義
 */
export interface DataTableColumn<T> {
  /** 列のキー（一意） */
  key: string;
  /** 列のヘッダーラベル */
  label: string;
  /** 列の幅 */
  width?: string | number;
  /** セルの内容をレンダリングする関数 */
  render: (item: T, index: number) => ReactNode;
  /** ソート可能かどうか */
  sortable?: boolean;
}

export interface DataTableProps<T> {
  /** テーブルに表示するデータ */
  data: T[];
  /** 列定義 */
  columns: DataTableColumn<T>[];
  /** 各行の一意なキーを取得する関数 */
  getRowKey: (item: T, index: number) => string;
  /** データが空の場合に表示するメッセージ */
  emptyMessage?: string;
  /** ローディング状態 */
  loading?: boolean;
}

/**
 * DataTable コンポーネント
 * 
 * データを表形式で表示します。
 * Fluent UI のテーブルをベースに、よく使う機能を統合しています。
 * 
 * @example
 * ```tsx
 * <DataTable
 *   data={products}
 *   columns={[
 *     { key: 'name', label: '商品名', render: (p) => p.name },
 *     { key: 'price', label: '価格', render: (p) => formatPrice(p.price) },
 *   ]}
 *   getRowKey={(p) => p.id}
 * />
 * ```
 */
export function DataTable<T>({
  data,
  columns,
  getRowKey,
  emptyMessage = 'データがありません',
  loading = false,
}: DataTableProps<T>) {
  const styles = useStyles();

  if (loading) {
    return <div className={styles.emptyState}>読み込み中...</div>;
  }

  if (data.length === 0) {
    return <div className={styles.emptyState}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.container}>
      <Table className={styles.table} aria-label="Data table">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell
                key={column.key}
                style={{ width: column.width }}
              >
                {column.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={getRowKey(item, index)}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render(item, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
