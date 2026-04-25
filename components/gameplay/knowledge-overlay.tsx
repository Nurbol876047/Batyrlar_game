"use client";

import { useMemo } from "react";
import { BookOpenText, CircleHelp, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OverlayEvent, QuizFeedback } from "@/lib/types";

interface KnowledgeOverlayProps {
  event: OverlayEvent | null;
  feedback: QuizFeedback | null;
  onCloseFact: () => void;
  onAnswer: (index: number) => void;
  onContinue: () => void;
}

function buildOptionOrder(questionId: string, optionCount: number, answerIndex: number) {
  const order = Array.from({ length: optionCount }, (_, index) => index);
  const hash = [...questionId].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const shift = hash % Math.max(optionCount, 1);
  const rotated = [...order.slice(shift), ...order.slice(0, shift)];

  if (rotated[0] === answerIndex && rotated.length > 1) {
    rotated.push(rotated.shift() ?? 0);
  }

  return rotated;
}

export function KnowledgeOverlay({
  event,
  feedback,
  onCloseFact,
  onAnswer,
  onContinue,
}: KnowledgeOverlayProps) {
  const open = Boolean(event);
  const quizOptionOrder = useMemo(() => {
    if (event?.type !== "quiz") {
      return [];
    }

    return buildOptionOrder(
      event.payload.id,
      event.payload.options.length,
      event.payload.answerIndex,
    );
  }, [event]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && event?.type === "fact") {
          onCloseFact();
        }
      }}
    >
      <DialogContent className="overflow-hidden">
        {event?.type === "fact" && (
          <>
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <DialogHeader className="space-y-4">
              <Badge>
                <BookOpenText className="mr-2 h-3.5 w-3.5" />
                Тарихи дерек
              </Badge>
              <DialogTitle>{event.payload.title}</DialogTitle>
              <DialogDescription>{event.payload.description}</DialogDescription>
            </DialogHeader>

            <div className="rounded-[28px] border border-primary/20 bg-primary/8 p-5 text-sm leading-7 text-foreground/78">
              Жинаған сыйлығыңыз: <span className="text-primary">{event.payload.rewardLabel}</span>
            </div>

            <div className="flex justify-end">
              <Button onClick={onCloseFact}>Жолды жалғастыру</Button>
            </div>
          </>
        )}

        {event?.type === "quiz" && (
          <>
            <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-accent/12 blur-3xl" />
            <DialogHeader className="space-y-4">
              <Badge variant="accent">
                <CircleHelp className="mr-2 h-3.5 w-3.5" />
                Мини-сұрақ
              </Badge>
              <DialogTitle>{event.payload.question}</DialogTitle>
              <DialogDescription>
                Дұрыс жауап батырға қосымша ұпай, энергия және HP береді.
              </DialogDescription>
            </DialogHeader>

            {!feedback ? (
              <div className="grid gap-3">
                {quizOptionOrder.map((optionIndex, displayIndex) => (
                  <button
                    key={event.payload.options[optionIndex]}
                    type="button"
                    className="flex h-auto w-full items-center justify-start rounded-[20px] border border-white/12 bg-black/65 px-5 py-4 text-left text-sm leading-7 text-foreground/88 transition-colors hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                    onClick={() => onAnswer(optionIndex)}
                  >
                    <span className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/14 bg-black text-xs text-foreground/78">
                      {displayIndex + 1}
                    </span>
                    {event.payload.options[optionIndex]}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                <div
                  className={`rounded-[28px] border p-5 text-sm leading-7 ${
                    feedback.correct
                      ? "border-accent/24 bg-accent/10 text-foreground/80"
                      : "border-destructive/24 bg-destructive/10 text-foreground/80"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2 font-semibold">
                    <Sparkles className="h-4 w-4" />
                    {feedback.correct ? "Дұрыс жауап!" : "Тағы да байқап көруге болады"}
                  </div>
                  <p>{feedback.explanation}</p>
                  <p className="mt-3 text-foreground/72">{feedback.bonusText}</p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={onContinue}>Жалғастыру</Button>
                </div>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
