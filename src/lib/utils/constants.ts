// Минимальный первоначальный взнос по семейной ипотеке (%)
export const MIN_DOWN_PAYMENT_PERCENT = 20;

// Максимальный срок кредита (лет)
export const MAX_LOAN_TERM_YEARS = 30;

// Диапазоны значений для валидации
export const VALIDATION_RANGES = {
  propertyPrice: { min: 100_000, max: 1_000_000_000 },
  downPayment: { min: 0, max: 1_000_000_000 },
  area: { min: 1, max: 10_000 },
  analysisPeriod: { min: 1, max: 50 },
  mortgageRate: { min: 0, max: 100 },
  loanTerm: { min: 1, max: MAX_LOAN_TERM_YEARS },
  extraMonthlyPayment: { min: 0, max: 100_000_000 },
  depositRate: { min: 0, max: 100 },
  inflationRate: { min: -10, max: 100 },
  monthlyRent: { min: 0, max: 100_000_000 },
  renovationCostPerSqm: { min: 0, max: 10_000_000 },
  completionYear: { min: 2000, max: 2100 },
} as const;

// Цвета для графиков
export const CHART_COLORS = {
  debt: '#ef4444',          // Красный - долг
  deposit: '#22c55e',       // Зелёный - вклад
  property: '#3b82f6',      // Синий - недвижимость
  rent: '#f59e0b',          // Янтарный - аренда
  payment: '#6366f1',       // Индиго - платёж
  equity: '#8b5cf6',        // Фиолетовый - капитал
  positive: '#16a34a',      // Зелёный - положительное
  negative: '#dc2626',      // Красный - отрицательное
  neutral: '#64748b',       // Серый - нейтральное
} as const;

// Текущий год
export const CURRENT_YEAR = new Date().getFullYear();

// Названия стратегий
export const STRATEGY_NAMES = {
  A: 'Ипотека + продажа',
  B: 'Ипотека + аренда',
  C: 'Банковский вклад',
} as const;
