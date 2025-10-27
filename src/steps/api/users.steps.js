// src/steps/api/users.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import {
  usersResponseSchema,
  singleUserResponseSchema,
} from '../../api/schemas/schemas.js';
import { httpSummary, sleep, backoffMs } from '../../utils/logging.js';

const { Given, When, Then } = createBdd(test);

/* ---------- LIST ---------- */
When('I request the user list for page {int}', async ({ apiClient, testState, logger }, page) => {
  await test.step(`GET /api/users?page=${page}`, async () => {
    logger.step('GET /api/users', { page });
    const { res, json, text } = await apiClient.getUsers(page, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
  });
});

Then('the response contains correct pagination metadata for page {int}', async ({ testState, logger }, page) => {
  SchemaValidator.assert(usersResponseSchema, testState.json);
  expect(testState.json.page).toBe(page);
  expect(Array.isArray(testState.json.data)).toBe(true);
  logger.info('Pagination OK', { page: testState.json.page, total: testState.json.total });
});

Then('the response contains a list of users', async ({ testState }) => {
  expect(Array.isArray(testState.json?.data)).toBe(true);
  expect(testState.json.data.length).toBeGreaterThan(0);
});

Then('the response contains an empty list of users', async ({ testState }) => {
  expect(Array.isArray(testState.json?.data)).toBe(true);
  expect(testState.json.data.length).toBe(0);
});

/* ---------- READ ONE ---------- */
When('I request the user details for ID {string}', async ({ apiClient, testState, logger }, id) => {
  await test.step(`GET /api/users/${id}`, async () => {
    logger.step('GET /api/users/{id}', { id });
    const { res, json, text } = await apiClient.getUser(id, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
  });
});

Then('the response contains the user data for ID {string}', async ({ testState, logger }, id) => {
  SchemaValidator.assert(singleUserResponseSchema, testState.json);
  expect(String(testState.json?.data?.id)).toBe(String(id));
  logger.info('Single user OK', { id: testState.json?.data?.id });
});

/* ---------- CREATE ---------- */
Given('I have prepared data for a new user with name {string} and job {string}', async ({ testState, logger }, name, job) => {
  testState.createPayload = { name, job };
  logger.step('Prepared create payload', { payload: testState.createPayload });
});

When('I send the create user request', async ({ testDataManager, testState, logger }) => {

    const payload = testState.createPayload ?? { name: `User ${Date.now()}`, job: 'Tester' };
    const { res, json, text } = await testDataManager.createTestUser(payload); 

    logger.info('HTTP response (final)', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
});

Then('the response contains the name {string} and job {string}', async ({ testState }, name, job) => {
  expect(testState.json?.name).toBe(name);
  expect(testState.json?.job).toBe(job);
});

Then('the response contains a newly generated user ID', async ({ testState }) => {
  expect(testState.json?.id).toBeTruthy();
});

Then('the response contains a creation timestamp', async ({ testState }) => {
  expect(String(testState.json?.createdAt)).toMatch(/^\d{4}-\d{2}-\d{2}T/);
});

/* bulk create */
When('I send a create request for the following users:', async ({ apiClient, testState, logger }, dataTable) => {
  const rows = dataTable?.hashes?.() ?? [];
  if (!rows.length) throw new Error('DataTable must contain at least one row');
  testState.bulkCreated = [];

  for (const row of rows) {
    await test.step(`POST /api/users (${row.name})`, async () => {
      const payload = { name: String(row.name).trim(), job: String(row.job).trim() };
      const { res, json, text } = await apiClient.createUser(payload, { throwOnHttpError: false });
      logger.info('HTTP response', httpSummary(res, json ?? text));
      testState.bulkCreated.push({ res, json, payload });
    });
  }
});

Then('all create requests are successful', async ({ testState }) => {
  const bulk = testState.bulkCreated || [];
  expect(bulk.length).toBeGreaterThan(0);
  for (const { res } of bulk) expect(res.status()).toBe(201);
});

Then('I can verify that user {string} was created with job {string}', async ({ testState }, name, job) => {
  const found = testState.bulkCreated.find(e => e.json?.name === name && e.json?.job === job);
  expect(!!found).toBe(true);
});

/* negative create */
When('I send the create user request with name {string} and job {string}', async ({ apiClient, testState, logger }, name, job) => {
    const payload = { name: name || '', job: job || '' };
    const { res, json, text } = await apiClient.createUser(payload, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
});

/* ---------- UPDATE (PUT/PATCH) ---------- */
Given('I want to update user {string} with name {string} and job {string}', async ({ testState, logger }, id, name, job) => {
  testState.updateId = id;
  testState.updatePayload = { name, job };
  logger.step('Prepared PUT payload', { id, payload: testState.updatePayload });
});

Given('I want to update user {string} with only the job {string}', async ({ testState, logger }, id, job) => {
  testState.updateId = id;
  testState.updatePayload = { job };
  logger.step('Prepared PATCH payload', { id, payload: testState.updatePayload });
});

When('I send a PUT request for user {string}', async ({ apiClient, testState, logger }, id) => {
    const payload = testState.updatePayload ?? { name: `Updated ${Date.now()}`, job: 'QA Lead' };
    const { res, json, text } = await apiClient.updateUser(id, payload, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
});

When('I send a PATCH request for user {string}', async ({ apiClient, testState, logger }, id) => {
    const payload = testState.updatePayload ?? { job: 'Zion Resident' };
    const { res, json, text } = await apiClient.patchUser?.(id, payload, { throwOnHttpError: false })
      ?? await apiClient.updateUser(id, payload, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
});

/* Soft checks pentru UPDATE – reqres trimite, de regulă, doar updatedAt */
Then('the response contains the updated name {string} and job {string}', async ({ testState }, name, job) => {
  expect(String(testState.json?.updatedAt)).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  if (testState.json?.name !== undefined) expect(testState.json.name).toBe(name);
  if (testState.json?.job !== undefined) expect(testState.json.job).toBe(job);
});

Then('the response contains the updated job {string}', async ({ testState }, job) => {
  expect(String(testState.json?.updatedAt)).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  if (testState.json?.job !== undefined) expect(testState.json.job).toBe(job);
});

Then('the response contains an update timestamp', async ({ testState }) => {
  expect(String(testState.json?.updatedAt)).toMatch(/^\d{4}-\d{2}-\d{2}T/);
});

/* ---------- DELETE ---------- */
When('I send a delete request for user {string}', async ({ apiClient, testState, logger }, id) => {
    const { res, json, text } = await apiClient.deleteUser(id, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text;
    testState.lastDeletedId = id;
});

Then('the response has no content', async ({ testState }) => {
  const body = testState.text ?? '';
  expect(body === '' || body === undefined || body === null).toBe(true);
});
