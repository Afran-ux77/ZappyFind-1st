import { useState, useEffect, useRef, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FullProfile } from "./WelcomeScreen";
import {
  ANALYSIS_TRAITS,
  INTERVIEW_RECAP_SUMMARY,
  INTERVIEW_RECAP_VERDICT,
  traitAccent,
} from "../interviewRecapCopy";
import { InterviewRecordingCompactCard } from "./InterviewTranscriptScroll";
import {
  Sparkles,
  Bell,
  Brain,
  Settings,
  User,
  House,
  MapPin,
  ChevronRight,
  ChevronDown,
  Bookmark,
  Check,
  ArrowRight,
  Mic,
  Target,
  Briefcase,
  Users,
  MessageCircle,
  FileText,
  Video,
  Play,
  CheckCircle2,

  Trophy,
  TrendingUp,
  ArrowUpRight,
  Flame,
  Star,
  Layers,
  Lock,
  Zap,
  Clock3,
  Loader2,
  LogOut,
} from "lucide-react";

// ── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  pageBg: "#FDFBF8",
  cardBg: "#FFFFFF",
  heroGradient:
    "radial-gradient(ellipse at 15% 5%, #FFF6EE 0%, #FFEAD6 50%, #FFD9BC 100%)",

  text: "#1A1613",
  textSec: "rgba(107, 101, 96, 1)",
  textTer: "#A39E99",

  accent: "#EA580C",
  accentDark: "#E85A22",
  accentSoft: "rgba(234,88,12,0.08)",
  accentGradient: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",

  border: "rgba(28,25,23,0.06)",
  borderStrong: "rgba(28,25,23,0.1)",
  shadow: "0 1px 3px rgba(28,25,23,0.04), 0 4px 12px rgba(28,25,23,0.06)",
  shadowLg:
    "0 4px 8px rgba(28,25,23,0.05), 0 12px 28px rgba(28,25,23,0.08)",

  success: "#059669",
  successSoft: "rgba(5,150,105,0.08)",
  warning: "#D97706",
  warningSoft: "rgba(217,119,6,0.08)",

  serif: "'DM Serif Display', Georgia, serif",
  sans: "'Inter', sans-serif",
};

const EASE = [0.16, 1, 0.3, 1] as const;

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Zappyhire",
    logoLetter: "R",
    logoColor: "#2D6AFF",
    matchScore: 94,
    salary: "₹28L – ₹35L",
    location: "Bangalore",
    locationType: "Remote",
    whyMatch:
      "Your Figma expertise and 4+ years in product design align perfectly with their growing design systems team.",
    postedAgo: "2d ago",
    tags: ["Design Systems", "B2B SaaS"],
  },
  {
    id: "2",
    title: "Product Designer II",
    company: "ZappyVue",
    logoLetter: "S",
    logoColor: "#FC8019",
    matchScore: 91,
    salary: "₹24L – ₹30L",
    location: "Bangalore",
    locationType: "Hybrid",
    whyMatch:
      "Strong consumer product experience and stakeholder management skills are a key differentiator here.",
    postedAgo: "1d ago",
    tags: ["Consumer", "Mobile-first"],
  },
  {
    id: "3",
    title: "UX Design Lead",
    company: "ZappyCore",
    logoLetter: "P",
    logoColor: "#5F259F",
    matchScore: 88,
    salary: "₹32L – ₹40L",
    location: "Bangalore",
    locationType: "Hybrid",
    whyMatch:
      "Leadership potential and fintech domain knowledge position you strongly for this team lead role.",
    postedAgo: "3d ago",
    tags: ["Fintech", "Leadership"],
  },
];

const AI_INSIGHTS = [
  {
    label: "Communication",
    shortLabel: "Comm",
    score: 87,
    peerAvg: 68,
    description: "Clear, structured articulation of complex ideas",
    percentile: 85,
    peerGroup: "Product Designers",
    color: "#059669",
    evidence: "You explained cross-functional workflows with structured clarity",
  },
  {
    label: "Confidence",
    shortLabel: "Conf",
    score: 92,
    peerAvg: 71,
    description: "Strong self-awareness with assured delivery",
    percentile: 92,
    peerGroup: "Product Designers",
    color: "#6366F1",
    evidence: "Your answers showed conviction without hesitation",
  },
  {
    label: "Domain Depth",
    shortLabel: "Domain",
    score: 85,
    peerAvg: 72,
    description: "Solid grasp of product design principles and tools",
    percentile: 78,
    peerGroup: "Product Designers",
    color: "#EA580C",
    evidence: "Deep Figma expertise and design systems thinking stood out",
  },
  {
    label: "Role Fit",
    shortLabel: "Fit",
    score: 94,
    peerAvg: 65,
    description: "Goals and experience closely match target roles",
    percentile: 91,
    peerGroup: "Product Designers",
    color: "#D97706",
    evidence: "Your career trajectory aligns tightly with target companies",
  },
  {
    label: "Culture Fit",
    shortLabel: "Culture",
    score: 90,
    peerAvg: 74,
    description: "Collaborative mindset with growth-oriented values",
    percentile: 88,
    peerGroup: "Product Designers",
    color: "#EC4899",
    evidence: "Values team ownership and thrives in fast-paced environments",
  },
];

const SKILLS_DATA: { name: string; demand: "high" | "medium" | "growing" }[] =
  [
    { name: "React", demand: "high" },
    { name: "Figma", demand: "high" },
    { name: "TypeScript", demand: "high" },
    { name: "User Research", demand: "high" },
    { name: "Design Systems", demand: "medium" },
    { name: "Prototyping", demand: "medium" },
    { name: "SQL", demand: "medium" },
    { name: "AI/ML Design", demand: "growing" },
  ];

const DEMAND_THEME = {
  high: { label: "High demand", color: "#059669", bg: "rgba(5,150,105,0.08)" },
  medium: { label: "Moderate", color: "#D97706", bg: "rgba(217,119,6,0.08)" },
  growing: { label: "Growing", color: "#2563EB", bg: "rgba(37,99,235,0.08)" },
} as const;

// ── AI Understanding Data ────────────────────────────────────────────────────

const UNDERSTANDING_SOURCES = [
  {
    key: "resume",
    icon: "file" as const,
    color: "#6366F1",
    bg: "rgba(99,102,241,0.08)",
    source: "From your resume",
    insight:
      "4+ years in product design with a clear junior → senior trajectory. Deep Figma expertise, design systems focus, and cross-functional collaboration at scale.",
  },
  {
    key: "preferences",
    icon: "target" as const,
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    source: "From your preferences",
    insight:
      "Targeting hybrid/remote roles in Bangalore at growth-stage companies, ₹28L–35L range. You prioritize team culture and product ownership.",
  },
  {
    key: "questions",
    icon: "chat" as const,
    color: "#D97706",
    bg: "rgba(217,119,6,0.08)",
    source: "From AI Q&A",
    insight:
      "You value building 0→1 products over maintenance, prefer collaborative environments, and are motivated by user impact over title progression.",
  },
  {
    key: "voice",
    icon: "mic" as const,
    color: "#EC4899",
    bg: "rgba(236,72,153,0.08)",
    source: "From voice interview",
    insight:
      "Your communication is structured and confident (top 15%). You demonstrate strong domain conviction and a natural collaborative leadership style.",
  },
];

const COMPETITIVE_EDGE = [
  {
    dimension: "Communication",
    percentile: 92,
    color: "#059669",
    icon: "message" as const,
    tip: "Exceptional clarity — top-tier among designers",
  },
  {
    dimension: "Domain Depth",
    percentile: 82,
    color: "#6366F1",
    icon: "layers" as const,
    tip: "Add case studies to break into the Top 10%",
  },
  {
    dimension: "Role Fit",
    percentile: 74,
    color: "#D97706",
    icon: "target" as const,
    tip: "Refine preferences to sharpen your match score",
  },
];

const GROWTH_INSIGHTS = [
  {
    tag: "Skill gap",
    text: "Data storytelling is the #2 most-requested skill across your target roles",
    color: "#2563EB",
  },
  {
    tag: "Competency",
    text: "Add a structured case study to push your domain depth into the Top 10%",
    color: "#6366F1",
  },
  {
    tag: "Stand out",
    text: "Only 8% of designers at your level have a video intro — 3× more recruiter attention",
    color: "#EA580C",
  },
];

// ── Below-Average Candidate Data ────────────────────────────────────────────

const GROWTH_PLAN_STEPS = [
  {
    title: "Add in-demand skills",
    description: "SQL and Data Storytelling are top-requested for your target roles",
    impact: "Quick win",
    impactColor: "#2563EB",
    iconType: "layers" as const,
  },
  {
    title: "Upload a case study",
    description: "Recruiters rank this #1 for evaluating mid-level designers",
    impact: "High impact",
    impactColor: "#059669",
    iconType: "file" as const,
  },
  {
    title: "Retake ZappyFind Call",
    description: "Paid add-on: one session can improve your interview score by up to 20%",
    impact: "Paid",
    impactColor: "#D97706",
    iconType: "mic" as const,
  },
];

const LOW_STRENGTHS = [
  {
    label: "Collaborative Mindset",
    detail:
      "You show strong team orientation and value shared ownership — a trait hiring managers consistently rank in their top 3.",
    percentile: 62,
    color: "#059669",
  },
  {
    label: "Growth Trajectory",
    detail:
      "Your learning pace over the last 2 years shows strong upward momentum. Many employers value trajectory over current level.",
    percentile: 55,
    color: "#6366F1",
  },
  {
    label: "Communication Clarity",
    detail:
      "You explain ideas with structure and purpose — a skill that many senior designers still find challenging.",
    percentile: 48,
    color: "#D97706",
  },
];

const LOW_IMPROVEMENT_AREAS = [
  {
    area: "Domain Depth",
    current: 38,
    target: 65,
    advice:
      "Add 1–2 detailed case studies showing your end-to-end design process",
    color: "#EA580C",
  },
  {
    area: "Technical Breadth",
    current: 32,
    target: 60,
    advice:
      "Learning SQL or basic data analysis opens 40% more roles in your target bracket",
    color: "#6366F1",
  },
  {
    area: "Interview Confidence",
    current: 41,
    target: 70,
    advice:
      "Practice structured answers — Zappy's AI coach can boost your score in just 2 sessions",
    color: "#D97706",
  },
];

