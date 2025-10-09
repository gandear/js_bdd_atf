// src/fixtures/ui.fixture.js
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

export const uiFixtures = {
  loginPage: async ({ page, logger }, use) => {
    await use(new LoginPage(page, logger));
  },
  
  dashboardPage: async ({ page, logger }, use) => {
    await use(new DashboardPage(page, logger));
  },
};