import { describe, expect, it } from 'vitest';
import { formatFileSize, formatNumber, formatPercentage, formatPrice } from './formatters';

describe('formatPrice', () => {
  it('should format price in Japanese Yen', () => {
    expect(formatPrice(1234567)).toBe('￥1,234,567');
    expect(formatPrice(1000)).toBe('￥1,000');
    expect(formatPrice(0)).toBe('￥0');
  });

  it('should handle negative prices', () => {
    expect(formatPrice(-1000)).toBe('-￥1,000');
  });

  it('should not show decimal places', () => {
    const result = formatPrice(1234.56);
    expect(result).toBe('￥1,235'); // rounded
  });
});

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234567)).toBe('-1,234,567');
  });

  it('should handle decimal numbers', () => {
    const result = formatNumber(1234.567);
    expect(result).toMatch(/1,234/);
  });
});

describe('formatFileSize', () => {
  it('should format bytes', () => {
    expect(formatFileSize(0)).toBe('0.0 B');
    expect(formatFileSize(512)).toBe('512.0 B');
    expect(formatFileSize(1023)).toBe('1023.0 B');
  });

  it('should format kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10240)).toBe('10.0 KB');
  });

  it('should format megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(5242880)).toBe('5.0 MB');
    expect(formatFileSize(1572864)).toBe('1.5 MB');
  });

  it('should format gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
    expect(formatFileSize(5368709120)).toBe('5.0 GB');
  });

  it('should format terabytes', () => {
    expect(formatFileSize(1099511627776)).toBe('1.0 TB');
    expect(formatFileSize(2199023255552)).toBe('2.0 TB');
  });

  it('should handle large TB values', () => {
    const result = formatFileSize(10995116277760);
    expect(result).toContain('TB');
    expect(result).toContain('10');
  });
});

describe('formatPercentage', () => {
  it('should format percentages', () => {
    expect(formatPercentage(0.5)).toBe('50.0%');
    expect(formatPercentage(0.25)).toBe('25.0%');
    expect(formatPercentage(1)).toBe('100.0%');
  });

  it('should format with specified decimal places', () => {
    expect(formatPercentage(0.1234, 2)).toBe('12.34%');
    expect(formatPercentage(0.1234, 0)).toBe('12%');
    expect(formatPercentage(0.1234, 3)).toBe('12.340%');
  });

  it('should handle zero', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('should handle values greater than 1', () => {
    expect(formatPercentage(1.5)).toBe('150.0%');
    expect(formatPercentage(2.5, 1)).toBe('250.0%');
  });

  it('should handle negative values', () => {
    expect(formatPercentage(-0.25)).toBe('-25.0%');
  });
});
