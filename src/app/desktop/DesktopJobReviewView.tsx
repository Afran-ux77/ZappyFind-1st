import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Bookmark,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  IndianRupee,
  MapPin,
  Send,
  Sparkles,
  Target,
} from "lucide-react";
import type { Job } from "../components/JobReviewScreen";
import {
  JOBS,
  REQUIRED_SKILLS_BY_JOB,
  inferDepartmentFromTitle,
} from "../components/JobReviewScreen";
import { DT, desktopHubStagger } from "./desktop-tokens";

/** Minimal empty-state art (inline SVG, no external assets). */
function IllustrationSavedCompact({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx="36" cy="36" r="28" stroke="rgba(28,25,23,0.06)" strokeWidth="1" />
      <circle cx="36" cy="36" r="20" stroke="rgba(234,88,12,0.15)" strokeWidth="1.25" strokeDasharray="3 5" />
      <rect x="22" y="26" width="28" height="22" rx="6" fill="rgba(255,255,255,0.9)" stroke="rgba(28,25,23,0.1)" />
      <path
        d="M30 32h12M30 38h8"
        stroke="rgba(28,25,23,0.12)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M44 26v8l4-2.5 4 2.5v-8a2 2 0 00-2-2h-4a2 2 0 00-2 2z"
        fill="rgba(234,88,12,0.22)"
        stroke="#EA580C"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="52" r="3" fill="rgba(234,88,12,0.45)" />
      <circle cx="36" cy="54" r="2.5" fill="rgba(28,25,23,0.1)" />
      <circle cx="44" cy="52" r="3" fill="rgba(28,25,23,0.1)" />
    </svg>
  );
}

