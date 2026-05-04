import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { ChevronLeft, ChevronRight, FileText, Lightbulb, ListChecks, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { DT } from "../desktop/desktop-tokens";
import { InterviewQuestionRadar } from "./InterviewQuestionRadar";
import {
  INTERVIEW_QUESTION_ANALYSIS,
  aggregateCompetencyAxesForInterview,
  formatCompetencyScore,
  getPrimaryCompetencyForQuestion,
  type CompetencyAxis,
  type InterviewQuestionAnalysis,
} from "../interviewQuestionAnalysisCopy";

const EASE = [0.16, 1, 0.3, 1] as const;

function TranscriptBubbleList({ lines }: { lines: InterviewQuestionAnalysis["transcript"] }) {
  return (
    <div
      role="region"
      aria-label="Question transcript"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {lines.map((line, i) => {
        const isYou = line.role === "you";
        return (
          <div
            key={`${line.at}-${i}`}
            style={{
              display: "flex",
              justifyContent: isYou ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "min(100%, 52ch)",
                borderRadius: 14,
                border: `1px solid ${isYou ? "rgba(234,88,12,0.16)" : "rgba(234,88,12,0.22)"}`,
                background: isYou
                  ? "rgba(255,255,255,0.95)"
                  : "linear-gradient(160deg, rgba(255,252,247,0.98) 0%, rgba(255,243,230,0.92) 100%)",
                boxShadow: isYou ? "0 1px 2px rgba(234,88,12,0.04)" : "0 1px 3px rgba(234,88,12,0.06)",
                padding: "10px 12px",
              }}
            >
              {i === 0 && isYou ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <FileText size={14} strokeWidth={2.2} color={DT.accent} aria-hidden />
                  <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(120,72,34,0.72)" }}>
                    Your response
                  </div>
                </div>
              ) : null}
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "rgba(28,25,23,0.88)", letterSpacing: "-0.01em", fontStyle: "italic" }}>
                {line.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IdealAnswerBlock({ text }: { text: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(234,88,12,0.16)",
        background: "linear-gradient(180deg, rgba(255,252,247,0.92) 0%, rgba(255,245,238,0.78) 100%)",
        padding: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: 9,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(234,88,12,0.1)",
            border: "1px solid rgba(234,88,12,0.16)",
            flexShrink: 0,
          }}
          aria-hidden
        >
          <Sparkles size={14} color={DT.accent} strokeWidth={2.2} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(120,72,34,0.75)" }}>
            Ideal answer
          </div>
          <div style={{ marginTop: 1, fontSize: 12, fontWeight: 600, color: "rgba(68,64,60,0.86)", letterSpacing: "-0.01em" }}>
            A clean reference you can borrow structure from.
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(28,25,23,0.9)", letterSpacing: "-0.01em", fontStyle: "italic" }}>
        {text}
      </div>
    </div>
  );
}

type ScoreTier = "strong" | "solid" | "growing";

function classifyScore(score01: number): ScoreTier {
  if (score01 >= 0.78) return "strong";
  if (score01 >= 0.65) return "solid";
  return "growing";
}

const SCORE_TIER_PALETTE: Record<
  ScoreTier,
  { fg: string; bg: string; border: string; track: string; fill: string }
> = {
  strong: {
    fg: "#15803D",
    bg: "rgba(22,163,74,0.10)",
    border: "rgba(22,163,74,0.22)",
    track: "rgba(22,163,74,0.12)",
    fill: "linear-gradient(90deg, #22C55E 0%, #15803D 100%)",
  },
  solid: {
    fg: "#C2410C",
    bg: "rgba(234,88,12,0.10)",
    border: "rgba(234,88,12,0.22)",
    track: "rgba(234,88,12,0.12)",
    fill: "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
  },
  growing: {
    fg: "#B45309",
    bg: "rgba(217,119,6,0.10)",
    border: "rgba(217,119,6,0.22)",
    track: "rgba(217,119,6,0.14)",
    fill: "linear-gradient(90deg, #F59E0B 0%, #B45309 100%)",
  },
};

function QuestionCard({
  index,
  q,
  onOpen,
}: {
  index: number;
  q: InterviewQuestionAnalysis;
  onOpen: () => void;
}) {
  const competency = useMemo(() => getPrimaryCompetencyForQuestion(q), [q]);
  const score = competency?.you ?? 0;
  const tier = classifyScore(score);
  const palette = SCORE_TIER_PALETTE[tier];
  const pct = Math.max(0, Math.min(1, score)) * 100;

  return (
    <button
      type="button"
      onClick={onOpen}
      style={{
        width: "100%",
        textAlign: "left",
        borderRadius: 18,
        border: "1px solid rgba(28,25,23,0.06)",
        background: "#FFFFFF",
        padding: 16,
        cursor: "pointer",
        boxShadow: "0 1px 2px rgba(28,25,23,0.04), 0 6px 18px rgba(28,25,23,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      aria-label={`Open analysis for question ${index + 1}`}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 10 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(120,72,34,0.78)",
            background: "rgba(234,88,12,0.08)",
            border: "1px solid rgba(234,88,12,0.14)",
            padding: "4px 8px",
            borderRadius: 999,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: DT.accent,
            }}
          />
          Q{index + 1}
        </span>
      </div>

      <div
        style={{
          fontSize: 14.5,
          fontWeight: 700,
          color: "#1C1917",
          letterSpacing: "-0.02em",
          lineHeight: 1.32,
        }}
      >
        {q.prompt}
      </div>

      {competency ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "12px 12px",
            borderRadius: 12,
            background: "rgba(253,251,248,0.92)",
            border: "1px solid rgba(28,25,23,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: palette.fg,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(120,72,34,0.68)",
                }}
              >
                Competency evaluated
              </span>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: palette.fg,
                letterSpacing: "-0.02em",
              }}
            >
              {formatCompetencyScore(score)}
            </span>
          </div>

          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: "rgba(28,25,23,0.88)",
              letterSpacing: "-0.01em",
            }}
          >
            {competency.label}
          </div>

          <div
            aria-hidden
            style={{
              position: "relative",
              width: "100%",
              height: 6,
              borderRadius: 999,
              background: palette.track,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${pct}%`,
                borderRadius: 999,
                background: palette.fill,
              }}
            />
          </div>
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          paddingTop: 2,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: DT.accent,
            letterSpacing: "-0.01em",
          }}
        >
          <Sparkles size={13} strokeWidth={2.4} aria-hidden />
          See breakdown
        </span>
        <span
          aria-hidden
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 26,
            height: 26,
            borderRadius: 999,
            background: "rgba(234,88,12,0.1)",
            color: DT.accent,
          }}
        >
          <ChevronRight size={14} strokeWidth={2.6} />
        </span>
      </div>
    </button>
  );
}

function DetailSheet({
  q,
  index,
  onClose,
}: {
  q: InterviewQuestionAnalysis;
  index: number;
  onClose: () => void;
}) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const sheetY = useMotionValue(0);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const competency = useMemo(() => getPrimaryCompetencyForQuestion(q), [q]);
  const yourLines = useMemo(() => q.transcript.filter((l) => l.role === "you"), [q.transcript]);

  const sheet = (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(28,25,23,0.45)",
          zIndex: 60,
        }}
        aria-hidden
      />
      <motion.div
        key="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`Question ${index + 1} analysis`}
        onClick={(e) => e.stopPropagation()}
        ref={sheetRef}
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.35 }}
        onDragEnd={(_, info) => {
          const shouldClose = info.offset.y > 120 || info.velocity.y > 900;
          if (shouldClose) onClose();
        }}
        initial={{ y: 22, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 22, opacity: 0 }}
        transition={{ duration: 0.28, ease: EASE }}
        style={{
          y: sheetY,
          touchAction: "pan-y",
          position: "fixed",
          left: 0,
          right: 0,
          marginLeft: "auto",
          marginRight: "auto",
          bottom: 0,
          zIndex: 61,
          width: 390,
          maxWidth: "calc(100vw - 24px)",
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          background: "linear-gradient(180deg, rgba(253,251,248,0.98) 0%, rgba(255,255,255,0.98) 55%, rgba(253,251,248,0.98) 100%)",
          borderTop: "1px solid rgba(255,255,255,0.55)",
          boxShadow: "0 -18px 50px rgba(28,25,23,0.22)",
          padding: "10px 14px 18px",
          maxHeight: "min(86dvh, 860px)",
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "6px 0 10px" }}>
          <div
            aria-hidden
            style={{
              width: 42,
              height: 4,
              borderRadius: 999,
              background: "rgba(28,25,23,0.14)",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(120,72,34,0.72)" }}>
              Question {index + 1}
            </div>
            <div style={{ marginTop: 4, fontSize: 17, fontWeight: 750, letterSpacing: "-0.02em", color: "#1C1917", lineHeight: 1.28 }}>
              {q.prompt}
            </div>
          </div>
        </div>

        {competency ? <CompetencyScoreHero competency={competency} /> : null}

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {competency ? <QuickTakeawaysCard competency={competency} yourLines={yourLines} /> : null}
          <TranscriptBubbleList lines={yourLines} />
          <IdealAnswerBlock text={q.idealAnswer} />
        </div>
      </motion.div>
    </AnimatePresence>
  );

  // When rendered inside a preview frame (with transformed ancestors),
  // `position: fixed` may be relative to that frame instead of the viewport.
  // Portaling to `document.body` guarantees correct centering.
  if (typeof document !== "undefined") {
    return createPortal(sheet, document.body);
  }

  return sheet;
}

/**
 * Hero score card shown inside DetailSheet for the single competency the
 * question evaluates. Replaces the radar + Quick takeaways block.
 */
function CompetencyScoreHero({ competency }: { competency: CompetencyAxis }) {
  const tier = classifyScore(competency.you);
  const palette = SCORE_TIER_PALETTE[tier];
  const pct = Math.max(0, Math.min(1, competency.you)) * 100;
  return (
    <div
      style={{
        marginTop: 14,
        padding: "2px 2px 0",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span
            aria-hidden
            style={{
              width: 28,
              height: 28,
              borderRadius: 10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.9)",
              border: `1px solid ${palette.border}`,
              color: palette.fg,
              flexShrink: 0,
            }}
          >
            <Target size={14} strokeWidth={2.4} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 900,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(120,72,34,0.74)",
              }}
            >
              Competency evaluated
            </div>
            <div
              style={{
                marginTop: 2,
                fontSize: 16,
                fontWeight: 750,
                color: "#1C1917",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {competency.label}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "flex-end",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontFamily: DT.serif,
              fontWeight: 400,
              color: palette.fg,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {formatCompetencyScore(competency.you)}
          </span>
        </div>
      </div>

      <div
        aria-hidden
        style={{
          position: "relative",
          width: "100%",
          height: 6,
          borderRadius: 999,
          background: "rgba(28,25,23,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${pct}%`,
            borderRadius: 999,
            background: palette.fill,
          }}
        />
      </div>
    </div>
  );
}

