// src/steps/api/users.steps.js

import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';

const { Given, When, Then } = createBdd(test);

// --- READ ---
When('I send an unauthenticated GET request to {string}', async function ({ api }, endpoint) {
  // Cerere publică: auth: false
  await api.client.get(endpoint, { auth: false });
});

// --- CREATE ---
When(
  'I create a new user with name {string} and job {string}',
  async function ({ api }, name, job) {
    // ... execuția POST și obținerea răspunsului
    const response = await api.client.post('/api/users', { name, job }, { auth: false }); 

    const user = await response.json(); 
    
    const id = user?.id; // ReqRes returnează id direct în body
    if (id) {
        api.dataManager.recordCreatedUser(id); 
    } else {
        // Loghează sau aruncă o eroare dacă ID-ul lipsește, dar testul ar trebui să pice la statusul 201
    }
  },
);

// --- DELETE ---
When(
  'I send an authenticated DELETE request to {string}',
  async function ({ api }, endpoint) {
    // Aici se trimite un obiect cu 'auth: true'
    await api.client.delete(endpoint, { auth: true }); 
  },
);

// --- Pași de Validare Generali ---

Then('the HTTP response is {int}', async function ({ api }, statusCode) {
  const response = api.getLastResponse();
  expect(response.status()).toBe(statusCode);
});

Then('the response has no content', async function ({ api }) {
    const response = api.getLastResponse();
    // Verifică dacă răspunsul este gol sau are lungimea 0 (tipic pentru 204 No Content)
    expect(response.status()).toBe(204); 
    const text = await response.text();
    expect(text).toHaveLength(0);
});

Then(
  'the response contains the name {string} and job {string}',
  async function ({ api }, name, job) {
    const responseBody = await api.getLastResponseBody();
    expect(responseBody.name).toBe(name);
    expect(responseBody.job).toBe(job);
});

Then(
  'the response contains correct pagination metadata for page {int}',
  async function ({ api }, expectedPage) {
    const responseBody = await api.getLastResponseBody();

    // Logica de verificare a paginării (Exemplu pentru ReqRes.in)
    expect(responseBody.page).toBe(expectedPage);
    expect(responseBody.per_page).toBeDefined();
    expect(responseBody.total).toBeGreaterThan(0);
    expect(responseBody.total_pages).toBeGreaterThanOrEqual(expectedPage);

    // Opțional: Verifică că lista de date există și nu este goală
    expect(responseBody.data).toBeDefined();
    expect(responseBody.data.length).toBeGreaterThan(0);
  }
);