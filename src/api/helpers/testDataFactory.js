// src/api/helpers/testDataFactory.js
import { randomUUID } from 'node:crypto';
import { v4 as uuidv4 } from 'uuid';

export class TestDataFactory {
  static uid(prefix = 'qa') { return `${prefix}-${randomUUID()}`; }

  static generateRandomUser() {
    const tag = this.uid('user').slice(-8);
    return {
      name: `User ${tag}`,
      job: 'Tester',
      email: `${this.uid('mail')}@example.com`
    };
  }

  // Pentru reqres, un set "valid" stabil e mai previzibil:
  static getValidCredentials() {
    return [{ email: 'eve.holt@reqres.in', password: 'cityslicka' }];
  }

  static generateRandomCredentials() {
    return { email: `${this.uid('acc')}@example.com`, password: this.generateRandomPassword() };
  }

  static generateRandomPassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pwd = '';
    for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    return pwd;
  }

  static getUserIds() {
    return { existing: ['1','2','3','4','5','6'], nonExisting: ['999','1000','0','-1'] };
  }
}

/**
 * Test data factory helpers for user payloads.
 * - Single source of truth for test user payloads.
 * - Export createUserPayload(payloadOverrides) to allow tests to customize values.
 */

export function createUserPayload(overrides = {}) {
  const unique = uuidv4().split('-')[0];
  const base = {
    name: `test-user-${unique}`,
    job: `tester-${unique}`
  };

  return { ...base, ...(overrides || {}) };
}

// Legacy helper kept for compatibility (returns array of ids if needed)
export function getUserIds(count = 3) {
  return Array.from({ length: Math.max(0, Number(count) || 0) }, (_, i) => i + 1);
}
