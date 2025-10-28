// src/api/helpers/headersManager.js

export class HeadersManager {
  token = null; // Stocăm token-ul privat

  constructor() {
    this.token = null;
  }

  setToken(token) {
    if (!token) {
      console.warn('Încercare de a seta un token null sau undefined.');
    }
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getHeaders(needsAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Puteți adăuga alte headere standard aici
    };

    if (needsAuth) {
      if (!this.token) {
        // Aceasta este eroarea pe care o primeați, acum este explicită
        throw new Error(
          'Missing API key: Cererea necesită autentificare, dar nu a fost setat niciun token.',
        );
      }
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }
}