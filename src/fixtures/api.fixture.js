// src/fixtures/api.fixture.js
import { HeadersManager } from '../api/helpers/headersManager.js';
import { ApiClient } from '../api/clients/ApiClient.js';
import { testStateFixtures } from './testState.fixture.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  ...testStateFixtures, // Include testState fixture

  apiClient: async ({ request }, use, testInfo) => {
    const baseURL = testInfo?.project?.use?.baseURL ?? process.env.API_BASE_URL ?? '';

    // derive auth settings from env (mirrors logic in playwright.config.js)
    const scheme = (process.env.API_AUTH_SCHEME || 'api-key').toLowerCase();
    const apiKeyHeader = process.env.API_KEY_HEADER || 'x-api-key';
    const token = (process.env.API_TOKEN || '').trim();

    // Build default headers using centralized HeadersManager
    const defaultHeaders = HeadersManager.merge(
      { 'Content-Type': 'application/json' },
      undefined,
      { authToken: token, authScheme: scheme, apiKeyHeader }
    );

    const apiClient = new ApiClient(request, { baseURL: baseURL, defaultHeaders });

    // Dacă există token în env, îl aplicăm automat clientului API (redundant but safe)
    if (token) {
      apiClient.setAuthToken(token);
    }

    await use(apiClient);
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
