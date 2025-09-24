// 1. Updated logger.fixture.js
import { createLogger } from '../utils/logger.js';
import { buildTestName } from '../utils/test-name.js';

export const loggerFixtures = {
  log: async ({}, use, testInfo) => {
    const logger = createLogger({
      project: testInfo.project.name,
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
    
    await testInfo.attach('execution.log', {
      path: logger.filePath,
      contentType: 'text/plain',
    });
  },
};