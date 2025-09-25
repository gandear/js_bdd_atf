// playwright.config.js
import 'dotenv/config';
import { defineConfig } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

const isCI = !!process.env.CI;
const steps = ['src/steps/**/*.js', 'src/fixtures/index.js'];
const baseURL = (process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com').replace(/\/$/, '');

const uiUse = {
  baseURL,
  headless: true,                 
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'off'
};

export default defineConfig({
  // stabilitate în CI
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,

  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  outputDir: 'test-results',

  reporter: [
    ['list'],
    ['junit', { outputFile: 'junit/results.xml' }],               // pentru Jenkins JUnit
    ['allure-playwright', {                                        // pentru Allure plugin în Jenkins
      outputFolder: process.env.ALLURE_RESULTS_DIR || 'allure-results',
      environmentInfo: {
        Environment: process.env.NODE_ENV || 'test',
        'Test Type': 'BDD + Playwright API & UI'
      }
    }],
    ['./src/utils/cleanup-reporter.js']
  ],

  use: { ...uiUse }, // fallback global; proiectele pot suprascrie

  projects: [
    // API (fără artefacte UI)
    {
      ...defineBddProject({
        name: 'api-bdd',
        features: ['src/features/api/**/*.feature'],
        steps,
        outputDir: '.features-gen/api'
      }),
      metadata: { suite: 'API' },
      use: { trace: 'off', screenshot: 'off', video: 'off' }
    },

    // UI – Chromium / Firefox / WebKit
    {
      ...defineBddProject({
        name: 'chromium-ui',
        features: ['src/features/ui/**/*.feature'],
        steps,
        outputDir: '.features-gen/chromium'
      }),
      metadata: { suite: 'UI' },
      use: { ...uiUse, browserName: 'chromium' }
    },
    {
      ...defineBddProject({
        name: 'firefox-ui',
        features: ['src/features/ui/**/*.feature'],
        steps,
        outputDir: '.features-gen/firefox'
      }),
      metadata: { suite: 'UI' },
      use: { ...uiUse, browserName: 'firefox' }
    },
    {
      ...defineBddProject({
        name: 'webkit-ui',
        features: ['src/features/ui/**/*.feature'],
        steps,
        outputDir: '.features-gen/webkit'
      }),
      metadata: { suite: 'UI' },
      use: { ...uiUse, browserName: 'webkit' }
    }
  ],

  globalSetup: './src/setup/global-setup.js',
  globalTeardown: './src/setup/global-teardown.js',

  metadata: {
    'artifact-retention': isCI ? '1-day' : '7-days',
    'cleanup-strategy': 'auto-on-success'
  }
});