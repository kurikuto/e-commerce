/**
 * フォーマッターユーティリティ
 *
 * データの表示用フォーマットを提供します。
 */

/**
 * 価格を日本円形式でフォーマット
 *
 * @example
 * formatPrice(1234567) // "¥1,234,567"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * 日時をフォーマット
 *
 * @example
 * formatDateTime(1704067200000) // "2024/01/01 12:00:00"
 */
export function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}

/**
 * 日付をフォーマット
 *
 * @example
 * formatDate(1704067200000) // "2024/01/01"
 */
export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(timestamp));
}

/**
 * 数値を3桁区切りでフォーマット
 *
 * @example
 * formatNumber(1234567) // "1,234,567"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ja-JP').format(value);
}

/**
 * バイトサイズを人間が読みやすい形式でフォーマット
 *
 * @example
 * formatFileSize(1536) // "1.5 KB"
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * パーセンテージをフォーマット
 *
 * @example
 * formatPercentage(0.1234) // "12.3%"
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 相対時間をフォーマット（○分前、○時間前など）
 *
 * @example
 * formatRelativeTime(Date.now() - 3600000) // "1時間前"
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}日前`;
  if (hours > 0) return `${hours}時間前`;
  if (minutes > 0) return `${minutes}分前`;
  if (seconds > 0) return `${seconds}秒前`;
  return 'たった今';
}
