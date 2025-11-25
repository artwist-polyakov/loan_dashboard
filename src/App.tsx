import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';
import { InfoModal } from '@/components/layout/InfoModal';
import { ChartRefsProvider } from '@/components/charts/ChartRefsContext';

function App() {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={0}>
      <ChartRefsProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex">
            <Sidebar />
            <MainContent />
          </div>
          <InfoModal />
        </div>
      </ChartRefsProvider>
    </TooltipProvider>
  );
}

export default App;
