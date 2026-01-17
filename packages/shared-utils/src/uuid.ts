/**
 * UUID ユーティリティ
 */

import { UUID } from './types-global';

/**
 * UUID v4 を生成
 *
 * 注意: これはクライアントサイドでの簡易実装です。
 * 本番環境では、サーバーサイドでの生成を推奨します。
 */
export function generateUUID(): UUID {
  // crypto.randomUUID() がサポートされている場合はそれを使用
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID() as UUID;
  }

  // フォールバック実装
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  }) as UUID;
}

/**
 * UUID の検証
 */
export function isValidUUID(value: string): value is UUID {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * nil UUID (全てゼロ)
 */
export const NIL_UUID: UUID = '00000000-0000-0000-0000-000000000000' as UUID;

/**
 * UUID が nil かどうか
 */
export function isNilUUID(uuid: UUID): boolean {
  return uuid === NIL_UUID;
}
