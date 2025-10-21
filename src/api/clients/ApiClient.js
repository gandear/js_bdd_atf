// src/api/clients/ApiClient.js
import { ApiError, TimeoutError, NetworkError } from './errors.js';

export class ApiClient {

  constructor(request, { defaultHeaders = {}, defaultTimeoutMs = 10_000, baseURL } = {}) {
    this.request = request;
    this.baseURL = baseURL;
    this.authToken = null;
    this.defaultHeaders = defaultHeaders;
    this.defaultTimeoutMs = defaultTimeoutMs;
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
    const merged = { Accept: 'application/json, text/plain;q=0.9', ...this.defaultHeaders, ...(headers || {}) };
    if (this.authToken && !merged.Authorization) merged.Authorization = `Bearer ${this.authToken}`;
    return merged;
  }

  async requestWithHandling(method, path, options = {}) {
    const { data, headers, timeoutMs, query, throwOnHttpError = true, validateStatus } = options;

    const requestOptions = {
      headers: this.mergeHeaders(headers),
      timeout: timeoutMs ?? this.defaultTimeoutMs,
      params: query,
    };

    if (data !== undefined) {
      if (!requestOptions.headers['Content-Type']) requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.data = data;
    }

    let res;
    try {
      res = await this.request[method](path, requestOptions);
    } catch (e) {
      const msg = String(e?.message || '').toLowerCase();
      if (msg.includes('timeout')) throw new TimeoutError(requestOptions.timeout, { url: path, cause: e });
      if (msg.includes('net') || msg.includes('network')) throw new NetworkError('Network request failed', { url: path, cause: e });
      throw new ApiError('Request failed', { url: path, cause: e });
    }

    let json = null, text = null;
    try {
      json = await res.json();
    } catch {
      try { text = await res.text(); } catch { /* ignore */ }
    }

    const status = res.status();
    const okByPolicy = validateStatus ? validateStatus(status) : res.ok();

    if (!okByPolicy && throwOnHttpError) {
      throw new ApiError(`HTTP ${status}`, { status, url: res.url(), body: json ?? text });
    }

    return { res, json, text };
  }

  get(path, headers, opts)        { return this.requestWithHandling('get', path, { headers, ...(opts || {}) }); }
  post(path, data, headers, opts) { return this.requestWithHandling('post', path, { data, headers, ...(opts || {}) }); }
  put(path, data, headers, opts)  { return this.requestWithHandling('put', path, { data, headers, ...(opts || {}) }); }
  delete(path, headers, opts)     { return this.requestWithHandling('delete', path, { headers, ...(opts || {}) }); }
  patch(path, data, headers, opts){ return this.requestWithHandling('patch', path, { data, headers, ...(opts || {}) }); }

  // ReqRes endpoints
  getUsers(page = 1, opts)          { return this.get(`/api/users`, undefined, { ...(opts || {}), query: { page } }); }
  getUser(id, opts)                 { return this.get(`/api/users/${id}`, undefined, opts); }
  createUser(user, opts)            { return this.post(`/api/users`, user, { 'Content-Type': 'application/json' }, opts); }
  updateUser(id, user, opts)        { return this.put(`/api/users/${id}`, user, { 'Content-Type': 'application/json' }, opts); }
  deleteUser(id, opts)              { return this.delete(`/api/users/${id}`, undefined, opts); }
  register(credentials, opts)       { return this.post(`/api/register`, credentials, { 'Content-Type': 'application/json' }, opts); }
  login(credentials, opts)          { return this.post(`/api/login`, credentials, { 'Content-Type': 'application/json' }, opts); }
}