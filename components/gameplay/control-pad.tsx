"use client";

import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, Sparkles, Sword } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MoveIntent = "backward" | "forward";

interface ControlPadProps {
  onMoveStart: (intent: MoveIntent) => void;
  onMoveEnd: (intent: MoveIntent) => void;
  onJump: () => void;
  onAttack: () => void;
  onSpecial: () => void;
  specialReady: boolean;
  energy: number;
  specialCost: number;
  activeDirection: MoveIntent | null;
}

function isPrimaryControlPointer(event: ReactPointerEvent<HTMLButtonElement>) {
  return event.isPrimary && (event.pointerType !== "mouse" || event.button === 0);
}

function buildKeyboardActionHandler(action: () => void) {
  return (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    action();
  };
}

export function ControlPad({
  onMoveStart,
  onMoveEnd,
  onJump,
  onAttack,
  onSpecial,
  specialReady,
  energy,
  specialCost,
  activeDirection,
}: ControlPadProps) {
  const activePointerRef = useRef<number | null>(null);
  const lastActionAtRef = useRef(0);

  const buildDirectionalHandlers = (intent: MoveIntent) => {
    const start = (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!isPrimaryControlPointer(event) || activePointerRef.current !== null) {
        return;
      }

      event.preventDefault();
      activePointerRef.current = event.pointerId;
      event.currentTarget.setPointerCapture(event.pointerId);
      onMoveStart(intent);
    };

    const end = (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (activePointerRef.current !== event.pointerId) {
        return;
      }

      event.preventDefault();

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      activePointerRef.current = null;
      onMoveEnd(intent);
    };

    return {
      onPointerDown: start,
      onPointerUp: end,
      onPointerCancel: end,
      onLostPointerCapture: end,
      onContextMenu: (event: ReactMouseEvent<HTMLButtonElement>) => event.preventDefault(),
    };
  };

  const runActionOnce = (action: () => void) => {
    const now = performance.now();

    if (now - lastActionAtRef.current < 120) {
      return;
    }

    lastActionAtRef.current = now;
    action();
  };

  const buildActionHandlers = (action: () => void) => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!isPrimaryControlPointer(event)) {
        return;
      }

      event.preventDefault();
      runActionOnce(action);
    },
    onMouseDown: (event: ReactMouseEvent<HTMLButtonElement>) => {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();
      runActionOnce(action);
    },
    onTouchStart: (event: ReactTouchEvent<HTMLButtonElement>) => {
      event.preventDefault();
      runActionOnce(action);
    },
    onClick: () => {
      runActionOnce(action);
    },
    onKeyDown: buildKeyboardActionHandler(action),
  });

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "h-[72px] rounded-[26px] border border-white/10 bg-white/[0.06] text-base touch-none select-none",
            activeDirection === "backward" && "border-primary/35 bg-primary/12 text-primary shadow-primary",
          )}
          type="button"
          {...buildDirectionalHandlers("backward")}
        >
          <ArrowLeft className="h-6 w-6" />
          Артқа
        </button>

        <button
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "h-[72px] rounded-[26px] border border-white/10 bg-white/[0.06] text-base touch-none select-none",
            activeDirection === "forward" && "border-primary/35 bg-primary/12 text-primary shadow-primary",
          )}
          type="button"
          {...buildDirectionalHandlers("forward")}
        >
          Алға
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <button
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-[72px] rounded-[26px] text-base touch-none select-none",
          )}
          type="button"
          {...buildActionHandlers(onJump)}
        >
          <ArrowUp className="h-6 w-6" />
          Секіру
        </button>

        <button
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "h-[72px] rounded-[26px] text-base touch-none select-none",
          )}
          type="button"
          {...buildActionHandlers(onAttack)}
        >
          <Sword className="h-6 w-6" />
          Атака
        </button>

        <button
          className={cn(
            buttonVariants({ variant: specialReady ? "secondary" : "outline", size: "lg" }),
            "h-[72px] rounded-[26px] text-base touch-none select-none",
            specialReady && "border border-accent/30 bg-accent/12 text-accent shadow-accent",
          )}
          disabled={!specialReady}
          type="button"
          {...(specialReady ? buildActionHandlers(onSpecial) : {})}
        >
          <Sparkles className="h-6 w-6" />
          {specialReady ? "Суперудар" : `${Math.round(energy)}/${specialCost}`}
        </button>
      </div>
    </div>
  );
}
