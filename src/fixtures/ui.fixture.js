// src/fixtures/ui.fixture.js (SIMPLIFICAT MAXIMAL)
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';

export const uiFixtures = {
  loginPage: async ({ page, log }, use) => {
    await use(new LoginPage(page, log));
  },
  
  dashboardPage: async ({ page, log }, use) => {
    await use(new DashboardPage(page, log));
  },
};