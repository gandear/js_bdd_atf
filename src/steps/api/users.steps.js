// src/steps/api/users.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import {
  usersResponseSchema,
  singleUserResponseSchema,
  createdUserSchema,
  updatedUserSchema
} from '../../api/schemas/schemas.js';
import { TestDataFactory } from '../../api/helpers/testDataFactory.js';
import { safeLen, sleep, backoffMs, httpSummary } from '../../utils/logging.js';

const { When, Then } = createBdd(test);

/* ---------- GET /users?page= ---------- */
When('I fetch users page {int}', async ({ apiClient, testState, logger }, page) => {
  await test.step(`GET /api/users?page=${page}`, async () => {
    logger.step('GET /api/users', { page });
    // Tolerăm non-2xx (defensiv) ca să logăm conținutul în caz de eșec
    const { res, json, text } = await apiClient.getUsers(page, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text; testState.error = null;
  });
});

Then('a users list is returned', async ({ testState, logger }) => {
  try {
    logger.action('Assert users list 200');
    expect(testState.res.status()).toBe(200);
    SchemaValidator.assert(usersResponseSchema, testState.json);
    logger.info('Users list OK', { count: testState.json?.data?.length ?? 0 });
  } catch (e) {
    logger.error('Users list assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* ---------- GET /users/{id} ---------- */
When('I fetch user with id {string}', async ({ apiClient, testState, logger }, id) => {
  await test.step(`GET /api/users/${id}`, async () => {
    logger.step('GET /api/users/{id}', { id });
    // Același step deservește și negativele (404) => NU aruncăm
    const { res, json, text } = await apiClient.getUser(id, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text; testState.error = null;
  });
});

Then('a single user is returned', async ({ testState, logger }) => {
  try {
    logger.action('Assert single user 200');
    expect(testState.res.status()).toBe(200);
    SchemaValidator.assert(singleUserResponseSchema, testState.json);
    logger.info('Single user OK', { id: testState.json?.data?.id });
  } catch (e) {
    logger.error('Single user assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

Then('the user is not found', async ({ testState, logger }) => {
  try {
    logger.action('Assert 404 not found');
    expect(testState.res.status()).toBe(404);
    logger.info('Not found OK');
  } catch (e) {
    logger.error('Not found assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* ---------- POST /users ---------- */
When('I create a random user', async ({ apiClient, testState , logger }) => {
  const payload = TestDataFactory.generateRandomUser();
  await test.step('POST /api/users', async () => {
    logger.step('POST /api/users', { payload });

    // Anti-flake: retry mic DOAR pe 429 (ReqRes rate-limit la burst)
    const maxAttempts = Number(process.env.API_WRITE_MAX_ATTEMPTS || 3);
    const baseDelay = Number(process.env.API_WRITE_BACKOFF_MS || 300);

    let lastRes, lastJson, lastText;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const { res, json, text } = await apiClient.createUser(
        payload,
        { throwOnHttpError: false } // NU aruncăm; decidem noi cum tratăm 429
      );
      lastRes = res; lastJson = json; lastText = text;

      logger.info('Create attempt', { attempt, status: res.status(), url: res.url() });

      if (res.status() === 201) break;
      if (res.status() === 429 && attempt < maxAttempts) {
        const wait = backoffMs(attempt, baseDelay);
        logger.warn('429 rate-limited, backoff', { attempt, waitMs: wait });
        await sleep(wait);
        continue;
      }
      break; // alt status ≠ 201/429 → nu repetăm
    }

    logger.info('HTTP response (final)', httpSummary(lastRes, lastJson ?? lastText));
    testState.res = lastRes; testState.json = lastJson; testState.text = lastText; testState.error = null;
  });
});

Then('the user is created', async ({ testState, logger }) => {
  try {
    logger.action('Assert created 201');
    expect(testState.res.status()).toBe(201);
    SchemaValidator.assert(createdUserSchema, testState.json);
    logger.info('Create OK', { id: testState.json?.id });
  } catch (e) {
    logger.error('Create assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* ---------- PUT /users/{id} ---------- */
When('I update user {string} with a new job', async ({ apiClient, testState, logger }, id) => {
  const update = { name: `Updated ${Date.now()}`, job: 'QA Lead' };
  await test.step(`PUT /api/users/${id}`, async () => {
    logger.step('PUT /api/users/{id}', { id, update });
    const { res, json, text } = await apiClient.updateUser(id, update, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text; testState.error = null;
  });
});

Then('the user is updated', async ({ testState, logger }) => {
  try {
    logger.action('Assert updated 200');
    expect(testState.res.status()).toBe(200);
    SchemaValidator.assert(updatedUserSchema, testState.json);
    logger.info('Update OK');
  } catch (e) {
    logger.error('Update assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* ---------- DELETE /users/{id} ---------- */
When('I delete user {string}', async ({ apiClient, testState, logger }, id) => {
  await test.step(`DELETE /api/users/${id}`, async () => {
    logger.step('DELETE /api/users/{id}', { id });
    const { res, json, text } = await apiClient.deleteUser(id, { throwOnHttpError: false });
    logger.info('HTTP response', httpSummary(res, json ?? text));
    testState.res = res; testState.json = json; testState.text = text; testState.error = null;
  });
});

Then('the user is deleted', async ({ testState, logger }) => {
  try {
    logger.action('Assert deleted 204');
    expect(testState.res.status()).toBe(204);
    logger.info('Delete OK');
  } catch (e) {
    logger.error('Delete assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});
