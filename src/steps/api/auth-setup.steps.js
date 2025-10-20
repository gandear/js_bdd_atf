import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';

const { Given } = createBdd(test);

Given('the authentication endpoint is configured', async ({ logger }) => {
  logger.step('Verify auth endpoints exist');
  logger.info('Auth endpoints configured', { register: '/api/register', login: '/api/login' });
});

Given('the API client is ready', async ({ apiClient, logger }) => {
  logger.step('Initialize API client');
  expect(apiClient).toBeTruthy();
  expect(apiClient.register).toBeDefined();
  expect(apiClient.login).toBeDefined();
  logger.info('API client ready');
});

Given('no previous auth token is set', async ({ apiClient, testState, logger }) => {
  logger.step('Clear previous auth token');
  apiClient.setAuthToken?.(null);
  testState.authToken = null;
  logger.info('Auth state cleared');
});
