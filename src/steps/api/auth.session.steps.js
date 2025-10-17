// src/steps/api/auth.session.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { TestDataFactory } from '../../api/helpers/testDataFactory.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import { authResponseSchema } from '../../api/schemas/schemas.js';

import { redactAuth, safeLen } from '../../utils/logging.js';

const { When, Then } = createBdd(test);

When('I authenticate with valid credentials', async ({ apiClient, testState, logger }) => {
  await test.step('POST /api/login (session)', async () => {
    const creds = TestDataFactory.getValidCredentials()[0];
    logger.step('Authenticate with valid credentials', { payload: redactAuth(creds) });

    try {
      const { res, json } = await apiClient.loginAndSetToken(creds);

      logger.info('HTTP response', {
        status: res.status(),
        url: res.url(),
        body: safeLen(json, 500),
      });

      testState.res = res;
      testState.json = json;
      testState.authToken = apiClient.authToken;
      testState.error = null;
    } catch (e) {
      logger.error('Auth session request failed', {
        error: e?.message,
        status: e?.status,
        url: e?.url,
      });
      testState.error = e;
      testState.res = null;
      testState.json = null;
      throw e;
    }
  });
});

Then('the client holds a bearer token', async ({ apiClient, testState, logger }) => {
  logger.action('Assert bearer token on client');

  expect(testState.res.status()).toBe(200);
  SchemaValidator.assert(authResponseSchema, testState.json);

  const token = apiClient.authToken || testState.authToken || testState.json?.token;
  expect(token).toBeTruthy();

  // log non-sensitive preview
  logger.info('Token present', { tokenPreview: token ? String(token).slice(0, 5) + '…' : null });
});
