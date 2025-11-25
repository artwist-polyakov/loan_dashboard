import { View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../PdfStyles';
import type { ComparisonResult } from '@/lib/types/results';
import type { InputParameters } from '@/lib/types/inputs';
import { formatCurrency, formatMonths, formatPercent } from '@/lib/utils/formatting';

interface DetailsSectionProps {
  result: ComparisonResult;
  inputs: InputParameters;
}

export function DetailsSection({ result, inputs }: DetailsSectionProps) {
  return (
    <View>
      <Text style={styles.h2}>Детализация расчётов</Text>

      {/* Стратегия A */}
      <View style={styles.card}>
        <Text style={styles.h3}>Стратегия A: Ипотека + продажа</Text>

        <View style={styles.grid2}>
          <View style={styles.grid2Item}>
            <Text style={[styles.textMuted, { marginBottom: 4 }]}>Ипотека</Text>
            <DetailRow label="Сумма кредита" value={formatCurrency(result.loanAmount)} />
            <DetailRow label="Ежемесячный платёж" value={formatCurrency(result.annuityPayment)} />
            <DetailRow label="Фактический срок" value={formatMonths(result.actualLoanTermMonths)} />
            <DetailRow label="Всего выплачено" value={formatCurrency(result.strategyA.totalMortgagePayments)} />
            <DetailRow label="В т.ч. проценты" value={formatCurrency(result.strategyA.totalInterestPaid)} />
          </View>

          <View style={styles.grid2Item}>
            <Text style={[styles.textMuted, { marginBottom: 4 }]}>Недвижимость и результат</Text>
            <DetailRow label="Начальная цена" value={formatCurrency(inputs.propertyPrice)} />
            <DetailRow label="Цена (базовый)" value={formatCurrency(result.strategyA.propertyValueAtEnd.base)} />
            <DetailRow label="Остаток долга" value={formatCurrency(result.strategyA.remainingDebt)} />
            <DetailRow label="Выручка от продажи" value={formatCurrency(result.strategyA.netProceedsFromSale.base)} />
            {result.strategyA.renovationCost > 0 && (
              <DetailRow label="Ремонт" value={formatCurrency(result.strategyA.renovationCost)} negative />
            )}
            <DetailRow
              label="Прибыль/убыток"
              value={formatCurrency(result.strategyA.profitLoss.base)}
              highlight
              positive={result.strategyA.profitLoss.base > 0}
            />
          </View>
        </View>
      </View>

      {/* Стратегия B */}
      <View style={styles.card}>
        <Text style={styles.h3}>Стратегия B: Ипотека + аренда</Text>

        <View style={styles.grid2}>
          <View style={styles.grid2Item}>
            <Text style={[styles.textMuted, { marginBottom: 4 }]}>Капитал в недвижимости</Text>
            <DetailRow label="Стоимость недвижимости" value={formatCurrency(result.strategyB.propertyValueAtEnd.base)} />
            <DetailRow label="Остаток долга" value={formatCurrency(result.strategyB.remainingDebt)} />
            <DetailRow label="Чистый капитал" value={formatCurrency(result.strategyB.netEquity.base)} />
            <DetailRow label="Аренда за период" value={formatCurrency(result.strategyB.totalRentalIncome)} />
            <DetailRow label="Ипотека за период" value={formatCurrency(result.strategyB.totalMortgagePayments)} negative />
          </View>

          <View style={styles.grid2Item}>
            <Text style={[styles.textMuted, { marginBottom: 4 }]}>Итоговые показатели</Text>
            <DetailRow label="Доход от аренды" value={formatCurrency(result.strategyB.totalRentalIncome)} />
            <DetailRow label="Выплаты по ипотеке" value={formatCurrency(result.strategyB.totalMortgagePayments)} negative />
            {result.strategyB.renovationCost > 0 && (
              <DetailRow label="Ремонт" value={formatCurrency(result.strategyB.renovationCost)} negative />
            )}
            <DetailRow
              label="Денежный поток"
              value={formatCurrency(result.strategyB.cashFlow)}
              highlight
              positive={result.strategyB.cashFlow > 0}
            />
            <DetailRow
              label="Капитал + аренда"
              value={formatCurrency(result.strategyB.netEquity.base + result.strategyB.totalRentalIncome)}
              highlight
              positive
            />
          </View>
        </View>
      </View>

      {/* Стратегия C */}
      <View style={styles.card}>
        <Text style={styles.h3}>Стратегия C: Банковский вклад</Text>

        <View style={styles.grid2}>
          <View style={styles.grid2Item}>
            <Text style={[styles.textMuted, { marginBottom: 4 }]}>Вклад и доходность</Text>
            <DetailRow label="Начальный взнос" value={formatCurrency(inputs.downPayment)} />
            <DetailRow label="Ежемесячное пополнение" value={formatCurrency(result.annuityPayment + inputs.extraMonthlyPayment)} />
            <DetailRow label="Всего внесено" value={formatCurrency(result.strategyC.totalContributions)} />
            <DetailRow label="Ставка вклада" value={formatPercent(inputs.depositRate)} />
            <DetailRow label="Начислено процентов" value={formatCurrency(result.strategyC.totalInterestEarned)} />
          </View>

          <View style={styles.grid2Item}>
            <Text style={[styles.textMuted, { marginBottom: 4 }]}>Итоговый капитал</Text>
            <DetailRow
              label="Баланс вклада"
              value={formatCurrency(result.strategyC.finalBalance)}
              highlight
              positive
            />
            {result.strategyA.renovationCost > 0 && (
              <>
                <DetailRow label="Сэкономлено на ремонте" value={formatCurrency(result.strategyA.renovationCost)} />
                {result.strategyC.renovationSavingsInterest > 0 && (
                  <DetailRow label="% на сэкономленный ремонт" value={formatCurrency(result.strategyC.renovationSavingsInterest)} />
                )}
                <DetailRow
                  label="Общий капитал"
                  value={formatCurrency(
                    result.strategyC.finalBalance +
                    result.strategyA.renovationCost +
                    result.strategyC.renovationSavingsInterest
                  )}
                  highlight
                  positive
                />
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
  negative?: boolean;
}

function DetailRow({ label, value, highlight, positive, negative }: DetailRowProps) {
  let textColor = undefined;
  if (highlight && positive) textColor = colors.success;
  if (highlight && !positive) textColor = colors.danger;
  if (negative) textColor = colors.danger;

  return (
    <View style={styles.labelValue}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, textColor ? { color: textColor } : {}]}>
        {negative ? '-' : ''}{value}
      </Text>
    </View>
  );
}
