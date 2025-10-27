// src/api/clients/ApiClient.js
import { ApiError, NetworkError, TimeoutError, serializeError } from './errors.js';
import { HeadersManager } from '../helpers/headersManager.js';

export class ApiClient {

  constructor(request, { 
    defaultHeaders = {}, 
    defaultTimeoutMs = 10_000, 
    baseURL = '', 
    authToken = null,           
    authScheme = 'bearer', 
    apiKeyHeader = 'x-api-key', 
    logger = null 
  } = {}) {
    this.request = request;
    this.baseURL = baseURL.replace(/\/$/, '');
    this.authToken = authToken;  // ✅ Inițializează direct din constructor
    this.defaultHeaders = defaultHeaders;
    this.defaultTimeoutMs = (process.env.API_TIMEOUT_MS ? parseInt(process.env.API_TIMEOUT_MS, 10) : defaultTimeoutMs);
    this.authScheme = authScheme;
    this.apiKeyHeader = apiKeyHeader;
    this.logger = logger || console;
    
    const envRetries = process.env.API_MAX_RETRIES ?? process.env.API_RETRY_COUNT;
    this.maxRetries = envRetries ? parseInt(envRetries, 10) : 3;

    const envBaseBackoff = process.env.API_BASE_BACKOFF_MS ?? process.env.API_BACKOFF_MS;
    this.defaultBaseBackoffMs = envBaseBackoff ? parseInt(envBaseBackoff, 10) : 100;
  }

  setAuthToken(token) { 
    this.authToken = token; 
  }

  mergeHeaders(headers) {
    return HeadersManager.merge(this.defaultHeaders, headers, {
      authToken: this.authToken,
      authScheme: this.authScheme,
      apiKeyHeader: this.apiKeyHeader
    });
  }

  async requestWithHandling(method, path, options = {}) {
    const { data, headers, timeoutMs, query, throwOnHttpError = true, validateStatus } = options;

    const requestOptions = {
      headers: this.mergeHeaders(headers),
      timeout: timeoutMs ?? this.defaultTimeoutMs,
      params: query,
    };

    if (data !== undefined) {
      requestOptions.data = data;
      requestOptions.headers = { ...requestOptions.headers, 'Content-Type': 'application/json' };
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

  getUsers(page = 1, opts)          { return this.get(`/api/users`, undefined, { ...(opts || {}), query: { page } }); }
  getUser(id, opts)                 { return this.get(`/api/users/${id}`, undefined, opts); }
  createUser(user, opts)            { return this.post(`/api/users`, user, undefined, opts); }
  updateUser(id, user, opts)        { return this.put(`/api/users/${id}`, user, undefined, opts); }
  deleteUser(id, opts)              { return this.delete(`/api/users/${id}`, undefined, opts); }
  register(credentials, opts)       { return this.post(`/api/register`, credentials, undefined, opts); }
  login(credentials, opts)          { return this.post(`/api/login`, credentials, undefined, opts); }
  patchUser(id, user, opts)         { 
    if (!id) throw new Error('patchUser requires id');
    return this.patch(`/api/users/${id}`, user, undefined, opts); 
  }
}