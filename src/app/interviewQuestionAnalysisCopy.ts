export type TranscriptRole = "ai" | "you";

export type TranscriptLine = {
  role: TranscriptRole;
  at: string;
  text: string;
};

export type CompetencyAxis = {
  label: string;
  /** Normalized 0..1 — relative performance shape, not a “score”. */
  you: number;
  /** Normalized 0..1 — ideal reference shape for this question. */
  ideal: number;
};

export type InterviewQuestionAnalysis = {
  id: string;
  prompt: string;
  competencies: CompetencyAxis[];
  transcript: TranscriptLine[];
  idealAnswer: string;
};

/**
 * Mock interview question analysis data (Case 1 demo).
 * Keep values normalized 0..1 so UI can compare shapes without “scores”.
 */
export const INTERVIEW_QUESTION_ANALYSIS: InterviewQuestionAnalysis[] = [
  {
    id: "q1-framing-success",
    prompt: "Walk me through the problem you were solving and how you framed success before you designed anything.",
    competencies: [
      { label: "Structure", you: 0.78, ideal: 0.86 },
      { label: "Clarity", you: 0.74, ideal: 0.86 },
      { label: "Metrics", you: 0.62, ideal: 0.82 },
      { label: "Context", you: 0.70, ideal: 0.84 },
      { label: "Conciseness", you: 0.66, ideal: 0.78 },
    ],
    transcript: [
      {
        role: "ai",
        at: "00:41",
        text: "Walk me through the problem you were solving and how you framed success before you designed anything.",
      },
      {
        role: "you",
        at: "01:08",
        text: "Onboarding was bleeding users after the first screen. Success was completion in under two minutes and fewer support tickets about verification.",
      },
    ],
    idealAnswer:
      "I started by defining the user job and the failure point: people weren’t finishing onboarding after step one. Success metrics were time-to-complete under two minutes, completion rate up, and fewer verification-related support tickets. Before designing, I mapped the drop-off steps, validated the biggest friction with support logs and quick user calls, then prioritized the smallest changes that could move completion without increasing fraud risk.",
  },
  {
    id: "q2-tradeoffs-stakeholders",
    prompt: "What trade-off did you make that was uncomfortable — and how did you communicate it to stakeholders?",
    competencies: [
      { label: "Ownership", you: 0.70, ideal: 0.84 },
      { label: "Trade-offs", you: 0.76, ideal: 0.88 },
      { label: "Stakeholder mgmt", you: 0.68, ideal: 0.84 },
      { label: "Risk framing", you: 0.64, ideal: 0.86 },
      { label: "Decision clarity", you: 0.72, ideal: 0.86 },
    ],
    transcript: [
      {
        role: "ai",
        at: "01:52",
        text: "What trade-off did you make that was uncomfortable — and how did you communicate it to stakeholders?",
      },
      {
        role: "you",
        at: "02:14",
        text: "We delayed identity verification. I wrote a one-pager with risk, mitigation, and what we'd watch in the first week. Engineering and legal both signed off.",
      },
    ],
    idealAnswer:
      "We chose to delay identity verification to reduce onboarding drop-off, even though it increased perceived fraud risk. I framed it as a reversible experiment: we’d ship a lighter step, add guardrails (rate limits + anomaly alerts), and monitor a clear set of leading indicators for one week. I shared a one-pager with the risk, mitigation, and rollback plan, then aligned engineering and legal on the thresholds that would trigger an immediate revert.",
  },
  {
    id: "q3-good-enough",
    prompt: "How do you know when a solution is “good enough” to ship versus when it needs another iteration?",
    competencies: [
      { label: "Judgment", you: 0.74, ideal: 0.86 },
      { label: "User-first", you: 0.68, ideal: 0.82 },
      { label: "Experimentation", you: 0.66, ideal: 0.84 },
      { label: "Clarity", you: 0.70, ideal: 0.84 },
      { label: "Scope control", you: 0.60, ideal: 0.82 },
    ],
    transcript: [
      {
        role: "ai",
        at: "03:01",
        text: "How do you know when a solution is \"good enough\" to ship versus when it needs another iteration?",
      },
      {
        role: "you",
        at: "03:28",
        text: "If the core user job is unblocked and metrics cover the riskiest assumptions, we ship. Otherwise I prefer a thin slice with real users over another mock cycle.",
      },
    ],
    idealAnswer:
      "I ship when the core user job is unblocked, the riskiest assumptions are measurable, and we have instrumentation to learn quickly. If we’re missing one of those, I narrow scope to the smallest thin-slice that can validate the unknowns with real users. “Good enough” means we can learn safely in production—clear success metrics, guardrails, and a plan for the next iteration based on what we observe.",
  },
  {
    id: "q4-role-next",
    prompt: "Last one — what kind of role are you hoping ZappyFind matches you with next?",
    competencies: [
      { label: "Clarity", you: 0.72, ideal: 0.84 },
      { label: "Specificity", you: 0.60, ideal: 0.82 },
      { label: "Alignment", you: 0.68, ideal: 0.86 },
      { label: "Confidence", you: 0.70, ideal: 0.82 },
      { label: "Conciseness", you: 0.66, ideal: 0.78 },
    ],
    transcript: [
      {
        role: "ai",
        at: "04:05",
        text: "Last one — what kind of role are you hoping ZappyFind matches you with next?",
      },
      {
        role: "you",
        at: "04:22",
        text: "Senior product design on a product-led team where I own flows end-to-end and partner closely with PM and eng.",
      },
    ],
    idealAnswer:
      "I’m looking for a senior product design role on a product-led team where I can own a core surface end-to-end—discovery through iteration—with tight PM/engineering partnership. I’m strongest in high-ambiguity problems, and I’m excited by teams that ship, measure outcomes, and iterate quickly based on user feedback.",
  },
];

export function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function normalizeCompetencies(axes: CompetencyAxis[]): CompetencyAxis[] {
  return axes.map((a) => ({ ...a, you: clamp01(a.you), ideal: clamp01(a.ideal) }));
}

