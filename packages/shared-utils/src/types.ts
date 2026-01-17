/**
 * 共通型定義
 *
 * プロジェクト全体で使用される型を定義します。
 */

/**
 * ID型（UUID v4）
 */
export type ID = string;

/**
 * テナントID型
 */
export type TenantID = string;

/**
 * タイムスタンプ型（Unix timestamp, ミリ秒）
 */
export type Timestamp = number;

/**
 * ページネーションの結果
 */
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

/**
 * API レスポンスの標準形式
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * ヘルスチェックレスポンス
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  version: string;
  timestamp: Timestamp;
  checks: {
    database?: 'up' | 'down';
    redis?: 'up' | 'down';
    [key: string]: 'up' | 'down' | undefined;
  };
}

/**
 * 設定値の型
 */
export interface Config {
  env: 'development' | 'staging' | 'production';
  port: number;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  grpc: {
    port: number;
    maxConnectionAge?: number;
  };
}
