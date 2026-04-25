"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, RotateCcw, ShieldAlert, Sparkles, Swords } from "lucide-react";

import { ControlPad } from "@/components/gameplay/control-pad";
import { GameHud } from "@/components/gameplay/game-hud";
import {
  KaboomGameStage,
  type KaboomInputState,
  type MoveAxis,
  type QuizResultSignal,
} from "@/components/gameplay/kaboom-game-stage";
import { KnowledgeOverlay } from "@/components/gameplay/knowledge-overlay";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildRunResult, createInitialLevelState } from "@/lib/game";
import type { Batyr, OverlayEvent, QuizFeedback } from "@/lib/types";
import { useAudioFeedback } from "@/hooks/use-audio-feedback";
import type { SoundKind } from "@/hooks/use-audio-feedback";
import { useGameStore } from "@/store/game-store";

interface GameplaySceneProps {
  batyr: Batyr;
}

type MoveIntent = "backward" | "forward";
type InputSource = "keyboard" | "pad";

const MOVE_AXIS: Record<MoveIntent, Exclude<MoveAxis, 0>> = {
  backward: -1,
  forward: 1,
};

const EMPTY_INPUT: KaboomInputState = {
  axis: 0,
  jump: 0,
  attack: 0,
  special: 0,
};

export function GameplayScene({ batyr }: GameplaySceneProps) {
  const inputStateRef = useRef({
    keyboard: { backward: false, forward: false },
    pad: { backward: false, forward: false },
    lastIntent: null as MoveIntent | null,
  });
  const didFinishRef = useRef(false);

  const previousBestScore = useGameStore((state) => state.bestScores[batyr.id] ?? 0);
  const finishBattle = useGameStore((state) => state.finishBattle);
  const returnToSelection = useGameStore((state) => state.returnToSelection);

  const { play } = useAudioFeedback();

  const [levelState, setLevelState] = useState(() => createInitialLevelState(batyr));
  const [input, setInput] = useState<KaboomInputState>(EMPTY_INPUT);
  const [resetKey, setResetKey] = useState(0);
  const [activeEvent, setActiveEvent] = useState<OverlayEvent | null>(null);
  const [queuedEvents, setQueuedEvents] = useState<OverlayEvent[]>([]);
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [heldDirection, setHeldDirection] = useState<MoveIntent | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResultSignal | null>(null);

  const paused = Boolean(activeEvent || feedback || levelState.gamePhase !== "playing");
  const enemiesLeft = levelState.enemies.filter((enemy) => enemy.alive).length;
  const specialReady =
    levelState.player.energy >= batyr.gameplay.specialCost &&
    levelState.player.specialCooldownUntil <= Date.now();

  const syncMovementState = useCallback(() => {
    const backwardPressed =
      inputStateRef.current.keyboard.backward || inputStateRef.current.pad.backward;
    const forwardPressed =
      inputStateRef.current.keyboard.forward || inputStateRef.current.pad.forward;

    const nextIntent =
      backwardPressed && forwardPressed
        ? inputStateRef.current.lastIntent
        : backwardPressed
          ? "backward"
          : forwardPressed
            ? "forward"
            : null;
    const axis = nextIntent ? MOVE_AXIS[nextIntent] : 0;

    setInput((current) => (current.axis === axis ? current : { ...current, axis }));
    setHeldDirection(nextIntent);
  }, []);

  const clearMovement = useCallback(() => {
    inputStateRef.current.keyboard.backward = false;
    inputStateRef.current.keyboard.forward = false;
    inputStateRef.current.pad.backward = false;
    inputStateRef.current.pad.forward = false;
    inputStateRef.current.lastIntent = null;
    setInput((current) => (current.axis === 0 ? current : { ...current, axis: 0 }));
    setHeldDirection(null);
  }, []);

  const setMovementInput = useCallback(
    (source: InputSource, intent: MoveIntent, pressed: boolean) => {
      if (pressed && paused) {
        return;
      }

      inputStateRef.current[source][intent] = pressed;

      if (pressed) {
        inputStateRef.current.lastIntent = intent;
      } else {
        const oppositeIntent: MoveIntent =
          intent === "backward" ? "forward" : "backward";
        const oppositePressed =
          inputStateRef.current.keyboard[oppositeIntent] ||
          inputStateRef.current.pad[oppositeIntent];

        if (oppositePressed) {
          inputStateRef.current.lastIntent = oppositeIntent;
        }
      }

      syncMovementState();
    },
    [paused, syncMovementState],
  );

  const handleMoveStart = useCallback(
    (intent: MoveIntent) => {
      setMovementInput("pad", intent, true);
    },
    [setMovementInput],
  );

  const handleMoveEnd = useCallback(
    (intent: MoveIntent) => {
      setMovementInput("pad", intent, false);
    },
    [setMovementInput],
  );

  const triggerAction = useCallback(
    (action: "jump" | "attack" | "special") => {
      if (paused) {
        return;
      }

      setInput((current) => ({
        ...current,
        [action]: current[action] + 1,
      }));
    },
    [paused],
  );

  const handleJump = useCallback(() => {
    triggerAction("jump");
  }, [triggerAction]);

  const handleAttack = useCallback(() => {
    triggerAction("attack");
  }, [triggerAction]);

  const handleSpecial = useCallback(() => {
    if (!specialReady) {
      return;
    }

    triggerAction("special");
  }, [specialReady, triggerAction]);

  const enqueueEvents = useCallback((events: OverlayEvent[]) => {
    if (!events.length) {
      return;
    }

    setQueuedEvents((current) => [...current, ...events]);
  }, []);

  const resetLevel = useCallback(() => {
    clearMovement();
    didFinishRef.current = false;
    setLevelState(createInitialLevelState(batyr));
    setInput(EMPTY_INPUT);
    setResetKey((current) => current + 1);
    setActiveEvent(null);
    setQueuedEvents([]);
    setFeedback(null);
    setQuizResult(null);
  }, [batyr, clearMovement]);

  useEffect(() => {
    resetLevel();
  }, [resetLevel]);

  useEffect(() => {
    if (!activeEvent && !feedback && queuedEvents.length > 0) {
      const [nextEvent, ...rest] = queuedEvents;
      setQueuedEvents(rest);
      setActiveEvent(nextEvent);
    }
  }, [activeEvent, feedback, queuedEvents]);

  useEffect(() => {
    if (paused) {
      clearMovement();
    }
  }, [clearMovement, paused]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (paused) {
        return;
      }

      if (event.code === "ArrowLeft" || event.code === "KeyA") {
        event.preventDefault();
        setMovementInput("keyboard", "backward", true);
      }

      if (event.code === "ArrowRight" || event.code === "KeyD") {
        event.preventDefault();
        setMovementInput("keyboard", "forward", true);
      }

      if (
        event.repeat &&
        (event.code === "ArrowUp" ||
          event.code === "KeyW" ||
          event.code === "Enter" ||
          event.code === "KeyK")
      ) {
        return;
      }

      if (event.code === "ArrowUp" || event.code === "KeyW") {
        event.preventDefault();
        handleJump();
      }

      if (event.code === "Enter") {
        event.preventDefault();
        handleAttack();
      }

      if (event.code === "KeyK") {
        event.preventDefault();
        handleSpecial();
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft" || event.code === "KeyA") {
        event.preventDefault();
        setMovementInput("keyboard", "backward", false);
      }

      if (event.code === "ArrowRight" || event.code === "KeyD") {
        event.preventDefault();
        setMovementInput("keyboard", "forward", false);
      }
    };

    const onBlur = () => {
      clearMovement();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [clearMovement, handleAttack, handleJump, handleSpecial, paused, setMovementInput]);

  useEffect(() => {
    if (levelState.gamePhase === "victory" && !didFinishRef.current) {
      didFinishRef.current = true;

      const timeout = window.setTimeout(() => {
        finishBattle(
          buildRunResult({
            batyr,
            state: levelState,
            previousBestScore,
          }),
        );
      }, 1300);

      return () => window.clearTimeout(timeout);
    }

    if (levelState.gamePhase !== "victory") {
      didFinishRef.current = false;
    }

    return undefined;
  }, [batyr, finishBattle, levelState, previousBestScore]);

  const handleStateChange = useCallback((state: typeof levelState) => {
    setLevelState(state);
  }, []);

  const handleSound = useCallback(
    (kind: SoundKind) => {
      play(kind);
    },
    [play],
  );

  const closeFact = useCallback(() => {
    setActiveEvent(null);
  }, []);

  const continueAfterQuiz = useCallback(() => {
    setFeedback(null);
    setActiveEvent(null);
  }, []);

  const handleQuizAnswer = useCallback(
    (index: number) => {
      if (!activeEvent || activeEvent.type !== "quiz") {
        return;
      }

      const correct = index === activeEvent.payload.answerIndex;
      setQuizResult({
        id: Date.now(),
        correct,
        reward: activeEvent.payload.reward,
      });
      setFeedback({
        correct,
        explanation: activeEvent.payload.explanation,
        bonusText: correct
          ? `+${activeEvent.payload.reward.score} ұпай, HP және энергия күшейді.`
          : "Келесі дерек пен шайқас арқылы ұпайды қайта жинауға болады.",
      });

      play(correct ? "correct" : "wrong");
    },
    [activeEvent, play],
  );

  return (
    <section className="mx-auto w-full max-w-[1536px] space-y-5 2xl:space-y-6">
      <GameHud
        batyr={batyr}
        hp={levelState.player.hp}
        maxHp={levelState.player.maxHp}
        energy={levelState.player.energy}
        progress={levelState.progress}
        score={levelState.player.score}
        artifacts={levelState.stats.collectedArtifacts}
        totalArtifacts={levelState.artifacts.length}
        enemiesLeft={enemiesLeft}
        specialReady={specialReady}
      />

      <div className="space-y-5">
        <div className="relative">
          <KaboomGameStage
            batyr={batyr}
            input={input}
            paused={paused}
            resetKey={resetKey}
            quizResult={quizResult}
            onStateChange={handleStateChange}
            onEvents={enqueueEvents}
            onSound={handleSound}
          />

          {levelState.gamePhase === "victory" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm"
            >
              <div className="rounded-[30px] border border-primary/20 bg-slate-950/65 px-8 py-6 text-center shadow-primary">
                <Badge>Жеңіс</Badge>
                <p className="mt-4 font-display text-5xl text-white">Шайқас аяқталды</p>
                <p className="mt-2 text-foreground/70">Нәтиже экраны дайындалуда...</p>
              </div>
            </motion.div>
          )}

          {levelState.gamePhase === "defeat" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm"
            >
              <div className="w-[min(92%,420px)] rounded-[30px] border border-destructive/25 bg-[#101a28]/90 p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/12 text-destructive">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <p className="mt-4 font-display text-4xl text-white">Күшті қайта жинаңыз</p>
                <p className="mt-3 text-sm leading-7 text-foreground/72">
                  Бұл сынақта рух әлсіреді. Қайта бастап, артефакттарды көбірек жинап, білім
                  сұрақтарына дәл жауап беріңіз.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button onClick={resetLevel}>
                    <RotateCcw className="h-4 w-4" />
                    Қайта бастау
                  </Button>
                  <Button variant="outline" onClick={returnToSelection}>
                    Батыр таңдау
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_520px]">
          <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              <Badge>Жорық тапсырмасы</Badge>
              <h3 className="font-display text-4xl text-white md:text-5xl">Cinematic шайқас</h3>
              <p className="text-base leading-8 text-foreground/72">
                Kaboom.js қозғалтқышы қозғалысты, секіруді, соққыны, бөлшектерді және камераны
                басқарады. 1536×864 стандартты 16:9 сахнада алға жылжыңыз, үш артефакт жинаңыз, барлық жауды
                жеңіңіз және мәреге жетіңіз.
              </p>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-base leading-8 text-foreground/72">
                <p className="flex items-center gap-2 text-primary">
                  <BookOpenText className="h-4 w-4" />
                  Scrolls дерек ашады
                </p>
                <p className="mt-2 flex items-center gap-2 text-accent">
                  <Sparkles className="h-4 w-4" />
                  Дұрыс жауап HP мен энергия береді
                </p>
                <p className="mt-2 flex items-center gap-2 text-primary">
                  <Swords className="h-4 w-4" />
                  Соққы, камера және бөлшектер Kaboom арқылы жүреді
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-[32px] border border-primary/16 bg-primary/8 p-6 text-base leading-8 text-foreground/78">
            <p className="font-semibold text-primary">Келесі мақсат:</p>
            <p className="mt-2">
              {enemiesLeft > 0
                ? `${enemiesLeft} жау қалды. Кең сахнада арақашықтықты сақтап, арнайы соққыны тиімді сәтте қолданыңыз.`
                : "Жол ашық. Мәреге жетіп, ерлік сапарын аяқтаңыз."}
            </p>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <ArrowRight className="h-5 w-5" />
              Прогресс: {Math.round(levelState.progress * 100)}%
            </div>
          </div>
          </div>

          <Card>
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-foreground/55">
                    On-screen controls
                  </p>
                  <h3 className="mt-2 font-display text-4xl text-white">Басқару</h3>
                </div>
                <Badge variant="secondary">Kaboom.js</Badge>
              </div>

              <ControlPad
                onMoveStart={handleMoveStart}
                onMoveEnd={handleMoveEnd}
                onJump={handleJump}
                onAttack={handleAttack}
                onSpecial={handleSpecial}
                specialReady={specialReady}
                energy={levelState.player.energy}
                specialCost={batyr.gameplay.specialCost}
                activeDirection={heldDirection}
              />

              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-foreground/70">
                <p className="font-semibold text-white">Клавиатура да қолдайды:</p>
                <p>A / D немесе стрелкалар, ↑ / W, Enter, K</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={returnToSelection}>
                  Батырды ауыстыру
                </Button>
                <Button variant="secondary" onClick={resetLevel}>
                  <RotateCcw className="h-4 w-4" />
                  Деңгейді қайта бастау
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <KnowledgeOverlay
        event={activeEvent}
        feedback={feedback}
        onCloseFact={closeFact}
        onAnswer={handleQuizAnswer}
        onContinue={continueAfterQuiz}
      />
    </section>
  );
}
