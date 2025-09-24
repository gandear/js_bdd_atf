// src/utils/archive-run.js
import fs from 'fs';
import { join } from 'path';
import archiver from 'archiver';
import { getRunStamp } from './run-stamp.js';

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

export async function archiveRun(options = {}) {
  // const stamp = (options.RUN_DATE && options.RUN_TIME)
  //   ? { RUN_DATE: options.RUN_DATE, RUN_TIME: options.RUN_TIME }
  //   : getRunStamp();
  const stamp = getRunStamp();

  const logsRoot    = options.logsRoot    || join(process.cwd(), 'logs');
  const runDir      = options.runDir      || join(logsRoot, stamp.RUN_DATE, stamp.RUN_TIME);
  const archivesDir = options.archivesDir || join(logsRoot, 'archives', stamp.RUN_DATE);
  const zipName     = options.zipName     || `${stamp.RUN_DATE}_${stamp.RUN_TIME}.zip`;
  const zipPath     = join(archivesDir, zipName);

  ensureDir(archivesDir);

  await new Promise((resolve, reject) => {
    const out = fs.createWriteStream(zipPath);
    const zip = archiver('zip', { zlib: { level: 9 } });

    out.on('close', resolve);
    out.on('error', reject);
    zip.on('warning', (err) => (err.code === 'ENOENT' ? console.warn(err) : reject(err)));
    zip.on('error', reject);

    zip.pipe(out);
    zip.directory(runDir, false);
    zip.finalize();
  });

  if (options.removeSource) {
    try { fs.rmSync(runDir, { recursive: true, force: true }); } catch (e) { console.warn('[archiveRun] cleanup failed:', e.message); }
  }

  return zipPath;
}
