import { useEffect, useRef } from 'react';

/**
 * 前回の値を保持するフック
 *
 * コンポーネントの再レンダリング前の値を保持します。
 * 値の変更を追跡する際に便利です。
 *
 * @param value 追跡する値
 * @returns 前回の値
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0)
 * const prevCount = usePrevious(count)
 *
 * return (
 *   <div>
 *     <p>現在: {count}</p>
 *     <p>前回: {prevCount}</p>
 *     <Button onClick={() => setCount(count + 1)}>増加</Button>
 *   </div>
 * )
 * ```
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
