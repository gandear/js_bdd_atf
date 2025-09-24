// playwright.config.js - Configurație optimizată și funcțională
import dotenv from 'dotenv';
import { defineConfig } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

dotenv.config({ quiet: true });

const steps = ['src/steps/**/*.js', 'src/fixtures/index.js'];

// Environment-based artifact strategy
const isCI = process.env.CI;
const isDev = process.env.NODE_ENV === 'development';
const isDebug = process.env.DEBUG_TESTS;

const artifactStrategies = {
  api: {
    // API tests - minimal artifacts for performance
    trace: 'off',
    screenshot: 'off', 
    video: 'off'
  },
  ui: {
    // UI tests - conditional artifacts based on environment
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

  // Smart outputDir management
  outputDir: isCI ? null : './test-results',
  
  // Enhanced reporting with cleanup
  reporter: [
    ['list'], 
    ['allure-playwright', { 
      outputDir: 'allure-results',
      environmentInfo: {
        Environment: process.env.NODE_ENV || 'test',
        'Test Type': 'BDD + Playwright API & UI'
      }
    }],
    ['./src/utils/cleanup-reporter.js']
  ],

  // Global fallback settings
  use: { 
    headless: !isDebug,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
  // API Tests  
  {
    ...defineBddProject({
      name: 'api-bdd',
      features: ['src/features/api/**/*.feature'],
      steps,
      outputDir: '.features-gen/api',
    }),
    metadata: { suite: 'API' },
    use: { ...artifactStrategies.api }
  },
  
  // UI Tests - Chromium (default)
  {
    ...defineBddProject({
      name: 'chromium-ui',
      features: ['src/features/ui/**/*.feature'], 
      steps,
      outputDir: '.features-gen/chromium',
    }),
    metadata: { suite: 'UI' },
    use: { browserName: 'chromium', ...artifactStrategies.ui }
  },
  
  // UI Tests - Firefox (generate always, use conditionally)
  {
    ...defineBddProject({
      name: 'firefox-ui',
      features: ['src/features/ui/**/*.feature'],
      steps, 
      outputDir: '.features-gen/firefox',
    }),
    metadata: { suite: 'UI' },
    use: { browserName: 'firefox', ...artifactStrategies.ui }
  },
  
  // UI Tests - WebKit (generate always, use conditionally)
  {
    ...defineBddProject({
      name: 'webkit-ui', 
      features: ['src/features/ui/**/*.feature'],
      steps,
      outputDir: '.features-gen/webkit',
    }),
    metadata: { suite: 'UI' },
    use: { browserName: 'webkit', ...artifactStrategies.ui }
  }
],

  // Metadata for artifact management
  metadata: {
    'artifact-retention': isCI ? '1-day' : '7-days',
    'cleanup-strategy': 'auto-on-success'
  }
});