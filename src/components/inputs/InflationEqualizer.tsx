import { useInputStore } from '@/store/inputStore';
import { useUIStore } from '@/store/uiStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { formatPercent } from '@/lib/utils/formatting';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export function InflationEqualizer() {
  const { inputs, setInput, setYearlyInflation, initializeEqualizer, resetEqualizer } =
    useInputStore();
  const { equalizerExpanded, setEqualizerExpanded } = useUIStore();

  const handleToggleEqualizer = (enabled: boolean) => {
    if (enabled) {
      initializeEqualizer(inputs.analysisPeriod);
      setEqualizerExpanded(true);
    } else {
      resetEqualizer();
      setEqualizerExpanded(false);
    }
  };

  const handleReset = () => {
    const baseRate = 5; // Базовая инфляция по умолчанию
    setInput('inflationRate', baseRate);
    initializeEqualizer(inputs.analysisPeriod);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Динамический сценарий
          </span>
          <Switch
            checked={inputs.useEqualizer}
            onCheckedChange={handleToggleEqualizer}
          />
        </CardTitle>
      </CardHeader>

      {inputs.useEqualizer && equalizerExpanded && (
        <CardContent className="space-y-4">
          <p className="text-sm text-muted">
            Настройте инфляцию по годам. Ставка вклада автоматически = инфляция + 2%.
          </p>

          <div className="space-y-3">
            {inputs.yearlyInflation.map((rate, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-16 text-sm text-muted">Год {index + 1}</div>
                <Slider
                  value={[rate]}
                  onValueChange={([value]) => setYearlyInflation(index, value)}
                  min={0}
                  max={30}
                  step={0.5}
                  className="flex-1"
                />
                <div className="w-16 text-right text-sm tabular-nums">
                  {formatPercent(rate)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted">
              Средняя инфляция:{' '}
              <span className="font-medium text-foreground">
                {formatPercent(
                  inputs.yearlyInflation.reduce((a, b) => a + b, 0) /
                    inputs.yearlyInflation.length || 0
                )}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Сбросить
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
