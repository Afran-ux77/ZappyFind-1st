import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, FileText, Mic, Pause, Play } from "lucide-react";
import { cn } from "./ui/utils";
import { DT } from "../desktop/desktop-tokens";

const EASE = [0.16, 1, 0.3, 1] as const;

export const INTERVIEW_DURATION_FULL = "14:22";

export const INTERVIEW_TRANSCRIPT_EXCHANGE: Array<{ role: "ai" | "you"; at: string; text: string }> = [
  {
    role: "ai",
    at: "00:00",
    text: "Hi — I'm ZappyFind. I'll ask about your recent work and how you think through product decisions. Ready when you are.",
  },
  {
    role: "you",
    at: "00:24",
    text: "Yes — happy to go through my latest project and how we shipped it.",
  },
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
  {
    role: "ai",
    at: "04:55",
    text: "Thank you — that gives us a clear picture. You'll get a recap here and we'll start curating roles that fit this profile.",
  },
];

/** Deterministic waveform silhouette — purely visual. */
export const INTERVIEW_WAVEFORM_BARS = [
  14, 20, 28, 36, 44, 38, 30, 22, 18, 26, 34, 42, 48, 40, 30, 22, 28, 36, 44, 52, 46, 38, 30, 24, 18, 26, 32, 38, 44, 38, 30, 24, 32, 40, 48, 40, 32, 26, 18, 14, 22, 30, 38, 30, 22, 16,
];

type InterviewTranscriptScrollProps = {
  className?: string;
};

