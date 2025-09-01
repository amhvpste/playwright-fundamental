// btc-price.spec.js
const { test } = require('@playwright/test');

test('check Bitcoin price on coinmarketcap > 100000 USD', async ({ page }) => {
  // Відкриваємо сайт
  await page.goto('https://coinmarketcap.com/', { waitUntil: 'load' });

  // Чекаємо поки завантажиться таблиця (мінімальна очікувана видимість)
  await page.locator('table').first().waitFor({ state: 'visible', timeout: 15000 });

  // Знаходимо рядок, що містить "Bitcoin"
  const btcRow = page.locator('tr', { hasText: 'Bitcoin' }).first();

  // Якщо рядок не знайдено — кидаємо помилку
  const rowCount = await btcRow.count();
  if (rowCount === 0) {
    throw new Error('Не вдалося знайти рядок з Bitcoin на сторінці. Можливо змінилась розмітка сайту.');
  }

  // Знаходимо елемент ціни в цьому рядку.
  // На coinmarketcap ціна зазвичай в 4-й колонці (td:nth-child(4)).
  // Якщо структура змінилась, можливо потрібно підкоригувати селектор.
  const priceText = (await btcRow.locator('td:nth-child(4)').innerText()).trim();

  // Прибираємо символи, що не належать до числа (включно з $ і комами та пробілами)
  // Робимо це "по-цифрово" — видаляємо все, окрім цифр і крапки
  const normalized = priceText.replace(/[^\d.]/g, '');

  if (!normalized) {
    throw new Error(`Не вдалося розпізнати ціну з тексту: "${priceText}"`);
  }

  // Перетворюємо в число (float)
  const price = parseFloat(normalized);

  if (Number.isNaN(price)) {
    throw new Error(`Парсинг ціни провалився. Оригінальний текст: "${priceText}", нормалізовано: "${normalized}"`);
  }

  const threshold = 100000;
  if (price > threshold) {
    const diff = price - threshold;
    console.log(`Bitcoin price: $${price.toFixed(2)} — БІЛЬШЕ за $${threshold.toLocaleString()}. Понад: $${diff.toFixed(2)}`);
  } else if (price === threshold) {
    console.log(`Bitcoin price: $${price.toFixed(2)} — рівно $${threshold}`);
  } else {
    const diff = threshold - price;
    console.log(`Bitcoin price: $${price.toFixed(2)} — МЕНШЕ за $${threshold}. Недостача: $${diff.toFixed(2)}`);
  }

  // За потреби можна додати expect-асерти (наприклад, щоб тест падав, якщо більше).
  // Наприклад, щоб тест проходив тільки коли > 100000:
  // const { expect } = require('@playwright/test');
  // await expect(price).toBeGreaterThan(threshold);
});
