// src/api/clients/ApiClient.js
export class ApiClient {
  constructor(request) {
    this.request = request;
    this.authToken = null; // for endpoints requiring auth
  }

  setAuthToken(token) { this.authToken = token; }

  async loginAndSetToken(creds) {
    const { res, json } = await this.login(creds); // POST /api/login
    if (res.status() === 200 && json?.token) this.setAuthToken(json.token);
    return { res, json };
  }

  getRequestOptions({ data, headers } = {}) {
    return {
      data,
      headers: this.authToken
        ? { Authorization: `Bearer ${this.authToken}`, ...(headers ?? {}) }
        : headers,
      failOnStatusCode: false
    };
  }
  
  async  processResponse(promise) {
    const res = await promise;
    const contentType = res.headers()['content-type'] ?? '';
    const json = contentType.includes('application/json') ? await res.json() : null;
    return { res, json };
  }

  get(path, headers)         { return this.processResponse(this.request.get(path, this.getRequestOptions({ headers }))); }
  post(path, data, headers)  { return this.processResponse(this.request.post(path, this.getRequestOptions({ data, headers }))); }
  put(path, data, headers)   { return this.processResponse(this.request.put(path, this.getRequestOptions({ data, headers }))); }
  delete(path, headers)      { return this.processResponse(this.request.delete(path, this.getRequestOptions({ headers }))); }

  // Endpoints
  getUsers(page=1)   { return this.get(`/api/users?page=${page}`); }
  getUser(id)        { return this.get(`/api/users/${id}`); }
  createUser(user)   { return this.post(`/api/users`, user, { 'Content-Type': 'application/json' }); }
  updateUser(id,u)   { return this.put(`/api/users/${id}`, u, { 'Content-Type': 'application/json' }); }
  deleteUser(id)     { return this.delete(`/api/users/${id}`); }
  register(creds)    { return this.post(`/api/register`, creds, { 'Content-Type': 'application/json' }); }
  login(creds)       { return this.post(`/api/login`, creds, { 'Content-Type': 'application/json' }); }
}
