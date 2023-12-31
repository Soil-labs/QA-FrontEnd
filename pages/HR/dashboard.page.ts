import { Locator, Page, expect } from '@playwright/test';
import { threeDotsOptions } from 'type/types';

export default class DashboardPage {
  page: Page;

  addOpportunityBtn: Locator;
  opportunityTitle: Locator;
  opportunityDescription: Locator;
  submitBtn: Locator;

  threeDotsIcon: Locator;
  copyIcon: Locator;
  linkInputField: Locator;

  // Navigation
  expandIcon: Locator;
  collpaseIcon: Locator;

  constructor(page: Page) {
    this.page = page;

    this.addOpportunityBtn = page.locator('text=Add Opportunity');
    this.opportunityTitle = page.getByPlaceholder('Write a title');
    this.opportunityDescription = page.getByPlaceholder('This is a sample text...');
    this.submitBtn = page.getByRole('button', { name: 'Submit' });

    this.threeDotsIcon = page.locator('.absolute > div > .flex > svg').first();
    this.copyIcon = page
      .getByRole('cell', { name: 'sleeping dashboard' })
      .getByRole('button');
    this.linkInputField = page.locator('input[type=text]');

    // Navigation
    this.expandIcon = page.getByRole('navigation').getByRole('img').first();
  }

  async clickOnAddOpportunity(option: 'main' | 'navigation' = 'navigation') {
    option == 'main'
      ? await this.addOpportunityBtn.nth(1).click()
      : await this.addOpportunityBtn.nth(0).click();
  }

  async launchOpportunity(title: string, description: string) {
    await this.page.waitForSelector('text=Launch opportunity');
    await this.opportunityTitle.fill(title);
    await this.opportunityDescription.fill(description);
    await this.submitBtn.click();
  }

  async copyLink() {
    const link = await this.linkInputField.inputValue();
    await this.copyIcon.click();
    return link;
  }

  async actOnNavigationBar(actType: 'collpase' | 'expand') {
    await this.expandIcon.click();
  }

  async verifyJobVisibility(
    title: string,
    status: 'Published' | 'Not Published' | 'Deleted'
  ) {
    const jobStatus =
      status == 'Published'
        ? 'Unpublish from Developer DAO'
        : status == 'Not Published'
          ? 'Publish to Developer DAO'
          : "DELETED";
    await expect(this.page.getByRole('heading', { name: title })).toBeVisible();
    status != 'Deleted' && await expect(this.page.getByRole('link', { name: title })).toBeVisible();
    await expect(this.page.locator(`:text("${jobStatus}"):near(h1:text("${title}"))`).first()).toBeVisible()
  }

  async selectOptionFromThreeDots(option: threeDotsOptions) {
    await this.threeDotsIcon.click();
    await this.page.getByText(option).click();
    await this.page.waitForTimeout(2500);
  }
}
