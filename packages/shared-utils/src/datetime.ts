/**
 * 日付・時刻ユーティリティ
 */

import { Timestamp } from './types-global';

/**
 * 現在のタイムスタンプを取得（ISO 8601形式）
 */
export function getCurrentTimestamp(): Timestamp {
  return new Date().toISOString() as Timestamp;
}

/**
 * Date を Timestamp に変換
 */
export function toTimestamp(date: Date): Timestamp {
  return date.toISOString() as Timestamp;
}

/**
 * Timestamp を Date に変換
 */
export function fromTimestamp(timestamp: Timestamp): Date {
  return new Date(timestamp);
}

/**
 * 相対的な日時表示（例: "2時間前", "3日前"）
 */
export function formatRelativeTime(timestamp: Timestamp, locale = 'ja'): string {
  const date = fromTimestamp(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  if (diffDay < 30) return rtf.format(-diffDay, 'day');

  return formatDate(timestamp, locale);
}

/**
 * 日付をフォーマット
 */
export function formatDate(
  timestamp: Timestamp,
  locale = 'ja',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = fromTimestamp(timestamp);
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * 日時をフォーマット（日本語表示）
 */
export function formatDateTime(timestamp: Timestamp): string {
  return formatDate(timestamp, 'ja', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 日付の範囲をチェック
 */
export function isDateInRange(date: Timestamp, startDate: Timestamp, endDate: Timestamp): boolean {
  const d = fromTimestamp(date).getTime();
  const start = fromTimestamp(startDate).getTime();
  const end = fromTimestamp(endDate).getTime();
  return d >= start && d <= end;
}

/**
 * 日付の加算
 */
export function addDays(timestamp: Timestamp, days: number): Timestamp {
  const date = fromTimestamp(timestamp);
  date.setDate(date.getDate() + days);
  return toTimestamp(date);
}

/**
 * 日付の差分を日数で取得
 */
export function daysBetween(start: Timestamp, end: Timestamp): number {
  const startDate = fromTimestamp(start);
  const endDate = fromTimestamp(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
