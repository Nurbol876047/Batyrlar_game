"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookMarked, ShieldCheck, Sparkles, Sword } from "lucide-react";

import { BatyrArtwork } from "@/components/ui/batyr-artwork";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ornament } from "@/components/ui/ornament";
import { Progress } from "@/components/ui/progress";
import { useT } from "@/hooks/use-translation";
import type { Batyr } from "@/lib/types";

interface HeroProfileScreenProps {
  batyr: Batyr;
  onBack: () => void;
  onStartBattle: () => void;
}

export function HeroProfileScreen({
  batyr,
  onBack,
  onStartBattle,
}: HeroProfileScreenProps) {
  const t = useT();
  const { heroProfile } = t;

  return (
    <section className="grid gap-8 xl:grid-cols-[0.94fr_1.06fr]">
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-5"
      >
        <BatyrArtwork batyr={batyr} size="profile" />

        <Card>
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2">
              {batyr.strengths.map((strength) => (
                <Badge key={strength} variant="secondary">
                  {strength}
                </Badge>
              ))}
            </div>
            <p className="text-sm leading-8 text-foreground/72">{batyr.quote}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <Badge>{heroProfile.badge}</Badge>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.42em] text-foreground/55">{batyr.era}</p>
            <h2 className="font-display text-6xl text-white">{batyr.name}</h2>
            <p className="text-2xl text-primary">{batyr.title}</p>
          </div>
          <Ornament />
          <p className="max-w-3xl text-lg leading-8 text-foreground/74">{batyr.biography}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <Sword className="h-5 w-5 text-primary" />
                <p className="text-xs uppercase tracking-[0.34em] text-foreground/55">
                  {heroProfile.weaponLabel}
                </p>
              </div>
              <p className="font-display text-3xl text-white">{batyr.weapon}</p>
              <p className="text-sm leading-7 text-foreground/68">{heroProfile.weaponDescription}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-accent" />
                <p className="text-xs uppercase tracking-[0.34em] text-foreground/55">
                  {heroProfile.specialAbilityLabel}
                </p>
              </div>
              <p className="font-display text-3xl text-white">{batyr.specialAbility}</p>
              <p className="text-sm leading-7 text-foreground/68">
                {heroProfile.specialAbilityDescription}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <BookMarked className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.34em] text-foreground/55">
                  {heroProfile.legacyEyebrow}
                </p>
              </div>
              <h3 className="font-display text-4xl text-white">{heroProfile.legacyTitle}</h3>
              <p className="text-sm leading-8 text-foreground/72">{batyr.legacy}</p>
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              {[
                { label: heroProfile.stats.attack, value: batyr.stats.attack },
                { label: heroProfile.stats.defense, value: batyr.stats.defense },
                { label: heroProfile.stats.speed, value: batyr.stats.speed },
                { label: heroProfile.stats.wisdom, value: batyr.stats.wisdom },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/74">{item.label}</span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                  <Progress value={item.value} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="lg" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
            {heroProfile.backButton}
          </Button>
          <Button size="lg" onClick={onStartBattle}>
            <ShieldCheck className="h-5 w-5" />
            {heroProfile.startBattleButton}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
