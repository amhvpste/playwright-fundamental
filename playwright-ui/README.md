# Проект з тестування Playwright UI

Цей проект містить end-to-end тести для веб-додатків з використанням Playwright — потужного фреймворку для тестування сучасних веб-додатків.

## 🚀 Можливості

- Крос-браузерне тестування (Chromium, Firefox, WebKit)
- Надійні стратегії вибору елементів
- Перехоплення мережевих запитів
- Знімки екрану та запис відео
- Паралельне виконання тестів
- Підготовлено для CI/CD

## 📋 Передумови

- Node.js 16 або вище
- npm або yarn
- Встановлений Git

## 🛠️ Встановлення

1. Клонуйте репозиторій:
   ```bash
   git clone <посилання-на-репозиторій>
   cd playwright-ui
   ```

2. Встановіть залежності:
   ```bash
   npm install
   # або
   yarn install
   ```

3. Встановіть браузери для Playwright:
   ```bash
   npx playwright install
   ```

## 🧪 Запуск тестів

Запустити всі тести в режимі без інтерфейсу:
```bash
npx playwright test
```

Запустити тести з графічним інтерфейсом:
```bash
npx playwright test --ui
```

Запустити тести з відображенням браузера:
```bash
npx playwright test --headed
```

Запустити тести для певного браузера:
```bash
npx playwright test --project=chromium
# або
npx playwright test --project=firefox
# або
npx playwright test --project=webkit
```

Запустити конкретний тестовий файл:
```bash
npx playwright test tests/example.spec.ts
```

## 🏗️ Структура проекту

```
playwright-ui/
├── tests/                  # Тестові файли
│   ├── examples/           # Приклади тестів
│   └── *.spec.ts           # Тестові файли
├── tests-examples/         # Приклади тестів з Playwright
├── playwright.config.ts    # Конфігурація Playwright
├── package.json           # Залежності проекту
└── README.md              # Цей файл
```

## 🔧 Налаштування

Редагуйте `playwright.config.ts` для налаштування:
- Таймаути тестів
- Браузери для тестування
- Розміри вікна перегляду
- Базові URL-адреси
- Налаштування знімків екрану та запису відео

## 📝 Написання тестів

Приклад структури тесту:

```typescript
import { test, expect } from '@playwright/test';

test('приклад тесту', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle('Example Domain');
  
  // Ваш тестовий код тут
});
```

## 📊 Звіти про тестування

Після виконання тестів перегляньте HTML-звіт:
```bash
npx playwright show-report
```

## 🧹 Очищення

Для видалення артефактів тестування:
```bash
npx playwright clear
```

## 🤝 Внесок у проект

1. Зробіть форк репозиторію
2. Створіть гілку для нової функції (`git checkout -b feature/НоваФункція`)
3. Зробіть коміт ваших змін (`git commit -m 'Додано нову функцію'`)
4. Надішліть зміни у вашу гілку (`git push origin feature/НоваФункція`)
5. Відкрийте Pull Request

## 📄 Ліцензія

Цей проект ліцензовано за умовами MIT License - дивіться файл [LICENSE](LICENSE) для отримання додаткової інформації.

## 📚 Корисні посилання

- [Документація Playwright](https://playwright.dev/docs/intro)
- [Довідник API Playwright](https://playwright.dev/docs/api/class-playwright)
- [Документація Playwright Test](https://playwright.dev/docs/test-api-testing)
- [Селектори Playwright](https://playwright.dev/docs/selectors)
