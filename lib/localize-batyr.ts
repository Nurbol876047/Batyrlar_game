import type { Batyr } from "@/lib/types";
import type { Language } from "@/store/language-store";

export function localizeBatyr(batyr: Batyr, language: Language): Batyr {
  if (language === "kk") {
    return batyr;
  }

  const translation = batyr.translations.en;

  return {
    ...batyr,
    name: translation.name,
    title: translation.title,
    description: translation.description,
    type: translation.type,
    weapon: translation.weapon,
    style: translation.style,
    specialAbility: translation.specialAbility,
    era: translation.era,
    quote: translation.quote,
    biography: translation.biography,
    legacy: translation.legacy,
    strengths: translation.strengths,
    finalReflection: translation.finalReflection,
    facts: batyr.facts.map((fact, index) => ({
      ...fact,
      title: translation.facts[index]?.title ?? fact.title,
      description: translation.facts[index]?.description ?? fact.description,
      rewardLabel: translation.facts[index]?.rewardLabel ?? fact.rewardLabel,
    })),
    quiz: batyr.quiz.map((question, index) => ({
      ...question,
      question: translation.quiz[index]?.question ?? question.question,
      options: translation.quiz[index]?.options ?? question.options,
      explanation: translation.quiz[index]?.explanation ?? question.explanation,
    })),
  };
}

export function localizeBatyrs(batyrs: Batyr[], language: Language): Batyr[] {
  return batyrs.map((batyr) => localizeBatyr(batyr, language));
}
