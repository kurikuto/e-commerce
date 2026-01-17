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

// Note: formatDateTime and formatDate are provided by datetime.ts
// This file only provides price formatting

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

// Note: formatRelativeTime is provided by datetime.ts
