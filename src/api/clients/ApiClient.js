import { ApiError, NetworkError, TimeoutError, serializeError } from './errors.js';
import { HeadersManager } from '../helpers/headersManager.js';

export class ApiClient {

  constructor(request, { defaultHeaders = {}, defaultTimeoutMs = 10_000, baseURL, authScheme = 'bearer', apiKeyHeader = 'x-api-key' } = {}) {
    this.request = request;
    this.baseURL = baseURL;
    this.authToken = null;
    this.defaultHeaders = defaultHeaders;
    this.defaultTimeoutMs = defaultTimeoutMs;
    this.authScheme = authScheme;
    this.apiKeyHeader = apiKeyHeader;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  async loginAndSetToken(credentials) {
    const { res, json } = await this.login(credentials);
    if (res.status() === 200 && json?.token) this.setAuthToken(json.token);
    return { res, json };
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
      // ensure JSON body + Content-Type header
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
      // Wrap other transport errors into ApiError and include cause
      throw new ApiError('Request failed', { url: path, cause: e });
    }

    let json = null, text = null;
    try {
      text = await res.text();
      json = text ? JSON.parse(text) : null;
    } catch {
      // ignore parse errors, keep text if present
    }

    const status = res.status();
    const okByPolicy = validateStatus ? validateStatus(status) : res.ok();

    if (!okByPolicy && throwOnHttpError) {
      // Normalize error payloads using serializeError before throwing
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

  // Removed explicit 'Content-Type' headers here — requestWithHandling will add it when data is present
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