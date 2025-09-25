// playwright.config.js
import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

dotenv.config({ quiet: true });

const steps = ['src/steps/**/*.js', 'src/fixtures/index.js'];

const isCI    = !!process.env.CI;
const isDebug = !!process.env.DEBUG_TESTS;

// headless: în CI mereu true; local doar dacă nu e debug
const headless = isCI ? true : !isDebug;

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
};

export default defineConfig({
  globalSetup: './src/setup/global-setup.js',
  globalTeardown: './src/setup/global-teardown.js',

  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,

  outputDir: './test-results',

  reporter: [
    ['list'],
    ['allure-playwright', {
      outputFolder: process.env.ALLURE_RESULTS_DIR || 'allure-results',
      environmentInfo: {
        Environment: process.env.NODE_ENV || 'test',
        'Test Type': 'BDD + Playwright API & UI'
      }
    }],
    ['./src/utils/cleanup-reporter.js']
  ],

  // fallback global (UI proiectele pot override)
  use: {
    headless,                     // ⬅ garantat headless în CI
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    // API
    {
      ...defineBddProject({
        name: 'api-bdd',
        features: ['src/features/api/**/*.feature'],
        steps,
        outputDir: '.features-gen/api'
      }),
      metadata: { suite: 'API' },
      use: { ...artifactStrategies.api }   // headless nu e relevant la API
    },

    // UI - Chromium
    {
      ...defineBddProject({
        name: 'chromium-ui',
        features: ['src/features/ui/**/*.feature'],
        steps,
        outputDir: '.features-gen/chromium'
      }),
      metadata: { suite: 'UI' },
      use: { browserName: 'chromium', headless, ...artifactStrategies.ui }
    },

    // UI - Firefox
    {
      ...defineBddProject({
        name: 'firefox-ui',
        features: ['src/features/ui/**/*.feature'],
        steps,
        outputDir: '.features-gen/firefox'
      }),
      metadata: { suite: 'UI' },
      use: { browserName: 'firefox', headless, ...artifactStrategies.ui }
    },

    // UI - WebKit
    {
      ...defineBddProject({
        name: 'webkit-ui',
        features: ['src/features/ui/**/*.feature'],
        steps,
        outputDir: '.features-gen/webkit'
      }),
      metadata: { suite: 'UI' },
      use: { browserName: 'webkit', headless, ...artifactStrategies.ui }
    }
  ],

  metadata: {
    'artifact-retention': isCI ? '1-day' : '7-days',
    'cleanup-strategy': 'auto-on-success'
  }
});
