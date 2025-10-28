// src/api/clients/ApiClient.js

export class ApiClient {
 
  constructor(requestContext, headersManager) {
    if (!requestContext) {
      throw new Error('ApiClient necesită APIRequestContext.');
    }
    if (!headersManager) {
      throw new Error('ApiClient necesită HeadersManager.');
    }
    this.requestContext = requestContext;
    this.headersManager = headersManager;
    this.lastResponse = null; // Stocăm ultimul răspuns
  }

  async request(method, path, options = {}) {
    const { data = undefined, auth = false, params = undefined } = options;

    // Obținem headerele (cu sau fără token)
    const headers = this.headersManager.getHeaders(auth);

    const config = {
      data,
      params,
      headers,
    };

    // Efectuăm cererea folosind metoda corespunzătoare
    const response = await this.requestContext[method](path, config);
    this.lastResponse = response; // Salvăm răspunsul
    return response;
  }

  // --- Metode HTTP simplificate ---
  async get(path, options = {}) {
    return this.request('get', path, options);
  }

  async post(path, data, options = {}) {
    return this.request('post', path, { ...options, data });
  }

  async put(path, data, options = {}) {
    return this.request('put', path, { ...options, data });
  }

  async delete(path, options = {}) {
    return this.request('delete', path, options);
  }

  getLastResponse() {
    if (!this.lastResponse) {
      throw new Error('Nu a fost stocat niciun răspuns.');
    }
    return this.lastResponse;
  }
}