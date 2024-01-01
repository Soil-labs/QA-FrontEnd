import { test } from '@fixtures/base.fixture';
import { HEADERS } from 'data/pageData/HR/configurejob.data';
import { EDEN_INSIGHTS_TAB_HEADERS } from 'data/pageData/Talent/interview.data';
import { JOB_DETAILS } from 'data/testData/HR/jobs.data';
import { CARD_DETAILS } from 'data/testData/payment';

test(`create job as HR and do interview as Talent`, async ({
  page,
  context,
  loginPage,
  setup,
  dashboardPage,
  jobsPage,
  configureJobPage,
  interviewPage
}) => {
  // Meta Information
  test.info().annotations.push({
    type: 'End to End',
    description: `
    Test cases covered:
    1. https://app.qase.io/case/EDEN-6
    2. https://app.qase.io/case/EDEN-2`,
  });

  let interviewLink: string;

  await test.step(`login to eden as HR`, async () => {
    await page.goto('/');
    await loginPage.clickLogin();
    const memberId = await loginPage.loginToApplication(
      process.env.HR_EMAIL_1,
      process.env.HR_PASSWORD_1
    );
    console.log(memberId);
    await page.waitForLoadState('domcontentloaded');
  });

  await test.step(`setup company and subscribe`, async () => {
    await jobsPage.clickOnPostMaigcJob();
    await setup.clickOnSubscribe();
    await setup.fillCompanyProfileInfo('MyCompany2024', 'Description2024');
    await setup.clickOnCheckOut();
    await setup.completePayment(CARD_DETAILS, process.env.PROMO_CODE);
  });

  await test.step(`launch an opportunity`, async () => {
    await dashboardPage.actOnNavigationBar('expand');
    await dashboardPage.clickOnAddOpportunity('main');
    await dashboardPage.launchOpportunity(
      JOB_DETAILS.job1.title,
      JOB_DETAILS.job1.description
    );
  });

  await test.step(`configure and publish`, async () => {
    await configureJobPage.validatePage(JOB_DETAILS.job1.title, HEADERS);
    await configureJobPage.configureJob();
    await configureJobPage.publishJob('auto');
  });

  await test.step(`verify job published`, async () => {
    await dashboardPage.actOnNavigationBar('expand');
    await dashboardPage.verifyJobVisibility(JOB_DETAILS.job1.title, 'Published');
  });

  await test.step(`copy interview link`, async () => {
    interviewLink = await dashboardPage.copyLink();
    await context.clearCookies();
  });

  await test.step(`navigate to interview page and login as Talent`, async () => {
    await page.goto(interviewLink + "?panda=true");
    await loginPage.clickLogin();
    await loginPage.loginToApplication(
      process.env.TALENT_EMAIL_1,
      process.env.TALENT_PASSWORD_1
    );
  });


  await test.step(`start the interview process`,
    async () => {
      await interviewPage.clickOnNextBtn();
      await interviewPage.verifyTabHeaders(EDEN_INSIGHTS_TAB_HEADERS);
      await interviewPage.startInterview();
    })

  await test.step(`finish the interview`,
    async () => {
      await interviewPage.finishInterview();
    })

  await test.step(`fill final details`,
    async () => {
      await interviewPage.fillFinalDetails()
    })

  await test.step(`submit application and verify`,
    async () => {
      await interviewPage.submitApplication();
      await interviewPage.verifyDoneTab(process.env.TALENT_EMAIL_1);
    })
});
