import { Locator, Page, expect } from '@playwright/test';

export default class LoginPage {
  page: Page;

  // Login
  loginBtn: Locator;
  emailInput: Locator;
  passwordInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByLabel('Email or phone');
    this.passwordInput = page.getByLabel('Enter your password');
    this.loginBtn = page.getByRole('button', { name: 'Log in' });
  }

  async loginToApplication(email: string, password: string) {
    await this.emailInput.pressSequentially(email, { delay: 250 });
    await this.page.keyboard.press('Enter');
    await expect(this.passwordInput).toBeVisible({ timeout: 60000 });
    await this.passwordInput.pressSequentially(password, { delay: 250 });
    const responsePromise = this.page.waitForResponse(process.env.GRAPHQL_ENDPOINT);
    await this.page.keyboard.press('Enter');
    const response = await responsePromise;
    const responseJson = await response.json();
    const memberId = responseJson.data?.findMember?._id;
    return memberId;
  }

  async clickLogin() {
    await this.loginBtn.click();
  }
}
