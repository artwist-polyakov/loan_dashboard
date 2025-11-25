import { useComparisonResult } from '@/hooks/useCalculations';
import { useInputStore } from '@/store/inputStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatMonths } from '@/lib/utils/formatting';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';

interface BreakdownRowProps {
  label: string;
  value: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
  indent?: boolean;
}

function BreakdownRow({ label, value, isSubtotal, isTotal, indent }: BreakdownRowProps) {
  return (
    <div
      className={cn(
        'flex justify-between py-1',
        isSubtotal && 'border-t font-medium',
        isTotal && 'border-t-2 font-bold text-lg',
        indent && 'pl-4 text-muted'
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'tabular-nums',
          value > 0 && isTotal && 'text-success',
          value < 0 && isTotal && 'text-danger'
        )}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export function DetailedBreakdown() {
  const result = useComparisonResult();
  const { inputs } = useInputStore();
  const [openSections, setOpenSections] = useState<string[]>(['mortgage']);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Детальная разбивка</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ипотека */}
        <Collapsible.Root
          open={openSections.includes('mortgage')}
          onOpenChange={() => toggleSection('mortgage')}
        >
          <Collapsible.Trigger className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 hover:bg-muted/20">
            <span className="font-medium">Ипотека</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                openSections.includes('mortgage') && 'rotate-180'
              )}
            />
          </Collapsible.Trigger>
          <Collapsible.Content className="px-3 pt-2">
            <BreakdownRow label="Сумма кредита" value={result.loanAmount} />
            <BreakdownRow label="Ежемесячный платёж" value={result.annuityPayment} />
            {inputs.extraMonthlyPayment > 0 && (
              <BreakdownRow
                label="Доп. платёж"
                value={inputs.extraMonthlyPayment}
                indent
              />
            )}
            <BreakdownRow
              label="Фактический срок"
              value={0}
            />
            <div className="py-1 text-sm text-muted">
              {formatMonths(result.actualLoanTermMonths)}
            </div>
            <BreakdownRow
              label="Первоначальный взнос"
              value={result.strategyA.downPayment}
            />
            <BreakdownRow
              label="Выплачено за период"
              value={result.strategyA.totalMortgagePayments}
              isSubtotal
            />
            <BreakdownRow
              label="из них проценты"
              value={result.strategyA.totalInterestPaid}
              indent
            />
            <BreakdownRow
              label="Остаток долга"
              value={result.strategyA.remainingDebt}
            />
            <BreakdownRow
              label="Всего вложено"
              value={result.strategyA.totalInvested}
              isTotal
            />
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Недвижимость */}
        <Collapsible.Root
          open={openSections.includes('property')}
          onOpenChange={() => toggleSection('property')}
        >
          <Collapsible.Trigger className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 hover:bg-muted/20">
            <span className="font-medium">Недвижимость</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                openSections.includes('property') && 'rotate-180'
              )}
            />
          </Collapsible.Trigger>
          <Collapsible.Content className="px-3 pt-2">
            <BreakdownRow label="Начальная цена" value={inputs.propertyPrice} />
            <BreakdownRow
              label="Цена (пессимистичная)"
              value={result.strategyA.propertyValueAtEnd.pessimistic}
              indent
            />
            <BreakdownRow
              label="Цена (базовая)"
              value={result.strategyA.propertyValueAtEnd.base}
            />
            <BreakdownRow
              label="Цена (оптимистичная)"
              value={result.strategyA.propertyValueAtEnd.optimistic}
              indent
            />
            {result.strategyA.renovationCost > 0 && (
              <BreakdownRow
                label="Стоимость ремонта"
                value={result.strategyA.renovationCost}
              />
            )}
            <BreakdownRow
              label="Чистая выручка (базовая)"
              value={result.strategyA.netProceedsFromSale.base}
              isSubtotal
            />
            <BreakdownRow
              label="Прибыль/убыток"
              value={result.strategyA.profitLoss.base}
              isTotal
            />
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Аренда */}
        <Collapsible.Root
          open={openSections.includes('rental')}
          onOpenChange={() => toggleSection('rental')}
        >
          <Collapsible.Trigger className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 hover:bg-muted/20">
            <span className="font-medium">Аренда</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                openSections.includes('rental') && 'rotate-180'
              )}
            />
          </Collapsible.Trigger>
          <Collapsible.Content className="px-3 pt-2">
            <BreakdownRow label="Начальная аренда" value={inputs.monthlyRent * 12} />
            <BreakdownRow
              label="Доход за период"
              value={result.strategyB.totalRentalIncome}
              isSubtotal
            />
            <BreakdownRow
              label="Денежный поток"
              value={result.strategyB.cashFlow}
              isTotal
            />
          </Collapsible.Content>
        </Collapsible.Root>

        {/* Вклад */}
        <Collapsible.Root
          open={openSections.includes('deposit')}
          onOpenChange={() => toggleSection('deposit')}
        >
          <Collapsible.Trigger className="flex w-full items-center justify-between rounded-md bg-muted/10 p-3 hover:bg-muted/20">
            <span className="font-medium">Банковский вклад</span>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform',
                openSections.includes('deposit') && 'rotate-180'
              )}
            />
          </Collapsible.Trigger>
          <Collapsible.Content className="px-3 pt-2">
            <BreakdownRow
              label="Начальный взнос"
              value={inputs.downPayment}
            />
            <BreakdownRow
              label="Ежемесячные пополнения"
              value={result.annuityPayment + inputs.extraMonthlyPayment}
            />
            <BreakdownRow
              label="Всего внесено"
              value={result.strategyC.totalContributions}
              isSubtotal
            />
            <BreakdownRow
              label="Начислено процентов"
              value={result.strategyC.totalInterestEarned}
            />
            <BreakdownRow
              label="Итого на счёте"
              value={result.strategyC.finalBalance}
              isTotal
            />
          </Collapsible.Content>
        </Collapsible.Root>
      </CardContent>
    </Card>
  );
}
