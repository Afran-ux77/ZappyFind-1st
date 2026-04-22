import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Brain,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Eye,
  FileText,
  Flame,
  Globe2,
  Layers,
  Loader2,
  Lock,
  MapPin,
  MessageCircle,
  Mic,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import type { FullProfile } from "../components/WelcomeScreen";
import { JOB_DEPARTMENT_LABEL_BY_ID } from "../components/jobPrefDepartmentsData";
import { cn } from "../components/ui/utils";
import { InterviewRecordingCompactCard } from "../components/InterviewTranscriptScroll";
import {
  ANALYSIS_TRAITS,
  INTERVIEW_RECAP_SUMMARY,
  INTERVIEW_RECAP_VERDICT,
  traitAccent,
} from "../interviewRecapCopy";
import { DT, desktopHubStagger } from "./desktop-tokens";

const EASE = [0.16, 1, 0.3, 1] as const;

/** KPI logo stack — entrance + hover springs */
const LOGO_IN_SPRING = { type: "spring" as const, stiffness: 320, damping: 20, mass: 0.62 };
const LOGO_HOVER_SPRING = { type: "spring" as const, stiffness: 520, damping: 30, mass: 0.42 };
const LOGO_TAP_SPRING = { type: "spring" as const, stiffness: 680, damping: 36, mass: 0.35 };

const HERO_GRADIENT =
  "radial-gradient(ellipse at 18% 0%, #FFF6EE 0%, #FFEAD6 42%, #FFD9BC 90%)";
const GROWTH_HERO_GRADIENT =
  "radial-gradient(ellipse at 15% 5%, #FEFAF6 0%, #FFF5ED 50%, #FFEDD5 100%)";
const WHY_MATCH_GRADIENT =
  "linear-gradient(160deg, rgba(234,88,12,0.09) 0%, rgba(255,255,255,0.92) 42%, rgba(255,248,242,0.85) 100%)";

/** Case 1 interview recap — warm “analysis deck”, visually subordinate to the warm hero card.
 *  Cream paper surface, faint warm ruling, soft amber accent — never more prominent than the hero. */
const RECAP_DECK_GRADIENT =
  "linear-gradient(165deg, rgba(255,252,247,1) 0%, rgba(254,249,243,1) 50%, rgba(255,246,236,0.96) 100%)";
const RECAP_DECK_BORDER = "rgba(120, 72, 34, 0.11)";
const RECAP_DECK_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.78), 0 1px 2px rgba(124,58,10,0.04), 0 12px 34px rgba(124,58,10,0.05)";
const RECAP_RAIL_GRADIENT =
  "linear-gradient(180deg, rgba(234,88,12,0.55) 0%, rgba(251,146,60,0.35) 55%, rgba(251,191,36,0.05) 100%)";
/** Fine warm horizontal rule lines — wider spacing + lighter ink so they stay subtle. */
const RECAP_DECK_TEXTURE =
  "repeating-linear-gradient(0deg, rgba(120,53,15,0.02) 0, rgba(120,53,15,0.02) 1px, transparent 1px, transparent 52px)";

/* ─────────────────────────────────────────────────────────────────────────
   Case taxonomy — the UI labels match the mobile "Case 1..8" menu.
   ──────────────────────────────────────────────────────────────────────── */
export type DesktopDashboardCaseKey =
  | "case-0" // UI "Case 1" — interview complete, AI curating (celebratory)
  | "case-1" // UI "Case 2" — BASE dashboard (strong performer)
  | "case-2" // UI "Case 3" — below-average performer, growth plan
  | "case-4" // UI "Case 4" — no ZappyFind DB roles yet, internet fallback
  | "case-3" // UI "Case 5" — last call interrupted, retake to unlock
  | "case-6" // UI "Case 6" — below-average (case6 copy/emphasis)
  | "case-7" // UI "Case 7" — paid retries exhausted
  | "case-8"; // UI "Case 8" — interview not started yet

export const DESKTOP_DASHBOARD_CASES: Array<{
  key: DesktopDashboardCaseKey;
  label: string;
  description: string;
}> = [
  { key: "case-0", label: "Case 1", description: "Interview complete · AI curating" },
  { key: "case-1", label: "Case 2", description: "Base · strong performer" },
  { key: "case-2", label: "Case 3", description: "Below-average · growth plan" },
  { key: "case-4", label: "Case 4", description: "No ZappyFind roles · internet fallback" },
  { key: "case-3", label: "Case 5", description: "Call interrupted · retake" },
  { key: "case-6", label: "Case 6", description: "Below-average · low fit" },
  { key: "case-7", label: "Case 7", description: "Retakes exhausted · paid" },
  { key: "case-8", label: "Case 8", description: "Interview not started" },
];

