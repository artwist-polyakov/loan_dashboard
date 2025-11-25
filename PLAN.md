# PLAN.md - Ипотека vs Вклад (Mortgage vs Bank Deposit) Dashboard

## Implementation Plan

**Version:** 1.0
**Created:** 2025-11-25
**Status:** Planning Phase

---

## Краткое содержание

1. [Обзор проекта](#1-обзор-проекта)
2. [Технологический стек](#2-технологический-стек)
3. [Структура проекта](#3-структура-проекта)
4. [Архитектура компонентов](#4-архитектура-компонентов)
5. [Модули расчётов](#5-модули-расчётов)
6. [Управление состоянием](#6-управление-состоянием)
7. [UI/UX компоненты](#7-uiux-компоненты)
8. [Графики и визуализация](#8-графики-и-визуализация)
9. [Стратегия тестирования](#9-стратегия-тестирования)
10. [Развёртывание](#10-развёртывание)
11. [Фазы реализации](#11-фазы-реализации)

---

## 1. Обзор проекта

### 1.1 Назначение
Создать интерактивный SPA-дашборд для сравнения «Семейной ипотеки» (6% годовых) с альтернативным инвестированием в банковский вклад на настраиваемом временном горизонте.

### 1.2 Ключевые функции
- **Панель входных параметров:** Цена недвижимости, первоначальный взнос, площадь, ставки, сроки, инфляция, аренда, ремонт
- **Три стратегии для сравнения:**
  - Стратегия A: Купить в ипотеку и продать через N лет
  - Стратегия B: Купить в ипотеку и сдавать (без продажи)
  - Стратегия C: Положить эквивалентные средства на вклад
- **Динамический режим «Эквалайзер»:** Настройка инфляции и ставок по годам
- **Визуализации:** Временные графики, каскадные диаграммы, сравнительные таблицы
- **Адаптивный дизайн:** Desktop-first с поддержкой мобильных устройств

### 1.3 Ключевые расчёты
- Аннуитетный платёж с поддержкой досрочного погашения
- Сценарии роста цены недвижимости (пессимистичный/базовый/оптимистичный)
- Арендный доход с ежегодной индексацией
- Стоимость ремонта с учётом инфляции
- Рост депозита со сложными процентами и ежемесячными пополнениями

---

## 2. Технологический стек

### 2.1 Основной фреймворк
| Технология | Выбор | Обоснование |
|------------|-------|-------------|
| **Фреймворк** | React 18+ | Компонентный подход, отличная экосистема |
| **Язык** | TypeScript 5.x | Типобезопасность критична для финансовых расчётов |
| **Сборщик** | Vite | Быстрый HMR, оптимизированные билды |
| **Стили** | Tailwind CSS + shadcn/ui | Быстрая разработка, консистентная дизайн-система |

### 2.2 Управление состоянием
| Технология | Выбор | Обоснование |
|------------|-------|-------------|
| **Основное состояние** | Zustand | Легковесный, TypeScript-first |
| **Состояние форм** | React Hook Form + Zod | Валидация, производительность |
| **Производные данные** | useMemo хуки | Автоматический пересчёт |

### 2.3 Визуализация
| Технология | Выбор | Обоснование |
|------------|-------|-------------|
| **Графики** | Recharts | React-native, хорошая поддержка TypeScript |
| **Ползунки эквалайзера** | Custom + Radix UI Slider | Полный контроль над UX |

### 2.4 Инструменты разработки
| Инструмент | Назначение |
|------------|------------|
| **ESLint + Prettier** | Качество кода и форматирование |
| **Vitest** | Юнит-тестирование |
| **Testing Library** | Тестирование компонентов |

### 2.5 Развёртывание
| Платформа | Выбор | Обоснование |
|-----------|-------|-------------|
| **Хостинг** | GitHub Pages | Бесплатно, просто |
| **CI/CD** | GitHub Actions | Автоматические билды и деплой |

---

## 3. Структура проекта

```
loan_dashboard/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
├── public/
│   └── index.html
├── src/
│   ├── components/              # React компоненты
│   │   ├── ui/                  # Базовые UI компоненты (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── card.tsx
│   │   ├── inputs/              # Компоненты ввода
│   │   │   ├── PropertyInputs.tsx
│   │   │   ├── MortgageInputs.tsx
│   │   │   ├── DepositInputs.tsx
│   │   │   ├── RentalInputs.tsx
│   │   │   ├── RenovationInputs.tsx
│   │   │   └── InflationEqualizer.tsx
│   │   ├── results/             # Компоненты отображения результатов
│   │   │   ├── SummaryCards.tsx
│   │   │   ├── StrategyComparison.tsx
│   │   │   ├── DetailedBreakdown.tsx
│   │   │   └── RecommendationBanner.tsx
│   │   ├── charts/              # Компоненты графиков
│   │   │   ├── DebtVsDepositChart.tsx
│   │   │   ├── NetWorthChart.tsx
│   │   │   ├── WaterfallChart.tsx
│   │   │   ├── RentVsPaymentChart.tsx
│   │   │   └── ChartContainer.tsx
│   │   └── layout/              # Компоненты макета
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainLayout.tsx
│   ├── hooks/                   # Кастомные хуки
│   │   ├── useCalculations.ts   # Основной хук расчётов
│   │   ├── useMortgage.ts
│   │   ├── useDeposit.ts
│   │   ├── useRental.ts
│   │   └── useDebounce.ts
│   ├── lib/                     # Логика расчётов
│   │   ├── calculations/
│   │   │   ├── mortgage.ts      # Формулы ипотеки
│   │   │   ├── deposit.ts       # Формулы вклада
│   │   │   ├── inflation.ts     # Индексация
│   │   │   ├── rental.ts        # Арендный доход
│   │   │   ├── renovation.ts    # Стоимость ремонта
│   │   │   └── strategies.ts    # Сравнение стратегий
│   │   ├── utils/
│   │   │   ├── formatting.ts    # Форматирование чисел
│   │   │   ├── validation.ts    # Валидация ввода
│   │   │   └── constants.ts     # Значения по умолчанию
│   │   └── types/
│   │       ├── inputs.ts        # Типы входных параметров
│   │       ├── results.ts       # Типы результатов
│   │       └── charts.ts        # Типы данных графиков
│   ├── store/                   # Zustand stores
│   │   ├── inputStore.ts        # Состояние ввода
│   │   ├── resultsStore.ts      # Результаты расчётов
│   │   └── uiStore.ts           # Состояние UI
│   ├── schemas/                 # Zod схемы валидации
│   │   └── inputSchema.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/
│   ├── unit/
│   │   ├── mortgage.test.ts
│   │   ├── deposit.test.ts
│   │   └── strategies.test.ts
│   └── integration/
│       └── calculations.test.ts
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
├── TASK.md
├── PLAN.md
└── README.md
```

---

## 4. Архитектура компонентов

### 4.1 Иерархия компонентов

```
App
├── MainLayout
│   ├── Header
│   │   └── Logo, Title, InfoButton (модалка с допущениями модели)
│   ├── Sidebar (сворачиваемый на мобильных)
│   │   ├── PropertyInputs
│   │   │   ├── NumberInput (цена)
│   │   │   ├── NumberInput (первоначальный взнос)
│   │   │   ├── NumberInput (площадь, опционально)
│   │   │   └── NumberInput (срок анализа N)
│   │   ├── MortgageInputs
│   │   │   ├── NumberInput (ставка, по умолчанию 6%)
│   │   │   ├── NumberInput (срок кредита)
│   │   │   ├── ReadOnlyDisplay (рассчитанный платёж)
│   │   │   └── NumberInput (дополнительный платёж M)
│   │   ├── DepositInputs
│   │   │   └── NumberInput (ставка вклада)
│   │   ├── InflationInputs
│   │   │   ├── NumberInput (инфляция)
│   │   │   └── Toggle (включить эквалайзер)
│   │   ├── RentalInputs
│   │   │   └── NumberInput (месячная аренда)
│   │   ├── RenovationInputs
│   │   │   ├── Toggle (ремонт требуется)
│   │   │   ├── NumberInput (стоимость за м²)
│   │   │   └── NumberInput (год сдачи дома)
│   │   └── InflationEqualizer (условный)
│   │       ├── YearSlider[] (один на каждый год)
│   │       ├── MiniChart (превью инфляции)
│   │       └── ApplyButton, ResetButton
│   ├── MainContent
│   │   ├── SummaryCards (3 карточки стратегий)
│   │   ├── ChartTabs
│   │   │   ├── DebtVsDepositChart
│   │   │   ├── NetWorthChart
│   │   │   ├── WaterfallChart
│   │   │   └── RentVsPaymentChart
│   │   ├── DetailedBreakdown (раскрываемые таблицы)
│   │   └── RecommendationBanner
│   └── Footer
│       └── Disclaimer, Version
```

---

## 5. Модули расчётов

### 5.1 Основные типы (`src/lib/types/inputs.ts`)

```typescript
interface InputParameters {
  // Недвижимость
  propertyPrice: number;          // руб
  downPayment: number;            // руб
  area: number | null;            // м², опционально
  analysisPeriod: number;         // лет (N)

  // Ипотека
  mortgageRate: number;           // годовых %, напр. 6
  loanTerm: number;               // лет
  extraMonthlyPayment: number;    // руб (M)

  // Вклад
  depositRate: number;            // годовых %, напр. 8

  // Инфляция
  inflationRate: number;          // годовых %, напр. 5
  useEqualizer: boolean;
  yearlyInflation: number[];      // если эквалайзер включён

  // Аренда
  monthlyRent: number;            // руб, текущая

  // Ремонт
  renovationRequired: boolean;
  renovationCostPerSqm: number;   // руб, по умолчанию 170000
  completionYear: number;         // год сдачи дома
}
```

### 5.2 Модуль ипотеки (`src/lib/calculations/mortgage.ts`)

```typescript
// Расчёт аннуитетного платежа
function calculateAnnuityPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number;

// Генерация полного графика погашения
interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
}

function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number
): AmortizationRow[];

// Остаток долга на определённый месяц
function getBalanceAtMonth(
  schedule: AmortizationRow[],
  month: number
): number;

// Суммарные выплаты за период
function getTotalPayments(
  schedule: AmortizationRow[],
  months: number
): { totalPaid: number; totalInterest: number; totalPrincipal: number };

// Определение месяца полного погашения (с досрочными платежами)
function getPayoffMonth(schedule: AmortizationRow[]): number;
```

### 5.3 Модуль вклада (`src/lib/calculations/deposit.ts`)

```typescript
// Расчёт роста вклада с ежемесячными пополнениями
interface DepositRow {
  month: number;
  contribution: number;
  interest: number;
  balance: number;
  cumulativeContributions: number;
  cumulativeInterest: number;
}

function calculateDepositGrowth(
  initialDeposit: number,
  monthlyContribution: number,
  annualRate: number | number[],  // одна ставка или массив по годам
  months: number,
  useYearlyRates: boolean
): DepositRow[];

// Итоговый баланс
function getFinalBalance(schedule: DepositRow[]): number;

// Общий процентный доход
function getTotalInterest(schedule: DepositRow[]): number;
```

### 5.4 Модуль стоимости недвижимости (`src/lib/calculations/inflation.ts`)

```typescript
interface PropertyValueScenarios {
  pessimistic: number;  // инфляция - 2%
  base: number;         // инфляция
  optimistic: number;   // инфляция + 3%
}

function calculatePropertyValue(
  currentPrice: number,
  inflationRate: number | number[],
  years: number,
  useYearlyRates: boolean
): PropertyValueScenarios;

// Индексация значения по инфляции
function indexByInflation(
  baseValue: number,
  inflationRate: number | number[],
  years: number,
  useYearlyRates: boolean
): number;
```

### 5.5 Модуль аренды (`src/lib/calculations/rental.ts`)

```typescript
interface RentalIncome {
  yearly: number[];           // доход по годам
  total: number;              // накопительный итог
  averageMonthlyAtEnd: number;
}

function calculateRentalIncome(
  currentMonthlyRent: number,
  inflationRate: number | number[],
  analysisPeriod: number,
  completionYear: number,
  currentYear: number,
  useYearlyRates: boolean
): RentalIncome;
```

### 5.6 Модуль ремонта (`src/lib/calculations/renovation.ts`)

```typescript
function calculateRenovationCost(
  costPerSqm: number,
  area: number,
  inflationRate: number | number[],
  yearsUntilCompletion: number,
  useYearlyRates: boolean
): number;

function calculateRenovationOpportunityCost(
  renovationCost: number,
  depositRate: number | number[],
  yearsFromCompletionToEnd: number,
  useYearlyRates: boolean
): number;
```

### 5.7 Сравнение стратегий (`src/lib/calculations/strategies.ts`)

```typescript
interface StrategyAResult {  // Купить и продать
  propertyValueAtEnd: PropertyValueScenarios;
  remainingDebt: number;
  totalMortgagePayments: number;
  totalInterestPaid: number;
  renovationCost: number;
  netProceedsFromSale: PropertyValueScenarios;  // цена - долг
  profitLoss: PropertyValueScenarios;           // выручка - все вложения
}

interface StrategyBResult {  // Купить и сдавать
  propertyValueAtEnd: PropertyValueScenarios;
  remainingDebt: number;
  totalMortgagePayments: number;
  totalInterestPaid: number;
  renovationCost: number;
  totalRentalIncome: number;
  netEquity: PropertyValueScenarios;  // цена - долг
  cashFlow: number;                   // аренда - ипотека
}

interface StrategyCResult {  // Только вклад
  finalBalance: number;
  totalContributions: number;
  totalInterestEarned: number;
  renovationSavingsInterest: number;  // если не тратили на ремонт
}

interface ComparisonResult {
  strategyA: StrategyAResult;
  strategyB: StrategyBResult;
  strategyC: StrategyCResult;
  winner: 'A' | 'B' | 'C';
  differenceBestVsWorst: number;
}

function compareStrategies(params: InputParameters): ComparisonResult;
```

### 5.8 Точность вычислений

- Все денежные расчёты ведутся в копейках (целые числа) внутренне
- Конвертация в рубли только при отображении
- Использовать `Math.round()` для финальных значений
- Избегать накопления ошибок округления в циклах

---

## 6. Управление состоянием

### 6.1 Input Store (`src/store/inputStore.ts`)

```typescript
interface InputStore {
  // Состояние
  inputs: InputParameters;

  // Действия
  setInput: <K extends keyof InputParameters>(
    key: K,
    value: InputParameters[K]
  ) => void;
  setMultipleInputs: (updates: Partial<InputParameters>) => void;
  resetToDefaults: () => void;

  // Эквалайзер
  setYearlyInflation: (year: number, rate: number) => void;
  applyEqualizer: () => void;
  resetEqualizer: () => void;
}
```

### 6.2 Results Store (`src/store/resultsStore.ts`)

```typescript
interface ResultsStore {
  // Состояние
  results: ComparisonResult | null;
  isCalculating: boolean;
  lastCalculatedAt: Date | null;

  // Производные данные для графиков
  mortgageSchedule: AmortizationRow[];
  depositSchedule: DepositRow[];
  timeSeriesData: TimeSeriesDataPoint[];

  // Действия
  calculate: (inputs: InputParameters) => void;
  clearResults: () => void;
}
```

### 6.3 UI Store (`src/store/uiStore.ts`)

```typescript
interface UIStore {
  // Состояния панелей
  sidebarCollapsed: boolean;
  activeChartTab: 'debtDeposit' | 'netWorth' | 'waterfall' | 'rentPayment';
  equalizerExpanded: boolean;

  // Модальные окна
  infoModalOpen: boolean;

  // Действия
  toggleSidebar: () => void;
  setActiveChartTab: (tab: string) => void;
  toggleEqualizer: () => void;
  openInfoModal: () => void;
  closeInfoModal: () => void;
}
```

### 6.4 Хук автопересчёта

```typescript
// src/hooks/useCalculations.ts
function useCalculations() {
  const inputs = useInputStore(state => state.inputs);
  const calculate = useResultsStore(state => state.calculate);

  // Debounce чтобы избежать лишних пересчётов
  const debouncedInputs = useDebounce(inputs, 300);

  useEffect(() => {
    calculate(debouncedInputs);
  }, [debouncedInputs, calculate]);

  return useResultsStore(state => state.results);
}
```

---

## 7. UI/UX компоненты

### 7.1 Дизайн-система

**Цвета:**
```css
--primary: #2563eb;       /* Синий - основные действия */
--success: #16a34a;       /* Зелёный - положительные результаты */
--warning: #ca8a04;       /* Жёлтый - нейтральный/осторожность */
--danger: #dc2626;        /* Красный - отрицательные результаты */
--neutral-50 to 900       /* Серая шкала для текста/фона */
```

**Типографика:**
- Заголовки: Inter или системный sans-serif
- Числа: Tabular figures для выравнивания
- Весь текст на русском языке

### 7.2 Компоненты ввода

**NumberInput:**
- Разделители тысяч при вводе
- Суффикс валюты/единицы (₽, %, лет, м²)
- Валидация min/max
- Стилизация ошибок
- Тултип с описанием

**Slider (для эквалайзера):**
- Вертикальная ориентация
- Диапазон: 0-30%
- Шаг: 0.5%
- Подпись текущего значения
- Подпись года снизу

---

## 8. Графики и визуализация

### 8.1 График «Долг vs Вклад»

**Тип:** Линейный график с двумя осями Y

**Данные:**
```typescript
interface DebtDepositDataPoint {
  month: number;
  year: number;
  debtBalance: number;
  depositBalance: number;
}
```

**Особенности:**
- Левая ось Y: Долг (убывающий)
- Правая ось Y: Вклад (растущий)
- Ось X: Время (месяцы или годы)
- Интерактивные тултипы
- Легенда с переключением видимости

### 8.2 График чистой стоимости

**Тип:** Многолинейный график

**Данные:**
```typescript
interface NetWorthDataPoint {
  month: number;
  year: number;
  mortgageEquity: number;      // цена недвижимости - долг
  depositBalance: number;
  rentalAccumulated: number;   // для контекста стратегии B
}
```

### 8.3 Каскадная диаграмма (Waterfall)

**Тип:** Каскадная/водопадная диаграмма

**Данные:**
- Начальный капитал
- + Рост стоимости недвижимости
- - Уплаченные проценты
- - Стоимость ремонта
- + Арендный доход (для B)
- = Итоговая позиция

### 8.4 График «Аренда vs Платёж»

**Тип:** Сгруппированная столбчатая диаграмма

**Данные:**
```typescript
interface RentPaymentDataPoint {
  year: number;
  mortgagePayment: number;  // годовой
  rentalIncome: number;     // годовой
  netCashFlow: number;
}
```

---

## 9. Стратегия тестирования

### 9.1 Юнит-тесты (Vitest)

**Целевое покрытие:** 90%+ для модулей расчётов

**Тесты ипотеки:**
```typescript
// tests/unit/mortgage.test.ts
describe('calculateAnnuityPayment', () => {
  it('вычисляет корректный платёж для стандартного кредита', () => {
    // S = 5,000,000, ставка = 6%, срок = 15 лет
    // Ожидаемо: ~42,200 ₽
    const payment = calculateAnnuityPayment(5_000_000, 0.06, 180);
    expect(payment).toBeCloseTo(42_194, 0);
  });

  it('обрабатывает нулевую процентную ставку', () => { /* ... */ });
  it('обрабатывает очень короткий срок', () => { /* ... */ });
});
```

### 9.2 Интеграционные тесты

```typescript
// tests/integration/calculations.test.ts
describe('Полный цикл расчётов', () => {
  it('производит консистентные результаты по стратегиям', () => {
    const params = createTestParams();
    const results = compareStrategies(params);

    // Общие вложения должны быть одинаковы
    expect(results.strategyA.totalInvested)
      .toEqual(results.strategyC.totalContributions);
  });
});
```

---

## 10. Развёртывание

### 10.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

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

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          BASE_URL: /loan_dashboard/

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 10.2 Конфигурация Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
});
```

---

## 11. Фазы реализации

### Фаза 1: Настройка проекта
- [ ] Инициализация Vite + React + TypeScript
- [ ] Настройка Tailwind CSS
- [ ] Настройка ESLint, Prettier
- [ ] Создание структуры папок
- [ ] Установка зависимостей

### Фаза 2: Ядро расчётов
- [ ] Реализация расчётов ипотеки
- [ ] Реализация расчётов вклада
- [ ] Реализация логики инфляции/индексации
- [ ] Реализация расчётов аренды
- [ ] Реализация расчётов ремонта
- [ ] Написание юнит-тестов
- [ ] Верификация на примерах из TASK.md

### Фаза 3: Управление состоянием
- [ ] Создание Zustand stores
- [ ] Реализация валидации с Zod
- [ ] Создание хуков расчётов
- [ ] Настройка автопересчёта

### Фаза 4: UI ввода
- [ ] Сборка базовых UI компонентов (shadcn/ui)
- [ ] Сборка PropertyInputs
- [ ] Сборка MortgageInputs
- [ ] Сборка DepositInputs
- [ ] Сборка RentalInputs
- [ ] Сборка RenovationInputs
- [ ] Реализация обратной связи валидации
- [ ] Добавление тултипов и подсказок

### Фаза 5: Эквалайзер
- [ ] Сборка компонента слайдера
- [ ] Сборка панели InflationEqualizer
- [ ] Реализация превью-графика
- [ ] Подключение к расчётам с годовыми ставками

### Фаза 6: Отображение результатов
- [ ] Сборка SummaryCards
- [ ] Сборка DetailedBreakdown
- [ ] Сборка RecommendationBanner
- [ ] Реализация форматирования чисел

### Фаза 7: Графики
- [ ] Настройка Recharts
- [ ] Сборка DebtVsDepositChart
- [ ] Сборка NetWorthChart
- [ ] Сборка WaterfallChart
- [ ] Сборка RentVsPaymentChart
- [ ] Добавление интерактивности и тултипов

### Фаза 8: Макет и адаптивность
- [ ] Сборка MainLayout
- [ ] Сборка Header с модальным окном информации
- [ ] Сборка Sidebar
- [ ] Реализация адаптивного дизайна
- [ ] Тестирование на разных размерах экрана

### Фаза 9: Полировка и тестирование
- [ ] Добавление состояний загрузки
- [ ] Добавление обработки ошибок
- [ ] Написание интеграционных тестов
- [ ] UX-тестирование
- [ ] Оптимизация производительности
- [ ] Добавление документации допущений модели

### Фаза 10: Развёртывание
- [ ] Настройка GitHub Actions
- [ ] Настройка GitHub Pages
- [ ] Деплой на продакшн
- [ ] Тестирование продакшн-билда
- [ ] Написание README.md

---

## Приложение A: Значения по умолчанию

```typescript
const DEFAULT_INPUTS: InputParameters = {
  propertyPrice: 10_000_000,
  downPayment: 2_000_000,
  area: null,
  analysisPeriod: 10,
  mortgageRate: 6,
  loanTerm: 30,
  extraMonthlyPayment: 0,
  depositRate: 8,
  inflationRate: 5,
  useEqualizer: false,
  yearlyInflation: [],
  monthlyRent: 50_000,
  renovationRequired: true,
  renovationCostPerSqm: 170_000,
  completionYear: new Date().getFullYear(),
};
```

---

*Конец плана реализации*
