import { createBdd } from 'playwright-bdd';
const { Before, After } = createBdd();

After('@ui', async ({ logger, page, testInfo }) => {
  try {
    // ✅ Always capture screenshot on failure
    if (testInfo.status !== 'passed' && page?.screenshot) {
      try {
        const buffer = await page.screenshot({ fullPage: true });
        await testInfo.attach('screenshot.png', { 
          body: buffer, 
          contentType: 'image/png' 
        });
        
        // ✅ Also capture HTML for debugging
        const html = await page.content();
        await testInfo.attach('page.html', { 
          body: html, 
          contentType: 'text/html' 
        });
        
      } catch (e2) {
        logger?.warn?.('Screenshot capture failed', { err: e2?.message });
      }
    }
    
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