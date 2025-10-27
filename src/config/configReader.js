import { environments } from './environment.js';
import createLogger from '../utils/logger.js';

const logger = createLogger();

class ConfigReader {
  constructor() {
    this.env = process.env.TEST_ENV || 'dev';
    this.config = environments[this.env];
  }

  get(key) {
    if (!this.config[key]) {
      throw new Error(`Configuration key '${key}' is missing in environment '${this.env}'`);
    }
    return this.config[key];
  }

  validate() {
    const requiredKeys = ['API_BASE_URL', 'API_TOKEN', 'TIMEOUT', 'RETRY_COUNT', 'PARALLEL_WORKERS'];
    const missingKeys = requiredKeys.filter(key => !this.config[key]);

    if (missingKeys.length > 0) {
      throw new Error(`Missing required configuration keys: ${missingKeys.join(', ')}`);
    }

  logger.info('✅ Configuration validated successfully');
  }
}

const configReader = new ConfigReader();
configReader.validate();

export default configReader;