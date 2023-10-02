import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  appCredit: 22.5,
  alpacaPoints: 220,
  setAppCredit: (appCredit) => set({ appCredit: appCredit }),
  setAlpacaPoints: (alpacaPoints) => set({ alpacaPoints: alpacaPoints }),
}));
