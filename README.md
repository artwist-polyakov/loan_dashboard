# Ипотека vs Вклад

Интерактивный дашборд для сравнения финансовых стратегий: семейная ипотека (6%) vs банковский вклад.

## Деплой на GitHub Pages

### 1. Создай репозиторий и запушь

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/loan_dashboard.git
git push -u origin main
```

### 2. Создай workflow

Создай файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          BASE_URL: /loan_dashboard/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 3. Включи Pages

Settings → Pages → Source: **GitHub Actions**

### 4. Запушь

```bash
git add .
git commit -m "Add deploy"
git push
```

Через ~2 мин сайт: `https://USERNAME.github.io/loan_dashboard/`

---

## Локально

```bash
npm install
npm run dev      # localhost:5173
npm run build    # сборка
```
