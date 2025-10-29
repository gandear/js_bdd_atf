// src/steps/api/users.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { SchemaValidator } from '../../api/helpers/schemaValidator.js';
import { 
  usersResponseSchema, 
  createdUserSchema,
  updatedUserSchema 
} from '../../api/schemas/schemas.js';

const { Given, When, Then } = createBdd(test);

// ==================== GIVEN (Setup) ====================

/**
 * Create user for subsequent operations (update/delete)
 */
Given(
  'a user with name {string} and job {string} is created',
  async function ({ api }, name, job) {
    const payload = { name, job };
    const userId = await api.dataManager.createTestUser(payload);
    
    if (!userId) {
      throw new Error('Failed to create user: No ID returned');
    }
    
    // Store for use in When steps
    this.createdUserId = userId;
    this.createdUserName = name;
  }
);

// ==================== WHEN (Actions) ====================

/**
 * GET request without authentication
 */
When('I send an unauthenticated GET request to {string}', async function ({ api }, endpoint) {
  await api.client.get(endpoint, { auth: false });
});

/**
 * POST: Create new user
 */
When(
  'I create a new user with name {string} and job {string}',
  async function ({ api }, name, job) {
    await api.client.post('/api/users', { name, job }, { auth: false });
    
    // Track for cleanup
    const body = await api.getLastResponseBody();
    if (body?.id) {
      api.dataManager.recordCreatedUser(body.id);
    }
  }
);

/**
 * PUT: Update existing user
 */
When(
  'I update the user\'s job to {string} via PUT request',
  async function ({ api }, newJob) {
    if (!this.createdUserId) {
      throw new Error('No user ID available. Run "Given a user...is created" first');
    }
    
    const endpoint = `/api/users/${this.createdUserId}`;
    const payload = { 
      name: this.createdUserName,
      job: newJob 
    };

    await api.client.put(endpoint, payload, { auth: true });
  }
);

/**
 * DELETE: Remove user (requires auth per @secure tag)
 */
When(
  'I send an authenticated DELETE request to {string}',
  async function ({ api }, endpoint) {
    await api.client.delete(endpoint, { auth: true });
  }
);

// ==================== THEN (Assertions) ====================

/**
 * Validate HTTP status code
 */
Then('the HTTP response is {int}', async function ({ api }, statusCode) {
  const response = api.getLastResponse();
  expect(response.status()).toBe(statusCode);
});

/**
 * Validate empty response body (204 No Content)
 */
Then('the response has no content', async function ({ api }) {
  const response = api.getLastResponse();
  expect(response.status()).toBe(204);
  
  const text = await response.text();
  expect(text).toHaveLength(0);
});

/**
 * Validate user fields (POST or PUT response)
 * Automatically detects schema based on response fields
 */
Then(
  'the response contains the name {string} and job {string}',
  async function ({ api }, name, job) {
    const body = await api.getLastResponseBody();
    
    // Detect schema type: updatedAt → PUT, createdAt → POST
    const schema = body.updatedAt ? updatedUserSchema : createdUserSchema;
    SchemaValidator.assert(schema, body);
    
    expect(body.name).toBe(name);
    expect(body.job).toBe(job);
  }
);

/**
 * Validate user list pagination
 */
Then(
  'the response contains correct pagination metadata for page {int}',
  async function ({ api }, expectedPage) {
    const body = await api.getLastResponseBody();
    
    // Schema validation
    SchemaValidator.assert(usersResponseSchema, body);
    
    expect(body.page).toBe(expectedPage);
    expect(body.per_page).toBeDefined();
    expect(body.total).toBeGreaterThan(0);
    expect(body.total_pages).toBeGreaterThanOrEqual(expectedPage);
    expect(body.data).toBeDefined();
    expect(body.data.length).toBeGreaterThan(0);
  }
);

/**
 * Validate update timestamp
 */
Then('the response contains a valid update timestamp', async function ({ api }) {
  const body = await api.getLastResponseBody();
  
  // Schema validation
  SchemaValidator.assert(updatedUserSchema, body);
  
  expect(body.updatedAt).toBeDefined();
  expect(typeof body.updatedAt).toBe('string');
  expect(body.updatedAt.length).toBeGreaterThan(10);
  
  // Validate ISO 8601 format
  const isValidDate = !isNaN(Date.parse(body.updatedAt));
  expect(isValidDate).toBe(true);
});