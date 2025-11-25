import { create } from 'zustand';

type ChartTab = 'debtDeposit' | 'netWorth' | 'waterfall' | 'rentPayment';

interface UIStore {
  sidebarCollapsed: boolean;
  activeChartTab: ChartTab;
  equalizerExpanded: boolean;
  infoModalOpen: boolean;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setActiveChartTab: (tab: ChartTab) => void;
  toggleEqualizer: () => void;
  setEqualizerExpanded: (expanded: boolean) => void;
  openInfoModal: () => void;
  closeInfoModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  activeChartTab: 'debtDeposit',
  equalizerExpanded: false,
  infoModalOpen: false,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setSidebarCollapsed: (collapsed) =>
    set({ sidebarCollapsed: collapsed }),

  setActiveChartTab: (tab) =>
    set({ activeChartTab: tab }),

  toggleEqualizer: () =>
    set((state) => ({ equalizerExpanded: !state.equalizerExpanded })),

  setEqualizerExpanded: (expanded) =>
    set({ equalizerExpanded: expanded }),

  openInfoModal: () =>
    set({ infoModalOpen: true }),

  closeInfoModal: () =>
    set({ infoModalOpen: false }),
}));
