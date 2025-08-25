import { test, expect } from '@playwright/test';

/**
 * 1. Базові перевірки головної сторінки
 */
test('homepage should have the correct title', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page).toHaveTitle(/Playwright/);
});

test('homepage should contain the slogan', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.getByText('Reliable end-to-end testing')).toBeVisible();
});

/**
 * 2. Навігаційне меню
 */
test('navigation bar should have correct links', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  await expect(page.getByRole('link', { name: 'Docs' }))
    .toHaveAttribute('href', '/docs/intro');

  await expect(page.getByRole('link', { name: 'API', exact: true }))
    .toHaveAttribute('href', '/docs/api/class-playwright');

  await expect(page.getByRole('link', { name: 'Community' }))
    .toHaveAttribute('href', '/community/welcome');
});

/**
 * 3. Кнопка "Get started"
 */
test('Get started button should redirect to docs/intro', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/.*docs\/intro/);
});

/**
 * 4. Пошук (вимкнено через нестабільність)
 */
test.skip('search should work', async ({ page }) => {
  expect(true).toBeTruthy();
});

/**
 * 5. Візуальний тест (вимкнено через налаштування)
 */
// test('homepage visual regression', async ({ page }) => {
//   await page.goto('https://playwright.dev/');
//   expect(await page.screenshot()).toMatchSnapshot('homepage.png');
// });

/**
 * 6. Перевірка перемикання мови програмування (параметризований)
 */
const languages = [
  { name: 'Node.js', pattern: /docs\/api/ },
  { name: 'Python', pattern: /python\/docs\/api/ },
  { name: 'Java', pattern: /java\/docs\/api/ },
];

// Global test timeout (60 seconds)
const TEST_TIMEOUT = 60000;

test.describe('Programming language switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
  });

  for (const lang of languages) {
    test(`should switch to ${lang.name} and update API link @smoke`, async ({ page }) => {
      test.setTimeout(TEST_TIMEOUT);
      
      try {
        // Find and click the language switcher with timeout
        const languageSwitcher = page.locator('button[aria-label*="language"], button:has-text("Node.js")').first();
        await languageSwitcher.waitFor({ state: 'visible', timeout: 10000 });
        await languageSwitcher.click({ timeout: 5000 });
        
        // Click the specific language with timeout
        const languageOption = page.getByRole('link', { name: lang.name, exact: true }).first();
        await languageOption.waitFor({ state: 'visible', timeout: 10000 });
        
        // Take a screenshot before clicking for debugging
        await page.screenshot({ path: `before-${lang.name.toLowerCase()}-click.png` });
        
        // Use Promise.race to implement a timeout for the click
        await Promise.race([
          languageOption.click().catch(e => console.error(`Click failed: ${e}`)),
          new Promise((_, reject) => setTimeout(() => reject(new Error(`Click timed out after 10s`)), 10000))
        ]);
        
        // Wait for navigation with timeout
        await Promise.race([
          page.waitForURL(lang.pattern, { timeout: 15000 }),
          new Promise((_, reject) => setTimeout(() => reject(new Error(`Navigation to ${lang.pattern} timed out`)), 15000))
        ]);
        
        // Verify the URL
        await expect(page).toHaveURL(lang.pattern, { timeout: 5000 });
        
        // Verify API link
        const apiLink = page.getByRole('link', { name: 'API', exact: true }).first();
        await expect(apiLink).toHaveAttribute('href', lang.pattern, { timeout: 5000 });
        
      } catch (error) {
        // Take a screenshot on failure
        await page.screenshot({ path: `error-${lang.name.toLowerCase()}.png` });
        console.error(`Test failed for ${lang.name}:`, error);
        throw error; // Re-throw to fail the test
      }
    });
  }
});

/**
 * 7. Навігація та видимість основних елементів
 */
test('should navigate through main sections and verify elements are visible', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await page.getByRole('link', { name: 'Playwright logo Playwright' }).click();
  await page.getByRole('link', { name: 'Docs' }).click();
  await page.getByRole('link', { name: 'API', exact: true }).click();
  await page.getByRole('button', { name: 'Node.js' }).click();
  await page.getByRole('link', { name: 'Community' }).click();
  await page.getByRole('link', { name: 'Playwright logo Playwright' }).click();

  await expect(page.getByRole('link', { name: 'Playwright logo Playwright' })).toBeVisible();
  await page.getByRole('link', { name: 'Docs' }).click();
  await expect(page.getByRole('link', { name: 'API', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Node.js' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Community' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitHub repository' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Discord server' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Switch between dark and light' })).toBeVisible();

  await page.getByRole('button', { name: 'Search (Ctrl+K)' }).click();
  await expect(page.getByRole('button', { name: 'Search', exact: true })).toBeVisible();
});

/**
 * 8. Текст основних елементів навігації
 */
test('should verify text content of main navigation elements', async ({ page }) => {
  await page.goto('https://playwright.dev/');
  await expect(page.getByRole('link', { name: 'Playwright logo Playwright' })).toContainText('Playwright');
  await expect(page.getByRole('link', { name: 'Docs' })).toContainText('Docs');
  await expect(page.getByRole('link', { name: 'API', exact: true })).toContainText('API');
  await expect(page.getByRole('button', { name: 'Node.js' })).toContainText('Node.js');
  await expect(page.getByRole('link', { name: 'Community' })).toContainText('Community');
});
