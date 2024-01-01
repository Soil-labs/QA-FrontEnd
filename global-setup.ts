import JobsPage from '@pages/HR/jobs.page';
import LoginPage from '@pages/login.page';
import Steup from '@pages/setup.page';
import { FullConfig, chromium } from '@playwright/test';
import { deleteUserAPI } from '@utils/deleteUser';
import { currentTime } from '@utils/time';
import { CARD_DETAILS } from 'data/testData/payment';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch({
    headless: false,
  });
  const page = await browser.newPage();
  const context = page.context();
  const request = context.request;
  const loginPage = new LoginPage(page);
  const setup = new Steup(page);
  const jobsPage = new JobsPage(page);

  // Delete HR
  await page.goto(baseURL, { timeout: 100000 });
  await loginPage.clickLogin();
  const hrMemberId = await loginPage.loginToApplication(
    process.env.HR_EMAIL_1,
    process.env.HR_PASSWORD_1
  );
  await deleteUserAPI(request, hrMemberId);
  await context.clearCookies();

  // Delete Talent
  await page.goto(baseURL, { timeout: 100000 });
  await loginPage.clickLogin();
  const talentMemberId = await loginPage.loginToApplication(
    process.env.TALENT_EMAIL_1,
    process.env.TALENT_PASSWORD_1
  );
  await deleteUserAPI(request, talentMemberId);
  await context.clearCookies();

  // Store login session
  await page.goto(baseURL);
  await loginPage.clickLogin();
  await loginPage.loginToApplication(
    process.env.HR_EMAIL_2,
    process.env.HR_PASSWORD_2
  );
  await page.context().storageState({ path: 'auth.json' });
  await page.waitForLoadState('domcontentloaded');
  await context.clearCookies();

  // Setup new account
  await page.goto(baseURL);
  await loginPage.clickLogin();
  const memberId = await loginPage.loginToApplication(
    process.env.HR_EMAIL_1,
    process.env.HR_PASSWORD_1
  );
  console.log(memberId);
  await page.waitForLoadState('domcontentloaded');
  await jobsPage.clickOnPostMaigcJob();
  await setup.clickOnSubscribe();
  await setup.fillCompanyProfileInfo(`MC${currentTime}`, 'Description');
  await setup.clickOnCheckOut();
  await setup.completePayment(CARD_DETAILS, process.env.PROMO_CODE);
  await context.clearCookies();
  await page.close();
}

export default globalSetup;
