import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';

const { Given } = createBdd(test);

Given('the API is available and running', async ({ apiClient, logger }) => {
  logger.step('Health check: GET /api/users?page=1');
  const { res } = await apiClient.getUsers(1, { throwOnHttpError: false });
  expect(res.status()).toBeLessThan(500);
  logger.info('API healthy', { status: res.status() });
});

Given('the API client is initialized', async ({ apiClient, logger }) => {
  logger.step('Initialize API client');
  expect(apiClient).toBeTruthy();
  expect(apiClient.request).toBeTruthy();

  // sanity pentru /users – ajustează după API-ul tău
  expect(apiClient.getUsers).toBeDefined();
  expect(apiClient.getUser).toBeDefined();
  expect(apiClient.createUser).toBeDefined();
  expect(apiClient.updateUser).toBeDefined();
  expect(apiClient.deleteUser).toBeDefined();

  logger.info('API client ready');
});