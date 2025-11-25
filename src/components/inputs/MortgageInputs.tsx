import { useInputStore } from '@/store/inputStore';
import { NumberInput } from './NumberInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VALIDATION_RANGES } from '@/lib/utils/constants';
import { useComparisonResult } from '@/hooks/useCalculations';
import { formatCurrency, formatMonths } from '@/lib/utils/formatting';
import { Building2 } from 'lucide-react';

export function MortgageInputs() {
  const { inputs, setInput } = useInputStore();
  const result = useComparisonResult();

  const loanAmount = inputs.propertyPrice - inputs.downPayment;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="h-4 w-4" />
          Ипотека
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted/10 p-3">
          <div className="text-sm text-muted">Сумма кредита</div>
          <div className="text-lg font-semibold tabular-nums">
            {formatCurrency(loanAmount)}
          </div>
        </div>

        <NumberInput
          label="Ставка"
          value={inputs.mortgageRate}
          onChange={(v) => setInput('mortgageRate', v)}
          suffix="%"
          tooltip="Годовая ставка по семейной ипотеке (6%)"
          min={VALIDATION_RANGES.mortgageRate.min}
          max={VALIDATION_RANGES.mortgageRate.max}
          decimals={1}
          required
        />

        <NumberInput
          label="Срок кредита"
          value={inputs.loanTerm}
          onChange={(v) => setInput('loanTerm', v)}
          suffix="лет"
          tooltip="Срок ипотечного кредита"
          min={VALIDATION_RANGES.loanTerm.min}
          max={VALIDATION_RANGES.loanTerm.max}
          required
        />

        <div className="rounded-md bg-muted/10 p-3">
          <div className="text-sm text-muted">Ежемесячный платёж</div>
          <div className="text-lg font-semibold tabular-nums">
            {formatCurrency(result.annuityPayment)}
          </div>
          {inputs.extraMonthlyPayment > 0 && (
            <div className="mt-1 text-sm text-muted">
              + {formatCurrency(inputs.extraMonthlyPayment)} доп. ={' '}
              <span className="font-medium text-foreground">
                {formatCurrency(result.annuityPayment + inputs.extraMonthlyPayment)}
              </span>
            </div>
          )}
        </div>

        <NumberInput
          label="Доп. платёж"
          value={inputs.extraMonthlyPayment}
          onChange={(v) => setInput('extraMonthlyPayment', v)}
          suffix="₽/мес"
          tooltip="Досрочное погашение сверх обязательного платежа"
          min={VALIDATION_RANGES.extraMonthlyPayment.min}
          max={VALIDATION_RANGES.extraMonthlyPayment.max}
        />

        {inputs.extraMonthlyPayment > 0 && result.actualLoanTermMonths < inputs.loanTerm * 12 && (
          <div className="text-sm text-success">
            Кредит погашен за {formatMonths(result.actualLoanTermMonths)} (экономия{' '}
            {formatMonths(inputs.loanTerm * 12 - result.actualLoanTermMonths)})
          </div>
        )}
      </CardContent>
    </Card>
  );
}
