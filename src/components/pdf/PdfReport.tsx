import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './PdfStyles';
import { TitleSection } from './sections/TitleSection';
import { InputsSection } from './sections/InputsSection';
import { DetailsSection } from './sections/DetailsSection';
import { ChartsSection } from './sections/ChartsSection';
import { TablesSection } from './sections/TablesSection';
import type { ComparisonResult } from '@/lib/types/results';
import type { InputParameters } from '@/lib/types/inputs';

export interface PdfReportProps {
  result: ComparisonResult;
  inputs: InputParameters;
  chartImages?: {
    debtVsDeposit?: string;
    netWorth?: string;
  };
}

export function PdfReport({ result, inputs, chartImages }: PdfReportProps) {
  const date = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Document
      title="Сравнение стратегий: Ипотека vs Вклад"
      author="Mortgage Calculator"
      subject="Финансовый отчёт"
    >
      {/* Страница 1: Титул и сводка */}
      <Page size="A4" style={styles.page}>
        <TitleSection result={result} inputs={inputs} date={date} />
        <Footer pageNumber={1} />
      </Page>

      {/* Страница 2: Входные параметры */}
      <Page size="A4" style={styles.page}>
        <InputsSection inputs={inputs} />
        <Footer pageNumber={2} />
      </Page>

      {/* Страница 3: Детализация */}
      <Page size="A4" style={styles.page}>
        <DetailsSection result={result} inputs={inputs} />
        <Footer pageNumber={3} />
      </Page>

      {/* Страница 4: Графики (если есть) */}
      {(chartImages?.debtVsDeposit || chartImages?.netWorth) && (
        <Page size="A4" style={styles.page}>
          <ChartsSection
            debtVsDepositImage={chartImages.debtVsDeposit}
            netWorthImage={chartImages.netWorth}
          />
          <Footer pageNumber={4} />
        </Page>
      )}

      {/* Страницы 5+: Таблицы платежей */}
      <Page size="A4" style={styles.page}>
        <TablesSection result={result} inputs={inputs} />
        <Footer pageNumber={chartImages?.debtVsDeposit || chartImages?.netWorth ? 5 : 4} />
      </Page>
    </Document>
  );
}

function Footer({ pageNumber }: { pageNumber: number }) {
  return (
    <View style={styles.footer}>
      <Text>Ипотека vs Вклад — Финансовый отчёт</Text>
      <Text>Страница {pageNumber}</Text>
    </View>
  );
}
