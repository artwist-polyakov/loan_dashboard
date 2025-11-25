import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUIStore } from '@/store/uiStore';
import { DebtVsDepositChart } from './DebtVsDepositChart';
import { NetWorthChart } from './NetWorthChart';
import { useChartRefs } from './ChartRefsContext';
import { BarChart3, TrendingUp } from 'lucide-react';

export function ChartTabs() {
  const { activeChartTab, setActiveChartTab } = useUIStore();
  const { debtChartRef, netWorthChartRef } = useChartRefs();

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Динамика</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeChartTab}
          onValueChange={(v) => setActiveChartTab(v as any)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="debtDeposit" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Долг vs Вклад
            </TabsTrigger>
            <TabsTrigger value="netWorth" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Чистая стоимость
            </TabsTrigger>
          </TabsList>

          <TabsContent value="debtDeposit">
            <div ref={debtChartRef}>
              <DebtVsDepositChart />
            </div>
          </TabsContent>

          <TabsContent value="netWorth">
            <div ref={netWorthChartRef}>
              <NetWorthChart />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
