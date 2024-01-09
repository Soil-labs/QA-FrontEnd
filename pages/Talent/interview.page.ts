import { Locator, Page, expect } from "@playwright/test";

export default class InterviewPage {
  page: Page

  uploadResumeBtn: Locator;
  nextBtn: Locator;
  checkBox: Locator;
  startInterviewBtn: Locator;
  letsDothisNowBtn: Locator;
  finishInterviewBtn: Locator;

  salaryInputField: Locator;
  workingHoursInputField: Locator;
  locationInputField: Locator;
  timezoneSelect: Locator;
  expYearsInputField: Locator;
  expLevelSelect: Locator;
  submitApplicationBtn: Locator;
  sendAgainBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    this.uploadResumeBtn = page.getByText('Upload Your Resume');
    this.nextBtn = page.getByRole('button', { name: 'Next' });
    this.checkBox = page.getByRole('checkbox');
    this.startInterviewBtn = page.getByRole('button', { name: 'Start Interview' });
    this.letsDothisNowBtn = page.getByRole('button', { name: 'Let\'s do this now' });
    this.finishInterviewBtn = page.getByRole('button', {
      name: 'Finish Interview'
    });

    this.salaryInputField = page.locator("#budget")
    this.workingHoursInputField = page.locator(`input[name="hoursPerWeek"]`)
    this.locationInputField = page.locator(`#location`)
    this.timezoneSelect = page.locator(`#timeZone`)
    this.expYearsInputField = page.locator(`input[name="experienceLevel\\.years"]`)
    this.expLevelSelect = page.locator(`#experienceLevel`)
    this.submitApplicationBtn = page.getByRole('button', {
      name: 'Submit Application'
    });
    this.sendAgainBtn = page.getByRole('button', { name: 'Send Again' });
  }

  async clickOnNextBtn() {
    await this.nextBtn.nth(1).click();
  }

  async verifyTabHeaders(headers: string[]) {
    const totalHeaders = headers.length;
    for (let i = 0; i < totalHeaders; i++) {
      await expect(this.page.getByRole('heading', { name: headers[i] })).toBeVisible();
    }
  }

  async uploadResume(path: string) {
    const [fileChooser] = await Promise.all([
      this.page.waitForEvent('filechooser'),
      this.uploadResumeBtn.click()
    ])
    await fileChooser.setFiles(path);
    await this.page.waitForSelector(`text="Eden is processing your Resume"`)
  }

  async startInterview() {
    await this.checkBox.check();
    await this.startInterviewBtn.click();
    await this.letsDothisNowBtn.click();
  }

  async finishInterview() {
    await this.finishInterviewBtn.click();
    await this.finishInterviewBtn.click();
  }

  async fillFinalDetails() {
    await this.salaryInputField.fill("50000");
    await this.workingHoursInputField.fill("40");
    await this.locationInputField.fill("New York");
    await this.timezoneSelect.selectOption("(GMT-06:00) Central America");
    await this.expYearsInputField.fill("2");
    await this.expLevelSelect.selectOption("Mid-level");
  }

  async submitApplication() {
    await this.submitApplicationBtn.click();
  }

  async verifyDoneTab(talentEmail: string) {
    await expect(this.sendAgainBtn).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Confirm your application.' })).toBeVisible();
    await expect(this.page.getByRole('textbox')).toHaveValue(talentEmail);
  }
}