/* ─────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────── */
function humanizePreferenceCategoryId(id: string): string {
  return id
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function heroRoleFocusLabel(profile: FullProfile | null | undefined): string {
  const raw = profile?.preferences?.categories?.[0]?.trim();
  if (!raw) return "Product design";
  return JOB_DEPARTMENT_LABEL_BY_ID[raw] ?? humanizePreferenceCategoryId(raw);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ─────────────────────────────────────────────────────────────────────────
   Mock data
   ──────────────────────────────────────────────────────────────────────── */
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

/** Case 4 — curated internet roles we surface while ZappyFind onboards companies. */
const INTERNET_JOBS: Array<MockJob & { sourceDomain: string }> = [
  {
    id: "n1",
    title: "Senior Product Designer",
    company: "Lumen Labs",
    logoLetter: "L",
    logoBg: "#E8F0FF",
    logoColor: "#2D6AFF",
    matchScore: 88,
    salary: "₹26L – ₹34L",
    location: "Bangalore",
    locationType: "Hybrid",
    postedAgo: "Today",
    whyMatch:
      "Matches your preference for growth-stage B2B SaaS with a strong systems-thinking bias. Apply via LinkedIn.",
    sourceDomain: "linkedin.com",
  },
  {
    id: "n2",
    title: "Staff UX Designer",
    company: "Northwind",
    logoLetter: "N",
    logoBg: "#FFF3E8",
    logoColor: "#FC8019",
    matchScore: 91,
    salary: "₹36L – ₹44L",
    location: "Remote, India",
    locationType: "Remote",
    postedAgo: "Yesterday",
    whyMatch:
      "Fintech + 0→1 product focus, matches your recent case studies. Recruiter hiring directly on Wellfound.",
    sourceDomain: "wellfound.com",
  },
  {
    id: "n3",
    title: "Lead Product Designer",
    company: "Orbita",
    logoLetter: "O",
    logoBg: "#F3ECFF",
    logoColor: "#5F259F",
    matchScore: 85,
    salary: "₹30L – ₹38L",
    location: "Bangalore",
    locationType: "Hybrid",
    postedAgo: "2d ago",
    whyMatch:
      "Builds the kind of data-heavy dashboards you've shipped before. Apply via the company website.",
    sourceDomain: "orbita.ai",
  },
  {
    id: "n4",
    title: "Product Designer",
    company: "Cedar Studio",
    logoLetter: "C",
    logoBg: "#E7F9F1",
    logoColor: "#0F9D58",
    matchScore: 84,
    salary: "₹18L – ₹26L",
    location: "Mumbai",
    locationType: "Hybrid",
    postedAgo: "3d ago",
    whyMatch:
      "Consumer UX craft and research cadence line up with how they describe the role. Apply via Glassdoor.",
    sourceDomain: "glassdoor.co.in",
  },
  {
    id: "n5",
    title: "UX Designer",
    company: "Riverstack",
    logoLetter: "R",
    logoBg: "#FFF1F4",
    logoColor: "#D6336C",
    matchScore: 83,
    salary: "₹16L – ₹22L",
    location: "Hyderabad",
    locationType: "Hybrid",
    postedAgo: "4d ago",
    whyMatch: "B2B workflow density matches your enterprise portfolio; team posts weekly on Naukri.",
    sourceDomain: "naukri.com",
  },
  {
    id: "n6",
    title: "Senior UI Designer",
    company: "Brightforge",
    logoLetter: "B",
    logoBg: "#FEF6DC",
    logoColor: "#C49206",
    matchScore: 87,
    salary: "₹24L – ₹30L",
    location: "Bangalore",
    locationType: "Remote",
    postedAgo: "5d ago",
    whyMatch: "Design systems + component QA emphasis mirrors your recent IC work. Role on Cutshort.",
    sourceDomain: "cutshort.io",
  },
  {
    id: "n7",
    title: "Product Designer II",
    company: "Kite Health",
    logoLetter: "K",
    logoBg: "#E8F0FF",
    logoColor: "#2D6AFF",
    matchScore: 82,
    salary: "₹20L – ₹28L",
    location: "Remote, India",
    locationType: "Remote",
    postedAgo: "1w ago",
    whyMatch: "Regulated-product patterns you have already shipped; hiring manager active on LinkedIn.",
    sourceDomain: "linkedin.com",
  },
  {
    id: "n8",
    title: "Design Lead (IC)",
    company: "Monolith Analytics",
    logoLetter: "M",
    logoBg: "#F3ECFF",
    logoColor: "#5F259F",
    matchScore: 86,
    salary: "₹34L – ₹42L",
    location: "Bangalore",
    locationType: "Hybrid",
    postedAgo: "6d ago",
    whyMatch: "Data visualization + narrative dashboards map to your strongest case studies. Listed on Instahyre.",
    sourceDomain: "instahyre.com",
  },
  {
    id: "n9",
    title: "Product Designer, Growth",
    company: "SproutPay",
    logoLetter: "S",
    logoBg: "#FFF3E8",
    logoColor: "#FC8019",
    matchScore: 81,
    salary: "₹19L – ₹25L",
    location: "Pune",
    locationType: "Hybrid",
    postedAgo: "2w ago",
    whyMatch: "Experiment-led UX and funnel instrumentation align with your growth-stage experience. Wellfound post.",
    sourceDomain: "wellfound.com",
  },
  {
    id: "n10",
    title: "Staff Product Designer",
    company: "Northwind",
    logoLetter: "N",
    logoBg: "#FFF3E8",
    logoColor: "#FC8019",
    matchScore: 80,
    salary: "₹38L – ₹46L",
    location: "Remote, India",
    locationType: "Remote",
    postedAgo: "1w ago",
    whyMatch: "Fintech depth and stakeholder storytelling match their senior IC bar. Same team as another Northwind listing.",
    sourceDomain: "wellfound.com",
  },
  {
    id: "n11",
    title: "Product Designer (Contract)",
    company: "Atlas Grid",
    logoLetter: "A",
    logoBg: "#E7F9F1",
    logoColor: "#0F9D58",
    matchScore: 79,
    salary: "₹14L – ₹20L",
    location: "Chennai",
    locationType: "On-site",
    postedAgo: "3w ago",
    whyMatch: "Short contract to ship a dashboard refresh; scope fits your fastest turnaround projects. Company careers page.",
    sourceDomain: "atlasgrid.com",
  },
];

/** Case 4 dashboard: how many internet roles render before “See all” opens the full list. */
const CASE4_DASHBOARD_JOB_LIMIT = 6;

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

const SAVED_PREVIEW_IDS = ["4", "1", "2"];

const INTERVIEW_MOMENTS: Array<{ time: string; label: string; quote: string }> = [
  {
    time: "02:14",
    label: "Most recent project",
    quote:
      "We cut onboarding drop-off by redesigning the first three screens and moving the identity step later in the flow.",
  },
  {
    time: "05:42",
    label: "A hard trade-off",
    quote:
      "We shipped the less ambitious option on purpose — the data wasn't there yet, and guessing would have cost trust.",
  },
  {
    time: "08:30",
    label: "How you lead",
    quote:
      "I try to leave the team with more clarity than I found it in. If my doc saves an hour per engineer, that's the win.",
  },
];

/* Case 3 / Case 6 — below-average growth dashboard. */
type GrowthStep = {
  title: string;
  description: string;
  impact: string;
  impactColor: string;
  iconType: "video" | "layers" | "file" | "mic";
};

const GROWTH_PLAN_STEPS: GrowthStep[] = [
  {
    title: "Add in-demand skills",
    description: "SQL and Data Storytelling are top-requested for your target roles.",
    impact: "Quick win",
    impactColor: "#2563EB",
    iconType: "layers",
  },
  {
    title: "Upload a case study",
    description: "Recruiters rank this #1 for evaluating mid-level designers.",
    impact: "High impact",
    impactColor: "#059669",
    iconType: "file",
  },
  {
    title: "Retake ZappyFind call",
    description: "Paid add-on: one session can improve your interview score by up to 20%.",
    impact: "Paid",
    impactColor: "#D97706",
    iconType: "mic",
  },
  {
    title: "Record a video intro",
    description: "Only 8% of designers at your level have one — 3× more recruiter attention.",
    impact: "Stand out",
    impactColor: "#EA580C",
    iconType: "video",
  },
];

const LOW_STRENGTHS = [
  {
    label: "Collaborative Mindset",
    detail:
      "You show strong team orientation and value shared ownership — a trait hiring managers consistently rank in their top 3.",
    percentile: 62,
    color: "#059669",
    icon: "users" as const,
  },
  {
    label: "Growth Trajectory",
    detail:
      "Your learning pace over the last 2 years shows strong upward momentum. Many employers value trajectory over current level.",
    percentile: 55,
    color: "#6366F1",
    icon: "trend" as const,
  },
  {
    label: "Communication Clarity",
    detail:
      "You explain ideas with structure and purpose — a skill that many senior designers still find challenging.",
    percentile: 48,
    color: "#D97706",
    icon: "chat" as const,
  },
];

const LOW_IMPROVEMENT_AREAS = [
  {
    area: "Domain depth",
    current: 38,
    target: 65,
    advice: "Add 1–2 detailed case studies showing your end-to-end design process.",
    color: "#EA580C",
  },
  {
    area: "Technical breadth",
    current: 32,
    target: 60,
    advice: "Learning SQL or basic data analysis opens 40% more roles in your target bracket.",
    color: "#6366F1",
  },
  {
    area: "Interview confidence",
    current: 41,
    target: 70,
    advice: "Practice structured answers — Zappy's AI coach can boost your score in just 2 sessions.",
    color: "#D97706",
  },
];

const LOW_PERF_JOBS: Array<MockJob & { context: string }> = [
  {
    id: "lp1",
    title: "Junior Product Designer",
    company: "ZappyOrbit",
    logoLetter: "C",
    logoBg: "#EEF2FF",
    logoColor: "#4F46E5",
    matchScore: 62,
    salary: "₹12L – ₹18L",
    location: "Bangalore",
    locationType: "Hybrid",
    postedAgo: "3d ago",
    whyMatch: "",
    context:
      "Your collaborative mindset and growing Figma skills align with their junior design track. They prioritize potential over experience.",
  },
  {
    id: "lp2",
    title: "UI Designer",
    company: "ZappyNest",
    logoLetter: "F",
    logoBg: "#E7F9F1",
    logoColor: "#2E7D32",
    matchScore: 55,
    salary: "₹10L – ₹16L",
    location: "Chennai",
    locationType: "Remote",
    postedAgo: "1d ago",
    whyMatch: "",
    context:
      "They value growth potential and offer strong mentorship programs — ideal for building your portfolio and skills.",
  },
  {
    id: "lp3",
    title: "Associate Product Designer",
    company: "ZappyLabs",
    logoLetter: "Z",
    logoBg: "#FFF3E8",
    logoColor: "#C2410C",
    matchScore: 58,
    salary: "₹11L – ₹17L",
    location: "Kochi",
    locationType: "Hybrid",
    postedAgo: "2d ago",
    whyMatch: "",
    context:
      "You match their early-career product design path, and this role offers structured mentorship with exposure to end-to-end product work.",
  },
];

const COMPETITIVE_EDGE_ITEMS = [
  {
    dimension: "Communication",
    percentile: 92,
    color: "#059669",
    icon: "message" as const,
    tip: "Exceptional clarity — top-tier among designers.",
  },
  {
    dimension: "Domain depth",
    percentile: 82,
    color: "#6366F1",
    icon: "layers" as const,
    tip: "Add a case study to break into the top 10%.",
  },
  {
    dimension: "Role fit",
    percentile: 74,
    color: "#D97706",
    icon: "target" as const,
    tip: "Refine preferences to sharpen your match score.",
  },
];

const RETAKE_TIPS = [
  "Use a quiet room and earphones for clearer audio.",
  "Answer naturally in your own words — no script needed.",
  "Use short examples (problem → action → result).",
  "If the call drops, reopen and continue immediately.",
];

/* ─────────────────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────────────────── */
type DesktopDashboardViewProps = {
  firstName: string;
  profile: FullProfile | null;
  hasCompletedInterview: boolean;
  /** Demo case to render. Defaults to `case-1` (base). */
  caseMode?: DesktopDashboardCaseKey;
  onStartInterview: () => void;
  onReviewJobs: () => void;
  onViewSavedJobs: () => void;
};

export function DesktopDashboardView({
  firstName,
  profile,
  hasCompletedInterview,
  caseMode = "case-1",
  onStartInterview,
  onReviewJobs,
  onViewSavedJobs,
}: DesktopDashboardViewProps) {
  const name = firstName || "Alex";
  const roleLabel = heroRoleFocusLabel(profile);

  const isCase1 = caseMode === "case-0"; // "Case 1" — analysis/curating
  const isBase = caseMode === "case-1"; // "Case 2" — base
  const isLowPerf = caseMode === "case-2" || caseMode === "case-6";
  const isCase6 = caseMode === "case-6";
  const isCase4 = caseMode === "case-4";
  const isCase5 = caseMode === "case-3";
  const isCase7 = caseMode === "case-7";
  const isCase8 = caseMode === "case-8";
  const isRetryCall = isCase5 || isCase7;
  const isLocked = isCase5 || isCase7 || isCase8;

  const effectiveHasInterview =
    isCase1 || isBase || isCase4
      ? true
      : isRetryCall || isCase8
        ? false
        : hasCompletedInterview;

  const totalJobs = 42;
  const activeCompanies = 18;
  const savedJobs = 8;
  const applied = 16;
  const recruiterViews = 14;

  const savedPreview = SAVED_PREVIEW_IDS
    .map((id) => ROW_JOBS.find((j) => j.id === id))
    .filter((j): j is MockJob => Boolean(j));

  /* Cases 3 & 6 get a bespoke below-average layout. */
  if (isLowPerf) {
    return (
      <div className="p-6 lg:p-8" style={{ fontFamily: DT.sans }}>
        <motion.div
          variants={desktopHubStagger.container}
          initial="hidden"
          animate="show"
          className="mx-auto flex max-w-[1240px] flex-col gap-6"
        >
          <GrowthHero name={name} case6Mode={isCase6} />
          <BelowAveragePanel onReviewJobs={onReviewJobs} />
        </motion.div>
      </div>
    );
  }

  const heroMode: HeroMode = isCase1
    ? "analysis"
    : isCase4
      ? "internet"
      : isCase7
        ? "paidRetry"
        : isCase5
          ? "retry"
          : isCase8
            ? "notStarted"
            : "complete";

  const jobs = isCase4 ? INTERNET_JOBS : ROW_JOBS;
  const jobsToShow = isLocked ? 3 : isCase4 ? Math.min(CASE4_DASHBOARD_JOB_LIMIT, jobs.length) : jobs.length;
  const topMatchesTitle = isCase1
    ? null
    : isCase4
      ? "Curated internet roles"
      : isLocked
        ? "Potential matches"
        : "Your top matches";
  const topMatchesSubtitle = isCase1
    ? null
    : isCase4
      ? "No ZappyFind matches yet. Apply these curated internet roles while we onboard companies for your preferences."
      : isCase8
        ? "Preview is locked until you start the ZappyFind voice interview."
        : isCase7
          ? "Retakes are paused after 3 unsuccessful attempts."
          : isCase5
            ? "Preview is locked until you retake the ZappyFind call."
            : `Sorted by fit score · ${roleLabel}`;

  const topMatchesSeeAll = !isCase1 && !isLocked;

  return (
    <div className="p-6 lg:p-8" style={{ fontFamily: DT.sans }}>
      <motion.div
        variants={desktopHubStagger.container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-[1240px] flex-col gap-6"
      >
        {/* Row 1 — Hero */}
        <HeroStandingCard
          name={name}
          roleLabel={roleLabel}
          hasCompletedInterview={effectiveHasInterview}
          mode={heroMode}
          onStartInterview={onStartInterview}
        />

        {/* Case 1 — AI analysis panel (takes the place of KPI/top matches/etc.) */}
        {isCase1 && <InterviewAnalysisPanel />}

        {/* KPI strip — hidden when interview locked/retry/case1 (nothing meaningful yet). */}
        {!isCase1 && !isRetryCall && !isCase8 && (
          <KpiStrip
            totalJobs={isCase4 ? INTERNET_JOBS.length : totalJobs}
            activeCompanies={isCase4 ? INTERNET_JOBS.length : activeCompanies}
            applied={applied}
            savedJobs={savedJobs}
            internetMode={isCase4}
          />
        )}

        {/* Row — Top matches grid */}
        {!isCase1 && (
          <motion.section variants={desktopHubStagger.item}>
            <div className="mb-4 flex flex-col gap-2">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="max-w-[62ch]">
                  <h3
                    className="text-[22px] tracking-tight"
                    style={{ fontFamily: DT.serif, color: DT.text, letterSpacing: "-0.02em" }}
                  >
                    {topMatchesTitle}
                  </h3>
                </div>
                {topMatchesSeeAll && (
                  <button
                    type="button"
                    onClick={onReviewJobs}
                    className="inline-flex items-center gap-1 rounded-[10px] border px-3 py-1.5 text-[12.5px] font-semibold transition-[color,background-color,border-color,box-shadow] hover:bg-[rgba(234,88,12,0.06)] hover:underline"
                    style={{
                      color: DT.accent,
                      borderColor: "rgba(234,88,12,0.45)",
                      background: "rgba(255,255,255,0.72)",
                      boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset",
                    }}
                  >
                    See all {isCase4 ? INTERNET_JOBS.length : totalJobs}
                    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                )}
              </div>
              {topMatchesSubtitle && (
                <p
                  className={`min-w-0 text-[13px] leading-snug ${isCase4 ? "w-full" : "max-w-[62ch]"}`}
                  style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
                >
                  {topMatchesSubtitle}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {jobs.slice(0, jobsToShow).map((job, i) => (
                <JobMatchCard
                  key={job.id}
                  job={job}
                  index={i}
                  onOpen={onReviewJobs}
                  locked={isLocked}
                  blurInsight={isLocked}
                  hideScore={isLocked}
                  sourceDomain={isCase4 ? (job as (typeof INTERNET_JOBS)[number]).sourceDomain : undefined}
                />
              ))}
            </div>

            {isCase8 && (
              <div className="mt-5 flex justify-end">
                <CtaButton
                  variant="secondary"
                  fullWidth={false}
                  className="h-[40px] py-0"
                  onClick={onStartInterview}
                  icon={<Mic className="h-4 w-4" strokeWidth={2.2} />}
                >
                  Start voice interview
                </CtaButton>
              </div>
            )}
          </motion.section>
        )}

        {/* Case 5/7 — Prep tips for retake */}
        {isRetryCall && <RetakeTipsPanel onStartInterview={onStartInterview} paid={isCase7} />}

        {/* Case 8 — unlock teaser for standing/competitive edge */}
        {isCase8 && <LockedInsightTeaser onStartInterview={onStartInterview} />}

        {/* Row — Recruiter activity + Saved shortlist (base + internet + case 8 show recruiter/saved;
             hide on retake flows and on case 1 which replaces with analysis panel) */}
        {!isCase1 && !isRetryCall && !isCase8 && (
          <motion.div
            variants={desktopHubStagger.item}
            className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]"
          >
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
        )}

        {/* Row — Competitive edge + skills (base only, matches mobile intent) */}
        {isBase && <CompetitiveEdgePanel />}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Hero — one component, multiple modes.
   ──────────────────────────────────────────────────────────────────────── */
type HeroMode =
  | "complete" // base dashboard (Case 2) — or any interview-complete state
  | "analysis" // Case 1 — AI curating, celebratory
  | "internet" // Case 4 — curated internet fallback
  | "retry" // Case 5 — retake the call
  | "paidRetry" // Case 7 — retakes paused / paid
  | "notStarted"; // Case 8 — start voice interview

function HeroStandingCard({
  name,
  roleLabel,
  hasCompletedInterview,
  mode,
  onStartInterview,
}: {
  name: string;
  roleLabel: string;
  hasCompletedInterview: boolean;
  mode: HeroMode;
  onStartInterview: () => void;
}) {
  const gradient = mode === "retry" || mode === "paidRetry" || mode === "notStarted" ? HERO_GRADIENT : HERO_GRADIENT;

  return (
    <motion.div
      variants={desktopHubStagger.item}
      className="relative overflow-hidden rounded-[22px] border"
      style={{
        background: gradient,
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

      <div className="relative flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:p-7">
        <div className="min-w-0 max-w-[68ch]">
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

          <HeroSubline mode={mode} roleLabel={roleLabel} hasCompletedInterview={hasCompletedInterview} />
        </div>

        {/* Right-column action / ambient visual per mode */}
        {(mode === "analysis" ||
          mode === "internet" ||
          mode === "retry" ||
          mode === "notStarted") && (
          <div className="flex shrink-0 items-center gap-3">
            {mode === "analysis" && <HeroScanningBar />}
            {mode === "internet" && (
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold" style={{ borderColor: "rgba(234,88,12,0.25)", color: DT.accent, background: "rgba(255,255,255,0.72)", letterSpacing: "-0.01em" }}>
                <Globe2 className="h-3.5 w-3.5" strokeWidth={2} />
                Jobs surfaced from the open web
              </div>
            )}
            {(mode === "retry" || mode === "notStarted") && (
              <HeroInterviewCta
                mode={mode}
                onStartInterview={onStartInterview}
              />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function HeroSubline({
  mode,
  roleLabel,
  hasCompletedInterview,
}: {
  mode: HeroMode;
  roleLabel: string;
  hasCompletedInterview: boolean;
}) {
  if (mode === "analysis") {
    return (
      <div className="mt-3 flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-2">
          <motion.span
            animate={{ scale: [1, 1.14, 1], opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
            className="inline-block"
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#EA580C",
              boxShadow: "0 0 0 7px rgba(234,88,12,0.12)",
            }}
          />
          <span className="text-[14px] font-semibold" style={{ color: DT.text, letterSpacing: "-0.01em" }}>
            ZappyFind AI is curating your best-fit roles now
          </span>
        </div>
        <p className="text-[13.5px] leading-relaxed" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
          Sit tight — expect a WhatsApp or email alert within a few hours when your recommended matches are ready.
        </p>
      </div>
    );
  }

  if (mode === "internet") {
    return (
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "rgba(28,25,23,0.68)", letterSpacing: "-0.01em" }}>
        You're a strong fit for <strong style={{ color: "rgba(28,25,23,0.88)", fontWeight: 700 }}>{roleLabel}</strong>{" "}
        roles. We're onboarding ZappyFind roles that match your preferences. In the meantime, here are top internet
        roles you can apply to now.
      </p>
    );
  }

  if (mode === "retry") {
    return (
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "rgba(28,25,23,0.68)", letterSpacing: "-0.01em" }}>
        Your last ZappyFind call was interrupted, so your best matches are still locked. A quick retake (~10 min)
        unlocks your ranking, full match insights, and recruiter access.
      </p>
    );
  }

  if (mode === "paidRetry") {
    return (
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "rgba(28,25,23,0.68)", letterSpacing: "-0.01em" }}>
        You've completed <strong style={{ color: "rgba(28,25,23,0.88)", fontWeight: 700 }}>3 unsuccessful retake attempts</strong>.
        Free retakes are now paused for this profile. Pay for another call or contact support if this was a technical issue.
      </p>
    );
  }

  if (mode === "notStarted") {
    return (
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "rgba(28,25,23,0.68)", letterSpacing: "-0.01em" }}>
        One last step to see where you stand among <strong style={{ color: "rgba(28,25,23,0.88)", fontWeight: 700 }}>{roleLabel}</strong>{" "}
        candidates on ZappyFind — and to unlock top matches and direct recruiter introductions.
      </p>
    );
  }

  // complete (base)
  return (
    <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "rgba(28,25,23,0.68)", letterSpacing: "-0.01em" }}>
      {hasCompletedInterview ? (
        <>
          You're set up for <strong style={{ color: "rgba(28,25,23,0.86)", fontWeight: 700 }}>{roleLabel}</strong>{" "}
          roles. Explore today's curated matches, bookmark roles you want to revisit, and apply while your profile is
          still top-of-mind for hiring teams.
        </>
      ) : (
        <>
          Finish a short voice profile so we can line up stronger{" "}
          <strong style={{ color: "rgba(28,25,23,0.86)", fontWeight: 700 }}>{roleLabel}</strong>{" "}
          matches and show recruiters you're ready to talk.
        </>
      )}
    </p>
  );
}

function HeroScanningBar() {
  return (
    <div className="hidden w-[240px] flex-col gap-2 lg:flex">
      <div className="relative h-[5px] overflow-hidden rounded-full" style={{ background: "rgba(234,88,12,0.18)" }}>
        <motion.div
          animate={{ left: ["-32%", "100%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 h-full w-[32%] rounded-full"
          style={{
            background: "linear-gradient(90deg, rgba(255,143,86,0) 0%, #EA580C 50%, rgba(255,143,86,0) 100%)",
          }}
        />
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "#EA580C" }}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "rgba(28,25,23,0.5)" }}>
        Curating in progress
      </span>
    </div>
  );
}

function HeroInterviewCta({
  mode,
  onStartInterview,
}: {
  mode: "retry" | "notStarted";
  onStartInterview: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onStartInterview}
      className="inline-flex h-10 w-[220px] shrink-0 items-center justify-center gap-2 rounded-[10px] px-4 text-[13px] font-semibold text-white transition-transform hover:-translate-y-px"
      style={{
        background: DT.accentGradient,
        boxShadow: "0 6px 18px rgba(234,88,12,0.25), 0 1px 3px rgba(234,88,12,0.12)",
        letterSpacing: "-0.01em",
      }}
    >
      <Mic className="h-4 w-4" strokeWidth={2.2} />
      {mode === "retry" ? "Retake ZappyFind call" : "Start voice interview"}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Small helpers — section header, CTA button
   ──────────────────────────────────────────────────────────────────────── */
function SectionHead({
  title,
  subtitle,
  action,
  onAction,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="max-w-[62ch]">
        <h3
          className="text-[22px] tracking-tight"
          style={{ fontFamily: DT.serif, color: DT.text, letterSpacing: "-0.02em" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className="mt-1 text-[13px] leading-snug"
            style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1 rounded-[10px] border px-3 py-1.5 text-[12.5px] font-semibold transition-[color,background-color,border-color,box-shadow] hover:bg-[rgba(234,88,12,0.06)] hover:underline"
          style={{
            color: DT.accent,
            borderColor: "rgba(234,88,12,0.45)",
            background: "rgba(255,255,255,0.72)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset",
          }}
        >
          {action}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function CtaButton({
  children,
  variant,
  icon,
  onClick,
  fullWidth = true,
  className,
}: {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "ghost";
  icon?: React.ReactNode;
  onClick?: () => void;
  /** When false, button is content-sized (e.g. right-aligned in a row). */
  fullWidth?: boolean;
  className?: string;
}) {
  const widthClass = fullWidth ? "w-full" : "w-auto";
  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          `inline-flex ${widthClass} items-center justify-center gap-2 rounded-[14px] px-4 py-3.5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-px`,
          className,
        )}
        style={{
          background: DT.accentGradient,
          boxShadow: "0 10px 24px rgba(234,88,12,0.26), 0 2px 6px rgba(234,88,12,0.14)",
          letterSpacing: "-0.01em",
        }}
      >
        {icon}
        {children}
      </button>
    );
  }
  if (variant === "secondary") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          `inline-flex ${widthClass} items-center justify-center gap-2 rounded-[10px] border px-4 py-3.5 text-[14px] font-semibold transition-[color,background-color,border-color] hover:bg-[rgba(234,88,12,0.06)]`,
          className,
        )}
        style={{
          borderColor: "rgba(234,88,12,0.45)",
          background: "rgba(255,255,255,0.72)",
          color: DT.accent,
          letterSpacing: "-0.01em",
          boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset",
        }}
      >
        {icon}
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        `inline-flex ${widthClass} items-center justify-center gap-2 rounded-[14px] border px-4 py-3.5 text-[14px] font-semibold transition-colors hover:bg-stone-50`,
        className,
      )}
      style={{
        borderColor: "rgba(28,25,23,0.1)",
        background: "rgba(255,255,255,0.7)",
        color: DT.text,
        letterSpacing: "-0.01em",
      }}
    >
      {icon}
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   KPI strip
   ──────────────────────────────────────────────────────────────────────── */
type KpiSegment = { label: string; short: string; value: number; color: string };
type KpiLogoChip = { initial: string; bg: string; color: string; company?: string };

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
  emerald: "#059669",
} as const;

