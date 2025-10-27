// src/config/configValidator.js
import createLogger from '../utils/logger.js';

export class ConfigValidator {
  static ALLOWED_CONFIG = {
    BASE_URL: [
      'https://opensource-demo.orangehrmlive.com',
      'https://staging.orangehrmlive.com'
    ],
    API_BASE_URL: [
      'https://reqres.in',
      'https://jsonplaceholder.typicode.com'
    ]
  };

  // ✅ API_TOKEN este opțional (reqres.in nu necesită auth pentru /register, /login)
  static REQUIRED = ['BASE_URL', 'API_BASE_URL', 'API_KEY_HEADER'];
  static OPTIONAL = ['API_TOKEN']; // ✅ Moved from REQUIRED

  static validate() {
    const allKeys = [...this.REQUIRED, ...this.OPTIONAL];
    const config = Object.fromEntries(allKeys.map(k => [k, process.env[k]]));
    
    // ✅ Verifică doar câmpurile REQUIRED
    const missing = this.REQUIRED.filter(k => !config[k]?.trim());
    if (missing.length) {
      throw new Error(`Missing required config: ${missing.join(', ')}`);
    }

    // ✅ Validează URL-uri din whitelist
    Object.entries(this.ALLOWED_CONFIG).forEach(([field, allowedUrls]) => {
      const value = config[field];
      if (value && !allowedUrls.includes(value)) {
        throw new Error(`Invalid ${field}: "${value}". Allowed: ${allowedUrls.join(', ')}`);
      }
    });

    // ✅ Log warning dacă API_TOKEN lipsește (dar nu eșuează)
    const logger = createLogger();
    if (!config.API_TOKEN?.trim()) {
      logger.warn('⚠️  API_TOKEN not set - auth will be skipped for all requests');
    }

    logger.info('✅ Configuration validated successfully');
    return true;
  }
}