import { useInputStore } from '@/store/inputStore';
import { NumberInput } from './NumberInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { VALIDATION_RANGES, CURRENT_YEAR } from '@/lib/utils/constants';
import { calculateRenovationCost } from '@/lib/calculations/renovation';
import { formatCurrency } from '@/lib/utils/formatting';
import { Hammer } from 'lucide-react';

export function RenovationInputs() {
  const { inputs, setInput } = useInputStore();

  const renovationCost = inputs.renovationRequired && inputs.area
    ? calculateRenovationCost(
        inputs.renovationCostPerSqm,
        inputs.area,
        inputs.useEqualizer ? inputs.yearlyInflation : inputs.inflationRate,
        inputs.completionYear,
        CURRENT_YEAR,
        inputs.useEqualizer
      )
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Hammer className="h-4 w-4" />
          Ремонт
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="renovation-required">Требуется ремонт</Label>
          <Switch
            id="renovation-required"
            checked={inputs.renovationRequired}
            onCheckedChange={(checked) => setInput('renovationRequired', checked)}
          />
        </div>

        {inputs.renovationRequired && (
          <>
            <NumberInput
              label="Год сдачи дома"
              value={inputs.completionYear}
              onChange={(v) => setInput('completionYear', v)}
              tooltip="Год ввода дома в эксплуатацию (для новостроек)"
              min={VALIDATION_RANGES.completionYear.min}
              max={VALIDATION_RANGES.completionYear.max}
            />

            <NumberInput
              label="Стоимость ремонта за м²"
              value={inputs.renovationCostPerSqm}
              onChange={(v) => setInput('renovationCostPerSqm', v)}
              suffix="₽/м²"
              tooltip="Базовая стоимость отделки под ключ на текущий момент"
              min={VALIDATION_RANGES.renovationCostPerSqm.min}
              max={VALIDATION_RANGES.renovationCostPerSqm.max}
            />

            <NumberInput
              label="Возврат ремонта при продаже"
              value={inputs.renovationReturnRate}
              onChange={(v) => setInput('renovationReturnRate', v)}
              suffix="%"
              tooltip="Процент стоимости ремонта, который вернётся в цене квартиры при продаже (обычно 40-80%)"
              min={0}
              max={100}
            />

            {inputs.area && renovationCost > 0 && (
              <div className="rounded-md bg-muted/10 p-3">
                <div className="text-sm text-muted">
                  Стоимость ремонта
                  {inputs.completionYear > CURRENT_YEAR && ' (с учётом инфляции)'}
                </div>
                <div className="text-lg font-semibold tabular-nums">
                  {formatCurrency(renovationCost)}
                </div>
                {!inputs.area && (
                  <div className="mt-1 text-sm text-warning">
                    Укажите площадь для расчёта
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
