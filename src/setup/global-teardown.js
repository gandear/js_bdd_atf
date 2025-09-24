// src/setup/global-teardown.js
import fs from 'fs';
import { join } from 'path';
import { archiveRun } from '../utils/archive-run.js';

export default async () => {
  const metaPath = join(process.cwd(), 'logs', '.current-run.json');

  // try to archive and to remove the meta file in any case
  try {
    const zipPath = await archiveRun();            
    console.log(`[globalTeardown] archived run → ${zipPath}`);
  } catch (e) {
    console.warn('[globalTeardown] zip failed:', e.message);
  } finally {
    // curățăm meta-ul indiferent de rezultat
    try { fs.rmSync(metaPath, { force: true }); } catch {}
  }
};
