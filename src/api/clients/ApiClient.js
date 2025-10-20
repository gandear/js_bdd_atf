// src/api/clients/ApiClient.js
// API client pentru Playwright APIRequestContext:
// - timeouts per-request (fără Promise.race)
// - erori tipizate (TimeoutError / NetworkError / ParseError / ApiError)
// - parsare JSON sigură pe baza Content-Type
// - Authorization Bearer auto dacă a fost setat token-ul
// - endpoints convenabile pentru ReqRes

import { ApiError, TimeoutError, NetworkError, ParseError } from './errors.js';

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
    const { res, json } = await this.login(credentials); // POST /api/login
    if (res.status() === 200 && json?.token) this.setAuthToken(json.token);
    return { res, json };
  }

  mergeHeaders(headers) {
    const merged = {
      Accept: 'application/json, text/plain;q=0.9',
      ...this.defaultHeaders,
      ...(headers || {}),
    };
    if (this.authToken && !('Authorization' in merged)) {
      merged.Authorization = `Bearer ${this.authToken}`;
    }
    return merged;
  }

  buildUrlWithQuery(basePath, query) {
    if (!query || typeof query !== 'object') return basePath;
    const url = new URL(basePath, 'http://_dummy_base_'); // bază neutră ca să folosim URLSearchParams
    for (const [k, v] of Object.entries(query)) {
      if (Array.isArray(v)) v.forEach(item => url.searchParams.append(k, String(item)));
      else if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
    const qs = url.search.length ? url.search : '';
    return `${basePath.split('?')[0]}${qs}`;
  }

  async requestWithHandling(method, path, options = {}) {
    const { data, headers, timeoutMs, query, throwOnHttpError = true, validateStatus } = options;

    // Playwright suportă `params`, dar pentru compatibilitate construim și noi URL-ul cu query
    const finalPath = this.buildUrlWithQuery(path, query);

    const requestOptions = {
      headers: this.mergeHeaders(headers),
      timeout: timeoutMs ?? this.defaultTimeoutMs,
    };

    // Dacă trimiți body și nu ai specificat un content-type, presupunem JSON
    if (data !== undefined) {
      const lower = Object.fromEntries(
        Object.entries(requestOptions.headers).map(([k, v]) => [k.toLowerCase(), v])
      );
      if (!lower['content-type']) requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.data = data;
    }

    let res;
    try {
      res = await this.request[method](finalPath, requestOptions);
    } catch (e) {
      const msg = String(e?.message || '').toLowerCase();
      if (msg.includes('timeout')) throw new TimeoutError(requestOptions.timeout, { url: finalPath, cause: e });
      if (msg.includes('net') || msg.includes('network')) throw new NetworkError('Network request failed', { url: finalPath, cause: e });
      throw new ApiError('Request failed', { url: finalPath, cause: e });
    }

    const contentType = (res.headers()['content-type'] || '').toLowerCase();
    let json = null;
    let text = null;

    if (contentType.includes('application/json')) {
      try {
        json = await res.json();
      } catch (e) {
        throw new ParseError(e.message, { status: res.status(), url: res.url() });
      }
    } else {
      try { text = await res.text(); } catch { /* ignore */ }
    }

    const status = res.status();
    const okByPolicy = validateStatus ? validateStatus(status) : res.ok();

    if (!okByPolicy && throwOnHttpError) {
      throw new ApiError(`HTTP ${status}`, {
        status,
        url: res.url(),
        body: json ?? text
      });
    }

    return { res, json, text };
  }

  // Verbe convenabile (nume clare, fără underscore)
  get(path, headers, opts)        { return this.requestWithHandling('get', path, { headers, ...(opts || {}) }); }
  post(path, data, headers, opts) { return this.requestWithHandling('post', path, { data, headers, ...(opts || {}) }); }
  put(path, data, headers, opts)  { return this.requestWithHandling('put', path, { data, headers, ...(opts || {}) }); }
  delete(path, headers, opts)     { return this.requestWithHandling('delete', path, { headers, ...(opts || {}) }); }
  patch(path, data, headers, opts){ return this.requestWithHandling('patch', path, { data, headers, ...(opts || {}) }); }

  // === Endpoints ReqRes ===
  getUsers(page = 1, opts)          { return this.get(`/api/users`, undefined, { ...(opts || {}), query: { page } }); }
  getUser(id, opts)                 { return this.get(`/api/users/${id}`, undefined, opts); }
  createUser(user, opts)            { return this.post(`/api/users`, user, { 'Content-Type': 'application/json' }, opts); }
  updateUser(id, user, opts)        { return this.put(`/api/users/${id}`, user, { 'Content-Type': 'application/json' }, opts); }
  deleteUser(id, opts)              { return this.delete(`/api/users/${id}`, undefined, opts); }
  register(credentials, opts)       { return this.post(`/api/register`, credentials, { 'Content-Type': 'application/json' }, opts); }
  login(credentials, opts)          { return this.post(`/api/login`, credentials, { 'Content-Type': 'application/json' }, opts); }
}
