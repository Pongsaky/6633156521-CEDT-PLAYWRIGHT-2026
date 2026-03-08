import { expect, type Page } from '@playwright/test';

type AppointmentDetails = {
  facility: 'Tokyo CURA Healthcare Center' | 'Hongkong CURA Healthcare Center' | 'Seoul CURA Healthcare Center';
  applyReadmission: boolean;
  healthcareProgram: 'Medicare' | 'Medicaid' | 'None';
  visitDate: string;
  comment: string;
};

export class CuraAppointmentPage {
  constructor(private readonly page: Page) {}

  async openHomePage() {
    await this.page.goto('/');
  }

  async goToLogin() {
    await this.page.getByRole('link', { name: 'Make Appointment' }).click();
  }

  async login(username: string, password: string) {
    await this.page.locator('#txt-username').fill(username);
    await this.page.locator('#txt-password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async bookAppointment(details: AppointmentDetails) {
    await this.page.getByLabel('Facility').selectOption(details.facility);

    const readmissionCheckbox = this.page.locator('#chk_hospotal_readmission');
    if (details.applyReadmission) {
      await readmissionCheckbox.check();
    } else {
      await readmissionCheckbox.uncheck();
    }

    await this.page.getByLabel(details.healthcareProgram).check();
    const visitDateInput = this.page.locator('#txt_visit_date');
    await visitDateInput.evaluate((element, value) => {
      const input = element as HTMLInputElement;
      input.removeAttribute('readonly');
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.blur();
    }, details.visitDate);
    await this.page.getByRole('textbox', { name: 'Comment' }).fill(details.comment);
    await this.page.getByRole('button', { name: 'Book Appointment' }).click();
  }

  async expectAppointmentSuccess(expected: AppointmentDetails) {
    await expect(this.page.locator('section#summary')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Appointment Confirmation', level: 2 })).toBeVisible();
    await expect(this.page.locator('#facility')).toHaveText(expected.facility);
    await expect(this.page.locator('#hospital_readmission')).toHaveText(expected.applyReadmission ? 'Yes' : 'No');
    await expect(this.page.locator('#program')).toHaveText(expected.healthcareProgram);
    await expect(this.page.locator('#visit_date')).toHaveText(expected.visitDate);
    await expect(this.page.locator('#comment')).toHaveText(expected.comment);
  }
}