function getCompetencyCoaching(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("structure")) return "Use a 3-part flow: context, decision, outcome.";
  if (l.includes("clarity")) return "Replace abstract wording with one concrete example.";
  if (l.includes("ownership")) return "Highlight your decision and why you made it.";
  if (l.includes("judgment")) return "State trade-offs explicitly, then defend your final call.";
  if (l.includes("metrics")) return "Anchor impact with one metric before and after.";
  if (l.includes("stakeholder")) return "Name who pushed back and how alignment was reached.";
  if (l.includes("scope")) return "Show what you cut, what stayed, and why.";
  if (l.includes("specificity")) return "Add one specific scenario, not a generic summary.";
  if (l.includes("risk")) return "Call out risk, mitigation, and rollback criteria.";
  return "Add one example, one decision rationale, and one measurable result.";
}

function QuickTakeawaysCard({
  competency,
  yourLines,
}: {
  competency: CompetencyAxis;
  yourLines: InterviewQuestionAnalysis["transcript"];
}) {
  const tier = classifyScore(competency.you);
  const score = competency.you;
  const words = yourLines
    .map((l) => l.text.trim())
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  const performanceSignal =
    tier === "strong"
      ? "This competency is a clear strength in this answer."
      : tier === "solid"
        ? "This competency is solid, but can be sharper."
        : "This competency needs stronger evidence in your answer.";

  const lengthSignal =
    words < 20
      ? "Your response is very short; add one concrete result."
      : words > 70
        ? "Your response may be too long; tighten to key points."
        : "Response length is in a workable range.";

  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid rgba(28,25,23,0.08)",
        background: "rgba(255,255,255,0.82)",
        padding: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ListChecks size={14} strokeWidth={2.4} color="rgba(120,72,34,0.8)" aria-hidden />
        <div
          style={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
            color: "rgba(120,72,34,0.78)",
          }}
        >
          Quick takeaways
        </div>
      </div>

      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span
            aria-hidden
            style={{
              width: 24,
              height: 24,
              borderRadius: 9,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.18)",
              flexShrink: 0,
            }}
          >
            <TrendingUp size={13} strokeWidth={2.4} color="rgba(67,56,202,0.95)" />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(28,25,23,0.88)", letterSpacing: "-0.01em" }}>
              Performance signal ({formatCompetencyScore(score)})
            </div>
            <div style={{ marginTop: 1, fontSize: 11, fontWeight: 600, color: "rgba(87,83,78,0.82)", letterSpacing: "-0.01em" }}>
              {performanceSignal}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span
            aria-hidden
            style={{
              width: 24,
              height: 24,
              borderRadius: 9,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(13,148,136,0.10)",
              border: "1px solid rgba(13,148,136,0.18)",
              flexShrink: 0,
            }}
          >
            <Lightbulb size={13} strokeWidth={2.4} color="rgba(15,118,110,0.95)" />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(28,25,23,0.88)", letterSpacing: "-0.01em" }}>
              Next answer upgrade
            </div>
            <div style={{ marginTop: 1, fontSize: 11, fontWeight: 600, color: "rgba(87,83,78,0.82)", letterSpacing: "-0.01em" }}>
              {getCompetencyCoaching(competency.label)}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <span
            aria-hidden
            style={{
              width: 24,
              height: 24,
              borderRadius: 9,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(234,88,12,0.10)",
              border: "1px solid rgba(234,88,12,0.18)",
              flexShrink: 0,
            }}
          >
            <Sparkles size={13} strokeWidth={2.4} color="rgba(194,65,12,0.95)" />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(28,25,23,0.88)", letterSpacing: "-0.01em" }}>
              Delivery note
            </div>
            <div style={{ marginTop: 1, fontSize: 11, fontWeight: 600, color: "rgba(87,83,78,0.82)", letterSpacing: "-0.01em" }}>
              {lengthSignal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InterviewQuestionAnalysisScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = useMemo(
    () => (activeId ? INTERVIEW_QUESTION_ANALYSIS.find((q) => q.id === activeId) ?? null : null),
    [activeId],
  );
  const activeIndex = useMemo(
    () => (active ? INTERVIEW_QUESTION_ANALYSIS.findIndex((q) => q.id === active.id) : -1),
    [active],
  );

  const sessionRadarAxes = useMemo(
    () => aggregateCompetencyAxesForInterview(INTERVIEW_QUESTION_ANALYSIS),
    [],
  );

  const summary = useMemo(() => {
    let bestLabel = "";
    let bestScore = Number.NEGATIVE_INFINITY;
    let focusLabel = "";
    let focusScore = Number.POSITIVE_INFINITY;
    for (const q of INTERVIEW_QUESTION_ANALYSIS) {
      const primary = getPrimaryCompetencyForQuestion(q);
      if (!primary) continue;
      if (primary.you > bestScore) {
        bestScore = primary.you;
        bestLabel = primary.label;
      }
      if (primary.you < focusScore) {
        focusScore = primary.you;
        focusLabel = primary.label;
      }
    }
    return { bestLabel, focusLabel };
  }, []);

  const pageStyle: CSSProperties = {
    minHeight: "100dvh",
    padding: "max(16px, env(safe-area-inset-top)) 16px calc(20px + env(safe-area-inset-bottom))",
    background: "#FDFBF8",
    backgroundImage:
      [
        "radial-gradient(ellipse 110% 78% at 50% -14%, rgba(255,203,150,0.74) 0%, rgba(255,226,196,0.40) 40%, rgba(253,251,248,0) 74%)",
        "radial-gradient(ellipse 70% 46% at 18% 0%, rgba(234,88,12,0.16) 0%, rgba(234,88,12,0.00) 68%)",
      ].join(", "),
    backgroundRepeat: "no-repeat",
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#1C1917",
  };

  return (
    <div style={pageStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            height: 36,
            padding: "0 10px 0 6px",
            borderRadius: 12,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "rgba(87,83,78,0.95)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
          aria-label="Back"
        >
          <ChevronLeft size={16} strokeWidth={2.6} aria-hidden />
          Back
        </button>

        <div
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(120,72,34,0.62)",
          }}
        >
          Interview analysis
        </div>
        <div style={{ width: 64 }} aria-hidden />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ marginTop: 12, position: "relative" }}
      >
        {/* Soft warm backdrop behind the hero */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            top: -16,
            height: 220,
            borderRadius: 28,
            background:
              "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255,210,170,0.55) 0%, rgba(255,240,228,0.22) 50%, rgba(253,251,248,0) 80%)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", padding: "6px 2px 4px" }}>
          {/* Section heading */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontSize: 26,
                fontFamily: DT.serif,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                color: "#1C1917",
              }}
            >
              Performance breakdown
            </div>
          </div>

          {/* Hero card — chart + highlights together */}
          <div
            style={{
              marginTop: 14,
              borderRadius: 22,
              border: "1px solid rgba(28,25,23,0.06)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(253,251,248,0.92) 100%)",
              boxShadow:
                "0 1px 2px rgba(28,25,23,0.04), 0 12px 30px rgba(28,25,23,0.06)",
              padding: "18px 16px 14px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle accent ring behind chart */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: -40,
                left: "50%",
                transform: "translateX(-50%)",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(234,88,12,0.06) 0%, rgba(234,88,12,0.02) 50%, rgba(234,88,12,0) 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <InterviewQuestionRadar
                axes={sessionRadarAxes}
                size={224}
                showAxisLabels
                ariaLabel="Your performance across evaluated competencies"
              />
            </div>

            {/* Inline subtle legend */}
            <div
              style={{
                position: "relative",
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: DT.accent,
                  boxShadow: "0 0 0 3px rgba(234,88,12,0.14)",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(87,83,78,0.86)",
                  letterSpacing: "0.02em",
                }}
              >
                Your performance across {sessionRadarAxes.length} competencies
              </span>
            </div>

            {/* Hairline divider */}
            <div
              aria-hidden
              style={{
                position: "relative",
                marginTop: 14,
                marginBottom: 12,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(28,25,23,0) 0%, rgba(28,25,23,0.08) 50%, rgba(28,25,23,0) 100%)",
              }}
            />

            {/* Highlights split row: Strongest | Focus area */}
            <div
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1fr 1px 1fr",
                alignItems: "center",
                gap: 12,
              }}
            >
              <HighlightStat
                tone="positive"
                icon={<TrendingUp size={14} strokeWidth={2.6} aria-hidden />}
                label="Strongest"
                value={summary.bestLabel}
              />
              <span
                aria-hidden
                style={{
                  alignSelf: "stretch",
                  background:
                    "linear-gradient(180deg, rgba(28,25,23,0) 0%, rgba(28,25,23,0.10) 50%, rgba(28,25,23,0) 100%)",
                }}
              />
              <HighlightStat
                tone="focus"
                icon={<TrendingDown size={14} strokeWidth={2.6} aria-hidden />}
                label="Focus area"
                value={summary.focusLabel}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ marginTop: 18 }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(120,72,34,0.62)",
          }}
        >
          The questions
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 10 }}>
        {INTERVIEW_QUESTION_ANALYSIS.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: 0.06 + i * 0.05, ease: EASE }}
          >
            <QuestionCard index={i} q={q} onOpen={() => setActiveId(q.id)} />
          </motion.div>
        ))}
      </div>

      {active ? (
        <DetailSheet q={active} index={activeIndex} onClose={() => setActiveId(null)} />
      ) : null}
    </div>
  );
}

