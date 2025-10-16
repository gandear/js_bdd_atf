// src/pages/LoginPage.js
import { BasePage } from './BasePage.js';
import { routes } from '../config/routes.js';

export class LoginPage extends BasePage {
  static path = routes.login;

  constructor(page, logger) {
    super(page, logger);
    this.usernameField = 'input[name="username"]';
    this.passwordField = 'input[name="password"]';
    this.loginButton = 'button[type="submit"]';
    this.errorBannerContainer = '.oxd-alert-content';
    this.errorBannerText = '.oxd-alert-content-text';
    this.requiredFieldError = '.oxd-input-group__message';
  }

  // Enhanced open with retry logic
  async open(retries = 3) {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        this.logger.step(`Navigate to login page (attempt ${i + 1}/${retries})`);
        await this.page.goto(this.constructor.path, { waitUntil: 'networkidle' });
        await this.page.waitForSelector(this.usernameField, { timeout: 5000 });
        this.logger.info('Login page loaded successfully', { url: this.page.url() });
        return;
      } catch (e) {
        lastError = e;
        this.logger.warn(`Navigation attempt ${i + 1} failed`, { error: e.message });
        if (i < retries - 1) await this.page.waitForTimeout(1000);
      }
    }
    this.logger.error('Navigation failed after retries', { error: lastError.message });
    throw lastError;
  }

  async login(username, password) {
    this.logger.step(`Login attempt with username: ${username}`);
    
    if (username !== undefined) {
      await this.typeIntoField(this.usernameField, username);
      this.logger.debug('Username entered');
    }
    
    if (password !== undefined) {
      await this.typeIntoField(this.passwordField, password);
      this.logger.debug('Password entered');
    }

    // Trigger blur for validations
    await this.page.click(this.usernameField);
    await this.page.click(this.passwordField);
    
    this.logger.action('Submit login form');
    await this.clickElement(this.loginButton);
    
    // Wait for response (navigation or error message)
    // await Promise.race([
    //   this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 }).catch(() => null),
    //   this.page.waitForSelector(this.errorBannerContainer, { timeout: 3000 }).catch(() => null)
    // ]);

   await Promise.race([
     this.page.waitForURL(/dashboard/, { timeout: 5000 }).catch(() => null),
     this.page.waitForSelector(this.errorBannerContainer, { timeout: 3000 }).catch(() => null)
   ]);

  }

  // Get error context (banner + field errors)
  async getErrorMessageContext() {
    const banner = await this.getBannerErrorText();
    const required = await this.getRequiredFieldErrors();
    return { banner, required };
  }

  async getBannerErrorText() {
    if (!(await this.isElementVisible(this.errorBannerContainer, 1500))) return '';
    return (await this.getElementText(this.errorBannerText))?.trim() || '';
  }

  async getRequiredFieldErrors() {
    const items = this.page.locator(this.requiredFieldError);
    const count = await items.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const t = (await items.nth(i).textContent())?.trim();
      if (t) texts.push(t);
    }
    return texts;
  }

  async isInvalidCredentialsErrorDisplayed() {
    const text = await this.getBannerErrorText();
    return /invalid credentials/i.test(text);
  }
}