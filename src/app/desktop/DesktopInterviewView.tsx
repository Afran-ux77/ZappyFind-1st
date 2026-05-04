import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  ChevronDown,
  HelpCircle,
  Layers,
  Mic,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import {
  INTERVIEW_PREP_CHECKLIST,
  INTERVIEW_PREP_COMPETENCIES,
  INTERVIEW_PREP_QUESTIONS,
  type PrepQuestionPack,
} from "../components/DashboardPreviewScreen";
import { DT, desktopHubStagger } from "./desktop-tokens";

const EASE = [0.16, 1, 0.3, 1] as const;

const PAGE_HERO_GRADIENT =
  "linear-gradient(135deg, #FFF1DC 0%, #FFDDB6 38%, #FFC58A 78%, #F8A65C 100%)";
const PAGE_HERO_PATTERN =
  "radial-gradient(circle at 1px 1px, rgba(124,58,10,0.10) 1px, transparent 0)";

export function DesktopInterviewView({
  firstName,
  onPractice,
}: {
  firstName: string;
  onPractice: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [completed, setCompleted] = useState<Set<string>>(() => new Set());
  const [openPackId, setOpenPackId] = useState<PrepQuestionPack["id"] | null>(
    "behavioral",
  );

  const total = INTERVIEW_PREP_CHECKLIST.length;
  const done = completed.size;
  const pct = Math.round((done / total) * 100);
  const readiness = Math.min(100, 62 + Math.round((done / total) * 38));

  const toggle = (id: string) =>
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const name = firstName || "there";

  return (
    <div className="p-6 lg:p-8" style={{ fontFamily: DT.sans }}>
      <motion.div
        variants={desktopHubStagger.container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-[1240px] flex-col gap-6"
      >
        {/* ── Hero ────────────────────────────────────────────────── */}
        <motion.section
          variants={desktopHubStagger.item}
          className="relative overflow-hidden rounded-[24px]"
          style={{
            background: PAGE_HERO_GRADIENT,
            boxShadow:
              "0 2px 4px rgba(146,64,14,0.10), 0 24px 60px rgba(146,64,14,0.18), inset 0 1px 0 rgba(255,255,255,0.55)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: PAGE_HERO_PATTERN,
              backgroundSize: "18px 18px",
              opacity: 0.5,
            }}
          />
          {/* Vivid colored orbs sit behind the glass panels for refraction */}
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: -120,
              right: -100,
              width: 460,
              height: 460,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(56,189,248,0.14) 0%, rgba(56,189,248,0) 70%)",
              filter: "blur(70px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: 60,
              right: 180,
              width: 360,
              height: 360,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(251,146,60,0.7) 0%, rgba(251,146,60,0) 70%)",
              filter: "blur(70px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              bottom: -140,
              left: -80,
              width: 440,
              height: 440,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(217,70,239,0.10) 0%, rgba(217,70,239,0) 70%)",
              filter: "blur(75px)",
            }}
          />
          <div className="relative grid gap-6 p-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:p-10">
            <div className="min-w-0">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  color: "#7C2D12",
                  letterSpacing: "0.14em",
                  backdropFilter: "blur(18px) saturate(1.6)",
                  WebkitBackdropFilter: "blur(18px) saturate(1.6)",
                  boxShadow:
                    "inset 0 0 0 1px rgba(255,255,255,0.55), 0 1px 2px rgba(124,45,18,0.08)",
                }}
              >
                <Mic className="h-3.5 w-3.5" color={DT.accent} strokeWidth={2.2} />
                Interview prep
              </div>
              <h1
                className="mt-4 text-[34px] leading-[1.06] tracking-[-0.025em] lg:text-[40px]"
                style={{ fontFamily: DT.serif, color: DT.text }}
              >
                {name}, get ready for the real one.
              </h1>
              <p
                className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed"
                style={{ color: "rgba(68,64,60,0.92)", letterSpacing: "-0.01em" }}
              >
                A focused prep workspace: what to improve, what to practice, and
                what to ship before your next interview.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onPractice}
                  className="inline-flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-[14px] font-semibold text-white"
                  style={{
                    background: DT.accentGradient,
                    boxShadow:
                      "0 6px 18px rgba(234,88,12,0.32), 0 1px 2px rgba(234,88,12,0.16)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  <Mic className="h-4 w-4" strokeWidth={2.4} />
                  Practice with ZappyFind
                </button>
                <span
                  className="inline-flex items-center gap-1.5 text-[12.5px]"
                  style={{ color: "rgba(87,83,78,0.9)", letterSpacing: "-0.01em" }}
                >
                  <Sparkles className="h-3.5 w-3.5" color={DT.accent} strokeWidth={2.2} />
                  Tuned to your domain, role and interview signal.
                </span>
              </div>
            </div>

            <ReadinessHeroCard readiness={readiness} done={done} total={total} pct={pct} />
          </div>
        </motion.section>

        {/* ── Workspace grid ─────────────────────────────────────── */}
        <motion.section
          variants={desktopHubStagger.item}
          className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]"
        >
          <div className="flex flex-col gap-5">
            <CompetenciesCard />
            <ChecklistCard
              completed={completed}
              toggle={toggle}
              done={done}
              total={total}
              pct={pct}
              reduceMotion={!!reduceMotion}
            />
          </div>

          <PracticeQuestionsCard
            openPackId={openPackId}
            setOpenPackId={setOpenPackId}
            reduceMotion={!!reduceMotion}
          />
        </motion.section>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function ReadinessHeroCard({
  readiness,
  done,
  total,
  pct,
}: {
  readiness: number;
  done: number;
  total: number;
  pct: number;
}) {
  const size = 132;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - readiness / 100);

  return (
    <div
      className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 rounded-[20px] p-5 lg:p-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.28) 100%)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.55), 0 1px 1px rgba(124,45,18,0.05), 0 18px 40px rgba(124,45,18,0.18)",
        backdropFilter: "blur(28px) saturate(1.7)",
        WebkitBackdropFilter: "blur(28px) saturate(1.7)",
      }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <defs>
            <linearGradient id="ready-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(234,88,12,0.12)"
            strokeWidth={stroke}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#ready-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ transform: `rotate(-90deg)`, transformOrigin: "center" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ color: DT.text }}
        >
          <span
            className="text-[10.5px] font-bold uppercase"
            style={{ color: "rgba(120,72,34,0.65)", letterSpacing: "0.14em" }}
          >
            Readiness
          </span>
          <span
            className="text-[32px] leading-none tracking-[-0.02em]"
            style={{ fontFamily: DT.serif, fontWeight: 500 }}
          >
            {readiness}
            <span
              className="text-[14px]"
              style={{ color: DT.textMuted, marginLeft: 2 }}
            >
              %
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Stat label="Checklist" value={`${done}/${total}`} />
        <Stat label="Strengths" value="Storytelling" icon={Star} />
        <Stat label="Top focus" value="Concision" icon={Target} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number; color?: string }>;
}) {
  return (
    <div className="flex flex-col">
      <span
        className="text-[10px] font-bold uppercase"
        style={{ color: "rgba(120,72,34,0.6)", letterSpacing: "0.14em" }}
      >
        {label}
      </span>
      <span
        className="mt-0.5 inline-flex items-center gap-1.5 text-[15px] tracking-[-0.015em]"
        style={{ fontFamily: DT.serif, color: DT.text, fontWeight: 500 }}
      >
        {Icon ? (
          <Icon className="h-3.5 w-3.5" strokeWidth={2.2} color={DT.accent} />
        ) : null}
        {value}
      </span>
    </div>
  );
}

