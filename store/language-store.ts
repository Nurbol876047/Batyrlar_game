"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "kk" | "en";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "kk",
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === "kk" ? "en" : "kk" })),
    }),
    {
      name: "batyrlar-language",
    },
  ),
);
