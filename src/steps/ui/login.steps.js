// src/steps/ui/login.steps.js

import { createBdd } from 'playwright-bdd';
import { test } from '../../fixtures/index.js';
import { expect } from '@playwright/test';

export const { Given, When, Then, Before, After } = createBdd(test);

const loginUrl = process.env.LOGIN_PATH || 'web/index.php/auth/login';

// Given steps
Given('I am on the OrangeHRM login page', async ({ loginPage, log }) => {
  log.step('Navigate to OrangeHRM login page');
  await loginPage.open();
});

// When steps
When('I log in with username {string} and password {string}', async ({ loginPage, log }, username, password) => {
  log.step(`Attempt login with credentials`, { username, password: '***' });
  await loginPage.login(username, password);
});

// Then steps
Then('I should see the dashboard', async ({ dashboardPage }) => {
  const isDashboardVisible = await dashboardPage.isDashboardVisible();
  expect(isDashboardVisible).toBe(true);
});

Then('I should see the error message {string}', async ({ loginPage, log }, expected) => {
  // Use the 'log' fixture to record information about this step.
  log.info(`Checking for error message: "${expected}"`);
  
  if (expected.toLowerCase() === 'required') {
    // Check for messages next to the input fields.
    const errors = await loginPage.getRequiredFieldErrors();
    expect(errors.length).toBeGreaterThan(0);
    
    // Check if at least one error is exactly "Required".
    expect(errors).toContain('Required');
  } else {
    // Check for a banner (e.g., "Invalid credentials").
    const banner = await loginPage.getBannerErrorText();
    expect(banner).toContain(expected);
  }
});

Then('I should see required field errors', async ({ loginPage }) => {
  const isRequiredErrorDisplayed = await loginPage.isRequiredFieldErrorDisplayed();
  expect(isRequiredErrorDisplayed).toBe(true);
});