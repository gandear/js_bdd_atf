// src/steps/hooks/bdd.hooks.js
import { createBdd } from 'playwright-bdd';
const { Before, After } = createBdd();

/**
 * Enforce authentication for @secure scenarios
 */
Before('@secure', async ({ api, logger }) => {
  if (!api?.headersManager?.token) {
    logger?.error('Auth required but token missing');
    throw new Error(
      'Scenario tagged @secure requires authentication. ' +
      'Ensure "Given I am logged in as a valid user" runs in Background.'
    );
  }
  logger?.debug('Auth token verified for @secure scenario');
});

/**
 * UI test cleanup: screenshots and logs on failure
 */
After('@ui', async ({ logger, page, testInfo }) => {
  try {
    // Capture screenshot on failure
    if (testInfo.status !== 'passed' && page?.screenshot) {
      try {
        const buffer = await page.screenshot({ fullPage: true });
        await testInfo.attach('screenshot.png', { 
          body: buffer, 
          contentType: 'image/png' 
        });
        
        // Capture HTML for debugging
        const html = await page.content();
        await testInfo.attach('page.html', { 
          body: html, 
          contentType: 'text/html' 
        });
        
      } catch (e2) {
        logger?.warn?.('Screenshot capture failed', { err: e2?.message });
      }
    }
    
    // Attach execution log
    if (logger?.filePath && testInfo?.attach) {
      await testInfo.attach('execution.log', { 
        path: logger.filePath, 
        contentType: 'text/plain' 
      });
    }
  } catch (e) {
    console.warn('After hook failure', e?.message || e);
  }
});