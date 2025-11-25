export interface InputParameters {
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
  renovationReturnRate: number;   // % возврата ремонта при продаже, по умолчанию 60
  completionYear: number;         // год сдачи дома

  // Плановая цена при продаже
  expectedPricePerSqmAtSale: number | null;  // руб/м², ожидаемая цена на момент продажи (конец периода)
}

export const DEFAULT_INPUTS: InputParameters = {
  propertyPrice: 10_000_000,
  downPayment: 2_000_000,
  area: 50,
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
  renovationReturnRate: 60,
  completionYear: new Date().getFullYear(),
  expectedPricePerSqmAtSale: null,
};
