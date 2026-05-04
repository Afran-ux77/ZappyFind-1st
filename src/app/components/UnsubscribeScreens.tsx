import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Check, CheckCircle2, ChevronLeft } from "lucide-react";
import { cn } from "./ui/utils";

const REASONS = [
  { id: "not_searching", label: "I'm not actively job searching" },
  { id: "found_job", label: "Found a job already" },
  { id: "too_frequent", label: "The emails were too frequent" },
  { id: "not_relevant", label: "The roles weren't a good fit" },
  { id: "other", label: "Other" },
] as const;

type Layout = "mobile" | "desktop";

function Shell({
  layout,
  children,
  className,
}: {
  layout: Layout;
  children: ReactNode;
  className?: string;
}) {
  const desk = layout === "desktop";
  return (
    <div
      className={cn(
        "min-h-dvh w-full bg-gradient-to-b from-stone-50 via-white to-stone-100/80 text-stone-900 antialiased",
        desk ? "flex items-center justify-center px-6 py-16" : "flex flex-col",
        className,
      )}
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        paddingTop: desk ? undefined : "max(1.25rem, env(safe-area-inset-top))",
        paddingBottom: desk ? undefined : "max(1.5rem, env(safe-area-inset-bottom))",
      }}
    >
      {children}
    </div>
  );
}

/** Success + one optional feedback question (reference-style radio list). Shown directly from the app entry point. */
export function UnsubscribeFeedbackScreen({
  layout,
  onDone,
  onBack,
}: {
  layout: Layout;
  onDone: () => void;
  onBack?: () => void;
}) {
  const desk = layout === "desktop";
  type ReasonId = (typeof REASONS)[number]["id"];
  const [selectedReasons, setSelectedReasons] = useState<ReasonId[]>([]);

  const toggleReason = (id: ReasonId) => {
    setSelectedReasons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <Shell layout={layout}>
      <div
        className={cn(
          "flex w-full flex-col",
          desk ? "mx-auto max-w-[480px]" : "mx-auto max-w-md flex-1 px-5 pt-2",
        )}
      >
        <div className="mb-6 flex w-full flex-col items-center">
          <p
            className={cn(
              "text-[24px] font-extrabold leading-none tracking-[-0.05em] md:text-[26px]",
              desk
                ? "text-stone-900"
                : "bg-gradient-to-br from-[#FF6B35] to-[#E65122] bg-clip-text text-transparent",
            )}
          >
            ZappyFind
          </p>
        </div>

        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="mb-6 flex w-fit items-center gap-0.5 text-[13px] font-medium text-stone-500 transition-colors hover:text-stone-800"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            Back
          </button>
        ) : (
          <div className="mb-4 h-0" aria-hidden />
        )}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8"
        >
          <div
            className={cn(
              "flex gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/90 px-4 py-3.5 shadow-sm",
              desk && "px-5 py-4",
            )}
            role="status"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
            <div className="min-w-0 text-left">
              <p className="text-[13px] font-semibold tracking-[-0.02em] text-emerald-950">You are unsubscribed</p>
              <p className="mt-1 text-[12px] font-medium leading-snug text-emerald-900/85">
                You will not receive further job alert emails from ZappyFind at this address. Changes can take a short
                while to apply everywhere.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-semibold tracking-[-0.035em] text-stone-900 md:text-[22px]">
              One quick question
            </h2>
            <p className="mt-1.5 text-[13px] font-medium text-stone-500">
              Optional. Select all that apply. This helps us tune what we send everyone.
            </p>

            <ul
              className="mt-5 flex flex-col gap-2"
              role="group"
              aria-label="Why are you leaving? Select all that apply."
            >
              {REASONS.map((r) => {
                const on = selectedReasons.includes(r.id);
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => toggleReason(r.id)}
                      className={cn(
                        "flex w-full items-center rounded-xl border px-4 py-3.5 text-left text-[13px] font-medium tracking-[-0.015em] transition-colors",
                        on
                          ? "border-orange-300/90 bg-orange-50/90 text-stone-900 shadow-[0_0_0_1px_rgba(234,88,12,0.12)]"
                          : "border-stone-200/90 bg-white/80 text-stone-700 hover:border-stone-300 hover:bg-stone-50/80",
                        desk && "py-4 text-[14px]",
                      )}
                    >
                      <span
                        className={cn(
                          "mr-3 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors",
                          on ? "border-orange-500 bg-orange-500 text-white" : "border-stone-300 bg-white",
                        )}
                        aria-hidden
                      >
                        {on ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                      </span>
                      {r.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onDone}
            className={cn(
              "w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3.5 text-[14px] font-semibold tracking-[-0.02em] text-white shadow-[0_4px_20px_rgba(234,88,12,0.35)] transition-shadow hover:shadow-[0_6px_28px_rgba(234,88,12,0.4)]",
              desk && "py-4 text-[15px]",
            )}
          >
            Done
          </motion.button>
        </motion.div>
      </div>
    </Shell>
  );
}
