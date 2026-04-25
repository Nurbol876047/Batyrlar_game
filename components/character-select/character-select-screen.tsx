"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Shield, Sparkles, Sword } from "lucide-react";

import { BatyrArtwork } from "@/components/ui/batyr-artwork";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ornament } from "@/components/ui/ornament";
import { Progress } from "@/components/ui/progress";
import type { Batyr } from "@/lib/types";

interface CharacterSelectScreenProps {
  batyrs: Batyr[];
  bestScores: Record<string, number>;
  onSelect: (id: string) => void;
}

export function CharacterSelectScreen({
  batyrs,
  bestScores,
  onSelect,
}: CharacterSelectScreenProps) {
  const [previewId, setPreviewId] = useState(batyrs[0]?.id ?? "");
  const previewBatyr = batyrs.find((batyr) => batyr.id === previewId) ?? batyrs[0];

  return (
    <section className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
      >
        <Card className="overflow-hidden">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <BatyrArtwork batyr={previewBatyr} className="min-h-[320px]" />

            <div className="space-y-5">
              <div className="space-y-3">
                <Badge>Батыр таңдау экраны</Badge>
                <h2 className="font-display text-5xl text-white">{previewBatyr.name}</h2>
                <p className="text-base leading-8 text-foreground/74">{previewBatyr.description}</p>
              </div>

              <Ornament />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.34em] text-foreground/55">Қаруы</p>
                  <p className="mt-2 text-lg text-white">{previewBatyr.weapon}</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.34em] text-foreground/55">Стилі</p>
                  <p className="mt-2 text-lg text-white">{previewBatyr.style}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {previewBatyr.strengths.slice(0, 3).map((strength) => (
                  <Badge key={strength} variant="secondary" className="justify-center py-2">
                    {strength}
                  </Badge>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 rounded-[24px] border border-primary/18 bg-primary/8 p-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Sword className="h-4 w-4" />
                    <p className="text-xs uppercase tracking-[0.32em]">Арнайы шеберлік</p>
                  </div>
                  <p className="font-display text-2xl text-white">{previewBatyr.specialAbility}</p>
                </div>
                <div className="space-y-2 rounded-[24px] border border-accent/18 bg-accent/8 p-4">
                  <div className="flex items-center gap-2 text-accent">
                    <Shield className="h-4 w-4" />
                    <p className="text-xs uppercase tracking-[0.32em]">Үздік нәтиже</p>
                  </div>
                  <p className="font-display text-2xl text-white">{bestScores[previewBatyr.id] ?? 0}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="space-y-3">
            <Badge variant="accent">Қабілеттер панелі</Badge>
            <CardTitle className="text-4xl">Қай батыр сізге жақын?</CardTitle>
            <p className="text-sm leading-7 text-foreground/72">
              Карточканы нұсқағанда алдын ала профиль өзгереді, ал таңдау батырдың толық
              таныстырылымына апарады.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: "Шабуыл", value: previewBatyr.stats.attack },
              { label: "Қорғаныс", value: previewBatyr.stats.defense },
              { label: "Жылдамдық", value: previewBatyr.stats.speed },
              { label: "Парасат", value: previewBatyr.stats.wisdom },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/75">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 text-primary" />
                <p className="text-sm leading-7 text-foreground/72">
                  Білімді дұрыс қолданған оқушы мини-сұрақтарға жауап беріп, HP, энергия және
                  қосымша ұпай алады.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {batyrs.map((batyr, index) => (
          <motion.div
            key={batyr.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            whileHover={{ y: -8 }}
            onHoverStart={() => setPreviewId(batyr.id)}
          >
            <Card className="group h-full overflow-hidden">
              <CardContent className="flex h-full flex-col gap-5 p-5">
                <BatyrArtwork batyr={batyr} />

                <div className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">
                      {batyr.type}
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-white">{batyr.name}</h3>
                  </div>
                  <p className="text-sm leading-7 text-foreground/70">{batyr.description}</p>
                </div>

                <div className="space-y-2 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-sm text-foreground/72">
                  <p>
                    <span className="text-white">Қару:</span> {batyr.weapon}
                  </p>
                  <p>
                    <span className="text-white">Стиль:</span> {batyr.style}
                  </p>
                  <p>
                    <span className="text-white">Үздік ұпай:</span> {bestScores[batyr.id] ?? 0}
                  </p>
                </div>

                <Button
                  className="mt-auto"
                  onClick={() => onSelect(batyr.id)}
                  variant={previewId === batyr.id ? "default" : "secondary"}
                >
                  Таңдау
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
