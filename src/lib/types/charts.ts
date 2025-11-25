export interface TimeSeriesDataPoint {
  month: number;
  year: number;
  debtBalance: number;
  depositBalance: number;
  mortgageEquity: number;      // цена недвижимости - долг
  propertyValue: number;
  rentalAccumulated: number;
}

export interface WaterfallDataPoint {
  name: string;
  value: number;
  isTotal?: boolean;
  isPositive?: boolean;
}

export interface RentPaymentDataPoint {
  year: number;
  mortgagePayment: number;  // годовой
  rentalIncome: number;     // годовой
  netCashFlow: number;
}
