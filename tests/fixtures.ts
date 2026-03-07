import { test as base } from '@playwright/test';

type Credentials = {
  username: string;
  password: string;
};

type TestFixtures = {
  credentials: Credentials;
};

export const test = base.extend<TestFixtures>({
  credentials: async ({}, use) => {
    await use({
      username: 'John Doe',
      password: 'ThisIsNotAPassword',
    });
  },
});

export { expect } from '@playwright/test';
