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

/**
 * Sharp, action-first focus areas shown when a user expands "Detailed analysis".
 * Each item: short hook + one-line tip. Keep copy tight — scannable cards, not paragraphs.
 */
export const IMPROVEMENT_FOCUS: Array<{
  id: string;
  area: string;
  /** ~3–6 word title — the move. */
  hook: string;
  /** One-line "do this" tip; keep it under ~80 chars. */
  tip: string;
}> = [
  {
    id: "pacing",
    area: "Pacing",
    hook: "Pause before the punchline",
    tip: "One beat of thought before key answers makes them land sharper.",
  },
  {
    id: "metrics",
    area: "Specifics",
    hook: "Lead with the number",
    tip: "Open the example with the metric, then the move that drove it.",
  },
  {
    id: "close",
    area: "Closing",
    hook: "End with a clean ask",
    tip: "Wrap each answer with a one-line takeaway, not a trailing thought.",
  },
];

/** Single-line framing for the focus block — keep concise. */
export const IMPROVEMENT_FOCUS_TITLE = "Sharpen these for real recruiter calls";
export const IMPROVEMENT_FOCUS_SUBTITLE =
  "Three small moves that lift how a live conversation lands.";
