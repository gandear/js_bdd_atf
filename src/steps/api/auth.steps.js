// src/steps/api/auth.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import { authResponseSchema, errorResponseSchema } from '../../api/schemas/schemas.js';

const { When, Then } = createBdd(test);

/* -------- REGISTER -------- */
When('I register with email {string} and password {string}',
  async ({ apiClient, apiState, log }, email, password) => {
    await test.step('POST /api/register', async () => {
      log.step('POST /api/register', { email });
      const { res, json } = await apiClient.register({ email, password });
      log.info('HTTP response', { status: res.status(), url: res.url() });
      apiState.res = res; apiState.json = json; apiState.error = null;
    });
  }
);

Then('registration succeeds', async ({ apiState, log }) => {
  try {
    log.action('Assert register 200');
    expect(apiState.res.status()).toBe(200);
    SchemaValidator.assert(authResponseSchema, apiState.json);
    log.info('Register OK');
  } catch (e) {
    log.error('Register assertion failed', { status: apiState.res?.status?.(), url: apiState.res?.url?.() });
    throw e;
  }
});

Then('registration fails with an error', async ({ apiState, log }) => {
  try {
    log.action('Assert register >=400');
    expect(apiState.res.status()).toBeGreaterThanOrEqual(400);
    SchemaValidator.assert(errorResponseSchema, apiState.json);
    log.info('Register negative OK');
  } catch (e) {
    log.error('Register negative assertion failed', { status: apiState.res?.status?.(), url: apiState.res?.url?.() });
    throw e;
  }
});

/* -------- LOGIN -------- */
When('I login with email {string} and password {string}',
  async ({ apiClient, apiState, log }, email, password) => {
    await test.step('POST /api/login', async () => {
      log.step('POST /api/login', { email });
      const { res, json } = await apiClient.login({ email, password });
      log.info('HTTP response', { status: res.status(), url: res.url() });
      apiState.res = res; apiState.json = json; apiState.error = null;
    });
  }
);

Then('login succeeds', async ({ apiState, log }) => {
  try {
    log.action('Assert login 200');
    expect(apiState.res.status()).toBe(200);
    SchemaValidator.assert(authResponseSchema, apiState.json);
    log.info('Login OK', { hasToken: !!apiState.json?.token });
  } catch (e) {
    log.error('Login assertion failed', { status: apiState.res?.status?.(), url: apiState.res?.url?.() });
    throw e;
  }
});

Then('login fails with an error', async ({ apiState, log }) => {
  try {
    log.action('Assert login >=400');
    expect(apiState.res.status()).toBeGreaterThanOrEqual(400);
    SchemaValidator.assert(errorResponseSchema, apiState.json);
    log.info('Login negative OK');
  } catch (e) {
    log.error('Login negative assertion failed', { status: apiState.res?.status?.(), url: apiState.res?.url?.() });
    throw e;
  }
});
