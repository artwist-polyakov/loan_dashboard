import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { PdfReport } from './PdfReport';
import { useComparisonResult } from '@/hooks/useCalculations';
import { useInputStore } from '@/store/inputStore';
import { useChartRefs } from '@/components/charts/ChartRefsContext';
import html2canvas from 'html2canvas';

interface PdfExportButtonProps {
  className?: string;
}

export function PdfExportButton({ className }: PdfExportButtonProps) {
  const chartRefs = useChartRefs();
  const debtChartRef = chartRefs?.debtChartRef;
  const netWorthChartRef = chartRefs?.netWorthChartRef;
  const [isLoading, setIsLoading] = useState(false);
  const result = useComparisonResult();
  const { inputs } = useInputStore();

  const captureChart = useCallback(
    async (ref: React.RefObject<HTMLDivElement | null>): Promise<string | undefined> => {
      if (!ref?.current) return undefined;

      try {
        const canvas = await html2canvas(ref.current, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
        });
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Failed to capture chart:', error);
        return undefined;
      }
    },
    []
  );

  const handleExport = useCallback(async () => {
    setIsLoading(true);

    try {
      // Захватываем графики
      const [debtVsDeposit, netWorth] = await Promise.all([
        debtChartRef ? captureChart(debtChartRef) : Promise.resolve(undefined),
        netWorthChartRef ? captureChart(netWorthChartRef) : Promise.resolve(undefined),
      ]);

      const chartImages = {
        debtVsDeposit,
        netWorth,
      };

      // Генерируем PDF
      const blob = await pdf(
        <PdfReport result={result} inputs={inputs} chartImages={chartImages} />
      ).toBlob();

      // Сохраняем файл
      const date = new Date().toISOString().slice(0, 10);
      saveAs(blob, `mortgage-report-${date}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Ошибка генерации PDF. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  }, [result, inputs, debtChartRef, netWorthChartRef, captureChart]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isLoading}
      className={className}
      title="Экспортировать отчёт в PDF"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <FileText className="h-4 w-4 mr-1" />
      )}
      PDF
    </Button>
  );
}
