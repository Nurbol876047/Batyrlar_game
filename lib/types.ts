export type Scene = "landing" | "select" | "profile" | "gameplay" | "result";

export interface FactEntry {
  id: string;
  title: string;
  description: string;
  rewardLabel: string;
}

export interface QuizReward {
  score: number;
  hp?: number;
  energy?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  reward: QuizReward;
}

export interface BatyrColors {
  accent: string;
  secondary: string;
  glow: string;
  sand: string;
  sky: string;
}

export interface BatyrProfileStats {
  attack: number;
  defense: number;
  speed: number;
  wisdom: number;
}

export interface BatyrGameplayStats {
  maxHp: number;
  speed: number;
  jumpPower: number;
  attackDamage: number;
  specialDamage: number;
  attackRange: number;
  specialCost: number;
  specialCooldown: number;
}

export interface Batyr {
  id: string;
  name: string;
  title: string;
  description: string;
  type: string;
  weapon: string;
  style: string;
  specialAbility: string;
  era: string;
  quote: string;
  biography: string;
  legacy: string;
  strengths: string[];
  colors: BatyrColors;
  stats: BatyrProfileStats;
  gameplay: BatyrGameplayStats;
  facts: FactEntry[];
  quiz: QuizQuestion[];
  finalReflection: string;
}

export interface LevelArtifact {
  id: string;
  title: string;
  x: number;
  points: number;
  factIndex: number;
  collected: boolean;
}

export interface LevelObstacle {
  id: string;
  x: number;
  width: number;
  height: number;
  damage: number;
  label: string;
}

export interface LevelEnemyTemplate {
  id: string;
  name: string;
  x: number;
  maxHp: number;
  damage: number;
  speed: number;
  bounty: number;
  patrolRadius: number;
  type: "scout" | "guard" | "boss";
}

export interface LevelEnemy extends LevelEnemyTemplate {
  originX: number;
  hp: number;
  alive: boolean;
  direction: 1 | -1;
  attackUntil: number;
  cooldownUntil: number;
  hitUntil: number;
}

export interface PlayerState {
  x: number;
  y: number;
  vy: number;
  direction: 1 | -1;
  hp: number;
  maxHp: number;
  energy: number;
  score: number;
  attackUntil: number;
  specialUntil: number;
  specialCooldownUntil: number;
  hitUntil: number;
  invulnerableUntil: number;
}

export interface LevelMetrics {
  collectedArtifacts: number;
  defeatedEnemies: number;
  correctAnswers: number;
  questionsAnswered: number;
  factsUnlocked: number;
  usedSpecial: boolean;
}

export interface LevelState {
  player: PlayerState;
  enemies: LevelEnemy[];
  artifacts: LevelArtifact[];
  obstacles: LevelObstacle[];
  cameraX: number;
  progress: number;
  flashSeed: number;
  stats: LevelMetrics;
  elapsedMs: number;
  gamePhase: "playing" | "victory" | "defeat";
}

export type OverlayEvent =
  | {
      type: "fact";
      payload: FactEntry;
      reward: number;
      artifactId: string;
    }
  | {
      type: "quiz";
      payload: QuizQuestion;
      sourceEnemyId: string;
    };

export interface QuizFeedback {
  correct: boolean;
  explanation: string;
  bonusText: string;
}

export interface RunResult {
  heroId: string;
  heroName: string;
  score: number;
  rank: "Жас Батыр" | "Ел Қорғаушы" | "Ұлы Батыр";
  collectedArtifacts: number;
  totalArtifacts: number;
  accuracy: number;
  achievements: string[];
  hpRemaining: number;
  factsUnlocked: number;
  bestScore: number;
  durationLabel: string;
  historicInsight: string;
}
