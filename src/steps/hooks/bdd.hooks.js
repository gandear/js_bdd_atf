// src/steps/hooks/bdd.hooks.js
import { createBdd } from 'playwright-bdd';
const { Before, After } = createBdd();

// Before('@ui', async () => {}) // rămâne gol

After('@ui', async ({ logger, page, testInfo }) => {
  try {
    if (testInfo.status !== 'passed' && page?.screenshot) {
      try {
        const buffer = await page.screenshot({ fullPage: true });
        await testInfo.attach('screenshot.png', { body: buffer, contentType: 'image/png' });
      } catch (e2) {
        logger?.warn?.('Screenshot capture failed', { err: e2?.message });
      }
    }
    if (logger?.filePath && testInfo?.attach) {
      await testInfo.attach('execution.log', { path: logger.filePath, contentType: 'text/plain' });
    }
  } catch (e) {
    console.warn('After hook failure', e?.message || e);
  }
});

