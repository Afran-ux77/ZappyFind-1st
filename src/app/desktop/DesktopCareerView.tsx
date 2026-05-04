import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Compass,
  Sparkles,
} from "lucide-react";
import {
  CAREER_TRAJECTORY,
  type TrajectoryStage,
} from "../components/DashboardPreviewScreen";
import { DT, desktopHubStagger } from "./desktop-tokens";

const EASE = [0.16, 1, 0.3, 1] as const;

const PAGE_HERO_GRADIENT =
  "linear-gradient(135deg, #FFE9D5 0%, #FFD4B5 38%, #F8B894 78%, #F19A6E 100%)";
const PAGE_HERO_PATTERN =
  "radial-gradient(circle at 1px 1px, rgba(124,58,10,0.10) 1px, transparent 0)";

const CAREER_FOCUS_AREAS = [
  {
    label: "Domain depth",
    detail: "Sharpen your case studies in fintech and B2B SaaS — recruiters short-list these first.",
  },
  {
    label: "Storytelling",
    detail: "Lead each example with the user, the stakes, and the measurable outcome.",
  },
  {
    label: "Strategic framing",
    detail: "Translate research into roadmap calls, not just shipped artifacts.",
  },
];

const CAREER_QUICK_ACTIONS = [
  {
    title: "Personalized growth plan",
    blurb: "A 6-week plan built from your interview signal and target roles.",
    cta: "Open plan",
  },
  {
    title: "Mentor matching",
    blurb: "Senior designers in our network who shipped what you're aiming for.",
    cta: "Find a mentor",
  },
  {
    title: "Reference roles",
    blurb: "Three Lead Designer roles whose JDs match your trajectory.",
    cta: "View roles",
  },
];

