import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

const baseUrl = 'https://katalon-demo-cura.herokuapp.com/';

async function openLogin(page: Page) {
  await page.goto(baseUrl);
  await page.getByRole('link', { name: 'Make Appointment' }).click();
}

async function login(page: Page, username: string, password: string) {
  await page.locator('#txt-username').fill(username);
  await page.locator('#txt-password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test('login-valid', async ({ page, credentials }) => {
  await openLogin(page);
  await login(page, credentials.username, credentials.password);

  await expect(page.locator('section#appointment')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Make Appointment', level: 2 })).toBeVisible();
  await expect(page.locator('#combo_facility')).toBeVisible();
  await expect(page.locator('#btn-book-appointment')).toBeVisible();
});

const invalidCases = [
  { name: 'login-fail-password', password: 'wrongpassword' },
  { name: 'login-fail-username', username: 'InvalidUser' },
];

for (const { name, username, password } of invalidCases) {
  test(name, async ({ page, credentials }) => {
    await openLogin(page);
    await login(
      page,
      username ?? credentials.username,
      password ?? credentials.password,
    );

    await expect(page.getByText('Login failed! Please ensure the username and password are valid.')).toBeVisible();
    await expect(page.locator('section#appointment')).not.toBeVisible();
  });
}
