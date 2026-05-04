"use client";

import { motion } from "framer-motion";

import { Ornament } from "@/components/ui/ornament";

export function BootLoader() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-steppe-glow px-6 text-foreground">
      <div className="absolute inset-0 bg-grid-steppe opacity-25" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex max-w-2xl flex-col items-center gap-6 text-center"
      >
        <div className="relative flex h-36 w-36 items-center justify-center">
          <div className="absolute inset-0 animate-pulse-soft rounded-full border border-primary/30 bg-primary/10" />
          <div className="absolute inset-5 rounded-full border border-accent/30 bg-accent/10" />
          <div className="absolute inset-[42px] rounded-full bg-gradient-to-br from-primary to-accent shadow-primary" />
        </div>
        <div className="space-y-4">
          <p className="font-display text-6xl font-semibold ornament-text">Ерлік жолы</p>
          <Ornament className="mx-auto w-full max-w-xs" />
          <p className="text-balance text-base leading-8 text-foreground/72 sm:text-lg">
            Қазақ батырларының рухын заманауи ойын форматында ашатын атмосфералық жоба жүктелуде.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
