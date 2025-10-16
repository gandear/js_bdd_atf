// src/steps/api/auth.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import { authResponseSchema, errorResponseSchema } from '../../api/schemas/schemas.js';
import { redactAuth, safeLen, httpSummary } from '../../utils/logging.js';

const { When, Then } = createBdd(test);

/* -------- REGISTER -------- */
When('I register with email {string} and password {string}',
  async ({ apiClient, testState, logger }, email, password) => {
    await test.step('POST /api/register', async () => {
      const payload = { email, password };
      logger.step('POST /api/register', { payload: redactAuth(payload) });

      // Tolerăm non-2xx (scenarii negative) => NU aruncă ApiClient
      const { res, json, text } = await apiClient.register(payload, { throwOnHttpError: false });
      logger.info('HTTP response', httpSummary(res, json ?? text));

      testState.res = res; testState.json = json; testState.text = text; testState.error = null;
    });
  }
);

Then('registration succeeds', async ({ testState, logger }) => {
  try {
    logger.action('Assert register 200');
    expect(testState.res.status()).toBe(200);
    SchemaValidator.assert(authResponseSchema, testState.json);
    logger.info('Register OK');
  } catch (e) {
    logger.error('Register assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

Then('registration fails with an error', async ({ testState, logger }) => {
  try {
    logger.action('Assert register >=400');
    expect(testState.res.status()).toBeGreaterThanOrEqual(400);
    SchemaValidator.assert(errorResponseSchema, testState.json);
    logger.info('Register negative OK', { body: safeLen(testState.json) });
  } catch (e) {
    logger.error('Register negative assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* -------- LOGIN -------- */
When('I login with email {string} and password {string}',
  async ({ apiClient, testState, logger }, email, password) => {
    await test.step('POST /api/login', async () => {
      const payload = { email, password };
      logger.step('POST /api/login', { payload: redactAuth(payload) });

      // Tolerăm non-2xx (scenarii negative) => NU aruncă ApiClient
      const { res, json, text } = await apiClient.login(payload, { throwOnHttpError: false });
      logger.info('HTTP response', httpSummary(res, json ?? text));

      testState.res = res; testState.json = json; testState.text = text; testState.error = null;
    });
  }
);

Then('login succeeds', async ({ testState, logger }) => {
  try {
    logger.action('Assert login 200');
    expect(testState.res.status()).toBe(200);
    SchemaValidator.assert(authResponseSchema, testState.json);
    logger.info('Login OK', { hasToken: !!testState.json?.token });
  } catch (e) {
    logger.error('Login assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

Then('login fails with an error', async ({ testState, logger }) => {
  try {
    logger.action('Assert login >=400');
    expect(testState.res.status()).toBeGreaterThanOrEqual(400);
    SchemaValidator.assert(errorResponseSchema, testState.json);
    logger.info('Login negative OK', { body: safeLen(testState.json) });
  } catch (e) {
    logger.error('Login negative assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});
