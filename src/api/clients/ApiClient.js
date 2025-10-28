// src/api/clients/ApiClient.js
import { ApiError, NetworkError, TimeoutError, serializeError } from './errors.js';

export class ApiClient {

  constructor(request, { 
    defaultHeaders = {}, 
    defaultTimeoutMs = 10_000, 
    baseURL = '', 
    logger = null 
  } = {}) {
    this.request = request;
    this.baseURL = baseURL.replace(/\/$/, '');
    this.defaultHeaders = defaultHeaders;
    this.defaultTimeoutMs = (process.env.API_TIMEOUT_MS ? parseInt(process.env.API_TIMEOUT_MS, 10) : defaultTimeoutMs);
    this.logger = logger || console;
    
    const envRetries = process.env.API_MAX_RETRIES ?? process.env.API_RETRY_COUNT;
    this.maxRetries = envRetries ? parseInt(envRetries, 10) : 3;

    const envBaseBackoff = process.env.API_BASE_BACKOFF_MS ?? process.env.API_BACKOFF_MS;
    this.defaultBaseBackoffMs = envBaseBackoff ? parseInt(envBaseBackoff, 10) : 100;
  }

  async requestWithHandling(method, path, options = {}) {
    const { data, headers, timeoutMs, query, throwOnHttpError = true, validateStatus } = options;

    const requestOptions = {
      headers: { ...this.defaultHeaders, ...(headers || {}) },
      timeout: timeoutMs ?? this.defaultTimeoutMs,
      params: query,
    };

    if (data !== undefined) {
      requestOptions.data = data;
      requestOptions.headers['Content-Type'] = 'application/json';
    }

    let res;
    try {
      res = await this.request[method](`${this.baseURL}${path}`, requestOptions);
    } catch (e) {
      const msg = String(e.message || e).toLowerCase();
      if (msg.includes('timeout')) throw new TimeoutError(requestOptions.timeout, { url: path, cause: e });
      if (msg.includes('net') || msg.includes('network')) throw new NetworkError('Network request failed', { url: path, cause: e });
      throw new ApiError('Request failed', { url: path, cause: e });
    }

    let json = null, text = null;
    try {
      text = await res.text();
      json = text ? JSON.parse(text) : null;
    } catch {
      // ignore parse errors
    }

    const status = res.status();
    const okByPolicy = validateStatus ? validateStatus(status) : res.ok();

    if (!okByPolicy && throwOnHttpError) {
      const payload = json ?? { status, text };
      const normalized = serializeError({ name: 'HttpError', message: 'HTTP error', status, url: path, payload });
      const err = new ApiError(normalized.message, { url: path, status, cause: normalized });
      throw err;
    }

    return { res, json, text };
  }

  get(path, headers, opts)          { return this.requestWithHandling('get', path, { headers, ...(opts || {}) }); }
  post(path, data, headers, opts)   { return this.requestWithHandling('post', path, { data, headers, ...(opts || {}) }); }
  put(path, data, headers, opts)    { return this.requestWithHandling('put', path, { data, headers, ...(opts || {}) }); }
  delete(path, headers, opts)       { return this.requestWithHandling('delete', path, { headers, ...(opts || {}) }); }
  patch(path, data, headers, opts)  { return this.requestWithHandling('patch', path, { data, headers, ...(opts || {}) }); }

  // ✅ CRUD endpoints (NO auth needed for reqres.in)
  getUsers(page = 1, opts)          { return this.get(`/api/users`, { 'x-skip-auth': 'true' }, { ...(opts || {}), query: { page } }); }
  getUser(id, opts)                 { return this.get(`/api/users/${id}`, { 'x-skip-auth': 'true' }, opts); }
  createUser(user, opts)            { return this.post(`/api/users`, user, { 'x-skip-auth': 'true' }, opts); }
  updateUser(id, user, opts)        { return this.put(`/api/users/${id}`, user, { 'x-skip-auth': 'true' }, opts); }
  deleteUser(id, opts)              { return this.delete(`/api/users/${id}`, { 'x-skip-auth': 'true' }, opts); }
  patchUser(id, user, opts)         { 
    if (!id) throw new Error('patchUser requires id');
    return this.patch(`/api/users/${id}`, user, { 'x-skip-auth': 'true' }, opts); 
  }

  // ✅ AUTH endpoints (NO auth required - public endpoints)
  register(credentials, opts) { 
    return this.post(`/api/register`, credentials, { 'x-skip-auth': 'true' }, opts); 
  }

  login(credentials, opts) { 
    return this.post(`/api/login`, credentials, { 'x-skip-auth': 'true' }, opts); 
  }

}