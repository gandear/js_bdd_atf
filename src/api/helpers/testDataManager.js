// src/api/helpers/testDataManager.js
import createLogger from '../../utils/logger.js';

export class TestDataManager {
  constructor(apiClient, opts = {}) {
    this.api = apiClient;
    this.createdUserIds = new Set();
    this.deleteRetries = opts.deleteRetries ?? 3;
    this.deleteBackoffMs = opts.deleteBackoffMs ?? 300;
    // Accept injected logger for per-test logging; fall back to a new file-based logger
    this.logger = opts.logger ?? createLogger({ level: process.env.LOG_LEVEL || 'info' });
  }

 // Create a test user via API and track its id
async createTestUser(payload = {}) {
    // MODIFICARE: Folosește this.api.post('/api/users', ...) 
    const res = await this.api.post('/api/users', payload, { 
        auth: false, // User creation on ReqRes doesn't require auth
        throwOnHttpError: true 
    });
    
    // Obține corpul JSON
    const json = await res.json(); 

    const id = json?.id ?? json?.data?.id ?? null; // Logica de extragere a ID-ului
    
    // ... (restul logicii de înregistrare și logging rămâne neschimbată)
    if (id) {
      this.recordCreatedUser(id);
      this.logger.info({ id }, 'Test user created and recorded');
    } else {
      const status = res ? (typeof res.status === 'function' ? res.status() : res.status) : undefined;
      this.logger.warn({ payload, resStatus: status }, 'Create user did not return id');
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
      this.logger.debug('No test users to cleanup');
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
            this.logger.info({ id, status }, 'Cleanup: user removed or not found');
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
            this.logger.warn({ id, status, attempt, wait }, 'Cleanup: retrying delete due to server/rate-limit');
            await new Promise(r => setTimeout(r, wait));
            continue;
          }

          // Unexpected status -> log and stop retrying for this id
          this.logger.error({ id, status }, 'Cleanup: unexpected delete status, skipping further attempts');
          break;
        } catch (e) {
          // transport error -> retry with backoff
          this.logger.warn({ id, err: e?.message, attempt }, 'Cleanup: transient error, retrying');
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
