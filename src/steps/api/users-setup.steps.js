// src/steps/api/users-setup.steps.js (FINAL)

import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';

const { Given, Then } = createBdd(test);

/**
 * Acest pas creează o resursă necesară altor pași (e.g., pentru update sau delete).
 */
Given(
  'I create a random user with job {string}',
  async function ({ api }, job) {
    const randomName = 'SetupUser_' + Math.floor(Math.random() * 1000);
    const userData = { name: randomName, job: job };

    // Creează user-ul (auth: false pentru ReqRes)
    const response = await api.client.post('/users', userData, {
      auth: false, 
    });

    expect(response.status()).toBe(201); 

    const user = await api.getLastResponseBody();
    
    // CRITIC: Înregistrează user-ul pentru curățare automată prin dataManager
    api.dataManager.addCreatedUser(user); 
    
    // Setează datele în contextul BDD pentru a fi folosite în alte steps (e.g., pentru ID-ul de șters)
    this.createdUser = user;
    this.createdUserId = user.id; 
  },
);

/**
 * Pasul care asigură că nu există tokeni vechi setați.
 */
Given('the API client is initialized', async ({ api }) => {
    // Verifică că managerul de headere și clientul există (test simplu de setup)
    expect(api.client).toBeDefined();
    expect(api.headersManager).toBeDefined();
});

// Puteți adăuga aici și logica de curățare explicită, dacă nu este în After Hook
Then('all created test data should be cleaned up', async function ({ api }) {
    await api.dataManager.cleanupCreatedUsers();
});