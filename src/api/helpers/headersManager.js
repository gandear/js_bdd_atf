// src/api/helpers/headersManager.js

export class HeadersManager {
  static merge(base = {}, custom = {}, options = {}) {
    const { authToken, authScheme = 'bearer', apiKeyHeader = 'x-api-key' } = options;
    
    const headers = {
      'Accept': 'application/json',
      ...base,
      ...custom
    };
    
    // Add auth if token exists and not already set
    if (authToken && !headers.Authorization && !headers[apiKeyHeader]) {
      if (authScheme === 'bearer') {
        headers.Authorization = `Bearer ${authToken}`;
      } else {
        headers[apiKeyHeader] = authToken;
      }
    }
    
    return headers;
  }
  
  static createAuthHeader(token, scheme = 'bearer', keyHeader = 'x-api-key') {
    return scheme === 'bearer' 
      ? { Authorization: `Bearer ${token}` }
      : { [keyHeader]: token };
  }
}