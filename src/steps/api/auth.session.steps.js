// src/steps/api/auth.session.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { TestDataFactory } from '../../api/helpers/testDataFactory.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import { authResponseSchema } from '../../api/schemas/schemas.js';

const { When, Then } = createBdd(test);

When('I authenticate with valid credentials', async ({ apiClient, testState }) => {
  const { email, password } = TestDataFactory.getValidCredentials()[0];
  const { res, json } = await apiClient.loginAndSetToken({ email, password });
  testState.res = res; testState.json = json; testState.authToken = apiClient.authToken;
});

Then('the client holds a bearer token', async ({ apiClient, testState }) => {
  expect(testState.res.status()).toBe(200);
  SchemaValidator.assert(authResponseSchema, testState.json);
  expect(apiClient.authToken || testState.authToken).toBeTruthy();
});
