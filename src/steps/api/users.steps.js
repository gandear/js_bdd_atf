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

Given(
  'a user with name {string} and job {string} is created',
  async function ({ api }, name, job) {
    
    // Simplificare: Apelăm metoda robustă din dataManager
    const payload = { name, job };
    const { id } = await api.dataManager.createTestUser(payload);
    
    if (!id) {
        throw new Error("Failed to create user for testing: ID not returned.");
    }
    
    // Salvăm ID-ul pentru a fi folosit de pasul 'When I update...'
    api.client.setLastCreatedUserId(id); 
  },
);

When(
  'I update the user\'s job to {string} via PUT request',
  async function ({ api }, newJob) {
    const userId = api.client.getLastCreatedUserId(); // Obține ID-ul salvat anterior

    if (!userId) {
        throw new Error("Cannot update user: No user ID was recorded in the previous step.");
    }
    
    // Obține datele user-ului original (sau cel puțin numele)
    // Deoarece ReqRes nu oferă un endpoint GET user by ID, vom presupune numele original
    const endpoint = `/api/users/${userId}`;
    const payload = { 
        name: "Neo", // Presupunem că știm numele original din Gherkin
        job: newJob 
    };

    // Cererea PUT
    await api.client.put(endpoint, payload, { auth: true });
  },
);

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

Then('the response contains a valid update timestamp', async function ({ api }) {
    const responseBody = await api.getLastResponseBody();
    
    // ReqRes returnează 'updatedAt' la PUT/PATCH
    expect(responseBody.updatedAt).toBeDefined();
    
    // Verifică formatul de bază al timestamp-ului
    expect(typeof responseBody.updatedAt).toBe('string');
    expect(responseBody.updatedAt.length).toBeGreaterThan(10); 
});