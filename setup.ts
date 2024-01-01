import LoginPage from '@pages/login.page';
import { FullConfig, chromium } from '@playwright/test';
import { deleteUserAPI } from '@utils/deleteUser';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-dev-shm-usage", "--disable-blink-features=AutomationControlled"],
    ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages']
  });
  const page = await browser.newPage();
  const context = page.context();
  const request = context.request;
  const loginPage = new LoginPage(page);

  // Delete HR
  // await page.goto(baseURL, { timeout: 100000 });
  // await loginPage.clickLogin();
  // const hrMemberId = await loginPage.loginToApplication(
  //     process.env.HR_EMAIL_1,
  //     process.env.HR_PASSWORD_1
  // );
  await deleteUserAPI(request, '110381000860009079319');
  // await context.clearCookies();

  // Delete Talent
  // await page.goto(baseURL, { timeout: 100000 });
  // await loginPage.clickLogin();
  // const talentMemberId = await loginPage.loginToApplication(
  //     process.env.TALENT_EMAIL_1,
  //     process.env.TALENT_PASSWORD_1
  // );
  await deleteUserAPI(request, '114927168463152480295');
  // await context.clearCookies();

  await page.goto(baseURL);
  await loginPage.clickLogin();
  const memberId = await loginPage.loginToApplication(
    process.env.HR_EMAIL_2,
    process.env.HR_PASSWORD_2
  );
  console.log(memberId);
  await page.context().storageState({ path: 'auth.json' });
  await page.waitForLoadState('domcontentloaded');
}

export default globalSetup;
