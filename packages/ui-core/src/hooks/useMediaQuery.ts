import { useEffect, useState } from 'react';

/**
 * メディアクエリフック
 *
 * CSS メディアクエリの状態を監視します。
 * レスポンシブデザインの実装に使用します。
 *
 * @param query メディアクエリ文字列
 * @returns マッチしているかどうか
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
 *
 * return (
 *   <div>
 *     {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *   </div>
 * )
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // 初期値を設定
    setMatches(mediaQuery.matches);

    // リスナーを追加
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // モダンブラウザ
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
    // レガシーブラウザ対応
    else {
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}
