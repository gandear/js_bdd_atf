// src/steps/hooks/bdd.hooks.js
import { createBdd } from 'playwright-bdd';

const { Before, After } = createBdd();

Before(async ({ logger, testInfo }) => {
  // intenționat gol: START e logat în fixture
});

After(async ({ logger, page, testInfo }) => {
  try {
    // guard defensiv: în unele scenarii (ex. API) page poate lipsi
    if (testInfo?.status !== 'passed' && page?.screenshot) {
      try {
        const buffer = await page.screenshot({ fullPage: true });
        await testInfo.attach('screenshot.png', { body: buffer, contentType: 'image/png' });
        logger?.info?.('Attached screenshot to report');
      } catch (e2) {
        logger?.warn?.('Screenshot capture failed', { err: e2?.message });
      }
    }

    // attach log-ul per-scenariu, dacă există
    try {
      if (logger?.filePath && testInfo?.attach) {
        await testInfo.attach('execution.log', {
          path: logger.filePath,
          contentType: 'text/plain',
        });
      }
    } catch (e2) {
      logger?.warn?.('Attaching execution.log failed', { err: e2?.message });
    }
  } catch (e) {
    console.warn('After hook failure', e?.message || e);
  }
});
