import { Locator, Page, expect } from '@playwright/test';

export default class JobsPage {
  page: Page;
  postMagicJobBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.postMagicJobBtn = page.getByRole('button', { name: 'Post a magic job' });
  }

  async clickOnPostMaigcJob() {
    await this.postMagicJobBtn.click();
  }
}
