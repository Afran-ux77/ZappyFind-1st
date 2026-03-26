import { useState, useEffect, useRef } from "react";
import type { ReactNode, ElementType, CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { JobPreferences } from "./WelcomeScreen";
import {
  Heart, Crown, TrendingUp, Layers, Lightbulb, Zap, Rocket, Flame,
  Building2, Cpu, Clock, Gift, Globe, Scale,
  Code2, Palette, Database, Package, Megaphone, Landmark, ShoppingBag,
  Users, Briefcase, Settings2, Headphones, ShieldCheck, Activity, Wrench,
  FlaskConical, BarChart3, UserCheck, Handshake, HeartPulse, ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

/* ── Step 1 — Priorities ───────────────────────────────────────────────────── */
const PRIORITIES = [
  { id: "meaningful",  label: "Meaningful work",       icon: Heart       },
  { id: "leaders",     label: "Experienced leaders",   icon: Crown       },
  { id: "investors",   label: "Top investors",         icon: TrendingUp  },
  { id: "manyhats",    label: "Wear many hats",        icon: Layers      },
  { id: "smart",       label: "Smart teammates",       icon: Lightbulb   },
  { id: "challenge",   label: "Challenging work",      icon: Zap         },
  { id: "growth",      label: "Growing fast",          icon: Rocket      },
  { id: "startup",     label: "Cool startup",          icon: Flame       },
  { id: "stable",      label: "Stable company",        icon: Building2   },
  { id: "tech",        label: "Innovative technology", icon: Cpu         },
  { id: "flexible",    label: "Flexible hours",        icon: Clock       },
  { id: "benefits",    label: "Great benefits",        icon: Gift        },
  { id: "remote",      label: "Remote friendly",       icon: Globe       },
  { id: "wlb",         label: "Work-life balance",     icon: Scale       },
];

/* ── Step 2 — Job categories & sub-roles ───────────────────────────────────── */
const CATEGORIES = [
  { id: "swe",        label: "Software Engineering",  icon: Code2       },
  { id: "design",     label: "Design",                icon: Palette     },
  { id: "data",       label: "Data",                  icon: BarChart3   },
  { id: "product",    label: "Product",               icon: Package     },
  { id: "marketing",  label: "Marketing",             icon: Megaphone   },
  { id: "finance",    label: "Finance",               icon: Landmark    },
  { id: "sales",      label: "Sales",                 icon: ShoppingBag },
  { id: "hr",         label: "Human Resources",       icon: Users       },
  { id: "consulting", label: "Consulting",            icon: Briefcase   },
  { id: "ops",        label: "Operations & Strategy", icon: Settings2   },
  { id: "cs",         label: "Customer Success",      icon: Headphones  },
  { id: "legal",      label: "Legal",                 icon: Scale       },
  { id: "security",   label: "Security",              icon: ShieldCheck },
  { id: "health",     label: "Healthcare",            icon: HeartPulse  },
  { id: "misc",       label: "Misc. Engineering",     icon: Wrench      },
  { id: "other",      label: "Other",                 icon: FlaskConical },
];

const SUB_ROLES: Record<string, string[]> = {
  swe:        ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Mobile Developer", "DevOps Engineer", "QA Engineer", "Platform Engineer"],
  design:     ["Product Designer", "UI Designer", "UX Designer", "Brand Designer", "Motion Designer", "Graphic Designer"],
  data:       ["Data Analyst", "Data Scientist", "ML Engineer", "Data Engineer", "BI Analyst"],
  product:    ["Product Manager", "Associate PM", "Growth PM", "Technical PM", "Senior PM"],
  marketing:  ["Growth Marketer", "Content Marketer", "SEO Specialist", "Performance Marketer", "Brand Marketer"],
  finance:    ["Financial Analyst", "Investment Analyst", "Accountant", "Controller", "CFO"],
  sales:      ["Account Executive", "SDR", "Enterprise Sales", "Inside Sales", "VP of Sales"],
  hr:         ["HR Manager", "Recruiter", "L&D Specialist", "HRBP", "Talent Acquisition"],
  consulting: ["Strategy Consultant", "Management Consultant", "Associate Consultant", "Business Analyst"],
  ops:        ["Operations Manager", "Business Analyst", "Chief of Staff", "Strategy Analyst"],
  cs:         ["Customer Success Manager", "Account Manager", "Support Lead", "Onboarding Specialist"],
  legal:      ["Corporate Lawyer", "Paralegal", "Compliance Officer", "Legal Counsel"],
  security:   ["Security Engineer", "Security Analyst", "Penetration Tester", "CISO"],
  health:     ["Doctor", "Nurse", "Healthcare Analyst", "Medical Technologist", "Pharmacist"],
  misc:       ["Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Chemical Engineer"],
};

const MAX_JOB_CATEGORIES = 3;
const MAX_ROLES_PER_CATEGORY = 3;

function getCategoryMeta(id: string) {
  return CATEGORIES.find((c) => c.id === id);
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

/** Digits only, max 3 (0–100 LPA). */
function sanitizeLpaDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 3);
}

/** Major currencies; slider stays in INR LPA; display converts for non-INR. */
type SalaryCurrencyCode =
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

/** Convert LPA (lakhs of INR / year) to annual amount in selected currency. */
function lakhsToAnnualInCurrency(lakhs: number, code: SalaryCurrencyCode): number {
  if (code === "INR") return lakhs;
  const annualInr = lakhs * 100_000;
  return annualInr / INR_PER_UNIT[code];
}

/** Format salary display for min/max labels (slider values are always LPA). */
function formatSalaryStepDisplay(lakhs: number, code: SalaryCurrencyCode): string {
  if (code === "INR") {
    return `₹${lakhs}LPA`;
  }
  const annual = lakhsToAnnualInCurrency(lakhs, code);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      notation: annual >= 1000 ? "compact" : "standard",
      maximumFractionDigits: annual >= 1000 ? 1 : 0,
    }).format(annual);
  } catch {
    return `${annual.toFixed(0)} ${code}`;
  }
}

