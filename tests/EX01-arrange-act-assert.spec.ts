import { test, expect, type Page } from '@playwright/test';

const baseUrl = 'https://katalon-demo-cura.herokuapp.com/';

async function openLogin(page: Page) {
  await page.goto(baseUrl);
  await page.getByRole('link', { name: 'Make Appointment' }).click();
}

async function login(page: Page, username: string, password: string) {
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

test('login-valid', async ({ page }) => {
  await openLogin(page);
  await login(page, 'John Doe', 'ThisIsNotAPassword');

  await expect(page.locator('section#appointment')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Make Appointment', level: 2 })).toBeVisible();
  await expect(page.locator('#combo_facility')).toBeVisible();
  await expect(page.locator('#btn-book-appointment')).toBeVisible();
});

const invalidCases = [
  { name: 'login-fail-password', username: 'John Doe', password: 'wrongpassword' },
  { name: 'login-fail-username', username: 'InvalidUser', password: 'ThisIsNotAPassword' },
];

for (const { name, username, password } of invalidCases) {
  test(name, async ({ page }) => {
    await openLogin(page);
    await login(page, username, password);

    await expect(page.getByText('Login failed! Please ensure the username and password are valid.')).toBeVisible();
    await expect(page.locator('section#appointment')).not.toBeVisible();
  });
}
