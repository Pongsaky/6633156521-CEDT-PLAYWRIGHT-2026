import { test, expect } from '@playwright/test';

const baseUrl = 'https://katalon-demo-cura.herokuapp.com/';

test.beforeEach(async ({ page }) => {
  await page.goto(baseUrl);
  await page.getByRole('link', { name: 'Make Appointment' }).click();
  await page.getByLabel('Username').fill('John Doe');
  await page.getByLabel('Password').fill('ThisIsNotAPassword');
  await page.getByRole('button', { name: 'Login' }).click();
});

test('make-appointment-assertions', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Make Appointment', level: 2 })).toBeVisible();

  const facilitySelect = page.getByLabel('Facility');
  const facilityOptions = [
    'Tokyo CURA Healthcare Center',
    'Hongkong CURA Healthcare Center',
    'Seoul CURA Healthcare Center',
  ];

  for (const value of facilityOptions) {
    await facilitySelect.selectOption(value);
    await expect(facilitySelect).toHaveValue(value);
  }

  const readmissionCheckbox = page.locator('#chk_hospotal_readmission');
  await readmissionCheckbox.check();
  await expect(readmissionCheckbox).toBeChecked();
  await readmissionCheckbox.uncheck();
  await expect(readmissionCheckbox).not.toBeChecked();

  await page.getByLabel('Medicaid').check();
  await expect(page.locator('#radio_program_medicaid')).toBeChecked();
  await page.getByLabel('None').check();
  await expect(page.locator('#radio_program_none')).toBeChecked();
  await page.getByLabel('Medicare').check();
  await expect(page.locator('#radio_program_medicare')).toBeChecked();

  const today = new Date();
  const visitDate = [
    String(today.getDate()).padStart(2, '0'),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getFullYear()),
  ].join('/');

  const visitDateInput = page.locator('#txt_visit_date');
  await visitDateInput.fill(visitDate);
  await expect(visitDateInput).toHaveValue(visitDate);

  const commentInput = page.getByRole('textbox', { name: 'Comment' });
  await commentInput.fill('test comment');
  await expect(commentInput).toHaveValue('test comment');

  const bookButton = page.getByRole('button', { name: 'Book Appointment' });
  await expect(bookButton).toBeVisible();
  await expect(bookButton).toBeEnabled();
});
