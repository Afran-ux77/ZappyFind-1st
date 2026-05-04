import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronDown, FileText, Sparkles, ListChecks, Target, TrendingUp, TrendingDown } from "lucide-react";
import { DT } from "../desktop/desktop-tokens";
import { InterviewQuestionRadar } from "./InterviewQuestionRadar";
import { INTERVIEW_QUESTION_ANALYSIS, type InterviewQuestionAnalysis } from "../interviewQuestionAnalysisCopy";

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

function CompetencyMeter({ label, you, ideal }: { label: string; you: number; ideal: number }) {
  const youPct = Math.max(0, Math.min(1, you)) * 100;
  const idealPct = Math.max(0, Math.min(1, ideal)) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(28,25,23,0.78)",
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      <div
        aria-hidden
        style={{
          position: "relative",
          width: 92,
          height: 6,
          borderRadius: 999,
          background: "rgba(28,25,23,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${youPct}%`,
            borderRadius: 999,
            background: "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `calc(${idealPct}% - 1px)`,
            top: -3,
            width: 2,
            height: 12,
            borderRadius: 1,
            background: "rgba(28,25,23,0.55)",
          }}
        />
      </div>
    </div>
  );
}

function QuestionCard({
  index,
  q,
  onOpen,
}: {
  index: number;
  q: InterviewQuestionAnalysis;
  onOpen: () => void;
}) {
  const visible = q.competencies.slice(0, 3);
  const remaining = q.competencies.length - visible.length;
  const avgGap = useMemo(() => {
    const totals = q.competencies.reduce(
      (acc, c) => {
        acc.gap += Math.max(0, c.ideal - c.you);
        return acc;
      },
      { gap: 0 },
    );
    return totals.gap / q.competencies.length;
  }, [q.competencies]);

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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "10px 12px",
          borderRadius: 12,
          background: "rgba(253,251,248,0.9)",
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
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(120,72,34,0.6)",
            }}
          >
            Competencies evaluated
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }} aria-hidden>
            <span
              style={{
                width: 8,
                height: 3,
                borderRadius: 999,
                background: "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
              }}
            />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(87,83,78,0.8)" }}>You</span>
            <span
              style={{
                width: 2,
                height: 8,
                borderRadius: 1,
                background: "rgba(28,25,23,0.55)",
                marginLeft: 4,
              }}
            />
            <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(87,83,78,0.8)" }}>Ideal</span>
          </div>
        </div>

        {visible.map((c) => (
          <CompetencyMeter key={c.label} label={c.label} you={c.you} ideal={c.ideal} />
        ))}

        {remaining > 0 ? (
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(87,83,78,0.78)",
              letterSpacing: "-0.01em",
            }}
          >
            +{remaining} more competenc{remaining === 1 ? "y" : "ies"}
          </div>
        ) : null}
      </div>

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

  const axes = useMemo(() => q.competencies, [q.competencies]);
  const yourLines = useMemo(() => q.transcript.filter((l) => l.role === "you"), [q.transcript]);
  const competencyDeltas = useMemo(() => {
    return q.competencies.map((c) => ({
      ...c,
      gap: c.ideal - c.you,
    }));
  }, [q.competencies]);
  const strongest = useMemo(() => {
    if (competencyDeltas.length === 0) return null;
    return [...competencyDeltas].sort((a, b) => a.gap - b.gap)[0];
  }, [competencyDeltas]);
  const biggestGap = useMemo(() => {
    if (competencyDeltas.length === 0) return null;
    return [...competencyDeltas].sort((a, b) => b.gap - a.gap)[0];
  }, [competencyDeltas]);
  const improvables = useMemo(() => {
    const labels = competencyDeltas
      .filter((c) => c.gap > 0.01)
      .sort((a, b) => b.gap - a.gap)
      .map((c) => c.label);
    return biggestGap ? labels.filter((l) => l !== biggestGap.label) : labels;
  }, [competencyDeltas, biggestGap]);
  const topGaps = useMemo(() => {
    return [...competencyDeltas]
      .filter((c) => c.gap > 0.01)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 2);
  }, [competencyDeltas]);

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
            <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: "#1C1917", lineHeight: 1.25 }}>
              {q.prompt}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <InterviewQuestionRadar axes={axes} size={220} showAxisLabels />
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <LegendRow label="You" swatch="rgba(234,88,12,0.16)" stroke={DT.accent} />
              <LegendRow label="Ideal" swatch="rgba(28,25,23,0.04)" stroke="rgba(28,25,23,0.35)" />
            </div>

            <div
              style={{
                marginTop: 12,
                borderRadius: 16,
                border: "1px solid rgba(28,25,23,0.08)",
                background: "rgba(255,255,255,0.78)",
                padding: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ListChecks size={14} strokeWidth={2.4} color="rgba(120,72,34,0.8)" aria-hidden />
                    <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(120,72,34,0.78)" }}>
                      Quick takeaways
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                {strongest ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span
                        aria-hidden
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 10,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(99,102,241,0.12)", // indigo
                          border: "1px solid rgba(99,102,241,0.18)",
                          flexShrink: 0,
                        }}
                      >
                        <TrendingUp size={14} strokeWidth={2.4} color="rgba(67,56,202,0.95)" />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(28,25,23,0.88)", letterSpacing: "-0.01em" }}>
                          Strength: {strongest.label}
                        </div>
                        <div style={{ marginTop: 1, fontSize: 11, fontWeight: 600, color: "rgba(87,83,78,0.82)", letterSpacing: "-0.01em" }}>
                          Keep this pattern. It’s the most consistent part of your answer.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {biggestGap ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span
                        aria-hidden
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 10,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(13,148,136,0.10)", // teal
                          border: "1px solid rgba(13,148,136,0.18)",
                          flexShrink: 0,
                        }}
                      >
                        <Target size={14} strokeWidth={2.4} color="rgba(15,118,110,0.95)" />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(28,25,23,0.88)", letterSpacing: "-0.01em" }}>
                          Biggest gap: {biggestGap.label}
                        </div>
                        <div style={{ marginTop: 1, fontSize: 11, fontWeight: 600, color: "rgba(87,83,78,0.82)", letterSpacing: "-0.01em" }}>
                          Focus next: add one concrete example and a clear outcome.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {improvables.length > 0 ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <span
                        aria-hidden
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 10,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(234,88,12,0.10)",
                          border: "1px solid rgba(234,88,12,0.18)",
                          flexShrink: 0,
                        }}
                      >
                        <TrendingDown size={14} strokeWidth={2.4} color="rgba(194,65,12,0.95)" />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(28,25,23,0.88)", letterSpacing: "-0.01em" }}>
                          Needs improvement
                        </div>
                        <div style={{ marginTop: 1, fontSize: 11, fontWeight: 600, color: "rgba(87,83,78,0.82)", letterSpacing: "-0.01em" }}>
                          {improvables.join(" · ")}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
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

