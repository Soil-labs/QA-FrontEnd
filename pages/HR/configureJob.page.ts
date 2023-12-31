import { Locator, Page, expect } from '@playwright/test';
import { verifyToasterMessage } from '@utils/assertions';
import { TOASTER_MESSAGES } from 'data/pageData/toasterMessages';
import { FUNDINGS, TAGS } from 'data/testData/HR/configurejob.data';

export default class ConfigureJobPage {
  page: Page;

  // Configure Job Page
  jobTitle: Locator;
  contractType: Locator;
  minSalary: Locator;
  maxSalary: Locator;
  officeLocation: Locator;
  companyLogo: Locator;
  companyDescription: Locator;
  employeesNumber: Locator;
  officePolicy: Locator;
  addTagIcon: Locator;
  addFundingIcon: Locator;
  askEdenAboutOpportunityLink: Locator;

  // Submit
  shareJobLink: Locator;
  reportProblemLink: Locator;
  referLink: Locator;
  publishBtn: Locator;
  saveAsDraftBtn: Locator;
  configureManually: Locator;
  autoConfigure: Locator;

  constructor(page: Page) {
    this.page = page;

    // Configure Job Page
    this.jobTitle = page.locator('input[name="name"]');
    this.contractType = page.locator('select[name="generalDetails\\.contractType"]');
    this.minSalary = page.getByPlaceholder('min salary');
    this.maxSalary = page.getByPlaceholder('max salary');
    this.officeLocation = page.locator('input[name="generalDetails\\.officeLocation"]');
    this.companyLogo = page.locator('label[for=file-upload]');
    this.companyDescription = page.locator('textarea[name="company\\.description"]');
    this.employeesNumber = page.locator('input[name="company\\.employeesNumber"]');
    this.officePolicy = page.locator('select[name="generalDetails\\.officePolicy"]');
    this.officePolicy.selectOption('hybrid-4-day-office');
    this.addTagIcon = page.getByText('+').first();
    this.addFundingIcon = page.getByText('+').nth(1);
    this.askEdenAboutOpportunityLink = page.locator('div').filter({ hasText: /^Ask Eden about this opportunity$/ });

    // Submit
    this.shareJobLink = page.locator('div').filter({ hasText: /^Share this job$/ });
    this.reportProblemLink = page.locator('div').filter({ hasText: /^Report a problem with this job$/ });
    this.referLink = page.locator('div').filter({ hasText: /^Refer someone & get paid$/ });
    this.publishBtn = page.getByRole('button', { name: 'Publish' });
    this.saveAsDraftBtn = page.getByRole('button', { name: 'Save as draft' });
    this.autoConfigure = page.getByRole('button', { name: 'Auto-configure the AI-' });
    this.configureManually = page.getByRole('button', {
      name: 'Let me configure the AI-',
    });
  }

  async validatePage(jobTitle: string, pageHeaders: string[]) {
    await this.page.waitForURL("**/jobs/**")
    expect(await this.jobTitle.inputValue()).toBe(jobTitle);
    const headings = pageHeaders;
    const totalHeadings = headings.length;
    for (let headingIndex = 0; headingIndex < totalHeadings; headingIndex++) {
      await expect(
        this.page.getByRole('heading', { name: headings[headingIndex], exact: true })
      ).toBeVisible();
    }
    await this.shareJobLink.click();
    await verifyToasterMessage(this.page, TOASTER_MESSAGES.jobLinkCopied)
    await expect(this.reportProblemLink).toBeVisible();
    await expect(this.referLink).toBeVisible();
  }

  async configureJob() {
    await this.contractType.selectOption('Full-time');
    await this.minSalary.click();
    await this.page.keyboard.type('30000');
    await this.maxSalary.click();
    await this.page.keyboard.type('80000');
    await this.uploadCompanyLogo();
    await this.employeesNumber.fill('55');
    await this.officePolicy.selectOption('hybrid-4-day-office');
    await this.officeLocation.fill('New York');
    await this.companyDescription.fill('This is a company description');
    await this.removeAllTagsAndFundings();
    await this.addTags();
    await this.addFundings();
  }

  async uploadCompanyLogo() {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.companyLogo.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('assets/clogo.png');
  }

  async addTags() {
    const tags = TAGS;
    const totalTags = tags.length;
    for (let tagIndex = 0; tagIndex < totalTags; tagIndex++) {
      await this.addTagIcon.click();
      await this.page
        .locator(`input[name="company\\.tags\\.${tagIndex}"]`)
        .fill(tags[tagIndex]);
    }
  }

  async addFundings() {
    const fundings = FUNDINGS;
    const totalFundings = fundings.length;
    for (let fundingIndex = 0; fundingIndex < totalFundings; fundingIndex++) {
      await this.addFundingIcon.click();
      await this.page
        .locator(`input[name="company\\.funding\\.${fundingIndex}\\.date"]`)
        .fill(fundings[fundingIndex].date);
      await this.page
        .locator(`input[name="company\\.funding\\.${fundingIndex}\\.amount"]`)
        .fill(fundings[fundingIndex].amount);
      await this.page
        .locator(`input[name="company\\.funding\\.${fundingIndex}\\.name"]`)
        .fill(fundings[fundingIndex].series);
    }
  }

  async removeAllTagsAndFundings() {
    const removeIcon = this.page.getByText('-', { exact: true });
    const totalRemoveIcon = await removeIcon.count()
    for (let i = 0; i < totalRemoveIcon; i++) {
      await removeIcon.nth(0).click();
    }
    expect(await removeIcon.count()).toBe(0);
  }

  async saveAsDraft() {
    await this.saveAsDraftBtn.click();
    await this.autoConfigure.click();
  }

  async publishJob() {
    await this.publishBtn.click();
    await this.page.getByRole('button', { name: "Let's do it!" }).click();
    await this.autoConfigure.click();
    await this.page.waitForURL('**/dashboard/**');
  }
}
