"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { CharacterSelectScreen } from "@/components/character-select/character-select-screen";
import { GameplayScene } from "@/components/gameplay/gameplay-scene";
import { HeroProfileScreen } from "@/components/hero-profile/hero-profile-screen";
import { BootLoader } from "@/components/layout/boot-loader";
import { GameShell } from "@/components/layout/game-shell";
import { LandingScreen } from "@/components/landing/landing-screen";
import { ResultScreen } from "@/components/result/result-screen";
import { batyrs, batyrMap } from "@/data/batyrs";
import { useGameStore } from "@/store/game-store";

export function BatyrJourneyApp() {
  const scene = useGameStore((state) => state.scene);
  const selectedBatyrId = useGameStore((state) => state.selectedBatyrId);
  const result = useGameStore((state) => state.result);
  const bestScores = useGameStore((state) => state.bestScores);
  const viewSelection = useGameStore((state) => state.viewSelection);
  const selectBatyr = useGameStore((state) => state.selectBatyr);
  const returnToSelection = useGameStore((state) => state.returnToSelection);
  const startBattle = useGameStore((state) => state.startBattle);
  const replayBattle = useGameStore((state) => state.replayBattle);

  const [booting, setBooting] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timeout = window.setTimeout(() => setBooting(false), 1200);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!mounted || booting) {
    return <BootLoader />;
  }

  const selectedBatyr = selectedBatyrId ? batyrMap[selectedBatyrId] : null;

  const renderScene = () => {
    if (scene === "landing") {
      return <LandingScreen onStart={viewSelection} />;
    }

    if (scene === "select" || !selectedBatyr) {
      return (
        <CharacterSelectScreen
          batyrs={batyrs}
          bestScores={bestScores}
          onSelect={selectBatyr}
        />
      );
    }

    if (scene === "profile") {
      return (
        <HeroProfileScreen
          batyr={selectedBatyr}
          onBack={returnToSelection}
          onStartBattle={startBattle}
        />
      );
    }

    if (scene === "gameplay") {
      return <GameplayScene batyr={selectedBatyr} />;
    }

    if (scene === "result" && result) {
      return (
        <ResultScreen
          batyr={selectedBatyr}
          result={result}
          onReplay={replayBattle}
          onChooseAnother={returnToSelection}
        />
      );
    }

    return (
      <CharacterSelectScreen batyrs={batyrs} bestScores={bestScores} onSelect={selectBatyr} />
    );
  };

  return (
    <GameShell>
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {renderScene()}
        </motion.div>
      </AnimatePresence>
    </GameShell>
  );
}
