"use client";

import { getUiStrings } from "@/lib/i18n";
import { useLanguageStore } from "@/store/language-store";

export function useLanguage() {
  return useLanguageStore((state) => state.language);
}

export function useT() {
  const language = useLanguageStore((state) => state.language);
  return getUiStrings(language);
}
