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

  static REQUIRED = ['BASE_URL', 'API_BASE_URL', 'API_KEY_HEADER', 'API_TOKEN'];

  static validate() {
    const config = Object.fromEntries(this.REQUIRED.map(k => [k, process.env[k]]));
    
    // Verifică lipsă
    const missing = Object.entries(config).filter(([_, v]) => !v?.trim()).map(([k]) => k);
    if (missing.length) throw new Error(`Missing required config: ${missing.join(', ')}`);

    // Validează URL-uri din whitelist
    Object.entries(this.ALLOWED_CONFIG).forEach(([field, allowedUrls]) => {
      const value = config[field];
      if (!allowedUrls.includes(value)) {
        throw new Error(`Invalid ${field}: "${value}". Allowed: ${allowedUrls.join(', ')}`);
      }
    });

    // Use project logger for consistent output
    const logger = createLogger();
    logger.info('✅ Configuration validated successfully');
    return true;
  }
}