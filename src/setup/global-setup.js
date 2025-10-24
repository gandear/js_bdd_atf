// ./src/setup/global-setup.js

import { getRunStamp } from '../utils/run-stamp.js';
import * as ConfigValidator from '../config/configValidator.js';
import createLogger from '../utils/logger.js';
import { join } from 'path';
import { writeFileSync } from 'fs';

export default async function globalSetup() {
    const logger = createLogger();

    try {
        // Dacă ConfigValidator arunca înainte, prindem eroarea și decidem comportamentul
        ConfigValidator.validate();
        logger.info('Configuration validated successfully');
    } catch (err) {
        // Dacă dezvoltatorul vrea comportament strict, poate seta STRICT_CONFIG=true
        const strict = String(process.env.STRICT_CONFIG).toLowerCase() === 'true';
        logger.warn(`Configuration validation failed: ${err.message}`);
        logger.warn('Proceeding with current environment variables. Set STRICT_CONFIG=true to fail fast.');

        if (strict) {
            // re-aruncăm doar dacă se dorește validare strictă explicit
            throw err;
        }
    }

    const { RUN_DATE, RUN_TIME } = getRunStamp();
    
    process.env.RUN_DATE = RUN_DATE;
    process.env.RUN_TIME = RUN_TIME;

    try {
        const metaPath = join(process.cwd(), 'logs', '.current-run.json');
        const metaData = { RUN_DATE, RUN_TIME };
        writeFileSync(metaPath, JSON.stringify(metaData, null, 2));
    } catch (e) {
        console.warn('[Global Setup] Failed to write run metadata:', e.message);
    }
}