import { test, expect } from '@playwright/test';

test.describe('End-to-End Web Testing with Multiple Browsers', () => {

  test('Google search and verification on Chromium, Firefox, and WebKit', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com');

    // Handle cookie consent if it appears (common on first visit)
    const acceptButton = page.locator('text=Accept all');
    if (await acceptButton.isVisible()) {
      await acceptButton.click();
    }

    // Perform a search
    await page.fill('textarea[name="q"]', 'Playwright framework');
    await page.press('textarea[name="q"]', 'Enter');

    // Verify search results
    await page.waitForSelector('#search');
    await expect(page.locator('text=Playwright: Fast and reliable end-to-end testing')).toBeVisible();

    // Verify URL
    await expect(page).toHaveURL(/.*playwright\+framework/);
  });

  // ---

  test('Wikipedia language switch and title verification on Chromium, Firefox, and WebKit', async ({ page }) => {
    // Navigate to Wikipedia page
    await page.goto('https://uk.wikipedia.org/wiki/Користувач');

    // Find and click the link to switch to English language version
    await page.click('a[hreflang="en"]');
    
    // Wait for the new URL to load
    await page.waitForURL('https://en.wikipedia.org/wiki/User_(computing)');

    // Verify the page title
    const title = await page.title();
    expect(title).toContain('User (computing)');
  });

});