function KpiStrip({
  totalJobs,
  activeCompanies,
  applied,
  savedJobs,
  internetMode,
}: {
  totalJobs: number;
  activeCompanies: number;
  applied: number;
  savedJobs: number;
  internetMode?: boolean;
}) {
  const companyLogos: KpiLogoChip[] = ROW_JOBS.slice(0, 5).map((j) => ({
    initial: j.logoLetter,
    bg: j.logoBg,
    color: j.logoColor,
    company: j.company,
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
      label: internetMode ? "Internet roles" : "Curated roles",
      value: totalJobs,
      icon: internetMode ? Globe2 : Sparkles,
      accent: KPI_ACCENT.amber,
      accentSoft: "rgba(217,119,6,0.1)",
      viz: internetMode
        ? {
            kind: "segments",
            segments: [
              { label: "LinkedIn", short: "LinkedIn", value: 1, color: "#2D6AFF" },
              { label: "Wellfound", short: "Wellfound", value: 1, color: "#FC8019" },
              { label: "Company sites", short: "Direct", value: 1, color: "rgba(28,25,23,0.32)" },
            ],
          }
        : {
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
      label: internetMode ? "Sourced from" : "Active companies",
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

function SegmentedBar({ segments, delay = 0 }: { segments: KpiSegment[]; delay?: number }) {
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

function LogoStackTooltip({
  children,
  show,
  reduceMotion,
}: {
  children: ReactNode;
  show: boolean;
  reduceMotion: boolean;
}) {
  if (!show) return null;
  return (
    <span
      role="tooltip"
      className={`pointer-events-none absolute left-1/2 top-[calc(100%+6px)] z-[60] max-w-[min(240px,calc(100vw-48px))] -translate-x-1/2 rounded-[10px] border px-2.5 py-1.5 text-center text-[11px] font-semibold leading-snug shadow-lg ${
        reduceMotion
          ? "opacity-0 group-hover:opacity-100"
          : "translate-y-0.5 opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-y-0 group-hover:opacity-100"
      }`}
      style={{
        borderColor: "rgba(28,25,23,0.1)",
        background: "rgba(255,255,255,0.97)",
        color: DT.text,
        letterSpacing: "-0.015em",
        boxShadow:
          "0 10px 28px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}
    >
      {children}
    </span>
  );
}

function LogoStack({ logos, extra, delay = 0 }: { logos: KpiLogoChip[]; extra: number; delay?: number }) {
  const reduceMotion = useReducedMotion() ?? false;

  const baseRing = "0 0 0 2px #FFFFFF";
  const hoverShadow =
    "0 0 0 2px #FFFFFF, 0 12px 28px rgba(15,23,42,0.11), 0 4px 12px rgba(234,88,12,0.09)";

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2 [contain:layout]">
        {logos.map((l, i) => (
          <motion.span
            key={`${l.initial}-${i}`}
            className="group relative inline-flex justify-center"
            style={{ zIndex: logos.length - i }}
            initial={false}
            whileHover={{ zIndex: 48, transition: LOGO_HOVER_SPRING }}
          >
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.82, y: 8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { ...LOGO_IN_SPRING, delay: delay + i * 0.042 }
              }
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                      scale: 1.08,
                      boxShadow: hoverShadow,
                      transition: LOGO_HOVER_SPRING,
                    }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.93, transition: LOGO_TAP_SPRING }}
              className="relative flex h-8 w-8 cursor-default select-none items-center justify-center rounded-full text-[12px] font-bold will-change-transform"
              style={{
                background: l.bg,
                color: l.color,
                boxShadow: baseRing,
              }}
              title={l.company}
              aria-label={l.company ? `${l.company} (${l.initial})` : undefined}
            >
              {l.initial}
            </motion.span>
            <LogoStackTooltip show={Boolean(l.company)} reduceMotion={reduceMotion}>
              {l.company}
            </LogoStackTooltip>
          </motion.span>
        ))}
        {extra > 0 ? (
          <motion.span
            className="group relative inline-flex justify-center"
            style={{ zIndex: logos.length + 1 }}
            initial={false}
            whileHover={{ zIndex: 48, transition: LOGO_HOVER_SPRING }}
          >
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.82, y: 8, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { ...LOGO_IN_SPRING, delay: delay + logos.length * 0.042 }
              }
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -3,
                      scale: 1.08,
                      boxShadow: hoverShadow,
                      transition: LOGO_HOVER_SPRING,
                    }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.93, transition: LOGO_TAP_SPRING }}
              className="relative flex h-8 w-8 cursor-default select-none items-center justify-center rounded-full text-[11px] font-bold tabular-nums will-change-transform"
              style={{
                background: "rgba(28,25,23,0.06)",
                color: DT.textMuted,
                boxShadow: baseRing,
              }}
              title={`${extra} more ${extra === 1 ? "company" : "companies"}`}
              aria-label={`${extra} more companies not shown as logos`}
            >
              +{extra}
            </motion.span>
            <LogoStackTooltip show reduceMotion={reduceMotion}>
              {extra} more {extra === 1 ? "company" : "companies"}
            </LogoStackTooltip>
          </motion.span>
        ) : null}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Recruiter activity card
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
                        boxShadow: isToday ? "0 4px 14px rgba(124,58,237,0.28)" : "none",
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
   Saved shortlist
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
   Job match card — supports locked/blur/hint/source/hideScore for all cases.
   ──────────────────────────────────────────────────────────────────────── */
function JobMatchCard({
  job,
  index,
  onOpen,
  locked = false,
  blurInsight = false,
  hideScore = false,
  sourceDomain,
}: {
  job: MockJob;
  index: number;
  onOpen: () => void;
  locked?: boolean;
  blurInsight?: boolean;
  hideScore?: boolean;
  sourceDomain?: string;
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
      onClick={locked ? undefined : onOpen}
      whileHover={locked ? undefined : { y: -3 }}
      disabled={locked}
      className={`group relative flex w-full flex-col items-stretch rounded-[20px] border p-5 text-left transition-shadow ${
        locked ? "cursor-default" : "hover:shadow-lg"
      }`}
      style={{
        borderColor: DT.border,
        background: DT.surface,
        boxShadow: DT.shadow,
      }}
    >
      {/* Top-right: score chip or locked chip */}
      {hideScore ? (
        locked ? (
          <span
            className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase"
            style={{
              background: "rgba(28,25,23,0.07)",
              color: DT.textMuted,
              letterSpacing: "0.06em",
            }}
          >
            <Lock className="h-3 w-3" strokeWidth={2.2} />
            Locked
          </span>
        ) : null
      ) : (
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
      )}

      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[14px] font-bold"
          style={{ background: job.logoBg, color: job.logoColor }}
        >
          {job.logoLetter}
        </div>
        <div className="min-w-0 pr-24">
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

      <div
        className="mt-4 rounded-[14px] border p-3.5"
        style={{
          background: WHY_MATCH_GRADIENT,
          borderColor: "rgba(234,88,12,0.14)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 8px rgba(234,88,12,0.05)",
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
          {sourceDomain ? "Why it fits" : "Why you match"}
        </div>
        <p
          className="text-[12.5px] leading-[1.55]"
          style={{
            color: "rgba(28,25,23,0.72)",
            letterSpacing: "-0.01em",
            filter: blurInsight ? "blur(4px)" : "none",
            userSelect: blurInsight ? "none" : "auto",
          }}
        >
          {job.whyMatch}
        </p>
      </div>

      {!locked && (
        <div
          className="mt-4 flex items-center justify-between text-[12.5px] font-semibold"
          style={{ color: DT.accent, letterSpacing: "-0.01em" }}
        >
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            {sourceDomain ? "Open on the web" : "Review job"}
          </span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </div>
      )}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Case 1 — Interview recap (editorial, no scores)
   ──────────────────────────────────────────────────────────────────────── */
type InterviewRecapVariant = "pending" | "ready";

function InterviewRecapVariantToggle({
  variant,
  onChange,
}: {
  variant: InterviewRecapVariant;
  onChange: (v: InterviewRecapVariant) => void;
}) {
  const items: Array<{ key: InterviewRecapVariant; label: string }> = [
    { key: "pending", label: "Processing" },
    { key: "ready", label: "Ready" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Interview summary state"
      className="inline-flex items-center gap-1 self-end rounded-full border p-1"
      style={{
        borderColor: "rgba(120,72,34,0.14)",
        background: "rgba(255,252,247,0.8)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {items.map((item) => {
        const active = variant === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            className="relative rounded-full px-3 py-1 text-[11px] font-semibold transition-colors"
            style={{
              color: active ? "#fff" : "#7C4A13",
              letterSpacing: "-0.01em",
            }}
          >
            {active && (
              <motion.span
                layoutId="interview-recap-variant-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #EA580C 0%, #F97316 100%)",
                  boxShadow: "0 2px 8px rgba(234,88,12,0.28)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function InterviewAnalysisPanel() {
  const [variant, setVariant] = useState<InterviewRecapVariant>("ready");
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* Variant toggle — lets us preview the pending/empty state. */}
      <motion.div variants={desktopHubStagger.item} className="flex justify-end">
        <InterviewRecapVariantToggle variant={variant} onChange={setVariant} />
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {variant === "pending" ? (
          <InterviewRecapPendingDeck key="recap-pending" />
        ) : (
          <InterviewRecapReadyDeck
            key="recap-ready"
            showDetails={showDetails}
            setShowDetails={setShowDetails}
          />
        )}
      </AnimatePresence>

      {/* Pending: listen back still follows the processing deck (ready state inlines it before Moments). */}
      {variant === "pending" && (
        <motion.section variants={desktopHubStagger.item} className="w-full">
          <InterviewRecordingCompactCard />
        </motion.section>
      )}
    </>
  );
}

/* ── Ready deck (previous recap content, extracted verbatim) ───────────── */
function InterviewRecapReadyDeck({
  showDetails,
  setShowDetails,
}: {
  showDetails: boolean;
  setShowDetails: (updater: (prev: boolean) => boolean) => void;
}) {
  return (
    <>
      {/* ── 1. Interview intelligence deck (secondary to warm hero) ───── */}
      <motion.section
        variants={desktopHubStagger.item}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.32, ease: EASE }}
        className="relative overflow-hidden rounded-[17px] border lg:rounded-[18px]"
        style={{
          borderColor: RECAP_DECK_BORDER,
          background: RECAP_DECK_GRADIENT,
          boxShadow: RECAP_DECK_SHADOW,
        }}
      >
        {/* Warm paper ruling — extremely low contrast so the hero stays loudest */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: RECAP_DECK_TEXTURE }}
        />
        {/* Soft amber corner glow, contained — not the hero's big orange orb */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -80,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(234,88,12,0.11) 0%, rgba(251,146,60,0.05) 45%, transparent 72%)",
            filter: "blur(4px)",
          }}
        />
        {/* Hairline top sheen */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(234,88,12,0.22), transparent)",
          }}
        />

        <div className="relative flex flex-col gap-5 p-6 lg:flex-row lg:items-stretch lg:gap-8 lg:p-8">
          <div
            aria-hidden
            className="h-[3px] w-full max-w-[132px] shrink-0 rounded-full lg:hidden"
            style={{
              background: RECAP_RAIL_GRADIENT,
              boxShadow: "0 2px 12px rgba(234,88,12,0.18)",
            }}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-6">
            {/* Verdict — sans, tighter than hero serif */}
            <div className="max-w-[56ch]">
              <p
                className="text-[10px] font-semibold uppercase"
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace",
                  color: "#7C4A13",
                  letterSpacing: "0.12em",
                }}
              >
                AI Interview summary
              </p>
              <h2
                className="mt-2 text-[22px] font-semibold leading-[1.18] tracking-[-0.02em] lg:text-[26px]"
                style={{
                  fontFamily: DT.sans,
                  color: "#1C1917",
                }}
              >
                {INTERVIEW_RECAP_VERDICT}
              </h2>
              <p
                className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed"
                style={{ color: "rgba(68,64,60,0.9)", letterSpacing: "-0.01em" }}
              >
                {INTERVIEW_RECAP_SUMMARY}
              </p>
            </div>

          {/* Traits — qualitative, no numbers */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ANALYSIS_TRAITS.map((trait) => {
              const accent = traitAccent(trait.level);
              return (
                <div
                  key={trait.label}
                  className="flex flex-col gap-2 rounded-[14px] border p-4"
                  style={{
                    borderColor: "rgba(120,72,34,0.1)",
                    background: "rgba(255,253,250,0.72)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[12px] font-bold uppercase"
                      style={{ color: DT.textSubtle, letterSpacing: "0.08em" }}
                    >
                      {trait.label}
                    </span>
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: accent }}
                    />
                  </div>
                  <div
                    className="text-[16px] font-semibold leading-none tracking-[-0.02em]"
                    style={{
                      fontFamily: DT.sans,
                      color: accent,
                    }}
                  >
                    {trait.level}
                  </div>
                  <div
                    className="text-[12.5px] leading-[1.45]"
                    style={{ color: "rgba(68,64,60,0.86)", letterSpacing: "-0.01em" }}
                  >
                    {trait.blurb}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed analysis — on demand */}
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-colors"
              style={{
                borderColor: "rgba(234,88,12,0.42)",
                background: showDetails ? "rgba(234,88,12,0.1)" : "rgba(255,255,255,0.78)",
                color: DT.accent,
                letterSpacing: "-0.01em",
              }}
            >
              {showDetails ? "Hide detailed analysis" : "View detailed analysis"}
              <ChevronDown
                className="h-3.5 w-3.5 transition-transform"
                strokeWidth={2.3}
                color={DT.accent}
                style={{ transform: showDetails ? "rotate(180deg)" : "none" }}
              />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showDetails && (
              <motion.div
                key="recap-details"
                initial={{ opacity: 0, y: 8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="overflow-hidden"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  {ANALYSIS_TRAITS.map((trait) => {
                    const accent = traitAccent(trait.level);
                    return (
                      <div
                        key={`${trait.label}-detail`}
                        className="rounded-[14px] border p-4"
                        style={{
                          borderColor: "rgba(120,72,34,0.1)",
                          background: "rgba(255,253,250,0.85)",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[13px] font-bold"
                            style={{ color: DT.text, letterSpacing: "-0.01em" }}
                          >
                            {trait.label}
                          </span>
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase"
                            style={{
                              background: `${accent}14`,
                              color: accent,
                              letterSpacing: "0.08em",
                            }}
                          >
                            {trait.level}
                          </span>
                        </div>
                        <p
                          className="mt-2 text-[12.5px] leading-[1.55]"
                          style={{ color: "rgba(68,64,60,0.9)", letterSpacing: "-0.01em" }}
                        >
                          {trait.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* Listen back — above Moments in the ready flow */}
      <motion.section variants={desktopHubStagger.item} className="w-full">
        <InterviewRecordingCompactCard />
      </motion.section>

      {/* Notable moments — pull quotes */}
      <motion.section
        variants={desktopHubStagger.item}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.32, ease: EASE, delay: 0.04 }}
        className="flex flex-col gap-3"
      >
        <div>
          <div
            className="text-[11px] font-bold uppercase"
            style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
          >
            Moments worth replaying
          </div>
          <h3
            className="mt-1 text-[20px] lg:text-[22px]"
            style={{
              fontFamily: DT.serif,
              color: DT.text,
              letterSpacing: "-0.02em",
            }}
          >
            A few answers that stood out
          </h3>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {INTERVIEW_MOMENTS.map((m, i) => (
            <div
              key={m.time}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-[20px] border p-5 text-left transition-shadow"
              style={{
                borderColor: DT.border,
                background: DT.surface,
                boxShadow: DT.shadow,
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute transition-opacity group-hover:opacity-100"
                style={{
                  top: -40,
                  right: -30,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)",
                  opacity: 0.6,
                }}
              />

              <div
                className="relative text-[13px] font-bold"
                style={{ color: DT.text, letterSpacing: "-0.01em" }}
              >
                {m.label}
              </div>

              <p
                className="relative text-[14px] leading-[1.55]"
                style={{
                  color: "rgba(28,25,23,0.82)",
                  fontFamily: DT.serif,
                  letterSpacing: "-0.01em",
                }}
              >
                &ldquo;{m.quote}&rdquo;
              </p>

            </div>
          ))}
        </div>
      </motion.section>
    </>
  );
}

/* ── Pending deck — AI is still analysing the conversation ─────────────── */
type PendingPhase = { key: "transcribe" | "analyse" | "summarise"; label: string };
const PENDING_PHASES: PendingPhase[] = [
  { key: "transcribe", label: "Transcribing" },
  { key: "analyse", label: "Analysing" },
  { key: "summarise", label: "Summarising" },
];

function InterviewRecapPendingDeck() {
  const reduceMotion = useReducedMotion();
  const activeIndex = 1;

  return (
    <motion.section
      variants={desktopHubStagger.item}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.32, ease: EASE }}
      className="relative overflow-hidden rounded-[17px] border lg:rounded-[18px]"
      style={{
        borderColor: RECAP_DECK_BORDER,
        background: RECAP_DECK_GRADIENT,
        boxShadow: RECAP_DECK_SHADOW,
      }}
      aria-busy
      aria-live="polite"
    >
      {/* Shared paper ruling & amber accents (matches ready deck). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: RECAP_DECK_TEXTURE }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -80,
          right: -60,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234,88,12,0.11) 0%, rgba(251,146,60,0.05) 45%, transparent 72%)",
          filter: "blur(4px)",
        }}
      />
      {/* Top sheen (static) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(234,88,12,0.22), transparent)",
        }}
      />
      {/* Indeterminate progress beam — signals “something is happening”. */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-[2px]"
          style={{
            width: "32%",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.7) 50%, transparent 100%)",
            filter: "blur(0.4px)",
          }}
          animate={{ x: ["-32%", "320%"] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
        />
      )}

      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-stretch lg:gap-8 lg:p-8">
        {/* Warm rail — identical to ready deck */}
        <div
          aria-hidden
          className="h-[3px] w-full max-w-[132px] shrink-0 rounded-full lg:hidden"
          style={{
            background: RECAP_RAIL_GRADIENT,
            boxShadow: "0 2px 12px rgba(234,88,12,0.18)",
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-7">
          {/* Heading block */}
          <div className="max-w-[60ch]">
            <div className="flex items-center gap-2">
              <p
                className="text-[10px] font-semibold uppercase"
                style={{
                  fontFamily:
                    "ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace",
                  color: "#7C4A13",
                  letterSpacing: "0.12em",
                }}
              >
                AI Interview summary
              </p>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] text-[9.5px] font-bold uppercase"
                style={{
                  background: "rgba(234,88,12,0.1)",
                  color: "#C2410C",
                  letterSpacing: "0.1em",
                  border: "1px solid rgba(234,88,12,0.22)",
                }}
              >
                <motion.span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "#EA580C" }}
                  animate={
                    reduceMotion
                      ? undefined
                      : { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }
                  }
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
                In progress
              </span>
            </div>

            <h2
              className="mt-2 text-[22px] font-semibold leading-[1.18] tracking-[-0.02em] lg:text-[26px]"
              style={{ fontFamily: DT.sans, color: "#1C1917" }}
            >
              <span>Zappy is listening back to your interview.</span>
            </h2>
            <p
              className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed"
              style={{ color: "rgba(68,64,60,0.9)", letterSpacing: "-0.01em" }}
            >
              We’re turning your 14:22 conversation into a human-grade recap. A few honest
              signals, not a score. Usually ready in under a minute.
            </p>
          </div>

          {/* Phase strip */}
          <div
            className="flex flex-col gap-3 rounded-[14px] border p-4"
            style={{
              borderColor: "rgba(120,72,34,0.1)",
              background: "rgba(255,253,250,0.78)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              {PENDING_PHASES.map((phase, i) => {
                const state: "done" | "active" | "upcoming" =
                  i < activeIndex ? "done" : i === activeIndex ? "active" : "upcoming";
                const color =
                  state === "done"
                    ? "#059669"
                    : state === "active"
                      ? "#EA580C"
                      : "rgba(120,113,108,0.65)";
                return (
                  <div key={phase.key} className="flex items-center gap-2">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          state === "done"
                            ? "rgba(5,150,105,0.12)"
                            : state === "active"
                              ? "rgba(234,88,12,0.12)"
                              : "rgba(28,25,23,0.05)",
                        border: `1px solid ${
                          state === "done"
                            ? "rgba(5,150,105,0.35)"
                            : state === "active"
                              ? "rgba(234,88,12,0.35)"
                              : "rgba(28,25,23,0.08)"
                        }`,
                      }}
                    >
                      {state === "done" ? (
                        <Check className="h-3 w-3" strokeWidth={2.6} color={color} />
                      ) : state === "active" ? (
                        <motion.span
                          animate={reduceMotion ? undefined : { rotate: 360 }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{ display: "inline-flex" }}
                        >
                          <Loader2 className="h-3 w-3" strokeWidth={2.4} color={color} />
                        </motion.span>
                      ) : (
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: color }}
                        />
                      )}
                    </span>
                    <span
                      className="text-[12.5px] font-semibold"
                      style={{
                        color: state === "upcoming" ? DT.textMuted : DT.text,
                        letterSpacing: "-0.01em",
                        opacity: state === "upcoming" ? 0.75 : 1,
                      }}
                    >
                      {phase.label}
                    </span>
                    {i < PENDING_PHASES.length - 1 && (
                      <span
                        aria-hidden
                        className="mx-1 hidden h-px w-6 shrink-0 sm:inline-block"
                        style={{ background: "rgba(28,25,23,0.1)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ghost trait tiles — 4-up, shimmering. */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative flex flex-col gap-2 overflow-hidden rounded-[14px] border p-4"
                style={{
                  borderColor: "rgba(120,72,34,0.1)",
                  background: "rgba(255,253,250,0.72)",
                  backdropFilter: "blur(6px)",
                }}
              >
                {/* Shimmer sweep */}
                {!reduceMotion && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0"
                    style={{
                      width: "40%",
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.14) 50%, transparent 100%)",
                      left: "-40%",
                    }}
                    animate={{ left: ["-40%", "110%"] }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.18,
                    }}
                  />
                )}
                <div className="flex items-center justify-between">
                  <span
                    className="block h-[9px] rounded-full"
                    style={{
                      width: `${60 + (i % 3) * 10}%`,
                      background: "rgba(120,72,34,0.14)",
                    }}
                  />
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: "rgba(234,88,12,0.22)" }}
                  />
                </div>
                <span
                  className="mt-1 block h-[14px] rounded-[6px]"
                  style={{
                    width: `${50 + (i % 2) * 20}%`,
                    background:
                      "linear-gradient(90deg, rgba(234,88,12,0.18) 0%, rgba(234,88,12,0.08) 100%)",
                  }}
                />
                <span
                  className="mt-1 block h-[7px] rounded-full"
                  style={{ width: "92%", background: "rgba(28,25,23,0.08)" }}
                />
                <span
                  className="block h-[7px] rounded-full"
                  style={{ width: "74%", background: "rgba(28,25,23,0.06)" }}
                />
              </div>
            ))}
          </div>

          {/* Footnote — intelligent, reassuring, minimal. */}
          <div className="flex flex-wrap items-center gap-2">
            <Brain
              className="h-3.5 w-3.5 shrink-0"
              strokeWidth={2}
              color="#C2410C"
              aria-hidden
            />
            <span
              className="text-[12px] font-medium"
              style={{ color: "rgba(68,64,60,0.82)", letterSpacing: "-0.01em" }}
            >
              You can listen back to the recording now — we&rsquo;ll slot the recap
              in here the moment it&rsquo;s ready.
            </span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Cases 3 & 6 — Below-average growth dashboard
   ──────────────────────────────────────────────────────────────────────── */
function GrowthHero({ name, case6Mode }: { name: string; case6Mode: boolean }) {
  const profileStrength = 35;
  return (
    <motion.div
      variants={desktopHubStagger.item}
      className="relative overflow-hidden rounded-[22px] border"
      style={{
        background: GROWTH_HERO_GRADIENT,
        borderColor: "rgba(255,200,160,0.25)",
        boxShadow:
          "0 4px 12px rgba(234,88,12,0.04), 0 16px 40px rgba(234,88,12,0.06)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          top: -60,
          right: -40,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,88,12,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative grid gap-5 p-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-8 lg:p-7">
        <div className="min-w-0 max-w-[60ch]">
          <p
            className="text-[11.5px] font-semibold uppercase"
            style={{ color: "rgba(28,25,23,0.48)", letterSpacing: "0.12em" }}
          >
            {getGreeting()}
          </p>
          <h1
            className="mt-1.5 text-[30px] leading-[1.08] lg:text-[36px]"
            style={{ fontFamily: DT.serif, letterSpacing: "-0.03em", color: DT.text }}
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
            className="mt-2 text-[14px] leading-relaxed"
            style={{ color: "rgba(28,25,23,0.68)", letterSpacing: "-0.01em" }}
          >
            {case6Mode
              ? "Profile strength is low for your current target roles. Core skills and competencies need improvement."
              : "You're building momentum, every step forward gets you closer to the right role."}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: <Target className="h-3.5 w-3.5" strokeWidth={2.2} color={DT.accent} />, value: "4", label: "Growth plans" },
              { icon: <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} color="#D97706" />, value: "14", label: "Growing matches" },
              { icon: <Star className="h-3.5 w-3.5" strokeWidth={2.2} color="#059669" />, value: "3", label: "Strengths found" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 rounded-[14px] border px-3 py-3"
                style={{ borderColor: "rgba(255,200,160,0.35)", background: "rgba(255,255,255,0.55)" }}
              >
                <div className="flex items-center gap-1.5">
                  {s.icon}
                  <span
                    className="tabular-nums"
                    style={{
                      fontFamily: DT.serif,
                      fontSize: 24,
                      lineHeight: 1,
                      color: DT.text,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {s.value}
                  </span>
                </div>
                <span className="text-[11px] font-medium" style={{ color: DT.textMuted }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile strength meter */}
        <div
          className="flex flex-col gap-3 rounded-[18px] border p-5"
          style={{ borderColor: "rgba(255,200,160,0.25)", background: "rgba(255,255,255,0.58)" }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] font-semibold uppercase" style={{ color: "rgba(28,25,23,0.5)", letterSpacing: "0.12em" }}>
              Profile strength
            </span>
            <span
              className="tabular-nums"
              style={{
                fontFamily: DT.serif,
                fontSize: 40,
                lineHeight: 1,
                color: DT.accent,
                letterSpacing: "-0.035em",
              }}
            >
              {profileStrength}%
            </span>
          </div>
          <div className="relative h-[8px] overflow-hidden rounded-full" style={{ background: "rgba(28,25,23,0.06)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profileStrength}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
              className="h-full rounded-full"
              style={{ background: DT.accentGradient }}
            />
          </div>
          <p className="text-[12.5px]" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
            {case6Mode
              ? "Follow the growth plan below to improve your fit."
              : "Complete the steps below to unlock better matches."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function BelowAveragePanel({ onReviewJobs }: { onReviewJobs: () => void }) {
  const PLAN_ICONS: Record<GrowthStep["iconType"], React.ReactNode> = {
    video: <Video className="h-4 w-4" color={DT.accent} strokeWidth={2} />,
    layers: <Layers className="h-4 w-4" color={DT.accent} strokeWidth={2} />,
    file: <FileText className="h-4 w-4" color={DT.accent} strokeWidth={2} />,
    mic: <Mic className="h-4 w-4" color={DT.accent} strokeWidth={2} />,
  };

  const STRENGTH_ICON: Record<(typeof LOW_STRENGTHS)[number]["icon"], React.ReactNode> = {
    users: <Users className="h-4 w-4" color="#059669" strokeWidth={2} />,
    trend: <TrendingUp className="h-4 w-4" color="#6366F1" strokeWidth={2} />,
    chat: <MessageCircle className="h-4 w-4" color="#D97706" strokeWidth={2} />,
  };

  return (
    <>
      {/* Growth plan + Where to focus */}
      <motion.section
        variants={desktopHubStagger.item}
        className="grid gap-4 lg:grid-cols-2"
      >
        <div
          className="flex flex-col overflow-hidden rounded-[22px] border"
          style={{ borderColor: DT.border, background: DT.surface, boxShadow: DT.shadow }}
        >
          <div className="px-6 pt-6 lg:px-7 lg:pt-7">
            <div className="flex items-center gap-2">
              <Wand className="h-4 w-4" color={DT.accent} strokeWidth={2} />
              <span
                className="text-[11px] font-bold uppercase"
                style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
              >
                Your growth plan
              </span>
            </div>
            <h3
              className="mt-2 text-[20px]"
              style={{ fontFamily: DT.serif, color: DT.text, letterSpacing: "-0.02em" }}
            >
              Small steps, big impact
            </h3>
          </div>

          <ul className="mt-4 divide-y px-2 pb-4 lg:px-3" style={{ borderColor: DT.border }}>
            {GROWTH_PLAN_STEPS.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.22 + i * 0.05, ease: EASE }}
                className="flex items-start gap-3 px-4 py-4"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]"
                  style={{ background: DT.accentSoft }}
                >
                  {PLAN_ICONS[step.iconType]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-[14px] font-semibold"
                      style={{ color: DT.text, letterSpacing: "-0.01em" }}
                    >
                      {step.title}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase"
                      style={{
                        color: step.impactColor,
                        background: `${step.impactColor}14`,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {step.impact}
                    </span>
                  </div>
                  <p
                    className="mt-1 text-[12.5px] leading-[1.55]"
                    style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <div
          className="flex flex-col overflow-hidden rounded-[22px] border"
          style={{ borderColor: DT.border, background: DT.surface, boxShadow: DT.shadow }}
        >
          <div className="px-6 pt-6 lg:px-7 lg:pt-7">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" color={DT.accent} strokeWidth={2} />
              <span
                className="text-[11px] font-bold uppercase"
                style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
              >
                Where to focus
              </span>
            </div>
            <h3
              className="mt-2 text-[20px]"
              style={{ fontFamily: DT.serif, color: DT.text, letterSpacing: "-0.02em" }}
            >
              These areas will have the biggest impact
            </h3>
          </div>

          <ul className="mt-4 flex flex-col gap-0 divide-y px-2 pb-2 lg:px-3" style={{ borderColor: DT.border }}>
            {LOW_IMPROVEMENT_AREAS.map((area, i) => (
              <motion.li
                key={area.area}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.28 + i * 0.05, ease: EASE }}
                className="flex flex-col gap-2 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[13.5px] font-semibold"
                    style={{ color: DT.text, letterSpacing: "-0.01em" }}
                  >
                    {area.area}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[12px] tabular-nums"
                    style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
                  >
                    {area.current}%
                    <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
                    <span style={{ color: area.color, fontWeight: 700 }}>{area.target}%</span>
                  </span>
                </div>
                <div className="relative h-[6px] overflow-hidden rounded-full" style={{ background: "rgba(28,25,23,0.05)" }}>
                  <span
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      width: `${area.target}%`,
                      background: `${area.color}12`,
                    }}
                  />
                  <motion.span
                    initial={{ width: 0 }}
                    animate={{ width: `${area.current}%` }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: EASE }}
                    className="relative block h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${area.color}88, ${area.color})`,
                    }}
                  />
                </div>
                <p className="text-[12.5px] leading-[1.55]" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
                  <ArrowUpRight
                    className="mr-1 inline-block h-3 w-3 align-middle"
                    color={area.color}
                    strokeWidth={2.5}
                  />
                  {area.advice}
                </p>
              </motion.li>
            ))}
          </ul>

          <div
            className="mt-auto flex items-center gap-2 border-t px-6 py-4 lg:px-7"
            style={{ borderColor: DT.border, background: "rgba(234,88,12,0.03)" }}
          >
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px]"
              style={{ background: DT.accentSoft }}
            >
              <Sparkles className="h-3.5 w-3.5" color={DT.accent} strokeWidth={2.2} />
            </div>
            <span className="text-[12px] leading-[1.5]" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
              Focus on <strong style={{ color: DT.text, fontWeight: 700 }}>one area at a time</strong>. Small, consistent
              improvements compound fast.
            </span>
          </div>
        </div>
      </motion.section>

      {/* Strengths + Roles to grow into */}
      <motion.section variants={desktopHubStagger.item} className="flex flex-col gap-4">
        <div
          className="flex flex-col overflow-hidden rounded-[22px] border"
          style={{ borderColor: DT.border, background: DT.surface, boxShadow: DT.shadow }}
        >
          <div className="px-6 pt-6 lg:px-7 lg:pt-7">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" color="#059669" strokeWidth={2} />
              <span
                className="text-[11px] font-bold uppercase"
                style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
              >
                What Zappy sees in you
              </span>
            </div>
            <h3
              className="mt-2 text-[20px]"
              style={{ fontFamily: DT.serif, color: DT.text, letterSpacing: "-0.02em" }}
            >
              Every candidate has unique strengths
            </h3>
          </div>

          <ul className="mt-4 flex flex-col divide-y px-2 pb-2 lg:px-3" style={{ borderColor: DT.border }}>
            {LOW_STRENGTHS.map((s, i) => (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.3 + i * 0.05, ease: EASE }}
                className="flex flex-col gap-1 px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                    style={{ background: `${s.color}14` }}
                  >
                    {STRENGTH_ICON[s.icon]}
                  </div>
                  <span
                    className="flex-1 text-[14px] font-semibold leading-snug"
                    style={{ color: DT.text, letterSpacing: "-0.01em" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="text-[12px] font-semibold leading-snug"
                    style={{ color: s.color, letterSpacing: "-0.01em" }}
                  >
                    Top {100 - s.percentile}%
                  </span>
                </div>
                <p className="pl-12 text-[12.5px] leading-[1.45]" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
                  {s.detail}
                </p>
              </motion.li>
            ))}
          </ul>

          <div
            className="mt-auto flex items-center gap-2 border-t px-6 py-4 lg:px-7"
            style={{ borderColor: DT.border, background: "rgba(5,150,105,0.04)" }}
          >
            <Sparkles className="h-3.5 w-3.5" color="#059669" strokeWidth={2.2} />
            <span className="text-[12px] leading-[1.5]" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
              Strengths are identified from your resume, interview, and preferences — they update as you grow.
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SectionHead
            title="Roles to grow into"
            subtitle="Matches improve as your profile grows."
            action="See all"
            onAction={onReviewJobs}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOW_PERF_JOBS.map((j, i) => (
              <LowPerfJobCard key={j.id} job={j} index={i} onOpen={onReviewJobs} />
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}

function LowPerfJobCard({
  job,
  index,
  onOpen,
}: {
  job: (typeof LOW_PERF_JOBS)[number];
  index: number;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 + index * 0.05, ease: EASE }}
      className="group relative flex w-full flex-col items-stretch rounded-[18px] border p-4 text-left transition-shadow hover:shadow-lg"
      style={{
        borderColor: DT.border,
        background: DT.surface,
        boxShadow: DT.shadow,
      }}
    >
      <span
        className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold"
        style={{ background: "rgba(217,119,6,0.1)", color: "#D97706", letterSpacing: "-0.01em" }}
      >
        <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
        {job.matchScore}%
      </span>
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] text-[13px] font-bold"
          style={{ background: job.logoBg, color: job.logoColor }}
        >
          {job.logoLetter}
        </div>
        <div className="min-w-0 pr-16">
          <div
            className="truncate text-[14px] font-semibold"
            style={{ color: DT.text, letterSpacing: "-0.02em" }}
          >
            {job.title}
          </div>
          <div
            className="mt-0.5 flex items-center gap-1.5 truncate text-[12px]"
            style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
          >
            <span className="truncate">{job.company}</span>
            <span className="inline-block h-1 w-1 rounded-full" style={{ background: DT.textSubtle }} />
            <span>{job.postedAgo}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {[
          { icon: <MapPin className="h-3 w-3" strokeWidth={2} />, text: job.location },
          { text: job.locationType },
          { text: job.salary },
        ].map((chip, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-medium"
            style={{ background: "rgba(28,25,23,0.04)", color: DT.textMuted, letterSpacing: "-0.01em" }}
          >
            {chip.icon}
            {chip.text}
          </span>
        ))}
      </div>

      <div
        className="mt-3 rounded-[12px] border p-3"
        style={{
          background: WHY_MATCH_GRADIENT,
          borderColor: "rgba(234,88,12,0.14)",
        }}
      >
        <div
          className="mb-1 inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase"
          style={{ color: "#E85A22", letterSpacing: "0.06em" }}
        >
          <Sparkles className="h-3 w-3" strokeWidth={2} fill="#EA580C" color="#EA580C" />
          Potential fit
        </div>
        <p
          className="text-[12px] leading-[1.55]"
          style={{ color: "rgba(28,25,23,0.72)", letterSpacing: "-0.01em" }}
        >
          {job.context}
        </p>
      </div>

      <div
        className="mt-4 flex items-center justify-between text-[12.5px] font-semibold"
        style={{ color: DT.accent, letterSpacing: "-0.01em" }}
      >
        <span className="inline-flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          Review job
        </span>
        <ArrowUpRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Cases 5 & 7 — Retake / paid retake tips panel
   ──────────────────────────────────────────────────────────────────────── */
function RetakeTipsPanel({
  onStartInterview,
  paid,
}: {
  onStartInterview: () => void;
  paid: boolean;
}) {
  return (
    <motion.section
      variants={desktopHubStagger.item}
      className="overflow-hidden rounded-[22px] border"
      style={{
        borderColor: "rgba(234,88,12,0.14)",
        background:
          "linear-gradient(165deg, rgba(255,255,255,0.98) 0%, rgba(255,249,244,0.94) 100%)",
        boxShadow: DT.shadow,
      }}
    >
      <div className="flex items-center gap-3 border-b px-6 py-4 lg:px-7" style={{ borderColor: "rgba(234,88,12,0.12)", background: "linear-gradient(90deg, rgba(234,88,12,0.08) 0%, rgba(255,255,255,0) 85%)" }}>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[11px] border"
          style={{ borderColor: "rgba(234,88,12,0.2)", background: "rgba(234,88,12,0.12)" }}
        >
          <Mic className="h-4 w-4" color={DT.accent} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-bold" style={{ color: DT.text, letterSpacing: "-0.01em" }}>
            Quick prep for a stronger retake
          </div>
          <div className="mt-0.5 text-[12.5px]" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
            Under a minute of prep significantly improves call quality.
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-6 lg:grid-cols-2 lg:p-7">
        {RETAKE_TIPS.map((tip, i) => (
          <div
            key={tip}
            className="flex items-start gap-3 rounded-[14px] border px-4 py-3"
            style={{
              borderColor: DT.borderStrong,
              background: "rgba(255,255,255,0.72)",
            }}
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
              style={{ background: DT.accentSoft, color: DT.accent }}
            >
              {i + 1}
            </span>
            <span
              className="text-[13px] leading-[1.5]"
              style={{ color: "rgba(28, 25, 23, 0.82)", letterSpacing: "-0.01em" }}
            >
              {tip}
            </span>
          </div>
        ))}
      </div>

      {!paid ? (
        <div
          className="flex flex-col items-end gap-3 border-t px-6 py-5 lg:flex-row lg:items-center lg:justify-end lg:px-7"
          style={{ borderColor: DT.border }}
        >
          <CtaButton
            variant="secondary"
            fullWidth={false}
            className="h-[40px] w-[263px] py-0"
            onClick={onStartInterview}
            icon={<Mic className="h-4 w-4" strokeWidth={2.2} />}
          >
            Retake ZappyFind call
          </CtaButton>
        </div>
      ) : null}
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Case 8 — Locked standing teaser (unlock via voice interview)
   ──────────────────────────────────────────────────────────────────────── */
function LockedInsightTeaser({ onStartInterview }: { onStartInterview: () => void }) {
  return (
    <motion.section
      variants={desktopHubStagger.item}
      className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
    >
      <div
        className="relative flex flex-col overflow-hidden rounded-[22px] border text-white"
        style={{
          background: "linear-gradient(135deg, #1A1613 0%, #2D2926 60%, #3D3530 100%)",
          borderColor: DT.border,
          boxShadow: DT.shadow,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -40,
            right: -30,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(234,88,12,0.12)",
          }}
        />
        <div className="relative flex flex-col gap-3 p-6 lg:p-7">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-[10px]"
              style={{ background: "rgba(234,88,12,0.18)" }}
            >
              <Trophy className="h-4 w-4" color="#EA580C" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-bold uppercase" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em" }}>
              Your standing
            </span>
          </div>
          <div
            className="flex items-center gap-3"
            style={{ fontFamily: DT.serif, letterSpacing: "-0.03em" }}
          >
            <span className="text-[48px] leading-none" style={{ color: "#EA580C" }}>
              ?
            </span>
            <span className="text-[18px] leading-tight" style={{ color: "rgba(255,255,255,0.8)" }}>
              Locked
            </span>
          </div>
          <p className="max-w-[52ch] text-[13.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "-0.01em" }}>
            Start the voice interview to see where you stand among <strong style={{ color: "rgba(255,255,255,0.92)", fontWeight: 700 }}>2,340 Product Designers</strong> on ZappyFind — plus unlock full match insights and recruiter introductions.
          </p>
          <div
            className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
            style={{
              background: "rgba(234,88,12,0.15)",
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.01em",
            }}
          >
            <Flame className="h-3 w-3" color="#EA580C" strokeWidth={2} />
            ~10 minutes · fully private
          </div>
          <button
            type="button"
            onClick={onStartInterview}
            className="mt-3 inline-flex w-fit items-center gap-2 rounded-[10px] px-4 py-2.5 text-[13px] font-semibold text-white"
            style={{
              background: DT.accentGradient,
              boxShadow: "0 6px 18px rgba(234,88,12,0.28)",
              letterSpacing: "-0.01em",
            }}
          >
            <Mic className="h-4 w-4" strokeWidth={2.2} />
            Start voice interview
          </button>
        </div>
      </div>

      <div
        className="flex flex-col overflow-hidden rounded-[22px] border"
        style={{ borderColor: DT.border, background: DT.surface, boxShadow: DT.shadow }}
      >
        <div className="px-6 pt-6 lg:px-7 lg:pt-7">
          <span className="text-[11px] font-bold uppercase" style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}>
            What you'll unlock
          </span>
          <h3 className="mt-2 text-[20px]" style={{ fontFamily: DT.serif, color: DT.text, letterSpacing: "-0.02em" }}>
            Breakdown by dimension
          </h3>
        </div>
        <ul className="mt-4 flex flex-col gap-0 divide-y px-2 pb-4 lg:px-3" style={{ borderColor: DT.border }}>
          {COMPETITIVE_EDGE_ITEMS.map((item) => {
            const topPercent = 100 - item.percentile;
            const Icon =
              item.icon === "message"
                ? MessageCircle
                : item.icon === "layers"
                  ? Layers
                  : Target;
            return (
              <li key={item.dimension} className="flex items-center gap-3 px-4 py-4">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ background: `${item.color}14` }}
                >
                  <Icon className="h-4 w-4" color={item.color} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[13.5px] font-semibold"
                    style={{ color: DT.text, letterSpacing: "-0.01em", filter: "blur(4px)", userSelect: "none" }}
                  >
                    Top {topPercent}% · {item.dimension}
                  </div>
                  <div
                    className="mt-0.5 text-[12px]"
                    style={{ color: DT.textMuted, letterSpacing: "-0.01em", filter: "blur(4px)", userSelect: "none" }}
                  >
                    {item.tip}
                  </div>
                </div>
                <Lock className="h-3.5 w-3.5 shrink-0" color={DT.textSubtle} strokeWidth={2.2} />
              </li>
            );
          })}
        </ul>
      </div>
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Base dashboard — Competitive edge + skills (for Case 2 parity with mobile)
   ──────────────────────────────────────────────────────────────────────── */
function CompetitiveEdgePanel() {
  return (
    <motion.section
      variants={desktopHubStagger.item}
      className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
    >
      <div
        className="relative flex flex-col overflow-hidden rounded-[22px] border text-white"
        style={{
          background: "linear-gradient(135deg, #1A1613 0%, #2D2926 60%, #3D3530 100%)",
          borderColor: DT.border,
          boxShadow: DT.shadow,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -40,
            right: -30,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(234,88,12,0.1)",
          }}
        />
        <div className="relative grid gap-5 p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-7 lg:p-7">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-[10px]"
                style={{ background: "rgba(234,88,12,0.15)" }}
              >
                <Trophy className="h-4 w-4" color="#EA580C" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-bold uppercase" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em" }}>
                Your standing
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                style={{
                  fontFamily: DT.serif,
                  fontSize: 56,
                  lineHeight: 1,
                  color: "#EA580C",
                  letterSpacing: "-0.03em",
                }}
              >
                Top 12%
              </span>
            </div>
            <p className="max-w-[48ch] text-[13.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)", letterSpacing: "-0.01em" }}>
              among <strong style={{ color: "rgba(255,255,255,0.95)", fontWeight: 700 }}>2,340 Product Designers</strong> on ZappyFind.
            </p>
            <div
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold"
              style={{ background: "rgba(234,88,12,0.12)", color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}
            >
              <Flame className="h-3 w-3" color="#EA580C" strokeWidth={2} />
              You're ahead of 2,060 candidates
            </div>
          </div>

          <ul className="flex flex-col gap-3">
            {COMPETITIVE_EDGE_ITEMS.map((item) => {
              const topPercent = 100 - item.percentile;
              const Icon =
                item.icon === "message"
                  ? MessageCircle
                  : item.icon === "layers"
                    ? Layers
                    : Target;
              return (
                <li
                  key={item.dimension}
                  className="flex items-center gap-3 rounded-[14px] border px-3 py-3"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                    style={{ background: `${item.color}22` }}
                  >
                    <Icon className="h-4 w-4" color={item.color} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="flex items-center justify-between gap-2 text-[13.5px] font-semibold"
                      style={{ color: "rgba(255,255,255,0.9)", letterSpacing: "-0.01em" }}
                    >
                      <span>{item.dimension}</span>
                      <span className="tabular-nums" style={{ color: item.color }}>
                        Top {topPercent}%
                      </span>
                    </div>
                    <div
                      className="mt-0.5 text-[12px]"
                      style={{ color: "rgba(255,255,255,0.55)", letterSpacing: "-0.01em" }}
                    >
                      {item.tip}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <SkillsMarketPanel />
    </motion.section>
  );
}

const SKILLS_DESKTOP: { name: string; demand: "high" | "medium" | "growing" }[] = [
  { name: "React", demand: "high" },
  { name: "Figma", demand: "high" },
  { name: "TypeScript", demand: "high" },
  { name: "User Research", demand: "high" },
  { name: "Design Systems", demand: "medium" },
  { name: "Prototyping", demand: "medium" },
  { name: "SQL", demand: "medium" },
  { name: "AI/ML Design", demand: "growing" },
];

const DEMAND_COLOR: Record<"high" | "medium" | "growing", { label: string; color: string; bg: string }> = {
  high: { label: "High demand", color: "#059669", bg: "rgba(5,150,105,0.08)" },
  medium: { label: "Moderate", color: "#D97706", bg: "rgba(217,119,6,0.08)" },
  growing: { label: "Growing", color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
};

function SkillsMarketPanel() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-[22px] border"
      style={{ borderColor: DT.border, background: DT.surface, boxShadow: DT.shadow }}
    >
      <div className="px-6 pt-6 lg:px-7 lg:pt-7">
        <span className="text-[11px] font-bold uppercase" style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}>
          Skills × market demand
        </span>
        <h3 className="mt-2 text-[20px]" style={{ fontFamily: DT.serif, color: DT.text, letterSpacing: "-0.02em" }}>
          What recruiters are searching for
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 px-6 pb-4 pt-4 lg:px-7">
        {SKILLS_DESKTOP.map((s) => {
          const theme = DEMAND_COLOR[s.demand];
          return (
            <span
              key={s.name}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold"
              style={{
                background: theme.bg,
                color: theme.color,
                letterSpacing: "-0.01em",
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: theme.color }} />
              {s.name}
            </span>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t px-6 py-4 lg:px-7" style={{ borderColor: DT.border }}>
        {(["high", "medium", "growing"] as const).map((level) => (
          <div key={level} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: DEMAND_COLOR[level].color }}
            />
            <span className="text-[11.5px]" style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}>
              {DEMAND_COLOR[level].label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* A tiny wand icon fallback — Lucide's Wand2 renders well but we alias to a local for growth section. */
function Wand({ className = "", color, strokeWidth = 2 }: { className?: string; color?: string; strokeWidth?: number }) {
  return (
    <Sparkles className={className} color={color} strokeWidth={strokeWidth} />
  );
}
