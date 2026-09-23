"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { useLanguageStore } from "@/store/language-store";

interface GameShellProps {
  children: ReactNode;
}

function LanguageSwitcher() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return (
    <div className="fixed right-3 top-3 z-50 flex items-center gap-1 rounded-full border border-white/12 bg-black/45 p-1 backdrop-blur-xl sm:right-5 sm:top-5">
      {(["kk", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLanguage(option)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors ${
            language === option
              ? "bg-primary text-primary-foreground shadow-primary"
              : "text-foreground/60 hover:text-foreground/90"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function GameShell({ children }: GameShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-steppe-glow text-foreground">
      <LanguageSwitcher />
      <div className="absolute inset-0 bg-grid-steppe opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,224,154,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(34,211,184,0.08),transparent_28%)]" />

      {Array.from({ length: 5 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white/6 blur-3xl"
          style={{
            width: 220 + index * 80,
            height: 70 + index * 18,
            top: 60 + index * 120,
            left: `${8 + index * 18}%`,
          }}
          animate={{ x: [0, 40 - index * 4, 0], opacity: [0.28, 0.42, 0.28] }}
          transition={{ duration: 18 + index * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="absolute inset-x-0 bottom-0 h-[34vh] bg-[radial-gradient(circle_at_center,rgba(239,197,109,0.18),transparent_55%),linear-gradient(180deg,transparent,rgba(12,21,34,0.92))]" />
      <div className="absolute inset-x-0 bottom-0 h-[28vh] bg-[linear-gradient(180deg,transparent,rgba(1,6,12,0.9))]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1700px] items-start px-3 pb-28 pt-5 sm:px-6 sm:py-8 lg:items-center lg:pb-8">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
