import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Bookmark,
  Briefcase,
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
import { DT } from "./desktop-tokens";

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
    <div className="flex min-h-0 flex-1" style={{ fontFamily: DT.sans }}>
      {/* List pane */}
      <div
        className="flex w-[min(380px,38vw)] shrink-0 flex-col border-r"
        style={{ borderColor: DT.border, background: DT.surfaceMuted }}
      >
        <div
          className="border-b px-4 py-3.5"
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
            <span className="text-[13.5px] font-semibold tracking-[-0.01em]" style={{ color: DT.text }}>
              Job workspace
            </span>
          </div>
          <div
            className="grid grid-cols-3 gap-1.5 rounded-lg border p-1"
            style={{
              background: "rgba(255,255,255,0.75)",
              borderColor: "rgba(28,25,23,0.08)",
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
                  className="flex min-w-0 items-center justify-center gap-1 rounded-md px-2 py-1.5 transition-colors"
                  style={{
                    background: active ? DT.surface : "transparent",
                    color: active ? DT.text : DT.textMuted,
                    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  <TabIcon
                    className="h-2.5 w-2.5 shrink-0"
                    strokeWidth={active ? 2.25 : 2}
                    style={{ color: active ? DT.accent : DT.textMuted }}
                  />
                  <span className="truncate text-[9.5px] font-semibold leading-tight">{label}</span>
                  {count != null && count > 0 ? (
                    <span
                      className="tabular-nums text-[9px] font-bold"
                      style={{ color: DT.textSubtle }}
                    >
                      {count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {listJobs.length === 0 ? (
            <div className="p-6 text-center text-[13px]" style={{ color: DT.textMuted }}>
              {tab === "saved"
                ? "No saved jobs yet. Tap the bookmark on a role in Recommended to save it."
                : tab === "applied"
                  ? "No applied jobs yet. Use Apply or Mark interested on a role to track it here."
                  : "No roles in this list."}
            </div>
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
      </div>

      {/* Detail pane */}
      <div className="min-w-0 flex-1 overflow-y-auto" style={{ background: DT.pageBg }}>
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
          ) : (
            <div
              className="flex min-h-[280px] flex-1 items-center justify-center px-8 py-12 text-center text-[14px]"
              style={{ color: DT.textMuted }}
            >
              Select a job from the list, or switch tabs to browse Recommended, Applied, or Saved.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
          <div className="mt-1 flex items-center gap-1.5 text-[10.5px]" style={{ color: DT.textSubtle }}>
            <span
              className="truncate rounded-full px-1.5 py-[1px]"
              style={{ background: "rgba(28,25,23,0.05)", maxWidth: "100%" }}
              title={job.salary}
            >
              {job.salary.replace(/^est\.\s*/i, "")}
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
  }, [job.id]);

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
                onClick={onMarkApplied}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-white"
                style={{ background: DT.accentGradient }}
              >
                Apply
                <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ) : (
              <button
                type="button"
                onClick={onMarkApplied}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-white"
                style={{ background: DT.accentGradient }}
              >
                Quick apply
                <Send className="h-4 w-4" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>

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
          <MetaTile icon={IndianRupee} label="Compensation" value={compensationRange} highlight />
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
  highlight,
}: {
  icon: ComponentType<{ className?: string; style?: object; strokeWidth?: number }>;
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="flex min-w-0 items-center gap-3 px-4 py-3"
      style={{ background: DT.surface }}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: highlight ? "rgba(234,88,12,0.1)" : "rgba(28,25,23,0.05)",
          color: highlight ? DT.accent : DT.textMuted,
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
          style={{ color: highlight ? DT.text : DT.text }}
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