/* ── Competencies ────────────────────────────────────────────────── */

function CompetenciesCard() {
  return (
    <div
      className="flex flex-col gap-4 rounded-[18px] border bg-white p-5 lg:p-6"
      style={{
        borderColor: "rgba(28,25,23,0.07)",
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.04), 0 12px 32px rgba(28,25,23,0.045)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md"
          style={{
            background: "rgba(234,88,12,0.1)",
            border: "1px solid rgba(234,88,12,0.22)",
            color: DT.accent,
          }}
        >
          <Layers className="h-3.5 w-3.5" strokeWidth={2.4} />
        </span>
        <h3
          className="text-[18px] tracking-[-0.02em]"
          style={{ fontFamily: DT.serif, color: DT.text, fontWeight: 500 }}
        >
          Where to focus
        </h3>
      </div>

      <ul className="flex flex-col gap-3">
        {INTERVIEW_PREP_COMPETENCIES.map((c) => {
          const pct = (c.score / 5) * 100;
          const accent = c.isStrength ? "#0F766E" : "#C2410C";
          return (
            <li
              key={c.id}
              className="flex flex-col gap-2 rounded-[12px] border p-3"
              style={{
                borderColor: "rgba(28,25,23,0.06)",
                background: c.isStrength
                  ? "rgba(13,148,136,0.04)"
                  : "rgba(255,251,247,0.85)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[13.5px] font-semibold"
                    style={{ color: DT.text, letterSpacing: "-0.01em" }}
                  >
                    {c.name}
                  </span>
                  {c.isStrength ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                      style={{
                        background: "rgba(13,148,136,0.12)",
                        color: "#0F766E",
                        letterSpacing: "0.08em",
                      }}
                    >
                      Strength
                    </span>
                  ) : null}
                </div>
                <span
                  className="text-[11.5px] font-semibold tabular-nums"
                  style={{ color: accent, letterSpacing: "-0.01em" }}
                >
                  {c.score}/5
                </span>
              </div>
              <div
                className="relative h-1.5 overflow-hidden rounded-full"
                style={{ background: "rgba(28,25,23,0.06)" }}
              >
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: c.isStrength
                      ? "linear-gradient(90deg, #14B8A6 0%, #0F766E 100%)"
                      : "linear-gradient(90deg, #FB923C 0%, #EA580C 100%)",
                  }}
                />
              </div>
              <ul className="flex flex-col gap-1 pl-0.5">
                {c.hints.map((h) => (
                  <li
                    key={h}
                    className="text-[12.5px] leading-snug"
                    style={{ color: "rgba(87,83,78,0.92)", letterSpacing: "-0.01em" }}
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Checklist ───────────────────────────────────────────────────── */

function ChecklistCard({
  completed,
  toggle,
  done,
  total,
  pct,
  reduceMotion,
}: {
  completed: Set<string>;
  toggle: (id: string) => void;
  done: number;
  total: number;
  pct: number;
  reduceMotion: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-4 rounded-[18px] border bg-white p-5 lg:p-6"
      style={{
        borderColor: "rgba(28,25,23,0.07)",
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.04), 0 12px 32px rgba(28,25,23,0.045)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{
              background: "rgba(234,88,12,0.1)",
              border: "1px solid rgba(234,88,12,0.22)",
              color: DT.accent,
            }}
          >
            <CalendarClock className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
          <h3
            className="text-[18px] tracking-[-0.02em]"
            style={{ fontFamily: DT.serif, color: DT.text, fontWeight: 500 }}
          >
            Prep checklist
          </h3>
        </div>
        <span
          className="text-[12px] font-semibold tabular-nums"
          style={{ color: "rgba(87,83,78,0.86)", letterSpacing: "-0.01em" }}
        >
          {done}/{total} · {pct}%
        </span>
      </div>

      <div
        className="relative h-1.5 overflow-hidden rounded-full"
        style={{ background: "rgba(28,25,23,0.06)" }}
      >
        <motion.span
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(90deg, #FB923C 0%, #EA580C 100%)" }}
        />
      </div>

      <ul className="flex flex-col gap-1">
        {INTERVIEW_PREP_CHECKLIST.map((item) => {
          const isDone = completed.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={isDone}
                onClick={() => toggle(item.id)}
                className="grid w-full grid-cols-[20px_1fr] items-start gap-3 rounded-[10px] px-1.5 py-2.5 text-left transition-colors hover:bg-stone-50"
              >
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-[18px] w-[18px] items-center justify-center rounded-md transition-all"
                  style={{
                    background: isDone ? "#EA580C" : "#FFFFFF",
                    border: `1.5px solid ${isDone ? "#EA580C" : "rgba(28,25,23,0.18)"}`,
                    color: "#FFFFFF",
                    flexShrink: 0,
                  }}
                >
                  {isDone ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0">
                  <span
                    className="block text-[13.5px] font-semibold leading-snug"
                    style={{
                      color: isDone ? "rgba(87,83,78,0.7)" : DT.text,
                      textDecoration: isDone ? "line-through" : "none",
                      textDecorationColor: "rgba(87,83,78,0.4)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="mt-0.5 block text-[12.5px] leading-snug"
                    style={{ color: "rgba(87,83,78,0.86)", letterSpacing: "-0.01em" }}
                  >
                    {item.hint}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ── Practice questions ─────────────────────────────────────────── */

function PracticeQuestionsCard({
  openPackId,
  setOpenPackId,
  reduceMotion,
}: {
  openPackId: PrepQuestionPack["id"] | null;
  setOpenPackId: (id: PrepQuestionPack["id"] | null) => void;
  reduceMotion: boolean;
}) {
  const totalQuestions = INTERVIEW_PREP_QUESTIONS.reduce(
    (sum, p) => sum + p.questions.length,
    0,
  );

  return (
    <div
      className="flex flex-col gap-4 rounded-[18px] border bg-white p-5 lg:p-6"
      style={{
        borderColor: "rgba(28,25,23,0.07)",
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.04), 0 12px 32px rgba(28,25,23,0.045)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{
              background: "rgba(234,88,12,0.1)",
              border: "1px solid rgba(234,88,12,0.22)",
              color: DT.accent,
            }}
          >
            <HelpCircle className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
          <h3
            className="text-[18px] tracking-[-0.02em]"
            style={{ fontFamily: DT.serif, color: DT.text, fontWeight: 500 }}
          >
            Practice questions for you
          </h3>
        </div>
        <span
          className="text-[12px] font-semibold tabular-nums"
          style={{ color: "rgba(87,83,78,0.78)", letterSpacing: "-0.01em" }}
        >
          {totalQuestions} total
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {INTERVIEW_PREP_QUESTIONS.map((pack) => (
          <PracticePack
            key={pack.id}
            pack={pack}
            isOpen={openPackId === pack.id}
            onToggle={() => setOpenPackId(openPackId === pack.id ? null : pack.id)}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}

function PracticePack({
  pack,
  isOpen,
  onToggle,
  reduceMotion,
}: {
  pack: PrepQuestionPack;
  isOpen: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
}) {
  const Icon = pack.icon;
  return (
    <div
      className="overflow-hidden rounded-[14px] border"
      style={{
        borderColor: "rgba(28,25,23,0.07)",
        background: isOpen ? "rgba(255,252,247,0.85)" : "#FFFFFF",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{
              background: pack.iconSoft,
              border: `1px solid ${pack.iconBorder}`,
              color: pack.iconColor,
            }}
          >
            <Icon className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <div className="min-w-0">
            <div
              className="text-[14px] font-semibold"
              style={{ color: DT.text, letterSpacing: "-0.01em" }}
            >
              {pack.label}
            </div>
            <div
              className="mt-0.5 text-[12.5px] leading-snug"
              style={{ color: "rgba(87,83,78,0.85)", letterSpacing: "-0.01em" }}
            >
              {pack.blurb}
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="rounded-full border px-2 py-0.5 text-[11px] font-semibold"
            style={{
              borderColor: "rgba(28,25,23,0.08)",
              color: DT.textMuted,
              letterSpacing: "-0.01em",
            }}
          >
            {pack.questions.length}
          </span>
          <ChevronDown
            className="h-4 w-4 transition-transform"
            strokeWidth={2.2}
            style={{
              color: DT.textMuted,
              transform: isOpen ? "rotate(180deg)" : "none",
            }}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="pack-questions"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
            className="overflow-hidden"
          >
            <ul className="flex flex-col gap-2 px-4 pb-4">
              {pack.questions.map((q, i) => (
                <li
                  key={q}
                  className="flex items-start gap-3 rounded-[10px] border bg-white px-3 py-2.5"
                  style={{ borderColor: "rgba(28,25,23,0.06)" }}
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold"
                    style={{
                      background: pack.iconSoft,
                      color: pack.iconColor,
                      border: `1px solid ${pack.iconBorder}`,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="flex-1 text-[13px] leading-snug"
                    style={{ color: "rgba(40,36,33,0.92)", letterSpacing: "-0.01em" }}
                  >
                    {q}
                  </span>
                  <button
                    type="button"
                    className="inline-flex shrink-0 items-center gap-1 text-[11.5px] font-semibold"
                    style={{ color: pack.iconColor, letterSpacing: "-0.01em" }}
                    aria-label="Practice this question"
                  >
                    Practice
                    <ArrowUpRight className="h-3 w-3" strokeWidth={2.4} />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
