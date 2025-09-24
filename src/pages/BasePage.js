export class BasePage {
    constructor(page, logger) {
    this.page = page;
    this.log = logger;
    this.pageName = this.constructor.name;
  }

  async navigateTo(url) {
    this.log.action(`Navigate to ${url}`, { page: this.pageName });
    
    await this.page.goto(url);
    
    this.log.info(`Navigation complete`, { page: this.pageName, url: this.page.url() });
  }

  async getElementText(selector) {
    this.log.debug(`Get text from ${selector}`, { page: this.pageName });
    return await this.page.textContent(selector);
  }

  async clickElement(selector) {
    this.log.action(`Click element: ${selector}`, { page: this.pageName });
    await this.page.click(selector);
  }

  async typeIntoField(selector, text) {
    this.log.action(`Type into field: ${selector}`, { 
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
        this.log.info({
        action: 'getElementText',
        page: this.pageName,
        selector,
        text,
    });
        return text;
    } 
}


