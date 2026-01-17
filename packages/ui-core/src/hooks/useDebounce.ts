import { useEffect, useState } from 'react';

/**
 * デバウンスフック
 *
 * 値の変更を遅延させて、頻繁な更新を防ぎます。
 * 検索入力などで使用します。
 *
 * @param value デバウンスする値
 * @param delay 遅延時間（ミリ秒）
 * @returns デバウンスされた値
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('')
 * const debouncedSearchTerm = useDebounce(searchTerm, 500)
 *
 * useEffect(() => {
 *   // debouncedSearchTerm を使って検索を実行
 *   searchProducts(debouncedSearchTerm)
 * }, [debouncedSearchTerm])
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
