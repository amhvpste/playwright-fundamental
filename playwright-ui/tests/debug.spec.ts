import { test, expect } from '@playwright/test';

const log = (message: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
};

test('debug language switch', async ({ page, browser }) => {
  test.setTimeout(60000);
  
  try {
    // Enable console logging
    page.on('console', msg => log(`CONSOLE: ${msg.text()}`));
    
    // Log browser info
    log(`Browser: ${browser.browserType().name()} ${browser.version()}`);
    
    // Set viewport size
    await page.setViewportSize({ width: 1280, height: 800 });
    
    log('Navigating to Playwright...');
    await page.goto('https://playwright.dev/', { waitUntil: 'domcontentloaded' });
    log('Page loaded');
    
    // Take initial screenshot
    await page.screenshot({ path: 'debug-1-initial.png' });
    log('Initial screenshot taken');
    
    // Find language switcher
    log('Looking for language switcher...');
    const languageSwitcher = page.locator('button:has-text("Node.js")');
    await languageSwitcher.waitFor({ state: 'visible', timeout: 10000 });
    log('Language switcher found');
    
    // Click language switcher
    log('Clicking language switcher...');
    await languageSwitcher.click();
    log('Language switcher clicked');
    
    // Wait for dropdown to appear
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'debug-2-after-click.png' });
    log('Screenshot after click taken');
    
    // Find Python option
    log('Looking for Python option...');
    const pythonOption = page.getByRole('link', { name: 'Python', exact: true });
    await pythonOption.waitFor({ state: 'visible', timeout: 10000 });
    log('Python option found');
    
    // Click Python option
    log('Clicking Python option...');
    await Promise.race([
      pythonOption.click(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Click timed out')), 10000))
    ]);
    log('Python option clicked');
    
    // Wait for navigation
    log('Waiting for navigation...');
    await page.waitForURL(/python\/docs\/api/, { timeout: 15000 });
    log('Navigation completed');
    
    // Final screenshot
    await page.screenshot({ path: 'debug-3-final.png' });
    log('Final screenshot taken');
    
    log('Test completed successfully!');
  } catch (error) {
    log(`TEST FAILED: ${error}`);
    await page.screenshot({ path: 'debug-error.png' });
    log('Error screenshot taken');
    throw error;
  }
});
