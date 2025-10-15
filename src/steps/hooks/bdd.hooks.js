// src/steps/hooks/bdd.hooks.js
import { createBdd } from 'playwright-bdd';

const { Before, After } = createBdd();

Before(async ({ logger, $testInfo }) => {
  try {
    if (logger?.scenario) logger.scenario(`Starting: ${$testInfo.title}`);
  } catch (e) {
    // don't break tests if logger fails
    // eslint-disable-next-line no-console
    console.warn('Before hook logger failed', e?.message || e);
  }
});

After(async ({ $testInfo, page, logger }) => {
  try {
    if (logger?.scenario) logger.scenario(`Finished: ${$testInfo.title}`, { status: $testInfo.status });

    if ($testInfo.status !== 'passed') {
      if (page) {
        try {
          const buffer = await page.screenshot({ fullPage: true });
          await $testInfo.attach('screenshot.png', { body: buffer, contentType: 'image/png' });
          logger?.info?.('Attached screenshot to report');
        } catch (e) {
          logger?.warn?.('Screenshot capture failed', { err: e?.message });
        }
      }

      if (logger?.filePath) {
        try {
          await $testInfo.attach('execution.log', { path: logger.filePath, contentType: 'text/plain' });
        } catch (e) {
          logger?.warn?.('Attaching execution.log failed', { err: e?.message });
        }
      }
    }
  } catch (e) {
    // ensure teardown doesn't throw
    // eslint-disable-next-line no-console
    console.warn('After hook failure', e?.message || e);
  }
});