function LegendRow({ label, swatch, stroke }: { label: string; swatch: string; stroke: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        aria-hidden
        style={{
          width: 18,
          height: 10,
          borderRadius: 999,
          background: swatch,
          border: `2px solid ${stroke}`,
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 800, color: "rgba(68,64,60,0.9)", letterSpacing: "-0.01em" }}>
        {label}
      </span>
    </div>
  );
}

function formatPct(n: number): number {
  return Math.round(n * 100);
}

function formatDeltaPts(delta01: number): string {
  const pts = Math.round(Math.abs(delta01) * 100);
  return `${pts} pts`;
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

  const summary = useMemo(() => {
    let totalGap = 0;
    let count = 0;
    let bestLabel = "";
    let bestGap = Number.POSITIVE_INFINITY;
    let focusLabel = "";
    let focusGap = Number.NEGATIVE_INFINITY;
    for (const q of INTERVIEW_QUESTION_ANALYSIS) {
      for (const c of q.competencies) {
        const gap = c.ideal - c.you;
        totalGap += gap;
        count++;
        if (gap < bestGap) {
          bestGap = gap;
          bestLabel = c.label;
        }
        if (gap > focusGap) {
          focusGap = gap;
          focusLabel = c.label;
        }
      }
    }
    return {
      questionCount: INTERVIEW_QUESTION_ANALYSIS.length,
      avgGap: count > 0 ? totalGap / count : 0,
      bestLabel,
      focusLabel,
    };
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
        style={{ marginTop: 14, position: "relative" }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            top: -10,
            height: 160,
            borderRadius: 24,
            background:
              "radial-gradient(ellipse 72% 84% at 50% 0%, rgba(255,210,170,0.60) 0%, rgba(255,240,228,0.25) 52%, rgba(253,251,248,0) 78%)",
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", padding: "6px 2px 4px" }}>
        <div
          style={{
            marginTop: 10,
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
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(68,64,60,0.86)",
            letterSpacing: "-0.01em",
            lineHeight: 1.45,
            maxWidth: 340,
          }}
        >
          See how each response compares to the ideal and where you can improve.
        </div>

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          <SummaryStat
            icon={<Target size={13} strokeWidth={2.4} aria-hidden />}
            label="Strongest"
            value={summary.bestLabel}
          />
          <SummaryStat
            icon={<TrendingUp size={13} strokeWidth={2.4} aria-hidden />}
            label="Focus area"
            value={summary.focusLabel}
          />
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

