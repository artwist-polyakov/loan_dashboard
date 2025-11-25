import type { InputParameters } from '../types/inputs';
import type {
  ComparisonResult,
  StrategyAResult,
  StrategyBResult,
  StrategyCResult,
  PropertyValueScenarios,
} from '../types/results';
import { CURRENT_YEAR, STRATEGY_NAMES } from '../utils/constants';
import {
  calculateAnnuityPayment,
  generateAmortizationSchedule,
  getBalanceAtMonth as getMortgageBalance,
  getTotalPayments,
  getPayoffMonth,
} from './mortgage';
import {
  calculateDepositGrowth,
  getFinalBalance,
  getTotalInterest,
} from './deposit';
import { calculatePropertyValueWithExpected } from './inflation';
import { calculateRentalIncome } from './rental';
import { calculateRenovationCost, calculateRenovationOpportunityCost } from './renovation';

/**
 * Главная функция сравнения трёх стратегий
 */
export function compareStrategies(params: InputParameters): ComparisonResult {
  const {
    propertyPrice,
    downPayment,
    area,
    analysisPeriod,
    mortgageRate,
    loanTerm,
    extraMonthlyPayment,
    depositRate,
    inflationRate,
    useEqualizer,
    yearlyInflation,
    monthlyRent,
    renovationRequired,
    renovationCostPerSqm,
    completionYear,
    expectedPricePerSqmAtSale,
  } = params;

  // Базовые расчёты
  const loanAmount = propertyPrice - downPayment;
  const termMonths = loanTerm * 12;
  const analysisMonths = analysisPeriod * 12;

  // Выбор ставки инфляции (эквалайзер или фиксированная)
  const effectiveInflation = useEqualizer && yearlyInflation.length > 0
    ? yearlyInflation
    : inflationRate;

  // Привязанная ставка вклада (если эквалайзер, ставка = инфляция + 2%)
  const effectiveDepositRate = useEqualizer && yearlyInflation.length > 0
    ? yearlyInflation.map(r => r + 2)
    : depositRate;

  // Аннуитетный платёж
  const annuityPayment = calculateAnnuityPayment(loanAmount, mortgageRate, termMonths);
  const totalMonthlyPayment = annuityPayment + extraMonthlyPayment;

  // График погашения ипотеки
  const mortgageSchedule = generateAmortizationSchedule(
    loanAmount,
    mortgageRate,
    termMonths,
    extraMonthlyPayment
  );

  // Остаток долга через N лет
  const remainingDebt = getMortgageBalance(mortgageSchedule, analysisMonths);

  // Фактический срок кредита (с досрочным погашением)
  const actualLoanTermMonths = getPayoffMonth(mortgageSchedule);

  // Сумма платежей за период анализа
  const mortgagePayments = getTotalPayments(mortgageSchedule, analysisMonths);

  // Стоимость недвижимости через N лет (3 сценария)
  const propertyValueAtEnd = calculatePropertyValueWithExpected({
    currentPrice: propertyPrice,
    inflationRate: effectiveInflation,
    analysisPeriod,
    useYearlyRates: useEqualizer,
    expectedPricePerSqmAtSale,
    area,
  });

  // Стоимость ремонта
  const renovationCost = renovationRequired && area
    ? calculateRenovationCost(
        renovationCostPerSqm,
        area,
        effectiveInflation,
        completionYear,
        CURRENT_YEAR,
        useEqualizer
      )
    : 0;

  // Годы от сдачи дома до конца анализа
  const yearsFromCompletionToEnd = Math.max(0, analysisPeriod - (completionYear - CURRENT_YEAR));

  // Упущенный доход от ремонта (если бы положили на вклад)
  const renovationOpportunityCost = calculateRenovationOpportunityCost(
    renovationCost,
    effectiveDepositRate,
    yearsFromCompletionToEnd,
    useEqualizer
  );

  // Доход от аренды
  const rentalIncome = calculateRentalIncome(
    monthlyRent,
    effectiveInflation,
    analysisPeriod,
    completionYear,
    CURRENT_YEAR,
    useEqualizer
  );

  // === СТРАТЕГИЯ A: Купить и продать ===
  const strategyA = calculateStrategyA(
    propertyValueAtEnd,
    remainingDebt,
    mortgagePayments.totalPaid,
    mortgagePayments.totalInterest,
    downPayment,
    renovationCost
  );

  // === СТРАТЕГИЯ B: Купить и сдавать ===
  const strategyB = calculateStrategyB(
    propertyValueAtEnd,
    remainingDebt,
    mortgagePayments.totalPaid,
    mortgagePayments.totalInterest,
    downPayment,
    renovationCost,
    rentalIncome.total
  );

  // === СТРАТЕГИЯ C: Только вклад ===
  const depositSchedule = calculateDepositGrowth(
    downPayment,
    totalMonthlyPayment,
    effectiveDepositRate,
    analysisMonths,
    useEqualizer
  );

  const strategyC = calculateStrategyC(
    depositSchedule,
    renovationCost,
    renovationOpportunityCost
  );

  // Определение победителя (по базовому сценарию для A и B)
  const strategyAValue = strategyA.profitLoss.base + downPayment + mortgagePayments.totalPaid;
  const strategyBValue = strategyB.netEquity.base + strategyB.totalRentalIncome;
  const strategyCValue = strategyC.finalBalance;

  let winner: 'A' | 'B' | 'C';
  let winnerValue: number;

  if (strategyAValue >= strategyBValue && strategyAValue >= strategyCValue) {
    winner = 'A';
    winnerValue = strategyAValue;
  } else if (strategyBValue >= strategyAValue && strategyBValue >= strategyCValue) {
    winner = 'B';
    winnerValue = strategyBValue;
  } else {
    winner = 'C';
    winnerValue = strategyCValue;
  }

  const worstValue = Math.min(strategyAValue, strategyBValue, strategyCValue);

  return {
    strategyA,
    strategyB,
    strategyC,
    winner,
    winnerName: STRATEGY_NAMES[winner],
    differenceBestVsWorst: winnerValue - worstValue,
    mortgageSchedule,
    depositSchedule,
    annuityPayment,
    loanAmount,
    actualLoanTermMonths,
  };
}

