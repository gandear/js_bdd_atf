// src/api/clients/errors.js
export class ApiError extends Error {
  constructor(message, { status, url, body, cause } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.body = body;
    // suportă și Error.cause dacă e disponibil
    if (cause) this.cause = cause;
  }
}

export class TimeoutError extends ApiError {
  constructor(timeoutMs, ctx = {}) {
    super(`Timeout after ${timeoutMs}ms`, ctx);
    this.name = 'TimeoutError';
    this.timeoutMs = timeoutMs;
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error', ctx = {}) {
    super(message, ctx);
    this.name = 'NetworkError';
  }
}

export class ParseError extends ApiError {
  constructor(message = 'Invalid JSON', ctx = {}) {
    super(message, ctx);
    this.name = 'ParseError';
  }
}

// opțional: mici utilitare
export const isTimeoutError = (e) => e instanceof TimeoutError;
export const isNetworkError = (e) => e instanceof NetworkError;
export const isParseError   = (e) => e instanceof ParseError;

// opțional: serializare prietenoasă pentru logger/Allure
export function serializeError(e) {
  return {
    name: e?.name,
    message: e?.message,
    status: e?.status,
    url: e?.url,
    body: e?.body,
    cause: e?.cause?.message || undefined,
    stack: e?.stack,
  };
}
