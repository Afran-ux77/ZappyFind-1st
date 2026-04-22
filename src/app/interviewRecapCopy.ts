/** Shared copy for Case 1 interview recap (desktop + mobile preview). */

export const INTERVIEW_RECAP_VERDICT = "A strong, well-rounded conversation.";
export const INTERVIEW_RECAP_SUMMARY =
  "Clear, example-led answers that read as a strong match for the roles you want.";

export type TraitLevel = "Exceptional" | "Strong" | "Solid" | "Notable";

export const ANALYSIS_TRAITS: Array<{
  label: string;
  level: TraitLevel;
  blurb: string;
  detail: string;
}> = [
  {
    label: "Communication",
    level: "Exceptional",
    blurb: "Clear, structured, easy to follow.",
    detail:
      "Answers landed in a steady context → example → takeaway pattern — the shape recruiters skim best. Minimal filler, confident handoffs between points.",
  },
  {
    label: "Domain depth",
    level: "Strong",
    blurb: "Trade-offs and impact felt lived-in.",
    detail:
      "Specific decisions, the reasoning behind them, and measurable results. That level of texture is rare in a first call and reads as senior.",
  },
  {
    label: "Role alignment",
    level: "Strong",
    blurb: "Signals match target roles closely.",
    detail:
      "Scope, tools, and how you describe success map cleanly onto the product-design roles you're targeting — recruiters won't have to translate.",
  },
  {
    label: "Confidence",
    level: "Solid",
    blurb: "Steady pacing, composed presence.",
    detail:
      "Consistent tone throughout, with minimal hesitation. A couple of moments where a beat of thought before answering would land even sharper.",
  },
];

export function traitAccent(level: TraitLevel): string {
  switch (level) {
    case "Exceptional":
      return "#059669";
    case "Strong":
      return "#EA580C";
    case "Solid":
      return "#D97706";
    case "Notable":
      return "#6366F1";
  }
}
