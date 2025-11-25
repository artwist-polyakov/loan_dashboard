export interface PropertyValueScenarios {
  pessimistic: number;  // инфляция - 2%
  base: number;         // инфляция
  optimistic: number;   // инфляция + 3%
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface DepositRow {
  month: number;
  contribution: number;
  interest: number;
  balance: number;
  cumulativeContributions: number;
  cumulativeInterest: number;
}

export interface RentalIncome {
  yearly: number[];           // доход по годам
  total: number;              // накопительный итог
  averageMonthlyAtEnd: number;
}

export interface StrategyAResult {
  // Купить и продать
  propertyValueAtEnd: PropertyValueScenarios;
  remainingDebt: number;
  totalMortgagePayments: number;
  totalInterestPaid: number;
  downPayment: number;
  renovationCost: number;
  netProceedsFromSale: PropertyValueScenarios;  // цена - долг
  profitLoss: PropertyValueScenarios;           // выручка - все вложения (без ремонта)
  totalInvested: number;                        // взнос + платежи
}

export interface StrategyBResult {
  // Купить и сдавать
  propertyValueAtEnd: PropertyValueScenarios;
  remainingDebt: number;
  totalMortgagePayments: number;
  totalInterestPaid: number;
  downPayment: number;
  renovationCost: number;
  totalRentalIncome: number;
  netEquity: PropertyValueScenarios;  // цена - долг
  cashFlow: number;                   // аренда - ипотека
  totalInvested: number;
}

export interface StrategyCResult {
  // Только вклад
  finalBalance: number;
  totalContributions: number;
  totalInterestEarned: number;
  renovationSavingsInterest: number;  // если не тратили на ремонт
}

export interface ComparisonResult {
  strategyA: StrategyAResult;
  strategyB: StrategyBResult;
  strategyC: StrategyCResult;
  winner: 'A' | 'B' | 'C';
  winnerName: string;
  differenceBestVsWorst: number;
  mortgageSchedule: AmortizationRow[];
  depositSchedule: DepositRow[];
  annuityPayment: number;
  loanAmount: number;
  actualLoanTermMonths: number;  // с учётом досрочного погашения
}
