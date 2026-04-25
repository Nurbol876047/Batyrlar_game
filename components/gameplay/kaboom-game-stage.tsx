"use client";

import { useEffect, useRef } from "react";
import type { KaboomCtx } from "kaboom";

import { LEVEL_WIDTH, clamp, createInitialLevelState } from "@/lib/game";
import type { Batyr, LevelState, OverlayEvent, QuizReward } from "@/lib/types";
import type { SoundKind } from "@/hooks/use-audio-feedback";

export type MoveAxis = -1 | 0 | 1;

export interface KaboomInputState {
  axis: MoveAxis;
  jump: number;
  attack: number;
  special: number;
}

export interface QuizResultSignal {
  id: number;
  correct: boolean;
  reward: QuizReward;
}

interface KaboomGameStageProps {
  batyr: Batyr;
  input: KaboomInputState;
  paused: boolean;
  resetKey: number;
  quizResult: QuizResultSignal | null;
  onStateChange: (state: LevelState) => void;
  onEvents: (events: OverlayEvent[]) => void;
  onSound: (kind: SoundKind) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

interface KaboomHeroPalette {
  skin: string;
  sleeve: string;
  tunic: string;
  cloak: string;
  belt: string;
  trim: string;
  boots: string;
  bootsShadow: string;
  shieldOuter: string;
  shieldInner: string;
  shieldRim: string;
  weaponShaft: string;
  weaponTip: string;
  helmet: string;
  helmetShadow: string;
  plume: string;
  beard: string;
  label: string;
  showShield: boolean;
  helmetSpire: boolean;
}

interface Runtime {
  state: LevelState;
  velocityX: number;
  cameraX: number;
  facing: 1 | -1;
  lastJump: number;
  lastAttack: number;
  lastSpecial: number;
  jumpReadyAt: number;
  lastSnapshotAt: number;
  victoryAwarded: boolean;
  particles: Particle[];
  publish: (force?: boolean) => void;
  burst: (x: number, y: number, color: string, amount?: number) => void;
}

const VIEW_WIDTH = 1536;
const VIEW_HEIGHT = 864;
const GROUND_Y = VIEW_HEIGHT - 138;
const PLAYER_HALF_WIDTH = 34;
const GRAVITY = 1580;
const JUMP_COOLDOWN_MS = 380;
const ATTACK_COOLDOWN_MS = 260;
const SPECIAL_COOLDOWN_BUFFER_MS = 160;
const SNAPSHOT_INTERVAL_MS = 70;
const HERO_FRAME_SIZE = 96;
const HERO_FRAME_FOOT_Y = 88;
const HERO_SPRITE_SCALE = 1.55;

const HERO_SPRITE_ASSETS: Record<string, string> = {
  qobylandy: "koblandy",
  bogenbay: "bogenbai",
  qabanbay: "kabanbai",
  raiymbek: "raimbek",
};

type HeroAnimName = "idle" | "walk" | "attack" | "jump" | "hurt" | "victory";

const heroSpriteName = (id: string) => HERO_SPRITE_ASSETS[id] ?? id;

function loadHeroSpriteSheets(k: KaboomCtx) {
  Object.values(HERO_SPRITE_ASSETS).forEach((name) => {

    if (k.getSprite(name)) {
      return;
    }

    k.loadSprite(name, `/assets/sprites/${name}_sheet.png`, {
      sliceX: 12,
      sliceY: 1,
      anims: {
        idle: { from: 0, to: 1, loop: true, speed: 2 },
        walk: { from: 2, to: 5, loop: true, speed: 8 },
        attack: { from: 6, to: 8, loop: false, speed: 10 },
        jump: 9,
        hurt: 10,
        victory: 11,
      },
    });
  });
}

const cloneLevelState = (state: LevelState): LevelState => ({
  ...state,
  player: { ...state.player },
  enemies: state.enemies.map((enemy) => ({ ...enemy })),
  artifacts: state.artifacts.map((artifact) => ({ ...artifact })),
  obstacles: state.obstacles,
  stats: { ...state.stats },
});

const directionFromAxis = (axis: MoveAxis, fallback: 1 | -1): 1 | -1 =>
  axis === 0 ? fallback : axis;

function getKaboomHeroPalette(batyrId: string): KaboomHeroPalette {
  if (batyrId === "qabanbay") {
    return {
      skin: "#d8a06d",
      sleeve: "#183b7c",
      tunic: "#244d9e",
      cloak: "#4b2c1d",
      belt: "#d6931d",
      trim: "#ffd45c",
      boots: "#9f2f17",
      bootsShadow: "#6d1d0d",
      shieldOuter: "#2d2018",
      shieldInner: "#4c3327",
      shieldRim: "#b8c2c8",
      weaponShaft: "#6b4529",
      weaponTip: "#d8dee8",
      helmet: "#d69b16",
      helmetShadow: "#9f650b",
      plume: "#f7c948",
      beard: "#23130e",
      label: "#ffd45c",
      showShield: false,
      helmetSpire: true,
    };
  }

  return {
    skin: "#d7a275",
    sleeve: "#2f6e35",
    tunic: "#5b4c8d",
    cloak: "#563323",
    belt: "#f0bb58",
    trim: "#f8d784",
    boots: "#9a3119",
    bootsShadow: "#641d0d",
    shieldOuter: "#2b1914",
    shieldInner: "#4d3428",
    shieldRim: "#9aa3a8",
    weaponShaft: "#6c472e",
    weaponTip: "#dce3e8",
    helmet: "#c59642",
    helmetShadow: "#8f642b",
    plume: "#35bfb1",
    beard: "#2b1912",
    label: "#f4c15e",
    showShield: true,
    helmetSpire: false,
  };
}

function drawMountains(k: KaboomCtx, cameraX: number, viewW: number) {
  const farShift = -cameraX * 0.12;
  const nearShift = -cameraX * 0.28;

  k.drawCircle({
    pos: k.vec2(viewW * 0.72, 112),
    radius: 74,
    color: k.rgb("#f7d28a"),
    opacity: 0.14,
  });
  k.drawCircle({
    pos: k.vec2(viewW * 0.72, 112),
    radius: 42,
    color: k.rgb("#fff1ba"),
    opacity: 0.56,
  });

  k.drawPolygon({
    pts: [
      k.vec2(-190 + farShift, GROUND_Y - 96),
      k.vec2(150 + farShift, 292),
      k.vec2(430 + farShift, GROUND_Y - 96),
      k.vec2(700 + farShift, 318),
      k.vec2(1030 + farShift, GROUND_Y - 96),
      k.vec2(viewW + 130 + farShift, 336),
      k.vec2(viewW + 360 + farShift, GROUND_Y - 96),
    ],
    color: k.rgb("#183453"),
    opacity: 0.86,
  });
  k.drawPolygon({
    pts: [
      k.vec2(-140 + nearShift, GROUND_Y - 62),
      k.vec2(240 + nearShift, 376),
      k.vec2(560 + nearShift, GROUND_Y - 62),
      k.vec2(820 + nearShift, 352),
      k.vec2(1180 + nearShift, GROUND_Y - 62),
      k.vec2(viewW + 160 + nearShift, 386),
      k.vec2(viewW + 430 + nearShift, GROUND_Y - 62),
    ],
    color: k.rgb("#102a44"),
    opacity: 0.92,
  });
}

function drawCamp(k: KaboomCtx, runtime: Runtime) {
  const t = k.time();
  const yurtX = 1090 - runtime.cameraX * 0.42;
  const yurtY = GROUND_Y - 84;
  const fireX = 1324 - runtime.cameraX * 0.48;

  k.drawCircle({
    pos: k.vec2(yurtX, yurtY + 70),
    radius: 82,
    color: k.rgb("#020814"),
    opacity: 0.22,
    scale: k.vec2(1.35, 0.28),
  });
  k.drawRect({
    pos: k.vec2(yurtX - 86, yurtY + 22),
    width: 172,
    height: 70,
    radius: 16,
    color: k.rgb("#d8c59b"),
    opacity: 0.82,
  });
  k.drawPolygon({
    pts: [
      k.vec2(yurtX - 92, yurtY + 29),
      k.vec2(yurtX, yurtY - 42),
      k.vec2(yurtX + 92, yurtY + 29),
    ],
    color: k.rgb("#b98a52"),
    opacity: 0.84,
  });
  k.drawLine({
    p1: k.vec2(yurtX - 70, yurtY + 38),
    p2: k.vec2(yurtX + 70, yurtY + 38),
    width: 5,
    color: k.rgb("#8f5d2e"),
    opacity: 0.68,
  });
  k.drawRect({
    pos: k.vec2(yurtX - 18, yurtY + 51),
    width: 36,
    height: 42,
    radius: 8,
    color: k.rgb("#53341f"),
    opacity: 0.9,
  });
  k.drawCircle({
    pos: k.vec2(fireX, GROUND_Y - 18),
    radius: 44,
    color: k.rgb("#ffb84c"),
    opacity: 0.1 + Math.sin(t * 8) * 0.02,
  });

  for (let index = 0; index < 3; index += 1) {
    const flameHeight = 28 + Math.sin(t * 9 + index) * 5;
    const x = fireX - 13 + index * 12;
    k.drawPolygon({
      pts: [
        k.vec2(x - 9, GROUND_Y - 8),
        k.vec2(x, GROUND_Y - 8 - flameHeight),
        k.vec2(x + 10, GROUND_Y - 8),
      ],
      color: k.rgb(index === 1 ? "#fff0a3" : "#f97316"),
      opacity: 0.74,
    });
  }
}

function drawBackground(k: KaboomCtx, runtime: Runtime) {
  const viewW = k.width();
  const viewH = k.height();
  const t = k.time();

  k.drawRect({
    pos: k.vec2(0, 0),
    width: viewW,
    height: viewH,
    gradient: [k.rgb("#071427"), k.rgb("#12233c")],
  });
  k.drawRect({
    pos: k.vec2(0, 0),
    width: viewW,
    height: viewH,
    gradient: [k.rgb("#0b2b34"), k.rgb("#081220")],
    opacity: 0.44,
    horizontal: true,
  });

  for (let index = 0; index < 34; index += 1) {
    const x = (index * 181 - runtime.cameraX * 0.04) % (viewW + 180);
    const y = 38 + ((index * 53) % 210);
    k.drawCircle({
      pos: k.vec2(x < -40 ? x + viewW + 160 : x, y),
      radius: 1.6 + (index % 3) * 0.7,
      color: k.rgb("#f8d889"),
      opacity: 0.18 + Math.sin(t * 1.4 + index) * 0.05,
    });
  }

  drawMountains(k, runtime.cameraX, viewW);
  drawCamp(k, runtime);

  k.drawRect({
    pos: k.vec2(0, GROUND_Y),
    width: viewW,
    height: viewH - GROUND_Y,
    gradient: [k.rgb("#49613e"), k.rgb("#1f2d1f")],
  });
  k.drawRect({
    pos: k.vec2(0, GROUND_Y - 18),
    width: viewW,
    height: 28,
    gradient: [k.rgb("#86a958"), k.rgb("#263925")],
    opacity: 0.88,
  });

  const stripeShift = (-runtime.cameraX * 0.8) % 86;
  for (let x = stripeShift - 86; x < viewW + 86; x += 86) {
    k.drawRect({
      pos: k.vec2(x, GROUND_Y - 1),
      width: 44,
      height: 66,
      color: k.rgb("#ffffff"),
      opacity: 0.035,
    });
  }
}

function drawWorldLabel(k: KaboomCtx, text: string, x: number, y: number, cameraX: number, color: string) {
  k.drawText({
    text,
    pos: k.vec2(x - cameraX, y),
    size: 18,
    width: 240,
    align: "center",
    color: k.rgb(color),
    opacity: 0.82,
  });
}

function drawArtifact(k: KaboomCtx, x: number, y: number, cameraX: number) {
  const screenX = x - cameraX;
  const bob = Math.sin(k.time() * 3 + x * 0.02) * 5;

  k.drawCircle({
    pos: k.vec2(screenX, y + bob),
    radius: 38,
    color: k.rgb("#ffd96d"),
    opacity: 0.16,
  });
  k.drawCircle({
    pos: k.vec2(screenX, y + bob),
    radius: 25,
    color: k.rgb("#081320"),
    opacity: 0.88,
  });
  k.drawRect({
    pos: k.vec2(screenX - 13, y - 15 + bob),
    width: 26,
    height: 32,
    radius: 5,
    color: k.rgb("#f4c15e"),
    opacity: 0.9,
  });
  k.drawLine({
    p1: k.vec2(screenX - 7, y - 5 + bob),
    p2: k.vec2(screenX + 8, y - 5 + bob),
    width: 3,
    color: k.rgb("#513c22"),
  });
  k.drawLine({
    p1: k.vec2(screenX - 7, y + 5 + bob),
    p2: k.vec2(screenX + 8, y + 5 + bob),
    width: 3,
    color: k.rgb("#513c22"),
  });
}

function drawObstacle(k: KaboomCtx, x: number, cameraX: number, id: string, width: number) {
  const screenX = x - cameraX;
  const t = k.time();

  if (id.includes("fire")) {
    for (let index = 0; index < 4; index += 1) {
      const flameX = screenX - width / 2 + 22 + index * 22;
      const flameHeight = 44 + Math.sin(t * 7 + index) * 8 + (index % 2) * 14;
      k.drawPolygon({
        pts: [
          k.vec2(flameX - 9, GROUND_Y),
          k.vec2(flameX, GROUND_Y - flameHeight),
          k.vec2(flameX + 12, GROUND_Y),
        ],
        color: k.rgb(index % 2 === 0 ? "#f97316" : "#fff0a3"),
        opacity: 0.92,
      });
    }
    k.drawRect({
      pos: k.vec2(screenX - width / 2, GROUND_Y - 4),
      width,
      height: 10,
      radius: 8,
      color: k.rgb("#2a130e"),
      opacity: 0.58,
    });
    return;
  }

  k.drawCircle({
    pos: k.vec2(screenX - 24, GROUND_Y - 26),
    radius: 34,
    color: k.rgb("#6f6f68"),
    opacity: 0.76,
  });
  k.drawCircle({
    pos: k.vec2(screenX + 24, GROUND_Y - 36),
    radius: 42,
    color: k.rgb("#8c8b83"),
    opacity: 0.72,
  });
  k.drawRect({
    pos: k.vec2(screenX - width / 2, GROUND_Y - 32),
    width,
    height: 40,
    radius: 20,
    color: k.rgb("#504f49"),
    opacity: 0.78,
  });
}

function drawHero(k: KaboomCtx, state: LevelState, runtime: Runtime, batyr: Batyr) {
  const palette = getKaboomHeroPalette(batyr.id);
  const player = state.player;
  const x = player.x - runtime.cameraX;
  const footY = GROUND_Y - player.y;
  const now = Date.now();
  const moving = Math.abs(runtime.velocityX) > 24 && player.y <= 4;
  const jumping = player.y > 8;
  const attacking = player.attackUntil > now;
  const special = player.specialUntil > now;
  const hit = player.hitUntil > now;
  const victory = state.gamePhase === "victory";
  const anim: HeroAnimName = victory
    ? "victory"
    : hit
      ? "hurt"
      : special || attacking
        ? "attack"
        : jumping
          ? "jump"
          : moving
            ? "walk"
            : "idle";
  const attackUntil = Math.max(player.attackUntil, player.specialUntil);
  const attackDuration = special ? 560 : 330;
  const attackProgress =
    anim === "attack" ? 1 - clamp((attackUntil - now) / attackDuration, 0, 1) : 0;
  const frame =
    anim === "walk"
      ? 2 + (Math.floor(k.time() * 8) % 4)
      : anim === "attack"
        ? 6 + Math.min(2, Math.floor(attackProgress * 3))
        : anim === "jump"
          ? 9
          : anim === "hurt"
            ? 10
            : anim === "victory"
              ? 11
              : Math.floor(k.time() * 2) % 2;
  const spriteAsset = k.getSprite(heroSpriteName(batyr.id));
  const glow = special ? 0.28 + Math.sin(k.time() * 12) * 0.1 : victory ? 0.24 : 0;
  const spriteScale = HERO_SPRITE_SCALE + (special ? 0.08 : 0);
  const drawWidth = HERO_FRAME_SIZE * spriteScale;
  const drawHeight = HERO_FRAME_SIZE * spriteScale;
  const spriteX = x - drawWidth / 2;
  const spriteY = footY - HERO_FRAME_FOOT_Y * spriteScale;

  k.drawCircle({
    pos: k.vec2(x, footY - 45),
    radius: 56,
    color: k.rgb(batyr.colors.glow),
    opacity: glow,
  });
  k.drawCircle({
    pos: k.vec2(x, footY - 2),
    radius: 34,
    color: k.rgb("#020814"),
    opacity: 0.34,
    scale: k.vec2(1.35, 0.34),
  });

  if (spriteAsset?.loaded) {
    k.drawSprite({
      sprite: spriteAsset,
      frame,
      pos: k.vec2(spriteX, spriteY),
      width: drawWidth,
      height: drawHeight,
      flipX: runtime.facing === -1,
      opacity: hit ? 0.82 : 1,
    });
  }

  if (jumping) {
    k.drawText({
      text: "секіру",
      pos: k.vec2(x - 40, spriteY - 22),
      size: 18,
      color: k.rgb("#3fe7dd"),
      opacity: 0.68,
    });
  }

  drawWorldLabel(k, batyr.name, player.x - 120, spriteY - 24, runtime.cameraX, palette.label);
}

function drawEnemy(k: KaboomCtx, enemy: LevelState["enemies"][number], cameraX: number) {
  const x = enemy.x - cameraX;
  const footY = GROUND_Y;
  const now = Date.now();
  const hit = enemy.hitUntil > now;
  const attacking = enemy.attackUntil > now;
  const dir = enemy.direction;
  const size = enemy.type === "boss" ? 1.42 : 1.24;
  const torsoY = footY - 70 * size + Math.sin(k.time() * 8 + enemy.x) * 2;
  const headY = footY - 112 * size;

  k.drawCircle({
    pos: k.vec2(x, footY - 2),
    radius: 24 * size,
    color: k.rgb("#020814"),
    opacity: 0.32,
    scale: k.vec2(1.35, 0.34),
  });
  k.drawRect({
    pos: k.vec2(x - 20 * size, torsoY),
    width: 40 * size,
    height: 54 * size,
    radius: 10,
    color: k.rgb(hit ? "#9f3f4d" : "#65293a"),
  });
  k.drawRect({
    pos: k.vec2(x - 15 * size, torsoY + 30 * size),
    width: 30 * size,
    height: 8 * size,
    radius: 5,
    color: k.rgb("#e67552"),
  });
  k.drawLine({
    p1: k.vec2(x - 10 * size, footY - 22 * size),
    p2: k.vec2(x - 13 * size, footY - 2),
    width: 10 * size,
    color: k.rgb("#8f3718"),
  });
  k.drawLine({
    p1: k.vec2(x + 10 * size, footY - 22 * size),
    p2: k.vec2(x + 13 * size, footY - 2),
    width: 10 * size,
    color: k.rgb("#5a210d"),
  });
  k.drawCircle({
    pos: k.vec2(x, headY),
    radius: 18 * size,
    color: k.rgb("#be8366"),
  });
  k.drawRect({
    pos: k.vec2(x - 12 * size, headY + 8 * size),
    width: 24 * size,
    height: 12 * size,
    radius: 8,
    color: k.rgb("#23120d"),
  });
  k.drawPolygon({
    pts: [
      k.vec2(x - 23 * size, headY - 10 * size),
      k.vec2(x, headY - 29 * size),
      k.vec2(x + 24 * size, headY - 10 * size),
    ],
    color: k.rgb("#71303d"),
  });
  k.drawLine({
    p1: k.vec2(x + dir * 12 * size, torsoY + 22 * size),
    p2: k.vec2(x + dir * (attacking ? 66 : 38) * size, torsoY - (attacking ? 6 : 26) * size),
    width: 4 * size,
    color: k.rgb("#d8b26c"),
  });

  k.drawRect({
    pos: k.vec2(x - 58, headY - 42 * size),
    width: 116,
    height: 8,
    radius: 4,
    color: k.rgb("#ffffff"),
    opacity: 0.13,
  });
  k.drawRect({
    pos: k.vec2(x - 58, headY - 42 * size),
    width: 116 * (enemy.hp / enemy.maxHp),
    height: 8,
    radius: 4,
    gradient: [k.rgb("#fb7185"), k.rgb("#f4c15e")],
  });
  drawWorldLabel(k, enemy.name, enemy.x - 120, headY - 66 * size, cameraX, "#ffffff");
}

function drawParticles(k: KaboomCtx, runtime: Runtime) {
  runtime.particles.forEach((particle) => {
    k.drawCircle({
      pos: k.vec2(particle.x - runtime.cameraX, particle.y),
      radius: particle.size,
      color: k.rgb(particle.color),
      opacity: clamp(particle.life / particle.maxLife, 0, 1),
    });
  });
}

function applyHit(runtime: Runtime, damage: number, knockback: number, now: number) {
  const player = runtime.state.player;

  if (player.invulnerableUntil > now) {
    return false;
  }

  player.hp = clamp(player.hp - damage, 0, player.maxHp);
  player.x = clamp(player.x - player.direction * knockback, 70, LEVEL_WIDTH - 70);
  player.hitUntil = now + 330;
  player.invulnerableUntil = now + 880;
  runtime.velocityX = -player.direction * 120;
  runtime.burst(player.x, GROUND_Y - player.y - 56, "#fb7185", 12);

  return true;
}

export function KaboomGameStage({
  batyr,
  input,
  paused,
  resetKey,
  quizResult,
  onStateChange,
  onEvents,
  onSound,
}: KaboomGameStageProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const runtimeRef = useRef<Runtime | null>(null);
  const inputRef = useRef(input);
  const pausedRef = useRef(paused);
  const quizResultRef = useRef<number | null>(null);
  const callbacksRef = useRef({ onStateChange, onEvents, onSound });

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    callbacksRef.current = { onStateChange, onEvents, onSound };
  }, [onEvents, onSound, onStateChange]);

  useEffect(() => {
    const runtime = runtimeRef.current;

    if (!runtime || !quizResult || quizResultRef.current === quizResult.id) {
      return;
    }

    quizResultRef.current = quizResult.id;
    runtime.state.stats.questionsAnswered += 1;

    if (quizResult.correct) {
      runtime.state.stats.correctAnswers += 1;
      runtime.state.player.score += quizResult.reward.score;
      runtime.state.player.hp = clamp(
        runtime.state.player.hp + (quizResult.reward.hp ?? 0),
        0,
        runtime.state.player.maxHp,
      );
      runtime.state.player.energy = clamp(
        runtime.state.player.energy + (quizResult.reward.energy ?? 0),
        0,
        100,
      );
      runtime.burst(runtime.state.player.x, GROUND_Y - runtime.state.player.y - 92, "#3fe7dd", 18);
    }

    runtime.state.flashSeed += 1;
    runtime.publish(true);
  }, [quizResult]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return undefined;
    }

    let disposed = false;
    let k: KaboomCtx | null = null;

    root.innerHTML = "";
    runtimeRef.current = null;
    quizResultRef.current = null;

    void import("kaboom").then(({ default: kaboom }) => {
      if (disposed || !rootRef.current) {
        return;
      }

      k = kaboom({
        root: rootRef.current,
        width: VIEW_WIDTH,
        height: VIEW_HEIGHT,
        stretch: true,
        letterbox: true,
        global: false,
        debug: false,
        background: [7, 18, 34],
        touchToMouse: false,
        loadingScreen: false,
        focus: false,
        crisp: true,
        texFilter: "nearest",
        pixelDensity: Math.min(window.devicePixelRatio || 1, 2),
      });
      loadHeroSpriteSheets(k);

      const state = createInitialLevelState(batyr);
      const runtime: Runtime = {
        state,
        velocityX: 0,
        cameraX: 0,
        facing: 1,
        lastJump: inputRef.current.jump,
        lastAttack: inputRef.current.attack,
        lastSpecial: inputRef.current.special,
        jumpReadyAt: 0,
        lastSnapshotAt: 0,
        victoryAwarded: false,
        particles: [],
        publish(force = false) {
          const now = Date.now();

          if (!force && now - this.lastSnapshotAt < SNAPSHOT_INTERVAL_MS) {
            return;
          }

          this.lastSnapshotAt = now;
          callbacksRef.current.onStateChange(cloneLevelState(this.state));
        },
        burst(x, y, color, amount = 10) {
          for (let index = 0; index < amount; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 60 + Math.random() * 180;
            this.particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 80,
              life: 0.38 + Math.random() * 0.32,
              maxLife: 0.7,
              size: 2 + Math.random() * 4,
              color,
            });
          }
        },
      };

      runtimeRef.current = runtime;
      runtime.publish(true);

      k.onUpdate(() => {
        if (!k || pausedRef.current || runtime.state.gamePhase !== "playing") {
          return;
        }

        const dt = Math.min(k.dt(), 0.034);
        const now = Date.now();
        const inputState = inputRef.current;
        const player = runtime.state.player;
        const targetVx = inputState.axis * batyr.gameplay.speed * 1.22;
        const accel = inputState.axis === 0 ? 9.5 : 13.5;

        runtime.velocityX += (targetVx - runtime.velocityX) * Math.min(1, dt * accel);

        if (Math.abs(runtime.velocityX) < 5 && inputState.axis === 0) {
          runtime.velocityX = 0;
        }

        if (inputState.axis !== 0) {
          runtime.facing = directionFromAxis(inputState.axis, runtime.facing);
          player.direction = runtime.facing;
        }

        if (
          inputState.jump !== runtime.lastJump &&
          now >= runtime.jumpReadyAt &&
          player.y <= 2 &&
          player.vy === 0 &&
          player.specialUntil <= now &&
          player.hitUntil <= now
        ) {
          player.vy = Math.min(batyr.gameplay.jumpPower * 1.32, 720);
          runtime.jumpReadyAt = now + JUMP_COOLDOWN_MS;
          runtime.burst(player.x - runtime.facing * 12, GROUND_Y - 8, "#d8f3dc", 8);
          callbacksRef.current.onSound("tap");
        }

        runtime.lastJump = inputState.jump;

        if (
          inputState.attack !== runtime.lastAttack &&
          player.attackUntil <= now &&
          player.specialUntil <= now &&
          player.hitUntil <= now
        ) {
          const facing = directionFromAxis(inputState.axis, player.direction);
          player.direction = facing;
          runtime.facing = facing;
          player.attackUntil = now + 330;
          player.invulnerableUntil = Math.max(player.invulnerableUntil, now + ATTACK_COOLDOWN_MS);
          runtime.velocityX += facing * 120;
          callbacksRef.current.onSound("attack");

          let kills = 0;
          let hits = 0;
          let scoreGain = 0;
          const events: OverlayEvent[] = [];

          runtime.state.enemies.forEach((enemy) => {
            if (!enemy.alive) {
              return;
            }

            const distance = enemy.x - player.x;
            const inFront = distance * facing >= -18;
            const inRange = Math.abs(distance) <= batyr.gameplay.attackRange + 34;

            if (!inFront || !inRange) {
              return;
            }

            hits += 1;
            enemy.hp = Math.max(0, enemy.hp - batyr.gameplay.attackDamage);
            enemy.hitUntil = now + 260;
            enemy.x = clamp(enemy.x + facing * 28, 84, LEVEL_WIDTH - 84);
            runtime.burst(enemy.x, GROUND_Y - 72, "#ffd96d", 12);

            if (enemy.hp <= 0) {
              enemy.alive = false;
              kills += 1;
              scoreGain += enemy.bounty;

              const question = batyr.quiz[runtime.state.stats.defeatedEnemies + kills - 1];
              if (question) {
                events.push({
                  type: "quiz",
                  payload: question,
                  sourceEnemyId: enemy.id,
                });
              }
            }
          });

          player.energy = clamp(player.energy + hits * 5 + kills * 5, 0, 100);
          player.score += scoreGain;
          runtime.state.stats.defeatedEnemies += kills;
          runtime.state.flashSeed += 1;

          if (events.length) {
            callbacksRef.current.onEvents(events);
          }
        }

        runtime.lastAttack = inputState.attack;

        if (
          inputState.special !== runtime.lastSpecial &&
          player.energy >= batyr.gameplay.specialCost &&
          player.specialCooldownUntil <= now &&
          player.hitUntil <= now
        ) {
          const facing = directionFromAxis(inputState.axis, player.direction);
          player.direction = facing;
          runtime.facing = facing;
          player.specialUntil = now + 560;
          player.specialCooldownUntil = now + batyr.gameplay.specialCooldown + SPECIAL_COOLDOWN_BUFFER_MS;
          player.energy = clamp(player.energy - batyr.gameplay.specialCost, 0, 100);
          runtime.velocityX += facing * 170;
          runtime.state.stats.usedSpecial = true;
          callbacksRef.current.onSound("special");
          k.shake(5);

          let kills = 0;
          let hits = 0;
          let scoreGain = 0;
          const events: OverlayEvent[] = [];

          runtime.state.enemies.forEach((enemy) => {
            if (!enemy.alive || Math.abs(enemy.x - player.x) > batyr.gameplay.attackRange + 150) {
              return;
            }

            hits += 1;
            enemy.hp = Math.max(0, enemy.hp - batyr.gameplay.specialDamage);
            enemy.hitUntil = now + 360;
            enemy.x = clamp(enemy.x + facing * 42, 84, LEVEL_WIDTH - 84);
            runtime.burst(enemy.x, GROUND_Y - 82, "#3fe7dd", 20);

            if (enemy.hp <= 0) {
              enemy.alive = false;
              kills += 1;
              scoreGain += enemy.bounty;

              const question = batyr.quiz[runtime.state.stats.defeatedEnemies + kills - 1];
              if (question) {
                events.push({
                  type: "quiz",
                  payload: question,
                  sourceEnemyId: enemy.id,
                });
              }
            }
          });

          player.energy = clamp(player.energy + hits * 3 + kills * 4, 0, 100);
          player.score += scoreGain;
          runtime.state.stats.defeatedEnemies += kills;
          runtime.state.flashSeed += 1;

          if (events.length) {
            callbacksRef.current.onEvents(events);
          }
        }

        runtime.lastSpecial = inputState.special;

        player.x = clamp(player.x + runtime.velocityX * dt, 70, LEVEL_WIDTH - 70);
        player.vy = clamp(player.vy - GRAVITY * dt, -900, 720);
        player.y += player.vy * dt;

        if (player.y <= 0) {
          if (player.vy < -260) {
            runtime.burst(player.x, GROUND_Y - 8, "#d8f3dc", 6);
          }

          player.y = 0;
          player.vy = 0;
        }

        player.energy = clamp(player.energy + dt * 5.8, 0, 100);

        runtime.state.artifacts.forEach((artifact) => {
          if (artifact.collected) {
            return;
          }

          const closeEnough = Math.abs(artifact.x - player.x) <= 54 && player.y < 96;
          if (!closeEnough) {
            return;
          }

          artifact.collected = true;
          player.score += artifact.points;
          player.energy = clamp(player.energy + 12, 0, 100);
          runtime.state.stats.collectedArtifacts += 1;
          runtime.state.stats.factsUnlocked += 1;
          runtime.state.flashSeed += 1;
          runtime.burst(artifact.x, GROUND_Y - 112, "#ffd96d", 18);
          callbacksRef.current.onSound("correct");

          const fact = batyr.facts[artifact.factIndex];
          if (fact) {
            callbacksRef.current.onEvents([
              {
                type: "fact",
                payload: fact,
                reward: artifact.points,
                artifactId: artifact.id,
              },
            ]);
          }
        });

        runtime.state.obstacles.forEach((obstacle) => {
          const overlaps =
            Math.abs(obstacle.x - player.x) < obstacle.width / 2 + PLAYER_HALF_WIDTH &&
            player.y < obstacle.height + 10;

          if (overlaps && applyHit(runtime, obstacle.damage, 42, now)) {
            callbacksRef.current.onSound("impact");
            k?.shake(3);
          }
        });

        runtime.state.enemies.forEach((enemy) => {
          if (!enemy.alive || enemy.hitUntil > now) {
            return;
          }

          const distance = player.x - enemy.x;
          enemy.direction = distance >= 0 ? 1 : -1;

          if (Math.abs(distance) < 330) {
            if (Math.abs(distance) > (enemy.type === "boss" ? 102 : 78)) {
              enemy.x += enemy.direction * enemy.speed * 1.06 * dt;
            } else if (enemy.cooldownUntil <= now && player.y < 76) {
              enemy.attackUntil = now + 360;
              enemy.cooldownUntil = now + (enemy.type === "boss" ? 1500 : 1280);

              if (applyHit(runtime, enemy.damage, 28, now)) {
                callbacksRef.current.onSound("impact");
                k?.shake(enemy.type === "boss" ? 5 : 3);
              }
            }
          } else {
            const minX = enemy.originX - enemy.patrolRadius;
            const maxX = enemy.originX + enemy.patrolRadius;
            enemy.x += enemy.direction * enemy.speed * 0.3 * dt;

            if (enemy.x < minX || enemy.x > maxX) {
              enemy.direction = enemy.direction === 1 ? -1 : 1;
              enemy.x = clamp(enemy.x, minX, maxX);
            }
          }
        });

        runtime.particles = runtime.particles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx * dt,
            y: particle.y + particle.vy * dt,
            vy: particle.vy + 360 * dt,
            life: particle.life - dt,
          }))
          .filter((particle) => particle.life > 0);

        const livingEnemies = runtime.state.enemies.filter((enemy) => enemy.alive).length;
        runtime.state.progress = clamp((player.x - 120) / (LEVEL_WIDTH - 260), 0, 1);
        runtime.cameraX +=
          (clamp(player.x - VIEW_WIDTH * 0.32, 0, LEVEL_WIDTH - VIEW_WIDTH) - runtime.cameraX) *
          Math.min(1, dt * 5.5);
        runtime.state.cameraX = runtime.cameraX;
        runtime.state.elapsedMs += dt * 1000;

        if (player.hp <= 0) {
          runtime.state.gamePhase = "defeat";
          runtime.publish(true);
          return;
        }

        if (livingEnemies === 0 && player.x >= LEVEL_WIDTH - 220) {
          runtime.state.gamePhase = "victory";

          if (!runtime.victoryAwarded) {
            runtime.victoryAwarded = true;
            player.score += 250;
            runtime.burst(player.x, GROUND_Y - 120, "#ffd96d", 40);
            callbacksRef.current.onSound("special");
          }

          runtime.publish(true);
          return;
        }

        runtime.publish();
      });

      k.onDraw(() => {
        const ctx = k;

        if (!ctx) {
          return;
        }

        drawBackground(ctx, runtime);

        runtime.state.artifacts.forEach((artifact) => {
          if (!artifact.collected) {
            drawArtifact(ctx, artifact.x, GROUND_Y - 154, runtime.cameraX);
          }
        });

        runtime.state.obstacles.forEach((obstacle) => {
          drawObstacle(ctx, obstacle.x, runtime.cameraX, obstacle.id, obstacle.width);
        });

        runtime.state.enemies.forEach((enemy) => {
          if (enemy.alive) {
            drawEnemy(ctx, enemy, runtime.cameraX);
          }
        });

        drawHero(ctx, runtime.state, runtime, batyr);
        drawParticles(ctx, runtime);

        ctx.drawRect({
          pos: ctx.vec2(28, VIEW_HEIGHT - 58),
          width: 680,
          height: 38,
          radius: 20,
          color: ctx.rgb("#050b14"),
          opacity: 0.34,
        });
        ctx.drawText({
          text: "KABOOM ENGINE • A/D • ↑/W СЕКІРУ • ENTER СОҚҚЫ",
          pos: ctx.vec2(52, VIEW_HEIGHT - 48),
          size: 16,
          color: ctx.rgb("#d5c7a6"),
          opacity: 0.72,
        });
      });
    });

    return () => {
      disposed = true;
      runtimeRef.current = null;

      if (k) {
        k.quit();
      }

      root.innerHTML = "";
    };
  }, [batyr, resetKey]);

  return (
    <div className="relative mx-auto aspect-video w-full max-w-[1536px] overflow-hidden rounded-[28px] border border-white/12 bg-[#081320]/80 shadow-[0_32px_120px_rgba(0,0,0,0.4)]">
      <div ref={rootRef} className="absolute inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:[image-rendering:pixelated]" />
      <div className="pointer-events-none absolute right-5 top-5 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-foreground/70 backdrop-blur">
        Kaboom.js 1536×864
      </div>
    </div>
  );
}
