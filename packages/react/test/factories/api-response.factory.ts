import type { ApiError, ApiResponse } from '@onedeskpro/chatbot-types';

/** The `{ statusCode, message, data }` envelope every SDK endpoint answers with. */
export function buildEnvelope<T>(data: T, overrides: Partial<ApiResponse<T>> = {}): ApiResponse<T> {
  return {
    statusCode: 200,
    message: 'ok',
    data,
    timestamp: '2026-01-01T00:00:00.000Z',
    path: '/sdk',
    ...overrides,
  };
}

/** A structured error body as the API returns it on non-2xx responses. */
export function buildApiError(overrides: Partial<ApiError> = {}): ApiError {
  return {
    statusCode: 400,
    message: 'Bad request',
    code: 'BAD_REQUEST',
    timestamp: '2026-01-01T00:00:00.000Z',
    path: '/sdk',
    ...overrides,
  };
}
