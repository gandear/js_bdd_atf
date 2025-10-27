// src/utils/requestFactory.js
// Provides adapters to build an HTTP request function. Prefer Playwright APIRequestContext
// when available; otherwise fall back to global fetch with AbortController and optional
// per-test logger support.

export function createPlaywrightAdapter(request) {
  return async ({ method, url, headers, data, timeout }) =>
    request.fetch(url, { method: method.toUpperCase(), headers, data, timeout });
}

export function createFetchAdapter({ logger = null, timeoutDefault = 15000 } = {}) {
  return async ({ method, url, headers, data, timeout }) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout ?? timeoutDefault);
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      if (err?.name === 'AbortError') {
        if (logger && typeof logger.warn === 'function') {
          logger.warn('Request aborted due to timeout', { method, url });
        } else {
          // fallback for when logger isn't available
          console.error('Request aborted due to timeout:', { method, url });
        }
      }
      throw err;
    }
  };
}

export function buildClientRequest(request, opts = {}) {
  const { logger = null, timeoutDefault = 15000 } = opts;
  if (request && typeof request.fetch === 'function') return createPlaywrightAdapter(request);
  return createFetchAdapter({ logger, timeoutDefault });
}
