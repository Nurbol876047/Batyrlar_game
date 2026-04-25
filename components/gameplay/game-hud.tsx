"use client";

import { Gem, HeartPulse, Shield, Sparkles, Swords, Zap } from "lucide-react";

import { BatyrArtwork } from "@/components/ui/batyr-artwork";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Batyr } from "@/lib/types";

interface GameHudProps {
  batyr: Batyr;
  hp: number;
  maxHp: number;
  energy: number;
  progress: number;
  score: number;
  artifacts: number;
  totalArtifacts: number;
  enemiesLeft: number;
  specialReady: boolean;
}

export function GameHud({
  batyr,
  hp,
  maxHp,
  energy,
  progress,
  score,
  artifacts,
  totalArtifacts,
  enemiesLeft,
  specialReady,
}: GameHudProps) {
  return (
    <Card>
      <CardContent className="grid gap-5 p-5 xl:grid-cols-[0.9fr_1.1fr] xl:items-center 2xl:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <BatyrArtwork batyr={batyr} size="icon" />
            <div className="space-y-2">
              <Badge>{batyr.name}</Badge>
              <div>
                <p className="font-display text-3xl text-white 2xl:text-4xl">{batyr.specialAbility}</p>
                <p className="text-sm text-foreground/65 2xl:text-base">{batyr.style}</p>
              </div>
            </div>
          </div>

          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 2xl:p-5">
              <div className="flex items-center justify-between text-sm 2xl:text-base">
                <div className="flex items-center gap-2 text-primary">
                  <HeartPulse className="h-4 w-4" />
                  HP
                </div>
                <span className="font-semibold text-white">{hp}</span>
              </div>
              <Progress value={(hp / maxHp) * 100} className="2xl:h-4" />
            </div>
            <div className="space-y-2 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 2xl:p-5">
              <div className="flex items-center justify-between text-sm 2xl:text-base">
                <div className="flex items-center gap-2 text-accent">
                  <Zap className="h-4 w-4" />
                  Энергия
                </div>
                <span className="font-semibold text-white">{Math.round(energy)}</span>
              </div>
              <Progress value={energy} className="2xl:h-4" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-primary">
              <Gem className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/55">Ұпай</p>
            </div>
            <p className="mt-2 font-display text-4xl text-white">{score}</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/55">
                Артефакт
              </p>
            </div>
            <p className="mt-2 font-display text-4xl text-white">
              {artifacts}/{totalArtifacts}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-primary">
              <Swords className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/55">Жау</p>
            </div>
            <p className="mt-2 font-display text-4xl text-white">{enemiesLeft}</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-accent">
              <Shield className="h-4 w-4" />
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/55">
                Суперудар
              </p>
            </div>
            <p className="mt-2 font-display text-2xl text-white">
              {specialReady ? "Дайын" : "Толық емес"}
            </p>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="mb-2 flex items-center justify-between text-sm text-foreground/70">
            <span>Деңгей прогресі</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <Progress value={progress * 100} className="h-4" />
        </div>
      </CardContent>
    </Card>
  );
}
