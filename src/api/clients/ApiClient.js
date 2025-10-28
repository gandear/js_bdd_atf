// src/api/clients/ApiClient.js (Constructor și Metode Modificate)

export class ApiClient {
 
  constructor(requestContext, headersManager, options) {
    this.requestContext = requestContext;
    this.headersManager = headersManager; // NOU: Stochează managerul de headere
    this.options = options;
    this.lastResponse = null;
    this.baseURL = options.baseURL;
    this.logger = options.logger;
  }

  // Metodă generică pentru a efectua o cerere.
  async request(method, path, options = {}) {
    const { data = undefined, auth = false, params = undefined } = options;

    // Obținem headerele (Aici se adaugă token-ul dacă auth: true)
    const headers = this.headersManager.getHeaders(auth);

    const response = await this.requestContext[method](path, {
      data,
      params,
      headers: {
        ...this.options.defaultHeaders, // Adăugăm headerele default (ex: Content-Type)
        ...headers, // Suprascriem/adăugăm headerele cu token
      },
    });
    this.lastResponse = response;
    return response;
  }

  // --- Metode de wrapper ---
  async get(path, options = {}) {
    return this.request('get', path, options);
  }

  async post(path, data, options = {}) {
    return this.request('post', path, { ...options, data });
  }

 delete(endpoint, options = {}) {
    return this.request('delete', endpoint, options); 
  }

  // Trebuie să adaugi această metodă, necesară pentru a obține răspunsul în steps
  getLastResponse() {
    if (!this.lastResponse) {
      throw new Error('Nu a fost stocat niciun răspuns.');
    }
    return this.lastResponse;
  }

}     