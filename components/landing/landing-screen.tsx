"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  Play,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ornament } from "@/components/ui/ornament";

interface LandingScreenProps {
  onStart: () => void;
}

const highlights = [
  {
    icon: ShieldCheck,
    title: "4 батыр",
    text: "Турсынбай, Баян, Қабанбай және Райымбек әрқайсысы өз стилімен ойнайды.",
  },
  {
    icon: Swords,
    title: "2D adventure",
    text: "1536×864 Kaboom.js сахнасы: жүру, секіру, шабуыл және суперсоққы.",
  },
  {
    icon: BookOpenText,
    title: "Білім күші",
    text: "Артефакттар мен сұрақтар HP, энергия және ұпай береді.",
  },
];

const routeSteps = ["Батыр таңда", "Тарихын аш", "Жорыққа шық", "Нәтиже ал"];

function SteppePreview() {
  return (
    <div className="relative aspect-[1218/811] min-h-[300px] overflow-hidden rounded-[34px] border border-white/12 bg-[#071426] shadow-[0_34px_110px_rgba(0,0,0,0.46)]">
      <img
        src="/assets/landing/batyr-steppe-scene.png"
        alt="Түнгі даладағы батырлар pixel-art көрінісі"
        className="h-full w-full object-cover pixelated"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.18))]" />
      <div className="absolute left-7 top-7 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.32em] text-foreground/78 backdrop-blur">
        Pixel-art scene
      </div>
      <div className="absolute bottom-6 right-7 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-primary backdrop-blur">
        Батырлар жорығы
      </div>
    </div>
  );
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <section className="relative mx-auto grid w-full max-w-[1600px] gap-8 overflow-hidden rounded-[48px] border border-white/10 bg-[#071421]/72 p-5 shadow-[0_40px_160px_rgba(0,0,0,0.42)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-8 xl:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,216,128,0.16),transparent_24%),radial-gradient(circle_at_72%_18%,rgba(45,212,191,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_42%)]" />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 space-y-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Kaboom.js adventure</Badge>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.45em] text-foreground/55">
              Қазақ батырлары туралы білім ойыны
            </p>
            <h1 className="max-w-4xl font-display text-6xl font-semibold leading-none text-white sm:text-7xl xl:text-8xl">
              Ерлік жолы
              <span className="block ornament-text">басталады</span>
            </h1>
            <Ornament className="max-w-xl" />
          </div>

          <p className="max-w-2xl text-balance text-lg leading-8 text-foreground/76 xl:text-xl xl:leading-9">
            Батырды таңда, кең дала сахнасында жорыққа шық, артефакт жина, жауды жең және тарихи
            сұрақтарға жауап беріп нақты ұпай ал.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={onStart} className="min-w-52">
            <Play className="h-5 w-5 fill-current" />
            Ойынды бастау
          </Button>
          <Button size="lg" variant="outline" onClick={onStart}>
            Батыр таңдау
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          {routeSteps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index, duration: 0.45 }}
              className="rounded-2xl border border-white/10 bg-white/[0.045] p-3 backdrop-blur"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-primary/30 bg-primary/12 text-xs font-semibold text-primary">
                {index + 1}
              </div>
              <p className="text-sm font-semibold text-white">{step}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="relative z-10 space-y-5"
      >
        <SteppePreview />

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * (index + 1), duration: 0.6 }}
            >
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl text-white">{item.title}</h3>
                    <p className="text-sm leading-7 text-foreground/68">{item.text}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-[28px] border border-white/10 bg-white/[0.045] p-4 text-sm text-foreground/72 backdrop-blur">
          <Trophy className="h-5 w-5 text-primary" />
          Финалда оқушыға ұпай, ранг және жетістіктер көрсетіледі.
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
      </motion.div>
    </section>
  );
}
