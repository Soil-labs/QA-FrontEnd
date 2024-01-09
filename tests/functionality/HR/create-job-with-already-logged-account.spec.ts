import { test } from '@fixtures/base.fixture';
import { verifyToasterMessage } from '@utils/assertions';
import { TOASTER_MESSAGES } from 'data/pageData/toasterMessages';
import { HEADERS } from '@pageData/hr/configurejob.data';
import { JOB_DETAILS } from 'data/testData/hr/jobs.data';

test.use({ storageState: 'auth.json' });
test.describe('HR : Create Job with already logged account', async () => {

  test(`verify create job and delete job funcationalities`, async ({
    page,
    dashboardPage,
    jobsPage,
    configureJobPage,
  }) => {

    await test.step(`navigate to dashboard page`, async () => {
      await page.goto('/');
      await jobsPage.clickOnPostMaigcJob();
    });

    await test.step(`launch an opportunity`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.clickOnAddOpportunity();
      await dashboardPage.launchOpportunity(
        JOB_DETAILS.job6.title,
        JOB_DETAILS.job6.description
      );
    });

    await test.step(`configure and publish`, async () => {
      await configureJobPage.validatePage(JOB_DETAILS.job6.title, HEADERS);
      await configureJobPage.configureJob();
      await configureJobPage.publishJob('auto');
    });

    await test.step(`verify job published`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job6.title, 'Published');
    });

    await test.step(`verify copy interview link`, async () => {
      await dashboardPage.copyLink();
      await verifyToasterMessage(page, TOASTER_MESSAGES.interviewLinkCopied);
      await dashboardPage.selectOptionFromThreeDots('Copy Interview link');
      await verifyToasterMessage(page, TOASTER_MESSAGES.linkCopied);
    });

    await test.step(`delete the job`, async () => {
      await dashboardPage.selectOptionFromThreeDots('Delete opportunity');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job6.title, 'Deleted');
    });
  });

})

