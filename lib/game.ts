import type {
  Batyr,
  LevelArtifact,
  LevelEnemy,
  LevelEnemyTemplate,
  LevelObstacle,
  LevelState,
  RunResult,
} from "@/lib/types";

export const LEVEL_WIDTH = 4600;
export const STAGE_HEIGHT = 864;
export const GROUND_OFFSET = 138;

export const SCENE_TITLES = {
  landing: "Бастау",
  select: "Таңдау",
  profile: "Тұлға",
  gameplay: "Шайқас",
  result: "Нәтиже",
} as const;

const ARTIFACT_TEMPLATES: Omit<LevelArtifact, "collected">[] = [
  {
    id: "artifact-steppe-scroll",
    title: "Дала шежіресі",
    x: 720,
    points: 120,
    factIndex: 0,
  },
  {
    id: "artifact-war-banner",
    title: "Жорық туы",
    x: 2140,
    points: 140,
    factIndex: 1,
  },
  {
    id: "artifact-tribal-seal",
    title: "Таңба мөрі",
    x: 3540,
    points: 180,
    factIndex: 2,
  },
];

const ENEMY_TEMPLATES: LevelEnemyTemplate[] = [
  {
    id: "enemy-scout",
    name: "Шеп бұзушы",
    x: 1260,
    maxHp: 42,
    damage: 12,
    speed: 92,
    bounty: 160,
    patrolRadius: 70,
    type: "scout",
  },
  {
    id: "enemy-guard",
    name: "Қамал сақшысы",
    x: 2640,
    maxHp: 58,
    damage: 16,
    speed: 80,
    bounty: 220,
    patrolRadius: 86,
    type: "guard",
  },
  {
    id: "enemy-raider",
    name: "Дала шапқыншысы",
    x: 3480,
    maxHp: 64,
    damage: 17,
    speed: 88,
    bounty: 250,
    patrolRadius: 96,
    type: "guard",
  },
  {
    id: "enemy-boss",
    name: "Шайқас батыры",
    x: 4200,
    maxHp: 92,
    damage: 20,
    speed: 76,
    bounty: 360,
    patrolRadius: 58,
    type: "boss",
  },
];

export const LEVEL_OBSTACLES: LevelObstacle[] = [
  {
    id: "obstacle-fire",
    x: 1510,
    width: 112,
    height: 52,
    damage: 10,
    label: "Отты кедергі",
  },
  {
    id: "obstacle-fire-small",
    x: 2380,
    width: 92,
    height: 46,
    damage: 9,
    label: "Шағын от",
  },
  {
    id: "obstacle-rock",
    x: 3160,
    width: 132,
    height: 64,
    damage: 14,
    label: "Тас үйіндісі",
  },
];

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const createLevelArtifacts = (): LevelArtifact[] =>
  ARTIFACT_TEMPLATES.map((artifact) => ({
    ...artifact,
    collected: false,
  }));

export const createLevelEnemies = (): LevelEnemy[] =>
  ENEMY_TEMPLATES.map((enemy) => ({
    ...enemy,
    originX: enemy.x,
    hp: enemy.maxHp,
    alive: true,
    direction: -1,
    attackUntil: 0,
    cooldownUntil: 0,
    hitUntil: 0,
  }));

export const createInitialLevelState = (batyr: Batyr): LevelState => ({
  player: {
    x: 180,
    y: 0,
    vy: 0,
    direction: 1,
    hp: batyr.gameplay.maxHp,
    maxHp: batyr.gameplay.maxHp,
    energy: 54,
    score: 0,
    attackUntil: 0,
    specialUntil: 0,
    specialCooldownUntil: 0,
    hitUntil: 0,
    invulnerableUntil: 0,
  },
  enemies: createLevelEnemies(),
  artifacts: createLevelArtifacts(),
  obstacles: LEVEL_OBSTACLES,
  cameraX: 0,
  progress: 0,
  flashSeed: 0,
  stats: {
    collectedArtifacts: 0,
    defeatedEnemies: 0,
    correctAnswers: 0,
    questionsAnswered: 0,
    factsUnlocked: 0,
    usedSpecial: false,
  },
  elapsedMs: 0,
  gamePhase: "playing",
});

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const determineRank = ({
  score,
  accuracy,
  collectedArtifacts,
  totalArtifacts,
  hpRatio,
}: {
  score: number;
  accuracy: number;
  collectedArtifacts: number;
  totalArtifacts: number;
  hpRatio: number;
}): RunResult["rank"] => {
  if (
    score >= 1150 &&
    accuracy >= 70 &&
    collectedArtifacts === totalArtifacts &&
    hpRatio >= 0.48
  ) {
    return "Ұлы Батыр";
  }

  if (score >= 760 && accuracy >= 40) {
    return "Ел Қорғаушы";
  }

  return "Жас Батыр";
};

export const computeAchievements = (batyr: Batyr, state: LevelState) => {
  const achievements: string[] = [];
  const totalArtifacts = state.artifacts.length;
  const accuracy =
    state.stats.questionsAnswered > 0
      ? Math.round((state.stats.correctAnswers / state.stats.questionsAnswered) * 100)
      : 0;

  if (state.stats.collectedArtifacts === totalArtifacts) {
    achievements.push("Шежіре сақтаушы");
  }

  if (accuracy === 100 && state.stats.questionsAnswered > 0) {
    achievements.push("Даланың зерегі");
  }

  if (state.player.hp >= state.player.maxHp * 0.55) {
    achievements.push("Қайсар жүрек");
  }

  if (state.stats.usedSpecial) {
    achievements.push(`${batyr.name} қуаты`);
  }

  if (state.stats.defeatedEnemies === state.enemies.length) {
    achievements.push("Жорық жеңімпазы");
  }

  return achievements;
};

export const buildRunResult = ({
  batyr,
  state,
  previousBestScore,
}: {
  batyr: Batyr;
  state: LevelState;
  previousBestScore: number;
}): RunResult => {
  const accuracy =
    state.stats.questionsAnswered > 0
      ? Math.round((state.stats.correctAnswers / state.stats.questionsAnswered) * 100)
      : 0;

  const rank = determineRank({
    score: state.player.score,
    accuracy,
    collectedArtifacts: state.stats.collectedArtifacts,
    totalArtifacts: state.artifacts.length,
    hpRatio: state.player.hp / state.player.maxHp,
  });

  return {
    heroId: batyr.id,
    heroName: batyr.name,
    score: state.player.score,
    rank,
    collectedArtifacts: state.stats.collectedArtifacts,
    totalArtifacts: state.artifacts.length,
    accuracy,
    achievements: computeAchievements(batyr, state),
    hpRemaining: state.player.hp,
    factsUnlocked: state.stats.factsUnlocked,
    bestScore: Math.max(previousBestScore, state.player.score),
    durationLabel: formatDuration(state.elapsedMs),
    historicInsight: batyr.finalReflection,
  };
};
