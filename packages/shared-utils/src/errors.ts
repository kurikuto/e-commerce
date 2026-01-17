/**
 * エラークラス定義
 *
 * アプリケーション全体で使用する標準的なエラークラスです。
 * gRPCのStatusと対応させることができます。
 */

/**
 * アプリケーションエラーの基底クラス
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * バリデーションエラー
 *
 * ユーザー入力が不正な場合に使用します。
 * HTTP 400 Bad Request に対応。
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields?: Array<{ path: string; message: string }>
  ) {
    super(message, 'VALIDATION_ERROR', 400, { fields });
  }
}

/**
 * 認証エラー
 *
 * 認証情報が不正または欠落している場合に使用します。
 * HTTP 401 Unauthorized に対応。
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

/**
 * 認可エラー
 *
 * リソースへのアクセス権限がない場合に使用します。
 * HTTP 403 Forbidden に対応。
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

/**
 * リソース未検出エラー
 *
 * 要求されたリソースが存在しない場合に使用します。
 * HTTP 404 Not Found に対応。
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND', 404, { resource, identifier });
  }
}

/**
 * 競合エラー
 *
 * リソースの状態が競合している場合に使用します。
 * 例: 在庫の二重引当、楽観的ロックの失敗
 * HTTP 409 Conflict に対応。
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONFLICT', 409, details);
  }
}

/**
 * 内部サーバーエラー
 *
 * 予期しないエラーが発生した場合に使用します。
 * HTTP 500 Internal Server Error に対応。
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error occurred', cause?: Error) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, { cause: cause?.message });
  }
}

/**
 * エラーハンドリングヘルパー
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * エラーをJSON形式に変換
 */
export function serializeError(error: unknown): {
  code: string;
  message: string;
  details?: Record<string, unknown>;
} {
  if (isAppError(error)) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
  };
}
