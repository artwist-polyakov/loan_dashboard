/**
 * Форматирование числа как валюты (рубли)
 */
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} млн ₽`;
    }
    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toFixed(0)} тыс. ₽`;
    }
  }
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Форматирование числа с разделителями тысяч
 */
export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

/**
 * Форматирование процента
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Парсинг строки с числом (убирает пробелы и заменяет запятую на точку)
 */
export function parseNumberInput(value: string): number {
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Форматирование числа для отображения в инпуте
 */
export function formatInputNumber(value: number): string {
  if (value === 0) return '';
  return formatNumber(value);
}

/**
 * Склонение слова по числу
 */
export function pluralize(n: number, forms: [string, string, string]): string {
  const n100 = Math.abs(n) % 100;
  const n10 = n100 % 10;

  if (n100 > 10 && n100 < 20) return forms[2];
  if (n10 > 1 && n10 < 5) return forms[1];
  if (n10 === 1) return forms[0];
  return forms[2];
}

/**
 * Форматирование срока в годах
 */
export function formatYears(years: number): string {
  return `${years} ${pluralize(years, ['год', 'года', 'лет'])}`;
}

/**
 * Форматирование срока в месяцах
 */
export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(formatYears(years));
  }
  if (remainingMonths > 0) {
    parts.push(`${remainingMonths} ${pluralize(remainingMonths, ['месяц', 'месяца', 'месяцев'])}`);
  }

  return parts.join(' ') || '0 месяцев';
}
