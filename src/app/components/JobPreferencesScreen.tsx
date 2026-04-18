import { Fragment, useState, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import type { ReactNode, ElementType, CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { JobPreferences } from "./WelcomeScreen";
import {
  Heart, Crown, TrendingUp, Layers, Lightbulb, Zap, Rocket, Flame,
  Building2, Cpu, Clock, Globe, Scale,
  Code2, Palette, Package, Megaphone, Landmark,
  Users, Briefcase, Headphones, ShieldCheck, Wrench,
  FlaskConical, BarChart3, UserCheck, Handshake, HeartPulse, ChevronDown,
  Car, Plane, HeartHandshake, HardHat, Newspaper, Fuel, UtensilsCrossed,
  Clapperboard, Store, Truck, ClipboardList, BadgeCheck, AlertTriangle,
  Shield, Anchor, Dumbbell, GraduationCap, Wallet, Leaf,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  JOB_PREF_DEPARTMENTS,
  LEGACY_DEPARTMENT_ID_MAP,
} from "./jobPrefDepartmentsData";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:          "#FDFBF8",
  primary:     "#1C1917",
  brand:       "#EA580C",
  brandBg:     "rgba(234,88,12,0.07)",
  brandBorder: "rgba(234,88,12,0.35)",
  textPrimary: "#1C1917",
  textMuted:   "#78716C",
  textSec:     "#A8A29E",
  border:      "rgba(28,25,23,0.09)",
  trackBg:     "rgba(28,25,23,0.1)",
};

/* ── Step 2 — Priorities questionnaire (choose up to 3 overall) ───────────── */
const PRIORITIES = [
  { id: "startup_fast", label: "Startup — fast & evolving", icon: Flame },
  { id: "growing_company", label: "Growing company", icon: TrendingUp },
  { id: "established_company", label: "Established company", icon: Building2 },
  { id: "clear_role", label: "Clear role & responsibilities", icon: Crown },
  { id: "flexible_scope", label: "Flexible, changing work", icon: Layers },
  { id: "own_e2e", label: "Own projects end-to-end", icon: Rocket },
  { id: "fast_paced", label: "Fast-paced, high pressure", icon: Zap },
  { id: "steady_predictable", label: "Steady and predictable", icon: Scale },
  { id: "open_ended_problems", label: "Solve open-ended problems", icon: Lightbulb },
  { id: "close_team", label: "A close team", icon: Users },
  { id: "mostly_independent", label: "Mostly on my own", icon: UserCheck },
  { id: "client_facing", label: "Clients or customers", icon: Handshake },
  { id: "move_up_quickly", label: "Move up quickly", icon: TrendingUp },
  { id: "go_deep", label: "Go deep in one area", icon: Cpu },
  { id: "learn_from_managers", label: "Learn from great managers", icon: Heart },
  { id: "flexible_async", label: "Flexible / async work", icon: Globe },
  { id: "structured_hours", label: "Structured hours", icon: Clock },
  { id: "travel_relocation", label: "Open to travel / relocation", icon: Briefcase },
] as const;

/** Labels for preference IDs stored on the profile (used in summary & review screens). */
export const JOB_PRIORITY_LABEL_BY_ID: Record<string, string> = Object.fromEntries(
  PRIORITIES.map((p) => [p.id, p.label]),
) as Record<string, string>;

const PRIORITY_QUESTIONS = [
  {
    id: "company_fit",
    question: "1. What kind of company fits you?",
    optionIds: ["startup_fast", "growing_company", "established_company"],
  },
  {
    id: "role_defined",
    question: "2. How do you like your role defined?",
    optionIds: ["clear_role", "flexible_scope", "own_e2e"],
  },
  {
    id: "work_rhythm",
    question: "3. What's your preferred work rhythm?",
    optionIds: ["fast_paced", "steady_predictable", "open_ended_problems"],
  },
  {
    id: "team_style",
    question: "4. Who do you work best with?",
    optionIds: ["close_team", "mostly_independent", "client_facing"],
  },
  {
    id: "growth_path",
    question: "5. How do you want to grow?",
    optionIds: ["move_up_quickly", "go_deep", "learn_from_managers"],
  },
] as const;

/* ── Step 2 — Job categories & sub-roles (canonical list in jobPrefDepartmentsData) ─ */

type LucideIconComp = (typeof Code2);

const DEPARTMENT_ICON_BY_ID: Record<string, LucideIconComp> = {
  engineering_software_qa: Code2,
  ux_design_architecture: Palette,
  data_science_analytics: BarChart3,
  product_management: Package,
  it_information_security: ShieldCheck,
  marketing_communication: Megaphone,
  sales_business_development: TrendingUp,
  finance_accounting: Landmark,
  human_resources: Users,
  consulting: Briefcase,
  customer_success_service_operations: Headphones,
  bfsi_investments_trading: Wallet,
  project_program_management: ClipboardList,
  healthcare_life_sciences: HeartPulse,
  legal_regulatory: Scale,
  teaching_training: GraduationCap,
  content_editorial_journalism: Newspaper,
  other: Layers,
  administration_facilities: Building2,
  automobile_auto_ancillary: Car,
  aviation_aerospace: Plane,
  csr_social_service: HeartHandshake,
  construction_site_engineering: HardHat,
  energy_mining: Fuel,
  engineering_hardware_networks: Cpu,
  environment_health_safety: Leaf,
  food_beverage_hospitality: UtensilsCrossed,
  media_production_entertainment: Clapperboard,
  merchandising_retail_ecommerce: Store,
  procurement_supply_chain: Truck,
  production_manufacturing_engineering: Wrench,
  quality_assurance: BadgeCheck,
  research_development: FlaskConical,
  risk_management_compliance: AlertTriangle,
  security_services: Shield,
  shipping_maritime: Anchor,
  sports_fitness_personal_care: Dumbbell,
  strategic_top_management: Crown,
};

const ALL_DEPARTMENT_CHIPS = JOB_PREF_DEPARTMENTS.map((row) => ({
  id: row.id,
  label: row.label,
  showInitially: row.showInitially,
  icon: DEPARTMENT_ICON_BY_ID[row.id] ?? Layers,
}));

/**
 * Mobile: first 15 departments (14 highest-intent from desktop cohort + Other).
 * Desktop still uses full `showInitially` set in jobPrefDepartmentsData.
 */
const MOBILE_FIRST_DEPARTMENT_IDS = [
  "engineering_software_qa",
  "ux_design_architecture",
  "data_science_analytics",
  "product_management",
  "it_information_security",
  "marketing_communication",
  "sales_business_development",
  "finance_accounting",
  "human_resources",
  "consulting",
  "customer_success_service_operations",
  "bfsi_investments_trading",
  "project_program_management",
  "healthcare_life_sciences",
  "other",
] as const;

const MOBILE_FIRST_DEPARTMENT_ID_SET = new Set<string>(MOBILE_FIRST_DEPARTMENT_IDS);

const SUB_ROLES: Record<string, string[]> = Object.fromEntries(
  JOB_PREF_DEPARTMENTS.map((d) => [d.id, d.roles]),
);

const MAX_JOB_CATEGORIES = 3;
const MAX_ROLES_PER_CATEGORY = 3;
const EXPERIENCE_LEVELS = [
  { id: "entry", label: "Entry level", subLabel: "0-2 years", emoji: "🌱" },
  { id: "mid", label: "Associate", subLabel: "1-3 years", emoji: "📈" },
  { id: "senior", label: "Mid-level", subLabel: "3-6 years", emoji: "🚀" },
  { id: "lead", label: "Senior level", subLabel: "5-10 years", emoji: "🏆" },
] as const;
const EXPERIENCE_BADGE: Record<(typeof EXPERIENCE_LEVELS)[number]["id"], string> = {
  entry: "0-2y",
  mid: "1-3y",
  senior: "3-6y",
  lead: "5-10y",
};

function resolveDepartmentId(id: string) {
  return LEGACY_DEPARTMENT_ID_MAP[id] ?? id;
}

function getCategoryMeta(id: string) {
  const resolved = resolveDepartmentId(id);
  return ALL_DEPARTMENT_CHIPS.find((c) => c.id === resolved);
}

function getPresetRoles(catId: string): string[] {
  const resolved = resolveDepartmentId(catId);
  return SUB_ROLES[resolved] ?? SUB_ROLES[catId] ?? [];
}

/* ── Step 3 — Work setup ───────────────────────────────────────────────────── */
const WORK_SETUPS = [
  { id: "onsite", label: "Onsite" },
  { id: "hybrid", label: "Hybrid" },
  { id: "remote", label: "Remote" },
];

const INDIA_CITIES = [
  "Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "Gurgaon", "Noida", "Chennai",
  "Kolkata", "Ahmedabad", "Jaipur", "Indore", "Surat", "Chandigarh", "Kochi", "Coimbatore",
  "Lucknow", "Bhopal", "Nagpur", "Mysore", "Visakhapatnam", "Thiruvananthapuram",
];

/* ── Step 4 — Salary ───────────────────────────────────────────────────────── */
const SAL_MIN = 0;
const SAL_MAX = 100; // LPA (lakhs per annum, INR — canonical slider unit)
const SAL_GAP = 5;

function clampSalaryLpa(value: number): number {
  return Math.max(SAL_MIN, Math.min(SAL_MAX, value));
}

/** Digits only for annual amount in the selected currency (slider still uses LPA internally). */
function sanitizeAnnualDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 12);
}

