// src/api/clients/ApiClient.js
export class ApiClient {
  constructor(request) {
    this.request = request;
    this.authToken = null; // for endpoints requiring auth
  }
  setAuthToken(t) { this.authToken = t; }

  async loginAndSetToken(creds) {
    const { res, json } = await this.login(creds); // POST /api/login
    if (res.status() === 200 && json?.token) this.setAuthToken(json.token);
    return { res, json };
  }

  _opts({ data, headers } = {}) {
    return {
      data,
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}`, ...(headers ?? {}) }
        : headers,
      failOnStatusCode: false
    };
  }
  async _handle(p) {
    const res = await p;
    const ct = res.headers()['content-type'] ?? '';
    const json = ct.includes('application/json') ? await res.json() : null;
    return { res, json };
  }

  get(path, headers)         { return this._handle(this.request.get(path, this._opts({ headers }))); }
  post(path, data, headers)  { return this._handle(this.request.post(path, this._opts({ data, headers }))); }
  put(path, data, headers)   { return this._handle(this.request.put(path, this._opts({ data, headers }))); }
  delete(path, headers)      { return this._handle(this.request.delete(path, this._opts({ headers }))); }

  // Endpoints
  getUsers(page=1)   { return this.get(`/api/users?page=${page}`); }
  getUser(id)        { return this.get(`/api/users/${id}`); }
  createUser(user)   { return this.post(`/api/users`, user, { 'Content-Type': 'application/json' }); }
  updateUser(id,u)   { return this.put(`/api/users/${id}`, u, { 'Content-Type': 'application/json' }); }
  deleteUser(id)     { return this.delete(`/api/users/${id}`); }
  register(creds)    { return this.post(`/api/register`, creds, { 'Content-Type': 'application/json' }); }
  login(creds)       { return this.post(`/api/login`, creds, { 'Content-Type': 'application/json' }); }
}
