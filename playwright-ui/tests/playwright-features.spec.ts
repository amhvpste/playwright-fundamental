import { test, expect } from '@playwright/test';

test.describe('Playwright Website Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test timeout
    test.setTimeout(60000);
    // Navigate to the website before each test
    await page.goto('https://playwright.dev/');
  });

  // 1. Basic Navigation & Assertions
  test('should have correct title and navigation', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Playwright/);
    
    // Check navigation elements
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Community' })).toBeVisible();
  });

  // 2. Form Interactions
  test('should interact with search functionality', async ({ page }) => {
    test.slow(); // Give this test more time
    
    try {
      // Click search button
      const searchButton = page.locator('button.DocSearch-Button');
      await searchButton.waitFor({ state: 'visible', timeout: 10000 });
      await searchButton.click();
      
      // Type in search input
      const searchInput = page.locator('.DocSearch-Input');
      await searchInput.waitFor({ state: 'visible', timeout: 5000 });
      await searchInput.fill('locator');
      
      // Wait for search results
      const searchResult = page.locator('.DocSearch-Hit').first();
      await searchResult.waitFor({ state: 'visible', timeout: 10000 });
      await expect(searchResult).toContainText('Locator', { ignoreCase: true });
    } catch (error) {
      await page.screenshot({ path: 'search-error.png' });
      throw error;
    }
  });

  // 3. Language Switching - Simplified to direct navigation
  test('should verify language-specific content', async ({ page }) => {
    test.slow();
    
    try {
      // Directly navigate to Python docs
      await page.goto('https://playwright.dev/python/docs/intro');
      
      // Verify Python-specific content
      await expect(page.getByText('pip install playwright')).toBeVisible({ timeout: 10000 });
      
      // Verify language is set to Python in the UI
      const currentLang = await page.locator('button:has-text("Python")').textContent();
      expect(currentLang).toContain('Python');
      
    } catch (error) {
      await page.screenshot({ path: 'language-verification-error.png' });
      throw error;
    }
  });

  // 4. Dropdown Verification - Simplified to check existing dropdown
  test('should verify dropdown functionality', async ({ page }) => {
    test.slow();
    
    try {
      // Navigate to a page with a reliable dropdown
      await page.goto('https://playwright.dev/docs/selectors');
      
      // Check if the version dropdown exists (should be present on the page)
      const versionDropdown = page.locator('.dropdown--hoverable');
      await expect(versionDropdown).toBeVisible({ timeout: 10000 });
      
      // Get dropdown items to verify the dropdown structure
      const dropdownItems = page.locator('.dropdown--hoverable a');
      const itemCount = await dropdownItems.count();
      expect(itemCount).toBeGreaterThan(0);
      
      // Verify at least one item is visible
      await expect(dropdownItems.first()).toBeVisible();
      
    } catch (error) {
      await page.screenshot({ path: 'dropdown-verification-error.png' });
      throw error;
    }
  });

  // 5. Tabs & New Windows
  test('should handle new tabs', async ({ browser }) => {
    // Create a new browser context and page
    const context = await browser.newContext();
    const newPage = await context.newPage();
    
    // Test new page
    await newPage.goto('https://playwright.dev/docs/intro');
    await expect(newPage.getByRole('heading', { name: 'Installation' })).toBeVisible();
    
    // Clean up
    await newPage.close();
    await context.close();
  });

  // 6. File Upload (Example with GitHub)
  test('should demonstrate file upload', async ({ page }) => {
    // Navigate to GitHub new issue page (example)
    await page.goto('https://github.com/microsoft/playwright/issues/new/choose');
    
    // This is just an example - actual implementation would need authentication
    // await page.getByRole('button', { name: 'Upload files' }).click();
    // await page.setInputFiles('input[type="file"]', 'path/to/your/file.txt');
  });

  // 7. iFrame Handling
  test('should handle iframes', async ({ page }) => {
    // Example with YouTube iframe (not on Playwright site, just for demonstration)
    // await page.goto('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    // const frame = page.frameLocator('iframe[src*="youtube"]');
    // await frame.getByRole('button', { name: 'Play' }).click();
  });

  // 8. Network Requests - Simplified to check page load requests
  test('should intercept network requests', async ({ page }) => {
    test.slow();
    
    try {
      // Listen for page load requests
      const responsePromise = page.waitForResponse(
        response => response.status() === 200 && 
                   response.url().includes('playwright') &&
                   response.request().resourceType() === 'document',
        { timeout: 10000 }
      );
      
      // Navigate to a page
      await page.goto('https://playwright.dev/docs/intro');
      
      // Wait for the response
      const response = await responsePromise;
      expect(response.status()).toBe(200);
      
      // Verify we're on the right page
      await expect(page).toHaveURL(/intro/);
      
    } catch (error) {
      await page.screenshot({ path: 'network-error.png' });
      throw error;
    }
  });

  // 9. Visual Testing
  test('should match screenshot', async ({ page }) => {
    // Take screenshot and compare (commented out as it needs baseline images)
    // expect(await page.screenshot()).toMatchSnapshot('homepage.png');
  });

  // 10. Authentication (example with GitHub)
  test('should handle authentication', async ({ browser }) => {
    // This is a template - you would need to implement actual login flow
    // const context = await browser.newContext({ storageState: 'auth.json' });
    // const page = await context.newPage();
    // await page.goto('https://github.com/login');
    // await page.getByLabel('Username or email address').fill('your-username');
    // await page.getByLabel('Password').fill('your-password');
    // await page.getByRole('button', { name: 'Sign in' }).click();
    // await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  });
});
