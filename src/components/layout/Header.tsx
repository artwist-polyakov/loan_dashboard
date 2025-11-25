import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/uiStore';
import { useInputStore } from '@/store/inputStore';
import { Info, RotateCcw, Menu } from 'lucide-react';

export function Header() {
  const { toggleSidebar, openInfoModal } = useUIStore();
  const { resetToDefaults } = useInputStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            Ипотека vs Вклад
          </h1>
          <span className="hidden text-sm text-muted sm:inline">
            Сравнение финансовых стратегий
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Сбросить</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={openInfoModal}>
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
