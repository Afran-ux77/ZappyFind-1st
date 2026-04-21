import { motion } from "motion/react";
import {
  ArrowUpRight,
  Bookmark,
  Briefcase,
  Building2,
  Eye,
  MapPin,
  Mic,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import type { FullProfile } from "../components/WelcomeScreen";
import { JOB_DEPARTMENT_LABEL_BY_ID } from "../components/jobPrefDepartmentsData";
import { DT, desktopHubStagger } from "./desktop-tokens";

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_GRADIENT =
  "radial-gradient(ellipse at 18% 0%, #FFF6EE 0%, #FFEAD6 42%, #FFD9BC 90%)";
const WHY_MATCH_GRADIENT =
  "linear-gradient(160deg, rgba(234,88,12,0.09) 0%, rgba(255,255,255,0.92) 42%, rgba(255,248,242,0.85) 100%)";

function humanizePreferenceCategoryId(id: string): string {
  return id
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Label for hero copy — maps taxonomy ids to friendly names (fixes e.g. `product_management`). */
function heroRoleFocusLabel(profile: FullProfile | null | undefined): string {
  const raw = profile?.preferences?.categories?.[0]?.trim();
  if (!raw) return "Product design";
  return JOB_DEPARTMENT_LABEL_BY_ID[raw] ?? humanizePreferenceCategoryId(raw);
}

type MockJob = {
  id: string;
  title: string;
  company: string;
  logoLetter: string;
  logoBg: string;
  logoColor: string;
  matchScore: number;
  salary: string;
  location: string;
  locationType: string;
  postedAgo: string;
  whyMatch: string;
};

const ROW_JOBS: MockJob[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Zappyhire",
    logoLetter: "R",
    logoBg: "#E8F0FF",
    logoColor: "#2D6AFF",
    matchScore: 94,
    salary: "₹28L – ₹35L",
    location: "Bangalore",
    locationType: "Remote",
    postedAgo: "2d ago",
    whyMatch:
      "Your Figma expertise and 4+ years in product design align perfectly with their growing design systems team.",
  },
  {
    id: "2",
    title: "Product Designer II",
    company: "ZappyVue",
    logoLetter: "S",
    logoBg: "#FFF3E8",
    logoColor: "#FC8019",
    matchScore: 91,
    salary: "₹24L – ₹30L",
    location: "Bangalore",
    locationType: "Hybrid",
    postedAgo: "1d ago",
    whyMatch:
      "Strong consumer product experience and stakeholder management skills are a key differentiator here.",
  },
  {
    id: "3",
    title: "UX Design Lead",
    company: "ZappyCore",
    logoLetter: "P",
    logoBg: "#F3ECFF",
    logoColor: "#5F259F",
    matchScore: 88,
    salary: "₹32L – ₹40L",
    location: "Bangalore",
    locationType: "Hybrid",
    postedAgo: "3d ago",
    whyMatch:
      "Your leadership trajectory and fintech exposure set you apart for this founding design role.",
  },
  {
    id: "4",
    title: "Principal Product Designer",
    company: "ZappyByte",
    logoLetter: "B",
    logoBg: "#E7F9F1",
    logoColor: "#0F9D58",
    matchScore: 92,
    salary: "₹40L – ₹52L",
    location: "Bangalore",
    locationType: "Hybrid",
    postedAgo: "4h ago",
    whyMatch:
      "Founding-design vibe: your 0→1 portfolio + systems thinking is exactly what their platform team is hiring for.",
  },
  {
    id: "5",
    title: "Design Systems Engineer",
    company: "ZappySpot",
    logoLetter: "Z",
    logoBg: "#FFF1F4",
    logoColor: "#D6336C",
    matchScore: 86,
    salary: "₹22L – ₹28L",
    location: "Remote",
    locationType: "Remote",
    postedAgo: "5d ago",
    whyMatch:
      "Tokens, Figma libraries, a11y — your recent case studies map cleanly to this hybrid design + engineering role.",
  },
  {
    id: "6",
    title: "Senior UX Designer",
    company: "ZappyLift",
    logoLetter: "L",
    logoBg: "#FEF6DC",
    logoColor: "#C49206",
    matchScore: 89,
    salary: "₹26L – ₹32L",
    location: "Bangalore",
    locationType: "On-site",
    postedAgo: "1d ago",
    whyMatch:
      "Product-led research loop and cross-functional workshops line up with how you described your last two roles.",
  },
];

/** Fabricated 7-day recruiter view trend — sums to 14 (matches `recruiterViews`). */
const RECRUITER_WEEK = [2, 1, 3, 2, 4, 1, 1];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type RecruiterActivity = {
  id: string;
  company: string;
  initial: string;
  logoBg: string;
  logoColor: string;
  role: string;
  when: string;
  action: "viewed" | "shortlisted" | "message";
};

const RECENT_RECRUITERS: RecruiterActivity[] = [
  {
    id: "r1",
    company: "Zappyhire",
    initial: "R",
    logoBg: "#E8F0FF",
    logoColor: "#2D6AFF",
    role: "Head of Talent",
    when: "2h ago",
    action: "viewed",
  },
  {
    id: "r2",
    company: "ZappyByte",
    initial: "B",
    logoBg: "#E7F9F1",
    logoColor: "#0F9D58",
    role: "Design Recruiter",
    when: "Yesterday",
    action: "shortlisted",
  },
  {
    id: "r3",
    company: "ZappyVue",
    initial: "S",
    logoBg: "#FFF3E8",
    logoColor: "#FC8019",
    role: "Hiring Manager",
    when: "2d ago",
    action: "viewed",
  },
];

/** Saved preview = first 3 of ROW_JOBS (reuses same mock set). */
const SAVED_PREVIEW_IDS = ["4", "1", "2"];

type DesktopDashboardViewProps = {
  firstName: string;
  profile: FullProfile | null;
  hasCompletedInterview: boolean;
  onStartInterview: () => void;
  onReviewJobs: () => void;
  onViewSavedJobs: () => void;
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function DesktopDashboardView({
  firstName,
  profile,
  hasCompletedInterview,
  onStartInterview,
  onReviewJobs,
  onViewSavedJobs,
}: DesktopDashboardViewProps) {
  const name = firstName || "Alex";
  const roleLabel = heroRoleFocusLabel(profile);
  const totalJobs = 42;
  const activeCompanies = 18;
  const savedJobs = 8;
  const applied = 16;
  const recruiterViews = 14;

  const savedPreview = SAVED_PREVIEW_IDS
    .map((id) => ROW_JOBS.find((j) => j.id === id))
    .filter((j): j is MockJob => Boolean(j));

  return (
    <div className="p-6 lg:p-8" style={{ fontFamily: DT.sans }}>
      <motion.div
        variants={desktopHubStagger.container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-[1240px] flex-col gap-6"
      >
        {/* Row 1 — Hero (slim) */}
        <HeroStandingCard
          name={name}
          roleLabel={roleLabel}
          hasCompletedInterview={hasCompletedInterview}
          onStartInterview={onStartInterview}
        />

        {/* Row 2 — KPI strip, standalone */}
        <KpiStrip
          totalJobs={totalJobs}
          activeCompanies={activeCompanies}
          applied={applied}
          savedJobs={savedJobs}
        />

        {/* Row 3 — Top matches */}
        <motion.section variants={desktopHubStagger.item}>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3
                className="text-[22px] tracking-tight"
                style={{ fontFamily: DT.serif, color: DT.text, letterSpacing: "-0.02em" }}
              >
                Your top matches
              </h3>
              <p
                className="mt-1 text-[13px]"
                style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
              >
                Sorted by fit score · {roleLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={onReviewJobs}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors hover:underline"
              style={{ color: DT.accent }}
            >
              See all {totalJobs}
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ROW_JOBS.map((job, i) => (
              <JobMatchCard
                key={job.id}
                job={job}
                index={i}
                onOpen={onReviewJobs}
              />
            ))}
          </div>
        </motion.section>

        {/* Row 4 — Recruiter activity + Saved shortlist */}
        <motion.div variants={desktopHubStagger.item} className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <RecruiterActivityCard
            recruiterViews={recruiterViews}
            week={RECRUITER_WEEK}
            recent={RECENT_RECRUITERS}
          />
          <SavedShortlistCard
            savedJobs={savedJobs}
            preview={savedPreview}
            onViewAll={onViewSavedJobs}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Hero — slim greeting + standing + optional CTA
   ──────────────────────────────────────────────────────────────────────── */

function HeroStandingCard({
  name,
  roleLabel,
  hasCompletedInterview,
  onStartInterview,
}: {
  name: string;
  roleLabel: string;
  hasCompletedInterview: boolean;
  onStartInterview: () => void;
}) {
  return (
    <motion.div
      variants={desktopHubStagger.item}
      className="relative overflow-hidden rounded-[22px] border"
      style={{
        background: HERO_GRADIENT,
        borderColor: "rgba(255,200,160,0.38)",
        boxShadow:
          "0 4px 12px rgba(234,88,12,0.06), 0 16px 40px rgba(234,88,12,0.08)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -60,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234,88,12,0.16) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          bottom: -80,
          left: -40,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(146,64,14,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="relative flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:p-7">
        <div className="min-w-0 max-w-[62ch]">
          <p
            className="text-[11.5px] font-semibold uppercase"
            style={{ color: "rgba(28,25,23,0.48)", letterSpacing: "0.12em" }}
          >
            {getGreeting()}
          </p>
          <h1
            className="mt-1.5 text-[30px] leading-[1.08] lg:text-[36px]"
            style={{
              fontFamily: DT.serif,
              letterSpacing: "-0.03em",
              color: DT.text,
            }}
          >
            <span style={{ color: DT.text }}>Welcome back, </span>
            <span
              style={{
                backgroundImage: DT.accentGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {name}
            </span>
          </h1>
          <p
            className="mt-2 text-[14px] leading-snug lg:leading-relaxed"
            style={{ color: "rgba(28,25,23,0.68)", letterSpacing: "-0.01em" }}
          >
            {hasCompletedInterview ? (
              <>
                {"You're set up for "}
                <strong
                  style={{
                    color: "rgba(28,25,23,0.86)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {roleLabel}
                </strong>{" "}
                roles. Explore today's curated matches, bookmark roles you want to revisit, and apply while your
                profile is still top-of-mind for hiring teams.
              </>
            ) : (
              <>
                Finish a short voice profile so we can line up stronger{" "}
                <strong
                  style={{
                    color: "rgba(28,25,23,0.86)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {roleLabel}
                </strong>{" "}
                matches and show recruiters you're ready to talk—most candidates who complete it see better-fit
                suggestions within a day or two.
              </>
            )}
          </p>
        </div>

        {!hasCompletedInterview && (
          <button
            type="button"
            onClick={onStartInterview}
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-[12px] px-4 py-2.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-px"
            style={{
              background: DT.accentGradient,
              boxShadow:
                "0 6px 18px rgba(234,88,12,0.25), 0 1px 3px rgba(234,88,12,0.12)",
              letterSpacing: "-0.01em",
            }}
          >
            <Mic className="h-4 w-4" strokeWidth={2.2} />
            Start voice interview
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   KPI strip — each tile shows a *contextual* breakdown of its number:
     • Curated   → match-tier distribution
     • Companies → overlapping logo stack of who's hiring
     • Applied   → recruiter viewed vs. not yet viewed (sums to total applied)
     • Saved     → urgency buckets (closing soon / this month / open)
   ──────────────────────────────────────────────────────────────────────── */

type KpiSegment = { label: string; short: string; value: number; color: string };
type KpiLogoChip = { initial: string; bg: string; color: string };

type KpiViz =
  | { kind: "segments"; segments: KpiSegment[] }
  | { kind: "logos"; logos: KpiLogoChip[]; extra: number };

type KpiTile = {
  key: string;
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string; color?: string; strokeWidth?: number }>;
  accent: string;
  accentSoft: string;
  viz: KpiViz;
};

const KPI_ACCENT = {
  amber: "#D97706",
  orange: "#EA580C",
  indigo: "#6366F1",
  violet: "#7C3AED",
} as const;

function KpiStrip({
  totalJobs,
  activeCompanies,
  applied,
  savedJobs,
}: {
  totalJobs: number;
  activeCompanies: number;
  applied: number;
  savedJobs: number;
}) {
  // Company logo chips reused from ROW_JOBS so the stack reflects real brands in the feed.
  const companyLogos: KpiLogoChip[] = ROW_JOBS.slice(0, 5).map((j) => ({
    initial: j.logoLetter,
    bg: j.logoBg,
    color: j.logoColor,
  }));

  const recruiterViewedCount =
    applied === 0
      ? 0
      : applied === 1
        ? 1
        : Math.max(1, Math.min(applied - 1, Math.round(applied * (11 / 16))));
  const appliedNotViewedCount = applied - recruiterViewedCount;

  const tiles: KpiTile[] = [
    {
      key: "curated",
      label: "Curated roles",
      value: totalJobs,
      icon: Sparkles,
      accent: KPI_ACCENT.amber,
      accentSoft: "rgba(217,119,6,0.1)",
      viz: {
        kind: "segments",
        segments: [
          { label: "Top-match", short: "Top", value: 12, color: "#059669" },
          { label: "Strong", short: "Strong", value: 20, color: "#D97706" },
          { label: "Good", short: "Good", value: 10, color: "rgba(28,25,23,0.28)" },
        ],
      },
    },
    {
      key: "companies",
      label: "Active companies",
      value: activeCompanies,
      icon: Building2,
      accent: KPI_ACCENT.orange,
      accentSoft: "rgba(234,88,12,0.1)",
      viz: {
        kind: "logos",
        logos: companyLogos,
        extra: Math.max(0, activeCompanies - companyLogos.length),
      },
    },
    {
      key: "applied",
      label: "Applied",
      value: applied,
      icon: Briefcase,
      accent: KPI_ACCENT.indigo,
      accentSoft: "rgba(99,102,241,0.1)",
      viz: {
        kind: "segments",
        segments: [
          {
            label: "Viewed by recruiter",
            short: "Recruiter viewed",
            value: recruiterViewedCount,
            color: "#6366F1",
          },
          {
            label: "Applied",
            short: "Applied",
            value: appliedNotViewedCount,
            color: "rgba(99,102,241,0.22)",
          },
        ],
      },
    },
    {
      key: "saved",
      label: "Saved roles",
      value: savedJobs,
      icon: Bookmark,
      accent: KPI_ACCENT.violet,
      accentSoft: "rgba(124,58,237,0.1)",
      viz: {
        kind: "segments",
        segments: [
          { label: "Closing <3d", short: "<3d", value: 2, color: "#EA580C" },
          { label: "This month", short: "This month", value: 4, color: "#D97706" },
          { label: "Open", short: "Open", value: 2, color: "rgba(124,58,237,0.35)" },
        ],
      },
    },
  ];

  return (
    <motion.div
      variants={desktopHubStagger.item}
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {tiles.map((t, i) => (
        <KpiCard key={t.key} tile={t} index={i} />
      ))}
    </motion.div>
  );
}

function KpiCard({ tile, index }: { tile: KpiTile; index: number }) {
  const { label, value, icon: Icon, accent, accentSoft, viz } = tile;

  return (
    <div
      className="flex flex-col rounded-[18px] border p-5"
      style={{
        borderColor: DT.border,
        background: DT.surface,
        boxShadow: DT.shadow,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-[12px]"
          style={{ background: accentSoft }}
        >
          <Icon className="h-[18px] w-[18px]" color={accent} strokeWidth={2} />
        </div>
        <span
          className="text-[11px] font-semibold uppercase"
          style={{ color: DT.textSubtle, letterSpacing: "0.1em" }}
        >
          {label}
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span
          className="tabular-nums"
          style={{
            fontFamily: DT.serif,
            fontSize: 44,
            lineHeight: 1,
            letterSpacing: "-0.035em",
            color: DT.text,
          }}
        >
          {value}
        </span>
      </div>

      {/* Contextual mini-viz */}
      <div className="mt-4 flex flex-col gap-2">
        {viz.kind === "segments" ? (
          <>
            <SegmentedBar segments={viz.segments} delay={0.15 + index * 0.05} />
            <SegmentLegend segments={viz.segments} />
          </>
        ) : (
          <LogoStack logos={viz.logos} extra={viz.extra} delay={0.15 + index * 0.05} />
        )}
      </div>
    </div>
  );
}

/* Stacked proportional bar + small dotted legend. */
function SegmentedBar({
  segments,
  delay = 0,
}: {
  segments: KpiSegment[];
  delay?: number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div
      className="relative flex h-[7px] w-full overflow-hidden rounded-full"
      style={{ background: "rgba(28,25,23,0.05)" }}
      role="img"
      aria-label={segments.map((s) => `${s.value} ${s.label}`).join(", ")}
    >
      {segments.map((seg, i) => (
        <motion.span
          key={seg.label}
          initial={{ width: 0 }}
          animate={{ width: `${(seg.value / total) * 100}%` }}
          transition={{ duration: 0.55, delay: delay + i * 0.06, ease: EASE }}
          className="h-full"
          style={{
            background: seg.color,
            // subtle gap between segments
            boxShadow:
              i < segments.length - 1 ? "inset -1px 0 0 rgba(255,255,255,0.85)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function SegmentLegend({ segments }: { segments: KpiSegment[] }) {
  return (
    <div className="flex flex-wrap gap-x-2.5 gap-y-1">
      {segments.map((seg) => (
        <span
          key={seg.label}
          className="inline-flex items-center gap-1 text-[11.5px] tabular-nums"
          style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
        >
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: seg.color }}
          />
          <span style={{ color: DT.text, fontWeight: 600 }}>{seg.value}</span>
          {seg.short}
        </span>
      ))}
    </div>
  );
}

/* Overlapping company-logo stack for "Active companies". */
function LogoStack({
  logos,
  extra,
  delay = 0,
}: {
  logos: KpiLogoChip[];
  extra: number;
  delay?: number;
}) {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {logos.map((l, i) => (
          <motion.span
            key={`${l.initial}-${i}`}
            initial={{ opacity: 0, scale: 0.8, x: -4 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + i * 0.05, ease: EASE }}
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold"
            style={{
              background: l.bg,
              color: l.color,
              boxShadow: "0 0 0 2px #FFFFFF",
              zIndex: logos.length - i,
            }}
          >
            {l.initial}
          </motion.span>
        ))}
        {extra > 0 ? (
          <motion.span
            initial={{ opacity: 0, scale: 0.8, x: -4 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + logos.length * 0.05, ease: EASE }}
            className="relative flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold tabular-nums"
            style={{
              background: "rgba(28,25,23,0.06)",
              color: DT.textMuted,
              boxShadow: "0 0 0 2px #FFFFFF",
            }}
          >
            +{extra}
          </motion.span>
        ) : null}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Recruiter activity — 7-day chart + recent recruiters list
   ──────────────────────────────────────────────────────────────────────── */

function RecruiterActivityCard({
  recruiterViews,
  week,
  recent,
}: {
  recruiterViews: number;
  week: number[];
  recent: RecruiterActivity[];
}) {
  const max = Math.max(...week);
  const today = week[week.length - 1];
  const previousTotal = week.slice(0, -1).reduce((a, b) => a + b, 0);
  const prevAvg = previousTotal / Math.max(1, week.length - 1);
  const deltaPct = prevAvg > 0 ? Math.round(((today - prevAvg) / prevAvg) * 100) : 0;
  const trendingUp = deltaPct >= 0;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-[22px] border"
      style={{
        borderColor: DT.border,
        background: DT.surface,
        boxShadow: DT.shadow,
      }}
    >
      {/* Top — headline + chart */}
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8 lg:p-7">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[10px]"
              style={{ background: "rgba(124,58,237,0.1)" }}
            >
              <Users className="h-4 w-4" color="#7C3AED" strokeWidth={2} />
            </div>
            <span
              className="text-[11px] font-bold uppercase"
              style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
            >
              Recruiter interest
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span
              className="tabular-nums"
              style={{
                fontFamily: DT.serif,
                fontSize: 52,
                lineHeight: 1,
                letterSpacing: "-0.035em",
                color: DT.text,
              }}
            >
              {recruiterViews}
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
            >
              views · 7 days
            </span>
          </div>
          <div
            className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{
              background: trendingUp ? "rgba(5,150,105,0.08)" : "rgba(234,88,12,0.08)",
              color: trendingUp ? "#059669" : DT.accent,
              letterSpacing: "-0.01em",
            }}
          >
            <TrendingUp
              className={`h-3 w-3 ${trendingUp ? "" : "rotate-180"}`}
              strokeWidth={2.2}
            />
            {trendingUp ? "+" : ""}
            {deltaPct}% vs avg day
          </div>
          <p
            className="mt-4 max-w-[34ch] text-[12.5px]"
            style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
          >
            Zappy ranks you in the top slice for 3 recruiter searches this week.
          </p>
        </div>

        {/* Bar chart */}
        <div className="flex flex-col justify-end">
          <div className="flex items-end gap-2.5">
            {week.map((v, i) => {
              const heightPct = (v / max) * 100;
              const isToday = i === week.length - 1;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="relative flex w-full items-end overflow-hidden rounded-[6px]"
                    style={{ height: 96, background: "rgba(28,25,23,0.05)" }}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(10, heightPct)}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.2 + i * 0.05,
                        ease: EASE,
                      }}
                      className="w-full rounded-[6px]"
                      style={{
                        background: isToday
                          ? "linear-gradient(180deg, #7C3AED 0%, #6D28D9 100%)"
                          : "linear-gradient(180deg, rgba(124,58,237,0.55) 0%, rgba(124,58,237,0.28) 100%)",
                        boxShadow: isToday
                          ? "0 4px 14px rgba(124,58,237,0.28)"
                          : "none",
                      }}
                    />
                    {isToday && (
                      <span
                        aria-hidden
                        className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10.5px] font-bold tabular-nums"
                        style={{ color: "#7C3AED" }}
                      >
                        {v}
                      </span>
                    )}
                  </div>
                  <span
                    className="text-[10.5px] font-medium"
                    style={{
                      color: isToday ? DT.text : DT.textSubtle,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {DAY_LABELS[i]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider + recent recruiter rows */}
      <div className="border-t" style={{ borderColor: DT.border }}>
        <div className="flex items-center justify-between px-6 pt-5 lg:px-7">
          <span
            className="text-[11px] font-bold uppercase"
            style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
          >
            Recent activity
          </span>
        </div>
        <ul className="flex flex-col divide-y px-2 pb-2 pt-1 lg:px-3" style={{ borderColor: DT.border }}>
          {recent.map((r, i) => (
            <motion.li
              key={r.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.35 + i * 0.06, ease: EASE }}
              className="flex items-center gap-3 px-4 py-3"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[13px] font-bold"
                style={{ background: r.logoBg, color: r.logoColor }}
              >
                {r.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-[13.5px] font-semibold"
                  style={{ color: DT.text, letterSpacing: "-0.01em" }}
                >
                  <span
                    className="mr-2 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide align-middle"
                    style={{
                      background:
                        r.action === "shortlisted"
                          ? "rgba(5,150,105,0.1)"
                          : "rgba(124,58,237,0.1)",
                      color: r.action === "shortlisted" ? "#059669" : "#7C3AED",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {r.action === "shortlisted" ? "Shortlisted" : "Viewed"}
                  </span>
                  {r.company}
                </div>
                <div
                  className="mt-0.5 truncate text-[12px]"
                  style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
                >
                  {r.role} · {r.when}
                </div>
              </div>
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0"
                color={DT.textSubtle}
                strokeWidth={2}
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Saved shortlist — preview 3 saved jobs + compare CTA
   ──────────────────────────────────────────────────────────────────────── */

function SavedShortlistCard({
  savedJobs,
  preview,
  onViewAll,
}: {
  savedJobs: number;
  preview: MockJob[];
  onViewAll: () => void;
}) {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[22px] border"
      style={{
        borderColor: DT.border,
        background: DT.surface,
        boxShadow: DT.shadow,
      }}
    >
      <div className="flex items-start justify-between gap-3 p-6 pb-4 lg:p-7 lg:pb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[10px]"
              style={{ background: DT.accentSoft }}
            >
              <Bookmark className="h-4 w-4" color={DT.accent} strokeWidth={2} />
            </div>
            <span
              className="text-[11px] font-bold uppercase"
              style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
            >
              Saved shortlist
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className="tabular-nums"
              style={{
                fontFamily: DT.serif,
                fontSize: 38,
                lineHeight: 1,
                letterSpacing: "-0.035em",
                color: DT.text,
              }}
            >
              {savedJobs}
            </span>
            <span
              className="text-[12.5px] font-medium"
              style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
            >
              roles to compare
            </span>
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase"
          style={{
            background: "rgba(234,88,12,0.1)",
            color: DT.accent,
            letterSpacing: "0.08em",
          }}
        >
          2 closing soon
        </span>
      </div>

      <ul className="flex flex-col divide-y px-3" style={{ borderColor: DT.border }}>
        {preview.map((j, i) => {
          const scoreColor =
            j.matchScore >= 90 ? "#059669" : j.matchScore >= 80 ? "#D97706" : DT.textMuted;
          return (
            <motion.li
              key={j.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.32 + i * 0.06, ease: EASE }}
              className="flex items-center gap-3 px-4 py-3"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[13px] font-bold"
                style={{ background: j.logoBg, color: j.logoColor }}
              >
                {j.logoLetter}
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-[13.5px] font-semibold"
                  style={{ color: DT.text, letterSpacing: "-0.01em" }}
                >
                  {j.title}
                </div>
                <div
                  className="mt-0.5 flex items-center gap-1.5 truncate text-[12px]"
                  style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
                >
                  <span className="truncate">{j.company}</span>
                  <span
                    className="inline-block h-1 w-1 rounded-full"
                    style={{ background: DT.textSubtle }}
                  />
                  <span className="truncate">{j.location}</span>
                </div>
              </div>
              <span
                className="tabular-nums text-[12.5px] font-bold"
                style={{ color: scoreColor, letterSpacing: "-0.01em" }}
              >
                {j.matchScore}%
              </span>
            </motion.li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onViewAll}
        className="flex items-center justify-center gap-2 border-t px-6 py-4 text-[13px] font-semibold transition-colors hover:bg-stone-50"
        style={{ borderColor: DT.border, color: DT.accent, letterSpacing: "-0.01em" }}
      >
        Compare all {savedJobs} saved
        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Job match card — logo, role, score, meta chips, why-you-match panel
   ──────────────────────────────────────────────────────────────────────── */

function JobMatchCard({
  job,
  index,
  onOpen,
}: {
  job: MockJob;
  index: number;
  onOpen: () => void;
}) {
  const scoreColor =
    job.matchScore >= 90 ? "#059669" : job.matchScore >= 80 ? "#D97706" : DT.textMuted;
  const scoreBg =
    job.matchScore >= 90
      ? "rgba(5,150,105,0.10)"
      : job.matchScore >= 80
        ? "rgba(217,119,6,0.10)"
        : "rgba(28,25,23,0.05)";

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -3 }}
      className="group relative flex w-full flex-col items-stretch rounded-[20px] border p-5 text-left transition-shadow hover:shadow-lg"
      style={{
        borderColor: DT.border,
        background: DT.surface,
        boxShadow: DT.shadow,
      }}
    >
      {/* Match chip */}
      <span
        className="absolute right-5 top-5 rounded-full px-2.5 py-1 text-[12.5px] font-bold tabular-nums"
        style={{
          background: scoreBg,
          color: scoreColor,
          letterSpacing: "-0.02em",
        }}
      >
        {job.matchScore}%
      </span>

      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[14px] font-bold"
          style={{ background: job.logoBg, color: job.logoColor }}
        >
          {job.logoLetter}
        </div>
        <div className="min-w-0 pr-14">
          <div
            className="truncate text-[15px] font-semibold"
            style={{ color: DT.text, letterSpacing: "-0.02em" }}
          >
            {job.title}
          </div>
          <div
            className="mt-0.5 flex items-center gap-1.5 truncate text-[12.5px]"
            style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
          >
            <span className="truncate">{job.company}</span>
            <span
              className="inline-block h-1 w-1 rounded-full"
              style={{ background: DT.textSubtle }}
            />
            <span>{job.postedAgo}</span>
          </div>
        </div>
      </div>

      {/* Meta chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {[
          { icon: <MapPin className="h-3 w-3" strokeWidth={2} />, text: job.location },
          { text: job.locationType },
          { text: job.salary },
        ].map((chip, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium"
            style={{
              background: "rgba(28,25,23,0.04)",
              color: DT.textMuted,
              letterSpacing: "-0.01em",
            }}
          >
            {chip.icon}
            {chip.text}
          </span>
        ))}
      </div>

      {/* Why match */}
      <div
        className="mt-4 rounded-[14px] border p-3.5"
        style={{
          background: WHY_MATCH_GRADIENT,
          borderColor: "rgba(234,88,12,0.14)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(234,88,12,0.05)",
        }}
      >
        <div
          className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase"
          style={{
            color: "#E85A22",
            letterSpacing: "0.06em",
            marginBottom: 4,
          }}
        >
          <Sparkles className="h-3 w-3" strokeWidth={2} fill="#EA580C" color="#EA580C" />
          Why you match
        </div>
        <p
          className="text-[12.5px] leading-[1.55]"
          style={{ color: "rgba(28,25,23,0.72)", letterSpacing: "-0.01em" }}
        >
          {job.whyMatch}
        </p>
      </div>

      {/* View affordance */}
      <div
        className="mt-4 flex items-center justify-between text-[12.5px] font-semibold"
        style={{ color: DT.accent, letterSpacing: "-0.01em" }}
      >
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          Review in workspace
        </span>
        <ArrowUpRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      </div>
    </motion.button>
  );
}
