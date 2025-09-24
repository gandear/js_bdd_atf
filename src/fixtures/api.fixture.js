// src/fixtures/api.fixture.js
import { request as pwRequest } from '@playwright/test';
import { ApiClient } from '../api/clients/ApiClient.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  apiRequest: async ({}, use) => {
    const raw = process.env.API_BASE_URL ?? 'https://reqres.in';
    const baseURL = new URL(raw).origin;

    const apiKeyHeader = process.env.API_KEY_HEADER ?? 'x-api-key';
    const token = process.env.API_TOKEN;

    const ctx = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: {
        ...(token ? { [apiKeyHeader]: token } : {}) // doar dacă există token
      },
      ignoreHTTPSErrors: true, // ok pentru public HTTPS; poți scoate dacă vrei strict
      timeout: 15_000
    });

    await use(ctx);
    await ctx.dispose();
  },

  apiClient: async ({ apiRequest }, use) => {
    await use(new ApiClient(apiRequest)); // rutele din client: /api/...
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
