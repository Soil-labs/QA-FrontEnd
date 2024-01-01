import { test as base } from '@playwright/test';
import LoginPage from '../pages/login.page';
import Steup from '../pages/setup.page';
import DashboardPage from '@pages/HR/dashboard.page';
import ConfigureJobPage from '@pages/HR/configureJob.page';
import JobsPage from '@pages/HR/jobs.page';
import InterviewPage from '@pages/Talent/interview.page';

type PageObjects = {
  loginPage: LoginPage;
  setup: Steup;
  dashboardPage: DashboardPage;
  jobsPage: JobsPage;
  configureJobPage: ConfigureJobPage;
  interviewPage: InterviewPage;
};

export const test = base.extend<PageObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  setup: async ({ page }, use) => {
    await use(new Steup(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  jobsPage: async ({ page }, use) => {
    await use(new JobsPage(page));
  },

  configureJobPage: async ({ page }, use) => {
    await use(new ConfigureJobPage(page));
  },

  interviewPage: async ({ page }, use) => {
    await use(new InterviewPage(page));
  }
});

export { expect } from '@playwright/test';
