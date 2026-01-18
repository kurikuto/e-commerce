import { describe, expect, it } from 'vitest';
import {
    AppError,
    AuthenticationError,
    AuthorizationError,
    ConflictError,
    InternalServerError,
    isAppError,
    NotFoundError,
    serializeError,
    ValidationError,
} from './errors';

describe('AppError', () => {
  it('should create error with correct properties', () => {
    const error = new AppError('Test error', 'TEST_ERROR', 400, { key: 'value' });

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ key: 'value' });
    expect(error.name).toBe('AppError');
  });

  it('should default statusCode to 500', () => {
    const error = new AppError('Test error', 'TEST_ERROR');
    expect(error.statusCode).toBe(500);
  });

  it('should capture stack trace', () => {
    const error = new AppError('Test error', 'TEST_ERROR');
    expect(error.stack).toBeDefined();
  });
});

describe('ValidationError', () => {
  it('should create validation error with fields', () => {
    const fields = [
      { path: 'email', message: 'Invalid email' },
      { path: 'password', message: 'Too short' },
    ];
    const error = new ValidationError('Validation failed', fields);

    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.fields).toEqual(fields);
    expect(error.details?.fields).toEqual(fields);
    expect(error.name).toBe('ValidationError');
  });

  it('should create validation error without fields', () => {
    const error = new ValidationError('Validation failed');

    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.fields).toBeUndefined();
  });
});

describe('AuthenticationError', () => {
  it('should create authentication error with default message', () => {
    const error = new AuthenticationError();

    expect(error.message).toBe('Authentication required');
    expect(error.code).toBe('AUTHENTICATION_ERROR');
    expect(error.statusCode).toBe(401);
  });

  it('should create authentication error with custom message', () => {
    const error = new AuthenticationError('Invalid token');
    expect(error.message).toBe('Invalid token');
  });
});

describe('AuthorizationError', () => {
  it('should create authorization error with default message', () => {
    const error = new AuthorizationError();

    expect(error.message).toBe('Access denied');
    expect(error.code).toBe('AUTHORIZATION_ERROR');
    expect(error.statusCode).toBe(403);
  });

  it('should create authorization error with custom message', () => {
    const error = new AuthorizationError('Insufficient permissions');
    expect(error.message).toBe('Insufficient permissions');
  });
});

describe('NotFoundError', () => {
  it('should create not found error without identifier', () => {
    const error = new NotFoundError('Product');

    expect(error.message).toBe('Product not found');
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
    expect(error.details).toEqual({ resource: 'Product', identifier: undefined });
  });

  it('should create not found error with identifier', () => {
    const error = new NotFoundError('Product', 'abc-123');

    expect(error.message).toBe("Product with identifier 'abc-123' not found");
    expect(error.details).toEqual({ resource: 'Product', identifier: 'abc-123' });
  });
});

describe('ConflictError', () => {
  it('should create conflict error with details', () => {
    const details = { stock: 0, requested: 5 };
    const error = new ConflictError('Insufficient stock', details);

    expect(error.code).toBe('CONFLICT');
    expect(error.statusCode).toBe(409);
    expect(error.details).toEqual(details);
  });

  it('should create conflict error without details', () => {
    const error = new ConflictError('Duplicate entry');

    expect(error.message).toBe('Duplicate entry');
    expect(error.details).toBeUndefined();
  });
});

describe('InternalServerError', () => {
  it('should create internal server error with default message', () => {
    const error = new InternalServerError();

    expect(error.message).toBe('An unexpected error occurred');
    expect(error.code).toBe('INTERNAL_SERVER_ERROR');
    expect(error.statusCode).toBe(500);
  });

  it('should include cause error message in details', () => {
    const cause = new Error('Database connection failed');
    const error = new InternalServerError('Database error', cause);

    expect(error.details?.cause).toBe('Database connection failed');
  });

  it('should create internal server error without cause', () => {
    const error = new InternalServerError('Something went wrong');

    expect(error.message).toBe('Something went wrong');
    expect(error.details).toEqual({ cause: undefined });
  });
});

describe('isAppError', () => {
  it('should return true for AppError instances', () => {
    const error = new AppError('Test', 'TEST', 500);
    expect(isAppError(error)).toBe(true);
  });

  it('should return true for AppError subclasses', () => {
    expect(isAppError(new ValidationError('Test'))).toBe(true);
    expect(isAppError(new AuthenticationError())).toBe(true);
    expect(isAppError(new AuthorizationError())).toBe(true);
    expect(isAppError(new NotFoundError('Product'))).toBe(true);
    expect(isAppError(new ConflictError('Test'))).toBe(true);
    expect(isAppError(new InternalServerError())).toBe(true);
  });

  it('should return false for non-AppError', () => {
    expect(isAppError(new Error('Test'))).toBe(false);
    expect(isAppError('string')).toBe(false);
    expect(isAppError(null)).toBe(false);
    expect(isAppError(undefined)).toBe(false);
    expect(isAppError(123)).toBe(false);
    expect(isAppError({})).toBe(false);
  });
});

describe('serializeError', () => {
  it('should serialize AppError correctly', () => {
    const error = new ValidationError('Invalid input', [
      { path: 'email', message: 'Required' },
    ]);

    const serialized = serializeError(error);

    expect(serialized).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Invalid input',
      details: {
        fields: [{ path: 'email', message: 'Required' }],
      },
    });
  });

  it('should serialize AppError without details', () => {
    const error = new AuthenticationError('Token expired');

    const serialized = serializeError(error);

    expect(serialized).toEqual({
      code: 'AUTHENTICATION_ERROR',
      message: 'Token expired',
      details: undefined,
    });
  });

  it('should serialize standard Error', () => {
    const error = new Error('Standard error');

    const serialized = serializeError(error);

    expect(serialized).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'Standard error',
    });
  });

  it('should handle unknown error types', () => {
    const serialized = serializeError('string error');

    expect(serialized).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    });
  });

  it('should handle null/undefined', () => {
    expect(serializeError(null)).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    });

    expect(serializeError(undefined)).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    });
  });

  it('should handle numeric values', () => {
    expect(serializeError(404)).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    });
  });

  it('should handle object values', () => {
    expect(serializeError({ message: 'test' })).toEqual({
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
    });
  });
});
