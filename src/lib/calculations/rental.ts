import type { RentalIncome } from '../types/results';
import { CURRENT_YEAR } from '../utils/constants';

/**
 * Расчёт дохода от аренды за период
 * Учитывает год сдачи дома и ежегодную индексацию
 *
 * @param currentMonthlyRent - текущая месячная арендная плата (руб)
 * @param inflationRate - годовая инфляция (%) или массив по годам
 * @param analysisPeriod - период анализа (лет)
 * @param completionYear - год сдачи дома
 * @param currentYear - текущий год
 * @param useYearlyRates - использовать массив ставок
 * @returns объект с доходами по годам и общей суммой
 */
export function calculateRentalIncome(
  currentMonthlyRent: number,
  inflationRate: number | number[],
  analysisPeriod: number,
  completionYear: number,
  currentYear: number = CURRENT_YEAR,
  useYearlyRates: boolean = false
): RentalIncome {
  const yearly: number[] = [];
  let total = 0;
  let monthlyRent = currentMonthlyRent;

  // Количество лет до сдачи дома
  const yearsUntilCompletion = Math.max(0, completionYear - currentYear);

  for (let year = 0; year < analysisPeriod; year++) {
    // Если дом ещё не сдан, аренды нет
    if (year < yearsUntilCompletion) {
      yearly.push(0);

      // Но индексируем ставку аренды на будущее
      const rate = getInflationRateForYear(inflationRate, year, useYearlyRates);
      monthlyRent = Math.round(monthlyRent * (1 + rate / 100));

      continue;
    }

    // Дом сдан, начинаем получать аренду
    const yearlyIncome = Math.round(monthlyRent * 12);
    yearly.push(yearlyIncome);
    total += yearlyIncome;

    // Индексация на следующий год
    if (year < analysisPeriod - 1) {
      const rate = getInflationRateForYear(inflationRate, year, useYearlyRates);
      monthlyRent = Math.round(monthlyRent * (1 + rate / 100));
    }
  }

  return {
    yearly,
    total,
    averageMonthlyAtEnd: monthlyRent,
  };
}

/**
 * Получить ставку инфляции для конкретного года
 */
function getInflationRateForYear(
  inflationRate: number | number[],
  year: number,
  useYearlyRates: boolean
): number {
  if (useYearlyRates && Array.isArray(inflationRate)) {
    return inflationRate[Math.min(year, inflationRate.length - 1)] ?? 0;
  }
  return typeof inflationRate === 'number' ? inflationRate : 0;
}

/**
 * Расчёт ежемесячного денежного потока (аренда - ипотека)
 *
 * @param monthlyRent - месячная аренда
 * @param monthlyMortgagePayment - месячный платёж по ипотеке
 * @returns денежный поток (положительный = прибыль)
 */
export function calculateMonthlyCashFlow(
  monthlyRent: number,
  monthlyMortgagePayment: number
): number {
  return monthlyRent - monthlyMortgagePayment;
}

/**
 * Расчёт доходности от аренды (yield)
 * Годовая аренда / Стоимость недвижимости × 100%
 *
 * @param monthlyRent - месячная аренда
 * @param propertyValue - стоимость недвижимости
 * @returns доходность в процентах
 */
export function calculateRentalYield(
  monthlyRent: number,
  propertyValue: number
): number {
  if (propertyValue <= 0) return 0;
  return (monthlyRent * 12 / propertyValue) * 100;
}

/**
 * Расчёт накопленного дохода от аренды по месяцам
 * (для графиков)
 *
 * @param rentalIncome - объект с годовыми доходами
 * @param analysisPeriod - период в годах
 * @returns массив накопленных доходов по месяцам
 */
export function calculateCumulativeRentalIncome(
  rentalIncome: RentalIncome,
  analysisPeriod: number
): number[] {
  const monthly: number[] = [];
  let cumulative = 0;

  for (let year = 0; year < analysisPeriod; year++) {
    const yearlyIncome = rentalIncome.yearly[year] ?? 0;
    const monthlyIncome = yearlyIncome / 12;

    for (let month = 0; month < 12; month++) {
      cumulative += monthlyIncome;
      monthly.push(Math.round(cumulative));
    }
  }

  return monthly;
}
