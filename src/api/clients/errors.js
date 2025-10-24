// src/api/clients/errors.js
/**
 * General API error classes and a single serialized error helper.
 */

export class ApiError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.name = 'ApiError';
    if (opts.url) this.url = opts.url;
    if (opts.status !== undefined) this.status = opts.status;
    if (opts.cause) this.cause = opts.cause;
  }
}

export class NetworkError extends Error {
  constructor(message, opts = {}) {
    super(message);
    this.name = 'NetworkError';
    if (opts.url) this.url = opts.url;
    if (opts.cause) this.cause = opts.cause;
  }
}

export class TimeoutError extends Error {
  constructor(timeoutMs, opts = {}) {
    super(`Request timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.timeout = timeoutMs;
    if (opts.url) this.url = opts.url;
    if (opts.cause) this.cause = opts.cause;
  }
}

/**
 * serializeError
 * - Normalizes various error shapes into a stable plain object for logging/telemetry.
 * - Use this single exported helper everywhere instead of duplicate implementations.
 */
export function serializeError(err) {
  if (!err) return { message: 'Unknown error' };

  const base = {
    name: err.name || typeof err === 'string' ? String(err) : 'Error',
    message: err.message ?? String(err),
  };

  // Common optional properties
  if (err.url) base.url = err.url;
  if (err.status !== undefined) base.status = err.status;
  if (err.timeout !== undefined) base.timeout = err.timeout;
  if (err.stack) base.stack = err.stack;

  // If the error has a cause (native or custom), include a short representation
  if (err.cause) {
    try {
      const c = err.cause;
      base.cause = {
        name: c.name || typeof c,
        message: c.message ?? String(c)
      };
    } catch {
      base.cause = { message: 'Unable to serialize cause' };
    }
  }

  return base;
}
