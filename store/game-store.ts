"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { RunResult, Scene } from "@/lib/types";

interface GameStore {
  scene: Scene;
  selectedBatyrId: string | null;
  result: RunResult | null;
  soundEnabled: boolean;
  bestScores: Record<string, number>;
  completedRuns: number;
  viewSelection: () => void;
  selectBatyr: (id: string) => void;
  returnToSelection: () => void;
  startBattle: () => void;
  finishBattle: (result: RunResult) => void;
  replayBattle: () => void;
  goHome: () => void;
  toggleSound: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      scene: "landing",
      selectedBatyrId: null,
      result: null,
      soundEnabled: true,
      bestScores: {},
      completedRuns: 0,
      viewSelection: () =>
        set({
          scene: "select",
          result: null,
        }),
      selectBatyr: (id) =>
        set({
          selectedBatyrId: id,
          scene: "profile",
          result: null,
        }),
      returnToSelection: () =>
        set({
          scene: "select",
          result: null,
        }),
      startBattle: () =>
        set({
          scene: "gameplay",
          result: null,
        }),
      finishBattle: (result) =>
        set((state) => ({
          scene: "result",
          result,
          completedRuns: state.completedRuns + 1,
          bestScores: {
            ...state.bestScores,
            [result.heroId]: Math.max(state.bestScores[result.heroId] ?? 0, result.score),
          },
        })),
      replayBattle: () =>
        set({
          scene: "gameplay",
          result: null,
        }),
      goHome: () =>
        set({
          scene: "landing",
          result: null,
        }),
      toggleSound: () =>
        set((state) => ({
          soundEnabled: !state.soundEnabled,
        })),
    }),
    {
      name: "batyrlar-game-store",
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        bestScores: state.bestScores,
        completedRuns: state.completedRuns,
      }),
    },
  ),
);
