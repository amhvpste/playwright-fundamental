import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  console.log('Starting basic test...');
  await page.goto('https://example.com');
  console.log('Page title:', await page.title());
  await expect(page).toHaveTitle('Example Domain');
  console.log('Test completed!');
});
