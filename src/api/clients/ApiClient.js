// src/api/clients/ApiClient.js

export class ApiClient {
  constructor(requestContext, headersManager, options) {
    this.requestContext = requestContext;
    this.headersManager = headersManager;
    this.options = options;
    this.lastResponse = null;
    this.baseURL = options.baseURL;
    this.logger = options.logger;
  }

  // Generic request method
  async request(method, path, options = {}) {
    const { data = undefined, auth = false, params = undefined } = options;

    const headers = this.headersManager.getHeaders(auth);

    const response = await this.requestContext[method](path, {
      data,
      params,
      headers: {
        ...this.options.defaultHeaders,
        ...headers,
      },
    });
    
    this.lastResponse = response;
    return response;
  }

  // Wrapper methods
  async get(path, options = {}) {
    return this.request('get', path, options);
  }

  async post(path, data, options = {}) {
    return this.request('post', path, { ...options, data });
  }

  async delete(endpoint, options = {}) {
    return this.request('delete', endpoint, options);
  }

  async put(endpoint, data, options = {}) {
    return this.request('put', endpoint, { data, ...options });
  }

  // Response accessor
  getLastResponse() {
    if (!this.lastResponse) {
      throw new Error('No response has been stored.');
    }
    return this.lastResponse;
  }
}