const LOW_PERF_JOBS = [
  {
    id: "lp1",
    title: "Junior Product Designer",
    company: "ZappyOrbit",
    logoLetter: "C",
    logoColor: "#4F46E5",
    matchScore: 62,
    salary: "₹12L – ₹18L",
    location: "Bangalore",
    locationType: "Hybrid",
    context:
      "Your collaborative mindset and growing Figma skills align with their junior design track. They prioritize potential over experience.",
    postedAgo: "3d ago",
    tags: ["Fintech", "Junior-friendly"],
  },
  {
    id: "lp2",
    title: "UI Designer",
    company: "ZappyNest",
    logoLetter: "F",
    logoColor: "#2E7D32",
    matchScore: 55,
    salary: "₹10L – ₹16L",
    location: "Chennai",
    locationType: "Remote",
    context:
      "They value growth potential and offer strong mentorship programs — ideal for building your portfolio and skills.",
    postedAgo: "1d ago",
    tags: ["SaaS", "Mentorship"],
  },
  {
    id: "lp3",
    title: "Associate Product Designer",
    company: "ZappyLabs",
    logoLetter: "Z",
    logoColor: "#C2410C",
    matchScore: 58,
    salary: "₹11L – ₹17L",
    location: "Kochi",
    locationType: "Hybrid",
    context:
      "You match their early-career product design path, and this role offers structured mentorship with exposure to end-to-end product work.",
    postedAgo: "2d ago",
    tags: ["Product", "Early-career"],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Same logo tile treatment as Applied / review job cards in JobReviewScreen. */
function jobLogoAvatarStyle(logoColor: string): CSSProperties {
  return {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: `linear-gradient(145deg, ${logoColor}26 0%, ${logoColor}0F 55%, #FFFFFF 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: logoColor,
    fontSize: 15,
    fontWeight: 700,
    flexShrink: 0,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
  };
}

function getTimeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function AnimatedCounter({
  target,
  duration = 1400,
}: {
  target: number;
  duration?: number;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <>{value}</>;
}

// ── Dashboard Header ─────────────────────────────────────────────────────────

export function DashboardHeader({
  displayName,
  onAvatarClick,
  isLowPerformer,
  caseOptions,
  activeCaseKey,
  currentPage,
  onNavigateHome,
  onNavigateJobs,
  onNavigateProfile,
  onOpenSettings,
}: {
  displayName: string;
  onAvatarClick?: () => void;
  isLowPerformer?: boolean;
  caseOptions?: Array<{ key: string; label: string; onSelect: () => void }>;
  activeCaseKey?: string;
  currentPage: "home" | "jobs" | "profile";
  onNavigateHome?: () => void;
  onNavigateJobs?: () => void;
  onNavigateProfile?: () => void;
  onOpenSettings?: () => void;
}) {
  const initial = displayName.charAt(0).toUpperCase();
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [caseMenuOpen, setCaseMenuOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement | null>(null);
  const caseMenuRef = useRef<HTMLDivElement | null>(null);
  const label =
    currentPage === "jobs" ? "Jobs" : currentPage === "profile" ? "Profile" : "Home";

  useEffect(() => {
    if (!switcherOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (switcherRef.current && !switcherRef.current.contains(target)) {
        setSwitcherOpen(false);
      }
      if (caseMenuRef.current && !caseMenuRef.current.contains(target)) {
        setCaseMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [switcherOpen]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        height: 56,
        background: "rgba(253,251,248,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${T.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div ref={switcherRef} style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setSwitcherOpen((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 0,
              fontFamily: T.serif,
              fontSize: 22,
              fontWeight: 400,
              color: T.text,
              letterSpacing: "-0.02em",
            }}
          >
            {label}
            <ChevronDown
              size={18}
              color={T.textSec}
              strokeWidth={2}
              style={{
                transform: switcherOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.18s ease",
              }}
            />
          </button>

          {switcherOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: 40,
                left: 0,
                minWidth: 180,
                borderRadius: 14,
                padding: 6,
                background: "#FFFFFF",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(28,25,23,0.08)",
                boxShadow:
                  "0 10px 30px rgba(28,25,23,0.10), 0 2px 6px rgba(28,25,23,0.06)",
              }}
            >
              {[
                {
                  key: "home",
                  text: "Home",
                  icon: <House size={14} strokeWidth={2} />,
                  onClick: () => onNavigateHome?.(),
                },
                {
                  key: "jobs",
                  text: "Jobs",
                  icon: <Briefcase size={14} strokeWidth={2} />,
                  onClick: () => onNavigateJobs?.(),
                },
                {
                  key: "profile",
                  text: "Profile",
                  icon: <User size={14} strokeWidth={2} />,
                  onClick: () => onNavigateProfile?.(),
                },
              ].map((item) => {
                const active = item.key === currentPage;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    disabled={active}
                    onClick={() => {
                      setSwitcherOpen(false);
                      item.onClick();
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      background: active ? "rgba(28,25,23,0.04)" : "transparent",
                      cursor: active ? "default" : "pointer",
                      padding: "10px 10px",
                      borderRadius: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: 600,
                      color: active ? T.text : T.textSec,
                      letterSpacing: "-0.01em",
                      opacity: active ? 1 : 0.95,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: active ? T.text : T.textSec,
                        opacity: active ? 1 : 0.9,
                        marginRight: 8,
                      }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <motion.button
          type="button"
          whileHover={{ y: -1, boxShadow: "0 6px 14px rgba(28,25,23,0.10)" }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenSettings}
          style={{
            position: "relative",
            width: 34,
            height: 34,
            borderRadius: 999,
            background: "rgba(28,25,23,0.04)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
        >
          <Settings size={16} color={T.textSec} strokeWidth={1.9} />
        </motion.button>

        <div ref={caseMenuRef} style={{ position: "relative" }}>
          <div
            onClick={() => {
              if (caseOptions?.length) {
                setCaseMenuOpen((v) => !v);
                return;
              }
              onAvatarClick?.();
            }}
            style={{
              width: 34,
              height: 34,
              borderRadius: 999,
              background:
                "linear-gradient(135deg, rgba(255,140,90,0.15) 0%, rgba(255,106,43,0.28) 100%)",
              border: "1.5px solid rgba(234,88,12,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              color: T.accent,
              letterSpacing: "-0.02em",
              cursor: (caseOptions?.length || onAvatarClick) ? "pointer" : "default",
              outline: isLowPerformer
                ? "2px solid rgba(234,88,12,0.5)"
                : "none",
              outlineOffset: 2,
              transition: "outline 0.2s ease",
            }}
          >
            {initial}
          </div>

          {caseOptions?.length && caseMenuOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: 40,
                right: 0,
                minWidth: 140,
                borderRadius: 12,
                padding: 6,
                background: "#FFFFFF",
                border: "1px solid rgba(28,25,23,0.08)",
                boxShadow:
                  "0 10px 30px rgba(28,25,23,0.10), 0 2px 6px rgba(28,25,23,0.06)",
              }}
            >
              {caseOptions.map((item) => {
                const active = item.key === activeCaseKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    disabled={active}
                    onClick={() => {
                      setCaseMenuOpen(false);
                      item.onSelect();
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      background: active ? "rgba(28,25,23,0.04)" : "transparent",
                      cursor: active ? "default" : "pointer",
                      padding: "9px 10px",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      fontFamily: T.sans,
                      fontSize: 13,
                      fontWeight: 600,
                      color: active ? T.text : T.textSec,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

type SettingsTab = "profile" | "notifications" | "documents" | "account";

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 46,
        height: 28,
        borderRadius: 999,
        border: "none",
        padding: 2,
        background: checked ? T.accentGradient : "rgba(28,25,23,0.14)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
        transition: "all 0.22s ease",
      }}
    >
      <span
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
        }}
      />
    </button>
  );
}

type AccountConfirmKind = "logout" | "delete";

export function SettingsBottomSheet({
  open,
  displayName,
  onClose,
  onLogout,
  onDeleteAccount,
}: {
  open: boolean;
  displayName: string;
  onClose: () => void;
  onLogout?: () => void;
  /** After delete confirmation; defaults to same as sign-out in this prototype. */
  onDeleteAccount?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [whatsAppNotifications, setWhatsAppNotifications] = useState(true);
  const [accountConfirm, setAccountConfirm] = useState<AccountConfirmKind | null>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) setAccountConfirm(null);
  }, [open]);

  const runDeleteAccount = () => {
    const fn = onDeleteAccount ?? onLogout;
    if (!fn) {
      setAccountConfirm(null);
      return;
    }
    fn();
    onClose();
    setAccountConfirm(null);
  };

  const runLogout = () => {
    onLogout?.();
    onClose();
    setAccountConfirm(null);
  };

  const tabItems: Array<{ key: SettingsTab; label: string; icon: React.ReactNode }> = [
    { key: "profile", label: "Profile", icon: <User size={15} strokeWidth={2} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={15} strokeWidth={2} /> },
    { key: "documents", label: "Documents", icon: <FileText size={15} strokeWidth={2} /> },
    { key: "account", label: "Account", icon: <Users size={15} strokeWidth={2} /> },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(28,25,23,0.46)",
              zIndex: 140,
            }}
          />

          <motion.div
            initial={{ y: 44, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 44, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 700) {
                onClose();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              margin: "0 auto",
              bottom: 0,
              width: "min(100vw, 390px)",
              background: "#FFFDFC",
              borderRadius: "20px 20px 0 0",
              boxShadow: "0 -10px 28px rgba(28,25,23,0.18)",
              zIndex: 141,
              maxHeight: "82dvh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ paddingTop: 10, paddingBottom: 4, display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: 58,
                  height: 6,
                  borderRadius: 999,
                  background: "rgba(28,25,23,0.08)",
                }}
              />
            </div>

            <div style={{ padding: "10px 16px 8px", display: "flex", gap: 8, overflowX: "auto" }}>
              {tabItems.map((tab) => {
                const active = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      border: active ? "1px solid rgba(234,88,12,0.36)" : "1px solid rgba(28,25,23,0.08)",
                      background: active ? "linear-gradient(135deg, rgba(255,140,90,0.15) 0%, rgba(234,88,12,0.12) 100%)" : "#FFFFFF",
                      color: active ? T.accent : T.textTer,
                      borderRadius: 999,
                      width: active ? "auto" : 38,
                      minWidth: active ? 0 : 38,
                      height: 38,
                      padding: active ? "0 12px" : 0,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: T.sans,
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      boxShadow: active ? "0 4px 12px rgba(234,88,12,0.18)" : "none",
                      justifyContent: "center",
                    }}
                    aria-label={tab.label}
                  >
                    {tab.icon}
                    {active ? tab.label : null}
                  </button>
                );
              })}
            </div>

            <div style={{ overflowY: "auto", padding: "10px 16px 20px" }}>
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="sheet-profile"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  >
                    <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
                      <div
                        style={{
                          width: 86,
                          height: 86,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #FFE1CF 0%, #FFD2B5 100%)",
                          border: "1px solid rgba(234,88,12,0.22)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 28,
                          fontWeight: 700,
                          color: T.accent,
                          flexShrink: 0,
                        }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: T.textTer, marginBottom: 6 }}>Profile Picture</div>
                        <button
                          type="button"
                          style={{
                            width: "100%",
                            height: 40,
                            borderRadius: 10,
                            border: `1px solid ${T.borderStrong}`,
                            background: "#FFFFFF",
                            color: T.text,
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Change photo
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <div style={{ fontSize: 12, color: T.textTer, marginBottom: 6 }}>Name</div>
                        <div style={{ borderRadius: 10, border: `1px solid ${T.border}`, background: "#FFFFFF", padding: "11px 12px", color: T.text }}>
                          {displayName} Sajeeb
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: T.textTer, marginBottom: 6 }}>Primary Email</div>
                        <input
                          type="email"
                          value="afransajeeb@gmail.com"
                          readOnly
                          disabled
                          aria-label="Primary email (read-only)"
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            borderRadius: 10,
                            border: `1px solid ${T.border}`,
                            background: "rgba(28,25,23,0.04)",
                            padding: "11px 12px",
                            color: T.textTer,
                            fontSize: 14,
                            fontFamily: T.sans,
                            cursor: "not-allowed",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "notifications" && (
                  <motion.div
                    key="sheet-notifications"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  >
                    <h3 style={{ margin: 0, fontSize: 25, fontFamily: T.serif, fontWeight: 400, color: T.text }}>Notifications</h3>
                    <p style={{ margin: "4px 0 18px", color: T.textSec, fontSize: 13 }}>How we contact you</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ borderRadius: 14, border: `1px solid ${T.border}`, background: "#FFFFFF", padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>Email updates</div>
                          <div style={{ marginTop: 3, fontSize: 12.5, color: T.textSec }}>Receive new job alerts and recruiter updates</div>
                        </div>
                        <ToggleSwitch checked={emailNotifications} onChange={() => setEmailNotifications((v) => !v)} />
                      </div>
                      <div style={{ borderRadius: 14, border: `1px solid ${T.border}`, background: "#FFFFFF", padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                        <div>
                          <div style={{ fontSize: 14, color: T.text, fontWeight: 600 }}>WhatsApp updates</div>
                          <div style={{ marginTop: 3, fontSize: 12.5, color: T.textSec }}>Receive match updates and interview reminders</div>
                        </div>
                        <ToggleSwitch checked={whatsAppNotifications} onChange={() => setWhatsAppNotifications((v) => !v)} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "documents" && (
                  <motion.div
                    key="sheet-documents"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  >
                    <h3 style={{ margin: 0, fontSize: 25, fontFamily: T.serif, fontWeight: 400, color: T.text }}>Documents</h3>
                    <p style={{ margin: "4px 0 16px", color: T.textSec, fontSize: 13 }}>Resume and supporting files</p>
                    <div style={{ borderRadius: 14, border: `1px solid ${T.border}`, background: "#FFFFFF", padding: 14 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Afran CV.pdf</div>
                      <div style={{ marginTop: 3, fontSize: 12.5, color: T.textSec }}>Uploaded 3w ago · 1.8 MB</div>
                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        {["View", "Replace", "Delete"].map((action) => (
                          <button
                            key={action}
                            type="button"
                            style={{
                              flex: 1,
                              height: 36,
                              borderRadius: 10,
                              border: `1px solid ${action === "Delete" ? "rgba(220,38,38,0.28)" : T.borderStrong}`,
                              background: "#FFFFFF",
                              color: action === "Delete" ? "#DC2626" : T.text,
                              fontSize: 12.5,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      style={{
                        marginTop: 14,
                        width: "100%",
                        height: 42,
                        borderRadius: 12,
                        border: `1px dashed ${T.borderStrong}`,
                        background: "#FFFFFF",
                        color: T.textSec,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Upload new document
                    </button>
                  </motion.div>
                )}

                {activeTab === "account" && (
                  <motion.div
                    key="sheet-account"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                  >
                    <h3 style={{ margin: 0, fontSize: 25, fontFamily: T.serif, fontWeight: 400, color: T.text }}>Account</h3>
                    <p style={{ margin: "4px 0 16px", color: T.textSec, fontSize: 13 }}>Manage your account settings</p>
                    {onLogout && (
                      <div
                        style={{
                          borderRadius: 14,
                          border: `1px solid ${T.borderStrong}`,
                          background: "#FFFFFF",
                          padding: 14,
                        }}
                      >
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Sign out</div>
                        <div style={{ marginTop: 4, fontSize: 12.5, color: T.textSec, lineHeight: 1.45 }}>
                          End your session on this device.
                        </div>
                        <div
                          style={{
                            marginTop: 12,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setAccountConfirm("logout")}
                            style={{
                              width: 124,
                              height: 42,
                              borderRadius: 10,
                              border: `1px solid ${T.borderStrong}`,
                              background: "#FFFFFF",
                              color: T.text,
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 4,
                              fontFamily: T.sans,
                              flexShrink: 0,
                              boxSizing: "border-box",
                              padding: "0 6px",
                            }}
                          >
                            <LogOut size={14} strokeWidth={2} aria-hidden />
                            Log out
                          </button>
                        </div>
                      </div>
                    )}
                    {(onDeleteAccount ?? onLogout) && (
                      <div
                        style={{
                          marginTop: 16,
                          borderRadius: 14,
                          border: "1px solid rgba(220,38,38,0.2)",
                          background: "rgba(220,38,38,0.04)",
                          padding: 14,
                        }}
                      >
                        <div style={{ color: "#B91C1C", fontSize: 14, fontWeight: 700 }}>Danger zone</div>
                        <div style={{ marginTop: 4, color: "#7F1D1D", fontSize: 12.5, lineHeight: 1.45 }}>
                          Permanently delete your account and all personal data.
                        </div>
                        <div
                          style={{
                            marginTop: 10,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setAccountConfirm("delete")}
                            style={{
                              width: 124,
                              height: 40,
                              borderRadius: 10,
                              border: "none",
                              background: "linear-gradient(135deg, #F87171 0%, #EF4444 100%)",
                              color: "#FFFFFF",
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: "pointer",
                              flexShrink: 0,
                              boxSizing: "border-box",
                              padding: "0 8px",
                            }}
                          >
                            Delete account
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {accountConfirm && (
            <div
              role="presentation"
              onClick={() => setAccountConfirm(null)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 220,
                background: "rgba(28,25,23,0.55)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                fontFamily: T.sans,
              }}
            >
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="account-confirm-title"
                aria-describedby="account-confirm-desc"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "100%",
                  maxWidth: 340,
                  borderRadius: 16,
                  background: "#FFFFFF",
                  padding: 20,
                  boxShadow: "0 12px 40px rgba(28,25,23,0.2)",
                }}
              >
                <h2
                  id="account-confirm-title"
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 700,
                    color: accountConfirm === "delete" ? "#991B1B" : T.text,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {accountConfirm === "logout" ? "Sign out?" : "Delete account permanently?"}
                </h2>
                <p
                  id="account-confirm-desc"
                  style={{
                    margin: "12px 0 0",
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: T.textSec,
                  }}
                >
                  {accountConfirm === "logout" ? (
                    <>
                      You will be <strong style={{ color: T.text }}>signed out on this device</strong>. You will need
                      your email or phone to sign in again. If you have this app open elsewhere, refresh after signing
                      back in.
                    </>
                  ) : (
                    <>
                      This <strong style={{ color: "#991B1B" }}>permanently deletes</strong> your ZappyFind account and
                      all profile data stored here. This cannot be undone. You will be taken to the login screen and
                      must start fresh or sign in with another account.
                    </>
                  )}
                </p>
                <div
                  style={{
                    marginTop: 20,
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAccountConfirm(null)}
                    style={{
                      height: 40,
                      padding: "0 16px",
                      borderRadius: 10,
                      border: `1px solid ${T.borderStrong}`,
                      background: "#FFFFFF",
                      color: T.text,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: T.sans,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={accountConfirm === "logout" ? runLogout : runDeleteAccount}
                    style={{
                      height: 40,
                      padding: "0 16px",
                      borderRadius: 10,
                      border: "none",
                      background:
                        accountConfirm === "logout"
                          ? "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)"
                          : "linear-gradient(135deg, #F87171 0%, #DC2626 100%)",
                      color: "#FFFFFF",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: T.sans,
                    }}
                  >
                    {accountConfirm === "logout" ? "Sign out" : "Yes, delete forever"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

// ── Match Hero Card ──────────────────────────────────────────────────────────

function MatchHeroCard({
  greeting,
  displayName,
  activeCompanies,
  totalJobs,
  savedJobs,
  recruiterViews,
  roleLabel,
  topPercentile,
  totalCandidates,
  hasCompletedInterview,
  retryMode = false,
  paidRetryMode = false,
  analysisMode = false,
  internetFallbackMode = false,
  onStartInterview,
  onViewSaved,
}: {
  greeting: string;
  displayName: string;
  activeCompanies: number;
  totalJobs: number;
  savedJobs: number;
  recruiterViews: number;
  roleLabel: string;
  topPercentile: number;
  totalCandidates: number;
  hasCompletedInterview: boolean;
  retryMode?: boolean;
  paidRetryMode?: boolean;
  analysisMode?: boolean;
  internetFallbackMode?: boolean;
  onStartInterview: () => void;
  onViewSaved: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
      style={{
        borderRadius: 24,
        padding: 22,
        background: T.heroGradient,
        border: "1px solid rgba(255,200,160,0.3)",
        boxShadow:
          "0 4px 12px rgba(234,88,12,0.06), 0 12px 32px rgba(234,88,12,0.08)",
        position: "relative",
        overflow: "hidden",
        marginBottom: 6,
      }}
    >
      {/* Decorative glow */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Greeting + standing */}
      <div style={{ position: "relative", marginBottom: 18 }}>
        <h1
          style={{
            fontFamily: T.serif,
            fontSize: "clamp(22px, 6.5vw, 27px)",
            fontWeight: 400,
            color: T.text,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {greeting},{" "}
          <span
            style={{
              backgroundImage: T.accentGradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {displayName}
          </span>
        </h1>
        {hasCompletedInterview ? (
          analysisMode ? (
            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.span
                  animate={{ scale: [1, 1.14, 1], opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#EA580C",
                    boxShadow: "0 0 0 6px rgba(234,88,12,0.12)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontSize: 13.5, color: T.text, lineHeight: 1.35, fontWeight: 650, letterSpacing: "-0.01em" }}>
                  ZappyFind AI is curating your best-fit roles now
                </div>
              </div>
              <div style={{ fontSize: 12, color: T.textSec, letterSpacing: "-0.01em" }}>
                Next: await a WhatsApp or email alert within a few hours when your recommended matches are ready.
              </div>
            </div>
          ) : (
            <p
              style={{
                fontSize: 13,
                color: T.textSec,
                marginTop: 6,
                letterSpacing: "-0.01em",
                lineHeight: 1.5,
                margin: "6px 0 0",
              }}
            >
              {internetFallbackMode ? (
                <>
                  You are a strong fit. We are onboarding ZappyFind roles that match your
                  preferences while surfacing top internet roles for you to apply now.
                </>
              ) : (
                <>
                  You're in the{" "}
                  <strong style={{ color: T.accent, fontWeight: 700 }}>
                    top {topPercentile}%
                  </strong>{" "}
                  of {totalCandidates.toLocaleString()} {roleLabel} candidates on ZappyFind
                </>
              )}
            </p>
          )
        ) : (
          <p
            style={{
              fontSize: 13,
              color: T.textSec,
              marginTop: 6,
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
              margin: "6px 0 0",
            }}
          >
            {paidRetryMode
              ? <>You have completed <strong style={{ color: T.text, fontWeight: 600 }}>3 unsuccessful retake attempts</strong>. Free retakes are now paused for this profile.</>
              : retryMode
              ? "Your last ZappyFind call was interrupted, so your best matches are still locked."
              : "One last step to see where you stand among Product Designers on ZappyFind — and unlock top matches + recruiter introductions."}
          </p>
        )}
      </div>

      {!hasCompletedInterview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: EASE }}
          style={{
            position: "relative",
            borderRadius: 16,
            padding: 14,
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,200,160,0.22)",
            marginBottom: 10,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 10,
                  background: "rgba(234,88,12,0.12)",
                  border: "1px solid rgba(234,88,12,0.16)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Mic size={13} color={T.accent} strokeWidth={2} />
              </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: T.text,
                letterSpacing: "-0.01em",
              }}
            >
              {paidRetryMode
                ? "Free retakes are paused for this profile"
                : retryMode
                ? "Retake your call to unlock top matches"
                : "Complete your Zappy conversation to unlock your home feed"}
            </div>
            </div>
            <div
              style={{
                fontSize: 12,
                color: T.textSec,
                marginTop: 0,
                lineHeight: 1.45,
              }}
            >
              {paidRetryMode
                ? "Next actions: pay for an additional retake or contact support if this was due to a technical issue."
                : retryMode
                ? "Usually caused by network/audio issues. A quick retake (~10 min) unlocks your ranking, full match insights, and recruiter access."
                : "After a quick (~10 min) voice interview, you’ll unlock your standing, top matches, and direct recruiter introductions."}
            </div>
            {!paidRetryMode && (
              <button
                onClick={onStartInterview}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: "11px 12px",
                  borderRadius: 12,
                  border: "none",
                  background: T.accentGradient,
                  color: "white",
                  cursor: "pointer",
                  fontFamily: T.sans,
                  fontSize: 13,
                  fontWeight: 650,
                  letterSpacing: "-0.01em",
                  boxShadow: "0 6px 18px rgba(234,88,12,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Mic size={14} color="white" strokeWidth={2} />
                {retryMode ? "Retake ZappyFind call" : "Start voice interview"}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {hasCompletedInterview && (
        analysisMode ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.45, ease: EASE }}
            style={{ marginTop: 12 }}
          >
            <div
              style={{
                height: 5,
                borderRadius: 999,
                background: "rgba(234,88,12,0.16)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{ left: ["-32%", "100%"] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-32%",
                  width: "32%",
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, rgba(255,143,86,0) 0%, #EA580C 50%, rgba(255,143,86,0) 100%)",
                }}
              />
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.12, 1] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#EA580C",
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <>
            {/* Three-stat strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5, ease: EASE }}
              style={{
                position: "relative",
                display: "flex",
                borderRadius: 14,
                background: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,200,160,0.18)",
                overflow: "hidden",
              }}
            >
              {[
                {
                  value: totalJobs,
                  label: "Curated roles",
                  icon: <Sparkles size={13} color="#D97706" strokeWidth={2.2} />,
                },
                {
                  value: 16,
                  label: "Applied",
                  icon: <Briefcase size={13} color={T.accent} strokeWidth={2.2} />,
                },
                {
                  value: savedJobs,
                  label: "Saved",
                  icon: <Bookmark size={13} color="#7C3AED" strokeWidth={2.2} />,
                },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    padding: "12px 0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    borderRight:
                      i < 2 ? "1px solid rgba(255,200,160,0.15)" : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginBottom: 1,
                    }}
                  >
                    {stat.icon}
                    <span
                      style={{
                        fontFamily: T.serif,
                        fontSize: 22,
                        color: T.text,
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      <AnimatedCounter
                        target={stat.value}
                        duration={1000 + i * 200}
                      />
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10.5,
                      color: T.textTer,
                      letterSpacing: "-0.01em",
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Quick actions row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.45, ease: EASE }}
              style={{
                marginTop: 10,
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 0",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.52)",
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: T.textSec,
                  letterSpacing: "-0.01em",
                }}
              >
                <Users size={12} color="#6B5FA8" strokeWidth={1.9} />
                {recruiterViews} recruiter views
              </div>
            </motion.div>
          </>
        )
      )}

    </motion.div>
  );
}


// ── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  action,
  onAction,
  delay = 0.2,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        marginTop: 32,
        marginBottom: 14,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 20,
            color: T.text,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 13,
              color: T.textTer,
              marginTop: 2,
              letterSpacing: "-0.01em",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {action && onAction && (
        <button
          type="button"
          onClick={onAction}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: T.accent,
            letterSpacing: "-0.01em",
            fontFamily: T.sans,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {action}
          <ChevronRight size={14} strokeWidth={2.2} />
        </button>
      )}
    </motion.div>
  );
}

// ── Job Match Card ───────────────────────────────────────────────────────────

type MockJob = (typeof MOCK_JOBS)[number];

function JobMatchCard({
  job,
  index,
  onTap,
  locked = false,
  blurInsight = false,
  hideScore = false,
  headerIconSize = 15,
}: {
  job: MockJob;
  index: number;
  onTap: () => void;
  locked?: boolean;
  blurInsight?: boolean;
  hideScore?: boolean;
  headerIconSize?: number;
}) {
  const scoreColor =
    job.matchScore >= 90
      ? T.success
      : job.matchScore >= 80
        ? T.warning
        : T.textSec;
  const scoreBg =
    job.matchScore >= 90
      ? T.successSoft
      : job.matchScore >= 80
        ? T.warningSoft
        : "rgba(28,25,23,0.05)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25 + index * 0.09, ease: EASE }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (locked) return;
        onTap();
      }}
      style={{
        borderRadius: 20,
        padding: 18,
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        boxShadow: T.shadow,
        cursor: locked ? "default" : "pointer",
        position: "relative",
      }}
    >
      {locked && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(28,25,23,0.07)",
            color: T.textSec,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          <Lock size={11} strokeWidth={2.2} />
          Locked
        </div>
      )}
      {/* Top: logo + title + score */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={jobLogoAvatarStyle(job.logoColor)}>{job.logoLetter}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: T.text,
              letterSpacing: "-0.02em",
              marginBottom: 3,
              paddingRight: 56,
            }}
          >
            {job.title}
          </div>
          <div
            style={{
              fontSize: 13,
              color: T.textSec,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>{job.company}</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: T.textTer,
                display: "inline-block",
              }}
            />
            <span style={{ color: T.textTer }}>{job.postedAgo}</span>
          </div>
        </div>
      </div>

      {/* Match badge — top right */}
      {!hideScore && (
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            padding: "4px 10px",
            borderRadius: 999,
            background: scoreBg,
            fontSize: 13,
            fontWeight: 700,
            color: scoreColor,
            letterSpacing: "-0.02em",
          }}
        >
          {job.matchScore}%
        </div>
      )}

      {/* Meta chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 12,
        }}
      >
        {[
          { icon: <MapPin size={11} />, text: job.location },
          { icon: null, text: job.locationType },
          { icon: null, text: job.salary },
        ].map((chip, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(28,25,23,0.035)",
              fontSize: 12,
              color: T.textSec,
              fontWeight: 500,
            }}
          >
            {chip.icon}
            {chip.text}
          </span>
        ))}
      </div>

      {/* Why you match — icon + soft panel (no side accent bar) */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          padding: "12px 14px",
          borderRadius: 14,
          background:
            "linear-gradient(160deg, rgba(234,88,12,0.09) 0%, rgba(255,255,255,0.92) 42%, rgba(255,248,242,0.85) 100%)",
          border: `1px solid rgba(234,88,12,0.14)`,
          boxShadow: "0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 8px rgba(234,88,12,0.06)",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 700,
              color: T.accentDark,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 5,
            }}
          >
            <Sparkles size={headerIconSize} color={T.accent} fill={T.accent} strokeWidth={1.9} />
            Why you match
          </div>
          <div
            style={{
              fontSize: 13,
              color: T.textSec,
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
              filter: blurInsight ? "blur(3px)" : "none",
              userSelect: blurInsight ? "none" : "auto",
              pointerEvents: blurInsight ? "none" : "auto",
            }}
          >
            {job.whyMatch}
          </div>
        </div>
      </div>

    </motion.div>
  );
}

// ── Review All Jobs Button ───────────────────────────────────────────────────

function ReviewAllButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55, ease: EASE }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      type="button"
      style={{
        width: "100%",
        marginTop: 14,
        padding: "15px",
        borderRadius: 16,
        border: "none",
        background: T.accentGradient,
        color: "white",
        fontSize: 15,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        cursor: "pointer",
        fontFamily: T.sans,
        boxShadow:
          "0 4px 20px rgba(234,88,12,0.3), 0 1px 4px rgba(234,88,12,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      Review all {count} jobs
      <ArrowRight size={16} strokeWidth={2.2} />
    </motion.button>
  );
}

function RetakeCallTipsCard({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: EASE }}
      style={{
        borderRadius: 20,
        padding: 0,
        background:
          "linear-gradient(165deg, rgba(255,255,255,0.98) 0%, rgba(255,249,244,0.94) 100%)",
        border: "1px solid rgba(234,88,12,0.14)",
        boxShadow: "0 8px 24px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.05)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          background:
            "linear-gradient(90deg, rgba(234,88,12,0.1) 0%, rgba(255,255,255,0) 85%)",
          borderBottom: "1px solid rgba(234,88,12,0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              background: "rgba(234,88,12,0.12)",
              border: "1px solid rgba(234,88,12,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Mic size={15} color={T.accent} strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: "-0.01em" }}>
            Quick prep for a stronger retake
          </span>
        </div>
      </div>
      <div
        style={{
          padding: "12px 16px 4px",
          fontSize: 12,
          color: T.textSec,
          lineHeight: 1.45,
          marginBottom: 10,
          letterSpacing: "-0.01em",
        }}
      >
        This takes under a minute and can significantly improve your call quality.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 16px 14px" }}>
        {[
          "Use a quiet room and earphones for clear audio.",
          "Answer naturally in your own words; no script needed.",
          "Use short examples (problem -> action -> result).",
          "If the call drops, reopen and continue immediately.",
        ].map((tip, idx) => (
          <div
            key={tip}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
              fontSize: 12,
              color: T.textSec,
              lineHeight: 1.45,
              border: "1px solid rgba(28,25,23,0.06)",
              background: "rgba(255,255,255,0.72)",
              borderRadius: 10,
              padding: "8px 10px",
            }}
          >
            <span
              style={{
                color: T.accent,
                lineHeight: 1,
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(234,88,12,0.1)",
                borderRadius: 999,
                minWidth: 18,
                height: 18,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              {idx + 1}
            </span>
            <span>{tip}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Case 1 mobile — recap processing empty state (mirrors desktop pending deck) ── */
const CASE1_RECAP_GRADIENT =
  "linear-gradient(165deg, rgba(255,252,247,1) 0%, rgba(254,249,243,1) 50%, rgba(255,246,236,0.96) 100%)";
const CASE1_RECAP_BORDER = "rgba(120, 72, 34, 0.11)";
const CASE1_RECAP_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.78), 0 1px 2px rgba(124,58,10,0.04), 0 12px 34px rgba(124,58,10,0.05)";
const CASE1_RECAP_TEXTURE =
  "repeating-linear-gradient(0deg, rgba(120,53,15,0.02) 0, rgba(120,53,15,0.02) 1px, transparent 1px, transparent 52px)";

const CASE1_PENDING_PHASES = [
  { key: "transcribe" as const, label: "Transcribing" },
  { key: "analyse" as const, label: "Analysing" },
  { key: "summarise" as const, label: "Summarising" },
];

type Case1RecapVariant = "pending" | "ready";

function Case1RecapVariantToggle({
  variant,
  onChange,
}: {
  variant: Case1RecapVariant;
  onChange: (v: Case1RecapVariant) => void;
}) {
  const items: Array<{ key: Case1RecapVariant; label: string }> = [
    { key: "pending", label: "Processing" },
    { key: "ready", label: "Ready" },
  ];
  return (
    <div
      role="tablist"
      aria-label="Interview summary state"
      style={{
        display: "inline-flex",
        alignSelf: "flex-end",
        alignItems: "center",
        gap: 4,
        borderRadius: 999,
        border: `1px solid ${CASE1_RECAP_BORDER}`,
        background: "rgba(255,252,247,0.9)",
        padding: 4,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {items.map((item) => {
        const active = variant === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.key)}
            style={{
              position: "relative",
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              cursor: "pointer",
              color: active ? "#fff" : "#7C4A13",
              background: "transparent",
              fontFamily: T.sans,
            }}
          >
            {active && (
              <motion.span
                layoutId="case1-mobile-recap-variant-pill"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 999,
                  background: T.accentGradient,
                  boxShadow: "0 2px 8px rgba(234,88,12,0.28)",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            )}
            <span style={{ position: "relative" }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function MobileInterviewRecapPendingCard() {
  const reduceMotion = useReducedMotion();
  const activePhaseIndex = 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.32, ease: EASE }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        border: `1px solid ${CASE1_RECAP_BORDER}`,
        background: CASE1_RECAP_GRADIENT,
        boxShadow: CASE1_RECAP_SHADOW,
        padding: "16px 16px 18px",
      }}
      aria-busy
      aria-live="polite"
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: CASE1_RECAP_TEXTURE,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -56,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234,88,12,0.11) 0%, rgba(251,146,60,0.05) 45%, transparent 72%)",
          filter: "blur(3px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(234,88,12,0.22), transparent)",
          pointerEvents: "none",
        }}
      />
      {!reduceMotion && (
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 2,
            width: "34%",
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.7) 50%, transparent 100%)",
            filter: "blur(0.4px)",
          }}
          animate={{ x: ["-34%", "320%"] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              color: "#7C4A13",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            AI Interview summary
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              borderRadius: 999,
              padding: "3px 8px",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(234,88,12,0.1)",
              color: "#C2410C",
              border: "1px solid rgba(234,88,12,0.22)",
            }}
          >
            <motion.span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#EA580C",
              }}
              animate={
                reduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }
              }
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            In progress
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            marginTop: 2,
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            color: T.text,
            fontFamily: T.sans,
          }}
        >
          Zappy is listening back to your interview.
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            lineHeight: 1.55,
            color: "rgba(68,64,60,0.9)",
            letterSpacing: "-0.01em",
          }}
        >
          We’re turning your 14:22 conversation into a human-grade recap. A few honest signals, not a
          score. Usually ready in under a minute.
        </p>

        <div
          style={{
            borderRadius: 14,
            border: "1px solid rgba(120,72,34,0.1)",
            background: "rgba(255,253,250,0.78)",
            backdropFilter: "blur(6px)",
            padding: "12px 12px 10px",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 14px", alignItems: "center" }}>
            {CASE1_PENDING_PHASES.map((phase, i) => {
              const state: "done" | "active" | "upcoming" =
                i < activePhaseIndex ? "done" : i === activePhaseIndex ? "active" : "upcoming";
              const color =
                state === "done"
                  ? T.success
                  : state === "active"
                    ? T.accent
                    : "rgba(120,113,108,0.65)";
              return (
                <div key={phase.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      display: "flex",
                      width: 20,
                      height: 20,
                      flexShrink: 0,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      background:
                        state === "done"
                          ? T.successSoft
                          : state === "active"
                            ? "rgba(234,88,12,0.12)"
                            : "rgba(28,25,23,0.05)",
                      border: `1px solid ${
                        state === "done"
                          ? "rgba(5,150,105,0.35)"
                          : state === "active"
                            ? "rgba(234,88,12,0.35)"
                            : "rgba(28,25,23,0.08)"
                      }`,
                    }}
                  >
                    {state === "done" ? (
                      <Check size={12} strokeWidth={2.6} color={color} />
                    ) : state === "active" ? (
                      <motion.span
                        animate={reduceMotion ? undefined : { rotate: 360 }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                        style={{ display: "inline-flex" }}
                      >
                        <Loader2 size={12} strokeWidth={2.4} color={color} />
                      </motion.span>
                    ) : (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: color,
                        }}
                      />
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: state === "upcoming" ? T.textSec : T.text,
                      letterSpacing: "-0.01em",
                      opacity: state === "upcoming" ? 0.75 : 1,
                    }}
                  >
                    {phase.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {/* One row of placeholders on mobile preview; desktop pending deck keeps four tiles. */}
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 12,
                border: "1px solid rgba(120,72,34,0.1)",
                background: "rgba(255,253,250,0.72)",
                padding: "10px 10px 12px",
                minHeight: 72,
              }}
            >
              {!reduceMotion && (
                <motion.span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "45%",
                    left: "-45%",
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.14) 50%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                  animate={{ left: ["-45%", "120%"] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.16,
                  }}
                />
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span
                  style={{
                    height: 8,
                    borderRadius: 999,
                    width: `${58 + (i % 3) * 8}%`,
                    background: "rgba(120,72,34,0.14)",
                  }}
                />
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(234,88,12,0.22)",
                  }}
                />
              </div>
              <span
                style={{
                  display: "block",
                  marginTop: 8,
                  height: 12,
                  borderRadius: 6,
                  width: `${48 + (i % 2) * 18}%`,
                  background: "linear-gradient(90deg, rgba(234,88,12,0.18) 0%, rgba(234,88,12,0.08) 100%)",
                }}
              />
              <span
                style={{
                  display: "block",
                  marginTop: 6,
                  height: 6,
                  borderRadius: 999,
                  width: "88%",
                  background: "rgba(28,25,23,0.08)",
                }}
              />
              <span
                style={{
                  display: "block",
                  marginTop: 4,
                  height: 6,
                  borderRadius: 999,
                  width: "62%",
                  background: "rgba(28,25,23,0.06)",
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <Brain size={14} strokeWidth={2} color="#C2410C" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden />
          <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(68,64,60,0.82)", lineHeight: 1.5 }}>
            You can listen back to the recording below. We&rsquo;ll drop your recap here as soon as
            it&rsquo;s ready.
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function InterviewAnalysisCard() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45, ease: EASE }}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        border: `1px solid ${CASE1_RECAP_BORDER}`,
        background: CASE1_RECAP_GRADIENT,
        boxShadow: CASE1_RECAP_SHADOW,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: CASE1_RECAP_TEXTURE,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -56,
          right: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234,88,12,0.1) 0%, rgba(251,146,60,0.05) 45%, transparent 72%)",
          filter: "blur(3px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(234,88,12,0.22), transparent)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "16px 16px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              color: "#7C4A13",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            AI Interview summary
          </p>
          <h2
            style={{
              margin: 0,
              marginTop: 8,
              fontSize: 20,
              fontWeight: 600,
              lineHeight: 1.18,
              letterSpacing: "-0.02em",
              color: T.text,
              fontFamily: T.sans,
            }}
          >
            {INTERVIEW_RECAP_VERDICT}
          </h2>
          <p
            style={{
              margin: 0,
              marginTop: 10,
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "rgba(68,64,60,0.9)",
              letterSpacing: "-0.01em",
            }}
          >
            {INTERVIEW_RECAP_SUMMARY}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {ANALYSIS_TRAITS.map((trait) => {
            const accent = traitAccent(trait.level);
            return (
              <div
                key={trait.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  borderRadius: 14,
                  border: "1px solid rgba(120,72,34,0.1)",
                  background: "rgba(255,253,250,0.72)",
                  backdropFilter: "blur(6px)",
                  padding: "12px 11px 12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: T.textSec,
                      letterSpacing: "0.08em",
                    }}
                  >
                    {trait.label}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: accent,
                      flexShrink: 0,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    fontFamily: T.sans,
                    color: accent,
                  }}
                >
                  {trait.level}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    lineHeight: 1.45,
                    color: "rgba(68,64,60,0.86)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {trait.blurb}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              minHeight: 40,
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(234,88,12,0.42)",
              background: showDetails ? "rgba(234,88,12,0.1)" : "rgba(255,255,255,0.78)",
              color: T.accent,
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              cursor: "pointer",
              fontFamily: T.sans,
            }}
          >
            {showDetails ? "Hide detailed analysis" : "View detailed analysis"}
            <ChevronDown
              size={14}
              strokeWidth={2.3}
              color={T.accent}
              style={{
                transform: showDetails ? "rotate(180deg)" : "none",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 6, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.26, ease: EASE }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 2 }}>
                {ANALYSIS_TRAITS.map((trait) => {
                  const accent = traitAccent(trait.level);
                  return (
                    <div
                      key={`${trait.label}-detail`}
                      style={{
                        borderRadius: 14,
                        border: "1px solid rgba(120,72,34,0.1)",
                        background: "rgba(255,253,250,0.85)",
                        padding: "12px 12px 12px",
                      }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: T.text,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {trait.label}
                        </span>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: 999,
                            padding: "3px 8px",
                            fontSize: 10.5,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            background: `${accent}14`,
                            color: accent,
                          }}
                        >
                          {trait.level}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "8px 0 0",
                          fontSize: 12.5,
                          lineHeight: 1.55,
                          color: "rgba(68,64,60,0.9)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {trait.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}


// ── Mini Arc Card ───────────────────────────────────────────────────────────

function MiniArcCard({
  insight,
  delay,
}: {
  insight: (typeof AI_INSIGHTS)[number];
  delay: number;
}) {
  const arcSize = 80;
  const sw = 6;
  const r = (arcSize - sw) / 2;
  const circ = r * 2 * Math.PI;
  const arcLength = circ * 0.5;
  const userOffset = arcLength - (insight.score / 100) * arcLength;
  const topPercent = 100 - insight.percentile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: EASE }}
      style={{
        padding: "16px 8px 14px",
        borderRadius: 16,
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        boxShadow: "0 1px 4px rgba(28,25,23,0.04)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Score */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: T.serif,
            fontSize: 26,
            color: T.text,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {insight.score}
        </span>
        <span
          style={{
            fontFamily: T.serif,
            fontSize: 14,
            color: T.textSec,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          %
        </span>
      </div>

      {/* Percentile */}
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 600,
          color: insight.color,
          letterSpacing: "-0.01em",
          marginTop: 3,
        }}
      >
        Top {topPercent}%
      </span>

      {/* Arc */}
      <div
        style={{
          width: arcSize,
          height: arcSize * 0.42,
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <svg
          width={arcSize}
          height={arcSize}
          style={{ transform: "rotate(180deg)" }}
        >
          {/* Track */}
          <circle
            cx={arcSize / 2}
            cy={arcSize / 2}
            r={r}
            fill="none"
            stroke="rgba(28,25,23,0.06)"
            strokeWidth={sw}
            strokeDasharray={`${arcLength} ${circ}`}
            strokeLinecap="round"
          />
          {/* Score arc */}
          <motion.circle
            cx={arcSize / 2}
            cy={arcSize / 2}
            r={r}
            fill="none"
            stroke={insight.color}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circ}`}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: userOffset }}
            transition={{ duration: 1, delay: delay + 0.15, ease: EASE }}
          />
        </svg>
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: T.text,
          letterSpacing: "-0.01em",
          textAlign: "center",
          lineHeight: 1.2,
          marginTop: 4,
        }}
      >
        {insight.label}
      </span>
    </motion.div>
  );
}

