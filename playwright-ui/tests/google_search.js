const { chromium } = require('playwright');

(async () => {
  // Запускаємо браузер
  const browser = await chromium.launch({ headless: false }); // headless: false, щоб бачити браузер
  const page = await browser.newPage();

  // Переходимо на Google
  await page.goto('https://www.google.com');

  // Знаходимо поле пошуку та вводимо запит
  await page.fill('input[name="q"]', 'Як вивчити Playwright');
  await page.press('input[name="q"]', 'Enter');

  // Чекаємо, поки з'являться результати пошуку
  await page.waitForSelector('h3');

  // Витягуємо заголовки результатів
  const results = await page.$$eval('h3', elements =>
    elements.map(el => el.textContent).filter(text => text)
  );

  // Виводимо перші 5 результатів
  console.log('Перші 5 результатів пошуку:');
  results.slice(0, 5).forEach((result, index) => {
    console.log(`${index + 1}. ${result}`);
  });

  // Закриваємо браузер
  await browser.close();
})();