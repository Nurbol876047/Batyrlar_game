"use client";

import type { RefObject } from "react";
import { AlertTriangle, Flag, ScrollText, Sparkles, Swords } from "lucide-react";

import { EnemyBattleSprite, HeroBattleSprite } from "@/components/ui/batyr-figure";
import { GROUND_OFFSET, LEVEL_WIDTH, STAGE_HEIGHT } from "@/lib/game";
import type { Batyr, LevelArtifact, LevelEnemy, LevelObstacle, PlayerState } from "@/lib/types";

interface GameStageProps {
  batyr: Batyr;
  stageRef: RefObject<HTMLDivElement>;
  player: PlayerState;
  enemies: LevelEnemy[];
  artifacts: LevelArtifact[];
  obstacles: LevelObstacle[];
  cameraX: number;
  moving: boolean;
}

function ArtifactSprite({ collected }: { collected: boolean }) {
  if (collected) {
    return null;
  }

  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <div className="absolute inset-0 animate-pulse-soft rounded-full bg-primary/20 blur-lg" />
      <div className="absolute inset-2 rounded-2xl border border-primary/30 bg-slate-950/70 backdrop-blur" />
      <ScrollText className="relative z-10 h-6 w-6 text-primary" />
    </div>
  );
}

function ObstacleSprite({ obstacle }: { obstacle: LevelObstacle }) {
  const isFire = obstacle.id.includes("fire");

  if (isFire) {
    return (
      <div className="relative">
        <div className="absolute inset-x-0 bottom-0 h-4 rounded-full bg-black/35 blur-md" />
        <div className="flex items-end gap-1.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-t-full"
              style={{
                width: 12 + index * 5,
                height: 24 + (index % 2) * 12,
                background:
                  "linear-gradient(180deg, rgba(255,228,160,0.94), rgba(249,115,22,0.96), rgba(127,29,29,0.94))",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-x-2 bottom-0 h-4 rounded-full bg-black/35 blur-md" />
      <div className="h-12 w-24 rounded-[24px] border border-white/12 bg-gradient-to-br from-stone-400/30 to-stone-900/80" />
      <div className="absolute left-8 top-[-10px] h-10 w-10 rounded-full border border-white/10 bg-gradient-to-b from-stone-300/40 to-stone-900/80" />
    </div>
  );
}

function getBattleState({
  now,
  moving,
  y,
  hitUntil,
  specialUntil,
  attackUntil,
}: {
  now: number;
  moving: boolean;
  y: number;
  hitUntil: number;
  specialUntil: number;
  attackUntil: number;
}) {
  if (hitUntil > now) {
    return "hit" as const;
  }

  if (specialUntil > now) {
    return "special" as const;
  }

  if (attackUntil > now) {
    return "attack" as const;
  }

  if (y > 6) {
    return "jump" as const;
  }

  if (moving) {
    return "run" as const;
  }

  return "idle" as const;
}

export function GameStage({
  batyr,
  stageRef,
  player,
  enemies,
  artifacts,
  obstacles,
  cameraX,
  moving,
}: GameStageProps) {
  const now = Date.now();
  const playerState = getBattleState({
    now,
    moving,
    y: player.y,
    hitUntil: player.hitUntil,
    specialUntil: player.specialUntil,
    attackUntil: player.attackUntil,
  });

  return (
    <div
      ref={stageRef}
      className="relative h-[460px] overflow-hidden rounded-[36px] border border-white/12 bg-[#081320]/80 shadow-[0_32px_120px_rgba(0,0,0,0.4)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#08172b_0%,#0d1f37_48%,#12213a_70%,#16273d_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(255,212,132,0.22),transparent_16%),radial-gradient(circle_at_14%_18%,rgba(52,195,179,0.14),transparent_20%)]" />

      <div
        className="absolute inset-x-[-8%] top-[18%] h-44 rounded-[50%] bg-white/10 blur-3xl"
        style={{ transform: `translateX(${-cameraX * 0.05}px)` }}
      />
      <div
        className="absolute bottom-[35%] left-[-10%] h-44 w-[70%] bg-[#18314c]/80"
        style={{
          clipPath: "polygon(0 100%, 12% 56%, 24% 70%, 38% 28%, 58% 72%, 72% 36%, 100% 100%)",
          transform: `translateX(${-cameraX * 0.12}px)`,
        }}
      />
      <div
        className="absolute bottom-[32%] right-[-10%] h-52 w-[76%] bg-[#10263d]/92"
        style={{
          clipPath: "polygon(0 100%, 18% 44%, 34% 76%, 48% 34%, 70% 68%, 84% 42%, 100% 100%)",
          transform: `translateX(${-cameraX * 0.18}px)`,
        }}
      />
      <div
        className="absolute bottom-[18%] left-[-8%] h-40 w-[68%] bg-[#1d5d5e]/24"
        style={{
          clipPath: "polygon(0 100%, 12% 58%, 32% 82%, 50% 34%, 66% 74%, 82% 42%, 100% 100%)",
          transform: `translateX(${-cameraX * 0.3}px)`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[170px] bg-[linear-gradient(180deg,rgba(194,141,73,0),rgba(194,141,73,0.16),rgba(25,16,10,0.66))]" />
      <div className="absolute inset-x-0 bottom-0 h-[84px] bg-[linear-gradient(180deg,#3b4e3b,#273623)]" />

      <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-foreground/65 backdrop-blur">
        <Swords className="h-3.5 w-3.5 text-primary" />
        A / D • ↑ / W • Enter • K
      </div>

      <div
        className="absolute inset-y-0 left-0"
        style={{ width: LEVEL_WIDTH, transform: `translateX(-${cameraX}px)` }}
      >
        <div
          className="absolute bottom-[84px] left-0 h-[2px] bg-primary/20"
          style={{ width: LEVEL_WIDTH }}
        />
        <div
          className="absolute bottom-[82px] left-0 h-10 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.04)_0_44px,transparent_44px_86px)] opacity-35"
          style={{ width: LEVEL_WIDTH }}
        />

        <div className="absolute bottom-[118px] right-[84px] flex flex-col items-center gap-2">
          <div className="rounded-full border border-primary/22 bg-primary/12 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-primary">
            Мәреге жет
          </div>
          <div className="relative flex h-28 w-24 items-end justify-center">
            <div className="absolute bottom-0 h-28 w-1 rounded-full bg-primary/80" />
            <div className="absolute bottom-16 left-1/2 h-11 w-16 -translate-x-[2px] bg-[linear-gradient(135deg,#efc56d,#0ea5a1)] [clip-path:polygon(0_0,100%_28%,14%_100%)]" />
            <Flag className="absolute bottom-20 left-1/2 h-5 w-5 -translate-x-[22px] text-primary" />
          </div>
        </div>

        {artifacts.map((artifact) => (
          <div
            key={artifact.id}
            className="absolute"
            style={{
              left: artifact.x - 28,
              bottom: GROUND_OFFSET + 72,
            }}
          >
            <ArtifactSprite collected={artifact.collected} />
          </div>
        ))}

        {obstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            className="absolute"
            style={{
              left: obstacle.x - obstacle.width / 2,
              bottom: GROUND_OFFSET - 6,
            }}
          >
            <ObstacleSprite obstacle={obstacle} />
          </div>
        ))}

        {enemies.map((enemy) =>
          enemy.alive ? (
            <div
              key={enemy.id}
              className="absolute"
              style={{
                left: enemy.x - (enemy.type === "boss" ? 54 : 44),
                bottom: GROUND_OFFSET + (enemy.type === "boss" ? 6 : 0),
              }}
            >
              <div className="absolute -top-10 left-1/2 w-24 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.26em] text-white/65">
                {enemy.name}
              </div>
              <div className="absolute -top-4 left-1/2 h-1.5 w-20 -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-300"
                  style={{
                    width: `${(enemy.hp / enemy.maxHp) * 100}%`,
                  }}
                />
              </div>
              <EnemyBattleSprite
                type={enemy.type}
                direction={enemy.direction}
                state={getBattleState({
                  now,
                  moving: enemy.alive,
                  y: 0,
                  hitUntil: enemy.hitUntil,
                  specialUntil: 0,
                  attackUntil: enemy.attackUntil,
                })}
              />
            </div>
          ) : null,
        )}

        <div
          className="absolute"
          style={{
            left: player.x - 52,
            bottom: GROUND_OFFSET + player.y - 2,
          }}
        >
          <div className="absolute -top-10 left-1/2 w-28 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.26em] text-primary">
            {batyr.name}
          </div>
          <HeroBattleSprite
            batyr={batyr}
            direction={player.direction}
            state={playerState}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[84px] bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.34))]" />
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-foreground/65 backdrop-blur">
        <AlertTriangle className="h-3.5 w-3.5 text-primary" />
        Артефакт, кедергі және тарихи сұрақтарды бақылаңыз
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-2 text-[11px] uppercase tracking-[0.28em] text-foreground/65 backdrop-blur">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        Stage {STAGE_HEIGHT}px • World {LEVEL_WIDTH}px
      </div>
    </div>
  );
}
