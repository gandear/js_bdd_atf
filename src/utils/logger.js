// src/utils/logger.js
import pino from 'pino';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import sanitizeSegment from './sanitize.js';
import getRunStamp from './run-stamp.js';

// Simplificat la o funcție săgeată
const ensureDir = (d) => {
  if (!existsSync(d)) mkdirSync(d, { recursive: true });
};

export default function createLogger(ctx = {}) {
  const { RUN_DATE, RUN_TIME } = getRunStamp();

  const project = sanitizeSegment(ctx.project || 'project');
  const browser = ctx.browser ? sanitizeSegment(ctx.browser) : 'api';
  const testName = sanitizeSegment(ctx.testName || 'test');

  // Construim path-ul robust și fără duplicate consecutive
  const segments = ['logs', RUN_DATE, RUN_TIME, browser, project].filter(Boolean);
  
  // Am păstrat deduplicarea pentru a menține robustețea căii.
  const deduped = segments.filter((seg, i, arr) => i === 0 || seg !== arr[i - 1]);
  const destDir = join(process.cwd(), ...deduped);
  ensureDir(destDir);

  const filePath = join(destDir, `${testName}.log`);
  const level = String(ctx.level || process.env.LOG_LEVEL || 'info').toLowerCase();

  const destination = pino.destination({ dest: filePath, sync: false });
  const logger = pino(
    {
      level,
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: { paths: ['token', 'authorization', 'Authorization', 'req.headers.authorization'], censor: '***' },
      formatters: { level: (label) => ({ level: label.toUpperCase() }) },
      base: {
        project,
        browser,
        testName,
        test_file: ctx.test_file || null,
      },
    },
    destination
  );

  const enhancedLogger = {
    // Metode standard cu suport pentru obiectul 'extra'
    debug: (msg, extra) => logger.debug({ ...(extra || {}) }, msg),
    info:  (msg, extra) => logger.info({ ...(extra || {}) }, msg),
    warn:  (msg, extra) => logger.warn({ ...(extra || {}) }, msg),
    error: (msg, extra) => logger.error({ ...(extra || {}) }, msg),

    // BDD sugar
    step(stepName, extra = {})    { return logger.info({ step: true, ...extra }, `STEP: ${stepName}`); },
    scenario(scnMsg, extra = {})  { return logger.info({ scenario: true, ...extra }, `SCENARIO: ${scnMsg}`); },
    action(actionMsg, extra = {})  { return logger.info({ action: true, ...extra }, actionMsg); },

    filePath,
    flush: () =>
      new Promise((resolve) =>
        destination.flush ? destination.flush(resolve) : resolve()
      ),
  };

  return enhancedLogger;
}