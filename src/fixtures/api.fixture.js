// src/fixtures/api.fixture.js
import { request as pwRequest } from '@playwright/test';
import { ApiClient } from '../api/clients/ApiClient.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  apiRequest: async ({}, use) => {
    // 1) Base URL curat (fără trailing slash)
    const raw = process.env.API_BASE_URL || 'https://reqres.in';
    let baseURL;
    try {
      baseURL = new URL(raw).toString().replace(/\/$/, '');
    } catch {
      throw new Error(`Invalid API_BASE_URL: ${raw}`);
    }

    // 2) Header-ele minime
    const headers = { 'Content-Type': 'application/json' };

    // 3) Politica de auth:
    // - implicit: dacă există token -> ATAȘEAZĂ (utile în CI/proxy)
    // - se poate forța dezactivarea cu API_DISABLE_AUTH=true
    // - sau forța activarea cu API_REQUIRE_AUTH=true (pentru claritate)
    const disableAuth = String(process.env.API_DISABLE_AUTH || 'false').toLowerCase() === 'true';
    const requireAuth = String(process.env.API_REQUIRE_AUTH || 'false').toLowerCase() === 'true';

    const token = (process.env.API_TOKEN || '').trim();
    const apiKeyHeader = process.env.API_KEY_HEADER || 'x-api-key';
    const scheme = (process.env.API_AUTH_SCHEME || 'api-key').toLowerCase(); // 'api-key' | 'bearer'

    const shouldAttach =
      !disableAuth && (requireAuth || token.length > 0);

    if (shouldAttach) {
      if (scheme === 'bearer') headers['Authorization'] = `Bearer ${token}`;
      else headers[apiKeyHeader] = token;
    }

    const ctx = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: headers,
      ignoreHTTPSErrors: true,
      timeout: 15_000,
    });

    await use(ctx);
    await ctx.dispose();
  },

  apiClient: async ({ apiRequest }, use) => {
    await use(new ApiClient(apiRequest));
  },

  apiState: async ({}, use) => {
    await use({ res: null, json: null, error: null });
  },

  testDataManager: async ({ apiClient }, use, testInfo) => {
    const manager = new TestDataManager(apiClient);
    await use(manager);
    await manager.cleanupCreatedUsers();
    await testInfo.attach('test-data-metrics.json', {
      body: JSON.stringify(manager.getTestMetrics(), null, 2),
      contentType: 'application/json'
    });
  }
};
