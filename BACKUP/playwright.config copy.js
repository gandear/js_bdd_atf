// playwright.config.js
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
    // API tests - minimal artifacts
    trace: 'off',
    screenshot: 'off', 
    video: 'off'
  },
  ui: {
    // UI tests - conditional artifacts
    trace: isDebug ? 'on' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: isDebug ? 'on' : 'retain-on-failure'
  }
};

const createUiBddProject = (name, browserName, outputDir) => ({
  ...defineBddProject({
    name,
    features: ['src/features/ui/**/*.feature'],
    steps,
    outputDir,
  }),
  metadata: { suite: 'UI' },
  use: { 
    browserName,
    ...artifactStrategies.ui,
    // UI specific settings
    headless: !isDebug,
  },
  // Separate test-results per browser to avoid conflicts
  testDir: undefined,
  outputDir: isCI ? null : `./test-results/ui/${browserName}`,
});

const createApiBddProject = (name, outputDir) => ({
  ...defineBddProject({
    name,
    features: ['src/features/api/**/*.feature'],
    steps,
    outputDir,
  }),
  metadata: { suite: 'API' },
  use: {
    ...artifactStrategies.api,
    // API specific settings
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
  },
  testDir: undefined,
  outputDir: isCI ? null : './test-results/api',
});

export default defineConfig({
  globalSetup: './src/setup/global-setup.js',
  globalTeardown: './src/setup/global-teardown.js',
  
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,

  // Global outputDir - will be overridden by individual projects
  outputDir: isCI ? null : './test-results',
  
  // Enhanced reporting strategy
  reporter: [
    ['list'], 
    ['allure-playwright', { 
      outputDir: 'allure-results',
      // Cleanup allure results for successful API tests
      environmentInfo: {
        Environment: process.env.NODE_ENV || 'test',
        'Test Type': 'BDD + Playwright'
      }
    }],
    // Custom cleanup reporter
    ['./src/utils/cleanup-reporter.js']
  ],

  // Global use settings (will be overridden by project-specific settings)
  use: { 
    headless: !isDebug,
    // Global fallback settings
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    // UI Tests - Full browser support
    createUiBddProject('chromium-ui', 'chromium', '.features-gen/chromium'),
    createUiBddProject('firefox-ui', 'firefox', '.features-gen/firefox'),
    createUiBddProject('webkit-ui', 'webkit', '.features-gen/webkit'),
    
    // API Tests - No browser, minimal artifacts
    createApiBddProject('api-bdd', '.features-gen/api'),
  ],

  // Global settings for artifact management
  metadata: {
    'artifact-retention': isCI ? '1-day' : '7-days',
    'cleanup-strategy': 'auto-on-success'
  }
});