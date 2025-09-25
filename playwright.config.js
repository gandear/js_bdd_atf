// playwright.config.js
import 'dotenv/config';
import { defineConfig } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

const isCI = !!process.env.CI;
const steps = ['src/steps/**/*.js', 'src/fixtures/index.js'];
const baseURL = (process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com').replace(/\/$/, '');

// --- API config (ENV din Jenkins) ---
const apiBaseURL   = process.env.API_BASE_URL || 'https://reqres.in/';
const apiKeyHeader = process.env.API_KEY_HEADER || 'x-api-key';
const apiToken     = process.env.API_TOKEN || '';

// Nu logăm secretul; doar construim header-ele
const apiHeaders = {
  'Content-Type': 'application/json',
  ...(apiToken ? { [apiKeyHeader]: apiToken } : {})
};

<<<<<<< Updated upstream
const uiUse = {
  baseURL,
  headless: true,                 
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'off'
=======
const isCI    = !!process.env.CI;
const isDebug = !!process.env.DEBUG_TESTS;

// headless: în CI mereu true; local doar dacă nu e debug
const headless = isCI ? true : !isDebug;

const baseURL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com';

const artifactStrategies = {
  api: {
    trace: 'off',
    screenshot: 'off',
    video: 'off'
  },
  ui: {
    trace: isDebug ? 'on' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: isDebug ? 'on' : 'retain-on-failure'
  }
>>>>>>> Stashed changes
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
      use: {
        baseURL: apiBaseURL,                 // relativ pentru request-uri
        extraHTTPHeaders: apiHeaders,        // include x-api-key dacă e setat
        trace: 'off', screenshot: 'off', video: 'off'
      }
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
<<<<<<< Updated upstream
      use: { ...uiUse, browserName: 'chromium' }
=======
      use: { browserName: 'chromium', headless, baseURL,...artifactStrategies.ui }
>>>>>>> Stashed changes
    },
    {
      ...defineBddProject({
        name: 'firefox-ui',
        features: ['src/features/ui/**/*.feature'],
        steps,
        outputDir: '.features-gen/firefox'
      }),
      metadata: { suite: 'UI' },
<<<<<<< Updated upstream
      use: { ...uiUse, browserName: 'firefox' }
=======
      use: { browserName: 'firefox', headless, baseURL, ...artifactStrategies.ui }
>>>>>>> Stashed changes
    },
    {
      ...defineBddProject({
        name: 'webkit-ui',
        features: ['src/features/ui/**/*.feature'],
        steps,
        outputDir: '.features-gen/webkit'
      }),
      metadata: { suite: 'UI' },
<<<<<<< Updated upstream
      use: { ...uiUse, browserName: 'webkit' }
=======
      use: { browserName: 'webkit', headless, baseURL,...artifactStrategies.ui }
>>>>>>> Stashed changes
    }
  ],

  globalSetup: './src/setup/global-setup.js',
  globalTeardown: './src/setup/global-teardown.js',

  metadata: {
    'artifact-retention': isCI ? '1-day' : '7-days',
    'cleanup-strategy': 'auto-on-success'
  }
});