/**
 * Стратегия A: Купить в ипотеку и продать через N лет
 */
function calculateStrategyA(
  propertyValueAtEnd: PropertyValueScenarios,
  remainingDebt: number,
  totalMortgagePayments: number,
  totalInterestPaid: number,
  downPayment: number,
  renovationCost: number
): StrategyAResult {
  // Чистая выручка от продажи = цена - остаток долга
  const netProceedsFromSale: PropertyValueScenarios = {
    pessimistic: propertyValueAtEnd.pessimistic - remainingDebt,
    base: propertyValueAtEnd.base - remainingDebt,
    optimistic: propertyValueAtEnd.optimistic - remainingDebt,
  };

  // Общие вложения (без ремонта, т.к. он увеличивает стоимость)
  const totalInvested = downPayment + totalMortgagePayments;

  // Прибыль/убыток = выручка - вложения (без ремонта)
  const profitLoss: PropertyValueScenarios = {
    pessimistic: netProceedsFromSale.pessimistic - totalInvested,
    base: netProceedsFromSale.base - totalInvested,
    optimistic: netProceedsFromSale.optimistic - totalInvested,
  };

  return {
    propertyValueAtEnd,
    remainingDebt,
    totalMortgagePayments,
    totalInterestPaid,
    downPayment,
    renovationCost,
    netProceedsFromSale,
    profitLoss,
    totalInvested,
  };
}

/**
 * Стратегия B: Купить в ипотеку и сдавать (без продажи)
 */
