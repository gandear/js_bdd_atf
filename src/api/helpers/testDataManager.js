// src/api/helpers/testDataManager.js
import createLogger from '../../utils/logger.js';

export class TestDataManager {
  constructor(apiClient, opts = {}) {
    this.api = apiClient;
    this.createdUserIds = new Set();
    this.deleteRetries = opts.deleteRetries ?? 3;
    this.deleteBackoffMs = opts.deleteBackoffMs ?? 300;
    this.logger = opts.logger ?? createLogger({ level: process.env.LOG_LEVEL || 'info' });
  }

  /**
   * Create test user and track ID for cleanup
   * @returns {string|null} User ID or null if creation failed
   */
  async createTestUser(payload = {}) {
    const res = await this.api.post('/api/users', payload, { 
      auth: false,
    });
    
    const json = await res.json();
    const id = json?.id ?? json?.data?.id ?? null;
    
    if (id) {
      this.recordCreatedUser(id);
      this.logger.info({ id, payload }, 'Test user created');
    } else {
      const status = res.status();
      this.logger.warn({ payload, status }, 'User creation missing ID');
    }
    
    return id;
  }

  /**
   * Record user ID for cleanup
   */
  recordCreatedUser(id) {
    if (!id) return;
    this.createdUserIds.add(String(id));
  }

  /**
   * Cleanup all tracked users with retry logic
   */
  async cleanupCreatedUsers() {
    const ids = Array.from(this.createdUserIds);
    if (ids.length === 0) {
      this.logger.debug('No test users to cleanup');
      return;
    }

    for (const id of ids) {
      await this._deleteUserWithRetry(id);
    }
  }

  /**
   * Delete single user with exponential backoff
   */
  async _deleteUserWithRetry(id) {
    let attempt = 0;
    
    while (attempt < this.deleteRetries) {
      attempt += 1;
      
      try {
        const res = await this.api.delete(`/api/users/${id}`, { 
          auth: false 
        });
        
        const status = res.status();
        
        // Success cases
        if (status === 204 || status === 200 || status === 404) {
          this.logger.info({ id, status }, 'User deleted or not found');
          this.createdUserIds.delete(id);
          return;
        }

        // Retry cases: rate limit or server error
        if (status === 429 || status >= 500) {
          const wait = this._getBackoffTime(res, attempt);
          this.logger.warn({ id, status, attempt, wait }, 'Retrying delete');
          await new Promise(r => setTimeout(r, wait));
          continue;
        }

        // Unexpected status - stop retrying
        this.logger.error({ id, status }, 'Unexpected delete status');
        break;
        
      } catch (e) {
        // Transport error - retry with backoff
        this.logger.warn({ id, err: e?.message, attempt }, 'Delete error, retrying');
        await new Promise(r => setTimeout(r, this.deleteBackoffMs * attempt));
      }
    }
  }

  /**
   * Calculate backoff time with Retry-After header support
   */
  _getBackoffTime(response, attempt) {
    try {
      const headers = response.headers();
      const retryAfter = headers['retry-after'] || headers['Retry-After'];
      
      if (retryAfter) {
        const seconds = parseInt(String(retryAfter), 10);
        if (!isNaN(seconds)) return seconds * 1000;
      }
    } catch {
      // Ignore header parsing errors
    }
    
    return this.deleteBackoffMs * attempt;
  }

  /**
   * Get metrics for test attachments
   */
  getTestMetrics() {
    return {
      createdUsers: Array.from(this.createdUserIds),
      pending: this.createdUserIds.size
    };
  }
}

export default TestDataManager;