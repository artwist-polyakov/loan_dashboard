import { useInputStore } from '@/store/inputStore';
import { NumberInput } from './NumberInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VALIDATION_RANGES, MIN_DOWN_PAYMENT_PERCENT, CURRENT_YEAR } from '@/lib/utils/constants';
import { formatCurrency } from '@/lib/utils/formatting';
import { Home } from 'lucide-react';

export function PropertyInputs() {
  const { inputs, setInput } = useInputStore();

  const minDownPayment = inputs.propertyPrice * (MIN_DOWN_PAYMENT_PERCENT / 100);
  const downPaymentError =
    inputs.downPayment < minDownPayment
      ? `Минимум ${MIN_DOWN_PAYMENT_PERCENT}% (${formatCurrency(minDownPayment, true)})`
      : undefined;

  const pricePerSqm = inputs.area
    ? Math.round(inputs.propertyPrice / inputs.area)
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Home className="h-4 w-4" />
          Недвижимость
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <NumberInput
          label="Стоимость"
          value={inputs.propertyPrice}
          onChange={(v) => setInput('propertyPrice', v)}
          suffix="₽"
          tooltip="Текущая цена квартиры"
          min={VALIDATION_RANGES.propertyPrice.min}
          max={VALIDATION_RANGES.propertyPrice.max}
          required
        />

        <NumberInput
          label="Первоначальный взнос"
          value={inputs.downPayment}
          onChange={(v) => setInput('downPayment', v)}
          suffix="₽"
          tooltip={`Минимум ${MIN_DOWN_PAYMENT_PERCENT}% по программе семейной ипотеки`}
          min={VALIDATION_RANGES.downPayment.min}
          max={inputs.propertyPrice}
          error={downPaymentError}
          required
        />

        <NumberInput
          label="Площадь"
          value={inputs.area ?? 0}
          onChange={(v) => setInput('area', v || null)}
          suffix="м²"
          tooltip="Общая площадь квартиры (для расчёта стоимости ремонта)"
          min={VALIDATION_RANGES.area.min}
          max={VALIDATION_RANGES.area.max}
        />

        {pricePerSqm && (
          <div className="text-sm text-muted">
            Цена за м²: {formatCurrency(pricePerSqm)}
          </div>
        )}

        {inputs.area && inputs.completionYear > CURRENT_YEAR && (
          <NumberInput
            label={`Плановая цена м² (${inputs.completionYear})`}
            value={inputs.expectedPricePerSqmAtCompletion ?? 0}
            onChange={(v) => setInput('expectedPricePerSqmAtCompletion', v || null)}
            suffix="₽/м²"
            tooltip="Ожидаемая цена квадратного метра на момент сдачи дома. Если указана — расчёт ведётся от неё, а не от текущей цены"
            min={0}
            max={2_000_000}
          />
        )}

        <NumberInput
          label="Срок анализа"
          value={inputs.analysisPeriod}
          onChange={(v) => setInput('analysisPeriod', v)}
          suffix="лет"
          tooltip="Период, через который оцениваем результат"
          min={VALIDATION_RANGES.analysisPeriod.min}
          max={VALIDATION_RANGES.analysisPeriod.max}
          required
        />
      </CardContent>
    </Card>
  );
}
