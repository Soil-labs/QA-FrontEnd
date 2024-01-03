import { Locator, Page, expect } from '@playwright/test';
import { verifyToasterMessage } from '@utils/assertions';
import { CONFIGURE_INTERVIEW_TABS, CONFIGURE_INTERVIEW_TAB_HEADERS } from 'data/pageData/HR/configurejob.data';
import { TOASTER_MESSAGES } from 'data/pageData/toasterMessages';
import { FUNDINGS, SOCIAL_LINKS, TAGS } from 'data/testData/HR/configurejob.data';

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

  // Configure interview with AI
  nextBtn: Locator;
  saveAndContinueBtn: Locator;
  letsMoveOnBtn: Locator;
  twitterLinkInput: Locator;
  githubLinkInput: Locator;
  linkedinLinkInput: Locator;
  customLinkInput: Locator;

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

    // Configure interview with AI
    this.nextBtn = page.getByRole('button', { name: 'Next' }).first();
    this.saveAndContinueBtn = page.getByRole('button', { name: 'Continue' });
    this.letsMoveOnBtn = page.getByRole('button', { name: 'Let\'s move on' });
    this.twitterLinkInput = page.locator('input#link-twitter');
    this.githubLinkInput = page.locator('input#link-github');
    this.linkedinLinkInput = page.locator('input#link-linkedin');
    this.customLinkInput = page.locator('input#link-custom');
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

  async saveAsDraft(interviewConfig: 'auto' | 'manual') {
    await this.saveAsDraftBtn.click();
    (interviewConfig == 'manual') ?
      await this.configureInterviewWithManually(
        CONFIGURE_INTERVIEW_TABS, CONFIGURE_INTERVIEW_TAB_HEADERS
      ) : await this.autoConfigure.click();
    await this.page.waitForURL('**/dashboard/**');
  }

  async publishJob(interviewConfig: 'auto' | 'manual') {
    await this.publishBtn.click();
    await this.page.getByRole('button', { name: "Let's do it!" }).click();
    (interviewConfig == 'manual') ?
      await this.configureInterviewWithManually(
        CONFIGURE_INTERVIEW_TABS, CONFIGURE_INTERVIEW_TAB_HEADERS
      ) : await this.autoConfigure.click();
    await this.page.waitForURL('**/dashboard/**');
  }

  async configureInterviewWithManually(tabs: string[], headers: object) {
    const TOTAL_TABS = tabs.length;
    await this.configureManually.click();
    for (let tabIndex = 0; tabIndex < TOTAL_TABS; tabIndex++) {
      const TAB_NAME = tabs[tabIndex];
      const TAB_HEADERS = headers[TAB_NAME];
      await this.verifyAndCompleteTab(TAB_NAME, TAB_HEADERS);
      await this.navigateInterviewSetup(TAB_NAME);
    }
  }

  async verifyAndCompleteTab(tabName: string, tab_headers: string[]) {
    await expect(
      this.page.getByText(tabName, { exact: true })
    ).toBeVisible()
    await this.verifyHeaders(tab_headers)
    tabName == 'ALIGNMENT' && await this.verifyQuestions(tab_headers);
    tabName == 'EDEN SUGGESTIONS' && await this.verifyQuestions(tab_headers);
    tabName == 'FINAL DETAILS' && await this.completeFinalDetailsTab();
  }

  async navigateInterviewSetup(tabName: string) {
    if (tabName == 'EDEN CONVO') {
      await this.nextBtn.click();
      await this.letsMoveOnBtn.click();
    } else {
      await this.saveAndContinueBtn.click();
    }
  }

  async verifyHeaders(headers: string[]) {
    const totalHeaders = headers.length;
    for (let headerIndex = 0; headerIndex < totalHeaders; headerIndex++) {
      await this.page.getByText(headers[headerIndex], { exact: true }).click();
      await expect(this.page.getByText(headers[headerIndex], { exact: true })).toBeVisible();
    }
  }

  async verifyQuestions(tabsHeaders: string[]) {
    const questionLocator = this.page.getByTitle("content");
    let totalQuestion = 0;
    const totalTabs = tabsHeaders.length;
    for (let tabIndex = 0; tabIndex < totalTabs; tabIndex++) {
      const TAB_HEADER = tabsHeaders[tabIndex];
      await this.page.getByText(TAB_HEADER, { exact: true }).click();
      const questionCount = await questionLocator.count();
      totalQuestion += questionCount;
      console.log(`Question Count - ${TAB_HEADER} : ` + questionCount);
    }

    console.log("Total Question: " + totalQuestion);

    if (totalQuestion == 0) {
      throw new Error('No question found');
    }

  }

  async completeFinalDetailsTab() {
    await this.twitterLinkInput.fill(SOCIAL_LINKS.custom);
    await this.githubLinkInput.fill(SOCIAL_LINKS.github);
    await this.linkedinLinkInput.fill(SOCIAL_LINKS.linkedin);
    await this.customLinkInput.fill(SOCIAL_LINKS.custom);
  }
}
