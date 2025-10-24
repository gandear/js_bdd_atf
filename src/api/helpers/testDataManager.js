// src/api/helpers/testDataManager.js
/**
 * TestDataManager
 * - Tracks created resources and ensures idempotent cleanup.
 * - Exposes createTestUser(payload?) and recordCreatedUser(id).
 */

import pino from 'pino';
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export class TestDataManager {
  constructor(apiClient, opts = {}) {
    this.api = apiClient;
    this.createdUserIds = new Set();
    this.deleteRetries = opts.deleteRetries ?? 3;
    this.deleteBackoffMs = opts.deleteBackoffMs ?? 300;
  }

  // Create a test user via API and track its id
  async createTestUser(payload = {}) {
    const { res, json } = await this.api.createUser(payload);
    const id = json?.id ?? json?.data?.id ?? null;
    if (id) {
      this.recordCreatedUser(id);
      logger.info({ id }, 'Test user created and recorded');
    } else {
      logger.warn({ payload, resStatus: res?.status?.() }, 'Create user did not return id');
    }
    return { res, json, id };
  }

  // Record created id for later cleanup
  recordCreatedUser(id) {
    if (!id) return;
    this.createdUserIds.add(String(id));
  }

  // Attempt to cleanup created users; idempotent: ignore 404, retry on 429/5xx
  async cleanupCreatedUsers() {
    const ids = Array.from(this.createdUserIds);
    if (ids.length === 0) {
      logger.debug('No test users to cleanup');
      return;
    }

    for (const id of ids) {
      let attempt = 0;
      while (attempt < this.deleteRetries) {
        attempt += 1;
        try {
          const { res } = await this.api.deleteUser(id, { throwOnHttpError: false });
          const status = res.status();
          if (status === 204 || status === 200 || status === 404) {
            // success or already-deleted
            logger.info({ id, status }, 'Cleanup: user removed or not found');
            this.createdUserIds.delete(id);
            break;
          }

          // rate limit or server error -> backoff and retry
          if (status === 429 || status >= 500) {
            const retryAfter = (() => {
              try {
                const headers = res.headers ? res.headers() : {};
                const ra = headers['retry-after'] || headers['Retry-After'];
                const val = parseInt(String(ra), 10);
                return Number.isNaN(val) ? null : val * 1000;
              } catch { return null; }
            })();
            const wait = retryAfter ?? this.deleteBackoffMs * attempt;
            logger.warn({ id, status, attempt, wait }, 'Cleanup: retrying delete due to server/rate-limit');
            await new Promise(r => setTimeout(r, wait));
            continue;
          }

          // Unexpected status -> log and stop retrying for this id
          logger.error({ id, status }, 'Cleanup: unexpected delete status, skipping further attempts');
          break;
        } catch (e) {
          // transport error -> retry with backoff
          logger.warn({ id, err: e?.message, attempt }, 'Cleanup: transient error, retrying');
          await new Promise(r => setTimeout(r, this.deleteBackoffMs * attempt));
        }
      }
    }
  }

  // Helper to expose metrics for attachments
  getTestMetrics() {
    return {
      createdUsers: Array.from(this.createdUserIds),
      pending: this.createdUserIds.size
    };
  }
}

export default TestDataManager;
