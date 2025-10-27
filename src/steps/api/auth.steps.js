import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import { authResponseSchema, errorResponseSchema } from '../../api/schemas/schemas.js';
import { redactAuth, httpSummary, safeLength } from '../../utils/logging.js';

const { When, Then } = createBdd(test);

/* -------- REGISTER -------- */
When('I register a user with email {string} and password {string}', async ({ apiClient, testState, logger }, email, password) => {
    const payload = { email, password };
    logger.step('POST /api/register', { payload: redactAuth(payload) });
    const { res, json, text } = await apiClient.register(payload, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
});

Then('the response contains a user ID', async ({ testState, logger }) => {
  const id = testState.json?.id;
  expect(id).toBeTruthy();
  logger.info('User ID present', { idPreview: String(id).slice(0, 6) + '…' });
});

Then('the response contains an authentication token', async ({ testState, logger }) => {
  expect(testState.json?.token).toBeTruthy();
  logger.info('Auth token present', { tokenPreview: String(testState.json?.token).slice(0, 5) + '…' });
});

Then('the response contains the error message {string}', async ({ testState, logger }, expected) => {
  expect(String(testState.json?.error || testState.text || '')).toContain(expected);
  logger.info('Error message asserted', { expected, bodyPreview: safeLength(testState.json ?? testState.text, 240) });
});

/* -------- LOGIN -------- */
When('I log in with email {string} and password {string}', async ({ apiClient, testState, logger }, email, password) => {
    const payload = { email, password };
    logger.step('POST /api/login', { payload: redactAuth(payload) });
    const { res, json, text } = await apiClient.login(payload, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
});

/* -------- GENERIC HTTP ASSERTIONS (reused by both REGISTER/LOGIN) -------- */
Then('the HTTP response is {int}', async ({ testState, logger }, status) => {
  logger.debug?.('testState.res before assertion', { res: testState.res });
  expect(testState.res.status()).toBe(status);
  logger.action('Assert HTTP status exact', { expected: status, actual: testState.res.status() });
});

Then('the HTTP response is {int} labeled {string}', async ({ testState, logger }, status, _label) => {
  logger.debug?.('testState.res before assertion', { res: testState.res });
  expect(testState.res.status()).toBe(status);
  logger.action('Assert HTTP status exact (labeled)', { expected: status, label: _label });
});
