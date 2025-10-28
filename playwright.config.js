// playwright.config.js
import dotenv from 'dotenv'; dotenv.config({ quiet: true });
import { defineConfig } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

const isCI = !!process.env.CI;
const steps = ['src/steps/**/*.js', 'src/fixtures/index.js'];

// Separare clară între feature-uri API și UI
const ui_features = ['src/features/ui/**/*.feature'];
const api_features = ['src/features/api/**/*.feature'];

// UI baseURL 
const baseURL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/';

// --- API config ---
const apiBaseURL = (process.env.API_BASE_URL || 'https://reqres.in').replace(/\/$/, '');

// Setări UI comune (compact, CI-friendly)
const uiUse = {
  baseURL,
  locale: 'en-US',
  extraHTTPHeaders: {
    'Accept-Language': 'en-US,en;q=0.9'
  },
  headless: true,
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'off'
};

export default defineConfig({
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 4 : undefined,

  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  outputDir: 'test-results',

  reporter: [
    ['list'],
    ['junit', { 
      outputFile: process.env.PLAYWRIGHT_JUNIT_OUTPUT_NAME || 'junit-results/results.xml' }],
    ['allure-playwright', {
      outputFolder: process.env.ALLURE_RESULTS_DIR || 'allure-results',
      environmentInfo: {
        Environment: process.env.NODE_ENV || 'test',
        'Test Type': 'BDD + Playwright API & UI'
      }
    }],
    ['./src/utils/cleanup-reporter.js']
  ],

  // fallback global (UI proiectele pot suprascrie)
  use: { ...uiUse },

  projects: [
    {
      // API project - doar testele API
      ...defineBddProject({
        name: 'api',
        features: api_features,
        steps,
        outputDir: '.features-gen/api'
      }),
      metadata: { suite: 'API' },
      retries: 0,
      workers: 1,
      use: {
        baseURL: apiBaseURL,
        trace: 'on',
        screenshot: 'off',
        video: 'off'
      }
    },
    
    // === UI – Chromium / Firefox / WebKit - doar testele UI ===
    {
      ...defineBddProject({
        name: 'chromium',
        features: ui_features,
        steps,
        outputDir: '.features-gen/chromium'
      }),
      metadata: { suite: 'UI' },
      use: { ...uiUse, browserName: 'chromium' }
    },
    {
      ...defineBddProject({
        name: 'firefox',
        features: ui_features,
        steps,
        outputDir: '.features-gen/firefox'
      }),
      metadata: { suite: 'UI' },
      use: { ...uiUse, browserName: 'firefox' }
    },
    {
      ...defineBddProject({
        name: 'webkit',
        features: ui_features,
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