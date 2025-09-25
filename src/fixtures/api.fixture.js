// src/fixtures/api.fixture.js
import { request as pwRequest } from '@playwright/test';
import { ApiClient } from '../api/clients/ApiClient.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  apiRequest: async ({}, use) => {
    const raw = process.env.API_BASE_URL ?? 'https://reqres.in';
    let baseURL;
    try {
      baseURL = new URL(raw).toString().replace(/\/$/, ''); // păstrează path-ul, doar taie slash final
    } catch {
      throw new Error(`Invalid API_BASE_URL: ${raw}`);
    }


    const apiKeyHeader = process.env.API_KEY_HEADER ?? 'x-api-key';
    const token = process.env.API_TOKEN || ''; // în CI îl injectezi din Jenkins

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers[apiKeyHeader] = token; // atașează doar dacă există token

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
