import { useMemo } from 'react';
import { useInputStore } from '@/store/inputStore';
import { compareStrategies, generateTimeSeriesData } from '@/lib/calculations/strategies';
import type { ComparisonResult } from '@/lib/types/results';
import type { TimeSeriesDataPoint } from '@/lib/types/charts';

interface CalculationResult {
  result: ComparisonResult;
  timeSeriesData: TimeSeriesDataPoint[];
}

export function useCalculations(): CalculationResult {
  const inputs = useInputStore((state) => state.inputs);

  return useMemo(() => {
    const result = compareStrategies(inputs);
    const timeSeriesData = generateTimeSeriesData(result, inputs);

    return {
      result,
      timeSeriesData,
    };
  }, [inputs]);
}

/**
 * Хук для получения только результатов сравнения
 */
export function useComparisonResult(): ComparisonResult {
  const { result } = useCalculations();
  return result;
}

/**
 * Хук для получения данных временного ряда (для графиков)
 */
export function useTimeSeriesData(): TimeSeriesDataPoint[] {
  const { timeSeriesData } = useCalculations();
  return timeSeriesData;
}
