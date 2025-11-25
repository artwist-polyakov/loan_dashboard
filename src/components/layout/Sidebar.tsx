import { useUIStore } from '@/store/uiStore';
import { PropertyInputs } from '@/components/inputs/PropertyInputs';
import { MortgageInputs } from '@/components/inputs/MortgageInputs';
import { DepositInputs } from '@/components/inputs/DepositInputs';
import { RentalInputs } from '@/components/inputs/RentalInputs';
import { RenovationInputs } from '@/components/inputs/RenovationInputs';
import { InflationEqualizer } from '@/components/inputs/InflationEqualizer';
import { SettingsActions } from '@/components/inputs/SettingsActions';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  return (
    <>
      {/* Overlay for mobile */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-80 overflow-y-auto border-r bg-background transition-transform duration-300',
          'md:translate-x-0',
          sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        )}
      >
        <div className="flex items-center justify-between border-b p-4 md:hidden">
          <span className="font-medium">Параметры</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(true)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4 p-4">
          <SettingsActions />
          <PropertyInputs />
          <MortgageInputs />
          <DepositInputs />
          <RentalInputs />
          <RenovationInputs />
          <InflationEqualizer />
        </div>
      </aside>
    </>
  );
}
