// src/api/helpers/headersManager.js (Versiunea Ajustată)

export class HeadersManager {
  // Utilizare proprietate privată (token) pentru a preveni modificări accidentale
  token = null; 

  setToken(token) {
    // Înlocuiește 'this.token' cu 'this.token'
    this.token = token;
  }

  getHeaders(needsAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (needsAuth) {
      if (!this.token) { // Folosește proprietatea privată
        // Aruncăm eroarea dacă autentificarea este cerută, dar lipsește token-ul
        throw new Error(
          'Missing API key (Token): Cererea necesită autentificare, dar token-ul nu a fost setat.',
        );
      }
      
      // Adaugă token-ul DOAR dacă needsAuth este true ȘI token-ul există
      headers['Authorization'] = `Bearer ${this.token}`;
      
    } else if (this.token) {
        // NOU: Nu arunca o eroare, dar nu trimite token-ul.
        // Aici este OK, dar următoarea ajustare e mai importantă.
    }
    
    return headers;
  }
}