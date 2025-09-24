// src/setup/global-setup.js
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export default async () => {
  const now = new Date();
  const RUN_DATE = now.toISOString().slice(0, 10);                 
  const RUN_TIME = now.toTimeString().slice(0, 8).replace(/:/g, '-'); 

  const root = join(process.cwd(), 'logs', RUN_DATE, RUN_TIME);
  mkdirSync(root, { recursive: true });

  // meta file that will be read by all workers
  const metaPath = join(process.cwd(), 'logs', '.current-run.json');
  writeFileSync(metaPath, JSON.stringify({ RUN_DATE, RUN_TIME }), 'utf8');

};
