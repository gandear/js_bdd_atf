import { createBdd } from 'playwright-bdd';
import { test, expect } from '../../fixtures/index.js';

const { Given } = createBdd(test);

Given('I am logged in as a valid user', async function ({ api }) {

  const response = await api.client.post(
    '/api/login', // Asigură-te că /api/login este corect
    {
      email: process.env.VALID_EMAIL,
      password: process.env.VALID_PASSWORD,
    },
    { auth: false }, 
  );

  if (response.status() !== 200 && response.status() !== 201) {
    // În loc să arunce o eroare generică, afișăm răspunsul serverului
    const responseText = await response.text();
    throw new Error(
      `Autentificare eșuată în Background! Status: ${response.status()}. Răspuns server: "${responseText.substring(0, 100)}..."`,
    );
  }

  const responseBody = await response.json();
  const token = responseBody.token;

  if (!response.ok() || !token) {
    throw new Error(`Autentificare eșuată în Background! Status: ${response.status()}`);
  }

  // Setarea token-ului pentru a fi folosit de pașii următori cu { auth: true }
  api.headersManager.setToken(token);
  
});

Given('no previous auth token is set', async ({ api }) => {
  // Pasul tău original de resetare a stării
  api.headersManager.setToken(null);
});