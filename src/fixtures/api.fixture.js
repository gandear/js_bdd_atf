// src/fixtures/api.fixture.js
import { ApiClient } from '../api/clients/ApiClient.js';
import { testStateFixtures } from './testState.fixture.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  ...testStateFixtures, // Include testState fixture

  // Uses the Playwright APIRequestContext already configured in playwright.config.js
  apiRequest: async ({ request }, use) => {
    await use(request);
  },

  apiClient: async ({ apiRequest }, use) => {
    await use(new ApiClient(apiRequest));
  },

  // apiState: async ({ }, use) => {
  //   await use({ res: null, json: null, error: null });
  // },

  apiState: async ({ testState }, use) => {
      await use(testState);
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