function HighlightStat({
  tone,
  icon,
  label,
  value,
}: {
  tone: "positive" | "focus";
  icon: ReactNode;
  label: string;
  value: string;
}) {
  const palette =
    tone === "positive"
      ? {
          dot: "#16A34A",
          dotGlow: "rgba(22,163,74,0.16)",
          kicker: "rgba(21,128,61,0.78)",
        }
      : {
          dot: "#D97706",
          dotGlow: "rgba(217,119,6,0.18)",
          kicker: "rgba(146,64,14,0.78)",
        };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
      }}
    >
      <span
        aria-hidden
        style={{
          flex: "0 0 auto",
          width: 28,
          height: 28,
          borderRadius: 999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: palette.dot,
          background: palette.dotGlow,
        }}
      >
        {icon}
      </span>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: palette.kicker,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 14.5,
            fontWeight: 700,
            color: "#1C1917",
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={value}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function SummaryStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.78)",
        border: "1px solid rgba(255,255,255,0.85)",
        boxShadow: "0 1px 2px rgba(28,25,23,0.04)",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 9.5,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(120,72,34,0.7)",
        }}
      >
        <span style={{ color: DT.accent, display: "inline-flex" }}>{icon}</span>
        {label}
      </div>
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 800,
          color: "#1C1917",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

