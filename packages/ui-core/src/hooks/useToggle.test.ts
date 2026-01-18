import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('should initialize with default value (false)', () => {
    const { result } = renderHook(() => useToggle());
    const [value] = result.current;
    expect(value).toBe(false);
  });

  it('should initialize with custom value', () => {
    const { result } = renderHook(() => useToggle(true));
    const [value] = result.current;
    expect(value).toBe(true);
  });

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      const [, toggle] = result.current;
      toggle();
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      const [, toggle] = result.current;
      toggle();
    });

    expect(result.current[0]).toBe(false);
  });

  it('should set value directly', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      const [, , setValue] = result.current;
      setValue(true);
    });

    expect(result.current[0]).toBe(true);

    act(() => {
      const [, , setValue] = result.current;
      setValue(false);
    });

    expect(result.current[0]).toBe(false);
  });

  it('should handle multiple toggles', () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      const [, toggle] = result.current;
      toggle(); // false -> true
      toggle(); // true -> false
      toggle(); // false -> true
    });

    expect(result.current[0]).toBe(true);
  });

  it('should maintain toggle function reference', () => {
    const { result, rerender } = renderHook(() => useToggle());

    const [, toggle1] = result.current;

    act(() => {
      toggle1();
    });

    rerender();

    const [, toggle2] = result.current;

    expect(toggle1).toBe(toggle2);
  });
});
