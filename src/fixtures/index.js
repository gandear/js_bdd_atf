// src/fixtures/index.js
import { test as base } from 'playwright-bdd';
import { expect } from '@playwright/test';

import { testInfoFixture } from './testinfo.fixture.js'; 
import { loggerFixtures } from './logger.fixture.js';
import { uiFixtures } from './ui.fixture.js';
import { apiFixtures } from './api.fixture.js';

export const test = base
  .extend(testInfoFixture)
  .extend(loggerFixtures)
  .extend(uiFixtures)
  .extend(apiFixtures);

export { expect };
