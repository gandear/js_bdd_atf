// ./src/setup/global-setup.js

import { getRunStamp } from '../utils/run-stamp.js';
import { ConfigValidator } from '../config/configValidator.js';
import createLogger from '../utils/logger.js';
import { join } from 'path';
import { writeFileSync } from 'fs';

export default async function globalSetup() {
    const logger = createLogger();

    ConfigValidator.validate();
    logger.info('Configuration validated successfully');

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