export function InterviewTranscriptScroll({ className }: InterviewTranscriptScrollProps) {
  return (
    <div
      role="region"
      aria-label="Interview transcript"
      className={cn(
        "flex flex-col gap-3 overflow-y-auto rounded-[14px] border p-4 pr-3",
        className,
      )}
      style={{
        borderColor: "rgba(28,25,23,0.08)",
        background: DT.surfaceMuted,
        scrollbarGutter: "stable",
      }}
    >
      {INTERVIEW_TRANSCRIPT_EXCHANGE.map((line, i) => {
        const isYou = line.role === "you";
        return (
          <div key={`${line.at}-${i}`} className={cn("flex w-full", isYou ? "justify-end" : "justify-start")}>
            <div
              className="max-w-[min(100%,52ch)] rounded-[14px] border px-3.5 py-2.5"
              style={{
                borderColor: isYou ? "rgba(234,88,12,0.18)" : "rgba(234,88,12,0.22)",
                background: isYou
                  ? "rgba(255,255,255,0.95)"
                  : "linear-gradient(160deg, rgba(255,252,247,0.98) 0%, rgba(255,243,230,0.92) 100%)",
                boxShadow: isYou ? "0 1px 2px rgba(234,88,12,0.05)" : "0 1px 3px rgba(234,88,12,0.06)",
              }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{
                    color: isYou ? DT.accent : "#C2410C",
                    letterSpacing: "0.08em",
                  }}
                >
                  {isYou ? "You" : "ZappyFind"}
                </span>
                <span
                  className="font-mono text-[10px] font-semibold tabular-nums"
                  style={{ color: DT.textMuted, letterSpacing: "-0.02em" }}
                >
                  {line.at}
                </span>
              </div>
              <p className="text-[13px] leading-[1.5]" style={{ color: "rgba(28,25,23,0.88)", letterSpacing: "-0.01em" }}>
                {line.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Glass card styling aligned with `ProfileZappyCoach` on the job seeker profile. */
const INTERVIEW_RECORDING_GLASS: CSSProperties = {
  borderRadius: 18,
  background:
    "linear-gradient(155deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.14) 42%, rgba(255,245,238,0.18) 100%)",
  backdropFilter: "blur(26px) saturate(1.45)",
  WebkitBackdropFilter: "blur(26px) saturate(1.45)",
  border: "1px solid rgba(255,255,255,0.55)",
  boxShadow:
    "0 10px 40px rgba(234,88,12,0.09), 0 2px 14px rgba(234,88,12,0.05), inset 0 1px 0 rgba(255,255,255,0.72), inset 0 -1px 0 rgba(255,255,255,0.28)",
};

/** Compact play strip + optional full transcript — shared by dashboard and profile. */
export function InterviewRecordingCompactCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const playheadPct = isPlaying ? 100 : 0;

  return (
    <div className="relative flex flex-col overflow-hidden" style={{ ...INTERVIEW_RECORDING_GLASS, padding: "13px 15px 13px 16px" }}>
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0"
        style={{
          height: 2,
          borderRadius: 2,
          background: "linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.28) 45%, rgba(251,146,60,0.2) 70%, transparent 100%)",
          opacity: 0.85,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-40px]"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% -20%, rgba(234,88,12,0.14) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative z-[1] flex flex-wrap items-center gap-x-2 gap-y-1"
        style={{ marginBottom: 10 }}
      >
        <span className="flex shrink-0 leading-none" aria-hidden>
          <Mic size={13} color="#EA580C" strokeWidth={2.2} aria-hidden />
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span
            className="text-[11px] font-bold uppercase"
            style={{ color: "#5C5651", letterSpacing: "0.09em" }}
          >
            AI voice interview
          </span>
          <span className="text-[10px] font-medium" style={{ color: "#5C5651", letterSpacing: "-0.01em", opacity: 0.72 }}>
            · Full recording
          </span>
        </div>
        <span
          className="shrink-0 font-mono text-[10.5px] font-semibold tabular-nums"
          style={{ color: "#5C5651", letterSpacing: "-0.02em" }}
        >
          {INTERVIEW_DURATION_FULL}
        </span>
      </div>

      <div className="relative z-[1] flex flex-col gap-2.5">
        <div
          className="flex items-end gap-3 rounded-[12px] border px-2 py-2"
          style={{
            borderColor: "rgba(234,88,12,0.12)",
            background: "linear-gradient(135deg, rgba(255,249,244,0.75) 0%, rgba(255,255,255,0.92) 100%)",
          }}
        >
          <button
            type="button"
            aria-label={isPlaying ? "Pause recording" : "Play recording"}
            onClick={() => setIsPlaying((v) => !v)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform active:scale-[0.96]"
            style={{
              background: "rgba(234,88,12,0.1)",
              border: "1px solid rgba(234,88,12,0.2)",
              color: DT.accent,
              boxShadow: "0 1px 2px rgba(234,88,12,0.05)",
            }}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3" strokeWidth={2.4} fill={DT.accent} color={DT.accent} />
            ) : (
              <Play className="ml-px h-3 w-3" strokeWidth={2.4} fill={DT.accent} color={DT.accent} />
            )}
          </button>

          <div className="relative flex h-9 min-h-[36px] min-w-0 flex-1 items-end justify-between" aria-hidden>
            {INTERVIEW_WAVEFORM_BARS.map((h, i) => {
              const pct = (i / (INTERVIEW_WAVEFORM_BARS.length - 1)) * 100;
              const passed = pct <= playheadPct;
              const barH = Math.round(h * 0.72);
              return (
                <motion.span
                  key={i}
                  className="block shrink-0 rounded-full"
                  style={{
                    width: 2,
                    background: passed ? DT.accent : "rgba(28,25,23,0.14)",
                  }}
                  animate={{
                    height: isPlaying && passed ? [barH, Math.min(barH + 3, 40), barH] : barH,
                  }}
                  transition={
                    isPlaying && passed
                      ? {
                          duration: 0.9 + (i % 5) * 0.08,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: (i % 7) * 0.04,
                        }
                      : { duration: 0.2, ease: EASE }
                  }
                />
              );
            })}
          </div>

          <div
            className="shrink-0 pb-px text-[10px] font-semibold tabular-nums"
            style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
          >
            00:00<span style={{ color: DT.textSubtle }}> / {INTERVIEW_DURATION_FULL}</span>
          </div>
        </div>

        <button
          type="button"
          aria-expanded={showTranscript}
          onClick={() => setShowTranscript((v) => !v)}
          className="inline-flex w-fit min-h-[30px] min-w-[30px] touch-manipulation items-center gap-1 rounded-md px-2 text-[11px] font-semibold transition-opacity hover:opacity-90"
          style={{ color: DT.accent, letterSpacing: "-0.01em" }}
        >
          <FileText className="h-3 w-3" strokeWidth={2.2} />
          {showTranscript ? "Hide transcript" : "Full transcript"}
          <ChevronDown
            className="h-3 w-3 transition-transform"
            strokeWidth={2.3}
            style={{ transform: showTranscript ? "rotate(180deg)" : "none" }}
          />
        </button>

        <AnimatePresence initial={false}>
          {showTranscript && (
            <motion.div
              key="interview-transcript"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="flex flex-col gap-2 border-t pt-3"
              style={{ borderColor: "rgba(28,25,23,0.06)" }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ color: DT.textSubtle, letterSpacing: "0.1em" }}
                >
                  Transcript
                </span>
                <span className="text-[10px] font-medium" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
                  Private
                </span>
              </div>
              <InterviewTranscriptScroll className="max-h-[min(400px,58vh)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
