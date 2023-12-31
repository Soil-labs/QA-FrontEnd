import LoginPage from '@pages/login.page';
import { FullConfig, chromium } from '@playwright/test';
import { deleteUser } from '@utils/deleteUser';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const browser = await chromium.launch();
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
  await deleteUser(request, '110381000860009079319');
  await context.clearCookies();

  // Delete Talent
  // await page.goto(baseURL, { timeout: 100000 });
  // await loginPage.clickLogin();
  // const talentMemberId = await loginPage.loginToApplication(
  //     process.env.TALENT_EMAIL_1,
  //     process.env.TALENT_PASSWORD_1
  // );
  await deleteUser(request, '114927168463152480295');
  await context.clearCookies();
}

export default globalSetup;
