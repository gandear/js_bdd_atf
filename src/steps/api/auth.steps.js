// src/steps/api/auth.steps.js

import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';

const { When, Then } = createBdd(test);

When(
  'I send a POST request to {string} with email {string} and password {string}',
  async function ({ api }, endpoint, email, password) {

    // Asigură-te că endpoint-ul începe cu /api/ dacă baseURL nu conține /api
    const fullEndpoint = endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`; 

    const response = await api.client.post(fullEndpoint, { email, password }, {
      auth: false,
    });
  },
);

Then('the response contains a valid auth token', async function ({ api }) {
  const response = api.getLastResponse();
  expect(response.ok()).toBeTruthy();

  const responseBody = await api.getLastResponseBody();
  const token = responseBody.token; 

  expect(token).toBeDefined();

  // PAS CRITIC: Salvează token-ul pentru a fi folosit în alte scenarii
  api.headersManager.setToken(token);
});

Then('the response contains a newly generated user ID', async function ({ api }) {
    const responseBody = await api.getLastResponseBody();
    expect(responseBody.id).toBeDefined();
    expect(typeof responseBody.id).toBe('string');
});

Then('the response contains a newly generated user ID as a number', async function ({ api }) {
  const responseBody = await api.getLastResponseBody();
  expect(responseBody.id).toBeDefined();
  expect(typeof responseBody.id).toBe('number'); // <-- Așteaptă Number
});

Then('the response contains the error message {string}', async function ({ api }, expectedError) {
  const responseBody = await api.getLastResponseBody();
  const errorMessage = responseBody.error || responseBody.message; // Adaptare la structuri diferite de erori
  expect(errorMessage).toBe(expectedError);
});