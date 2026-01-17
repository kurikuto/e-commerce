import { useCallback, useState } from 'react';

/**
 * トグルフック
 *
 * boolean値の切り替えを簡単に行うフック
 *
 * @param initialValue 初期値（デフォルト: false）
 * @returns [現在の値, トグル関数, 値を設定する関数]
 *
 * @example
 * ```tsx
 * const [isOpen, toggle, setIsOpen] = useToggle(false)
 *
 * return (
 *   <>
 *     <Button onClick={toggle}>メニューを開閉</Button>
 *     {isOpen && <Menu onClose={() => setIsOpen(false)} />}
 *   </>
 * )
 * ```
 */
export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
