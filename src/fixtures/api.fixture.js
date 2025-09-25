// src/fixtures/api.fixture.js
import { request as pwRequest } from '@playwright/test';
import { ApiClient } from '../api/clients/ApiClient.js';
import { TestDataManager } from '../api/helpers/testDataManager.js';

export const apiFixtures = {
  // Returnează un APIRequestContext configurat din project.use (nu din env)
  apiRequest: async ({}, use, testInfo) => {
    const { use: projectUse = {} } = testInfo?.project ?? {};
    const baseRaw = projectUse.baseURL || 'https://reqres.in/';
    const headersFromConfig = projectUse.extraHTTPHeaders || {};

    // Asigură trailing slash la baseURL pentru rezolvarea corectă a path-urilor relative
    let baseURL;
    try {
      baseURL = new URL(String(baseRaw)).toString();
    } catch {
      throw new Error(`Invalid API baseURL: ${baseRaw}`);
    }

    // Construieste header-ele finale (nu logăm secretele)
    const headers = {
      'Content-Type': 'application/json',
      ...headersFromConfig
    };

    // (opțional) atașament Allure cu config redactionat
    try {
      const redacted = Object.fromEntries(
        Object.entries(headers).map(([k, v]) =>
          /(token|secret|key|authorization)/i.test(k) ? [k, '***'] : [k, v]
        )
      );
      await testInfo.attach('api-context.json', {
        contentType: 'application/json',
        body: JSON.stringify({ baseURL, headers: redacted }, null, 2)
      });
    } catch {}

    const ctx = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: headers,
      ignoreHTTPSErrors: true,
      timeout: 15_000
    });

    await use(ctx);
    await ctx.dispose();
  },

  // Client de nivel superior care folosește contextul API
  apiClient: async ({ apiRequest }, use) => {
    await use(new ApiClient(apiRequest)); // în client: folosește rute relative (fără "/")
  },

  // Stare simplă partajată între pași
  apiState: async ({}, use) => {
    await use({ res: null, json: null, error: null });
  },

  // Manager pentru test data + cleanup automat + atașament Allure cu metrici
  testDataManager: async ({ apiClient }, use, testInfo) => {
    const manager = new TestDataManager(apiClient);
    await use(manager);
    await manager.cleanupCreatedUsers();
    await testInfo.attach('test-data-metrics.json', {
      body: JSON.stringify(manager.getTestMetrics(), null, 2),
      contentType: 'application/json'
    });
  }
};
