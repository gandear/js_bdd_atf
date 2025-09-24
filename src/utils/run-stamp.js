// src/utils/run-stamp.js
import { readFileSync } from 'fs';
import { join } from 'path';

let cached;

export function getRunStamp() {
  if (cached) return cached;

  let RUN_DATE, RUN_TIME;

  try {
    const meta = JSON.parse(readFileSync(join(process.cwd(), 'logs', '.current-run.json'), 'utf8'));
    RUN_DATE = meta.RUN_DATE;
    RUN_TIME = meta.RUN_TIME;
  } catch {}

  if (!RUN_DATE || !RUN_TIME) {
    const now = new Date();
    RUN_DATE = now.toISOString().slice(0, 10);
    RUN_TIME = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  }

  return (cached = { RUN_DATE, RUN_TIME });
}

