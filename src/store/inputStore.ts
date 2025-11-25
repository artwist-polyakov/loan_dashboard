import { create } from 'zustand';
import type { InputParameters } from '@/lib/types/inputs';
import { DEFAULT_INPUTS } from '@/lib/types/inputs';

interface InputStore {
  inputs: InputParameters;
  setInput: <K extends keyof InputParameters>(key: K, value: InputParameters[K]) => void;
  setMultipleInputs: (updates: Partial<InputParameters>) => void;
  resetToDefaults: () => void;
  setYearlyInflation: (year: number, rate: number) => void;
  initializeEqualizer: (years: number) => void;
  resetEqualizer: () => void;
}

export const useInputStore = create<InputStore>((set) => ({
  inputs: { ...DEFAULT_INPUTS },

  setInput: (key, value) =>
    set((state) => ({
      inputs: { ...state.inputs, [key]: value },
    })),

  setMultipleInputs: (updates) =>
    set((state) => ({
      inputs: { ...state.inputs, ...updates },
    })),

  resetToDefaults: () =>
    set({ inputs: { ...DEFAULT_INPUTS } }),

  setYearlyInflation: (year, rate) =>
    set((state) => {
      const newRates = [...state.inputs.yearlyInflation];
      newRates[year] = rate;
      return {
        inputs: { ...state.inputs, yearlyInflation: newRates },
      };
    }),

  initializeEqualizer: (years) =>
    set((state) => {
      const baseRate = state.inputs.inflationRate;
      const yearlyInflation = Array(years).fill(baseRate);
      return {
        inputs: {
          ...state.inputs,
          useEqualizer: true,
          yearlyInflation,
        },
      };
    }),

  resetEqualizer: () =>
    set((state) => ({
      inputs: {
        ...state.inputs,
        useEqualizer: false,
        yearlyInflation: [],
      },
    })),
}));
