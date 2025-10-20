// src/fixtures/api.fixture.js
import { ApiClient } from '../api/clients/ApiClient.js';
import { testStateFixtures } from './testState.fixture.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  ...testStateFixtures, // Include testState fixture

  apiClient: async ({ request }, use, testInfo) => {
    const baseURL = testInfo?.project?.use?.baseURL ?? process.env.API_BASE_URL ?? '';
    await use(new ApiClient(request, { baseURL }));
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
