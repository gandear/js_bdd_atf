// src/utils/logging.js
// Utilitare simple pentru loguri în step-uri (redactare, trunchiere, sumar HTTP, backoff)

/** Ascunde stringuri sensibile (ex. parole) */
export const mask = (s) => (typeof s === 'string' && s.length ? '***' : s);

/** Redactare generică pe chei sensibile */
export function redactGeneric(obj, keys = ['password', 'token', 'apiKey', 'authorization', 'Authorization']) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = Array.isArray(obj) ? obj.map((v) => redactGeneric(v, keys)) : { ...obj };
  for (const k of Object.keys(out)) {
    if (keys.includes(k)) out[k] = mask(out[k]);
    else if (out[k] && typeof out[k] === 'object') out[k] = redactGeneric(out[k], keys);
  }
  return out;
}

/** Redactare rapidă pentru payload-uri de auth (email/parolă) */
export const redactAuth = (payload) => redactGeneric(payload, ['password', 'token']);

/** Stringify sigur (tolerant la cicluri) */
export function stringifySafe(value, space = 0) {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) return '[Circular]';
        seen.add(val);
      }
      return val;
    },
    space
  );
}

/** Trunchiere la N caractere (pentru body mare) */
export function safeLength(v, n = 800) {
  try {
    const s = typeof v === 'string' ? v : stringifySafe(v);
    return s && s.length > n ? s.slice(0, n) + '…' : s;
  } catch {
    return v;
  }
}

/** Sumar HTTP gata de log (status, url, body trunchiat) */
export function httpSummary(res, body) {
  const status = res?.status?.();
  const url = res?.url?.();
  return { status, url, body: safeLength(body) };
}

/** Sumar de eroare pentru loguri Allure/pino (inclusiv cause, dacă există) */
export function errorSummary(e) {
  return {
    name: e?.name,
    message: e?.message,
    status: e?.status,
    url: e?.url,
    body: safeLength(e?.body),
    cause: e?.cause?.name || undefined,
    causeMessage: e?.cause?.message || undefined,
  };
}

/** Sleep/promisă (pt. backoff) */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Backoff liniar cu jitter mic (suficient pentru ReqRes 429) */
export function backoffMs(attempt, base = 300, jitterMax = 100) {
  const jitter = Math.floor(Math.random() * jitterMax);
  return base * attempt + jitter; // ex.: attempt=1 => ~300-400ms, attempt=2 => ~600-700ms
}
