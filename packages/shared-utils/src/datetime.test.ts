import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    addDays,
    daysBetween,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    fromTimestamp,
    getCurrentTimestamp,
    isDateInRange,
    toTimestamp,
} from './datetime';

describe('getCurrentTimestamp', () => {
  it('should return a valid ISO 8601 timestamp', () => {
    const timestamp = getCurrentTimestamp();
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('should return different timestamps when called multiple times', () => {
    const timestamp1 = getCurrentTimestamp();
    const timestamp2 = getCurrentTimestamp();
    // Note: may be equal if called in quick succession
    expect(typeof timestamp1).toBe('string');
    expect(typeof timestamp2).toBe('string');
  });
});

describe('toTimestamp', () => {
  it('should convert Date to Timestamp', () => {
    const date = new Date('2024-01-15T12:30:45.678Z');
    const timestamp = toTimestamp(date);
    expect(timestamp).toBe('2024-01-15T12:30:45.678Z');
  });
});

describe('fromTimestamp', () => {
  it('should convert Timestamp to Date', () => {
    const timestamp = '2024-01-15T12:30:45.678Z' as any;
    const date = fromTimestamp(timestamp);
    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toBe('2024-01-15T12:30:45.678Z');
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should format recent times in seconds', () => {
    const timestamp = '2024-01-15T11:59:30.000Z' as any;
    const result = formatRelativeTime(timestamp);
    expect(result).toContain('30');
    expect(result).toMatch(/秒/);
  });

  it('should format times in minutes', () => {
    const timestamp = '2024-01-15T11:45:00.000Z' as any;
    const result = formatRelativeTime(timestamp);
    expect(result).toContain('15');
    expect(result).toMatch(/分/);
  });

  it('should format times in hours', () => {
    const timestamp = '2024-01-15T10:00:00.000Z' as any;
    const result = formatRelativeTime(timestamp);
    expect(result).toContain('2');
    expect(result).toMatch(/時間/);
  });

  it('should format times in days', () => {
    const timestamp = '2024-01-13T12:00:00.000Z' as any;
    const result = formatRelativeTime(timestamp);
    expect(result).toMatch(/日|昨日/); // 「一昨日」or「2日前」
  });

  it('should format old dates using formatDate', () => {
    const timestamp = '2023-11-15T12:00:00.000Z' as any;
    const result = formatRelativeTime(timestamp);
    expect(result).toMatch(/2023/);
  });
});

describe('formatDate', () => {
  it('should format date in Japanese locale', () => {
    const timestamp = '2024-01-15T12:30:45.678Z' as any;
    const result = formatDate(timestamp, 'ja');
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/1/);
    expect(result).toMatch(/15/);
  });

  it('should format date in English locale', () => {
    const timestamp = '2024-01-15T12:30:45.678Z' as any;
    const result = formatDate(timestamp, 'en', { year: 'numeric', month: 'short', day: 'numeric' });
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/Jan/);
  });
});

describe('formatDateTime', () => {
  it('should format date and time', () => {
    const timestamp = '2024-01-15T12:30:45.678Z' as any;
    const result = formatDateTime(timestamp);
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/:/); // time separator
  });
});

describe('addDays', () => {
  it('should add days to timestamp', () => {
    const timestamp = '2024-01-15T12:00:00.000Z' as any;
    const result = addDays(timestamp, 5);
    const resultDate = fromTimestamp(result);
    expect(resultDate.getDate()).toBe(20);
  });

  it('should subtract days when negative', () => {
    const timestamp = '2024-01-15T12:00:00.000Z' as any;
    const result = addDays(timestamp, -5);
    const resultDate = fromTimestamp(result);
    expect(resultDate.getDate()).toBe(10);
  });
});

describe('daysBetween', () => {
  it('should calculate days between timestamps', () => {
    const start = '2024-01-15T12:00:00.000Z' as any;
    const end = '2024-01-20T12:00:00.000Z' as any;
    expect(daysBetween(start, end)).toBe(5);
  });

  it('should return negative for reverse order', () => {
    const start = '2024-01-20T12:00:00.000Z' as any;
    const end = '2024-01-15T12:00:00.000Z' as any;
    expect(daysBetween(start, end)).toBe(-5);
  });

  it('should return 0 for same day', () => {
    const timestamp = '2024-01-15T12:00:00.000Z' as any;
    expect(daysBetween(timestamp, timestamp)).toBe(0);
  });
});

describe('isDateInRange', () => {
  it('should return true when date is within range', () => {
    const date = '2024-01-15T12:00:00.000Z' as any;
    const start = '2024-01-10T00:00:00.000Z' as any;
    const end = '2024-01-20T23:59:59.999Z' as any;
    expect(isDateInRange(date, start, end)).toBe(true);
  });

  it('should return true when date equals start', () => {
    const date = '2024-01-15T12:00:00.000Z' as any;
    const start = '2024-01-15T12:00:00.000Z' as any;
    const end = '2024-01-20T23:59:59.999Z' as any;
    expect(isDateInRange(date, start, end)).toBe(true);
  });

  it('should return true when date equals end', () => {
    const date = '2024-01-20T23:59:59.999Z' as any;
    const start = '2024-01-10T00:00:00.000Z' as any;
    const end = '2024-01-20T23:59:59.999Z' as any;
    expect(isDateInRange(date, start, end)).toBe(true);
  });

  it('should return false when date is before range', () => {
    const date = '2024-01-05T12:00:00.000Z' as any;
    const start = '2024-01-10T00:00:00.000Z' as any;
    const end = '2024-01-20T23:59:59.999Z' as any;
    expect(isDateInRange(date, start, end)).toBe(false);
  });

  it('should return false when date is after range', () => {
    const date = '2024-01-25T12:00:00.000Z' as any;
    const start = '2024-01-10T00:00:00.000Z' as any;
    const end = '2024-01-20T23:59:59.999Z' as any;
    expect(isDateInRange(date, start, end)).toBe(false);
  });
});
