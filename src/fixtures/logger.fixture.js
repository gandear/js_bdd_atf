// src/fixtures/logger.fixture.js 

import createLogger from '../utils/logger.js';
import { buildTestName } from '../utils/test-name.js';

export const loggerFixtures = {
  logger: [
    async ({}, use, testInfo) => {
      const projectName = testInfo.project?.name || 'project'; 
      const browser = testInfo.project?.use?.browserName ||
                      (projectName === 'api' ? 'api' : 'project');
                      (projectName === 'api' ? 'api' : 'project'); 

      const scenarioLogger = createLogger({
        project: projectName,
        browser: browser, 
        testName: buildTestName(testInfo, { sep: '_' }),
        test_file: testInfo.file,
        level: process.env.LOG_LEVEL || 'info',
      });

      scenarioLogger.scenario(`Starting: ${testInfo.title}`);

      await use(scenarioLogger);

      scenarioLogger.scenario(`Finished: ${testInfo.title}`, {
        status: testInfo.status,
        duration_ms: testInfo.duration,
      });

      await scenarioLogger.flush();
    },
    { scope: 'test' },
  ],
};