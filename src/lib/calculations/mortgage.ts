import type { AmortizationRow } from '../types/results';

/**
 * Расчёт аннуитетного платежа по ипотеке
 * P = S × (i × (1+i)^N) / ((1+i)^N - 1)
 *
 * @param principal - сумма кредита (руб)
 * @param annualRate - годовая процентная ставка (%, например 6)
 * @param termMonths - срок кредита в месяцах
 * @returns ежемесячный платёж (руб)
 */
export function calculateAnnuityPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRate <= 0) return principal / termMonths;

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, termMonths);

  return Math.round(principal * (monthlyRate * factor) / (factor - 1));
}

/**
 * Генерация полного графика погашения ипотеки
 * Учитывает досрочные платежи
 *
 * @param principal - сумма кредита (руб)
 * @param annualRate - годовая процентная ставка (%)
 * @param termMonths - срок кредита в месяцах
 * @param extraPayment - дополнительный ежемесячный платёж (руб)
 * @returns массив строк графика погашения
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number = 0
): AmortizationRow[] {
  if (principal <= 0 || termMonths <= 0) return [];

  const schedule: AmortizationRow[] = [];
  const monthlyRate = annualRate / 100 / 12;
  const basePayment = calculateAnnuityPayment(principal, annualRate, termMonths);

  let balance = principal;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  for (let month = 1; month <= termMonths && balance > 0; month++) {
    // Начисление процентов на текущий остаток
    const interest = Math.round(balance * monthlyRate);

    // Базовый платёж + доплата
    let totalPayment = basePayment + extraPayment;

    // Погашение тела кредита
    let principalPayment = totalPayment - interest;

    // Если платёж больше остатка долга + проценты, корректируем
    if (principalPayment >= balance) {
      principalPayment = balance;
      totalPayment = principalPayment + interest;
    }

    // Обновляем накопленные суммы
    cumulativeInterest += interest;
    cumulativePrincipal += principalPayment;

    // Уменьшаем остаток долга
    balance = Math.max(0, balance - principalPayment);

    schedule.push({
      month,
      payment: totalPayment,
      principal: principalPayment,
      interest,
      balance,
      cumulativeInterest,
      cumulativePrincipal,
    });

    // Кредит погашен досрочно
    if (balance === 0) break;
  }

  return schedule;
}

/**
 * Получить остаток долга на определённый месяц
 */
export function getBalanceAtMonth(
  schedule: AmortizationRow[],
  month: number
): number {
  if (month <= 0) return schedule[0]?.balance ?? 0;
  if (month > schedule.length) return 0;
  return schedule[month - 1]?.balance ?? 0;
}

/**
 * Получить суммарные выплаты за период
 */
export function getTotalPayments(
  schedule: AmortizationRow[],
  months: number
): { totalPaid: number; totalInterest: number; totalPrincipal: number } {
  const relevantRows = schedule.slice(0, months);

  if (relevantRows.length === 0) {
    return { totalPaid: 0, totalInterest: 0, totalPrincipal: 0 };
  }

  const lastRow = relevantRows[relevantRows.length - 1];
  const totalPaid = relevantRows.reduce((sum, row) => sum + row.payment, 0);

  return {
    totalPaid,
    totalInterest: lastRow.cumulativeInterest,
    totalPrincipal: lastRow.cumulativePrincipal,
  };
}

/**
 * Определить месяц полного погашения кредита
 */
export function getPayoffMonth(schedule: AmortizationRow[]): number {
  const lastRow = schedule[schedule.length - 1];
  if (!lastRow || lastRow.balance > 0) {
    return schedule.length;
  }
  return lastRow.month;
}

/**
 * Расчёт сэкономленных процентов при досрочном погашении
 */
export function calculateInterestSaved(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number
): number {
  // График без досрочного погашения
  const scheduleWithout = generateAmortizationSchedule(
    principal,
    annualRate,
    termMonths,
    0
  );

  // График с досрочным погашением
  const scheduleWith = generateAmortizationSchedule(
    principal,
    annualRate,
    termMonths,
    extraPayment
  );

  const interestWithout = scheduleWithout[scheduleWithout.length - 1]?.cumulativeInterest ?? 0;
  const interestWith = scheduleWith[scheduleWith.length - 1]?.cumulativeInterest ?? 0;

  return interestWithout - interestWith;
}

/**
 * Расчёт сокращения срока кредита при досрочном погашении
 */
export function calculateTermReduction(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayment: number
): number {
  if (extraPayment <= 0) return 0;

  const scheduleWith = generateAmortizationSchedule(
    principal,
    annualRate,
    termMonths,
    extraPayment
  );

  return termMonths - getPayoffMonth(scheduleWith);
}
