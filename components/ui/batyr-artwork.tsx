import { Axe, Shield, Sparkles, Swords, Target, Wind } from "lucide-react";

import type { Batyr } from "@/lib/types";
import { cn } from "@/lib/utils";

function getBatyrIcon(id: string) {
  switch (id) {
    case "qobylandy":
      return Wind;
    case "bogenbay":
      return Axe;
    case "qabanbay":
      return Shield;
    case "raiymbek":
      return Swords;
    default:
      return Sparkles;
  }
}

function getBatyrAura(id: string) {
  switch (id) {
    case "qobylandy":
      return "Жел";
    case "bogenbay":
      return "Қуат";
    case "qabanbay":
      return "Теңдік";
    case "raiymbek":
      return "Еп";
    default:
      return "Рух";
  }
}

function getBatyrAsset(id: string) {
  switch (id) {
    case "qobylandy":
      return "koblandy";
    case "bogenbay":
      return "bogenbai";
    case "qabanbay":
      return "kabanbai";
    case "raiymbek":
      return "raimbek";
    default:
      return id;
  }
}

interface BatyrArtworkProps {
  batyr: Batyr;
  size?: "icon" | "card" | "profile";
  className?: string;
}

export function BatyrArtwork({
  batyr,
  size = "card",
  className,
}: BatyrArtworkProps) {
  const Icon = getBatyrIcon(batyr.id);

  if (size === "icon") {
    return (
      <div
        className={cn(
          "hero-card relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/12",
          className,
        )}
        style={{
          background: `radial-gradient(circle at 30% 20%, ${batyr.colors.glow}55, transparent 45%), linear-gradient(135deg, ${batyr.colors.sky}, ${batyr.colors.secondary})`,
          boxShadow: `0 20px 40px ${batyr.colors.glow}22`,
        }}
      >
        <img
          src={`/assets/heroes/${getBatyrAsset(batyr.id)}.png`}
          alt={batyr.name}
          className="h-16 w-16 scale-[1.25] object-contain"
        />
        <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
    );
  }

  const isProfile = size === "profile";

  return (
    <div
      className={cn(
        "hero-card relative overflow-hidden rounded-[32px] border border-white/12",
        isProfile ? "min-h-[420px]" : "min-h-[280px]",
        className,
      )}
      style={{
        background: `radial-gradient(circle at 50% 18%, ${batyr.colors.glow}55, transparent 25%), radial-gradient(circle at 85% 22%, ${batyr.colors.accent}22, transparent 20%), linear-gradient(155deg, ${batyr.colors.sky}, ${batyr.colors.secondary} 55%, #09111d)`,
        boxShadow: `0 30px 100px ${batyr.colors.glow}20`,
      }}
    >
      <div className="grain-overlay" />
      <div
        className="absolute inset-x-10 top-10 h-28 rounded-full blur-3xl"
        style={{ background: `${batyr.colors.glow}33` }}
      />
      <div
        className="absolute right-8 top-8 z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/12 bg-white/[0.08] backdrop-blur"
        style={{ boxShadow: `0 0 40px ${batyr.colors.glow}22` }}
      >
        <Icon className="h-7 w-7 text-[#fff0c2]" />
      </div>
      <div className="absolute left-8 top-8 z-10 flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-white/75">
        <Target className="h-3.5 w-3.5 text-primary" />
        {getBatyrAura(batyr.id)}
      </div>

      <div className={cn("absolute inset-x-5 flex items-end justify-center overflow-hidden", isProfile ? "bottom-14 top-16" : "bottom-12 top-20")}>
        <img
          src={`/assets/heroes/${getBatyrAsset(batyr.id)}.png`}
          alt={batyr.name}
          className={cn(
            "object-contain drop-shadow-[0_22px_22px_rgba(0,0,0,0.35)]",
            isProfile ? "h-[118%]" : "h-[122%]",
          )}
        />
      </div>

      <div className="absolute inset-x-7 bottom-7 z-10 flex items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.4em] text-white/55">Батыр рухы</p>
          <h3 className={cn("font-display text-3xl font-semibold text-white", !isProfile && "text-2xl")}>
            {batyr.name}
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/12 bg-black/15 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-white/75">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {batyr.specialAbility}
        </div>
      </div>
    </div>
  );
}