export function DesktopCareerView({
  firstName,
  onStartInterview,
}: {
  firstName: string;
  onStartInterview: () => void;
}) {
  const name = firstName || "there";

  return (
    <div className="p-6 lg:p-8" style={{ fontFamily: DT.sans }}>
      <motion.div
        variants={desktopHubStagger.container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-[1240px] flex-col gap-6"
      >
        {/* ── Editorial hero ─────────────────────────────────────────── */}
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
              right: -120,
              width: 460,
              height: 460,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(244,114,182,0.18) 0%, rgba(244,114,182,0) 70%)",
              filter: "blur(60px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: 40,
              right: 220,
              width: 360,
              height: 360,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(251,146,60,0.65) 0%, rgba(251,146,60,0) 70%)",
              filter: "blur(70px)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              bottom: -160,
              left: -80,
              width: 420,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,58,237,0.10) 0%, rgba(124,58,237,0) 70%)",
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
                <Compass className="h-3.5 w-3.5" color={DT.accent} strokeWidth={2.2} />
                Career trajectory
              </div>
              <h1
                className="mt-4 text-[34px] leading-[1.06] tracking-[-0.025em] lg:text-[40px]"
                style={{ fontFamily: DT.serif, color: DT.text }}
              >
                {name}, here's where your craft is going.
              </h1>
              <p
                className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed"
                style={{ color: "rgba(68,64,60,0.92)", letterSpacing: "-0.01em" }}
              >
                Three milestones tuned to your interview signal, target roles, and
                domain. Where you fit today, what's worth aiming for next, and the
                direction you're building toward.
              </p>
            </div>

            <div
              className="grid grid-cols-2 gap-3 rounded-[20px] p-4 lg:gap-4 lg:p-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.28) 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(255,255,255,0.55), 0 1px 1px rgba(124,45,18,0.05), 0 18px 40px rgba(124,45,18,0.18)",
                backdropFilter: "blur(28px) saturate(1.7)",
                WebkitBackdropFilter: "blur(28px) saturate(1.7)",
              }}
            >
              {[
                { label: "Role focus", value: "Product Design" },
                { label: "Today's fit", value: "Senior" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span
                    className="text-[10.5px] font-bold uppercase"
                    style={{ color: "rgba(120,72,34,0.65)", letterSpacing: "0.12em" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[18px] tracking-[-0.015em]"
                    style={{
                      fontFamily: DT.serif,
                      color: DT.text,
                      fontWeight: 500,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </motion.section>

        {/* ── Trajectory rail ───────────────────────────────────────── */}
        <motion.section variants={desktopHubStagger.item} className="relative">
          {/* Connecting timeline line, behind the cards */}
          <div
            aria-hidden
            className="pointer-events-none absolute hidden lg:block"
            style={{
              top: 92,
              left: 24,
              right: 24,
              height: 2,
              background:
                "linear-gradient(90deg, rgba(13,148,136,0.5) 0%, rgba(234,88,12,0.55) 50%, rgba(109,40,217,0.5) 100%)",
              borderRadius: 999,
              opacity: 0.45,
            }}
          />
          <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
            {CAREER_TRAJECTORY.map((stage, i) => (
              <TrajectoryCard key={stage.id} stage={stage} index={i} />
            ))}
          </div>
        </motion.section>

      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */

function TrajectoryCard({ stage, index }: { stage: TrajectoryStage; index: number }) {
  const Icon = stage.icon;
  return (
    <motion.article
      variants={desktopHubStagger.item}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="relative flex h-full flex-col overflow-hidden rounded-[20px] border bg-white"
      style={{
        borderColor: "rgba(28,25,23,0.07)",
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.04), 0 12px 32px rgba(28,25,23,0.05)",
      }}
    >
      {/* Top accent wash (soft gradient fade down) */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24"
        style={{
          background: `linear-gradient(180deg, ${stage.accentSoft} 0%, rgba(255,255,255,0) 78%)`,
        }}
      />

      <div className="flex flex-col gap-4 p-5 lg:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{
                background: stage.accentSoft,
                border: `1px solid ${stage.accentBorder}`,
                color: stage.accent,
              }}
            >
              <Icon className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div className="flex flex-col leading-none">
              <span
                className="text-[10.5px] font-bold uppercase"
                style={{ color: stage.accent, letterSpacing: "0.14em" }}
              >
                {stage.stage}
              </span>
              <span
                className="mt-1 text-[11.5px] font-medium"
                style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
              >
                {stage.timeframe}
              </span>
            </div>
          </div>
          <span
            className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase"
            style={{
              borderColor: "rgba(28,25,23,0.08)",
              color: DT.textSubtle,
              letterSpacing: "0.1em",
            }}
          >
            0{index + 1}
          </span>
        </div>

        <div>
          <h3
            className="text-[22px] tracking-[-0.02em] lg:text-[24px]"
            style={{ fontFamily: DT.serif, color: DT.text, fontWeight: 500 }}
          >
            {stage.role}
          </h3>
          <p
            className="mt-2 text-[13.5px] leading-relaxed"
            style={{ color: "rgba(68,64,60,0.9)", letterSpacing: "-0.01em" }}
          >
            {stage.headline}
          </p>
        </div>

        <BulletGroup
          title="What's working"
          tone="positive"
          items={stage.working}
          accent={stage.accent}
        />
        <BulletGroup
          title="Where to push"
          tone="improve"
          items={stage.improve}
          accent={stage.accent}
        />

        <div className="mt-1 flex flex-col gap-2">
          <span
            className="text-[10.5px] font-bold uppercase"
            style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
          >
            Skills to add
          </span>
          <div className="flex flex-wrap gap-1.5">
            {stage.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border px-2.5 py-1 text-[11.5px] font-medium"
                style={{
                  borderColor: stage.accentBorder,
                  background: stage.accentSoft,
                  color: stage.accent,
                  letterSpacing: "-0.01em",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function BulletGroup({
  title,
  items,
  tone,
  accent,
}: {
  title: string;
  items: string[];
  tone: "positive" | "improve";
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-[10.5px] font-bold uppercase"
        style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
      >
        {title}
      </span>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[13px] leading-snug"
            style={{ color: "rgba(68,64,60,0.92)", letterSpacing: "-0.01em" }}
          >
            <span
              aria-hidden
              className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                background: tone === "positive" ? accent : "transparent",
                border: tone === "improve" ? `1.5px solid ${accent}` : "none",
              }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FocusPanel({ onPractice }: { onPractice: () => void }) {
  return (
    <motion.div
      variants={desktopHubStagger.item}
      className="relative overflow-hidden rounded-[20px] border bg-white"
      style={{
        borderColor: "rgba(28,25,23,0.07)",
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.04), 0 12px 32px rgba(28,25,23,0.045)",
      }}
    >
      <div className="flex flex-col gap-5 p-6 lg:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className="text-[10.5px] font-bold uppercase"
              style={{ color: "rgba(120,72,34,0.7)", letterSpacing: "0.14em" }}
            >
              Sharpen now
            </span>
            <h3
              className="mt-2 text-[24px] tracking-[-0.02em]"
              style={{ fontFamily: DT.serif, color: DT.text, fontWeight: 500 }}
            >
              Where to focus this quarter
            </h3>
            <p
              className="mt-2 max-w-[55ch] text-[13.5px] leading-relaxed"
              style={{ color: "rgba(68,64,60,0.9)", letterSpacing: "-0.01em" }}
            >
              Three areas with the highest leverage on your move from Senior to
              Lead — drawn from your interview and recruiter signals.
            </p>
          </div>
          <Sparkles
            className="h-5 w-5 shrink-0"
            color={DT.accent}
            strokeWidth={2.2}
            aria-hidden
          />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {CAREER_FOCUS_AREAS.map((area, i) => (
            <div
              key={area.label}
              className="flex flex-col gap-2 rounded-[14px] border p-4"
              style={{
                borderColor: "rgba(28,25,23,0.07)",
                background: "rgba(255,252,247,0.85)",
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold"
                  style={{
                    background: "rgba(234,88,12,0.1)",
                    color: DT.accent,
                    border: "1px solid rgba(234,88,12,0.18)",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: DT.text, letterSpacing: "-0.01em" }}
                >
                  {area.label}
                </span>
              </div>
              <p
                className="text-[12.5px] leading-snug"
                style={{ color: "rgba(87,83,78,0.9)", letterSpacing: "-0.01em" }}
              >
                {area.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-[12.5px]" style={{ color: DT.textMuted }}>
            <Check className="h-4 w-4" color={DT.accent} strokeWidth={2.4} />
            Plan refreshes after each ZappyFind interview.
          </div>
          <button
            type="button"
            onClick={onPractice}
            className="inline-flex items-center gap-2 rounded-[10px] px-4 py-2 text-[13px] font-semibold text-white"
            style={{
              background: DT.accentGradient,
              boxShadow: "0 6px 18px rgba(234,88,12,0.28)",
              letterSpacing: "-0.01em",
            }}
          >
            Practice with ZappyFind
            <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionsPanel() {
  return (
    <motion.div
      variants={desktopHubStagger.item}
      className="flex flex-col gap-3 rounded-[20px] border p-5 lg:p-6"
      style={{
        borderColor: "rgba(28,25,23,0.07)",
        background: "linear-gradient(180deg, #FFFCF7 0%, #FAF6EE 100%)",
        boxShadow:
          "0 1px 2px rgba(28,25,23,0.04), 0 12px 32px rgba(28,25,23,0.045)",
      }}
    >
      <span
        className="text-[10.5px] font-bold uppercase"
        style={{ color: "rgba(120,72,34,0.7)", letterSpacing: "0.14em" }}
      >
        Take it further
      </span>
      <h3
        className="text-[20px] tracking-[-0.02em]"
        style={{ fontFamily: DT.serif, color: DT.text, fontWeight: 500 }}
      >
        Make this real
      </h3>
      <div className="mt-1 flex flex-col gap-2.5">
        {CAREER_QUICK_ACTIONS.map((action) => (
          <button
            key={action.title}
            type="button"
            className="group flex items-start justify-between gap-3 rounded-[14px] border bg-white px-4 py-3 text-left transition-shadow hover:shadow-sm"
            style={{ borderColor: "rgba(28,25,23,0.07)" }}
          >
            <div className="min-w-0">
              <div
                className="text-[13.5px] font-semibold"
                style={{ color: DT.text, letterSpacing: "-0.01em" }}
              >
                {action.title}
              </div>
              <div
                className="mt-1 text-[12.5px] leading-snug"
                style={{ color: "rgba(87,83,78,0.88)", letterSpacing: "-0.01em" }}
              >
                {action.blurb}
              </div>
            </div>
            <span
              className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold transition-transform group-hover:translate-x-0.5"
              style={{ color: DT.accent, letterSpacing: "-0.01em" }}
            >
              {action.cta}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
