import { motion, useReducedMotion } from "motion/react";
import {
  Briefcase,
  Compass,
  House,
  Mic,
  User,
  type LucideIcon,
} from "lucide-react";

// ── Design tokens (kept local so this nav stays drop-in) ─────────────────────
const NAV_T = {
  pageBg: "#FDFBF8",
  surface: "#FFFFFF",
  text: "#1A1613",
  textSec: "rgba(107, 101, 96, 1)",
  textTer: "rgba(107, 101, 96, 0.7)",
  accent: "#EA580C",
  accentSoft: "rgba(234,88,12,0.08)",
  accentGradient: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
  border: "rgba(28,25,23,0.06)",
  borderStrong: "rgba(28,25,23,0.1)",
  shadow: "0 -1px 0 rgba(28,25,23,0.03), 0 -8px 24px rgba(28,25,23,0.08)",
  sans: "'Inter', sans-serif",
};

const EASE = [0.16, 1, 0.3, 1] as const;
const BAR_HEIGHT = 64;
const BAR_INNER_PAD_X = 18;

export type MobileBottomNavTab =
  | "home"
  | "career"
  | "jobs"
  | "interview"
  | "profile";

type StandardTab = {
  key: MobileBottomNavTab;
  label: string;
  icon: LucideIcon;
};

const TABS: StandardTab[] = [
  { key: "home", label: "Home", icon: House },
  { key: "jobs", label: "Jobs", icon: Briefcase },
  { key: "career", label: "Career", icon: Compass },
  { key: "interview", label: "Interview", icon: Mic },
  { key: "profile", label: "Profile", icon: User },
];

export function MobileBottomNav({
  active,
  onSelect,
}: {
  active: MobileBottomNavTab;
  onSelect: (tab: MobileBottomNavTab) => void;
}) {
  const reduceMotion = useReducedMotion();
  const tapAnim = reduceMotion ? undefined : { scale: 0.94 };
  const springy = { type: "spring", stiffness: 520, damping: 30 } as const;

  return (
    <div
      // Pinned to viewport bottom, but constrained to mobile column width
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 40,
        paddingLeft: "max(12px, env(safe-area-inset-left, 0px))",
        paddingRight: "max(12px, env(safe-area-inset-right, 0px))",
        paddingBottom: "max(10px, env(safe-area-inset-bottom, 0px))",
      }}
    >
      <nav
        aria-label="Primary"
        style={{
          pointerEvents: "auto",
          position: "relative",
          width: "100%",
          maxWidth: 366,
          height: BAR_HEIGHT,
          fontFamily: NAV_T.sans,
        }}
      >
        {/* Clean white bar */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 24,
            background: NAV_T.surface,
            border: `1px solid ${NAV_T.border}`,
            boxShadow: NAV_T.shadow,
          }}
        />

        {/* Tab row */}
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            alignItems: "center",
            height: "100%",
            columnGap: 16,
            padding: `0 ${BAR_INNER_PAD_X}px`,
          }}
        >
          {TABS.map((t) => (
            <StandardTabButton
              key={t.key}
              tab={t}
              active={active === t.key}
              onSelect={onSelect}
              tapAnim={tapAnim}
              springy={springy}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function StandardTabButton({
  tab,
  active,
  onSelect,
  tapAnim,
  springy,
}: {
  tab: StandardTab;
  active: boolean;
  onSelect: (tab: MobileBottomNavTab) => void;
  tapAnim: { scale: number } | undefined;
  springy: { type: "spring"; stiffness: number; damping: number };
}) {
  const Icon = tab.icon;
  return (
    <motion.button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={tab.label}
      onClick={() => onSelect(tab.key)}
      whileTap={tapAnim}
      transition={springy}
      style={{
        position: "relative",
        height: "100%",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "6px 4px 8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <motion.span
        aria-hidden
        animate={{
          y: active ? -1 : 0,
          color: active ? NAV_T.accent : NAV_T.textSec,
        }}
        transition={{ duration: 0.22, ease: EASE }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
        }}
      >
        <Icon
          size={20}
          strokeWidth={active ? 2.05 : 2}
          color="currentColor"
          fill={active ? "currentColor" : "transparent"}
          fillOpacity={active ? 0.22 : 0}
        />
      </motion.span>
      <motion.span
        animate={{ color: active ? NAV_T.accent : NAV_T.textTer }}
        transition={{ duration: 0.22, ease: EASE }}
        style={{
          fontSize: 10.5,
          fontWeight: active ? 700 : 600,
          letterSpacing: "-0.005em",
          lineHeight: 1.1,
        }}
      >
        {tab.label}
      </motion.span>

      {active && (
        <motion.span
          layoutId="bottom-nav-active-dot"
          transition={{ type: "spring", stiffness: 520, damping: 36 }}
          style={{
            position: "absolute",
            top: 6,
            width: 4,
            height: 4,
            borderRadius: 999,
            background: NAV_T.accent,
            opacity: 0.9,
          }}
        />
      )}
    </motion.button>
  );
}

export const MOBILE_BOTTOM_NAV_HEIGHT = BAR_HEIGHT;
/**
 * Total bottom space (bar + label below + safe area + a comfortable gap) that
 * any scrolling screen should reserve so its last content isn't covered.
 */
export const MOBILE_BOTTOM_NAV_RESERVED = 96;
