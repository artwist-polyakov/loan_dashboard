import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useCalculations } from '@/hooks/useCalculations';
import { formatCurrency } from '@/lib/utils/formatting';
import { CHART_COLORS } from '@/lib/utils/constants';

export function NetWorthChart() {
  const { timeSeriesData } = useCalculations();

  // Берём данные раз в год для читаемости
  const yearlyData = timeSeriesData.filter((d) => d.month % 12 === 0);

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)} млн`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)} тыс`;
    }
    return String(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="font-medium mb-2">Год {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted">{entry.name}:</span>
            <span className="font-medium tabular-nums">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={yearlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis
            dataKey="year"
            tickFormatter={(value) => `${value} г.`}
            stroke="var(--color-muted)"
          />
          <YAxis tickFormatter={formatYAxis} stroke="var(--color-muted)" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="mortgageEquity"
            name="Капитал в недвижимости"
            stroke={CHART_COLORS.equity}
            fill={CHART_COLORS.equity}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="depositBalance"
            name="Баланс вклада"
            stroke={CHART_COLORS.deposit}
            fill={CHART_COLORS.deposit}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
