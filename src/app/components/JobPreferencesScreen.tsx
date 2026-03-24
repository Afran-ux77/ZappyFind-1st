import { useState, useEffect } from "react";
import type { ReactNode, ElementType, CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { JobPreferences } from "./WelcomeScreen";
import {
  Heart, Crown, TrendingUp, Layers, Lightbulb, Zap, Rocket, Flame,
  Building2, Cpu, Clock, Gift, Globe, Scale,
  Code2, Palette, Database, Package, Megaphone, Landmark, ShoppingBag,
  Users, Briefcase, Settings2, Headphones, ShieldCheck, Activity, Wrench,
  FlaskConical, BarChart3, UserCheck, Handshake, HeartPulse,
} from "lucide-react";

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:          "#FDFBF8",
  primary:     "#1C1917",
  brand:       "#C2410C",
  brandBg:     "rgba(194,65,12,0.07)",
  brandBorder: "rgba(194,65,12,0.35)",
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
    return `₹${lakhs} LPA`;
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
    return lakhs === 0 ? "₹0" : `₹${lakhs} LPA`;
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
      width: 15, height: 15, borderRadius: 4, background: "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)", flexShrink: 0,
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
  label, icon: Icon, selected, disabled, onClick,
}: { label: string; icon?: ElementType; selected: boolean; disabled?: boolean; onClick: () => void }) {
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
type Step = 1 | 2 | 3 | 4;

interface Props {
  onComplete: (prefs: JobPreferences) => void;
  onBack: () => void;
  firstName?: string;
}

/* ═════════════════════════════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════════════════════════════ */
export function JobPreferencesScreen({ onComplete, onBack, firstName }: Props) {
  const [step,       setStep]       = useState<Step>(1);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [category,   setCategory]   = useState<string | null>(null);
  const [roles,      setRoles]      = useState<string[]>([]);
  const [customRole, setCustomRole] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [switchTimeline, setSwitchTimeline] = useState<string | null>(null);
  const [workSetups, setWorkSetups] = useState<string[]>([]);
  const [locQuery,   setLocQuery]   = useState("");
  const [locations,  setLocations]  = useState<string[]>([]);
  const [salMin,     setSalMin]     = useState(5);
  const [salMax,     setSalMax]     = useState(30);
  const [salaryCurrency, setSalaryCurrency] = useState<SalaryCurrencyCode>("INR");
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
        background: #FDFBF8; border: 2.5px solid #FF6B35;
        box-shadow: 0 2px 10px rgba(255,107,53,0.35); cursor: grab;
        transition: box-shadow .15s, transform .12s;
      }
      .zf-range::-webkit-slider-thumb:active {
        cursor: grabbing; transform: scale(1.15);
        box-shadow: 0 4px 18px rgba(255,107,53,0.42);
      }
      .zf-range::-moz-range-thumb {
        pointer-events: all; width: 24px; height: 24px; border-radius: 50%;
        background: #FDFBF8; border: 2.5px solid #FF6B35;
        box-shadow: 0 2px 10px rgba(255,107,53,0.35); cursor: grab;
      }
      .zf-range::-webkit-slider-runnable-track { background: transparent; }
      .zf-range::-moz-range-track { background: transparent; border: none; }
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

  const selectCategory = (id: string) => {
    if (category === id) {
      setCategory(null);
      setRoles([]);
      if (id === "other") setCustomCategory("");
    } else {
      setCategory(id);
      setRoles([]);
      if (id !== "other") setCustomCategory("");
    }
  };

  const toggleRole = (r: string) =>
    setRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

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

  const addCustomRole = () => {
    const trimmed = customRole.trim();
    if (!trimmed) return;
    if (!roles.includes(trimmed)) setRoles(prev => [...prev, trimmed]);
    setCustomRole("");
  };

  const canContinue =
    (step === 1 && category !== null && (category !== "other" || customCategory.trim().length > 0)) ||
    (step === 2 && priorities.length > 0) ||
    step === 3 ||
    (step === 4 && workSetups.length > 0 && (!showLocationPicker || locations.length > 0));

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
    else if (step === 4) onComplete({
      category: category === "other" ? customCategory.trim() || undefined : category ?? undefined,
      roles: roles.length ? roles : undefined,
      workSetups: workSetups.length ? workSetups : undefined,
      locations: locations.length ? locations : undefined,
      priorities: priorities.length ? priorities : undefined,
      salaryMin: salMin,
      salaryMax: salMax,
      salaryCurrency,
      switchTimeline: switchTimeline ?? undefined,
    });
  };

  const handleBack = () => {
    if (step === 1) onBack();
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
  };

  /* ── Salary percentages ─────────────────────────────────────────────────── */
  const salMinPct = ((salMin - SAL_MIN) / (SAL_MAX - SAL_MIN)) * 100;
  const salMaxPct = ((salMax - SAL_MIN) / (SAL_MAX - SAL_MIN)) * 100;

  /* ════════════════════════════════════════════════════════════════════════
     Main preference screen (steps 1–4 of 5; step 5 = upload resume in WelcomeScreen)
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={{
      height: "100dvh" as CSSProperties["height"],
      minHeight: "100vh" as CSSProperties["minHeight"],
      background: C.bg, fontFamily: "Inter, sans-serif",
      display: "flex", flexDirection: "column",
    }}>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <motion.div
              key={n}
              animate={{
                background: n < step ? "#FF8F56" : n === step ? "#FF6B35" : C.trackBg,
                opacity: n === step ? 1 : n < step ? 0.7 : 1,
              }}
              transition={{ duration: 0.4 }}
              style={{ flex: 1, height: 3, borderRadius: 2 }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <span style={{ fontSize: "11px", color: C.textSec, letterSpacing: "0.02em" }}>
            Step {step} of 5
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
        <div style={{ padding: "20px 20px 32px" }}>
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
                    border: "1px solid rgba(194,65,12,0.12)",
                    background:
                      "linear-gradient(135deg, rgba(255, 249, 244, 1) 0%, rgba(255, 237, 217, 1) 15%, rgba(255, 228, 206, 0.8) 30%, rgba(255, 220, 188, 0.5) 48%, rgba(255, 233, 210, 0.7) 60%, rgba(255, 243, 230, 1) 78%, rgba(255, 249, 244, 1) 100%)",
                    backgroundSize: "400% 400%",
                    animation: "zf-welcome-drift 14s cubic-bezier(0.33, 0, 0.2, 1) infinite",
                    boxShadow:
                      "0 4px 20px rgba(194,65,12,0.08), 0 0 0 0.5px rgba(194,65,12,0.06) inset",
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
                  <p style={{ fontSize: "13px", color: C.textMuted, letterSpacing: "-0.01em" }}>
                    Select a job category that interests you most
                  </p>
                </div>

                {/* Category pills */}
                <SectionLabel>Job Categories</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                  {CATEGORIES.map(cat => (
                    <Pill
                      key={cat.id}
                      label={cat.label}
                      icon={cat.icon}
                      selected={category === cat.id}
                      onClick={() => selectCategory(cat.id)}
                    />
                  ))}
                </div>

                {/* Sub-roles (appear on category select) */}
                <AnimatePresence>
                  {category === "other" && (
                    <motion.div
                      key="roles-other"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
                      <SectionLabel>Enter your job category</SectionLabel>
                      <input
                        type="text"
                        placeholder="e.g. Architecture, Research, Supply Chain"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: 12,
                          border: `1.5px solid ${C.border}`, background: "white",
                          fontSize: "13px", color: C.textPrimary,
                          fontFamily: "Inter, sans-serif", outline: "none",
                          marginBottom: 8,
                        }}
                      />
                    </motion.div>
                  )}
                  {category && SUB_ROLES[category] && (
                    <motion.div
                      key={`roles-${category}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Divider */}
                      <div style={{ height: 1, background: C.border, marginBottom: 20 }} />

                      <SectionLabel>Select the most relevant roles</SectionLabel>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                        {SUB_ROLES[category].map(r => (
                          <Pill
                            key={r} label={r}
                            selected={roles.includes(r)}
                            onClick={() => toggleRole(r)}
                          />
                        ))}
                        {/* Custom roles added by user */}
                        {roles
                          .filter(r => !SUB_ROLES[category ?? ""].includes(r))
                          .map(r => (
                            <Pill
                              key={r} label={r}
                              selected={true}
                              onClick={() => toggleRole(r)}
                            />
                          ))}
                      </div>

                      {/* Custom role input */}
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="text"
                          placeholder="Can't find your role? Add it here"
                          value={customRole}
                          onChange={e => setCustomRole(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") addCustomRole(); }}
                          style={{
                            flex: 1, padding: "10px 14px", borderRadius: 12,
                            border: `1.5px solid ${C.border}`, background: "white",
                            fontSize: "13px", color: C.textPrimary,
                            fontFamily: "Inter, sans-serif", outline: "none",
                          }}
                        />
                        <button
                          onClick={addCustomRole}
                          style={{
                            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                            border: `1.5px solid ${C.border}`, background: "white",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 2v10M2 7h10" stroke={C.textMuted}
                              strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ══ STEP 4: Work setup ═══════════════════════════════════════ */}
            {step === 4 && (
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
                  <p style={{ fontSize: "13px", color: C.textMuted, letterSpacing: "-0.01em" }}>
                    Select one or more options
                  </p>
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
                          border: `1.5px solid ${selected ? "#FF6B35" : "rgba(28,25,23,0.22)"}`,
                          background: selected ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)" : "transparent",
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
                                background: "rgba(255,107,53,0.10)",
                                border: "1px solid rgba(255,107,53,0.40)",
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

                {/* How soon — appears after at least 1 priority is picked */}
                <AnimatePresence>
                  {priorities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      style={{ marginTop: 28 }}
                    >
                      <div style={{ height: 1, background: C.border, marginBottom: 22 }} />
                      <p style={{
                        fontSize: 15, fontWeight: 700, color: C.textPrimary,
                        letterSpacing: "-0.02em", marginBottom: 4, lineHeight: 1.3,
                      }}>
                        How soon are you looking to switch?
                      </p>
                      <p style={{
                        fontSize: 12, color: C.textMuted, letterSpacing: "-0.01em",
                        marginBottom: 14,
                      }}>
                        No pressure, helps us prioritize the right matches
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {([
                          { id: "immediately", label: "Immediately", emoji: "🚀" },
                          { id: "1month",      label: "Within 1 month", emoji: "📅" },
                          { id: "3months",     label: "Within 3 months", emoji: "🗓️" },
                          { id: "exploring",   label: "Just exploring", emoji: "👀" },
                        ] as const).map(opt => {
                          const sel = switchTimeline === opt.id;
                          return (
                            <motion.button
                              key={opt.id}
                              whileTap={{ scale: 0.96 }}
                              onClick={() => setSwitchTimeline(sel ? null : opt.id)}
                              style={{
                                padding: "12px 10px",
                                borderRadius: 14,
                                border: `1.5px solid ${sel ? C.brandBorder : C.border}`,
                                background: sel ? C.brandBg : "white",
                                cursor: "pointer",
                                display: "flex", alignItems: "center", gap: 8,
                                transition: "border-color 0.18s, background 0.18s",
                                fontFamily: "Inter, sans-serif",
                              }}
                            >
                              <span style={{ fontSize: 16, lineHeight: 1 }}>{opt.emoji}</span>
                              <span style={{
                                fontSize: 13, fontWeight: sel ? 600 : 400,
                                color: sel ? C.brand : C.textPrimary,
                                letterSpacing: "-0.01em",
                              }}>
                                {opt.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ══ STEP 3: Salary ══════════════════════════════════════════ */}
            {step === 3 && (
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
                  <p style={{ fontSize: "13px", color: C.textMuted, letterSpacing: "-0.01em" }}>
                    Set your expected salary range to help us match you with the right jobs
                  </p>
                </div>

                {/* Currency (default INR) */}
                <div style={{ marginBottom: 24 }}>
                  <label
                    htmlFor="zf-salary-currency"
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: C.textSec,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Currency
                  </label>
                  <select
                    id="zf-salary-currency"
                    value={salaryCurrency}
                    onChange={(e) => setSalaryCurrency(e.target.value as SalaryCurrencyCode)}
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      padding: "12px 14px",
                      borderRadius: 12,
                      border: `1.5px solid ${C.border}`,
                      background: "white",
                      color: C.textPrimary,
                      fontSize: "14px",
                      fontWeight: 500,
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "-0.01em",
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2378716C' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: 40,
                    }}
                  >
                    {SALARY_CURRENCY_OPTIONS.map((opt) => (
                      <option key={opt.code} value={opt.code}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {salaryCurrency !== "INR" && (
                    <p
                      style={{
                        marginTop: 8,
                        fontSize: "11px",
                        color: C.textSec,
                        lineHeight: 1.45,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      Amounts below are approximate conversions from your range in INR (LPA). Matching still uses your INR range.
                    </p>
                  )}
                </div>

                {/* Min / Max display */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-end", marginBottom: 28,
                }}>
                  <div>
                    <p style={{ fontSize: "11px", color: C.textSec, marginBottom: 4, letterSpacing: "0.02em" }}>
                      Minimum
                    </p>
                    <motion.p
                      key={`${salMin}-${salaryCurrency}`}
                      initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                      style={{
                        fontSize: "26px", fontWeight: 800,
                        color: C.textPrimary, letterSpacing: "-0.05em",
                      }}
                    >
                      {formatSalaryStepDisplay(salMin, salaryCurrency)}
                    </motion.p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "11px", color: C.textSec, marginBottom: 4, letterSpacing: "0.02em" }}>
                      Maximum
                    </p>
                    <motion.p
                      key={`${salMax}-${salaryCurrency}`}
                      initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                      style={{
                        fontSize: "26px", fontWeight: 800,
                        color: C.brand, letterSpacing: "-0.05em",
                      }}
                    >
                      {formatSalaryStepDisplay(salMax, salaryCurrency)}
                    </motion.p>
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
                        left: `${salMinPct}%`, right: `${100 - salMaxPct}%`,
                        top: 0, bottom: 0,
                        background: "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)",
                        borderRadius: 3,
                      }} />
                    </div>

                    {/* Min thumb input */}
                    <input
                      type="range" className="zf-range"
                      min={SAL_MIN} max={SAL_MAX} step={1} value={salMin}
                      onChange={e => setSalMin(Math.min(+e.target.value, salMax - 5))}
                      style={{ zIndex: salMin > SAL_MAX * 0.85 ? 5 : 3 }}
                    />
                    {/* Max thumb input */}
                    <input
                      type="range" className="zf-range"
                      min={SAL_MIN} max={SAL_MAX} step={1} value={salMax}
                      onChange={e => setSalMax(Math.max(+e.target.value, salMin + 5))}
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

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom navigation ─────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        position: "sticky",
        bottom: 0,
        zIndex: 20,
        padding: "12px 20px 20px",
        background: "rgba(253,251,248,0.96)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
      }}>
        {/* Previous */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "13px 20px", borderRadius: 14,
            border: `1.5px solid ${C.border}`, background: "white",
            color: C.textMuted, fontSize: "14px", fontWeight: 500,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Previous
        </motion.button>

        {/* Continue */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={!canContinue}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "13px 28px", borderRadius: 14, border: "none",
            background: canContinue ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)" : "rgba(28,25,23,0.2)",
            color: "white", fontSize: "14px", fontWeight: 600,
            letterSpacing: "-0.01em", cursor: canContinue ? "pointer" : "not-allowed",
            transition: "background 0.2s, box-shadow 0.2s",
            fontFamily: "Inter, sans-serif",
            boxShadow: canContinue ? "0 4px 16px rgba(255,107,53,0.35)" : "none",
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