import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';
import { InfoModal } from '@/components/layout/InfoModal';

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <MainContent />
        </div>
        <InfoModal />
      </div>
    </TooltipProvider>
  );
}

export default App;
