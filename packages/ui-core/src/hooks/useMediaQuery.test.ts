import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

// Mock matchMedia
const createMockMatchMedia = (matches: boolean) => {
  const listeners: ((event: MediaQueryListEvent) => void)[] = [];

  return {
    matches,
    media: '',
    addEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
      if (event === 'change') {
        listeners.push(handler);
      }
    }),
    removeEventListener: vi.fn((event: string, handler: (event: MediaQueryListEvent) => void) => {
      if (event === 'change') {
        const index = listeners.indexOf(handler);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    }),
    dispatchEvent: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    onchange: null,
    // Helper to trigger change
    _trigger: (newMatches: boolean) => {
      listeners.forEach(listener => {
        listener({ matches: newMatches } as MediaQueryListEvent);
      });
    },
  };
};

describe('useMediaQuery', () => {
  let mockMatchMedia: ReturnType<typeof createMockMatchMedia> & { _trigger: (matches: boolean) => void };

  beforeEach(() => {
    mockMatchMedia = createMockMatchMedia(false) as any;
    window.matchMedia = vi.fn(() => mockMatchMedia as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial matches value', () => {
    mockMatchMedia.matches = true;

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(true);
  });

  it('should return false when media query does not match', () => {
    mockMatchMedia.matches = false;

    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
  });

  it('should update when media query match changes', async () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    // Trigger change
    mockMatchMedia._trigger(true);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it('should handle multiple changes', async () => {
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);

    mockMatchMedia._trigger(true);
    await waitFor(() => expect(result.current).toBe(true));

    mockMatchMedia._trigger(false);
    await waitFor(() => expect(result.current).toBe(false));

    mockMatchMedia._trigger(true);
    await waitFor(() => expect(result.current).toBe(true));
  });

  it('should add event listener on mount', () => {
    renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should remove event listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    unmount();

    expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle different media queries', () => {
    const { result: result1 } = renderHook(() => useMediaQuery('(max-width: 480px)'));
    const { result: result2 } = renderHook(() => useMediaQuery('(prefers-color-scheme: dark)'));

    expect(result1.current).toBe(false);
    expect(result2.current).toBe(false);
  });

  it('should update when query changes', async () => {
    const { result, rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: '(min-width: 768px)' } }
    );

    expect(result.current).toBe(false);

    // Create a new mock for the new query
    const newMockMatchMedia = createMockMatchMedia(true) as any;
    window.matchMedia = vi.fn(() => newMockMatchMedia);

    rerender({ query: '(min-width: 1024px)' });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
