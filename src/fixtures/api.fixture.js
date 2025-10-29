// src/fixtures/api.fixture.js
import { ApiClient } from '../api/clients/ApiClient.js';
import { HeadersManager } from '../api/helpers/headersManager.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';
import { testStateFixtures } from './testState.fixture.js';

export const apiFixtures = {
  ...testStateFixtures,

  /**
   * Manages auth token state (persists across worker)
   */
  headersManager: [
    async ({}, use) => {
      const manager = new HeadersManager();
      await use(manager);
    },
    { scope: 'worker' }
  ],

  /**
   * HTTP client with auth support
   */
  apiClient: async ({ request, logger, headersManager }, use, testInfo) => {
    const baseURL = testInfo?.project?.use?.baseURL ?? process.env.API_BASE_URL ?? '';

    const apiClient = new ApiClient(request, headersManager, { 
      baseURL,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-api-key': 'reqres-free-v1'
      },
      logger
    });

    await use(apiClient);
  },

  /**
   * Test data lifecycle manager (cleanup on teardown)
   */
  testDataManager: async ({ apiClient, logger }, use, testInfo) => {
    const manager = new TestDataManager(apiClient, { logger });
    
    await use(manager);
    
    // Cleanup tracked resources
    await manager.cleanupCreatedUsers();
    
    // Attach metrics
    await testInfo.attach('test-data-metrics.json', {
      body: JSON.stringify(manager.getTestMetrics(), null, 2),
      contentType: 'application/json'
    });
  },

  /**
   * Unified API context for steps
   * Provides: client, headersManager, dataManager, helpers
   */
  api: async ({ apiClient, headersManager, testDataManager }, use) => {
    const apiContext = {
      client: apiClient,
      headersManager: headersManager,
      dataManager: testDataManager,
      
      // Quick accessors for steps
      getLastResponse: () => apiClient.getLastResponse(),
      getLastResponseBody: async () => {
        const response = apiClient.getLastResponse();
        return response ? response.json() : null;
      }
    };
    
    await use(apiContext);
  }
};