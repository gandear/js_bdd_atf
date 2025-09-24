// playwright-parallel.config.js
import { defineConfig } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

const commonBddOptions = {
  features: ['src/features/**/*.feature'],
  steps: ['src/steps/**/*.js', 'src/fixtures/index.js'],
};

export default defineConfig({
  globalSetup: './src/setup/global-setup.js',
  globalTeardown: './src/setup/global-teardown.js',
  
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  
  reporter: [
    ['list'],
    ['html', { outputDir: 'reports/html' }],
    ['junit', { outputFile: 'reports/junit.xml' }]
  ],
  
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  
  projects: [
    {
      ...defineBddProject('api-users', {
        ...commonBddOptions,
        features: ['src/features/api/users.feature', 'src/features/api/parametrized.feature']
      }),
      metadata: { suite: 'users' },
      use: { browserName: 'chromium' }
    },
    {
      ...defineBddProject('api-auth', {
        ...commonBddOptions,
        features: ['src/features/api/auth.feature']
      }),
      metadata: { suite: 'auth' },
      use: { browserName: 'chromium' }
    },
    {
      ...defineBddProject('api-performance', {
        ...commonBddOptions,
        features: ['src/features/api/performance.feature']
      }),
      metadata: { suite: 'performance' },
      use: { browserName: 'chromium' }
    },
    {
      ...defineBddProject('api-edge-cases', {
        ...commonBddOptions,
        features: ['src/features/api/data-driven.feature', 'src/features/api/error-handling.feature']
      }),
      metadata: { suite: 'edge-cases' },
      use: { browserName: 'chromium' }
    }
  ]
});