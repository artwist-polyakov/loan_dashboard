import type { PropertyValueScenarios } from '../types/results';
import { CURRENT_YEAR } from '../utils/constants';

interface PropertyValueOptions {
  currentPrice: number;
  inflationRate: number | number[];
  analysisPeriod: number;
  useYearlyRates?: boolean;
  // Опциональные параметры для плановой цены на сдачу
  expectedPricePerSqmAtCompletion?: number | null;
  area?: number | null;
  completionYear?: number;
}

/**
 * Расчёт стоимости недвижимости через N лет по трём сценариям
 * С поддержкой плановой цены на момент сдачи дома
 */
export function calculatePropertyValueWithCompletion(
  options: PropertyValueOptions
): PropertyValueScenarios {
  const {
    currentPrice,
    inflationRate,
    analysisPeriod,
    useYearlyRates = false,
    expectedPricePerSqmAtCompletion,
    area,
    completionYear,
  } = options;

  // Если задана плановая цена и площадь — используем её
  if (expectedPricePerSqmAtCompletion && area && completionYear) {
    const yearsToCompletion = Math.max(0, completionYear - CURRENT_YEAR);
    const yearsAfterCompletion = Math.max(0, analysisPeriod - yearsToCompletion);

    // Цена на момент сдачи
    const priceAtCompletion = area * expectedPricePerSqmAtCompletion;

    // Если сдача уже прошла — растим от текущей цены
    if (yearsToCompletion <= 0) {
      return calculatePropertyValue(currentPrice, inflationRate, analysisPeriod, useYearlyRates);
    }

    // Растим от плановой цены на сдачу до конца анализа
    // Используем ставки инфляции начиная с года сдачи
    const inflationFromCompletion = useYearlyRates && Array.isArray(inflationRate)
      ? inflationRate.slice(yearsToCompletion)
      : inflationRate;

    return calculatePropertyValue(
      priceAtCompletion,
      inflationFromCompletion,
      yearsAfterCompletion,
      useYearlyRates
    );
  }

  // Стандартный расчёт
  return calculatePropertyValue(currentPrice, inflationRate, analysisPeriod, useYearlyRates);
}

/**
 * Расчёт стоимости недвижимости через N лет по трём сценариям
 *
 * @param currentPrice - текущая цена (руб)
 * @param inflationRate - годовая инфляция (%) или массив по годам
 * @param years - количество лет
 * @param useYearlyRates - использовать массив ставок
 * @returns три сценария: пессимистичный, базовый, оптимистичный
 */
export function calculatePropertyValue(
  currentPrice: number,
  inflationRate: number | number[],
  years: number,
  useYearlyRates: boolean = false
): PropertyValueScenarios {
  if (years <= 0) {
    return {
      pessimistic: currentPrice,
      base: currentPrice,
      optimistic: currentPrice,
    };
  }

  // Пессимистичный: инфляция - 2% (минимум 0%)
  const pessimistic = indexByInflation(
    currentPrice,
    inflationRate,
    years,
    useYearlyRates,
    -2
  );

  // Базовый: равен инфляции
  const base = indexByInflation(
    currentPrice,
    inflationRate,
    years,
    useYearlyRates,
    0
  );

  // Оптимистичный: инфляция + 3%
  const optimistic = indexByInflation(
    currentPrice,
    inflationRate,
    years,
    useYearlyRates,
    3
  );

  return { pessimistic, base, optimistic };
}

/**
 * Индексация значения по инфляции с поправкой
 *
 * @param baseValue - базовое значение
 * @param inflationRate - годовая инфляция (%) или массив по годам
 * @param years - количество лет
 * @param useYearlyRates - использовать массив ставок
 * @param adjustment - поправка к инфляции в процентных пунктах
 * @returns проиндексированное значение
 */
export function indexByInflation(
  baseValue: number,
  inflationRate: number | number[],
  years: number,
  useYearlyRates: boolean = false,
  adjustment: number = 0
): number {
  if (years <= 0) return baseValue;

  let result = baseValue;

  for (let year = 0; year < years; year++) {
    let currentRate: number;

    if (useYearlyRates && Array.isArray(inflationRate)) {
      currentRate = inflationRate[Math.min(year, inflationRate.length - 1)] ?? 0;
    } else {
      currentRate = typeof inflationRate === 'number' ? inflationRate : 0;
    }

    // Применяем поправку, но не даём ставке уйти ниже -10%
    const effectiveRate = Math.max(currentRate + adjustment, -10);
    result *= (1 + effectiveRate / 100);
  }

  return Math.round(result);
}

/**
 * Расчёт коэффициента инфляции за период
 *
 * @param inflationRate - годовая инфляция (%) или массив по годам
 * @param years - количество лет
 * @param useYearlyRates - использовать массив ставок
 * @returns коэффициент (например, 1.34 означает рост на 34%)
 */
export function getInflationFactor(
  inflationRate: number | number[],
  years: number,
  useYearlyRates: boolean = false
): number {
  if (years <= 0) return 1;

  let factor = 1;

  for (let year = 0; year < years; year++) {
    let currentRate: number;

    if (useYearlyRates && Array.isArray(inflationRate)) {
      currentRate = inflationRate[Math.min(year, inflationRate.length - 1)] ?? 0;
    } else {
      currentRate = typeof inflationRate === 'number' ? inflationRate : 0;
    }

    factor *= (1 + currentRate / 100);
  }

  return factor;
}

/**
 * Генерация массива ставок по годам на основе базовой ставки
 * (для режима эквалайзера)
 *
 * @param baseRate - базовая ставка (%)
 * @param years - количество лет
 * @returns массив ставок
 */
export function generateYearlyRates(baseRate: number, years: number): number[] {
  return Array(years).fill(baseRate);
}

/**
 * Расчёт привязанной ставки вклада к инфляции
 * Обычно ставка вклада = инфляция + премия (например, 2-3%)
 *
 * @param inflationRates - массив инфляции по годам
 * @param premium - премия к инфляции (%, по умолчанию 2)
 * @returns массив ставок вклада по годам
 */
export function calculateLinkedDepositRates(
  inflationRates: number[],
  premium: number = 2
): number[] {
  return inflationRates.map(rate => Math.max(rate + premium, 0));
}
