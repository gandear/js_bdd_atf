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

const { When, Then } = createBdd(test);

/* ---------- GET /users?page= ---------- */
When('I fetch users page {int}', async ({ apiClient, testState, logger }, page) => {
  await test.step(`GET /api/users?page=${page}`, async () => {
    logger.step('GET /api/users', { page });
    const { res, json } = await apiClient.getUsers(page);
    logger.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = json; testState.error = null;
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
    const { res, json } = await apiClient.getUser(id);
    logger.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = json; testState.error = null;
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
When('I create a random user', async ({ testDataManager, testState , logger }) => {
  const payload = TestDataFactory.generateRandomUser();
  await test.step('POST /api/users', async () => {
    logger.step('POST /api/users', { payload });
    const { res, json } = await testDataManager.createTestUser(payload);
    logger.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = json; testState.error = null;
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
    const { res, json } = await apiClient.updateUser(id, update);
    logger.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = json; testState.error = null;
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
    const { res } = await apiClient.deleteUser(id);
    logger.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = null; testState.error = null;
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
