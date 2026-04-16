import { motion } from "motion/react";
import {
  ArrowUpRight,
  Bookmark,
  Flame,
  Mic,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import type { FullProfile } from "../components/WelcomeScreen";
import { DT } from "./desktop-tokens";

const ROW_JOBS = [
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
    tags: ["Design Systems", "B2B SaaS"],
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
    tags: ["Consumer", "Mobile-first"],
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
    tags: ["Fintech", "Leadership"],
  },
];

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
  const roleHint =
    profile?.headline?.trim().slice(0, 48) ||
    (profile?.preferences?.categories?.length ? "Your selected fields" : null) ||
    "your target roles";

  return (
    <div className="p-6 lg:p-8" style={{ fontFamily: DT.sans }}>
      <div className="mb-8">
        <p className="text-[13px] font-medium" style={{ color: DT.textMuted }}>
          {getGreeting()},
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight" style={{ color: DT.text }}>
          {name}, here&apos;s your market snapshot
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed" style={{ color: DT.textMuted }}>
          Dense view: scan matches, compare at a glance, and jump into your interview or saved list—built
          for desktop workflows.
        </p>
      </div>

      {/* KPI strip */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Active fit jobs", value: "42", delta: "+6 this week", icon: Target },
          { label: "New for you", value: "28", delta: "Updated daily", icon: Sparkles },
          { label: "Saved", value: "8", delta: "Shortlisted", icon: Bookmark },
          { label: "Profile views", value: "14", delta: "Recruiters", icon: TrendingUp },
        ].map((k) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border p-4"
            style={{ borderColor: DT.border, background: DT.surface, boxShadow: DT.shadow }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wide" style={{ color: DT.textSubtle }}>
                  {k.label}
                </div>
                <div className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{k.value}</div>
                <div className="mt-0.5 text-[12px]" style={{ color: DT.textMuted }}>
                  {k.delta}
                </div>
              </div>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ background: DT.accentSoft }}
              >
                <k.icon className="h-4 w-4" style={{ color: DT.accent }} strokeWidth={1.75} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main: job table */}
        <div className="min-w-0 xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-[15px] font-semibold tracking-tight">Top matches</h3>
              <p className="text-[13px]" style={{ color: DT.textMuted }}>
                Sorted by fit score · {roleHint}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Remote", "High match"].map((f, i) => (
                <button
                  key={f}
                  type="button"
                  className="rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors"
                  style={{
                    borderColor: i === 0 ? DT.accent : DT.border,
                    background: i === 0 ? DT.accentSoft : DT.surface,
                    color: i === 0 ? DT.accent : DT.textMuted,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: DT.border, background: DT.surface, boxShadow: DT.shadow }}
          >
            <div
              className="grid grid-cols-[1fr_100px_120px_88px] gap-2 border-b px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide"
              style={{ borderColor: DT.border, color: DT.textSubtle }}
            >
              <span>Role / Company</span>
              <span className="text-right">Match</span>
              <span>Location</span>
              <span className="text-right">Comp</span>
            </div>
            <div className="divide-y" style={{ borderColor: DT.border }}>
              {ROW_JOBS.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={onReviewJobs}
                  className="grid w-full grid-cols-[1fr_100px_120px_88px] gap-2 px-4 py-3 text-left transition-colors hover:bg-stone-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[13px] font-bold"
                      style={{ background: job.logoBg, color: job.logoColor }}
                    >
                      {job.logoLetter}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold" style={{ color: DT.text }}>
                        {job.title}
                      </div>
                      <div className="truncate text-[12px]" style={{ color: DT.textMuted }}>
                        {job.company} · {job.postedAgo}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <span
                      className="rounded-full px-2 py-0.5 text-[12px] font-semibold tabular-nums"
                      style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
                    >
                      {job.matchScore}%
                    </span>
                  </div>
                  <div className="flex flex-col justify-center text-[12px]" style={{ color: DT.textMuted }}>
                    <span>{job.location}</span>
                    <span className="text-[11px]">{job.locationType}</span>
                  </div>
                  <div className="flex items-center justify-end text-[12px] font-medium tabular-nums" style={{ color: DT.text }}>
                    {job.salary}
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onReviewJobs}
              className="flex w-full items-center justify-center gap-2 border-t px-4 py-3 text-[13px] font-semibold transition-colors hover:bg-stone-50"
              style={{ borderColor: DT.border, color: DT.accent }}
            >
              Open job workspace
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl border p-5"
            style={{ borderColor: DT.border, background: DT.surface, boxShadow: DT.shadow }}
          >
            <div className="mb-3 flex items-center gap-2">
              <Flame className="h-4 w-4" style={{ color: DT.accent }} strokeWidth={1.75} />
              <span className="text-[14px] font-semibold">Interview boost</span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: DT.textMuted }}>
              {hasCompletedInterview
                ? "Your voice interview is on file—recruiters see stronger signals on communication and confidence."
                : "Complete a short voice session so matches and recruiters get a fuller picture of how you communicate."}
            </p>
            <button
              type="button"
              onClick={onStartInterview}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold text-white"
              style={{ background: DT.accentGradient }}
            >
              <Mic className="h-4 w-4" strokeWidth={1.75} />
              {hasCompletedInterview ? "Redo practice call" : "Start voice interview"}
            </button>
          </div>

          <div
            className="rounded-xl border p-5"
            style={{ borderColor: DT.border, background: DT.surfaceMuted }}
          >
            <div className="mb-2 text-[13px] font-semibold">Saved shortlist</div>
            <p className="text-[12px] leading-relaxed" style={{ color: DT.textMuted }}>
              Compare notes side-by-side in the job workspace—open your saved list anytime.
            </p>
            <button
              type="button"
              onClick={onViewSavedJobs}
              className="mt-3 text-[13px] font-semibold"
              style={{ color: DT.accent }}
            >
              View saved jobs →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
