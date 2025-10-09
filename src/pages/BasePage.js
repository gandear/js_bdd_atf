export class BasePage {
    constructor(page, logger) {
    this.page = page;
    this.logger = logger;
    this.pageName = this.constructor.name;
  }

  // Deschide fie ruta definită pe clasă (static path), fie una primită ca argument.
  async open(path = this.constructor.path) {
    const rel = String(path || '').replace(/^\/+/, ''); // forțează rută relativă
    if (!rel) throw new Error(`${this.pageName}.path is not set`);

    this.logger?.action?.(`Open ${rel}`, { page: this.pageName });
    await this.page.goto(rel); // rezolvat relativ la baseURL din config
    this.logger?.info?.('Navigation complete', { page: this.pageName, url: this.page.url() });
  }

  async getElementText(selector) {
    this.logger.debug(`Get text from ${selector}`, { page: this.pageName });
    return await this.page.textContent(selector);
  }

  async clickElement(selector) {
    this.logger.action(`Click element: ${selector}`, { page: this.pageName });
    await this.page.click(selector);
  }

  async typeIntoField(selector, text) {
    this.logger.action(`Type into field: ${selector}`, { 
      page: this.pageName, 
      text_length: text.length 
    });
    await this.page.fill(selector, text);
  }

    async isVisible(selector) {
        return await this.page.isVisible(selector);
    }

    async isElementVisible(selector, timeout = 5000) {
        const el = this.page.locator(selector);
        try {
        await el.waitFor({ state: 'visible', timeout });
        return true;
        } catch {
        return false;
        }
    }

    async blur(selector) {
        await this.page.locator(selector).evaluate(e => e.blur());
    }

    // For example, you can now add logging to other methods:
    async getElementText(selector) {
        const text = await this.page.textContent(selector);
        this.logger.info({
        action: 'getElementText',
        page: this.pageName,
        selector,
        text,
    });
        return text;
    } 
}


