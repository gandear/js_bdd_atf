// 1. Updated logger.fixture.js
import { createLogger } from '../utils/logger.js';
import { buildTestName } from '../utils/test-name.js';

export const loggerFixtures = {
  logger: async ({}, use, testInfo) => {
    // Derive browser name from the Playwright project when available (chromium, firefox, webkit)
    const projectName = testInfo?.project?.name || 'project';
    const browserMatch = String(projectName).match(/(chromium|firefox|webkit|api|api-bdd)/i);
    const browser = browserMatch ? browserMatch[1].toLowerCase() : null;

    const logger = createLogger({
      project: projectName,
      browser,
      testName: buildTestName(testInfo, { sep: '_' }),
      test_file: testInfo.file,
    });

    logger.scenario(`Starting: ${testInfo.title}`);
    await use(logger);
    
    logger.scenario(`Finished: ${testInfo.title}`, { 
      status: testInfo.status, 
      duration_ms: testInfo.duration 
    });
    
    await logger.flush();

    // Attach execution log for all tests (passed/failed) with status in filename
    try {
      const status = testInfo.status || 'unknown';
      const name = `execution-${status}.log`;
      if (logger?.filePath) {
        await testInfo.attach(name, {
          path: logger.filePath,
          contentType: 'text/plain',
        });
      }
    } catch (e) {
      // Do not fail the fixture if attach fails
      // eslint-disable-next-line no-console
      console.warn('Failed to attach execution log', e?.message || e);
    }
  },
};