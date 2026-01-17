/**
 * グローバル型定義
 *
 * アプリケーション全体で使用される共通の型を定義します。
 */

/**
 * ページネーション結果の型
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * API エラーレスポンスの型
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * API 成功レスポンスの型
 */
export interface ApiSuccess<T> {
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * ID型（UUID）
 */
export type UUID = string & { readonly __brand: 'UUID' };

/**
 * タイムスタンプ型（ISO 8601形式）
 */
export type Timestamp = string & { readonly __brand: 'Timestamp' };

/**
 * 貨幣型（セント単位で保存）
 */
export type Money = number & { readonly __brand: 'Money' };

/**
 * ソート順
 */
export type SortOrder = 'asc' | 'desc';

/**
 * ソート条件
 */
export interface SortCriteria {
  field: string;
  order: SortOrder;
}

/**
 * フィルター条件
 */
export interface FilterCriteria {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';
  value: unknown;
}

/**
 * クエリパラメータ
 */
export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: SortCriteria[];
  filters?: FilterCriteria[];
}

/**
 * 非null型ヘルパー
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * 部分的なディープ型
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * 読み取り専用のディープ型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * タイプガード: UUIDかどうか
 */
export function isUUID(value: unknown): value is UUID {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof value === 'string' && uuidRegex.test(value);
}

/**
 * タイプガード: Timestampかどうか
 */
export function isTimestamp(value: unknown): value is Timestamp {
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return typeof value === 'string' && iso8601Regex.test(value);
}

/**
 * Money型のヘルパー関数
 */
export const Money = {
  fromCents(cents: number): Money {
    return cents as Money;
  },

  toCents(money: Money): number {
    return money as number;
  },

  fromDollars(dollars: number): Money {
    return Math.round(dollars * 100) as Money;
  },

  toDollars(money: Money): number {
    return (money as number) / 100;
  },

  format(money: Money, currency = 'JPY'): string {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency,
    }).format(Money.toDollars(money));
  },
};
