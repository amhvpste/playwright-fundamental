const { chromium } = require('playwright');
const fs = require('fs').promises;

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Функція для збереження результатів у JSON
  async function saveResults(filename, data) {
    await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Результати збережено у ${filename}`);
  }

  // Об'єкт для зберігання всіх результатів
  const allResults = {};

  try {
    // === Пошук у Google ===
    console.log('Відкриваємо Google...');
    try {
      await page.goto('https://www.google.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log('Google завантажено');
      
      // Обробка екрану згоди (якщо з'являється)
      try {
        console.log('Перевіряємо наявність екрану згоди...');
        const consentButton = await page.waitForSelector('button:has-text("Accept all"), button:has-text("Прийняти все")', { timeout: 5000 });
        if (consentButton) {
          console.log('Знайдено екран згоди, клікаємо...');
          await consentButton.click();
          await page.waitForTimeout(2000);
          console.log('Екран згоди оброблено');
        }
      } catch (e) {
        console.log('Екран згоди не знайдено або не потрібен.');
      }

      // Ввід пошукового запиту
      const searchQuery = 'Вивчення Playwright автоматизація';
      try {
        console.log('Вводимо пошуковий запит...');
        const searchInput = await page.waitForSelector('textarea[name="q"], input[name="q"]', { timeout: 10000 });
        await searchInput.fill(searchQuery);
        console.log('Натискаємо Enter...');
        await searchInput.press('Enter');
        console.log('Чекаємо на результати пошуку...');
        await page.waitForSelector('h3', { timeout: 15000 });
        console.log('Результати пошуку завантажено');
      } catch (error) {
        console.error('Помилка під час пошуку:', error);
        console.log('Поточна URL:', page.url());
        throw error;
      }
    } catch (error) {
      console.error('Помилка завантаження Google:', error);
      throw error;
    }

    // Витягуємо текстові результати
    const googleTextResults = await page.$$eval('h3', elements =>
      elements.map(el => el.textContent).filter(text => text).slice(0, 5)
    );
    allResults.googleText = googleTextResults;
    console.log('Результати пошуку Google:');
    googleTextResults.forEach((result, index) => console.log(`${index + 1}. ${result}`));

    // Переходимо на вкладку зображень
    await page.click('a[aria-label="Search for Images"]');
    await page.waitForSelector('img');
    const googleImages = await page.$$eval('img[src*="gstatic"]', elements =>
      elements.slice(0, 3).map(el => el.src).filter(src => src)
    );
    allResults.googleImages = googleImages;
    console.log('Перші 3 зображення з Google:', googleImages);

    // Робимо скріншот
    await page.screenshot({ path: 'google_images.png', fullPage: true });
    console.log('Скріншот Google збережено як google_images.png');

    // === Пошук у YouTube ===
    console.log('\nВиконуємо пошук у YouTube...');
    await page.goto('https://www.youtube.com', { waitUntil: 'domcontentloaded' });
    await page.fill('input#search', searchQuery);
    await page.click('button#search-icon-legacy');
    await page.waitForSelector('ytd-video-renderer');

    // Витягуємо заголовки відео
    const youtubeResults = await page.$$eval('a#video-title', elements =>
      elements.map(el => el.textContent.trim()).filter(text => text).slice(0, 5)
    );
    allResults.youtubeVideos = youtubeResults;
    console.log('Результати пошуку YouTube:');
    youtubeResults.forEach((result, index) => console.log(`${index + 1}. ${result}`));

    // Скролимо сторінку, щоб завантажити більше контенту
    await page.evaluate(() => window.scrollBy(0, 1000));
    await page.waitForTimeout(2000); // Чекаємо, щоб контент завантажився
    await page.screenshot({ path: 'youtube_results.png', fullPage: true });
    console.log('Скріншот YouTube збережено як youtube_results.png');

    // Зберігаємо всі результати у файл
    await saveResults('search_results.json', allResults);

  } catch (error) {
    console.error('Помилка виконання:', error.message);
  } finally {
    await browser.close();
    console.log('Браузер закрито.');
  }
})();