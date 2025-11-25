import { View, Text } from '@react-pdf/renderer';
import { styles, colors } from '../PdfStyles';
import type { ComparisonResult } from '@/lib/types/results';
import type { InputParameters } from '@/lib/types/inputs';
import { formatCurrency, formatYears } from '@/lib/utils/formatting';
import { STRATEGY_NAMES } from '@/lib/utils/constants';

interface TitleSectionProps {
  result: ComparisonResult;
  inputs: InputParameters;
  date: string;
}

export function TitleSection({ result, inputs, date }: TitleSectionProps) {
  return (
    <View>
      {/* Заголовок */}
      <View style={styles.pageHeader}>
        <Text style={styles.h1}>Сравнение стратегий: Ипотека vs Вклад</Text>
        <Text style={styles.textMuted}>
          Отчёт сгенерирован {date} | Период анализа: {formatYears(inputs.analysisPeriod)}
        </Text>
      </View>

      {/* Блок победителя */}
      <View style={styles.winnerBlock}>
        <Text style={styles.winnerTitle}>
          Лучшая стратегия: {result.winnerName}
        </Text>
        <Text style={styles.text}>
          Преимущество над худшей стратегией: +{formatCurrency(result.differenceBestVsWorst, true)}
        </Text>
      </View>

      {/* Три карточки стратегий */}
      <View style={styles.grid3}>
        <StrategyCard
          title={STRATEGY_NAMES.A}
          isWinner={result.winner === 'A'}
          primaryValue={result.strategyA.netProceedsFromSale.base}
          primaryLabel="Выручка от продажи"
          items={[
            { label: 'Цена через N лет', value: result.strategyA.propertyValueAtEnd.base },
            { label: 'Остаток долга', value: -result.strategyA.remainingDebt },
            { label: 'Прибыль/убыток', value: result.strategyA.profitLoss.base, highlight: true },
          ]}
        />

        <StrategyCard
          title={STRATEGY_NAMES.B}
          isWinner={result.winner === 'B'}
          primaryValue={result.strategyB.netEquity.base + result.strategyB.totalRentalIncome}
          primaryLabel="Капитал + аренда"
          items={[
            { label: 'Чистый капитал', value: result.strategyB.netEquity.base },
            { label: 'Доход от аренды', value: result.strategyB.totalRentalIncome },
            { label: 'Денежный поток', value: result.strategyB.cashFlow, highlight: true },
          ]}
        />

        <StrategyCard
          title={STRATEGY_NAMES.C}
          isWinner={result.winner === 'C'}
          primaryValue={result.strategyC.finalBalance}
          primaryLabel="Итого на вкладе"
          items={[
            { label: 'Внесено', value: result.strategyC.totalContributions },
            { label: 'Проценты', value: result.strategyC.totalInterestEarned },
            { label: 'Доходность', value: result.strategyC.totalInterestEarned, highlight: true },
          ]}
        />
      </View>
    </View>
  );
}

interface StrategyCardProps {
  title: string;
  isWinner: boolean;
  primaryValue: number;
  primaryLabel: string;
  items: Array<{ label: string; value: number; highlight?: boolean }>;
}

function StrategyCard({ title, isWinner, primaryValue, primaryLabel, items }: StrategyCardProps) {
  return (
    <View style={[styles.card, styles.gridItem]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        {isWinner && <Text style={styles.cardBadge}>Лучший</Text>}
      </View>

      <Text style={styles.textMuted}>{primaryLabel}</Text>
      <Text style={[styles.h2, { marginTop: 2, marginBottom: 8 }]}>
        {formatCurrency(primaryValue, true)}
      </Text>

      {items.map((item, index) => {
        let textColor = undefined;
        if (item.highlight && item.value > 0) textColor = colors.success;
        if (item.highlight && item.value < 0) textColor = colors.danger;

        return (
          <View key={index} style={styles.labelValue}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={[styles.value, textColor ? { color: textColor } : {}]}>
              {item.value >= 0 ? '+' : ''}
              {formatCurrency(item.value, true)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
