import { SummaryCards } from '@/components/results/SummaryCards';
import { ChartTabs } from '@/components/charts/ChartTabs';
import { DetailedBreakdown } from '@/components/results/DetailedBreakdown';

export function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:ml-80">
      <div className="mx-auto max-w-5xl space-y-6">
        <SummaryCards />
        <ChartTabs />
        <DetailedBreakdown />
      </div>
    </main>
  );
}