function calculateStrategyB(
  propertyValueAtEnd: PropertyValueScenarios,
  remainingDebt: number,
  totalMortgagePayments: number,
  totalInterestPaid: number,
  downPayment: number,
  renovationCost: number,
  totalRentalIncome: number
): StrategyBResult {
  // Чистая стоимость актива = рыночная цена - долг
  const netEquity: PropertyValueScenarios = {
    pessimistic: propertyValueAtEnd.pessimistic - remainingDebt,
    base: propertyValueAtEnd.base - remainingDebt,
    optimistic: propertyValueAtEnd.optimistic - remainingDebt,
  };

  // Денежный поток = аренда - ипотечные платежи
  const cashFlow = totalRentalIncome - totalMortgagePayments;

  const totalInvested = downPayment + totalMortgagePayments;

  return {
    propertyValueAtEnd,
    remainingDebt,
    totalMortgagePayments,
    totalInterestPaid,
    downPayment,
    renovationCost,
    totalRentalIncome,
    netEquity,
    cashFlow,
    totalInvested,
  };
}

/**
 * Стратегия C: Только банковский вклад
 */
function calculateStrategyC(
  depositSchedule: ReturnType<typeof calculateDepositGrowth>,
  _renovationCost: number,
  renovationOpportunityCost: number
): StrategyCResult {
  const finalBalance = getFinalBalance(depositSchedule);
  const totalInterestEarned = getTotalInterest(depositSchedule);

  // Общая сумма вложений
  const lastRow = depositSchedule[depositSchedule.length - 1];
  const totalContributions = lastRow?.cumulativeContributions ?? 0;

  return {
    finalBalance,
    totalContributions,
    totalInterestEarned,
    renovationSavingsInterest: renovationOpportunityCost,
  };
}

/**
 * Генерация данных для графика временного ряда
 */
export function generateTimeSeriesData(
  result: ComparisonResult,
  params: InputParameters
): Array<{
  month: number;
  year: number;
  debtBalance: number;
  depositBalance: number;
  mortgageEquity: number;
  propertyValue: number;
  rentalAccumulated: number;
}> {
  const { analysisPeriod, inflationRate, useEqualizer, yearlyInflation, propertyPrice } = params;
  const analysisMonths = analysisPeriod * 12;

  const effectiveInflation = useEqualizer && yearlyInflation.length > 0
    ? yearlyInflation
    : inflationRate;

  const data: Array<{
    month: number;
    year: number;
    debtBalance: number;
    depositBalance: number;
    mortgageEquity: number;
    propertyValue: number;
    rentalAccumulated: number;
  }> = [];

  let rentalAccumulated = 0;

  for (let month = 1; month <= analysisMonths; month++) {
    const year = Math.ceil(month / 12);

    // Остаток долга
    const debtBalance = result.mortgageSchedule[month - 1]?.balance ?? 0;

    // Баланс вклада
    const depositBalance = result.depositSchedule[month - 1]?.balance ?? 0;

    // Стоимость недвижимости (базовый сценарий)
    const yearsElapsed = month / 12;
    let propertyValue = propertyPrice;
    for (let y = 0; y < Math.floor(yearsElapsed); y++) {
      const rate = Array.isArray(effectiveInflation)
        ? effectiveInflation[Math.min(y, effectiveInflation.length - 1)]
        : effectiveInflation;
      propertyValue *= (1 + (rate as number) / 100);
    }
    // Частичный год
    const partialYear = yearsElapsed - Math.floor(yearsElapsed);
    if (partialYear > 0) {
      const rate = Array.isArray(effectiveInflation)
        ? effectiveInflation[Math.min(Math.floor(yearsElapsed), effectiveInflation.length - 1)]
        : effectiveInflation;
      propertyValue *= (1 + (rate as number) / 100 * partialYear);
    }

    // Чистая стоимость недвижимости (капитал)
    const mortgageEquity = Math.round(propertyValue) - debtBalance;

    // Накопленная аренда (примерно)
    const rentalYearIncome = result.strategyB.totalRentalIncome / analysisPeriod;
    rentalAccumulated += rentalYearIncome / 12;

    data.push({
      month,
      year,
      debtBalance,
      depositBalance,
      mortgageEquity,
      propertyValue: Math.round(propertyValue),
      rentalAccumulated: Math.round(rentalAccumulated),
    });
  }

  return data;
}
