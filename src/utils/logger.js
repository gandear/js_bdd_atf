// src/utils/logger.js
import pino from 'pino';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { config } from 'dotenv';
import { sanitizeSegment } from './sanitize.js';
import { getRunStamp } from './run-stamp.js';

// Load .env
config();

const ensureDir = (d) => { if (!existsSync(d)) mkdirSync(d, { recursive: true }); };

export function createLogger(ctx = {}) {
  const { RUN_DATE, RUN_TIME } = getRunStamp();

  const project  = sanitizeSegment(ctx.project || 'project');
  const testName = sanitizeSegment(ctx.testName || 'test');

  const destDir = join(process.cwd(), 'logs', RUN_DATE, RUN_TIME, project);
  ensureDir(destDir);

  const filePath = join(destDir, `${testName}.log`);

  const destination = pino.destination({ dest: filePath, sync: false });
  const logger = pino({
    level: process.env.LOG_LEVEL || 'info', 
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: { level: (label) => ({ level: label.toUpperCase() }) },
    base: ctx,
  }, destination);

  // Enhanced logger with custom methods
  const enhancedLogger = {
    debug: (msg, extra = {}) => logger.debug({ ...extra }, msg),
    info:  (msg, extra = {}) => logger.info({ ...extra }, msg),
    warn:  (msg, extra = {}) => logger.warn({ ...extra }, msg),
    error: (msg, extra = {}) => logger.error({ ...extra }, msg),
    
    // Custom methods for BDD-style logging
    step:     (stepName, extra = {}) => logger.info({ step: true, ...extra }, `STEP: ${stepName}`),
    scenario: (scenarioName, extra = {}) => logger.info({ scenario: true, ...extra }, `SCENARIO: ${scenarioName}`),
    action:   (msg, extra = {}) => logger.info({ action: true, ...extra }, msg),
    
    filePath,
    flush: () => new Promise((resolve) => (destination.flush ? destination.flush(resolve) : resolve()))
  };

  return enhancedLogger;
}