import { useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bookmark,
  Briefcase,
  Check,
  ExternalLink,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import type { Job } from "../components/JobReviewScreen";
import { JOBS } from "../components/JobReviewScreen";
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
        <div className="border-b px-4 py-3" style={{ borderColor: DT.border }}>
          <div className="mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4" style={{ color: DT.textMuted }} strokeWidth={1.75} />
            <span className="text-[14px] font-semibold">Job workspace</span>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-xl p-1" style={{ background: "rgba(0,0,0,0.04)" }}>
            {TAB_CONFIG.map(({ id, label, icon: TabIcon }) => {
              const count =
                id === "saved" ? saved.size : id === "applied" ? applied.size : undefined;
              const active = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className="flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 transition-colors"
                  style={{
                    background: active ? DT.surface : "transparent",
                    color: active ? DT.text : DT.textMuted,
                    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  <TabIcon
                    className="h-3.5 w-3.5 shrink-0"
                    strokeWidth={active ? 2.25 : 2}
                    style={{ color: active ? DT.accent : DT.textMuted }}
                  />
                  <span className="w-full truncate text-center text-[10.5px] font-semibold leading-tight">
                    {label}
                  </span>
                  {count != null && count > 0 ? (
                    <span
                      className="tabular-nums text-[10px] font-bold"
                      style={{ color: DT.textSubtle }}
                    >
                      {count}
                    </span>
                  ) : (
                    <span className="h-3" aria-hidden />
                  )}
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
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.22 }}
              className="mx-auto max-w-3xl px-8 py-8 lg:px-10"
            >
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
                    style={{ background: `${selected.logoColor}18`, color: selected.logoColor }}
                  >
                    {selected.logoLetter}
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight" style={{ color: DT.text }}>
                      {selected.title}
                    </h1>
                    <p className="mt-0.5 text-[14px] font-medium" style={{ color: DT.textMuted }}>
                      {selected.company}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-3 text-[12px]" style={{ color: DT.textSubtle }}>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
                        {selected.location} · {selected.locationType}
                      </span>
                      <span>{selected.postedAgo}</span>
                      {selected.matchScore != null ? (
                        <span
                          className="rounded-full px-2 py-0.5 font-semibold"
                          style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
                        >
                          {selected.matchScore}% fit
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSave(selected.id)}
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold"
                    style={{
                      borderColor: DT.border,
                      background: saved.has(selected.id) ? DT.accentSoft : DT.surface,
                      color: DT.accent,
                    }}
                  >
                    <Bookmark className="h-4 w-4" strokeWidth={1.75} />
                    {saved.has(selected.id) ? "Saved" : "Save"}
                  </button>
                  {selected.externalUrl ? (
                    <a
                      href={selected.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => markApplied(selected.id)}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-white"
                      style={{ background: DT.accentGradient }}
                    >
                      Apply
                      <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => markApplied(selected.id)}
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-white opacity-90"
                      style={{ background: DT.accentGradient }}
                    >
                      Mark interested
                      <Check className="h-4 w-4" strokeWidth={1.75} />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <DetailCard title="Why it fits" icon={Sparkles}>
                  {selected.whyFit}
                </DetailCard>
                <DetailCard title="Watch outs" icon={Briefcase}>
                  {selected.watchOut}
                </DetailCard>
              </div>

              <div
                className="mt-4 rounded-xl border p-5"
                style={{ borderColor: DT.border, background: DT.surface }}
              >
                <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide" style={{ color: DT.textSubtle }}>
                  Snapshot
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: DT.textMuted }}>
                  {selected.headlines}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide" style={{ color: DT.textSubtle }}>
                  Role description
                </h3>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: DT.text }}>
                  {selected.jobDescription}
                </p>
              </div>
            </motion.div>
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
          style={{ background: `${job.logoColor}22`, color: job.logoColor }}
        >
          {job.logoLetter}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13px] font-semibold" style={{ color: DT.text }}>
            {job.title}
          </div>
          <div className="truncate text-[12px]" style={{ color: DT.textMuted }}>
            {job.company}
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-[11px]" style={{ color: DT.textSubtle }}>
            {job.matchScore != null ? (
              <span style={{ color: "#059669", fontWeight: 600 }}>{job.matchScore}% fit</span>
            ) : null}
            <span>{job.salary}</span>
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

function DetailCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string; style?: object; strokeWidth?: number }>;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: DT.border, background: DT.surface }}>
      <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold" style={{ color: DT.text }}>
        <Icon className="h-4 w-4" style={{ color: DT.accent }} strokeWidth={1.75} />
        {title}
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: DT.textMuted }}>
        {children}
      </p>
    </div>
  );
}
