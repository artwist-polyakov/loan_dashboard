import { useComparisonResult } from '@/hooks/useCalculations';
import { useInputStore } from '@/store/inputStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatYears } from '@/lib/utils/formatting';
import { STRATEGY_NAMES } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';
import { TrendingUp, Home, Landmark, Trophy } from 'lucide-react';

export function SummaryCards() {
  const result = useComparisonResult();
  const { inputs } = useInputStore();

  // Рассчитываем итоговые значения для каждой стратегии (для сравнения)
  const renovationCost = result.strategyA.renovationCost;

  const strategyAValue = result.strategyA.netProceedsFromSale.base - renovationCost;
  const strategyBValue = result.strategyB.netEquity.base + result.strategyB.totalRentalIncome - renovationCost;
  const strategyCValue = result.strategyC.finalBalance + renovationCost + result.strategyC.renovationSavingsInterest;

  // Функция для генерации текста сравнения
  const getComparisonText = (currentId: 'A' | 'B' | 'C') => {
    const values = { A: strategyAValue, B: strategyBValue, C: strategyCValue };
    const names = { A: 'ипотеки с продажей', B: 'ипотеки с арендой', C: 'вклада' };
    const currentValue = values[currentId];

    const comparisons = (Object.keys(values) as Array<'A' | 'B' | 'C'>)
      .filter(id => id !== currentId)
      .map(id => {
        const diff = currentValue - values[id];
        const sign = diff >= 0 ? '+' : '';
        return `${sign}${formatCurrency(diff, true)} от ${names[id]}`;
      });

    return comparisons.join(', ');
  };

  const cards = [
    {
      id: 'A' as const,
      title: STRATEGY_NAMES.A,
      icon: Home,
      primaryValue: result.strategyA.netProceedsFromSale.base - renovationCost,
      primaryLabel: 'Итого на руках',
      secondaryItems: [
        { label: 'Выручка от продажи', value: result.strategyA.netProceedsFromSale.base },
        ...(result.strategyA.renovationCost > 0
          ? [{ label: 'Ремонт (затраты)', value: -result.strategyA.renovationCost }]
          : []),
        { label: 'Прибыль/убыток', value: result.strategyA.profitLoss.base, highlight: true },
      ],
    },
    {
      id: 'B' as const,
      title: STRATEGY_NAMES.B,
      icon: TrendingUp,
      primaryValue: result.strategyB.netEquity.base + result.strategyB.totalRentalIncome - renovationCost,
      primaryLabel: 'Итого на руках',
      secondaryItems: [
        { label: 'Чистый капитал', value: result.strategyB.netEquity.base },
        { label: 'Доход от аренды', value: result.strategyB.totalRentalIncome },
        ...(result.strategyB.renovationCost > 0
          ? [{ label: 'Ремонт (затраты)', value: -result.strategyB.renovationCost }]
          : []),
        { label: 'Денежный поток', value: result.strategyB.cashFlow, highlight: true },
      ],
    },
    {
      id: 'C' as const,
      title: STRATEGY_NAMES.C,
      icon: Landmark,
      primaryValue: result.strategyC.finalBalance + (result.strategyA.renovationCost > 0
        ? result.strategyA.renovationCost + result.strategyC.renovationSavingsInterest
        : 0),
      primaryLabel: 'Итого на руках',
      secondaryItems: [
        { label: 'На вкладе', value: result.strategyC.finalBalance },
        { label: 'Проценты по вкладу', value: result.strategyC.totalInterestEarned },
        ...(result.strategyA.renovationCost > 0
          ? [
              { label: 'Ремонт (не потратили)', value: result.strategyA.renovationCost },
              { label: '% на сэкономленный ремонт', value: result.strategyC.renovationSavingsInterest },
            ]
          : []),
        { label: 'Доходность', value: result.strategyC.totalInterestEarned + result.strategyC.renovationSavingsInterest, highlight: true },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        Результаты через {formatYears(inputs.analysisPeriod)}
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const isWinner = result.winner === card.id;
          const Icon = card.icon;

          return (
            <Card
              key={card.id}
              className={cn(
                'relative overflow-hidden transition-shadow',
                isWinner && 'ring-2 ring-success shadow-lg'
              )}
            >
              {isWinner && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 rounded-full bg-success px-2 py-1 text-xs font-medium text-white">
                    <Trophy className="h-3 w-3" />
                    Лучший
                  </div>
                </div>
              )}

              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4" />
                  {card.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted">{card.primaryLabel}</div>
                  <div className="text-2xl font-bold tabular-nums">
                    {formatCurrency(card.primaryValue, true)}
                  </div>
                </div>

                <div className="space-y-2 border-t pt-3">
                  {card.secondaryItems.map((item, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex justify-between text-sm',
                        item.highlight && 'font-medium'
                      )}
                    >
                      <span className="text-muted">{item.label}</span>
                      <span
                        className={cn(
                          'tabular-nums',
                          item.highlight && item.value > 0 && 'text-success',
                          item.highlight && item.value < 0 && 'text-danger'
                        )}
                      >
                        {item.value >= 0 ? '+' : ''}
                        {formatCurrency(item.value, true)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t text-xs text-muted italic">
                  {getComparisonText(card.id)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted">Лучшая стратегия</div>
              <div className="text-lg font-semibold">{result.winnerName}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted">Преимущество</div>
              <div className="text-lg font-semibold text-success tabular-nums">
                +{formatCurrency(result.differenceBestVsWorst, true)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
