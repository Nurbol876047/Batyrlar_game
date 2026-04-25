"use client";

import { motion } from "framer-motion";
import { Award, RotateCcw, Shield, Sparkles, Trophy } from "lucide-react";

import { BatyrArtwork } from "@/components/ui/batyr-artwork";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ornament } from "@/components/ui/ornament";
import type { Batyr, RunResult } from "@/lib/types";

interface ResultScreenProps {
  batyr: Batyr;
  result: RunResult;
  onReplay: () => void;
  onChooseAnother: () => void;
}

export function ResultScreen({
  batyr,
  result,
  onReplay,
  onChooseAnother,
}: ResultScreenProps) {
  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"
      >
        <Card className="overflow-hidden">
          <CardContent className="space-y-6 p-6">
            <div className="relative overflow-hidden rounded-[32px] border border-primary/18 bg-[radial-gradient(circle_at_top,rgba(239,197,109,0.18),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6">
              <motion.div
                className="absolute left-1/2 top-10 h-28 w-28 -translate-x-1/2 rounded-full bg-primary/18 blur-3xl"
                animate={{ scale: [1, 1.12, 1], opacity: [0.45, 0.9, 0.45] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative z-10 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/14 text-primary shadow-primary">
                  <Trophy className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.34em] text-foreground/55">
                    Жорық аяқталды
                  </p>
                  <h2 className="font-display text-5xl text-white">{result.rank}</h2>
                </div>
              </div>
            </div>

            <BatyrArtwork batyr={batyr} className="min-h-[280px]" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Ұпай</p>
                <p className="mt-2 font-display text-4xl text-white">{result.score}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/55">Үздік нәтиже</p>
                <p className="mt-2 font-display text-4xl text-white">{result.bestScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="space-y-4">
            <Badge>Финалдық есеп</Badge>
            <h1 className="font-display text-6xl text-white">{batyr.name}</h1>
            <p className="text-lg leading-8 text-foreground/72">{result.historicInsight}</p>
            <Ornament />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Award className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">Артефакт</p>
                </div>
                <p className="font-display text-4xl text-white">
                  {result.collectedArtifacts}/{result.totalArtifacts}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">
                    Дұрыс жауап
                  </p>
                </div>
                <p className="font-display text-4xl text-white">{result.accuracy}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">Қалған HP</p>
                </div>
                <p className="font-display text-4xl text-white">{result.hpRemaining}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 p-5">
                <div className="flex items-center gap-2 text-accent">
                  <Trophy className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">Уақыт</p>
                </div>
                <p className="font-display text-4xl text-white">{result.durationLabel}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">
                  Achievement badges
                </p>
                <h3 className="font-display text-4xl text-white">Жетістіктер</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {result.achievements.map((achievement) => (
                  <Badge key={achievement} variant="secondary" className="py-2">
                    {achievement}
                  </Badge>
                ))}
                {result.achievements.length === 0 && (
                  <Badge variant="outline">Жолды жалғастырсаңыз, жаңа марапаттар ашылады</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={onReplay}>
              <RotateCcw className="h-5 w-5" />
              Қайта ойнау
            </Button>
            <Button size="lg" variant="outline" onClick={onChooseAnother}>
              Басқа батырды таңдау
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
