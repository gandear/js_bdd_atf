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

  async open() {
    this.logger.step('Navigate to login page');
    
    await this.page.goto(this.constructor.path, { 
      waitUntil: 'domcontentloaded',
      timeout: 30000 // default was 10000 ms, but now is set as 30000 ms to avoid timeout issues
    });
    
    await this.page.waitForSelector(this.usernameField, { 
      state: 'visible',
      timeout: 5000 
    });
    
    this.logger.info('Login page loaded', { url: this.page.url() });
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

    await this.page.click(this.usernameField);
    await this.page.click(this.passwordField);
    
    this.logger.action('Submit login form');
    await this.clickElement(this.loginButton);
    
    // ✅ Wait for result BEFORE returning
    const result = await this.waitForLoginResult();
    this.logger.info('Login completed', result);
  }

  async waitForLoginResult() {
    try {
      // ✅ Explicit wait for ONE of these outcomes
      const result = await Promise.race([
        // Success: dashboard URL
        this.page.waitForURL(/dashboard/, { timeout: 6000 })
          .then(() => ({ type: 'success', url: this.page.url() })),
        
        // Error: banner visible AND text loaded
        this.page.waitForSelector(this.errorBannerText, { // ✅ Wait for TEXT, not container
          state: 'visible', 
          timeout: 6000 
        }).then(async () => {
          const text = await this.page.textContent(this.errorBannerText);
          return { type: 'error', message: text?.trim() };
        }),
        
        // Validation: required field errors
        this.page.waitForSelector(this.requiredFieldError, { 
          state: 'visible', 
          timeout: 6000 
        }).then(() => ({ type: 'validation' })),
      ]);
      
      this.logger.info('Login result detected', result);
      return result;
      
    } catch (e) {
      this.logger.error('Login result timeout', { 
        error: e.message,
        url: this.page.url() 
      });
      throw new Error(`Login timeout: ${e.message}`);
    }
  }

  async getBannerErrorText() {
    if (!(await this.isElementVisible(this.errorBannerContainer, 500))) {
      return '';
    }
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
}