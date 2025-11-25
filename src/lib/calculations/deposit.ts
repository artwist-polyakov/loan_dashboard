import type { DepositRow } from '../types/results';

/**
 * Расчёт роста вклада с ежемесячными пополнениями
 * Учитывает капитализацию процентов
 *
 * @param initialDeposit - начальный взнос (руб)
 * @param monthlyContribution - ежемесячное пополнение (руб)
 * @param annualRate - годовая ставка (%) или массив ставок по годам
 * @param months - количество месяцев
 * @param useYearlyRates - использовать массив ставок по годам
 * @returns массив строк роста вклада
 */
export function calculateDepositGrowth(
  initialDeposit: number,
  monthlyContribution: number,
  annualRate: number | number[],
  months: number,
  useYearlyRates: boolean = false
): DepositRow[] {
  const schedule: DepositRow[] = [];

  let balance = initialDeposit;
  let cumulativeContributions = initialDeposit;
  let cumulativeInterest = 0;

  for (let month = 1; month <= months; month++) {
    // Определяем ставку для текущего года
    const year = Math.floor((month - 1) / 12);
    let currentRate: number;

    if (useYearlyRates && Array.isArray(annualRate)) {
      currentRate = annualRate[Math.min(year, annualRate.length - 1)] ?? 0;
    } else {
      currentRate = typeof annualRate === 'number' ? annualRate : 0;
    }

    const monthlyRate = currentRate / 100 / 12;

    // Начисление процентов
    const interest = Math.round(balance * monthlyRate);
    cumulativeInterest += interest;

    // Пополнение (кроме первого месяца, т.к. initialDeposit уже учтён)
    const contribution = month === 1 ? 0 : monthlyContribution;
    cumulativeContributions += contribution;

    // Обновляем баланс
    balance = balance + interest + contribution;

    schedule.push({
      month,
      contribution,
      interest,
      balance: Math.round(balance),
      cumulativeContributions,
      cumulativeInterest,
    });
  }

  return schedule;
}

/**
 * Получить итоговый баланс вклада
 */
export function getFinalBalance(schedule: DepositRow[]): number {
  if (schedule.length === 0) return 0;
  return schedule[schedule.length - 1].balance;
}

/**
 * Получить общую сумму процентов
 */
export function getTotalInterest(schedule: DepositRow[]): number {
  if (schedule.length === 0) return 0;
  return schedule[schedule.length - 1].cumulativeInterest;
}

/**
 * Получить баланс на определённый месяц
 */
export function getBalanceAtMonth(schedule: DepositRow[], month: number): number {
  if (month <= 0 || schedule.length === 0) return schedule[0]?.balance ?? 0;
  if (month > schedule.length) return schedule[schedule.length - 1]?.balance ?? 0;
  return schedule[month - 1]?.balance ?? 0;
}

/**
 * Расчёт будущей стоимости единовременного взноса
 * FV = PV × (1 + r)^n
 *
 * @param presentValue - текущая сумма
 * @param annualRate - годовая ставка (%)
 * @param years - количество лет
 * @returns будущая стоимость
 */
export function calculateFutureValue(
  presentValue: number,
  annualRate: number,
  years: number
): number {
  if (years <= 0) return presentValue;
  return Math.round(presentValue * Math.pow(1 + annualRate / 100, years));
}

/**
 * Расчёт упущенного дохода от инвестиции в банк
 * (если бы сумму положили на вклад вместо траты)
 *
 * @param amount - сумма, которая могла быть инвестирована
 * @param annualRate - годовая ставка (%) или массив по годам
 * @param years - количество лет
 * @param useYearlyRates - использовать массив ставок
 * @returns упущенный доход (только проценты)
 */
export function calculateOpportunityCost(
  amount: number,
  annualRate: number | number[],
  years: number,
  useYearlyRates: boolean = false
): number {
  if (years <= 0 || amount <= 0) return 0;

  let futureValue = amount;

  for (let year = 0; year < years; year++) {
    let currentRate: number;

    if (useYearlyRates && Array.isArray(annualRate)) {
      currentRate = annualRate[Math.min(year, annualRate.length - 1)] ?? 0;
    } else {
      currentRate = typeof annualRate === 'number' ? annualRate : 0;
    }

    futureValue *= (1 + currentRate / 100);
  }

  return Math.round(futureValue - amount);
}