// ── Assessment Card ─────────────────────────────────────────────────────────

function AssessmentCard() {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
      style={{
        borderRadius: 22,
        overflow: "hidden",
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        boxShadow: T.shadowLg,
      }}
    >
      {/* AI Summary Header */}
      <div
        style={{
          padding: "20px 22px 0",
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: T.accentGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 2px 10px rgba(234,88,12,0.2)",
          }}
        >
          <Sparkles size={16} color="white" strokeWidth={2} />
        </motion.div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: T.text,
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
              marginBottom: 4,
            }}
          >
            Based on your voice interview, here's how Zappy understands you
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.textTer,
              lineHeight: 1.45,
              letterSpacing: "-0.01em",
              fontStyle: "italic",
            }}
          >
            "You're a structured thinker with strong conviction — the kind of designer who elevates teams, not just screens."
          </div>
        </div>
      </div>

      {/* Dimension grid — mini arc gauges */}
      <div
        style={{
          padding: "16px 18px 8px",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: T.textTer,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          vs. 2,340 {AI_INSIGHTS[0].peerGroup}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          {AI_INSIGHTS.slice(0, 3).map((insight, i) => (
            <MiniArcCard key={insight.label} insight={insight} delay={0.4 + i * 0.08} />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 10,
          }}
        >
          {AI_INSIGHTS.slice(3).map((insight, i) => (
            <MiniArcCard key={insight.label} insight={insight} delay={0.64 + i * 0.08} />
          ))}
        </div>
      </div>

      {/* Trust footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
        style={{
          padding: "12px 22px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            background: "rgba(5,150,105,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={11} color="#059669" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontSize: 11,
            color: T.textTer,
            lineHeight: 1.4,
            letterSpacing: "-0.005em",
          }}
        >
          This assessment is shared with recruiters to present you beyond your resume. Scores update with each interaction.
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── Video Intro Card ─────────────────────────────────────────────────────────

function VideoIntroCard({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
      style={{
        borderRadius: 22,
        overflow: "hidden",
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        boxShadow: T.shadowLg,
      }}
    >
      {/* Thin warm accent stripe at top */}
      <div
        style={{
          height: 3,
          background: T.accentGradient,
        }}
      />

      <div style={{ padding: "20px 22px 22px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 16,
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: T.accentGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 16px rgba(234,88,12,0.3)",
            }}
          >
            <Play size={17} color="white" fill="white" strokeWidth={0} />
          </motion.div>
          <div>
            <div
              style={{
                fontFamily: T.sans,
                fontWeight: 600,
                fontSize: 15,
                color: T.text,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Your Intro Video
            </div>
            <div
              style={{
                marginTop: 3,
                fontSize: 11,
                color: T.textTer,
                letterSpacing: "-0.01em",
              }}
            >
              Shared only with verified recruiters
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 13.5,
            color: T.textSec,
            lineHeight: 1.55,
            letterSpacing: "-0.01em",
            marginBottom: 16,
          }}
        >
          Profiles with video get{" "}
          <strong style={{ color: T.text, fontWeight: 700 }}>
            3× more recruiter attention
          </strong>
          . Zappy scripts it for you — just hit record.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 18,
          }}
        >
          <CheckCircle2
            size={13}
            color={T.success}
            strokeWidth={2.2}
            style={{ flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: T.success,
              letterSpacing: "-0.01em",
            }}
          >
            87% got contacted within 2 weeks
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          type="button"
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: T.accentGradient,
            color: "white",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            fontFamily: T.sans,
            boxShadow:
              "0 4px 20px rgba(234,88,12,0.3), 0 1px 4px rgba(234,88,12,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Play size={14} strokeWidth={2.5} fill="white" />
          Start Recording
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            · 2 min
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── "How Zappy Sees You" Card ────────────────────────────────────────────────

const SOURCE_ICONS: Record<string, (color: string) => React.ReactNode> = {
  file: (c) => <FileText size={14} color={c} strokeWidth={2} />,
  target: (c) => <Target size={14} color={c} strokeWidth={2} />,
  chat: (c) => <MessageCircle size={14} color={c} strokeWidth={2} />,
  mic: (c) => <Mic size={14} color={c} strokeWidth={2} />,
};

function ZappyUnderstandingCard({
  hasInterview,
}: {
  hasInterview: boolean;
}) {
  const sources = hasInterview
    ? UNDERSTANDING_SOURCES
    : UNDERSTANDING_SOURCES.filter((s) => s.key !== "voice");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
      style={{
        borderRadius: 22,
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        boxShadow: T.shadow,
        overflow: "hidden",
      }}
    >
      {/* Header strip */}
      <div
        style={{
          padding: "16px 20px 14px",
          background:
            "linear-gradient(135deg, rgba(234,88,12,0.06) 0%, rgba(99,102,241,0.04) 100%)",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: T.accentGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(234,88,12,0.25)",
            flexShrink: 0,
          }}
        >
          <Sparkles size={15} color="white" strokeWidth={2} />
        </motion.div>
        <div>
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 17,
              color: T.text,
              letterSpacing: "-0.02em",
            }}
          >
            How Zappy Sees You
          </div>
          <div style={{ fontSize: 11, color: T.textTer, marginTop: 1 }}>
            Built from {hasInterview ? "4" : "3"} data sources across your
            journey
          </div>
        </div>
      </div>

      {/* Insight sources */}
      <div style={{ padding: "6px 0" }}>
        {sources.map((src, i) => {
          const iconFn = SOURCE_ICONS[src.icon];
          return (
            <motion.div
              key={src.key}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.1, ease: EASE }}
              style={{
                padding: "14px 20px",
                borderBottom:
                  i < sources.length - 1
                    ? `1px solid ${T.border}`
                    : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: src.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {iconFn?.(src.color)}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: src.color,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {src.source}
                </span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.55,
                  color: T.textSec,
                  letterSpacing: "-0.01em",
                  paddingLeft: 32,
                }}
              >
                {src.insight}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Locked voice section when interview not done */}
      {!hasInterview && (
        <div
          style={{
            padding: "14px 20px 16px",
            background: "rgba(28,25,23,0.015)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 7,
                background: "rgba(28,25,23,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Mic size={13} color={T.textTer} strokeWidth={2} />
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: T.textTer,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Voice interview — not yet completed
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.textTer,
              paddingLeft: 32,
              lineHeight: 1.5,
            }}
          >
            Complete the voice interview to unlock communication, confidence
            & personality insights.
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ── Competitive Edge Card ────────────────────────────────────────────────────

const EDGE_ICON_MAP: Record<string, (c: string) => React.ReactNode> = {
  message: (c) => <MessageCircle size={14} color={c} strokeWidth={2} />,
  layers: (c) => <Layers size={14} color={c} strokeWidth={2} />,
  target: (c) => <Target size={14} color={c} strokeWidth={2} />,
  video: (c) => <Video size={14} color={c} strokeWidth={2} />,
  briefcase: (c) => <Briefcase size={14} color={c} strokeWidth={2} />,
  mic: (c) => <Mic size={14} color={c} strokeWidth={2} />,
};

function CompetitiveEdgeCard({
  hasInterview,
  onStartInterview,
}: {
  hasInterview: boolean;
  onStartInterview: () => void;
}) {
  const overallPercentile = 88;
  const topPercent = 100 - overallPercentile;
  const totalCandidates = 2340;
  const [showFocusAreas, setShowFocusAreas] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
      style={{
        borderRadius: 22,
        overflow: "hidden",
        background: T.cardBg,
        border: `1px solid ${T.border}`,
        boxShadow: T.shadowLg,
      }}
    >
      {/* Hero Ranking Banner */}
      <div
        style={{
          position: "relative",
          padding: "26px 22px 22px",
          background: "linear-gradient(135deg, #1A1613 0%, #2D2926 60%, #3D3530 100%)",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(234,88,12,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(234,88,12,0.05)",
          }}
        />

        <div style={{ position: "relative" }}>
          {/* Trophy + label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
            }}
          >
            <motion.div
              animate={{ rotate: [0, -6, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(234,88,12,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Trophy size={17} color="#EA580C" strokeWidth={2} />
            </motion.div>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Your standing
              </div>
            </div>
          </div>

          {/* Big stat */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              style={{
                fontFamily: T.serif,
                fontSize: 52,
                fontWeight: 400,
                color: "#EA580C",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              Top {topPercent}%
            </motion.span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
              marginTop: 6,
              letterSpacing: "-0.01em",
              lineHeight: 1.5,
            }}
          >
            among{" "}
            <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>
              {totalCandidates.toLocaleString()} Product Designers
            </span>{" "}
            on ZappyFind
          </motion.div>

          {/* Confidence note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6, ease: EASE }}
            style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 10,
              background: "rgba(234,88,12,0.1)",
              width: "fit-content",
            }}
          >
            <Flame size={13} color="#EA580C" strokeWidth={2} />
            <span
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              You're ahead of {Math.round(totalCandidates * overallPercentile / 100).toLocaleString()} candidates
            </span>
          </motion.div>
        </div>
      </div>

      {hasInterview ? (
        <>
          {/* Dimension Breakdowns */}
          <div style={{ padding: "18px 22px 6px" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: T.textTer,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Breakdown by dimension
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {COMPETITIVE_EDGE.map((item, i) => {
                const iconFn = EDGE_ICON_MAP[item.icon];
                return (
                  <motion.div
                    key={item.dimension}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5 + i * 0.08,
                      ease: EASE,
                    }}
                    style={{
                      padding: "14px 0",
                      borderBottom:
                        i < COMPETITIVE_EDGE.length - 1
                          ? `1px solid ${T.border}`
                          : "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 8,
                            background: `${item.color}12`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {iconFn?.(item.color)}
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: T.text,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.dimension}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <TrendingUp size={12} color={item.color} strokeWidth={2} />
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: item.color,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          Top {100 - item.percentile}%
                        </span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div
                      style={{
                        position: "relative",
                        height: 6,
                        borderRadius: 999,
                        background: "rgba(28,25,23,0.04)",
                        overflow: "hidden",
                        marginBottom: 6,
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentile}%` }}
                        transition={{
                          duration: 1.2,
                          delay: 0.6 + i * 0.12,
                          ease: EASE,
                        }}
                        style={{
                          height: "100%",
                          borderRadius: 999,
                          background: `linear-gradient(90deg, ${item.color}88, ${item.color})`,
                        }}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 11.5,
                        color: item.percentile >= 90 ? T.textSec : item.color,
                        fontWeight: 400,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.percentile < 90 && (
                        <ArrowUpRight size={11} color={item.color} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      )}
                      {item.tip}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Growth Insights */}
          <div style={{ padding: "0 22px 22px" }}>
            <div
              style={{
                padding: 16,
                borderRadius: 14,
                background: "rgba(28,25,23,0.018)",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={12} color={T.accent} strokeWidth={2.2} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: T.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Where to focus next
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFocusAreas((v) => !v)}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    color: T.accent,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    fontFamily: T.sans,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {showFocusAreas ? "Hide focus areas" : "View focus areas"}
                  <ChevronDown
                    size={13}
                    strokeWidth={2.2}
                    style={{
                      transform: showFocusAreas ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
              </div>

              {showFocusAreas && (
                <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 12 }}>
                  {GROWTH_INSIGHTS.map((item, i) => (
                    <motion.div
                      key={item.tag}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.9 + i * 0.08,
                        ease: EASE,
                      }}
                      style={{
                        display: "flex",
                        gap: 10,
                        padding: "11px 0",
                        borderBottom:
                          i < GROWTH_INSIGHTS.length - 1
                            ? `1px solid ${T.border}`
                            : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: item.color,
                          marginTop: 6,
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: item.color,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase" as const,
                          }}
                        >
                          {item.tag}
                        </span>
                        <div
                          style={{
                            fontSize: 12.5,
                            color: T.textSec,
                            lineHeight: 1.5,
                            letterSpacing: "-0.01em",
                            marginTop: 2,
                          }}
                        >
                          {item.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: "18px 22px 22px" }}>
          {/* Teaser dimensions — blurred bars to build curiosity */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {COMPETITIVE_EDGE.map((item, i) => {
              const iconFn = EDGE_ICON_MAP[item.icon];
              return (
                <motion.div
                  key={item.dimension}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.5 + i * 0.06, ease: EASE }}
                  style={{
                    padding: "12px 0",
                    borderBottom:
                      i < COMPETITIVE_EDGE.length - 1
                        ? `1px solid ${T.border}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 7,
                          background: `${item.color}10`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {iconFn?.(item.color)}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: T.text,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.dimension}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: T.textTer,
                        letterSpacing: "-0.01em",
                        filter: "blur(5px)",
                        userSelect: "none",
                      }}
                    >
                      Top ??%
                    </span>
                  </div>
                  {/* Blurred placeholder bar */}
                  <div
                    style={{
                      height: 5,
                      borderRadius: 999,
                      background: `linear-gradient(90deg, ${item.color}30, ${item.color}15)`,
                      filter: "blur(3px)",
                    }}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Unified value prop + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.7, ease: EASE }}
            style={{
              marginTop: 18,
              padding: 18,
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(234,88,12,0.06) 0%, rgba(255,143,86,0.04) 100%)",
              border: "1px solid rgba(234,88,12,0.12)",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.text,
                letterSpacing: "-0.02em",
                lineHeight: 1.35,
                marginBottom: 10,
              }}
            >
              See exactly where you rank among Product Designers
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {[
                { icon: <Trophy size={14} color={T.accent} strokeWidth={2} />, text: "Discover your percentile across communication, domain depth & role fit" },
                { icon: <Target size={14} color="#059669" strokeWidth={2} />, text: "Unlock curated top matches tailored to your profile" },
                { icon: <Users size={14} color="#6366F1" strokeWidth={2} />, text: "Get introduced directly to recruiters hiring for your skills" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(28,25,23,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {row.icon}
                  </div>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: T.textSec,
                      lineHeight: 1.5,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {row.text}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onStartInterview}
              style={{
                width: "100%",
                padding: "13px 14px",
                borderRadius: 14,
                border: "none",
                background: T.accentGradient,
                color: "white",
                cursor: "pointer",
                fontFamily: T.sans,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                boxShadow: "0 8px 24px rgba(234,88,12,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Mic size={15} color="white" strokeWidth={2} />
              Start your voice interview
            </button>
          </motion.div>
        </div>
      )}

      {/* Footer context */}
      <div
        style={{
          padding: "12px 22px 16px",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Star size={11} color={T.textTer} strokeWidth={2} />
        <span
          style={{
            fontSize: 10.5,
            color: T.textTer,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            lineHeight: 1.4,
          }}
        >
          Rankings update as you complete more profile steps. Based on resume, interview, preferences & market demand.
        </span>
      </div>
    </motion.div>
  );
}


// ── Skill Chip ───────────────────────────────────────────────────────────────

function SkillChip({
  name,
  demand,
  delay,
}: {
  name: string;
  demand: "high" | "medium" | "growing";
  delay: number;
}) {
  const theme = DEMAND_THEME[demand];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: EASE }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        borderRadius: 999,
        background: theme.bg,
        fontSize: 13,
        fontWeight: 500,
        color: theme.color,
        letterSpacing: "-0.01em",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: theme.color,
          flexShrink: 0,
        }}
      />
      {name}
    </motion.span>
  );
}

// ── Below-Average Dashboard ─────────────────────────────────────────────────

function BelowAverageDashboard({
  greeting,
  displayName,
  case6Mode = false,
  onStartInterview,
  onReviewJobs,
}: {
  greeting: string;
  displayName: string;
  case6Mode?: boolean;
  onStartInterview: () => void;
  onReviewJobs: () => void;
}) {
  const profileStrength = 35;

  const PLAN_ICONS: Record<string, React.ReactNode> = {
    video: <Video size={16} color="#EA580C" strokeWidth={2} />,
    layers: <Layers size={16} color="#EA580C" strokeWidth={2} />,
    file: <FileText size={16} color="#EA580C" strokeWidth={2} />,
    mic: <Mic size={16} color="#EA580C" strokeWidth={2} />,
  };

  const STRENGTH_ICONS: React.ReactNode[] = [
    <Users key="u" size={15} color="#059669" strokeWidth={2} />,
    <TrendingUp key="t" size={15} color="#6366F1" strokeWidth={2} />,
    <MessageCircle key="m" size={15} color="#D97706" strokeWidth={2} />,
  ];

  return (
    <>
      <div style={{ paddingTop: 24 }} />

      {/* ── Growth Hero Card ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15, ease: EASE }}
        style={{
          borderRadius: 24,
          padding: 22,
          background:
            "radial-gradient(ellipse at 15% 5%, #FEFAF6 0%, #FFF5ED 50%, #FFEDD5 100%)",
          border: "1px solid rgba(255,200,160,0.25)",
          boxShadow:
            "0 4px 12px rgba(234,88,12,0.04), 0 12px 32px rgba(234,88,12,0.06)",
          position: "relative",
          overflow: "hidden",
          marginBottom: 6,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", marginBottom: 20 }}>
          <h1
            style={{
              fontFamily: T.serif,
              fontSize: "clamp(22px, 6.5vw, 27px)",
              fontWeight: 400,
              color: T.text,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {greeting},{" "}
            <span
              style={{
                backgroundImage: T.accentGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {displayName}
            </span>
          </h1>
          <p
            style={{
              fontSize: 13,
              color: T.textSec,
              letterSpacing: "-0.01em",
              lineHeight: 1.55,
              margin: "6px 0 0",
            }}
          >
            {case6Mode
              ? "Profile strength is low for your current target roles. Core skills and competencies need improvement."
              : "You're building momentum, every step forward gets you closer to the right role."}
          </p>
        </div>

        {/* Profile Strength Meter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
          style={{
            padding: "14px 16px",
            borderRadius: 14,
            background: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,200,160,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: T.text,
                letterSpacing: "-0.01em",
              }}
            >
              Profile Strength
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: T.accent,
                letterSpacing: "-0.02em",
              }}
            >
              {profileStrength}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "rgba(28,25,23,0.06)",
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${profileStrength}%` }}
              transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
              style={{
                height: "100%",
                borderRadius: 999,
                background: T.accentGradient,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 11,
              color: T.textTer,
              letterSpacing: "-0.01em",
            }}
          >
            {case6Mode
              ? "Follow the growth plan below to improve your fit."
              : "Complete the steps below to unlock better matches"}
          </span>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.45, ease: EASE }}
          style={{
            marginTop: 10,
            display: "flex",
            borderRadius: 12,
            background: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,200,160,0.12)",
            overflow: "hidden",
          }}
        >
          {[
            {
              value: "3",
              label: "Growth plans",
              icon: (
                <Target size={12} color={T.accent} strokeWidth={2.2} />
              ),
            },
            {
              value: "14",
              label: "Growing matches",
              icon: (
                <Sparkles size={12} color="#D97706" strokeWidth={2.2} />
              ),
            },
            {
              value: "3",
              label: "Strengths found",
              icon: (
                <Star size={12} color={T.success} strokeWidth={2.2} />
              ),
            },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                padding: "11px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                borderRight:
                  i < 2 ? "1px solid rgba(255,200,160,0.12)" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {stat.icon}
                <span
                  style={{
                    fontFamily: T.serif,
                    fontSize: 18,
                    color: T.text,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {stat.value}
                </span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: T.textTer,
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Growth Plan ──────────────────────────────────────── */}
      <SectionHeader
        title="Your Growth Plan"
        subtitle="Small steps, big impact"
        delay={0.3}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
        style={{
          borderRadius: 22,
          overflow: "hidden",
          background: T.cardBg,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadowLg,
        }}
      >
        <div style={{ padding: "6px 0" }}>
          {GROWTH_PLAN_STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.4 + i * 0.08,
                ease: EASE,
              }}
              style={{
                padding: "16px 20px",
                borderBottom:
                  i < GROWTH_PLAN_STEPS.length - 1
                    ? `1px solid ${T.border}`
                    : "none",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  background: T.accentSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {PLAN_ICONS[step.iconType]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: T.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: step.impactColor,
                      letterSpacing: "0.03em",
                      textTransform: "uppercase" as const,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: `${step.impactColor}12`,
                      flexShrink: 0,
                      marginLeft: 8,
                    }}
                  >
                    {step.impact}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: T.textSec,
                    lineHeight: 1.5,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.description}
                </div>
              </div>
              <ChevronRight
                size={16}
                color={T.textTer}
                strokeWidth={2}
                style={{ flexShrink: 0, marginTop: 10 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Areas to Develop ──────────────────────────────── */}
      <SectionHeader
        title="Where to Focus"
        subtitle="These areas will have the biggest impact"
        delay={0.7}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
        style={{
          borderRadius: 22,
          overflow: "hidden",
          background: T.cardBg,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadowLg,
        }}
      >
        <div style={{ padding: "4px 0" }}>
          {LOW_IMPROVEMENT_AREAS.map((area, i) => (
            <motion.div
              key={area.area}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.8 + i * 0.08,
                ease: EASE,
              }}
              style={{
                padding: "16px 20px",
                borderBottom:
                  i < LOW_IMPROVEMENT_AREAS.length - 1
                    ? `1px solid ${T.border}`
                    : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.text,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {area.area}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: T.textTer,
                      fontWeight: 500,
                    }}
                  >
                    {area.current}%
                  </span>
                  <ArrowRight size={10} color={T.textTer} strokeWidth={2.5} />
                  <span
                    style={{
                      fontSize: 12,
                      color: area.color,
                      fontWeight: 700,
                    }}
                  >
                    {area.target}%
                  </span>
                </div>
              </div>

              {/* Progress bar with current and target zone */}
              <div
                style={{
                  position: "relative",
                  height: 6,
                  borderRadius: 999,
                  background: "rgba(28,25,23,0.04)",
                  overflow: "hidden",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: `${area.target}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: `${area.color}10`,
                  }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${area.current}%` }}
                  transition={{
                    duration: 1,
                    delay: 0.9 + i * 0.12,
                    ease: EASE,
                  }}
                  style={{
                    position: "relative",
                    height: "100%",
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${area.color}88, ${area.color})`,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 6,
                }}
              >
                <ArrowUpRight
                  size={12}
                  color={area.color}
                  strokeWidth={2.5}
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: T.textSec,
                    lineHeight: 1.5,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {area.advice}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div
          style={{
            padding: "14px 20px 16px",
            background: "rgba(234,88,12,0.02)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: T.accentSoft,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Sparkles size={13} color={T.accent} strokeWidth={2.2} />
            </div>
            <span
              style={{
                fontSize: 12,
                color: T.textSec,
                lineHeight: 1.5,
                letterSpacing: "-0.01em",
              }}
            >
              Focus on{" "}
              <strong style={{ color: T.text, fontWeight: 600 }}>
                one area at a time
              </strong>
              . Small, consistent improvements compound fast.
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Strengths ──────────────────────────────────────── */}
      <SectionHeader
        title="What Zappy Sees in You"
        subtitle="Every candidate has unique strengths"
        delay={0.5}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
        style={{
          borderRadius: 22,
          overflow: "hidden",
          background: T.cardBg,
          border: `1px solid ${T.border}`,
          boxShadow: T.shadowLg,
        }}
      >
        <div style={{ padding: "4px 0" }}>
          {LOW_STRENGTHS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.6 + i * 0.08,
                ease: EASE,
              }}
              style={{
                padding: "16px 20px",
                borderBottom:
                  i < LOW_STRENGTHS.length - 1
                    ? `1px solid ${T.border}`
                    : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    background: `${s.color}12`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {STRENGTH_ICONS[i]}
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: T.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: s.color,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Top {100 - s.percentile}%
                </span>
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: T.textSec,
                  lineHeight: 1.55,
                  letterSpacing: "-0.01em",
                  paddingLeft: 40,
                }}
              >
                {s.detail}
              </div>
            </motion.div>
          ))}
        </div>

        <div
          style={{
            padding: "12px 20px 14px",
            background: "rgba(5,150,105,0.02)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Sparkles size={12} color={T.success} strokeWidth={2.2} />
          <span
            style={{
              fontSize: 11,
              color: T.textTer,
              letterSpacing: "-0.005em",
              lineHeight: 1.4,
            }}
          >
            Strengths are identified from your resume, interview, and
            preferences — they update as you grow.
          </span>
        </div>
      </motion.div>

      {/* ── Jobs (Deprioritized) ───────────────────────────── */}
      <SectionHeader
        title="Roles to Grow Into"
        subtitle="Matches improve as your profile grows"
        action="See all"
        onAction={onReviewJobs}
        delay={1.0}
      />
      <div
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        {LOW_PERF_JOBS.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: 1.05 + i * 0.09,
              ease: EASE,
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onReviewJobs}
            style={{
              borderRadius: 20,
              padding: 18,
              background: T.cardBg,
              border: `1px solid ${T.border}`,
              boxShadow: T.shadow,
              cursor: "pointer",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div style={jobLogoAvatarStyle(job.logoColor)}>{job.logoLetter}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: T.text,
                    letterSpacing: "-0.02em",
                    marginBottom: 3,
                    paddingRight: 80,
                  }}
                >
                  {job.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: T.textSec,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{job.company}</span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      background: T.textTer,
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: T.textTer }}>
                    {job.postedAgo}
                  </span>
                </div>
              </div>
            </div>

            {/* Growing Match badge */}
            <div
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                padding: "4px 10px",
                borderRadius: 999,
                background: T.warningSoft,
                fontSize: 11,
                fontWeight: 700,
                color: T.warning,
                letterSpacing: "-0.01em",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <TrendingUp size={10} strokeWidth={2.5} />
              {job.matchScore}%
            </div>

            {/* Meta chips */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 12,
              }}
            >
              {[
                {
                  icon: <MapPin size={11} />,
                  text: job.location,
                },
                { icon: null, text: job.locationType },
                { icon: null, text: job.salary },
              ].map((chip, ci) => (
                <span
                  key={ci}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(28,25,23,0.035)",
                    fontSize: 12,
                    color: T.textSec,
                    fontWeight: 500,
                  }}
                >
                  {chip.icon}
                  {chip.text}
                </span>
              ))}
            </div>

            {/* Why you match */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "12px 14px",
                borderRadius: 14,
                background:
                  "linear-gradient(160deg, rgba(234,88,12,0.09) 0%, rgba(255,255,255,0.92) 42%, rgba(255,248,242,0.85) 100%)",
                border: `1px solid rgba(234,88,12,0.14)`,
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.8) inset, 0 2px 8px rgba(234,88,12,0.06)",
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    color: T.accentDark,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase" as const,
                    marginBottom: 5,
                  }}
                >
                  <Sparkles size={14} color={T.accent} fill={T.accent} strokeWidth={1.9} />
                  Potential fit
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: T.textSec,
                    lineHeight: 1.55,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {job.context}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────

interface DashboardPreviewScreenProps {
  firstName: string;
  profile: FullProfile | null;
  hasCompletedInterview: boolean;
  onStartInterview: () => void;
  onReviewJobs: () => void;
  onViewSavedJobs: () => void;
  onViewProfile: () => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
}

export function DashboardPreviewScreen({
  firstName,
  profile,
  hasCompletedInterview,
  onStartInterview,
  onReviewJobs,
  onViewSavedJobs,
  onViewProfile,
  onLogout,
  onDeleteAccount,
}: DashboardPreviewScreenProps) {
  const displayName = firstName || "Alex";
  const greeting = getTimeGreeting();
  const [activeCaseKey, setActiveCaseKey] = useState<"case-0" | "case-1" | "case-2" | "case-3" | "case-4" | "case-6" | "case-7" | "case-8">("case-1");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [case1RecapVariant, setCase1RecapVariant] = useState<Case1RecapVariant>("ready");
  const isCase1Dashboard = activeCaseKey === "case-0";
  const isCase4Dashboard = activeCaseKey === "case-4";
  const isLowPerformer = activeCaseKey === "case-2" || activeCaseKey === "case-6";
  const isCase5Dashboard = activeCaseKey === "case-3";
  const isCase7Dashboard = activeCaseKey === "case-7";
  const isCase8Dashboard = activeCaseKey === "case-8";
  const effectiveHasCompletedInterview =
    activeCaseKey === "case-0" || activeCaseKey === "case-1" || activeCaseKey === "case-4"
      ? true
      : activeCaseKey === "case-3" || activeCaseKey === "case-7" || activeCaseKey === "case-8"
        ? false
        : hasCompletedInterview;
  const isRetryCallDashboard = isCase5Dashboard || isCase7Dashboard;
  const isLockedInterviewDashboard = isCase5Dashboard || isCase7Dashboard || isCase8Dashboard;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.pageBg,
        fontFamily: T.sans,
        position: "relative",
      }}
    >
      {/* Ambient background orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(234,88,12,0.05) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "18%",
            left: -90,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(146,64,14,0.035) 0%, transparent 70%)",
          }}
        />
      </div>

      <DashboardHeader
        displayName={displayName}
        caseOptions={[
          { key: "case-0", label: "Case 1", onSelect: () => setActiveCaseKey("case-0") },
          { key: "case-1", label: "Case 2", onSelect: () => setActiveCaseKey("case-1") },
          { key: "case-2", label: "Case 3", onSelect: () => setActiveCaseKey("case-2") },
          { key: "case-4", label: "Case 4", onSelect: () => setActiveCaseKey("case-4") },
          { key: "case-3", label: "Case 5", onSelect: () => setActiveCaseKey("case-3") },
          { key: "case-6", label: "Case 6", onSelect: () => setActiveCaseKey("case-6") },
          { key: "case-7", label: "Case 7", onSelect: () => setActiveCaseKey("case-7") },
          { key: "case-8", label: "Case 8", onSelect: () => setActiveCaseKey("case-8") },
        ]}
        activeCaseKey={activeCaseKey}
        isLowPerformer={isLowPerformer}
        currentPage="home"
        onNavigateHome={() => {}}
        onNavigateJobs={onReviewJobs}
        onNavigateProfile={onViewProfile}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0 16px 48px",
        }}
      >
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          {isLowPerformer ? (
            <BelowAverageDashboard
              greeting={greeting}
              displayName={displayName}
              case6Mode={activeCaseKey === "case-6"}
              onStartInterview={onStartInterview}
              onReviewJobs={onReviewJobs}
            />
          ) : (
          <>
          {/* Hero Card */}
          <div style={{ paddingTop: 24 }} />
          <MatchHeroCard
            greeting={greeting}
            displayName={displayName}
            activeCompanies={18}
            totalJobs={42}
            savedJobs={8}
            recruiterViews={14}
            roleLabel="Product Design"
            topPercentile={12}
            totalCandidates={2340}
            hasCompletedInterview={effectiveHasCompletedInterview}
            retryMode={isRetryCallDashboard}
            paidRetryMode={isCase7Dashboard}
            analysisMode={isCase1Dashboard}
            internetFallbackMode={isCase4Dashboard}
            onStartInterview={onStartInterview}
            onViewSaved={onViewSavedJobs}
          />

          {isCase1Dashboard && (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <Case1RecapVariantToggle variant={case1RecapVariant} onChange={setCase1RecapVariant} />
              <AnimatePresence mode="wait" initial={false}>
                {case1RecapVariant === "pending" ? (
                  <MobileInterviewRecapPendingCard key="case1-pending" />
                ) : (
                  <InterviewAnalysisCard key="case1-ready" />
                )}
              </AnimatePresence>
              <InterviewRecordingCompactCard />
            </div>
          )}

          {isRetryCallDashboard && (
            <>
              <SectionHeader title="Prepare Before You Retake" delay={0.3} />
              <RetakeCallTipsCard onStart={onStartInterview} />
            </>
          )}

          {!isCase1Dashboard && (
            <>
              {/* Your Top Matches */}
              <SectionHeader
                title={
                  isCase4Dashboard
                    ? "Curated Internet Roles"
                    : isCase5Dashboard || isCase7Dashboard || isCase8Dashboard
                    ? "Potential Matches"
                    : "Your Top Matches"
                }
                subtitle={
                  isCase4Dashboard
                    ? "No ZappyFind matches yet. Apply these curated internet roles while we onboard roles for your preferences."
                    : isLockedInterviewDashboard
                    ? isCase8Dashboard
                      ? "Preview is locked until you start the ZappyFind voice interview"
                      : isCase7Dashboard
                      ? "Retakes are paused after 3 unsuccessful attempts"
                      : "Preview is locked until you retake the ZappyFind call"
                    : "Most matching jobs according to your profile"
                }
                action={isLockedInterviewDashboard || isCase4Dashboard ? undefined : "See all"}
                onAction={isLockedInterviewDashboard || isCase4Dashboard ? undefined : onReviewJobs}
                delay={0.35}
              />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MOCK_JOBS.slice(0, 3).map((job, i) => (
                <JobMatchCard
                  key={job.id}
                  job={job}
                  index={i}
                  onTap={onReviewJobs}
                  locked={isLockedInterviewDashboard}
                  blurInsight={((isCase5Dashboard || isCase7Dashboard) && i < 3) || (isCase8Dashboard && i < 3)}
                  hideScore={isLockedInterviewDashboard}
                  headerIconSize={(isCase5Dashboard || isCase7Dashboard) ? 13 : 15}
                />
              ))}
            </div>
            </>
          )}
          {!isLockedInterviewDashboard && !isCase1Dashboard ? (
            <ReviewAllButton count={isCase4Dashboard ? MOCK_JOBS.length : 42} onClick={onReviewJobs} />
          ) : (
            !isCase1Dashboard && (
            isCase7Dashboard ? null : (
              <motion.button
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.55, ease: EASE }}
                whileTap={{ scale: 0.97 }}
                onClick={onStartInterview}
                type="button"
                style={{
                  width: "100%",
                  marginTop: 14,
                  padding: "15px",
                  borderRadius: 16,
                  border: "none",
                  background: T.accentGradient,
                  color: "white",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  cursor: "pointer",
                  fontFamily: T.sans,
                  boxShadow:
                    "0 4px 20px rgba(234,88,12,0.3), 0 1px 4px rgba(234,88,12,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Mic size={16} strokeWidth={2.2} />
                {isCase8Dashboard
                  ? "Start voice interview"
                  : "Retake call to unlock all 42 jobs"}
              </motion.button>
            )
            )
          )}

          {!isRetryCallDashboard && (
            <>
              {/* Competitive Edge */}
              <SectionHeader
                title="Your Competitive Edge"
                delay={0.55}
              />
              <CompetitiveEdgeCard
                hasInterview={effectiveHasCompletedInterview}
                onStartInterview={onStartInterview}
              />

              {/* Skills × Market */}
              <SectionHeader
                title="Skills &times; Market Demand"
                delay={0.75}
              />
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8, ease: EASE }}
                style={{
                  borderRadius: 20,
                  padding: 18,
                  background: T.cardBg,
                  border: `1px solid ${T.border}`,
                  boxShadow: T.shadow,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {SKILLS_DATA.map((skill, i) => (
                    <SkillChip
                      key={skill.name}
                      name={skill.name}
                      demand={skill.demand}
                      delay={0.85 + i * 0.04}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    paddingTop: 12,
                    borderTop: `1px solid ${T.border}`,
                  }}
                >
                  {(["high", "medium", "growing"] as const).map((level) => (
                    <div
                      key={level}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: DEMAND_THEME[level].color,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          color: T.textTer,
                          fontWeight: 500,
                        }}
                      >
                        {DEMAND_THEME[level].label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          </>
          )}
        </div>
      </main>

      <SettingsBottomSheet
        open={settingsOpen}
        displayName={displayName}
        onClose={() => setSettingsOpen(false)}
        onLogout={onLogout}
        onDeleteAccount={onDeleteAccount}
      />
    </div>
  );
}
