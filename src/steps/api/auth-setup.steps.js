// src/steps/api/auth-setup.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';

const { Given } = createBdd(test);

/**
 * Background step: Login with valid credentials
 * Sets auth token in HeadersManager for @secure scenarios
 */
Given('I am logged in as a valid user', async function ({ api, logger }) {
  const credentials = {
    email: process.env.VALID_EMAIL || 'eve.holt@reqres.in',
    password: process.env.VALID_PASSWORD || 'cityslicka',
  };

  const response = await api.client.post('/api/login', credentials, { 
    auth: false 
  });

  if (!response.ok()) {
    const responseText = await response.text();
    logger?.error('Background auth failed', { 
      status: response.status(), 
      body: responseText.substring(0, 200) 
    });
    
    throw new Error(
      `Background authentication failed! ` +
      `Status: ${response.status()}. ` +
      `Response: ${responseText.substring(0, 100)}`
    );
  }

  const body = await response.json();
  const token = body.token;

  if (!token) {
    throw new Error('Login succeeded but no token returned');
  }

  // Set token for @secure scenarios
  api.headersManager.setToken(token);
  logger?.info('Background auth successful', { hasToken: !!token });
});

/**
 * Reset auth state (clear token)
 */
Given('no previous auth token is set', async ({ api }) => {
  api.headersManager.setToken(null);
});