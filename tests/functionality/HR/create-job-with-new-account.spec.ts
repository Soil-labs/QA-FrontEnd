import { test } from '@fixtures/base.fixture';
import JobsPage from '@pages/HR/jobs.page';
import LoginPage from '@pages/login.page';
import Steup from '@pages/setup.page';
import { firefox } from '@playwright/test';
import { verifyToasterMessage } from '@utils/assertions';
import { HEADERS } from 'data/pageData/HR/configurejob.data';
import { TOASTER_MESSAGES } from 'data/pageData/toasterMessages';
import { JOB_DETAILS } from 'data/testData/HR/jobs.data';
import { CARD_DETAILS } from 'data/testData/payment';


test.describe(`create job with new account`, async () => {

  test(`create job -> publish -> auto conifigure`, async ({
    page,
    context,
    loginPage,
    dashboardPage,
    jobsPage,
    configureJobPage,
  }) => {
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

    await test.step(`auto configure and publish`, async () => {
      await configureJobPage.validatePage(JOB_DETAILS.job2.title, HEADERS);
      await configureJobPage.configureJob();
      await configureJobPage.publishJob('auto');
    });

    await test.step(`verify job published`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job2.title, 'Published');
    });

    await test.step(`copy interview link`, async () => {
      await dashboardPage.copyLink();
      await verifyToasterMessage(page, TOASTER_MESSAGES.interviewLinkCopied);
      await dashboardPage.selectOptionFromThreeDots('Copy Interview link');
      await verifyToasterMessage(page, TOASTER_MESSAGES.linkCopied);
      await context.clearCookies();
    });

    await test.step(`delete the job`, async () => {
      await dashboardPage.selectOptionFromThreeDots('Delete opportunity');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job2.title, 'Deleted');
    });
  });

  test(`create job -> publish -> manually configure`, async ({
    page,
    context,
    loginPage,
    dashboardPage,
    jobsPage,
    configureJobPage,
  }) => {
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

    await test.step(`navigate to dashboard page`, async () => {
      await jobsPage.clickOnPostMaigcJob();
    });

    await test.step(`launch an opportunity`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.clickOnAddOpportunity();
      await dashboardPage.launchOpportunity(
        JOB_DETAILS.job3.title,
        JOB_DETAILS.job3.description
      );
    });

    await test.step(`configure and publish`, async () => {
      await configureJobPage.validatePage(JOB_DETAILS.job3.title, HEADERS);
      await configureJobPage.configureJob();
      await configureJobPage.publishJob('manual');
    });

    await test.step(`verify job published`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job3.title, 'Published');
    });

    await test.step(`copy interview link`, async () => {
      await dashboardPage.copyLink();
      await verifyToasterMessage(page, TOASTER_MESSAGES.interviewLinkCopied);
      await dashboardPage.selectOptionFromThreeDots('Copy Interview link');
      await verifyToasterMessage(page, TOASTER_MESSAGES.linkCopied);
    });

    await test.step(`delete the job`, async () => {
      await dashboardPage.selectOptionFromThreeDots('Delete opportunity');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job3.title, 'Deleted');
    });
  });

  test(`create job -> save draft -> auto conifigure`, async ({
    page,
    context,
    loginPage,
    dashboardPage,
    jobsPage,
    configureJobPage,
  }) => {
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

    await test.step(`navigate to dashboard page`, async () => {
      await jobsPage.clickOnPostMaigcJob();
    });

    await test.step(`launch an opportunity`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.clickOnAddOpportunity();
      await dashboardPage.launchOpportunity(
        JOB_DETAILS.job4.title,
        JOB_DETAILS.job4.description
      );
    });

    await test.step(`auto configure and save draft`, async () => {
      await configureJobPage.validatePage(JOB_DETAILS.job4.title, HEADERS);
      await configureJobPage.configureJob();
      await configureJobPage.saveAsDraft('auto');
    });

    await test.step(`verify job saved as draft`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job4.title, 'Not Published');
    });

    await test.step(`copy interview link`, async () => {
      await dashboardPage.copyLink();
      await verifyToasterMessage(page, TOASTER_MESSAGES.interviewLinkCopied);
      await dashboardPage.selectOptionFromThreeDots('Copy Interview link');
      await verifyToasterMessage(page, TOASTER_MESSAGES.linkCopied);
    });

    await test.step(`delete the job`, async () => {
      await dashboardPage.selectOptionFromThreeDots('Delete opportunity');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job4.title, 'Deleted');
    });
  });

  test(`create job -> save draft -> manually configure`, async ({
    page,
    context,
    loginPage,
    dashboardPage,
    jobsPage,
    configureJobPage,
  }) => {
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

    await test.step(`navigate to dashboard page`, async () => {
      await jobsPage.clickOnPostMaigcJob();
    });

    await test.step(`launch an opportunity`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.clickOnAddOpportunity();
      await dashboardPage.launchOpportunity(
        JOB_DETAILS.job5.title,
        JOB_DETAILS.job5.description
      );
    });

    await test.step(`configure job, interview and save as draft`, async () => {
      await configureJobPage.validatePage(JOB_DETAILS.job5.title, HEADERS);
      await configureJobPage.configureJob();
      await configureJobPage.saveAsDraft('manual');
    });

    await test.step(`verify job job saved as draft`, async () => {
      await dashboardPage.actOnNavigationBar('expand');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job5.title, 'Not Published');
    });

    await test.step(`copy interview link`, async () => {
      await dashboardPage.copyLink();
      await verifyToasterMessage(page, TOASTER_MESSAGES.interviewLinkCopied);
      await dashboardPage.selectOptionFromThreeDots('Copy Interview link');
      await verifyToasterMessage(page, TOASTER_MESSAGES.linkCopied);
    });

    await test.step(`delete the job`, async () => {
      await dashboardPage.selectOptionFromThreeDots('Delete opportunity');
      await dashboardPage.verifyJobVisibility(JOB_DETAILS.job5.title, 'Deleted');
    });
  });
})