import { Page, expect } from "@playwright/test"

export const verifyToasterMessage = async (page: Page, message: string) => {
  await expect(page.getByRole('alert').getByText(message)).toBeVisible()
  await page.getByLabel('close').click();
}