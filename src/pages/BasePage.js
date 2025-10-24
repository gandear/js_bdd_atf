export class BasePage {
    constructor(page, logger) {
        this.page = page;
        // Default pageName when not provided by subclass
        this.pageName = this.constructor.name;

        // Use provided logger or page.logger if available. No default noop logger.
        this.logger = logger ?? (page && page.logger);
    }

    // Consolidated: single, robust implementation for getting text from a selector or locator
    async getElementText(elementOrSelector) {
        const locator = typeof elementOrSelector === 'string'
            ? this.page.locator(elementOrSelector)
            : elementOrSelector;

        try {
            const text = await locator.innerText();
            return text?.trim() ?? '';
        } catch (err) {
            // Fallback to textContent for cases where innerText is not available
            const textContent = await locator.textContent();
            return textContent?.trim() ?? '';
        }
    }

    // Deschide fie ruta definită pe clasă (static path), fie una primită ca argument.
    async open(path = this.constructor.path) {
        const rel = String(path || '').replace(/^\/+/, ''); // forțează rută relativă
        if (!rel) throw new Error(`${this.pageName}.path is not set`);

        this.logger?.action?.(`Open ${rel}`, { page: this.pageName });
        await this.page.goto(rel); // rezolvat relativ la baseURL din config
        this.logger?.info?.('Navigation complete', { page: this.pageName, url: this.page.url() });
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
}

export default BasePage;


