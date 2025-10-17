// src/utils/run-stamp.js
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export function getRunStamp() {
  // 1) ENV override (opțional)
  const envDate = process.env.RUN_DATE;
  const envTime = process.env.RUN_TIME;
  if (envDate && envTime) return { RUN_DATE: envDate, RUN_TIME: envTime };

  // 2) Meta scrisă în global-setup (dacă există)
  try {
    const metaPath = join(process.cwd(), 'logs', '.current-run.json');
    if (existsSync(metaPath)) {
      const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
      if (meta?.RUN_DATE && meta?.RUN_TIME) {
        return { RUN_DATE: meta.RUN_DATE, RUN_TIME: meta.RUN_TIME };
      }
    }
  } catch {
    // ignore
  }

  // 3) Fallback: acum
  const now = new Date();
  const RUN_DATE = now.toISOString().slice(0, 10);
  const RUN_TIME = now.toTimeString().slice(0, 8).replace(/:/g, '-');
  return { RUN_DATE, RUN_TIME };
}

export default getRunStamp;
