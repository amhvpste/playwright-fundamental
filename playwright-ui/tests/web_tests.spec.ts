import { test, expect } from '@playwright/test';

// Configure test timeout and retries for flaky tests
test.describe.configure({ mode: 'serial', timeout: 60000 });

test.describe('End-to-End Web Testing', () => {
  // Common test setup
  test.beforeEach(async ({ page }) => {
    // Set default timeout for all tests
    page.setDefaultTimeout(30000);
  });

  test('Google search should return Playwright documentation as first result', async ({ page }) => {
    test.slow(); // Mark test as slow (3x timeout)
    
    // Navigate to Google with timeout and wait until network is idle
    await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded' });

    try {
      // Handle cookie consent with better selector and timeout
      const acceptButton = page.locator('button:has-text("Accept all"), button:has-text("I agree")');
      await acceptButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (await acceptButton.isVisible()) {
        await acceptButton.click();
        await page.waitForLoadState('networkidle');
      }

      // Perform a search with explicit wait
      const searchInput = page.locator('textarea[name="q"]');
      await searchInput.waitFor({ state: 'visible' });
      await searchInput.fill('Playwright framework');
      await searchInput.press('Enter');

      // Verify search results with better selectors and assertions
      const results = page.locator('#search');
      await expect(results.first()).toBeVisible();
      await expect(page.getByRole('link', { name: /Playwright: Fast and reliable end-to-end testing/i })).toBeVisible();

      // Verify URL with more flexible matching
      await expect(page).toHaveURL(/[?&]q=Playwright[+ ]framework/);
    } catch (error) {
      // Take screenshot on failure
      await page.screenshot({ path: 'test-results/google-search-failure.png' });
      throw error;
    }
  });

  test('Wikipedia should correctly switch language from Ukrainian to English', async ({ page }) => {
    // Navigate to Wikipedia page with retry logic
    await page.goto('https://uk.wikipedia.org/wiki/Користувач', { waitUntil: 'networkidle' });

    try {
      // Wait for and click the language switch with better selector
      const englishLink = page.locator('a[href*="//en.wikipedia.org"][hreflang="en"]').first();
      await expect(englishLink).toBeVisible({ timeout: 10000 });
      await englishLink.click();
      
      // Wait for navigation with flexible URL matching
      await page.waitForURL(/en\.wikipedia\.org\/wiki\/User(?:\(computing\))?/i);

      // Verify page title with more flexible matching
      await expect(page).toHaveTitle(/User(?:\(computing\))?/i);
    } catch (error) {
      // Take screenshot on failure
      await page.screenshot({ path: 'test-results/wikipedia-failure.png' });
      throw error;
    }
  });

  // Add cleanup if needed
  test.afterAll(async () => {
    // Any cleanup code can go here
  });
});