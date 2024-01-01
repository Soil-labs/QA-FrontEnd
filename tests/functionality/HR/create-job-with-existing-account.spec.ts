import { test } from '@fixtures/base.fixture';
import { verifyToasterMessage } from '@utils/assertions';
import { TOASTER_MESSAGES } from 'data/pageData/toasterMessages';
import { HEADERS } from 'data/pageData/HR/configurejob.data';
import { JOB_DETAILS } from 'data/testData/HR/jobs.data';

test.describe('HR : Create Job with existing account', async () => {

  test.beforeEach(async ({ page, loginPage }) => {
    await test.step(`login to eden as HR`, async () => {
      await page.goto('/');
      await loginPage.clickLogin();
      const memberId = await loginPage.loginToApplication(
        process.env.HR_EMAIL_2,
        process.env.HR_PASSWORD_2
      );
      console.log(memberId);
      await page.waitForLoadState('domcontentloaded');
    });
  });

  test(`verify create job and delete job funcationalities`, async ({
    page,
    dashboardPage,
    jobsPage,
    configureJobPage,
  }) => {
    test.info().annotations.push({
      type: 'Functionality',
      description: `
    Test Cases Covered:
    1. https://app.qase.io/case/EDEN-1
    2. https://app.qase.io/case/EDEN-5`,
    });

    await test.step(`navigate to dashboard page`, async () => {
      await jobsPage.clickOnPostMaigcJob();
    });

    await test.step(`launch an opportunity`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.clickOnAddOpportunity();
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

    await test.step(`verify copy interview link`, async () => {
      await dashboardPage.copyLink();
      await verifyToasterMessage(page, TOASTER_MESSAGES.interviewLinkCopied);
      await dashboardPage.selectOptionFromThreeDots('Copy Interview link');
      await verifyToasterMessage(page, TOASTER_MESSAGES.linkCopied);
    });

    await test.step(`delete the job`, async () => {
      await dashboardPage.selectOptionFromThreeDots('Delete opportunity');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job1.title, 'Deleted');
    });
  });

  test(`verify create job and save draft funcationality`, async ({
    dashboardPage,
    jobsPage,
    configureJobPage,
  }) => {

    await test.step(`navigate to dashboard page`, async () => {
      await jobsPage.clickOnPostMaigcJob();
    });

    await test.step(`launch an opportunity`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.clickOnAddOpportunity();
      await dashboardPage.launchOpportunity(
        JOB_DETAILS.job2.title,
        JOB_DETAILS.job2.description
      );
    });

    await test.step(`configure and save as draft`, async () => {
      await configureJobPage.validatePage(JOB_DETAILS.job2.title, HEADERS);
      await configureJobPage.configureJob();
      await configureJobPage.saveAsDraft('auto');
    });

    await test.step(`verify job saved as draft`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job2.title, 'Not Published');
      await dashboardPage.selectOptionFromThreeDots('Configure Job Page');
    });

    await test.step(`delete the job`, async () => {
      await dashboardPage.selectOptionFromThreeDots('Delete opportunity');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job2.title, 'Deleted');
    });
  });
})

