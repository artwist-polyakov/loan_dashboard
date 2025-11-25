import { createContext, useContext, useRef, type RefObject } from 'react';

interface ChartRefs {
  debtChartRef: RefObject<HTMLDivElement | null>;
  netWorthChartRef: RefObject<HTMLDivElement | null>;
}

const ChartRefsContext = createContext<ChartRefs | null>(null);

export function ChartRefsProvider({ children }: { children: React.ReactNode }) {
  const debtChartRef = useRef<HTMLDivElement>(null);
  const netWorthChartRef = useRef<HTMLDivElement>(null);

  return (
    <ChartRefsContext.Provider value={{ debtChartRef, netWorthChartRef }}>
      {children}
    </ChartRefsContext.Provider>
  );
}

export function useChartRefs(): ChartRefs | null {
  return useContext(ChartRefsContext);
}