/** Major currencies; slider is driven in INR LPA; fields show full annual amount in the selected currency. */
export type SalaryCurrencyCode =
  | "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD" | "CAD" | "AUD";

const SALARY_CURRENCY_OPTIONS: {
  code: SalaryCurrencyCode;
  label: string;
}[] = [
  { code: "INR", label: "Indian Rupee (₹)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "AED", label: "UAE Dirham (د.إ)" },
  { code: "SGD", label: "Singapore Dollar (S$)" },
  { code: "CAD", label: "Canadian Dollar (C$)" },
  { code: "AUD", label: "Australian Dollar (A$)" },
];

/** Approximate INR per 1 unit of foreign currency (for display only). */
const INR_PER_UNIT: Record<SalaryCurrencyCode, number> = {
  INR: 1,
  USD: 83,
  EUR: 90,
  GBP: 106,
  AED: 22.6,
  SGD: 62,
  CAD: 61,
  AUD: 55,
};

/** Annual salary amount in the selected currency (INR = rupees/year). */
export function lpaToAnnualAmount(lakhs: number, code: SalaryCurrencyCode): number {
  const annualInr = lakhs * 100_000;
  if (code === "INR") return annualInr;
  return annualInr / INR_PER_UNIT[code];
}

/** Map typed annual amount back to canonical LPA (0–100) for the slider and persistence. */
function annualAmountToLpa(annual: number, code: SalaryCurrencyCode): number {
  if (!Number.isFinite(annual) || annual < 0) return SAL_MIN;
  if (code === "INR") {
    return clampSalaryLpa(Math.round(annual / 100_000));
  }
  const annualInr = annual * INR_PER_UNIT[code];
  return clampSalaryLpa(Math.round(annualInr / 100_000));
}

/** Full annual salary with correct currency symbol (no LPA / compact notation). */
export function formatSalaryAnnualDisplay(lakhs: number, code: SalaryCurrencyCode): string {
  const n = Math.round(lpaToAnnualAmount(lakhs, code));
  try {
    return new Intl.NumberFormat(code === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} ${code}`;
  }
}

/* ── Shared: small checkmark pill indicator ────────────────────────────────── */
function CheckMark() {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 15, height: 15, borderRadius: 4, background: "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)", flexShrink: 0,
    }}>
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ── Pill button ────────────────────────────────────────────────────────────── */
function Pill({
  label, icon: Icon, emoji, selected, disabled, onClick,
}: { label: string; icon?: ElementType; emoji?: string; selected: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "9px 14px", borderRadius: 100,
        border: `1.5px solid ${selected ? C.brandBorder : C.border}`,
        background: selected ? C.brandBg : "white",
        color: selected ? C.brand : C.textPrimary,
        fontSize: "13px", fontWeight: selected ? 600 : 400,
        letterSpacing: "-0.01em", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.38 : 1,
        transition: "border-color 0.18s, background 0.18s, color 0.18s",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {Icon && (
        <Icon
          size={13}
          strokeWidth={selected ? 2.2 : 1.8}
          style={{ flexShrink: 0, opacity: selected ? 1 : 0.6 }}
        />
      )}
      {emoji && <span style={{ fontSize: 16, lineHeight: 1 }}>{emoji}</span>}
      {label}
    </motion.button>
  );
}

/* ── Section header ─────────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p style={{
      fontSize: "11px", fontWeight: 600, color: C.textSec,
      letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12,
    }}>
      {children}
    </p>
  );
}

/**
 * Gradient rule between step-3 sections. Rendered **outside** the narrow content
 * column so it spans the onboarding card width and the bar centers in the glass pane.
 */
function PrefsStep3GradientRule() {
  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        alignSelf: "stretch",
        margin: "8px 0 12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "min(520px, 78%)",
          height: 1,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, rgba(234,88,12,0) 0%, rgba(251,146,60,0.14) 22%, rgba(234,88,12,0.22) 48%, rgba(129,140,248,0.12) 74%, rgba(251,146,60,0.1) 100%)",
        }}
      />
    </div>
  );
}

/* ── Types ──────────────────────────────────────────────────────────────────── */
type Step = 1 | 2 | 3;

interface Props {
  onComplete: (prefs: JobPreferences) => void;
  onBack: () => void;
  /** When returning from Welcome (final step), reopen at this preference step (default 1). */
  resumeAtStep?: Step;
  /** Use transparent background when embedded in desktop onboarding chrome. */
  transparentSurface?: boolean;
}

/* ═════════════════════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════════════════════ */
export function JobPreferencesScreen({ onComplete, onBack, resumeAtStep, transparentSurface = false }: Props) {
  /** Desktop onboarding: tighter, non-stretched controls inside glass chrome. */
  const isDesktopLayout = transparentSurface;
  const prefsStep3ContentShell: CSSProperties = isDesktopLayout
    ? {
        maxWidth: 600,
        marginLeft: 0,
        marginRight: "auto",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "left",
      }
    : { textAlign: "left" };
  const [step,       setStep]       = useState<Step>(() => {
    if (resumeAtStep !== undefined && resumeAtStep >= 1 && resumeAtStep <= 3) return resumeAtStep;
    return 1;
  });
  const [priorities, setPriorities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [rolesByCategory, setRolesByCategory] = useState<Record<string, string[]>>({});
  const [experienceLevelByCategory, setExperienceLevelByCategory] = useState<
    Record<string, "entry" | "mid" | "senior" | "lead">
  >({});
  const [expandedExperienceCategory, setExpandedExperienceCategory] = useState<string | null>(null);
  const [customRoleByCategory, setCustomRoleByCategory] = useState<Record<string, string>>({});
  const [expandedRoleInputCategory, setExpandedRoleInputCategory] = useState<string | null>(null);
  const [otherDepartmentLabel, setOtherDepartmentLabel] = useState("");
  const roleInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const otherDepartmentInputRef = useRef<HTMLInputElement | null>(null);
  const hadOtherCategoryRef = useRef(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const visibleDepartments = useMemo(() => {
    if (showAllDepartments) return ALL_DEPARTMENT_CHIPS;
    if (isDesktopLayout) {
      return ALL_DEPARTMENT_CHIPS.filter((d) => d.showInitially);
    }
    return MOBILE_FIRST_DEPARTMENT_IDS.map((id) => ALL_DEPARTMENT_CHIPS.find((c) => c.id === id)).filter(
      (c): c is (typeof ALL_DEPARTMENT_CHIPS)[number] => Boolean(c),
    );
  }, [showAllDepartments, isDesktopLayout]);

  const collapsedDepartmentCount = useMemo(() => {
    if (isDesktopLayout) {
      return ALL_DEPARTMENT_CHIPS.filter((d) => !d.showInitially).length;
    }
    return ALL_DEPARTMENT_CHIPS.length - MOBILE_FIRST_DEPARTMENT_IDS.length;
  }, [isDesktopLayout]);

  useEffect(() => {
    if (showAllDepartments) return;
    const hiddenIds = isDesktopLayout
      ? new Set(ALL_DEPARTMENT_CHIPS.filter((d) => !d.showInitially).map((d) => d.id))
      : new Set(ALL_DEPARTMENT_CHIPS.filter((d) => !MOBILE_FIRST_DEPARTMENT_ID_SET.has(d.id)).map((d) => d.id));
    if (selectedCategories.some((id) => hiddenIds.has(resolveDepartmentId(id)))) {
      setShowAllDepartments(true);
    }
  }, [showAllDepartments, selectedCategories, isDesktopLayout]);

  /**
   * Department chip row measurement.
   * After layout, find the index of the LAST chip on the same visual row as the
   * currently expanded chip. The "Target level" strip is inserted right after
   * that chip with flex-basis:100%, so chips already on that row never reflow —
   * only chips on rows below get pushed down.
   */
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const chipRowRef = useRef<HTMLDivElement | null>(null);
  const [stripInsertAfterIdx, setStripInsertAfterIdx] = useState<number>(-1);

  useLayoutEffect(() => {
    const compute = () => {
      if (step !== 1) {
        setStripInsertAfterIdx(-1);
        return;
      }
      if (
        !expandedExperienceCategory ||
        expandedExperienceCategory === "other" ||
        !selectedCategories.includes(expandedExperienceCategory)
      ) {
        setStripInsertAfterIdx(-1);
        return;
      }
      const selectedIdx = visibleDepartments.findIndex(
        (c) => c.id === expandedExperienceCategory,
      );
      if (selectedIdx === -1) {
        setStripInsertAfterIdx(-1);
        return;
      }
      const selectedEl = chipRefs.current[selectedIdx];
      if (!selectedEl) {
        setStripInsertAfterIdx(-1);
        return;
      }
      // Use viewport-aligned tops (not offsetTop): on mobile, offsetParent can differ
      // from the flex row, which breaks row grouping. getBoundingClientRect is stable.
      const selectedTop = selectedEl.getBoundingClientRect().top;
      let lastInRow = selectedIdx;
      for (let i = selectedIdx + 1; i < visibleDepartments.length; i++) {
        const el = chipRefs.current[i];
        if (!el) break;
        const top = el.getBoundingClientRect().top;
        if (Math.abs(top - selectedTop) <= 2) {
          lastInRow = i;
        } else {
          break;
        }
      }
      setStripInsertAfterIdx(lastInRow);
    };

    /** Mobile Safari / Chrome sometimes need a frame after mount before chip rects are final. */
    const schedule = () => {
      compute();
      requestAnimationFrame(() => {
        requestAnimationFrame(compute);
      });
    };

    schedule();

    const row = chipRowRef.current;
    if (typeof ResizeObserver === "undefined" || !row) {
      window.addEventListener("resize", schedule);
      window.visualViewport?.addEventListener("resize", schedule);
      return () => {
        window.removeEventListener("resize", schedule);
        window.visualViewport?.removeEventListener("resize", schedule);
      };
    }
    const ro = new ResizeObserver(() => schedule());
    ro.observe(row);
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, [expandedExperienceCategory, selectedCategories, step, visibleDepartments]);
  const [switchTimeline, setSwitchTimeline] = useState<string | null>(null);
  const [workSetups, setWorkSetups] = useState<string[]>([]);
  const [locQuery,   setLocQuery]   = useState("");
  const [locations,  setLocations]  = useState<string[]>([]);
  const [salMin,     setSalMin]     = useState(5);
  const [salMax,     setSalMax]     = useState(30);
  const [salaryCurrency, setSalaryCurrency] = useState<SalaryCurrencyCode>("INR");
  const [salMinEditing, setSalMinEditing] = useState(false);
  const [salMaxEditing, setSalMaxEditing] = useState(false);
  const [salMinDraft, setSalMinDraft] = useState("");
  const [salMaxDraft, setSalMaxDraft] = useState("");

  const commitSalMinFromDraft = (draft: string) => {
    const t = sanitizeAnnualDigits(draft).trim();
    const n = t === "" ? 0 : parseInt(t, 10);
    if (Number.isNaN(n)) return;
    let lpa = annualAmountToLpa(n, salaryCurrency);
    lpa = Math.min(lpa, Math.max(SAL_MIN, salMax - SAL_GAP));
    setSalMin(lpa);
  };

  const commitSalMaxFromDraft = (draft: string) => {
    const t = sanitizeAnnualDigits(draft).trim();
    let lpa: number;
    if (t === "") {
      lpa = SAL_MAX;
    } else {
      const n = parseInt(t, 10);
      if (Number.isNaN(n)) return;
      lpa = annualAmountToLpa(n, salaryCurrency);
    }
    lpa = Math.max(lpa, Math.min(SAL_MAX, salMin + SAL_GAP));
    setSalMax(lpa);
  };

  useEffect(() => {
    setSalMinEditing(false);
    setSalMaxEditing(false);
  }, [salaryCurrency]);

  useEffect(() => {
    if (step !== 3) {
      setSalMinEditing(false);
      setSalMaxEditing(false);
    }
  }, [step]);

  /* ── Inject dual-range CSS ──────────────────────────────────────────────── */
  useEffect(() => {
    const id = "zf-slider-css";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = `
      .zf-range {
        -webkit-appearance: none; appearance: none;
        background: transparent; width: 100%; height: 28px;
        position: absolute; top: 0; left: 0; margin: 0;
        pointer-events: none;
      }
      .zf-range::-webkit-slider-thumb {
        -webkit-appearance: none; pointer-events: all;
        width: 24px; height: 24px; border-radius: 50%;
        background: #FDFBF8; border: 2.5px solid #EA580C;
        box-shadow: 0 2px 10px rgba(234,88,12,0.35); cursor: grab;
        transition: box-shadow .15s, transform .12s;
      }
      .zf-range::-webkit-slider-thumb:active {
        cursor: grabbing; transform: scale(1.15);
        box-shadow: 0 4px 18px rgba(234,88,12,0.42);
      }
      .zf-range::-moz-range-thumb {
        pointer-events: all; width: 24px; height: 24px; border-radius: 50%;
        background: #FDFBF8; border: 2.5px solid #EA580C;
        box-shadow: 0 2px 10px rgba(234,88,12,0.35); cursor: grab;
      }
      .zf-range::-webkit-slider-runnable-track { background: transparent; }
      .zf-range::-moz-range-track { background: transparent; border: none; }
      button.zf-salary-currency-trigger:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.2);
        border-radius: 4px;
      }
      .zf-salary-currency-menu {
        padding: 6px !important;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: min(280px, calc(100vw - 32px));
        max-height: min(420px, 70vh);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .zf-salary-currency-menu [data-slot="dropdown-menu-radio-item"] {
        min-height: 40px;
        padding: 10px 12px 10px 2.25rem !important;
        font-size: 15px;
        line-height: 1.25;
        border-radius: 8px;
        align-items: center;
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(234, 88, 12, 0.14);
        color: #1C1917;
        user-select: none;
      }
      .zf-salary-currency-menu [data-slot="dropdown-menu-radio-item"][data-state="checked"] {
        background: rgba(234, 88, 12, 0.14);
        color: #EA580C;
        font-weight: 700;
      }
      .zf-salary-currency-menu [data-slot="dropdown-menu-radio-item"][data-state="checked"] svg {
        color: #EA580C;
      }
      .zf-salary-currency-menu [data-slot="dropdown-menu-radio-item"]:active {
        background: rgba(234, 88, 12, 0.1);
      }
      .zf-salary-currency-menu [data-slot="dropdown-menu-radio-item"][data-state="checked"]:active {
        background: rgba(234, 88, 12, 0.2);
      }
      .zf-salary-lpa-field {
        display: inline-flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: 0;
        min-height: 48px;
        min-width: min(140px, 100%);
        padding: 8px 12px;
        border-radius: 12px;
        border: 1px solid rgba(28, 25, 23, 0.14);
        background: #FFFFFF;
        box-shadow: inset 0 1px 2px rgba(28, 25, 23, 0.06);
        box-sizing: border-box;
        cursor: text;
        -webkit-tap-highlight-color: transparent;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }
      .zf-salary-lpa-field--end {
        justify-content: flex-end;
        text-align: right;
      }
      .zf-salary-lpa-field--compact {
        max-width: 188px;
        width: 100%;
      }
      .zf-salary-lpa-field:focus-within {
        border-color: rgba(234, 88, 12, 0.5);
        box-shadow:
          inset 0 1px 2px rgba(28, 25, 23, 0.05),
          0 0 0 3px rgba(234, 88, 12, 0.14);
      }
      input.zf-salary-lpa {
        appearance: textfield;
        -moz-appearance: textfield;
        margin: 0;
        padding: 0 1px;
      }
      input.zf-salary-lpa::-webkit-outer-spin-button,
      input.zf-salary-lpa::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input.zf-salary-lpa:focus {
        outline: none;
      }
    `;
    document.head.appendChild(el);
    return () => { document.getElementById(id)?.remove(); };
  }, []);

  /* ── Handlers ───────────────────────────────────────────────────────────── */
  const togglePriority = (id: string) =>
    setPriorities(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );

  useEffect(() => {
    setRolesByCategory((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.keys(next).forEach((k) => {
        if (!selectedCategories.includes(k)) {
          delete next[k];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    setExperienceLevelByCategory((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.keys(next).forEach((k) => {
        if (!selectedCategories.includes(k)) {
          delete next[k];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [selectedCategories]);

  useEffect(() => {
    if (!expandedRoleInputCategory) return;
    if (!selectedCategories.includes(expandedRoleInputCategory)) {
      setExpandedRoleInputCategory(null);
      return;
    }
    const t = setTimeout(() => roleInputRefs.current[expandedRoleInputCategory]?.focus(), 10);
    return () => clearTimeout(t);
  }, [expandedRoleInputCategory, selectedCategories]);

  useEffect(() => {
    if (!expandedExperienceCategory) return;
    if (!selectedCategories.includes(expandedExperienceCategory)) {
      setExpandedExperienceCategory(null);
    }
  }, [expandedExperienceCategory, selectedCategories]);

  useEffect(() => {
    const hasOther = selectedCategories.includes("other");
    if (!hasOther) {
      setOtherDepartmentLabel("");
      hadOtherCategoryRef.current = false;
      return;
    }
    setRolesByCategory((prev) => {
      if (!prev.other) return prev;
      const next = { ...prev };
      delete next.other;
      return next;
    });
    setExperienceLevelByCategory((prev) => {
      if (!prev.other) return prev;
      const next = { ...prev };
      delete next.other;
      return next;
    });
    setCustomRoleByCategory((prev) => {
      if (prev.other === undefined) return prev;
      const next = { ...prev };
      delete next.other;
      return next;
    });
    if (!hadOtherCategoryRef.current) {
      const id = window.setTimeout(() => otherDepartmentInputRef.current?.focus(), 120);
      hadOtherCategoryRef.current = true;
      return () => clearTimeout(id);
    }
  }, [selectedCategories]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) {
        if (id === "other") {
          setExpandedExperienceCategory(null);
          return prev.filter((x) => x !== id);
        }
        if (expandedExperienceCategory === id) {
          setExpandedExperienceCategory(null);
          return prev.filter((x) => x !== id);
        }
        setExpandedExperienceCategory(id);
        return prev;
      }
      if (prev.length >= MAX_JOB_CATEGORIES) return prev;
      if (id === "other") {
        setExpandedExperienceCategory(null);
      } else {
        setExpandedExperienceCategory(id);
      }
      return [...prev, id];
    });
  };

  const toggleRoleForCategory = (catId: string, role: string) => {
    setRolesByCategory((prev) => {
      const cur = prev[catId] ?? [];
      if (cur.includes(role)) {
        const next = cur.filter((x) => x !== role);
        if (catId === "other" && next.length === 0) {
          setExperienceLevelByCategory((e) => {
            if (!e.other) return e;
            const nextExp = { ...e };
            delete nextExp.other;
            return nextExp;
          });
        }
        return { ...prev, [catId]: next };
      }
      if (cur.length >= MAX_ROLES_PER_CATEGORY) return prev;
      return { ...prev, [catId]: [...cur, role] };
    });
  };

  const addCustomRoleForCategory = (catId: string, rawValue?: string) => {
    const trimmed = (rawValue ?? customRoleByCategory[catId] ?? "").trim();
    if (!trimmed) return;
    const cur = rolesByCategory[catId] ?? [];
    if (cur.includes(trimmed)) return;
    if (cur.length >= MAX_ROLES_PER_CATEGORY) return;
    setRolesByCategory((prev) => ({ ...prev, [catId]: [...cur, trimmed] }));
    setCustomRoleByCategory((prev) => ({ ...prev, [catId]: "" }));
  };

  const toggleWorkSetup = (id: string) =>
    setWorkSetups(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const addLocation = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const canonical = v
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    setLocations(prev => (prev.includes(canonical) ? prev : [...prev, canonical]));
    setLocQuery("");
  };

  const removeLocation = (value: string) =>
    setLocations(prev => prev.filter(x => x !== value));

  const remoteSelected = workSetups.includes("remote");
  const onsiteOrHybridSelected = workSetups.includes("onsite") || workSetups.includes("hybrid");
  const showLocationPicker = onsiteOrHybridSelected || (remoteSelected && workSetups.length > 1);
  const remoteOnly = remoteSelected && workSetups.length === 1;
  /** "Other" only stores a free-text department name — no roles. Other categories need ≥1 role. */
  const hasAtLeastOneRole = selectedCategories.some((cid) => {
    if (cid === "other") return otherDepartmentLabel.trim().length > 0;
    return (rolesByCategory[cid] ?? []).length > 0;
  });
  const hasExperienceLevelForAllSelected = selectedCategories.every((cid) => {
    if (cid === "other") return true;
    return !!experienceLevelByCategory[cid];
  });
  const liveSalMin =
    salMinEditing
      ? (() => {
          const v = sanitizeAnnualDigits(salMinDraft).trim();
          if (v === "") return null;
          const n = parseInt(v, 10);
          return Number.isNaN(n) ? null : annualAmountToLpa(n, salaryCurrency);
        })()
      : salMin;
  const liveSalMax =
    salMaxEditing
      ? (() => {
          const v = sanitizeAnnualDigits(salMaxDraft).trim();
          if (v === "") return null;
          const n = parseInt(v, 10);
          return Number.isNaN(n) ? null : annualAmountToLpa(n, salaryCurrency);
        })()
      : salMax;
  const salaryRangeError =
    step === 3
      ? (() => {
          if (liveSalMin == null || liveSalMax == null) {
            return "Enter both minimum and maximum salary.";
          }
          if (liveSalMin < SAL_MIN || liveSalMax < SAL_MIN || liveSalMin > SAL_MAX || liveSalMax > SAL_MAX) {
            return "Salary must stay within the selectable range for your currency.";
          }
          if (liveSalMin > liveSalMax) {
            return "Minimum salary cannot be greater than maximum salary.";
          }
          return null;
        })()
      : null;

  useEffect(() => {
    if (remoteOnly) {
      setLocations([]);
      setLocQuery("");
      return;
    }
    if (!showLocationPicker) {
      setLocations([]);
      setLocQuery("");
    }
  }, [remoteOnly, showLocationPicker]);

  const canContinue =
    (step === 1 && hasAtLeastOneRole && hasExperienceLevelForAllSelected) ||
    (step === 2 && priorities.length > 0) ||
    (step === 3 &&
      switchTimeline !== null &&
      salaryRangeError === null &&
      workSetups.length > 0 &&
      (!showLocationPicker || locations.length > 0));

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      if (salaryRangeError) return;
      const cats = [...selectedCategories];
      const rbc: Record<string, string[]> = {};
      const expByCat: Record<string, "entry" | "mid" | "senior" | "lead"> = {};
      cats.forEach((cid) => {
        if (cid === "other") return;
        const rs = rolesByCategory[cid];
        if (rs && rs.length) rbc[cid] = [...rs];
        const exp = experienceLevelByCategory[cid];
        if (exp) expByCat[cid] = exp;
      });
      const flatRoles = cats.flatMap((cid) =>
        cid === "other" ? [] : (rolesByCategory[cid] ?? [])
      );
      const firstCat = cats[0];
      onComplete({
        categories: cats.length ? cats : undefined,
        rolesByCategory: Object.keys(rbc).length ? rbc : undefined,
        experienceLevelByCategory: Object.keys(expByCat).length ? expByCat : undefined,
        otherDepartmentLabel:
          cats.includes("other") && otherDepartmentLabel.trim()
            ? otherDepartmentLabel.trim()
            : undefined,
        category: firstCat,
        roles: flatRoles.length ? flatRoles : undefined,
        workSetups: workSetups.length ? workSetups : undefined,
        locations: locations.length ? locations : undefined,
        priorities: priorities.length ? priorities : undefined,
        salaryMin: salMin,
        salaryMax: salMax,
        salaryCurrency,
        switchTimeline: switchTimeline ?? undefined,
      });
    }
  };

  const handleBack = () => {
    if (step === 1) onBack();
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  /* ════════════════════════════════════════════════════════════════════════
    Main preference screen (steps 1–3; final step is upload resume in WelcomeScreen)
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{
      height: (transparentSurface ? "100%" : "100svh") as CSSProperties["height"],
      minHeight: (transparentSurface ? 0 : "100dvh") as CSSProperties["minHeight"],
      flex: transparentSurface ? "1 1 0%" : undefined,
      minWidth: transparentSurface ? 0 : undefined,
      background: transparentSurface ? "transparent" : C.bg, fontFamily: "Inter, sans-serif",
      paddingBottom: transparentSurface ? 0 : "env(safe-area-inset-bottom)",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
    }}>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div style={{ padding: isDesktopLayout ? "0 0 10px" : "20px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4].map(n => (
            <motion.div
              key={n}
              animate={{
                background: n < step ? "#FF8F56" : n === step ? "#EA580C" : C.trackBg,
                opacity: n === step ? 1 : n < step ? 0.7 : 1,
              }}
              transition={{ duration: 0.4 }}
              style={{ flex: 1, height: 3, borderRadius: 2 }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <span style={{ fontSize: "11px", color: C.textSec, letterSpacing: "0.02em" }}>
            Step {step} of 4
          </span>
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <div
        style={{
          touchAction: "pan-y",
        }}
      >
        <div
          style={{
            padding: isDesktopLayout ? "0" : "20px 20px",
            minHeight: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AnimatePresence mode="wait">

            {/* ══ STEP 1: Job type ════════════════════════════════════════ */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Heading */}
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{
                    fontSize: "clamp(19px, 5.5vw, 22px)", fontWeight: 800,
                    color: C.textPrimary, letterSpacing: "-0.04em",
                    lineHeight: 1.25, marginBottom: 8,
                  }}>
                    What kind of job are you looking for?
                  </h2>
                </div>

                <SectionLabel>Job categories</SectionLabel>
                {/*
                  Chips live in a single flex-wrap row. The "Target level" strip is
                  inserted RIGHT AFTER the last chip on the same visual row as the
                  selected chip (computed with getBoundingClientRect in a layout
                  effect — reliable on mobile WebKit where offsetTop can disagree).
                  Chips on that row never reflow; only rows below move when the strip
                  opens (height animation).
                */}
                <div
                  ref={chipRowRef}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {visibleDepartments.map((cat, idx) => {
                    const selected = selectedCategories.includes(cat.id);
                    const atCap = selectedCategories.length >= MAX_JOB_CATEGORIES && !selected;
                    const exp = experienceLevelByCategory[cat.id];
                    const Icon = cat.icon;
                    const showStripAfter =
                      idx === stripInsertAfterIdx &&
                      expandedExperienceCategory &&
                      expandedExperienceCategory !== "other" &&
                      selectedCategories.includes(expandedExperienceCategory);
                    const expCat = showStripAfter
                      ? getCategoryMeta(expandedExperienceCategory!)
                      : null;
                    return (
                      <Fragment key={cat.id}>
                        <motion.button
                          ref={(el) => {
                            chipRefs.current[idx] = el;
                          }}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleCategory(cat.id)}
                          disabled={atCap}
                          style={{
                            position: "relative",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "9px 14px",
                            borderRadius: 100,
                            border: `1.5px solid ${selected ? C.brandBorder : C.border}`,
                            background: selected ? C.brandBg : "white",
                            color: selected ? C.brand : C.textPrimary,
                            fontSize: "13px",
                            fontWeight: selected ? 600 : 500,
                            letterSpacing: "-0.01em",
                            cursor: atCap ? "not-allowed" : "pointer",
                            opacity: atCap ? 0.38 : 1,
                            transition: "border-color 0.18s, background 0.18s, color 0.18s",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          <Icon
                            size={13}
                            strokeWidth={selected ? 2.1 : 1.8}
                            style={{ flexShrink: 0, opacity: selected ? 1 : 0.7 }}
                          />
                          {cat.label}
                          {exp && (
                            <span
                              style={{
                                position: "absolute",
                                top: -7,
                                right: -6,
                                fontSize: 10,
                                fontWeight: 700,
                                lineHeight: 1,
                                padding: "4px 6px",
                                borderRadius: 999,
                                background: "rgba(194,65,12,0.72)",
                                color: "rgba(255,255,255,0.98)",
                                border: "1px solid rgba(154,52,18,0.42)",
                                letterSpacing: "0.01em",
                              }}
                            >
                              {EXPERIENCE_BADGE[exp]}
                            </span>
                          )}
                        </motion.button>
                        <AnimatePresence initial={false}>
                          {showStripAfter && expCat && (
                            <motion.div
                              key={`exp-strip-after-${expandedExperienceCategory}-${idx}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
                              style={{
                                flexBasis: "100%",
                                width: "100%",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 8,
                                  padding: "2px 0 2px 6px",
                                  borderLeft: "2px solid rgba(234,88,12,0.22)",
                                  marginTop: 2,
                                }}
                              >
                                <div
                                  style={{
                                    flexBasis: "100%",
                                    fontSize: 10.5,
                                    fontWeight: 600,
                                    color: "#78716C",
                                    letterSpacing: "0.03em",
                                    textTransform: "uppercase",
                                    marginBottom: 2,
                                  }}
                                >
                                  Target level for {expCat.label}
                                </div>
                                {EXPERIENCE_LEVELS.map((level) => {
                                  const catId = expandedExperienceCategory!;
                                  const selectedLevel =
                                    experienceLevelByCategory[catId] === level.id;
                                  return (
                                    <motion.button
                                      key={`${catId}-${level.id}`}
                                      type="button"
                                      whileTap={{ scale: 0.97 }}
                                      onClick={() => {
                                        setExperienceLevelByCategory((prev) => ({
                                          ...prev,
                                          [catId]: level.id,
                                        }));
                                        setExpandedExperienceCategory(null);
                                      }}
                                      style={{
                                        minHeight: 34,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 6,
                                        padding: "7px 10px",
                                        borderRadius: 999,
                                        border: "none",
                                        background: selectedLevel
                                          ? "rgba(234,88,12,0.14)"
                                          : "rgba(28,25,23,0.04)",
                                        color: selectedLevel ? "#C2410C" : "#57534E",
                                        fontSize: 11.5,
                                        fontWeight: selectedLevel ? 700 : 600,
                                        letterSpacing: "-0.01em",
                                        cursor: "pointer",
                                        transition:
                                          "border-color 0.18s, background 0.18s, color 0.18s",
                                        fontFamily: "Inter, sans-serif",
                                        whiteSpace: "nowrap",
                                        flexShrink: 0,
                                      }}
                                    >
                                      <span style={{ fontSize: 15, lineHeight: 1 }}>
                                        {level.emoji}
                                      </span>
                                      {level.label} ({level.subLabel})
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })}

                  <AnimatePresence initial={false}>
                    {selectedCategories.includes("other") && (
                      <motion.div
                        key="other-dept-panel"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          flexBasis: "100%",
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            marginTop: 2,
                            padding: "14px 14px 16px",
                            borderRadius: 14,
                            border: `1.5px solid rgba(194,65,12,0.12)`,
                            background: "white",
                            boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
                          }}
                        >
                          <label
                            htmlFor="other-department-name"
                            style={{
                              display: "block",
                              fontSize: 12,
                              fontWeight: 600,
                              color: C.textMuted,
                              letterSpacing: "-0.01em",
                              lineHeight: 1.35,
                              marginBottom: 6,
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            Specify department
                          </label>
                          <input
                            ref={otherDepartmentInputRef}
                            id="other-department-name"
                            type="text"
                            value={otherDepartmentLabel}
                            onChange={(e) => setOtherDepartmentLabel(e.target.value)}
                            placeholder="e.g. Education, Research"
                            autoComplete="off"
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              padding: "11px 12px",
                              borderRadius: 12,
                              border: `1.5px solid ${C.border}`,
                              fontSize: 14,
                              fontWeight: 500,
                              color: C.textPrimary,
                              fontFamily: "Inter, sans-serif",
                              letterSpacing: "-0.01em",
                              background: "rgba(255,255,255,0.95)",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {collapsedDepartmentCount > 0 ? (
                  <div style={{ margin: "0 0 16px" }}>
                    <button
                      type="button"
                      onClick={() => setShowAllDepartments((v) => !v)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 0",
                        border: "none",
                        background: "transparent",
                        color: C.brand,
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <ChevronDown
                        size={16}
                        strokeWidth={2}
                        style={{
                          transform: showAllDepartments ? "rotate(180deg)" : "none",
                          transition: "transform 0.2s ease",
                        }}
                      />
                      {showAllDepartments
                        ? "Show fewer departments"
                        : `Show all ${collapsedDepartmentCount} more departments`}
                    </button>
                  </div>
                ) : null}

                <AnimatePresence>
                  {selectedCategories.some((c) => c !== "other") && (
                    <motion.div
                      key="roles-by-category"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
                      <SectionLabel>Roles by department</SectionLabel>
                      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {selectedCategories
                          .filter((id) => id !== "other")
                          .map((catId, deptIdx, deptList) => {
                          const meta = getCategoryMeta(catId);
                          const Icon = meta?.icon;
                          const title = meta?.label ?? "Department";
                          const picked = rolesByCategory[catId] ?? [];
                          const preset = getPresetRoles(catId);
                          const capReached = picked.length >= MAX_ROLES_PER_CATEGORY;

                          return (
                            <div key={catId}>
                              <div
                                style={{
                                  padding: "10px 0 12px",
                                }}
                              >
                              <div style={{
                                display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                                gap: 10, marginBottom: 10,
                              }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                                  {Icon && (
                                    <div style={{
                                      width: 30, height: 30, borderRadius: 8,
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                      background: "rgba(234,88,12,0.07)",
                                      flexShrink: 0,
                                    }}>
                                      <Icon size={15} strokeWidth={2} color={C.brand} />
                                    </div>
                                  )}
                                  <div style={{ minWidth: 0 }}>
                                    <p style={{
                                      fontSize: "14px", fontWeight: 700, color: C.textPrimary,
                                      letterSpacing: "-0.02em", lineHeight: 1.25, margin: 0,
                                    }}>
                                      {title}
                                    </p>
                                    <p style={{
                                      fontSize: "11px", color: C.textSec, margin: "4px 0 0",
                                      letterSpacing: "0.02em",
                                    }}>
                                      {picked.length}/{MAX_ROLES_PER_CATEGORY} role{MAX_ROLES_PER_CATEGORY === 1 ? "" : "s"} selected
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {preset.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                  {preset.map((r) => {
                                    const sel = picked.includes(r);
                                    return (
                                      <Pill
                                        key={r}
                                        label={r}
                                        selected={sel}
                                        disabled={capReached && !sel}
                                        onClick={() => toggleRoleForCategory(catId, r)}
                                      />
                                    );
                                  })}
                                  {picked
                                    .filter((r) => !preset.includes(r))
                                    .map((r) => (
                                      <Pill
                                        key={r}
                                        label={r}
                                        selected
                                        onClick={() => toggleRoleForCategory(catId, r)}
                                      />
                                    ))}
                                </div>
                              )}

                              {preset.length === 0 && picked.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                  {picked.map((r) => (
                                    <Pill
                                      key={r}
                                      label={r}
                                      selected
                                      onClick={() => toggleRoleForCategory(catId, r)}
                                    />
                                  ))}
                                </div>
                              )}

                              {(() => {
                                const roleQuery = customRoleByCategory[catId] ?? "";
                                const roleQueryTrimmed = roleQuery.trim();
                                const isOtherCategory = catId === "other";
                                const isRoleInputOpen = isOtherCategory || expandedRoleInputCategory === catId;
                                const matches = (preset ?? [])
                                  .filter((r) =>
                                    r.toLowerCase().includes(roleQueryTrimmed.toLowerCase()) &&
                                    !picked.includes(r)
                                  )
                                  .slice(0, 6);
                                const showDropdown = isRoleInputOpen && !capReached && roleQueryTrimmed.length > 0;
                                return (
                                  <div style={{ position: "relative" }}>
                                    {!isOtherCategory && !isRoleInputOpen && (
                                      <button
                                        type="button"
                                        onClick={() => setExpandedRoleInputCategory(catId)}
                                        disabled={capReached}
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 6,
                                          padding: "9px 14px",
                                          borderRadius: 100,
                                          border: `1.5px dashed ${C.border}`,
                                          background: "rgba(255,255,255,0.6)",
                                          color: C.textMuted,
                                          fontSize: "13px",
                                          fontWeight: 500,
                                          letterSpacing: "-0.01em",
                                          cursor: capReached ? "not-allowed" : "pointer",
                                          opacity: capReached ? 0.45 : 1,
                                          fontFamily: "Inter, sans-serif",
                                        }}
                                      >
                                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                                          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                        </svg>
                                        Add role
                                      </button>
                                    )}

                                    <AnimatePresence>
                                      {isRoleInputOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, y: 6 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -4 }}
                                          transition={{ duration: 0.2 }}
                                          style={{ opacity: capReached ? 0.45 : 1 }}
                                        >
                                          <div style={{
                                            borderRadius: 16,
                                            background: "white",
                                            border: `1.5px solid ${C.border}`,
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                            overflow: "hidden",
                                          }}>
                                            <div style={{ padding: "10px 12px" }}>
                                              <input
                                                ref={(el) => {
                                                  if (!isOtherCategory) roleInputRefs.current[catId] = el;
                                                }}
                                                id={`role-input-${catId}`}
                                                value={roleQuery}
                                                placeholder="Add a role"
                                                disabled={capReached}
                                                onChange={(e) =>
                                                  setCustomRoleByCategory((prev) => ({
                                                    ...prev,
                                                    [catId]: e.target.value,
                                                  }))
                                                }
                                                onKeyDown={(e) => {
                                                  if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    if (matches.length > 0) addCustomRoleForCategory(catId, matches[0]);
                                                    else addCustomRoleForCategory(catId, roleQueryTrimmed);
                                                  } else if (!isOtherCategory && e.key === "Escape") {
                                                    setExpandedRoleInputCategory(null);
                                                  }
                                                }}
                                                style={{
                                                  width: "100%",
                                                  border: "none",
                                                  outline: "none",
                                                  fontSize: 14,
                                                  fontWeight: 500,
                                                  color: C.textPrimary,
                                                  fontFamily: "Inter, sans-serif",
                                                  letterSpacing: "-0.01em",
                                                  background: "transparent",
                                                }}
                                              />
                                            </div>

                                        {showDropdown && (
                                          <div style={{
                                            borderTop: `1px solid ${C.border}`,
                                            maxHeight: 170,
                                            overflowY: "auto",
                                            background: "white",
                                          }}>
                                            {matches.map((r) => (
                                              <button
                                                key={r}
                                                onClick={() => addCustomRoleForCategory(catId, r)}
                                                style={{
                                                  width: "100%",
                                                  textAlign: "left",
                                                  padding: "10px 12px",
                                                  border: "none",
                                                  background: "transparent",
                                                  cursor: "pointer",
                                                  fontFamily: "Inter, sans-serif",
                                                  color: C.textPrimary,
                                                  fontSize: 13,
                                                  letterSpacing: "-0.01em",
                                                }}
                                              >
                                                {r}
                                              </button>
                                            ))}
                                            <button
                                              onClick={() => addCustomRoleForCategory(catId, roleQueryTrimmed)}
                                              style={{
                                                width: "100%",
                                                textAlign: "left",
                                                padding: "10px 12px",
                                                border: "none",
                                                background: "transparent",
                                                cursor: "pointer",
                                                fontFamily: "Inter, sans-serif",
                                                color: C.textMuted,
                                                fontSize: 13,
                                                letterSpacing: "-0.01em",
                                              }}
                                            >
                                              Add “{roleQueryTrimmed}”
                                            </button>
                                          </div>
                                        )}
                                            {isOtherCategory && picked.length > 0 && (
                                              <div
                                                style={{
                                                  padding: "12px 14px 12px",
                                                  borderTop: `1px solid ${C.border}`,
                                                  background: "rgba(253,251,248,0.85)",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    fontSize: 10.5,
                                                    fontWeight: 600,
                                                    color: "#78716C",
                                                    letterSpacing: "0.03em",
                                                    textTransform: "uppercase",
                                                    marginBottom: 8,
                                                  }}
                                                >
                                                  {picked.length === 1
                                                    ? "Target experience for this role"
                                                    : "Target experience for these roles"}
                                                </div>
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                                  {EXPERIENCE_LEVELS.map((level) => {
                                                    const selectedLevel =
                                                      experienceLevelByCategory[catId] === level.id;
                                                    return (
                                                      <motion.button
                                                        key={`other-card-${level.id}`}
                                                        type="button"
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() =>
                                                          setExperienceLevelByCategory((prev) => ({
                                                            ...prev,
                                                            [catId]: level.id,
                                                          }))
                                                        }
                                                        style={{
                                                          minHeight: 34,
                                                          display: "inline-flex",
                                                          alignItems: "center",
                                                          justifyContent: "center",
                                                          gap: 6,
                                                          padding: "7px 10px",
                                                          borderRadius: 999,
                                                          border: "none",
                                                          background: selectedLevel
                                                            ? "rgba(234,88,12,0.14)"
                                                            : "rgba(28,25,23,0.04)",
                                                          color: selectedLevel ? "#C2410C" : "#57534E",
                                                          fontSize: 11.5,
                                                          fontWeight: selectedLevel ? 700 : 600,
                                                          letterSpacing: "-0.01em",
                                                          cursor: "pointer",
                                                          transition:
                                                            "border-color 0.18s, background 0.18s, color 0.18s",
                                                          fontFamily: "Inter, sans-serif",
                                                          whiteSpace: "nowrap",
                                                          flexShrink: 0,
                                                        }}
                                                      >
                                                        <span style={{ fontSize: 15, lineHeight: 1 }}>
                                                          {level.emoji}
                                                        </span>
                                                        {level.label} ({level.subLabel})
                                                      </motion.button>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })()}

                              </div>
                              {deptIdx < deptList.length - 1 && (
                                <div style={{ height: 1, background: C.border, margin: "0 0 12px" }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ══ STEP 2: Priorities ══════════════════════════════════════ */}
            {step === 2 && (
              <motion.div key="s3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Heading */}
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{
                    fontSize: "clamp(19px, 5.5vw, 22px)", fontWeight: 800,
                    color: C.textPrimary, letterSpacing: "-0.04em",
                    lineHeight: 1.25, marginBottom: 8,
                  }}>
                    Tell us how you work best
                  </h2>
                  <p style={{ fontSize: "13px", color: C.textMuted, letterSpacing: "-0.01em" }}>
                    Choose all answers that match you
                  </p>
                </div>

                {/* Question groups */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  {PRIORITY_QUESTIONS.map((group) => (
                    <div key={group.id}>
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: C.textPrimary,
                          letterSpacing: "-0.02em",
                          margin: "0 0 8px",
                        }}
                      >
                        {group.question}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {group.optionIds.map((optId) => {
                          const p = PRIORITIES.find((item) => item.id === optId);
                          if (!p) return null;
                          return (
                            <Pill
                              key={p.id}
                              label={p.label}
                              icon={p.icon}
                              selected={priorities.includes(p.id)}
                              onClick={() => togglePriority(p.id)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* ══ STEP 3: Timeline + salary + work setup ═══════════════════ */}
            {step === 3 && (
              <motion.div key="s3-combined"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ marginBottom: 18 }}>
                  <h2 style={{
                    fontSize: "clamp(19px, 5.5vw, 22px)", fontWeight: 800,
                    color: C.textPrimary, letterSpacing: "-0.04em",
                    lineHeight: 1.25, marginBottom: 6,
                  }}>
                    Final preferences before matching
                  </h2>
                  <p style={{ fontSize: "13px", color: C.textMuted, letterSpacing: "-0.01em" }}>
                    Quick picks to personalize your job matches.
                  </p>
                </div>

                <div style={{ ...prefsStep3ContentShell }}>
                <div style={{ paddingTop: 4, paddingBottom: 4 }}>
                  <SectionLabel>Notice period</SectionLabel>
                  <div
                    style={
                      isDesktopLayout
                        ? {
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "nowrap",
                            gap: 8,
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            overflowX: "auto",
                            overflowY: "hidden",
                            WebkitOverflowScrolling: "touch",
                            paddingBottom: 2,
                          }
                        : {
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: 8,
                          }
                    }
                  >
                    {([
                      { id: "immediately", label: "Immediately", emoji: "🚀" },
                      { id: "1month", label: "Around 1 month", emoji: "⏳" },
                      { id: "2months", label: "Around 2 months", emoji: "🗓️" },
                      { id: "3months", label: "Around 3 months", emoji: "📅" },
                    ] as const).map((opt) => {
                      const sel = switchTimeline === opt.id;
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSwitchTimeline(opt.id)}
                          style={{
                            ...(isDesktopLayout
                              ? { width: "auto", flex: "0 0 auto" }
                              : { width: "100%" }),
                            minHeight: 40,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            padding: isDesktopLayout ? "8px 10px" : "9px 12px",
                            borderRadius: 999,
                            border: `1.5px solid ${sel ? C.brandBorder : C.border}`,
                            background: sel ? C.brandBg : "white",
                            color: sel ? C.brand : C.textPrimary,
                            fontSize: "13px",
                            fontWeight: 600,
                            letterSpacing: "-0.01em",
                            cursor: "pointer",
                            transition: "border-color 0.18s, background 0.18s, color 0.18s",
                            fontFamily: "Inter, sans-serif",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: 16, lineHeight: 1 }}>{opt.emoji}</span>
                          {opt.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                </div>

                <PrefsStep3GradientRule />

                <div style={{ ...prefsStep3ContentShell }}>
                <div style={{ paddingTop: 6, paddingBottom: 6 }}>
                  <SectionLabel>Expected salary range</SectionLabel>
                  <div style={{
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        id="zf-salary-currency"
                        className="zf-salary-currency-trigger"
                        aria-label="Salary display currency"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          margin: 0,
                          minHeight: 44,
                          padding: "8px 4px 8px 2px",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "clamp(12px, 3.8vw, 14px)",
                          fontWeight: 600,
                          color: C.brand,
                          letterSpacing: "-0.01em",
                          WebkitTapHighlightColor: "rgba(234, 88, 12, 0.15)",
                          touchAction: "manipulation",
                        }}
                      >
                        {SALARY_CURRENCY_OPTIONS.find((o) => o.code === salaryCurrency)?.label ?? "Indian Rupee (₹)"}
                        <ChevronDown size={17} strokeWidth={2.25} aria-hidden style={{ flexShrink: 0, opacity: 0.92 }} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={8}
                      collisionPadding={16}
                      className="zf-salary-currency-menu z-[120]"
                      style={{
                        backgroundColor: C.bg,
                        border: `1px solid ${C.border}`,
                        borderRadius: 12,
                        boxShadow: "0 8px 28px rgba(28,25,23,0.12)",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <DropdownMenuRadioGroup
                        value={salaryCurrency}
                        onValueChange={(v) => setSalaryCurrency(v as SalaryCurrencyCode)}
                      >
                        {SALARY_CURRENCY_OPTIONS.map((opt) => (
                          <DropdownMenuRadioItem
                            key={opt.code}
                            value={opt.code}
                            className="cursor-pointer outline-none focus-visible:bg-orange-50/80"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {opt.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: isDesktopLayout ? "flex-start" : "space-between",
                      alignItems: "flex-end",
                      gap: isDesktopLayout ? 20 : 12,
                      marginBottom: 8,
                      flexWrap: isDesktopLayout ? "wrap" : "nowrap",
                      width: isDesktopLayout ? "auto" : "100%",
                      maxWidth: "100%",
                    }}
                  >
                  <div
                    style={{
                      flex: isDesktopLayout ? "0 0 auto" : 1,
                      minWidth: 0,
                      maxWidth: isDesktopLayout ? 200 : 320,
                      width: isDesktopLayout ? "auto" : undefined,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isDesktopLayout ? "flex-start" : undefined,
                    }}
                  >
                    <p style={{ fontSize: "11px", color: C.textSec, marginBottom: 6, letterSpacing: "0.02em", textAlign: "left" }}>
                      Minimum
                    </p>
                    <label
                      htmlFor="zf-salary-min-input"
                      className={`zf-salary-lpa-field${isDesktopLayout ? " zf-salary-lpa-field--compact" : ""}`}
                      style={{
                        fontSize: "clamp(15px, 4.2vw, 19px)",
                        fontWeight: 800,
                        color: C.textPrimary,
                        letterSpacing: "-0.04em",
                        width: "100%",
                        maxWidth: isDesktopLayout ? 188 : "100%",
                      }}
                    >
                      <input
                        id="zf-salary-min-input"
                        className="zf-salary-lpa"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                        value={salMinEditing ? salMinDraft : formatSalaryAnnualDisplay(salMin, salaryCurrency)}
                        aria-label={`Minimum annual salary, ${salaryCurrency}`}
                        onFocus={() => {
                          setSalMinEditing(true);
                          setSalMinDraft(String(Math.round(lpaToAnnualAmount(salMin, salaryCurrency))));
                        }}
                        onChange={(e) => setSalMinDraft(sanitizeAnnualDigits(e.target.value))}
                        onBlur={() => {
                          commitSalMinFromDraft(salMinDraft);
                          setSalMinEditing(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitSalMinFromDraft(salMinDraft);
                            setSalMinEditing(false);
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        style={{
                          width: "100%",
                          minWidth: 0,
                          padding: 0,
                          margin: 0,
                          border: "none",
                          background: "transparent",
                          font: "inherit",
                          fontWeight: 600,
                          color: "inherit",
                          letterSpacing: "inherit",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      />
                    </label>
                  </div>
                  <div
                    style={{
                      flex: isDesktopLayout ? "0 0 auto" : 1,
                      minWidth: 0,
                      maxWidth: isDesktopLayout ? 200 : 320,
                      width: isDesktopLayout ? "auto" : undefined,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <p style={{ fontSize: "11px", color: C.textSec, marginBottom: 6, letterSpacing: "0.02em", width: "100%", textAlign: "right" }}>
                      Maximum
                    </p>
                    <label
                      htmlFor="zf-salary-max-input"
                      className={`zf-salary-lpa-field zf-salary-lpa-field--end${isDesktopLayout ? " zf-salary-lpa-field--compact" : ""}`}
                      style={{
                        fontSize: "clamp(15px, 4.2vw, 19px)",
                        fontWeight: 800,
                        color: C.textPrimary,
                        letterSpacing: "-0.04em",
                        width: "100%",
                        maxWidth: isDesktopLayout ? 188 : "100%",
                      }}
                    >
                      <input
                        id="zf-salary-max-input"
                        className="zf-salary-lpa"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                        value={salMaxEditing ? salMaxDraft : formatSalaryAnnualDisplay(salMax, salaryCurrency)}
                        aria-label={`Maximum annual salary, ${salaryCurrency}`}
                        onFocus={() => {
                          setSalMaxEditing(true);
                          setSalMaxDraft(String(Math.round(lpaToAnnualAmount(salMax, salaryCurrency))));
                        }}
                        onChange={(e) => setSalMaxDraft(sanitizeAnnualDigits(e.target.value))}
                        onBlur={() => {
                          commitSalMaxFromDraft(salMaxDraft);
                          setSalMaxEditing(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitSalMaxFromDraft(salMaxDraft);
                            setSalMaxEditing(false);
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        style={{
                          width: "100%",
                          minWidth: 0,
                          padding: 0,
                          margin: 0,
                          border: "none",
                          background: "transparent",
                          font: "inherit",
                          fontWeight: 600,
                          color: "inherit",
                          letterSpacing: "inherit",
                          fontVariantNumeric: "tabular-nums",
                          textAlign: "right",
                        }}
                      />
                    </label>
                  </div>
                  </div>
                  {salaryRangeError && (
                    <p
                      role="alert"
                      style={{
                        marginTop: 0,
                        marginBottom: 0,
                        color: "#B42318",
                        fontSize: 12,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.45,
                        fontWeight: 500,
                      }}
                    >
                      {salaryRangeError}
                    </p>
                  )}
                </div>
                </div>

                <PrefsStep3GradientRule />

                <div style={{ ...prefsStep3ContentShell }}>
                <div style={{ paddingTop: 6, paddingBottom: 4 }}>
                  <SectionLabel>Preferred work setup</SectionLabel>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: isDesktopLayout ? "repeat(3, minmax(0, 1fr))" : "1fr",
                      gap: isDesktopLayout ? 16 : 10,
                      marginBottom: 0,
                      width: "100%",
                    }}
                  >
                  {WORK_SETUPS.map((o) => {
                    const selected = workSetups.includes(o.id);
                    const SetupIcon = o.id === "onsite" ? Building2 : o.id === "hybrid" ? Layers : Globe;
                    const blurb =
                      o.id === "remote"
                        ? "Work from anywhere"
                        : o.id === "hybrid"
                          ? "Split between office and home"
                          : "Work primarily from the office";
                    const check = (
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 6,
                          border: `1.5px solid ${selected ? "#EA580C" : "rgba(28,25,23,0.22)"}`,
                          background: selected ? "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "background 0.18s, border-color 0.18s",
                        }}
                      >
                        {selected && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path
                              d="M2 5.2l2 2.1L8.3 2.8"
                              stroke="white"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    );
                    return (
                      <motion.button
                        key={o.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleWorkSetup(o.id)}
                        aria-pressed={selected}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: isDesktopLayout ? "20px 20px 22px" : "14px 14px",
                          borderRadius: isDesktopLayout ? 18 : 16,
                          border: `1.5px solid ${selected ? C.brandBorder : C.border}`,
                          background: selected ? C.brandBg : "white",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: isDesktopLayout ? "column" : "row",
                          alignItems: isDesktopLayout ? "stretch" : "center",
                          justifyContent: isDesktopLayout ? "flex-start" : "space-between",
                          gap: isDesktopLayout ? 0 : 12,
                          minHeight: isDesktopLayout ? 148 : undefined,
                          transition: "border-color 0.18s, background 0.18s",
                          fontFamily: "Inter, sans-serif",
                          boxShadow: isDesktopLayout ? "0 1px 0 rgba(28,25,23,0.04)" : undefined,
                        }}
                      >
                        {isDesktopLayout ? (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                gap: 12,
                                marginBottom: 14,
                              }}
                            >
                              <div
                                style={{
                                  width: 46,
                                  height: 46,
                                  borderRadius: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: selected ? "rgba(234,88,12,0.12)" : "rgba(28,25,23,0.04)",
                                  color: selected ? "#C2410C" : "#78716C",
                                  flexShrink: 0,
                                }}
                              >
                                <SetupIcon size={22} strokeWidth={1.75} aria-hidden />
                              </div>
                              {check}
                            </div>
                            <div style={{ fontSize: 17, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.03em", lineHeight: 1.25 }}>
                              {o.label}
                            </div>
                            <div style={{ fontSize: 13, color: C.textMuted, letterSpacing: "-0.01em", lineHeight: 1.5, marginTop: 8 }}>
                              {blurb}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.02em" }}>
                                {o.label}
                              </div>
                              <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: "-0.01em" }}>{blurb}</div>
                            </div>
                            {check}
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                  </div>

                  <AnimatePresence>
                    {showLocationPicker && (
                      <motion.div
                        key="loc-picker"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        style={{ marginTop: 12 }}
                      >
                        <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
                        <SectionLabel>Preferred Job Locations</SectionLabel>

                      {locations.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                          {locations.map(loc => (
                            <span
                              key={loc}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "7px 10px",
                                borderRadius: 999,
                                background: "rgba(234,88,12,0.10)",
                                border: "1px solid rgba(234,88,12,0.40)",
                                color: "#7C2D12",
                                fontSize: 13,
                                fontWeight: 500,
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {loc}
                              <button
                                onClick={() => removeLocation(loc)}
                                style={{
                                  width: 18, height: 18,
                                  borderRadius: "50%",
                                  border: "none",
                                  background: "rgba(124,45,18,0.10)",
                                  color: "#7C2D12",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0,
                                }}
                              >
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 2l6 6M8 2L2 8" stroke="#7C2D12" strokeWidth="1.6"
                                    strokeLinecap="round" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{
                        borderRadius: 16,
                        background: "white",
                        border: `1.5px solid ${C.border}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        overflow: "hidden",
                      }}>
                        <div style={{ padding: "10px 12px" }}>
                          <input
                            value={locQuery}
                            placeholder="Search city (e.g., Bangalore)"
                            onChange={(e) => setLocQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { e.preventDefault(); addLocation(locQuery); }
                            }}
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              fontSize: 14,
                              fontWeight: 500,
                              color: C.textPrimary,
                              fontFamily: "Inter, sans-serif",
                              letterSpacing: "-0.01em",
                              background: "transparent",
                            }}
                          />
                        </div>

                        {locQuery.trim().length > 0 && (
                          <div style={{
                            borderTop: `1px solid ${C.border}`,
                            maxHeight: 180,
                            overflowY: "auto",
                            background: "white",
                          }}>
                            {INDIA_CITIES
                              .filter(c => c.toLowerCase().includes(locQuery.trim().toLowerCase()))
                              .slice(0, 8)
                              .map(c => (
                                <button
                                  key={c}
                                  onClick={() => addLocation(c)}
                                  style={{
                                    width: "100%",
                                    textAlign: "left",
                                    padding: "10px 12px",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontFamily: "Inter, sans-serif",
                                    color: C.textPrimary,
                                    fontSize: 13,
                                    letterSpacing: "-0.01em",
                                  }}
                                >
                                  {c}
                                </button>
                              ))}

                            {INDIA_CITIES.filter(c => c.toLowerCase().includes(locQuery.trim().toLowerCase())).length === 0 && (
                              <button
                                onClick={() => addLocation(locQuery)}
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  padding: "10px 12px",
                                  border: "none",
                                  background: "transparent",
                                  cursor: "pointer",
                                  fontFamily: "Inter, sans-serif",
                                  color: C.textMuted,
                                  fontSize: 13,
                                  letterSpacing: "-0.01em",
                                }}
                              >
                                Add “{locQuery.trim()}”
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>

      {/* ── Bottom navigation footer ──────────────────────────────────────── */}
      <div style={{
        marginTop: isDesktopLayout ? 14 : 16,
        padding: isDesktopLayout
          ? "16px 0 calc(12px + env(safe-area-inset-bottom))"
          : "24px 20px calc(20px + env(safe-area-inset-bottom))",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}>
        {/* Previous */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          aria-label="Go back"
          style={{
            minHeight: "44px",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "10px 10px", borderRadius: 10,
            border: "none", background: "transparent",
            color: C.textMuted, fontSize: "14px", fontWeight: 500,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ letterSpacing: "-0.01em" }}>Previous</span>
        </motion.button>

        {/* Continue */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={!canContinue}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "13px 28px", borderRadius: 14, border: "none",
            background: canContinue ? "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)" : "rgba(28,25,23,0.2)",
            color: "white", fontSize: "14px", fontWeight: 600,
            letterSpacing: "-0.01em", cursor: canContinue ? "pointer" : "not-allowed",
            transition: "background 0.2s, box-shadow 0.2s",
            fontFamily: "Inter, sans-serif",
            boxShadow:
              canContinue && !isDesktopLayout ? "0 4px 16px rgba(234,88,12,0.35)" : "none",
          }}
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2l5 5-5 5" stroke="white" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}