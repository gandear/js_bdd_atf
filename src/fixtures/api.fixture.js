// src/fixtures/api.fixture.js (FINAL)

import { ApiClient } from '../api/clients/ApiClient.js';
import { HeadersManager } from '../api/helpers/headersManager.js'; // NOU
import { testStateFixtures } from './testState.fixture.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  ...testStateFixtures,

  // NOU: Fixtură pentru managementul stării (token-ului)
  headersManager: [
    async ({}, use) => {
      const manager = new HeadersManager();
      await use(manager);
    },
    { scope: 'worker' } // Token-ul persistă pe durata worker-ului
  ],

  // MODIFICAT: Acum depinde de headersManager și îl pasează către ApiClient
  apiClient: async ({ request, logger, headersManager }, use, testInfo) => {
    const baseURL = testInfo?.project?.use?.baseURL ?? process.env.API_BASE_URL ?? '';

    // ATENȚIE: headersManager este pasat în constructor
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

  // RESTAURAT: testDataManager (fără modificări)
  testDataManager: async ({ apiClient, logger }, use, testInfo) => {
    const manager = new TestDataManager(apiClient, { logger });
    await use(manager);
    await manager.cleanupCreatedUsers();
    await testInfo.attach('test-data-metrics.json', {
      body: JSON.stringify(manager.getTestMetrics(), null, 2),
      contentType: 'application/json'
    });
  },

  // NOU: Fixtură de context simplificată pentru steps ({ api })
  api: async ({ apiClient, headersManager, testDataManager }, use) => {
     const apiContext = {
        client: apiClient, // Clientul API modificat
        headersManager: headersManager, // Managerul de token (pentru setToken)
        dataManager: testDataManager, // Managerul de date de test (pentru CRUD de setup)
        
        // Helpers pentru acces rapid în steps
        getLastResponse: () => apiClient.getLastResponse(),
        getLastResponseBody: async () => {
          const response = apiClient.getLastResponse();
          return response ? response.json() : null;
        }
     };
     await use(apiContext);
  }
};