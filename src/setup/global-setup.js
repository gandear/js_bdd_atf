// ./src/setup/global-setup.js
import { getRunStamp } from '../utils/run-stamp.js';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function globalSetup() {
  const { RUN_DATE, RUN_TIME } = getRunStamp();
  
  process.env.RUN_DATE = RUN_DATE;
  process.env.RUN_TIME = RUN_TIME;

  //console.log(`[Global Setup] Set RUN_DATE=${RUN_DATE}, RUN_TIME=${RUN_TIME}`);

  try {
    const metaPath = join(process.cwd(), 'logs', '.current-run.json');
    const metaData = { RUN_DATE, RUN_TIME };
    writeFileSync(metaPath, JSON.stringify(metaData, null, 2));
  } catch (e) {
    console.warn('[Global Setup] Failed to write run metadata:', e.message);
  }
}

export default globalSetup;