// src/steps/api/auth.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import { authResponseSchema, errorResponseSchema } from '../../api/schemas/schemas.js';

const { When, Then } = createBdd(test);

/**
 * POST to auth endpoints (register/login)
 */
When(
  'I send a POST request to {string} with email {string} and password {string}',
  async function ({ api }, endpoint, email, password) {
    const fullEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
    await api.client.post(fullEndpoint, { email, password }, { auth: false });
  }
);

/**
 * Validate auth token presence and save to HeadersManager
 */
Then('the response contains a valid auth token', async function ({ api }) {
  const response = api.getLastResponse();
  expect(response.ok()).toBeTruthy();

  const body = await api.getLastResponseBody();
  
  // Schema validation
  SchemaValidator.assert(authResponseSchema, body);
  
  const token = body.token;
  expect(token).toBeDefined();
  expect(token).not.toBe('');

  // Save token for authenticated requests
  api.headersManager.setToken(token);
});

/**
 * Validate user ID in register response (string format)
 */
Then('the response contains a newly generated user ID', async function ({ api }) {
  const body = await api.getLastResponseBody();
  expect(body.id).toBeDefined();
  expect(typeof body.id).toBe('string');
});

/**
 * Validate user ID in register response (number format)
 */
Then('the response contains a newly generated user ID as a number', async function ({ api }) {
  const body = await api.getLastResponseBody();
  expect(body.id).toBeDefined();
  expect(typeof body.id).toBe('number');
});

/**
 * Validate error message in failed auth requests
 */
Then('the response contains the error message {string}', async function ({ api }, expectedError) {
  const body = await api.getLastResponseBody();
  
  // Schema validation for error responses
  SchemaValidator.assert(errorResponseSchema, body);
  
  const errorMessage = body.error || body.message;
  expect(errorMessage).toBe(expectedError);
});