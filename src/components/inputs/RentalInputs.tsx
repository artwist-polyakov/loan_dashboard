import { useInputStore } from '@/store/inputStore';
import { NumberInput } from './NumberInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VALIDATION_RANGES } from '@/lib/utils/constants';
import { calculateRentalYield } from '@/lib/calculations/rental';
import { formatPercent } from '@/lib/utils/formatting';
import { Key } from 'lucide-react';

export function RentalInputs() {
  const { inputs, setInput } = useInputStore();

  const rentalYield = calculateRentalYield(inputs.monthlyRent, inputs.propertyPrice);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Key className="h-4 w-4" />
          Аренда
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberInput
          label="Месячная аренда"
          value={inputs.monthlyRent}
          onChange={(v) => setInput('monthlyRent', v)}
          suffix="₽/мес"
          tooltip="Текущая рыночная арендная плата за аналогичную квартиру"
          min={VALIDATION_RANGES.monthlyRent.min}
          max={VALIDATION_RANGES.monthlyRent.max}
        />

        <div className="text-sm text-muted">
          Доходность: {formatPercent(rentalYield)} годовых
          {rentalYield < 3 && (
            <span className="ml-1 text-warning">(низкая)</span>
          )}
          {rentalYield >= 3 && rentalYield <= 5 && (
            <span className="ml-1 text-success">(типичная)</span>
          )}
          {rentalYield > 5 && (
            <span className="ml-1 text-success">(высокая)</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
