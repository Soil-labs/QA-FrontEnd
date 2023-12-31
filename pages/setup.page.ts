import { Locator, Page, expect } from '@playwright/test';
import { carddetails } from '../type/types';

export default class Steup {
  page: Page;

  // Subscribe
  subscribeBtn: Locator;
  checkOutBtn: Locator;

  // Company setup
  companyNameInputField: Locator;
  companyDescriptionInputField: Locator;

  // Payment
  addPromotionCode: Locator;
  applyBtn: Locator;
  emailInput: Locator;
  cardNumber: Locator;
  cardExpiry: Locator;
  cvcNumber: Locator;
  billingName: Locator;
  country: Locator;
  zipCode: Locator;
  addressLine1: Locator;
  city: Locator;
  stripePassCheckBox: Locator;
  payButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Subscribe
    this.subscribeBtn = page.getByRole('button', { name: 'Subscribe' });
    this.checkOutBtn = page.getByRole('button', { name: 'Checkout' });

    // Company setup
    this.companyNameInputField = page.locator('#Name');
    this.companyDescriptionInputField = page.locator('#Description');

    // Payment
    this.addPromotionCode = page.getByPlaceholder('Add promotion code');
    this.emailInput = page.locator('#email');
    this.applyBtn = page.getByRole('button', { name: 'Apply' });
    this.cardNumber = page.locator('#cardNumber');
    this.cardExpiry = page.locator('#cardExpiry');
    this.cvcNumber = page.locator('#cardCvc');
    this.billingName = page.locator('#billingName');
    this.country = page.locator("//select[@aria-label='Country or region']");
    this.zipCode = page.locator('#billingPostalCode');
    this.city = page.locator('#billingLocality');
    this.addressLine1 = page.locator('#billingAddressLine1');
    this.stripePassCheckBox = page.locator('#enableStripePass');
    this.payButton = page.locator("//button[@type='submit']");
  }

  async completePayment(carddetails: carddetails, promoCode: string) {
    const { email, city, addressLine1, billingName, country } = carddetails;
    await this.addPromotionCode.click();
    await this.addPromotionCode.fill(promoCode);
    await this.applyBtn.click();
    await expect(this.addressLine1).toBeVisible();
    await this.emailInput.fill(email);
    await this.billingName.fill(billingName);
    await this.country.selectOption(country);
    await this.city.fill(city);
    await this.addressLine1.fill(addressLine1);
    await this.payButton.click({ delay: 3000 });
    await this.page.waitForSelector('text=Welcome to Eden');
  }

  async clickOnSubscribe() {
    await this.subscribeBtn.nth(0).click();
  }

  async fillCompanyProfileInfo(companyName: string, companyDescription: string) {
    await this.companyNameInputField.fill(companyName);
    await this.companyDescriptionInputField.fill(companyDescription);
  }

  async clickOnCheckOut() {
    await this.checkOutBtn.click();
  }
}
