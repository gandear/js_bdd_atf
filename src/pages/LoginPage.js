import { BasePage } from './BasePage.js';
import { routes } from '../config/routes.js';

export class LoginPage extends BasePage {
  static path = routes.login; // ex. 'web/index.php/auth/login'

    constructor(page, logger) {
        super(page, logger);

        this.usernameField = 'input[name="username"]';
        this.passwordField = 'input[name="password"]';
        this.loginButton = 'button[type="submit"]';

        this.errorBannerContainer = '.oxd-alert-content';
        this.errorBannerText      = '.oxd-alert-content-text';

        this.requiredFieldError   = '.oxd-input-group__message';
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

    // Trigger blur pentru validări
    await this.page.click(this.usernameField);
    await this.page.click(this.passwordField);
    
    this.logger.action('Submit login form');
    await this.clickElement(this.loginButton);
  }

  // Banner text (ex: "Invalid credentials")
  async getBannerErrorText() {
    if (!(await this.isElementVisible(this.errorBannerContainer, 1500))) return '';
    return await this.getElementText(this.errorBannerText);
  }

  // Toate mesajele "Required" vizibile
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