/** Scale endpoints under the slider (0 … max LPA). */
function formatSalaryScaleEndpoint(lakhs: number, code: SalaryCurrencyCode): string {
  if (code === "INR") {
    return lakhs === 0 ? "₹0" : `₹${lakhs}LPA`;
  }
  const annual = lakhsToAnnualInCurrency(lakhs, code);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      notation: annual >= 1000 ? "compact" : "standard",
      maximumFractionDigits: annual >= 1000 ? 1 : 0,
    }).format(annual);
  } catch {
    return `${annual.toFixed(0)}`;
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

/* ── Types ──────────────────────────────────────────────────────────────────── */
type Step = 1 | 2 | 3 | 4 | 5;

interface Props {
  onComplete: (prefs: JobPreferences) => void;
  onBack: () => void;
  firstName?: string;
  /** When returning from Welcome (step 6), reopen at this preference step (default 1). */
  resumeAtStep?: Step;
}

/* ═════════════════════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════════════════════ */
export function JobPreferencesScreen({ onComplete, onBack, firstName, resumeAtStep }: Props) {
  const [step,       setStep]       = useState<Step>(() => {
    if (resumeAtStep !== undefined && resumeAtStep >= 1 && resumeAtStep <= 5) return resumeAtStep;
    return 1;
  });
  const [priorities, setPriorities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [rolesByCategory, setRolesByCategory] = useState<Record<string, string[]>>({});
  const [customRoleByCategory, setCustomRoleByCategory] = useState<Record<string, string>>({});
  const [expandedRoleInputCategory, setExpandedRoleInputCategory] = useState<string | null>(null);
  const roleInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
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
  const salMinRef = useRef(salMin);
  const salMaxRef = useRef(salMax);
  const salMinAnimRaf = useRef<number | null>(null);
  const salMaxAnimRaf = useRef<number | null>(null);

  useEffect(() => {
    salMinRef.current = salMin;
  }, [salMin]);
  useEffect(() => {
    salMaxRef.current = salMax;
  }, [salMax]);

  const cancelSalMinAnim = () => {
    if (salMinAnimRaf.current != null) {
      cancelAnimationFrame(salMinAnimRaf.current);
      salMinAnimRaf.current = null;
    }
  };
  const cancelSalMaxAnim = () => {
    if (salMaxAnimRaf.current != null) {
      cancelAnimationFrame(salMaxAnimRaf.current);
      salMaxAnimRaf.current = null;
    }
  };

  const animateSalMinTo = (rawTarget: number) => {
    const to = Math.round(Math.max(SAL_MIN, Math.min(rawTarget, salMaxRef.current - SAL_GAP)));
    const from = Math.round(salMinRef.current);
    if (from === to) return;
    cancelSalMinAnim();
    const duration = Math.min(400, Math.max(160, Math.abs(to - from) * 20));
    const t0 = performance.now();
    const tickFrame = (now: number) => {
      const u = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - u) ** 3;
      const v = Math.round(from + (to - from) * eased);
      setSalMin(v);
      if (u < 1) {
        salMinAnimRaf.current = requestAnimationFrame(tickFrame);
      } else {
        setSalMin(to);
        salMinAnimRaf.current = null;
      }
    };
    salMinAnimRaf.current = requestAnimationFrame(tickFrame);
  };

  const animateSalMaxTo = (rawTarget: number) => {
    const to = Math.round(Math.min(SAL_MAX, Math.max(rawTarget, salMinRef.current + SAL_GAP)));
    const from = Math.round(salMaxRef.current);
    if (from === to) return;
    cancelSalMaxAnim();
    const duration = Math.min(400, Math.max(160, Math.abs(to - from) * 20));
    const t0 = performance.now();
    const tickFrame = (now: number) => {
      const u = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - u) ** 3;
      const v = Math.round(from + (to - from) * eased);
      setSalMax(v);
      if (u < 1) {
        salMaxAnimRaf.current = requestAnimationFrame(tickFrame);
      } else {
        setSalMax(to);
        salMaxAnimRaf.current = null;
      }
    };
    salMaxAnimRaf.current = requestAnimationFrame(tickFrame);
  };

  const commitSalMinFromDraft = (draft: string) => {
    cancelSalMinAnim();
    const t = sanitizeLpaDigits(draft).trim();
    const n = t === "" ? SAL_MIN : parseInt(t, 10);
    if (Number.isNaN(n)) return;
    setSalMin(n);
  };

  const commitSalMaxFromDraft = (draft: string) => {
    cancelSalMaxAnim();
    const t = sanitizeLpaDigits(draft).trim();
    const n = t === "" ? SAL_MAX : parseInt(t, 10);
    if (Number.isNaN(n)) return;
    setSalMax(n);
  };

  useEffect(() => {
    if (step !== 4) {
      if (salMinAnimRaf.current != null) cancelAnimationFrame(salMinAnimRaf.current);
      salMinAnimRaf.current = null;
      if (salMaxAnimRaf.current != null) cancelAnimationFrame(salMaxAnimRaf.current);
      salMaxAnimRaf.current = null;
      setSalMinEditing(false);
      setSalMaxEditing(false);
    }
  }, [step]);

  useEffect(() => () => {
    if (salMinAnimRaf.current != null) cancelAnimationFrame(salMinAnimRaf.current);
    if (salMaxAnimRaf.current != null) cancelAnimationFrame(salMaxAnimRaf.current);
  }, []);

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
      @keyframes zf-welcome-drift {
        0%   { background-position: 0% 0%; }
        14%  { background-position: 60% 15%; }
        28%  { background-position: 100% 50%; }
        42%  { background-position: 70% 90%; }
        57%  { background-position: 20% 100%; }
        71%  { background-position: 0% 60%; }
        85%  { background-position: 30% 20%; }
        100% { background-position: 0% 0%; }
      }
      @keyframes zf-glow-drift {
        0%   { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.75; }
        17%  { transform: translate(-18%, 22%) scale(1.08) rotate(1deg); opacity: 0.9; }
        33%  { transform: translate(-28%, 10%) scale(1.14) rotate(1.5deg); opacity: 1; }
        50%  { transform: translate(-8%, -14%) scale(1.08) rotate(0deg); opacity: 0.85; }
        67%  { transform: translate(16%, -8%) scale(0.96) rotate(-1deg); opacity: 0.92; }
        83%  { transform: translate(10%, 8%) scale(0.98) rotate(-0.5deg); opacity: 0.82; }
        100% { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.75; }
      }
      @keyframes zf-glow-drift-2 {
        0%   { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.75; }
        17%  { transform: translate(16%, -14%) scale(1.06) rotate(-1deg); opacity: 0.88; }
        33%  { transform: translate(8%, -26%) scale(1.12) rotate(-1.5deg); opacity: 1; }
        50%  { transform: translate(-12%, -8%) scale(1.08) rotate(0deg); opacity: 0.85; }
        67%  { transform: translate(-22%, 14%) scale(1.0) rotate(1deg); opacity: 0.92; }
        83%  { transform: translate(-8%, 10%) scale(0.97) rotate(0.5deg); opacity: 0.8; }
        100% { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.75; }
      }
      @keyframes zf-glow-drift-3 {
        0%   { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.7; }
        20%  { transform: translate(-12%, -18%) scale(1.1) rotate(1deg); opacity: 0.85; }
        40%  { transform: translate(6%, -24%) scale(1.16) rotate(1.5deg); opacity: 1; }
        60%  { transform: translate(18%, 4%) scale(1.06) rotate(-0.5deg); opacity: 0.88; }
        80%  { transform: translate(6%, 16%) scale(0.94) rotate(-1deg); opacity: 0.78; }
        100% { transform: translate(0%, 0%) scale(1) rotate(0deg); opacity: 0.7; }
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
        : prev.length < 3 ? [...prev, id] : prev
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

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_JOB_CATEGORIES) return prev;
      return [...prev, id];
    });
  };

  const toggleRoleForCategory = (catId: string, role: string) => {
    setRolesByCategory((prev) => {
      const cur = prev[catId] ?? [];
      if (cur.includes(role)) {
        return { ...prev, [catId]: cur.filter((x) => x !== role) };
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
  const hasAtLeastOneRole = selectedCategories.some(
    (cid) => (rolesByCategory[cid] ?? []).length > 0
  );
  const liveSalMin =
    salMinEditing
      ? (() => {
          const v = sanitizeLpaDigits(salMinDraft).trim();
          if (v === "") return null;
          const n = parseInt(v, 10);
          return Number.isNaN(n) ? null : n;
        })()
      : salMin;
  const liveSalMax =
    salMaxEditing
      ? (() => {
          const v = sanitizeLpaDigits(salMaxDraft).trim();
          if (v === "") return null;
          const n = parseInt(v, 10);
          return Number.isNaN(n) ? null : n;
        })()
      : salMax;
  const salaryRangeError =
    step === 4
      ? (() => {
          if (liveSalMin == null || liveSalMax == null) {
            return "Enter both minimum and maximum salary.";
          }
          if (liveSalMin < SAL_MIN || liveSalMax < SAL_MIN || liveSalMin > SAL_MAX || liveSalMax > SAL_MAX) {
            return "Salary values must be between 0 and 100 LPA.";
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
    (step === 1 && hasAtLeastOneRole) ||
    (step === 2 && priorities.length > 0) ||
    (step === 3 && switchTimeline !== null) ||
    (step === 4 && salaryRangeError === null) ||
    (step === 5 && workSetups.length > 0 && (!showLocationPicker || locations.length > 0));

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) {
      if (salaryRangeError) return;
      setStep(5);
    }
    else if (step === 5) {
      const cats = [...selectedCategories];
      const rbc: Record<string, string[]> = {};
      cats.forEach((cid) => {
        const rs = rolesByCategory[cid];
        if (rs && rs.length) rbc[cid] = [...rs];
      });
      const flatRoles = cats.flatMap((cid) => rolesByCategory[cid] ?? []);
      const firstCat = cats[0];
      onComplete({
        categories: cats.length ? cats : undefined,
        rolesByCategory: Object.keys(rbc).length ? rbc : undefined,
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
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
  };

  /* ── Salary percentages ─────────────────────────────────────────────────── */
  const salMinForSlider = clampSalaryLpa(salMin);
  const salMaxForSlider = clampSalaryLpa(salMax);
  const salMinPct = ((salMinForSlider - SAL_MIN) / (SAL_MAX - SAL_MIN)) * 100;
  const salMaxPct = ((salMaxForSlider - SAL_MIN) / (SAL_MAX - SAL_MIN)) * 100;
  const salTrackStartPct = Math.min(salMinPct, salMaxPct);
  const salTrackEndPct = Math.max(salMinPct, salMaxPct);

  /* ════════════════════════════════════════════════════════════════════════
    Main preference screen (steps 1–5 of 6; step 6 = upload resume in WelcomeScreen)
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{
      height: "100svh" as CSSProperties["height"],
      minHeight: "100dvh" as CSSProperties["minHeight"],
      background: C.bg, fontFamily: "Inter, sans-serif",
      display: "flex", flexDirection: "column",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5, 6].map(n => (
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
            Step {step} of 6
          </span>
        </div>
      </div>

      {/* ── Scrollable content ────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overscrollBehaviorY: "contain",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        <div
          style={{
            padding: "20px 20px 32px",
            minHeight: "100%",
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
                {/* ── Welcome banner ─────────────────────────────────────── */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    marginBottom: 24,
                    borderRadius: 16,
                    padding: "16px 18px",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid rgba(234,88,12,0.12)",
                    background:
                      "linear-gradient(135deg, rgba(255, 249, 244, 1) 0%, rgba(255, 237, 217, 1) 15%, rgba(255, 228, 206, 0.8) 30%, rgba(255, 220, 188, 0.5) 48%, rgba(255, 233, 210, 0.7) 60%, rgba(255, 243, 230, 1) 78%, rgba(255, 249, 244, 1) 100%)",
                    backgroundSize: "400% 400%",
                    animation: "zf-welcome-drift 14s cubic-bezier(0.33, 0, 0.2, 1) infinite",
                    boxShadow:
                      "0 4px 20px rgba(234,88,12,0.08), 0 0 0 0.5px rgba(234,88,12,0.06) inset",
                  }}
                >
                  {/* Peach / brand glow — top-right */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "-40%",
                      right: "-15%",
                      width: "85%",
                      height: "160%",
                      borderRadius: "50%",
                      background: "radial-gradient(ellipse, rgba(255,120,60,0.28) 0%, rgba(255,143,86,0.10) 45%, transparent 72%)",
                      pointerEvents: "none",
                      animation: "zf-glow-drift 16s cubic-bezier(0.33, 0, 0.2, 1) infinite",
                    }}
                  />
                  {/* Deep amber glow — bottom-left */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: "-50%",
                      left: "-15%",
                      width: "75%",
                      height: "155%",
                      borderRadius: "50%",
                      background: "radial-gradient(ellipse, rgba(180,80,20,0.22) 0%, rgba(194,100,40,0.06) 50%, transparent 72%)",
                      pointerEvents: "none",
                      animation: "zf-glow-drift-2 20s cubic-bezier(0.33, 0, 0.2, 1) infinite",
                    }}
                  />
                  {/* Light peach glow — center-left */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: "-10%",
                      left: "10%",
                      width: "65%",
                      height: "120%",
                      borderRadius: "50%",
                      background: "radial-gradient(ellipse, rgba(255,180,120,0.20) 0%, rgba(255,160,100,0.05) 50%, transparent 70%)",
                      pointerEvents: "none",
                      animation: "zf-glow-drift-3 24s cubic-bezier(0.33, 0, 0.2, 1) infinite",
                    }}
                  />
                  {/* Burnt sienna accent — bottom-right */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      bottom: "-35%",
                      right: "-10%",
                      width: "60%",
                      height: "130%",
                      borderRadius: "50%",
                      background: "radial-gradient(ellipse, rgba(210,100,40,0.18) 0%, rgba(194,80,30,0.04) 50%, transparent 72%)",
                      pointerEvents: "none",
                      animation: "zf-glow-drift 22s cubic-bezier(0.33, 0, 0.2, 1) infinite reverse",
                    }}
                  />
                  {/* Noise texture overlay */}
                  <svg
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0.12,
                      pointerEvents: "none",
                      borderRadius: "inherit",
                      mixBlendMode: "multiply",
                    }}
                  >
                    <filter id="zf-noise">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.6"
                        numOctaves="5"
                        stitchTiles="stitch"
                      />
                    </filter>
                    <rect
                      width="100%"
                      height="100%"
                      filter="url(#zf-noise)"
                    />
                  </svg>
                  <p style={{
                    position: "relative",
                    fontSize: "13px", fontWeight: 700,
                    color: C.textPrimary,
                    letterSpacing: "-0.02em",
                    marginBottom: 4, lineHeight: 1.3,
                  }}>
                    {firstName
                      ? `Welcome, ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}! 👋`
                      : "Welcome aboard! 👋"}
                  </p>
                  <p style={{
                    position: "relative",
                    fontSize: "12px", fontWeight: 400,
                    color: C.textMuted,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.5,
                  }}>
                    Let's set up your preferences, takes about{" "}
                    <span style={{ fontWeight: 600, color: C.brand }}>2 minutes</span>
                    {" "}and helps us match you with the right roles.
                  </p>
                </motion.div>

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
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {CATEGORIES.map((cat) => {
                    const selected = selectedCategories.includes(cat.id);
                    const atCap = selectedCategories.length >= MAX_JOB_CATEGORIES && !selected;
                    return (
                      <Pill
                        key={cat.id}
                        label={cat.label}
                        icon={cat.icon}
                        selected={selected}
                        disabled={atCap}
                        onClick={() => toggleCategory(cat.id)}
                      />
                    );
                  })}
                </div>

                <AnimatePresence>
                  {selectedCategories.length > 0 && (
                    <motion.div
                      key="roles-by-category"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
                      <SectionLabel>Roles by category</SectionLabel>
                      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {selectedCategories.map((catId) => {
                          const meta = getCategoryMeta(catId);
                          const Icon = meta?.icon;
                          const title = meta?.label ?? "Category";
                          const picked = rolesByCategory[catId] ?? [];
                          const preset = SUB_ROLES[catId];
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

                              {preset && (
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

                              {!preset && (
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
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })()}
                              </div>
                              {selectedCategories.indexOf(catId) < selectedCategories.length - 1 && (
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

            {/* ══ STEP 5: Work setup ═══════════════════════════════════════ */}
            {step === 5 && (
              <motion.div key="s2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Heading */}
                <div style={{ marginBottom: 22 }}>
                  <h2 style={{
                    fontSize: "clamp(19px, 5.5vw, 22px)", fontWeight: 800,
                    color: C.textPrimary, letterSpacing: "-0.04em",
                    lineHeight: 1.25, marginBottom: 8,
                  }}>
                    What work setup do you prefer?
                  </h2>
                </div>

                {/* Options */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10, marginBottom: 14 }}>
                  {WORK_SETUPS.map(o => {
                    const selected = workSetups.includes(o.id);
                    return (
                      <motion.button
                        key={o.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleWorkSetup(o.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "14px 14px",
                          borderRadius: 16,
                          border: `1.5px solid ${selected ? C.brandBorder : C.border}`,
                          background: selected ? C.brandBg : "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          transition: "border-color 0.18s, background 0.18s",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                          <div style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: C.textPrimary,
                            letterSpacing: "-0.02em",
                          }}>
                            {o.label}
                          </div>
                          <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: "-0.01em" }}>
                            {o.id === "remote"
                              ? "Work from anywhere"
                              : o.id === "hybrid"
                              ? "Split between office and home"
                              : "Work primarily from the office"}
                          </div>
                        </div>

                        <div style={{
                          width: 18, height: 18, borderRadius: 6,
                          border: `1.5px solid ${selected ? "#EA580C" : "rgba(28,25,23,0.22)"}`,
                          background: selected ? "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                          transition: "background 0.18s, border-color 0.18s",
                        }}>
                          {selected && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5.2l2 2.1L8.3 2.8" stroke="white" strokeWidth="1.7"
                                strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                

                {/* Progressive: Location picker */}
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
                    What is the most important thing in your next job?
                  </h2>
                  <p style={{ fontSize: "13px", color: C.textMuted, letterSpacing: "-0.01em" }}>
                    Choose up to 3 things that matter most to you
                  </p>
                </div>

                {/* Pills */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PRIORITIES.map(p => (
                    <Pill
                      key={p.id}
                      label={p.label}
                      icon={p.icon}
                      selected={priorities.includes(p.id)}
                      disabled={priorities.length >= 3 && !priorities.includes(p.id)}
                      onClick={() => togglePriority(p.id)}
                    />
                  ))}
                </div>

              </motion.div>
            )}

            {/* ══ STEP 3: Switch timeline ═════════════════════════════════ */}
            {step === 3 && (
              <motion.div key="s-switch"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{ marginBottom: 28 }}>
                  <h2 style={{
                    fontSize: "clamp(19px, 5.5vw, 22px)", fontWeight: 800,
                    color: C.textPrimary, letterSpacing: "-0.04em",
                    lineHeight: 1.25, marginBottom: 8,
                  }}>
                    When do you want to switch?
                  </h2>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {([
                    { id: "immediately", label: "Immediately", emoji: "🚀" },
                    { id: "1month",      label: "Within 1 month", emoji: "⏳" },
                    { id: "3months",     label: "Within 3 months", emoji: "📅" },
                    { id: "exploring",   label: "Just exploring", emoji: "👀" },
                  ] as const).map(opt => {
                    const sel = switchTimeline === opt.id;
                    return (
                      <Pill
                        key={opt.id}
                        onClick={() => setSwitchTimeline(opt.id)}
                        label={opt.label}
                        emoji={opt.emoji}
                        selected={sel}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ══ STEP 4: Salary ══════════════════════════════════════════ */}
            {step === 4 && (
              <motion.div key="s4"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Heading */}
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{
                    fontSize: "clamp(19px, 5.5vw, 22px)", fontWeight: 800,
                    color: C.textPrimary, letterSpacing: "-0.04em",
                    lineHeight: 1.25, marginBottom: 8,
                  }}>
                    Expected salary range?
                  </h2>
                </div>

                {/* Currency — compact trigger; list in menu */}
                <div style={{
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
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
                      align="end"
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

                {/* Min / Max — same typography as before; subtle underline hints tappable LPA edit */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-end", marginBottom: 28,
                }}>
                  <div>
                    <p style={{ fontSize: "11px", color: C.textSec, marginBottom: 4, letterSpacing: "0.02em" }}>
                      Minimum
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                        gap: 0,
                        fontSize: "26px",
                        fontWeight: 800,
                        color: C.textPrimary,
                        letterSpacing: "-0.05em",
                        cursor: "text",
                        minHeight: "44px",
                        boxSizing: "border-box",
                        paddingBottom: 2,
                        borderBottom: "1px solid rgba(28, 25, 23, 0.1)",
                      }}
                    >
                      {salaryCurrency === "INR" ? <span>₹</span> : null}
                      <input
                        className="zf-salary-lpa"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                        value={salMinEditing ? salMinDraft : String(salMin)}
                        aria-label="Minimum salary, lakhs per annum (INR)"
                        onFocus={() => {
                          setSalMinEditing(true);
                          setSalMinDraft(String(salMin));
                        }}
                        onChange={(e) => {
                          const next = sanitizeLpaDigits(e.target.value);
                          setSalMinDraft(next);
                          const n = next === "" ? SAL_MIN : parseInt(next, 10);
                          if (!Number.isNaN(n)) {
                            cancelSalMinAnim();
                            setSalMin(n);
                          }
                        }}
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
                          width: `${Math.max(1, (salMinEditing ? salMinDraft.length || 1 : String(salMin).length)) + 0.35}ch`,
                          minWidth: 0,
                          padding: 0,
                          margin: 0,
                          border: "none",
                          background: "transparent",
                          font: "inherit",
                          color: "inherit",
                          letterSpacing: "inherit",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      />
                      {salaryCurrency === "INR" ? <span>LPA</span> : null}
                      {salaryCurrency !== "INR" ? (
                        <span style={{ fontSize: "13px", fontWeight: 600, color: C.textSec, letterSpacing: "-0.02em", marginLeft: "0.35em" }}>
                          ({formatSalaryStepDisplay(salMin, salaryCurrency)})
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "11px", color: C.textSec, marginBottom: 4, letterSpacing: "0.02em" }}>
                      Maximum
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "baseline",
                        flexWrap: "wrap",
                        gap: 0,
                        justifyContent: "flex-end",
                        fontSize: "26px",
                        fontWeight: 800,
                        color: C.textPrimary,
                        letterSpacing: "-0.05em",
                        cursor: "text",
                        minHeight: "44px",
                        boxSizing: "border-box",
                        paddingBottom: 2,
                        marginLeft: "auto",
                        borderBottom: "1px solid rgba(28, 25, 23, 0.1)",
                      }}
                    >
                      {salaryCurrency === "INR" ? <span>₹</span> : null}
                      <input
                        className="zf-salary-lpa"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        spellCheck={false}
                        value={salMaxEditing ? salMaxDraft : String(salMax)}
                        aria-label="Maximum salary, lakhs per annum (INR)"
                        onFocus={() => {
                          setSalMaxEditing(true);
                          setSalMaxDraft(String(salMax));
                        }}
                        onChange={(e) => {
                          const next = sanitizeLpaDigits(e.target.value);
                          setSalMaxDraft(next);
                          const n = next === "" ? SAL_MAX : parseInt(next, 10);
                          if (!Number.isNaN(n)) {
                            cancelSalMaxAnim();
                            setSalMax(n);
                          }
                        }}
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
                          width: `${Math.max(1, (salMaxEditing ? salMaxDraft.length || 1 : String(salMax).length)) + 0.35}ch`,
                          minWidth: 0,
                          padding: 0,
                          margin: 0,
                          border: "none",
                          background: "transparent",
                          font: "inherit",
                          color: "inherit",
                          letterSpacing: "inherit",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      />
                      {salaryCurrency === "INR" ? <span>LPA</span> : null}
                      {salaryCurrency !== "INR" ? (
                        <span style={{ fontSize: "13px", fontWeight: 600, color: C.textSec, letterSpacing: "-0.02em", marginLeft: "0.35em" }}>
                          ({formatSalaryStepDisplay(salMax, salaryCurrency)})
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Dual range slider */}
                <div style={{ marginBottom: 6, paddingLeft: 2, paddingRight: 2 }}>
                  <div style={{ position: "relative", height: 28, display: "flex", alignItems: "center" }}>
                    {/* Track background */}
                    <div style={{
                      position: "absolute", left: 0, right: 0, height: 5,
                      background: C.trackBg, borderRadius: 3,
                    }}>
                      {/* Filled segment */}
                      <div style={{
                        position: "absolute",
                        left: `${salTrackStartPct}%`, right: `${100 - salTrackEndPct}%`,
                        top: 0, bottom: 0,
                        background: "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
                        borderRadius: 3,
                      }} />
                    </div>

                    {/* Min thumb input */}
                    <input
                      type="range" className="zf-range"
                      min={SAL_MIN} max={SAL_MAX} step={1} value={salMinForSlider}
                      onChange={(e) => {
                        cancelSalMinAnim();
                        setSalMin(Math.min(+e.target.value, salMaxForSlider - SAL_GAP));
                      }}
                      style={{ zIndex: salMin > SAL_MAX * 0.85 ? 5 : 3 }}
                    />
                    {/* Max thumb input */}
                    <input
                      type="range" className="zf-range"
                      min={SAL_MIN} max={SAL_MAX} step={1} value={salMaxForSlider}
                      onChange={(e) => {
                        cancelSalMaxAnim();
                        setSalMax(Math.max(+e.target.value, salMinForSlider + SAL_GAP));
                      }}
                      style={{ zIndex: salMin > SAL_MAX * 0.85 ? 3 : 5 }}
                    />
                  </div>
                </div>

                {/* Scale labels */}
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 32,
                }}>
                  <span style={{ fontSize: "11px", color: C.textSec }}>
                    {formatSalaryScaleEndpoint(SAL_MIN, salaryCurrency)}
                  </span>
                  <span style={{ fontSize: "11px", color: C.textSec }}>
                    {formatSalaryScaleEndpoint(SAL_MAX, salaryCurrency)}
                  </span>
                </div>
                {salaryRangeError && (
                  <p
                    role="alert"
                    style={{
                      marginTop: -18,
                      marginBottom: 20,
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

              </motion.div>
            )}

          </AnimatePresence>

          {/* ── Bottom navigation (in-flow, non-sticky) ───────────────────── */}
          <div style={{
            marginTop: "auto",
            paddingTop: 12,
            paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
            borderTop: `1px solid ${C.border}`,
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
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
                boxShadow: canContinue ? "0 4px 16px rgba(234,88,12,0.35)" : "none",
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
      </div>
    </div>
  );
}