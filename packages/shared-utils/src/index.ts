/**
 * Shared Utilities - エントリーポイント
 *
 * このパッケージは、プロジェクト全体で共有される
 * ユーティリティ関数やバリデーション、型定義を提供します。
 */

// Date/Time utilities
export * from './datetime';

// Error handling
export * from './errors';

// Formatters (price only, datetime formatting is in ./datetime)
export * from './formatters';

// Type definitions (use types-global as the primary source)
export * from './types-global';

// Note: types-react is available but not exported by default
// Import directly: import { WithChildren } from '@ecommerce/shared-utils/types-react'

// Utilities
export * from './uuid';
export * from './validation';
