import type { ReactNode } from "react";
import { useEffect } from "react";
import { motion } from "motion/react";
import { DT } from "./desktop-tokens";

/**
 * Survives remounts when switching onboarding screens so we only play the
 * wide→narrow width animation the first time user enters steps 1–7 after intro.
 */
let onboardingChromeNarrowSeen = false;

type Step = { id: string; label: string };

const DEFAULT_STEPS: Step[] = [
  { id: "intro", label: "Intro" },
  { id: "prefs", label: "Preferences" },
  { id: "resume", label: "Resume" },
  { id: "profile", label: "Profile" },
  { id: "setup", label: "Processing" },
  { id: "summary", label: "Summary" },
  { id: "match", label: "Market fit" },
  { id: "call", label: "Voice" },
];

type DesktopOnboardingChromeProps = {
  title: string;
  subtitle?: string;
  /** 0-based index into steps */
  activeStep: number;
  steps?: Step[];
  children: ReactNode;
  /** Tailwind min-height for intro glass card (default min-h-[724px], paired with fixed h on the card). */
  cardMinHeightClass?: string;
  /** Min height + fit-content for steps 1–7 glass card (default min-h-[806px] h-fit). */
  cardHeightClass?: string;
  /** Optional extra classes on the inner flex column (non-intro). Prefer min-h-0 for fill layouts. */
  contentMinHeightClass?: string;
  /** Bottom padding on the glass card for steps 1–7 (default pb-6). */
  cardFooterPaddingClass?: string;
  /**
   * When false (e.g. voice call step), inner column skips flex-1 so height follows
   * content instead of stretching inside the glass card.
   */
  scrollColumnGrow?: boolean;
};

export function DesktopOnboardingChrome({
  title: _title,
  subtitle: _subtitle,
  activeStep,
  steps: _steps = DEFAULT_STEPS,
  children,
  cardMinHeightClass = "min-h-[724px]",
  cardHeightClass = "min-h-[806px] h-fit",
  contentMinHeightClass = "",
  cardFooterPaddingClass = "pb-6",
  scrollColumnGrow = true,
}: DesktopOnboardingChromeProps) {
  /** Steps 1–7: 880px max-width card, min height with content-driven height, 44px horizontal/top padding and 24px bottom; intro (0) is separate. */
  const isNarrowChrome = activeStep >= 1 && activeStep <= 7;

  useEffect(() => {
    if (activeStep === 0) onboardingChromeNarrowSeen = false;
  }, [activeStep]);

  /** First entry into narrow chrome after intro: mount “wide” then animate down (remount-safe). */
  const shouldPlayWideToNarrow = isNarrowChrome && !onboardingChromeNarrowSeen;

  /** Slow ease so width changes feel gradual when switching intro → later steps (and back). */
  const widthEase = [0.22, 1, 0.28, 1] as const;
  const widthTransition = {
    duration: 1.05,
    ease: widthEase,
  };

  /** Longer, softer layout animation so card height shrinks/grows gradually between steps. */
  const layoutSizeTransition = {
    duration: 1.35,
    ease: [0.18, 0.82, 0.32, 1] as const,
  };

  const outerInitial =
    shouldPlayWideToNarrow ? { maxWidth: 1180 } : false;
  const cardInitial =
    shouldPlayWideToNarrow ? { maxWidth: 1040 } : false;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        fontFamily: DT.sans,
        background:
          "radial-gradient(ellipse 90% 62% at 12% -6%, rgba(251,146,60,0.36) 0%, transparent 60%), linear-gradient(156deg, #FFF8F3 0%, #FDF6EE 46%, #FAF1E7 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(234,88,12,0.22) 0%, rgba(234,88,12,0.08) 42%, transparent 72%)",
          filter: "blur(10px)",
        }}
      />
      <motion.div
        className="relative z-10 mx-auto flex min-h-screen w-full items-center justify-center px-6 py-10 lg:px-12"
        initial={outerInitial}
        animate={{ maxWidth: isNarrowChrome ? 1000 : 1180 }}
        transition={widthTransition}
        style={{ width: "100%" }}
      >
        <motion.div
          layout
          initial={cardInitial}
          animate={{ maxWidth: isNarrowChrome ? 880 : 1040 }}
          transition={{
            layout: layoutSizeTransition,
            maxWidth: widthTransition,
          }}
          onAnimationComplete={() => {
            if (isNarrowChrome) onboardingChromeNarrowSeen = true;
          }}
          className={`w-full rounded-[30px] border ${
            activeStep === 0
              ? `${cardMinHeightClass} h-[724px] p-6 lg:px-8 lg:pt-[70px] lg:pb-[44px]`
              : `${cardHeightClass} flex flex-col overflow-hidden px-11 pt-11 ${cardFooterPaddingClass}`
          }`}
          style={{
            background: "linear-gradient(150deg, rgba(255,255,255,0.58) 0%, rgba(255,255,255,0.38) 100%)",
            borderColor: "rgba(255,255,255,0.62)",
            boxShadow:
              "0 34px 80px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.76), inset 0 -1px 0 rgba(255,255,255,0.22)",
            backdropFilter: "blur(16px) saturate(140%)",
            WebkitBackdropFilter: "blur(16px) saturate(140%)",
            ...(activeStep !== 0 ? { height: "fit-content" as const } : {}),
          }}
        >
          <div
            className={
              activeStep === 0
                ? "min-h-0 h-fit"
                : scrollColumnGrow
                  ? `flex min-h-0 flex-1 flex-col overflow-y-auto ${contentMinHeightClass}`.trim()
                  : `flex min-h-0 h-fit flex-col overflow-y-auto ${contentMinHeightClass}`.trim()
            }
          >
            {children}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
