import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('should initialize with value from localStorage if exists', () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('stored-value');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      const [, setValue] = result.current;
      setValue('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should handle objects', () => {
    const obj = { name: 'John', age: 30 };

    const { result } = renderHook(() => useLocalStorage('user', obj));

    expect(result.current[0]).toEqual(obj);

    const updatedObj = { name: 'Jane', age: 25 };

    act(() => {
      const [, setValue] = result.current;
      setValue(updatedObj);
    });

    expect(result.current[0]).toEqual(updatedObj);
    expect(JSON.parse(window.localStorage.getItem('user')!)).toEqual(updatedObj);
  });

  it('should handle arrays', () => {
    const arr = [1, 2, 3];

    const { result } = renderHook(() => useLocalStorage('numbers', arr));

    expect(result.current[0]).toEqual(arr);

    act(() => {
      const [, setValue] = result.current;
      setValue([4, 5, 6]);
    });

    expect(result.current[0]).toEqual([4, 5, 6]);
  });

  it('should handle function updater', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      const [, setValue] = result.current;
      setValue((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      const [, setValue] = result.current;
      setValue((prev) => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it('should handle invalid JSON in localStorage', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    window.localStorage.setItem('test-key', 'invalid json');

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));

    expect(result.current[0]).toBe('default');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('flag', false));

    expect(result.current[0]).toBe(false);

    act(() => {
      const [, setValue] = result.current;
      setValue(true);
    });

    expect(result.current[0]).toBe(true);
    expect(window.localStorage.getItem('flag')).toBe('true');
  });

  it('should handle null values', () => {
    const { result } = renderHook(() => useLocalStorage('nullable', null));

    expect(result.current[0]).toBe(null);

    act(() => {
      const [, setValue] = result.current;
      setValue('not null');
    });

    expect(result.current[0]).toBe('not null');
  });
});
