// src/utils/logger.js
import pino from 'pino';
import { join } from 'path';
import { mkdirSync } from 'fs';

export default function createLogger(opts = {}) {
  const level = process.env.LOG_LEVEL || opts.level || 'info';

  const RUN_DATE = process.env.RUN_DATE ?? new Date().toISOString().split('T')[0];
  const RUN_TIME = process.env.RUN_TIME ?? new Date().toISOString().replace(/[:.]/g, '-');

  const logsDir = opts.logsDir ?? join(process.cwd(), 'logs');
  try {
    mkdirSync(logsDir, { recursive: true });
  } catch (e) {
    // ignore
  }

  const filename = join(logsDir, `${RUN_DATE}_${RUN_TIME}.log`);
  const dest = pino.destination({ dest: filename, sync: false });
  const baseLogger = pino({ level }, dest);

  // Wrapper that exposes convenience methods used by fixtures/steps
  const wrapper = {
    raw: baseLogger,
    info: (msg, meta) => baseLogger.info(meta ?? {}, String(msg)),
    warn: (msg, meta) => baseLogger.warn(meta ?? {}, String(msg)),
    error: (msg, meta) => baseLogger.error(meta ?? {}, String(msg)),
    debug: (msg, meta) => baseLogger.debug(meta ?? {}, String(msg)),
    action: (msg, meta) => baseLogger.info(meta ?? {}, `ACTION: ${msg}`),
    step: (msg, meta) => baseLogger.info(meta ?? {}, `STEP: ${msg}`),
    scenario: (msg, meta) => baseLogger.info(meta ?? {}, `SCENARIO: ${msg}`),

    // Ensure tests can await logger.flush(); try multiple available flush APIs, noop if none.
    flush: async () => {
      try {
        if (typeof baseLogger.flush === 'function') {
          // pino v7 may expose flush on logger
          baseLogger.flush();
          return;
        }
        if (dest && typeof dest.flushSync === 'function') {
          dest.flushSync();
          return;
        }
        if (dest && typeof dest.flush === 'function') {
          await new Promise((resolve, reject) => {
            try {
              dest.flush((err) => (err ? reject(err) : resolve()));
            } catch (e) {
              // Some streams' flush may throw; ignore
              resolve();
            }
          });
          return;
        }
      } catch (e) {
        // swallow errors to avoid failing tests because of logging flush
      }
    }
  };

  return wrapper;
}