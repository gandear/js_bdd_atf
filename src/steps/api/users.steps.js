// src/steps/api/users.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import {
  usersResponseSchema,
  singleUserResponseSchema_alt as singleUserResponseSchema,
  createdUserSchema,
  updatedUserSchema
} from '../../api/schemas/schemas.js';
import { TestDataFactory } from '../../api/helpers/testDataFactory.js';

const { When, Then } = createBdd(test);

/* ---------- GET /users?page= ---------- */
When('I fetch users page {int}', async ({ apiClient, testState, log }, page) => {
  await test.step(`GET /api/users?page=${page}`, async () => {
    log.step('GET /api/users', { page });
    const { res, json } = await apiClient.getUsers(page);
    log.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = json; testState.error = null;
  });
});

Then('a users list is returned', async ({ testState, log }) => {
  try {
    log.action('Assert users list 200');
    expect(testState.res.status()).toBe(200);
    SchemaValidator.assert(usersResponseSchema, testState.json);
    log.info('Users list OK', { count: testState.json?.data?.length ?? 0 });
  } catch (e) {
    log.error('Users list assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* ---------- GET /users/{id} ---------- */
When('I fetch user with id {string}', async ({ apiClient, testState, log }, id) => {
  await test.step(`GET /api/users/${id}`, async () => {
    log.step('GET /api/users/{id}', { id });
    const { res, json } = await apiClient.getUser(id);
    log.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = json; testState.error = null;
  });
});

Then('a single user is returned', async ({ testState, log }) => {
  try {
    log.action('Assert single user 200');
    expect(testState.res.status()).toBe(200);
    SchemaValidator.assert(singleUserResponseSchema, testState.json);
    log.info('Single user OK', { id: testState.json?.data?.id });
  } catch (e) {
    log.error('Single user assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

Then('the user is not found', async ({ testState, log }) => {
  try {
    log.action('Assert 404 not found');
    expect(testState.res.status()).toBe(404);
    log.info('Not found OK');
  } catch (e) {
    log.error('Not found assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* ---------- POST /users ---------- */
When('I create a random user', async ({ testDataManager, testState , log }) => {
  const payload = TestDataFactory.generateRandomUser();
  await test.step('POST /api/users', async () => {
    log.step('POST /api/users', { payload });
    const { res, json } = await testDataManager.createTestUser(payload);
    log.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = json; testState.error = null;
  });
});

Then('the user is created', async ({ testState, log }) => {
  try {
    log.action('Assert created 201');
    expect(testState.res.status()).toBe(201);
    SchemaValidator.assert(createdUserSchema, testState.json);
    log.info('Create OK', { id: testState.json?.id });
  } catch (e) {
    log.error('Create assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* ---------- PUT /users/{id} ---------- */
When('I update user {string} with a new job', async ({ apiClient, testState, log }, id) => {
  const update = { name: `Updated ${Date.now()}`, job: 'QA Lead' };
  await test.step(`PUT /api/users/${id}`, async () => {
    log.step('PUT /api/users/{id}', { id, update });
    const { res, json } = await apiClient.updateUser(id, update);
    log.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = json; testState.error = null;
  });
});

Then('the user is updated', async ({ testState, log }) => {
  try {
    log.action('Assert updated 200');
    expect(testState.res.status()).toBe(200);
    SchemaValidator.assert(updatedUserSchema, testState.json);
    log.info('Update OK');
  } catch (e) {
    log.error('Update assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});

/* ---------- DELETE /users/{id} ---------- */
When('I delete user {string}', async ({ apiClient, testState, log }, id) => {
  await test.step(`DELETE /api/users/${id}`, async () => {
    log.step('DELETE /api/users/{id}', { id });
    const { res } = await apiClient.deleteUser(id);
    log.info('HTTP response', { status: res.status(), url: res.url() });
    testState.res = res; testState.json = null; testState.error = null;
  });
});

Then('the user is deleted', async ({ testState, log }) => {
  try {
    log.action('Assert deleted 204');
    expect(testState.res.status()).toBe(204);
    log.info('Delete OK');
  } catch (e) {
    log.error('Delete assertion failed', { status: testState.res?.status?.(), url: testState.res?.url?.() });
    throw e;
  }
});
