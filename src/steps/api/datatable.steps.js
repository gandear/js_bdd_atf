// src/steps/api/datatable.steps.js
import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';
import { TestDataFactory } from '../../api/helpers/testDataFactory.js';

const { When, Then } = createBdd(test);

/**
 * When I create users from table
 * Accepts a Cucumber DataTable (object with .hashes) or an array of row objects.
 */
When('I create users from table', async ({ testDataManager, testState, logger }, dataTable) => {
  const rows = (dataTable && typeof dataTable.hashes === 'function')
    ? dataTable.hashes()
    : Array.isArray(dataTable) ? dataTable : [];

  if (!rows.length) {
    logger?.warn?.('DataTable is empty - nothing to create');
    throw new Error('DataTable must contain at least one row');
  }

  const created = [];

  for (const row of rows) {
    // Practice parsing types: accept numbers/booleans as strings and convert when appropriate
    const name = row.name ? String(row.name).trim() : TestDataFactory.uid('user');
    const job = row.job ? String(row.job).trim() : 'Tester';
    const email = row.email ? String(row.email).trim() : `${TestDataFactory.uid('mail')}@example.com`;

    const payload = { name, job, email };

    await test.step(`Create user ${payload.name}`, async () => {
      logger?.step?.('POST /api/users (from DataTable)', { payload });
      const { res, json } = await testDataManager.createTestUser(payload);
      logger?.info?.('HTTP response', { status: res.status(), url: res.url() });

      // crucial check: stop if creation failed
      expect(res.status()).toBe(201);

      // store created resource for later steps
      created.push(json);
    });
  }

  testState.currentUsers = created;
});

Then('the table users are created', async ({ testState }) => {
  const users = testState.currentUsers || [];
  expect(users.length).toBeGreaterThan(0);
  for (const u of users) expect(u.id).toBeTruthy();
});
