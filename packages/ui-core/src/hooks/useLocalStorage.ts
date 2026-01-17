import { Dispatch, SetStateAction, useCallback, useState } from 'react';

/**
 * LocalStorage フック
 *
 * ブラウザのLocalStorageと同期するstate管理フック
 *
 * @param key LocalStorageのキー
 * @param initialValue 初期値
 * @returns [値, setter関数]
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light')
 *
 * <Button onClick={() => setTheme('dark')}>ダークモードに切り替え</Button>
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  // State の初期化
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 値を保存する関数
  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      try {
        // 関数が渡された場合は実行
        const valueToStore = value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
