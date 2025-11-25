import { CURRENT_YEAR } from '../utils/constants';
import { indexByInflation } from './inflation';
import { calculateOpportunityCost } from './deposit';

/**
 * Расчёт стоимости ремонта с учётом инфляции до года сдачи
 *
 * @param costPerSqm - стоимость ремонта за м² (руб)
 * @param area - площадь (м²)
 * @param inflationRate - годовая инфляция (%) или массив по годам
 * @param completionYear - год сдачи дома
 * @param currentYear - текущий год
 * @param useYearlyRates - использовать массив ставок
 * @returns стоимость ремонта на момент сдачи дома
 */
export function calculateRenovationCost(
  costPerSqm: number,
  area: number,
  inflationRate: number | number[],
  completionYear: number,
  currentYear: number = CURRENT_YEAR,
  useYearlyRates: boolean = false
): number {
  if (area <= 0 || costPerSqm <= 0) return 0;

  const baseCost = costPerSqm * area;
  const yearsUntilCompletion = Math.max(0, completionYear - currentYear);

  if (yearsUntilCompletion === 0) {
    return Math.round(baseCost);
  }

  return indexByInflation(
    baseCost,
    inflationRate,
    yearsUntilCompletion,
    useYearlyRates
  );
}

/**
 * Расчёт упущенного дохода от вложения суммы ремонта в банк
 * (если бы не делали ремонт, а положили деньги на вклад)
 *
 * @param renovationCost - стоимость ремонта (уже проиндексированная)
 * @param depositRate - годовая ставка вклада (%) или массив по годам
 * @param yearsFromCompletionToEnd - лет от сдачи до конца анализа
 * @param useYearlyRates - использовать массив ставок
 * @returns упущенный доход (только проценты)
 */
export function calculateRenovationOpportunityCost(
  renovationCost: number,
  depositRate: number | number[],
  yearsFromCompletionToEnd: number,
  useYearlyRates: boolean = false
): number {
  if (renovationCost <= 0 || yearsFromCompletionToEnd <= 0) return 0;

  return calculateOpportunityCost(
    renovationCost,
    depositRate,
    yearsFromCompletionToEnd,
    useYearlyRates
  );
}

/**
 * Расчёт стоимости ремонта за квадратный метр с учётом текущих цен
 *
 * @param propertyPrice - цена недвижимости
 * @param area - площадь
 * @returns цена за м²
 */
export function calculatePricePerSqm(
  propertyPrice: number,
  area: number | null
): number | null {
  if (!area || area <= 0) return null;
  return Math.round(propertyPrice / area);
}

/**
 * Проверка, требуется ли ремонт
 * (на основе года сдачи и текущего года)
 *
 * @param completionYear - год сдачи
 * @param currentYear - текущий год
 * @returns true если дом ещё строится или только сдаётся
 */
export function isRenovationLikelyNeeded(
  completionYear: number,
  currentYear: number = CURRENT_YEAR
): boolean {
  // Если дом сдаётся в текущем году или позже, вероятно нужен ремонт
  return completionYear >= currentYear;
}

/**
 * Год, когда будет сделан ремонт (год сдачи дома)
 */
export function getRenovationYear(
  completionYear: number,
  currentYear: number = CURRENT_YEAR
): number {
  return Math.max(completionYear, currentYear);
}

/**
 * Расчёт общих расходов на недвижимость
 * (первоначальный взнос + ремонт)
 *
 * @param downPayment - первоначальный взнос
 * @param renovationCost - стоимость ремонта
 * @returns общая сумма начальных вложений
 */
export function calculateInitialInvestment(
  downPayment: number,
  renovationCost: number
): number {
  return downPayment + renovationCost;
}
