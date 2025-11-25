import { useInputStore } from '@/store/inputStore';
import { NumberInput } from './NumberInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VALIDATION_RANGES } from '@/lib/utils/constants';
import { Landmark } from 'lucide-react';

export function DepositInputs() {
  const { inputs, setInput } = useInputStore();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Landmark className="h-4 w-4" />
          Вклад
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberInput
          label="Ставка по вкладу"
          value={inputs.depositRate}
          onChange={(v) => setInput('depositRate', v)}
          suffix="%"
          tooltip="Годовая доходность банковского вклада с капитализацией"
          min={VALIDATION_RANGES.depositRate.min}
          max={VALIDATION_RANGES.depositRate.max}
          decimals={1}
          required
          disabled={inputs.useEqualizer}
        />

        <NumberInput
          label="Инфляция"
          value={inputs.inflationRate}
          onChange={(v) => setInput('inflationRate', v)}
          suffix="%"
          tooltip="Ожидаемая среднегодовая инфляция"
          min={VALIDATION_RANGES.inflationRate.min}
          max={VALIDATION_RANGES.inflationRate.max}
          decimals={1}
          required
          disabled={inputs.useEqualizer}
        />

        {inputs.useEqualizer && (
          <div className="text-sm text-warning">
            Ставки задаются в эквалайзере ниже
          </div>
        )}
      </CardContent>
    </Card>
  );
}
