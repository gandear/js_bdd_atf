// src/fixtures/api.fixture.js
import { ApiClient } from '../api/clients/ApiClient.js';
import { testStateFixtures } from './testState.fixture.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  ...testStateFixtures,

  apiClient: async ({ request, logger }, use, testInfo) => {
    const baseURL = testInfo?.project?.use?.baseURL ?? process.env.API_BASE_URL ?? '';

    const apiClient = new ApiClient(request, { 
      baseURL,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      logger
    });

    await use(apiClient);
  },

  testDataManager: async ({ apiClient, logger }, use, testInfo) => {
    const manager = new TestDataManager(apiClient, { logger });
    await use(manager);
    await manager.cleanupCreatedUsers();
    await testInfo.attach('test-data-metrics.json', {
      body: JSON.stringify(manager.getTestMetrics(), null, 2),
      contentType: 'application/json'
    });
  }
};