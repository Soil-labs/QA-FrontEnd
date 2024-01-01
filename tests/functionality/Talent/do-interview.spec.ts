import { test } from '@fixtures/base.fixture';
import { HEADERS } from 'data/pageData/HR/configurejob.data';
import { EDEN_INSIGHTS_TAB_HEADERS } from 'data/pageData/Talent/interview.data';
import { JOB_DETAILS } from 'data/testData/HR/jobs.data';
import { INTERVIEW_LINK } from 'data/testData/Talent/interview.data';
import { CARD_DETAILS } from 'data/testData/payment';

test(`create job as HR and do interview as Talent`, async ({
  page,
  loginPage,
  interviewPage
}) => {

  await test.step(`navigate to interview page and login`,
    async () => {
      await page.goto(INTERVIEW_LINK + "?panda=true")
      await loginPage.clickLogin();
      await loginPage.loginToApplication(
        process.env.TALENT_EMAIL_1,
        process.env.TALENT_PASSWORD_1
      );
    })

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