function IllustrationAppliedCompact({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="14" y="20" width="44" height="32" rx="6" fill="rgba(255,255,255,0.95)" stroke="rgba(28,25,23,0.1)" />
      <path d="M14 28h44" stroke="rgba(28,25,23,0.07)" strokeWidth="1" />
      <path
        d="M22 36h20M22 42h14"
        stroke="rgba(28,25,23,0.1)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="40" r="14" fill="#fff" stroke="rgba(234,88,12,0.35)" strokeWidth="1.5" />
      <path
        d="M45 40l3 3 6-7"
        stroke="#EA580C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 52l6 4 14-9"
        stroke="rgba(234,88,12,0.35)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

function IllustrationSavedHero({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="8" y="24" width="184" height="96" rx="14" fill="rgba(255,255,255,0.7)" stroke="rgba(28,25,23,0.08)" />
      <rect x="24" y="42" width="72" height="56" rx="10" fill="#FAF8F5" stroke="rgba(28,25,23,0.06)" />
      <rect x="104" y="42" width="72" height="56" rx="10" fill="#FFF" stroke="rgba(234,88,12,0.2)" />
      <rect x="116" y="54" width="48" height="4" rx="2" fill="rgba(28,25,23,0.08)" />
      <rect x="116" y="64" width="36" height="4" rx="2" fill="rgba(28,25,23,0.05)" />
      <path
        d="M152 38v12l8-6 8 6V38a2.5 2.5 0 00-2.5-2.5h-11A2.5 2.5 0 00152 38z"
        fill="rgba(234,88,12,0.18)"
        stroke="#EA580C"
        strokeWidth="1.2"
      />
      <rect x="36" y="54" width="48" height="4" rx="2" fill="rgba(28,25,23,0.07)" />
      <rect x="36" y="64" width="32" height="4" rx="2" fill="rgba(28,25,23,0.05)" />
      <circle cx="44" cy="88" r="3" fill="rgba(234,88,12,0.35)" />
      <circle cx="60" cy="88" r="3" fill="rgba(28,25,23,0.08)" />
      <circle cx="76" cy="88" r="3" fill="rgba(28,25,23,0.08)" />
    </svg>
  );
}

function IllustrationAppliedHero({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="20" y="36" width="160" height="72" rx="12" fill="rgba(255,255,255,0.75)" stroke="rgba(28,25,23,0.07)" />
      <path d="M36 58h88" stroke="rgba(28,25,23,0.08)" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M36 70h64" stroke="rgba(28,25,23,0.06)" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M36 82h72" stroke="rgba(28,25,23,0.05)" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="46" cy="112" r="4" fill="rgba(234,88,12,0.2)" stroke="#EA580C" strokeWidth="1" />
      <circle cx="100" cy="112" r="4" fill="rgba(28,25,23,0.06)" />
      <circle cx="154" cy="112" r="4" fill="rgba(28,25,23,0.06)" />
      <path
        d="M118 52l36-20 12 40-28-16-20 8 8-12z"
        fill="rgba(234,88,12,0.1)"
        stroke="#EA580C"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M52 28c28-8 56 4 72 28"
        stroke="rgba(234,88,12,0.25)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Sidebar tabs for desktop job workspace (also used by App / DesktopAppRoot for deep links). */
export type JobWorkspaceTab = "recommended" | "applied" | "saved";

type DesktopJobReviewViewProps = {
  initialTab?: JobWorkspaceTab;
};

const TAB_CONFIG: {
  id: JobWorkspaceTab;
  label: string;
  icon: ComponentType<{ className?: string; style?: object; strokeWidth?: number }>;
}[] = [
  { id: "recommended", label: "Recommended", icon: Sparkles },
  { id: "applied", label: "Applied", icon: Send },
  { id: "saved", label: "Saved", icon: Bookmark },
];

export function DesktopJobReviewView({ initialTab = "recommended" }: DesktopJobReviewViewProps) {
  const [selectedId, setSelectedId] = useState(JOBS[0]?.id ?? "");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<JobWorkspaceTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const listJobs = useMemo(() => {
    if (tab === "saved") return JOBS.filter((j) => saved.has(j.id));
    if (tab === "applied") return JOBS.filter((j) => applied.has(j.id));
    return JOBS;
  }, [tab, saved, applied]);

  useEffect(() => {
    if (listJobs.length === 0) return;
    if (!listJobs.some((j) => j.id === selectedId)) setSelectedId(listJobs[0].id);
  }, [listJobs, selectedId]);

  const selected = useMemo(() => {
    const fromList = listJobs.find((j) => j.id === selectedId);
    if (fromList) return fromList;
    return listJobs[0] ?? null;
  }, [listJobs, selectedId]);

  const toggleSave = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const markApplied = (id: string) => {
    setApplied((prev) => new Set(prev).add(id));
  };

  return (
    <motion.div
      variants={desktopHubStagger.container}
      initial="hidden"
      animate="show"
      className="flex min-h-0 w-full min-w-0 flex-1"
      style={{ fontFamily: DT.sans }}
    >
      {/* List pane */}
      <motion.div
        variants={desktopHubStagger.item}
        className="flex min-h-0 w-[min(380px,38vw)] shrink-0 flex-col border-r"
        style={{ borderColor: DT.border, background: DT.surfaceMuted }}
      >
        <div
          className="border-b px-4 py-3.5 text-[12px]"
          style={{
            borderColor: DT.border,
            background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,245,243,0.92) 100%)",
            boxShadow: "inset 0 -1px 0 rgba(28,25,23,0.04)",
          }}
        >
          <div className="mb-2.5 flex items-center gap-2.5">
            <span
              className="inline-flex h-6 w-6 items-center justify-center rounded-md"
              style={{ background: "rgba(234,88,12,0.1)", color: DT.accent }}
            >
              <Briefcase className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <span className="font-semibold tracking-[-0.01em]" style={{ color: DT.text }}>
              Job workspace
            </span>
          </div>
          <div
            className="grid grid-cols-3 gap-1 rounded-lg p-0.5"
            style={{
              background: "linear-gradient(180deg, rgba(246,244,241,0.98) 0%, rgba(235,231,226,0.96) 100%)",
              border: "1px solid rgba(110,100,92,0.08)",
            }}
          >
            {TAB_CONFIG.map(({ id, label, icon: TabIcon }) => {
              const count =
                id === "saved" ? saved.size : id === "applied" ? applied.size : undefined;
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className="relative flex items-center justify-center rounded-md px-1.5 py-1.5 transition-colors"
                  style={{
                    color: active ? DT.text : DT.textMuted,
                  }}
                >
                  {active ? (
                    <motion.div
                      layoutId="desktopJobWorkspaceTabPill"
                      className="pointer-events-none absolute inset-0 rounded-md"
                      style={{
                        background: DT.surface,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 34, mass: 0.85 }}
                    />
                  ) : null}
                  <span className="relative z-10 flex min-w-0 items-center justify-center gap-2">
                    <TabIcon
                      className="h-2.5 w-2.5 shrink-0"
                      strokeWidth={active ? 2.25 : 2}
                      style={{ color: active ? DT.accent : DT.textMuted }}
                    />
                    <span className="truncate text-[11px] font-semibold leading-tight">{label}</span>
                    {count != null && count > 0 ? (
                      <span
                        className="tabular-nums text-[10px] font-bold"
                        style={{ color: DT.textSubtle }}
                      >
                        {count}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {listJobs.length === 0 ? (
            tab === "saved" || tab === "applied" ? (
              <JobWorkspaceListEmpty tab={tab} onBrowseRecommended={() => setTab("recommended")} />
            ) : (
              <div
                className="flex flex-1 flex-col items-center justify-center p-6 text-center text-[13px]"
                style={{ color: DT.textMuted }}
              >
                No roles in this list.
              </div>
            )
          ) : (
            listJobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
                active={job.id === selectedId}
                saved={saved.has(job.id)}
                onSelect={() => setSelectedId(job.id)}
                onToggleSave={() => toggleSave(job.id)}
              />
            ))
          )}
        </div>
      </motion.div>

      {/* Detail pane */}
      <motion.div
        variants={desktopHubStagger.item}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto"
        style={{ background: DT.pageBg }}
      >
        <AnimatePresence mode="wait">
          {selected ? (
            <JobDetailPane
              key={selected.id}
              job={selected}
              isSaved={saved.has(selected.id)}
              isApplied={applied.has(selected.id)}
              onToggleSave={() => toggleSave(selected.id)}
              onMarkApplied={() => markApplied(selected.id)}
            />
          ) : listJobs.length === 0 && (tab === "saved" || tab === "applied") ? (
            <JobWorkspaceDetailEmpty tab={tab} onBrowseRecommended={() => setTab("recommended")} />
          ) : (
            <div
              className="flex min-h-[280px] flex-1 items-center justify-center px-8 py-12 text-center text-[14px]"
              style={{ color: DT.textMuted }}
            >
              Select a job from the list, or switch tabs to browse Recommended, Applied, or Saved.
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function JobWorkspaceListEmpty({
  tab,
  onBrowseRecommended,
}: {
  tab: "saved" | "applied";
  onBrowseRecommended: () => void;
}) {
  const isSaved = tab === "saved";
  const title = isSaved ? "You have not saved any jobs yet" : "You have not applied to any jobs yet";
  const description = isSaved
    ? "Pin roles from Recommended with the bookmark. They stack here."
    : "Fire off an apply or mark interest from a card. This list catches the trail.";

  return (
    <motion.div
      className="flex flex-1 flex-col items-center justify-center px-5 py-10"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="mb-4 flex h-[80px] w-[80px] items-center justify-center rounded-2xl"
        style={{
          background: "radial-gradient(circle at 35% 25%, rgba(234,88,12,0.08) 0%, transparent 45%), linear-gradient(165deg, rgba(255,255,255,0.99) 0%, rgba(250,246,241,0.92) 100%)",
          border: `1px solid ${DT.border}`,
          boxShadow: "0 8px 24px rgba(28,25,23,0.06)",
        }}
      >
        {isSaved ? (
          <IllustrationSavedCompact className="h-[56px] w-[56px]" />
        ) : (
          <IllustrationAppliedCompact className="h-[56px] w-[56px]" />
        )}
      </div>
      <h3
        className="mb-1.5 max-w-[min(300px,100%)] text-center text-[13px] font-semibold tracking-[-0.02em]"
        style={{ color: DT.text }}
      >
        {title}
      </h3>
      <p className="mb-5 max-w-[min(300px,100%)] text-center text-[12px] leading-relaxed" style={{ color: DT.textMuted }}>
        {description}
      </p>
      <button
        type="button"
        onClick={onBrowseRecommended}
        className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-opacity hover:opacity-90"
        style={{
          background: DT.accentGradient,
          color: "#fff",
          boxShadow: "0 1px 2px rgba(234,88,12,0.25), 0 4px 12px rgba(234,88,12,0.2)",
        }}
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-95" strokeWidth={2.25} />
        Browse Recommended
        <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-90" strokeWidth={2.25} />
      </button>
    </motion.div>
  );
}

function JobWorkspaceDetailEmpty({
  tab,
  onBrowseRecommended,
}: {
  tab: "saved" | "applied";
  onBrowseRecommended: () => void;
}) {
  const isSaved = tab === "saved";
  const title = isSaved ? "Curate before you commit" : "Turn intent into a paper trail";
  const description = isSaved
    ? "Think of this as your dressing room: line up offers, contrast the fine print, and cut what does not fit before you say yes."
    : "When outreach picks up, you will want dates, threads, and next steps in one glance. This canvas is ready for that story.";

  return (
    <motion.div
      className="flex w-full flex-1 flex-col items-center justify-center px-10 py-16 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: DT.pageBg,
        minHeight: "max(100%, calc(100dvh - 3.5rem))",
      }}
    >
      <div className="mx-auto mb-8 w-full max-w-[min(320px,90vw)]">
        {isSaved ? (
          <IllustrationSavedHero className="h-auto w-full" />
        ) : (
          <IllustrationAppliedHero className="h-auto w-full" />
        )}
      </div>
      <h2
        className="mx-auto mb-3 max-w-md text-center text-[17px] font-semibold leading-snug tracking-[-0.02em]"
        style={{ color: DT.text }}
      >
        {title}
      </h2>
      <p
        className="mx-auto mb-6 max-w-[420px] text-center text-[14px] leading-relaxed"
        style={{ color: DT.textMuted }}
      >
        {description}
      </p>
      <button
        type="button"
        onClick={onBrowseRecommended}
        className="text-[13px] font-medium underline underline-offset-4 transition-opacity hover:opacity-80"
        style={{ color: DT.textSubtle }}
      >
        Open Recommended
      </button>
    </motion.div>
  );
}

function JobRow({
  job,
  active,
  saved: isSaved,
  onSelect,
  onToggleSave,
}: {
  job: Job;
  active: boolean;
  saved: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
}) {
  return (
    <div
      className="border-b"
      style={{
        borderColor: DT.border,
        background: active ? "rgba(234,88,12,0.06)" : "transparent",
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-black/[0.02]"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold"
          style={{
            background: `linear-gradient(145deg, ${job.logoColor}1f 0%, ${job.logoColor}0e 55%, #ffffff 100%)`,
            color: job.logoColor,
            border: `1px solid ${job.logoColor}1a`,
          }}
        >
          {job.logoLetter}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-[13px] font-semibold tracking-[-0.01em]" style={{ color: DT.text }}>
              {job.title}
            </div>
            {job.matchScore != null ? (
              <span
                className="shrink-0 rounded-full px-1.5 py-[1px] text-[10px] font-semibold"
                style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
              >
                {job.matchScore}%
              </span>
            ) : null}
          </div>
          <div className="mt-0.5 truncate text-[11.5px]" style={{ color: DT.textMuted }}>
            {job.company}
          </div>
          <div
            className="mt-1 flex min-w-0 items-center gap-1 text-[10.5px] leading-snug"
            style={{ color: DT.textSubtle }}
            title={`${job.location} · ${job.locationType} · ${job.salary}`}
          >
            <MapPin className="h-2.5 w-2.5 shrink-0 opacity-70" strokeWidth={2} aria-hidden />
            <span className="min-w-0 truncate">
              {job.location}
              <span className="opacity-50"> · </span>
              {job.locationType}
              <span className="opacity-50"> · </span>
              <span className="tabular-nums">{job.salary}</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave();
          }}
          className="shrink-0 self-start rounded-md p-1.5"
          aria-label={isSaved ? "Remove from saved" : "Save job"}
        >
          <Bookmark
            className="h-4 w-4"
            strokeWidth={1.75}
            style={{ color: isSaved ? DT.accent : DT.textSubtle }}
            fill={isSaved ? "rgba(234,88,12,0.2)" : "none"}
          />
        </button>
      </button>
    </div>
  );
}

function JobDetailPane({
  job,
  isSaved,
  isApplied,
  onToggleSave,
  onMarkApplied,
}: {
  job: Job;
  isSaved: boolean;
  isApplied: boolean;
  onToggleSave: () => void;
  onMarkApplied: () => void;
}) {
  const requiredSkills =
    REQUIRED_SKILLS_BY_JOB[job.id] ?? ["Product Design", "User Research", "Visual Design", "Prototyping"];
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [applyDelight, setApplyDelight] = useState(false);
  const visibleSkills = showAllSkills ? requiredSkills : requiredSkills.slice(0, 6);
  const hiddenSkillsCount = Math.max(requiredSkills.length - visibleSkills.length, 0);
  const department = inferDepartmentFromTitle(job.title);
  const experienceRange =
    job.experienceYearsMax <= job.experienceYearsMin
      ? `${job.experienceYearsMin}+ yrs`
      : `${job.experienceYearsMin}–${job.experienceYearsMax} yrs`;
  const compensationRange = job.salary.replace(/^est\.\s*/i, "");

  useEffect(() => {
    setShowAllSkills(false);
    setDescriptionOpen(false);
    setApplyDelight(false);
  }, [job.id]);

  useEffect(() => {
    if (!applyDelight) return;
    const t = window.setTimeout(() => setApplyDelight(false), 4800);
    return () => window.clearTimeout(t);
  }, [applyDelight]);

  const triggerApplyTracked = () => {
    if (isApplied) return;
    onMarkApplied();
    setApplyDelight(true);
  };

  const descriptionPreview = useMemo(() => {
    const firstBreak = job.jobDescription.indexOf("\n\n");
    if (firstBreak > 0 && firstBreak < 420) return job.jobDescription.slice(0, firstBreak);
    return job.jobDescription.length > 400 ? `${job.jobDescription.slice(0, 400).trimEnd()}…` : job.jobDescription;
  }, [job.jobDescription]);

  const expandedDescription = useMemo(() => {
    if (job.jobDescription.length >= 680) return job.jobDescription;

    const segments = [
      job.jobDescription,
      `Role context: ${job.headlines}`,
      `Why this role can work for you: ${job.whyFit}`,
      job.watchOut ? `What to keep in mind: ${job.watchOut}` : null,
    ].filter(Boolean) as string[];

    return segments.join("\n\n");
  }, [job.jobDescription, job.headlines, job.whyFit, job.watchOut]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-[54rem] px-8 py-8 lg:px-10"
    >
      {/* Hero card */}
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{
          borderColor: DT.border,
          background: DT.surface,
          boxShadow: "0 10px 30px rgba(28,25,23,0.04)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-48"
          style={{
            background: `radial-gradient(60% 100% at 50% 100%, ${job.logoColor}14 0%, transparent 70%)`,
          }}
        />
        <div className="relative flex flex-wrap items-start justify-between gap-4 px-6 pt-6 pb-5">
          <div className="flex min-w-0 gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] text-[17px] font-bold"
              style={{
                background: `linear-gradient(145deg, ${job.logoColor}22 0%, ${job.logoColor}0d 55%, #ffffff 100%)`,
                color: job.logoColor,
                border: `1px solid ${job.logoColor}1a`,
              }}
            >
              {job.logoLetter}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[19px] font-semibold tracking-[-0.02em]" style={{ color: DT.text }}>
                  {job.title}
                </h1>
                {job.matchScore != null ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] font-semibold"
                    style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
                  >
                    <Target className="h-3 w-3" strokeWidth={2} />
                    {job.matchScore}% fit
                  </span>
                ) : null}
                {isApplied ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] font-semibold"
                    style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb" }}
                  >
                    <Send className="h-3 w-3" strokeWidth={2} />
                    Applied
                  </span>
                ) : null}
              </div>
              <p className="mt-0.5 text-[13.5px] font-medium" style={{ color: DT.textMuted }}>
                {job.company}
                <span className="mx-1.5 opacity-40">·</span>
                <span style={{ color: DT.textSubtle }}>{job.postedAgo}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onToggleSave}
              className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] font-semibold transition-colors"
              style={{
                borderColor: isSaved ? "rgba(234,88,12,0.35)" : DT.border,
                background: isSaved ? DT.accentSoft : DT.surface,
                color: DT.accent,
              }}
            >
              <Bookmark
                className="h-4 w-4"
                strokeWidth={1.75}
                fill={isSaved ? "rgba(234,88,12,0.25)" : "none"}
              />
              {isSaved ? "Saved" : "Save"}
            </button>
            {job.externalUrl ? (
              <a
                href={job.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={triggerApplyTracked}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-95"
                style={{ background: DT.accentGradient }}
              >
                Apply
                <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ) : (
              <button
                type="button"
                disabled={isApplied}
                onClick={triggerApplyTracked}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-white transition-opacity enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: DT.accentGradient }}
              >
                {isApplied ? "Applied" : "Quick apply"}
                <Send className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {applyDelight ? (
            <motion.div
              key="apply-delight"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.85 }}
              className="relative mx-6 mb-4 flex items-start gap-3 overflow-hidden rounded-xl border px-4 py-3.5"
              style={{
                borderColor: "rgba(16,185,129,0.28)",
                background: "linear-gradient(125deg, rgba(16,185,129,0.1) 0%, rgba(255,255,255,0.98) 55%, rgba(255,245,237,0.85) 100%)",
                boxShadow: "0 10px 36px rgba(16,185,129,0.14), 0 1px 0 rgba(255,255,255,0.8) inset",
              }}
            >
              <motion.span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(16,185,129,0.15)", color: "#059669" }}
                initial={{ scale: 0.6, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 22, delay: 0.05 }}
              >
                <CheckCircle2 className="h-5 w-5" strokeWidth={2.25} />
              </motion.span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[13px] font-semibold tracking-[-0.02em]" style={{ color: DT.text }}>
                  You are in
                </p>
                <p className="mt-0.5 text-[12.5px] leading-snug" style={{ color: DT.textMuted }}>
                  We added this role to Applied. Keep the momentum when you are ready for next steps.
                </p>
              </div>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-4 -top-6 h-16 w-16 rounded-full opacity-40 blur-2xl"
                style={{ background: "rgba(234,88,12,0.35)" }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ duration: 0.45 }}
              />
              <Sparkles
                className="absolute right-3 top-3 h-4 w-4 shrink-0 opacity-50"
                style={{ color: DT.accent }}
                strokeWidth={2}
                aria-hidden
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Meta strip */}
        <div
          className="relative grid grid-cols-2 gap-px border-t md:grid-cols-4"
          style={{
            borderColor: DT.border,
            background: "rgba(28,25,23,0.04)",
          }}
        >
          <MetaTile
            icon={MapPin}
            label="Location"
            value={`${job.location}`}
            hint={job.locationType}
          />
          <MetaTile icon={Clock} label="Experience" value={experienceRange} />
          <MetaTile icon={Briefcase} label="Department" value={department} />
          <MetaTile icon={IndianRupee} label="Compensation" value={compensationRange} />
        </div>
      </div>

      {/* Content grid */}
      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        <section
          className="rounded-2xl border p-5 lg:col-span-3"
          style={{ borderColor: DT.border, background: DT.surface }}
        >
          <SectionHeader icon={Sparkles} label="The Headlines" />
          <p className="mt-2 text-[13.5px] leading-[1.65]" style={{ color: DT.text }}>
            {job.headlines}
          </p>
        </section>
        <section
          className="rounded-2xl border p-5 lg:col-span-2"
          style={{
            borderColor: "rgba(5,150,105,0.2)",
            background:
              "linear-gradient(145deg, rgba(16,185,129,0.06) 0%, rgba(255,255,255,0.6) 100%)",
          }}
        >
          <SectionHeader icon={Target} label="Why this is a fit" accent="#059669" />
          <p className="mt-2 text-[13px] leading-[1.65]" style={{ color: DT.textMuted }}>
            {job.whyFit}
          </p>
        </section>
      </div>

      {/* Required skills */}
      <section
        className="mt-4 rounded-2xl border p-5"
        style={{ borderColor: DT.border, background: DT.surface }}
      >
        <div className="flex items-center justify-between">
          <SectionHeader icon={Sparkles} label="Required skills" />
          <span className="text-[11.5px] font-medium" style={{ color: DT.textSubtle }}>
            {requiredSkills.length} skills
          </span>
        </div>
        <motion.div layout className="mt-3 flex flex-wrap gap-2">
          <AnimatePresence initial={false}>
            {visibleSkills.map((skill) => (
              <motion.span
                key={skill}
                layout="position"
                initial={{ opacity: 0, y: 4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center rounded-full border px-3 py-[6px] text-[12px] font-medium"
                style={{
                  borderColor: "rgba(234,88,12,0.18)",
                  background: "rgba(234,88,12,0.06)",
                  color: DT.text,
                }}
              >
                {skill}
              </motion.span>
            ))}
          </AnimatePresence>
          {hiddenSkillsCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowAllSkills(true)}
              className="inline-flex items-center rounded-full border border-dashed px-3 py-[6px] text-[12px] font-semibold"
              style={{ borderColor: "rgba(28,25,23,0.18)", color: DT.accent, background: "transparent" }}
            >
              +{hiddenSkillsCount} more
            </button>
          ) : null}
          {showAllSkills && requiredSkills.length > 6 ? (
            <button
              type="button"
              onClick={() => setShowAllSkills(false)}
              className="inline-flex items-center rounded-full px-3 py-[6px] text-[12px] font-semibold"
              style={{ color: DT.textSubtle, background: "transparent" }}
            >
              Show less
            </button>
          ) : null}
        </motion.div>
      </section>

      {/* Watch outs */}
      {job.watchOut ? (
        <section
          className="mt-4 flex gap-3 rounded-2xl border p-5"
          style={{
            borderColor: "rgba(217,119,6,0.25)",
            background: "linear-gradient(145deg, rgba(253,230,138,0.18) 0%, rgba(255,255,255,0.6) 100%)",
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "rgba(217,119,6,0.14)", color: "#b45309" }}
          >
            <AlertTriangle className="h-4 w-4" strokeWidth={1.9} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: "#b45309" }}>
              Watch outs
            </div>
            <p className="mt-1 text-[13px] leading-[1.6]" style={{ color: DT.text }}>
              {job.watchOut}
            </p>
          </div>
        </section>
      ) : null}

      {/* Job description with progressive disclosure */}
      <section
        className="mt-4 rounded-2xl border"
        style={{ borderColor: DT.border, background: DT.surface }}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <SectionHeader icon={Briefcase} label="Job description" />
          <button
            type="button"
            onClick={() => setDescriptionOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[12px] font-semibold transition-colors hover:bg-black/[0.04]"
            style={{ color: DT.accent }}
            aria-expanded={descriptionOpen}
          >
            {descriptionOpen ? "Show less" : "Read full description"}
            <motion.span
              animate={{ rotate: descriptionOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
            </motion.span>
          </button>
        </div>
        <motion.div
          initial={false}
          animate={{ height: "auto" }}
          className="px-5 pb-5"
        >
          <AnimatePresence initial={false} mode="wait">
            {descriptionOpen ? (
              <motion.p
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden whitespace-pre-wrap text-[13.5px] leading-[1.7]"
                style={{ color: DT.text }}
              >
                {expandedDescription}
              </motion.p>
            ) : (
              <motion.p
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[13.5px] leading-[1.7]"
                style={{ color: DT.textMuted }}
              >
                {descriptionPreview}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

    </motion.div>
  );
}

function SectionHeader({
  icon: Icon,
  label,
  accent,
}: {
  icon: ComponentType<{ className?: string; style?: object; strokeWidth?: number }>;
  label: string;
  accent?: string;
}) {
  const color = accent ?? DT.accent;
  return (
    <div className="flex items-center gap-2">
      <span
        className="flex h-6 w-6 items-center justify-center rounded-md"
        style={{ background: `${color}14`, color }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <span
        className="text-[11.5px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: DT.textSubtle }}
      >
        {label}
      </span>
    </div>
  );
}

function MetaTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: ComponentType<{ className?: string; style?: object; strokeWidth?: number }>;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div
      className="flex min-w-0 items-center gap-3 px-4 py-3"
      style={{ background: DT.surface }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: "rgba(28,25,23,0.05)",
          color: DT.textMuted,
        }}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <div
          className="text-[10.5px] font-semibold uppercase tracking-[0.08em]"
          style={{ color: DT.textSubtle }}
        >
          {label}
        </div>
        <div
          className="text-[13px] font-semibold leading-snug"
          style={{ color: DT.text }}
          title={hint ? `${value} · ${hint}` : value}
        >
          {value}
          {hint ? (
            <span className="ml-1 font-medium" style={{ color: DT.textSubtle }}>
              · {hint}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
