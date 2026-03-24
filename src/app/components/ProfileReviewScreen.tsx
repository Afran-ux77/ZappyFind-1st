import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FullProfile, WorkExp, Edu, JobPreferences } from "./WelcomeScreen";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#FDFBF8",
  primary: "#1C1917",
  brand: "#C2410C",
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSecondary: "#A8A29E",
  border: "rgba(28,25,23,0.06)",          // softened
  sectionBorder: "rgba(28,25,23,0.07)",   // very light outer stroke
  inputBg: "#FFFFFF",
  cardBg: "#FFFFFF",
  orbA: "rgba(194,65,12,0.06)",
};

// ── Scrollbar reset ───────────────────────────────────────────────────────────
const scrollbarStyle = `
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(28,25,23,0.12); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(28,25,23,0.22); }
`;

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  icon, title, delay = 0, children,
}: {
  icon: React.ReactNode; title: string; delay?: number; children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Section heading */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="flex items-center justify-center rounded-lg"
          style={{
            width: "26px", height: "26px",
            background: "rgba(194,65,12,0.09)",
            flexShrink: 0,
          }}>
          {icon}
        </div>
        <span style={{
          fontSize: "11px", fontWeight: 700,
          color: C.textSecondary, letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>{title}</span>
      </div>

      {/* Section card — softened border */}
      <div style={{
        background: C.cardBg,
        border: `1px solid ${C.sectionBorder}`,
        borderRadius: "16px",
        boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
        padding: "16px",
      }}>
        {children}
      </div>
    </motion.div>
  );
}

// ── Single editable field ─────────────────────────────────────────────────────
function EditField({
  label, value, onChange, placeholder, multiline = false, required = false, rightAdornment,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; required?: boolean;
  rightAdornment?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const baseStyle: React.CSSProperties = {
    width: "100%",
    padding: rightAdornment ? "11px 44px 11px 13px" : "11px 13px",
    fontSize: "14px", fontWeight: 400,
    color: C.textPrimary,
    background: "transparent",
    border: "none", outline: "none",
    fontFamily: "Inter, sans-serif",
    resize: "none",
    lineHeight: 1.55,
  };

  return (
    <div>
      <label style={{
        display: "block",
        fontSize: "10px", fontWeight: 700,
        color: focused ? C.brand : C.textSecondary,
        letterSpacing: "0.07em", textTransform: "uppercase",
        marginBottom: "5px",
        transition: "color 0.2s",
      }}>
        {label}{required && <span style={{ color: C.brand }}> *</span>}
      </label>
      <div style={{
        borderRadius: "11px",
        background: focused ? "white" : "rgba(28,25,23,0.02)",
        border: focused
          ? "1px solid rgba(194,65,12,0.32)"
          : `1px solid ${C.border}`,
        boxShadow: focused
          ? "0 0 0 3px rgba(194,65,12,0.07)"
          : "none",
        transition: "all 0.2s",
        overflow: "hidden",
        position: "relative",
      }}>
        {multiline ? (
          <textarea
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={3}
            style={{ ...baseStyle, display: "block" }}
          />
        ) : (
          <input
            type="text"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={baseStyle}
          />
        )}
        {rightAdornment && (
          <div
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {rightAdornment}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Divider ───────────────────────────────────────────────────────────────────
const Divider = () => (
  <div style={{ height: "1px", background: "rgba(28,25,23,0.06)", margin: "18px 0" }} />
);

// ── Experience entry (no individual container) ────────────────────────────────
function ExpEntry({
  exp, onChange, onRemove, showRemove,
}: {
  exp: WorkExp;
  onChange: (updated: WorkExp) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  const set = (key: keyof WorkExp) => (v: string) => onChange({ ...exp, [key]: v });
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
    >
      {showRemove && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <motion.button
            onClick={onRemove}
            whileTap={{ scale: 0.9 }}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              background: "none", border: "none",
              cursor: "pointer", padding: "2px 0",
              color: C.textSecondary, fontSize: "12px",
              fontFamily: "Inter, sans-serif", fontWeight: 500,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9"
                stroke={C.textSecondary} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Remove
          </motion.button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {/* Company | Duration */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <EditField label="Company" value={exp.company} onChange={set("company")}
            placeholder="e.g. Razorpay" required />
          <EditField label="Duration" value={exp.duration} onChange={set("duration")}
            placeholder="Jan 2022 – Present" />
        </div>
        {/* Role */}
        <EditField label="Role / Title" value={exp.role} onChange={set("role")}
          placeholder="e.g. Product Designer" required />
        {/* Description */}
        <EditField label="Description" value={exp.description} onChange={set("description")}
          placeholder="What did you achieve here?" multiline />
      </div>
    </motion.div>
  );
}

// ── Education entry (no individual container) ─────────────────────────────────
function EduEntry({
  edu, onChange, onRemove, showRemove,
}: {
  edu: Edu;
  onChange: (updated: Edu) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  const set = (key: keyof Edu) => (v: string) => onChange({ ...edu, [key]: v });
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: "spring", stiffness: 360, damping: 28 }}
    >
      {showRemove && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <motion.button
            onClick={onRemove}
            whileTap={{ scale: 0.9 }}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              background: "none", border: "none",
              cursor: "pointer", padding: "2px 0",
              color: C.textSecondary, fontSize: "12px",
              fontFamily: "Inter, sans-serif", fontWeight: 500,
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9"
                stroke={C.textSecondary} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            Remove
          </motion.button>
        </div>
      )}
      <div className="flex flex-col gap-3">
        {/* Institution (full width) */}
        <EditField label="Institution" value={edu.institution} onChange={set("institution")}
          placeholder="e.g. IIT Delhi" required />
        {/* Degree | Year */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <EditField label="Degree" value={edu.degree} onChange={set("degree")}
            placeholder="e.g. B.Tech CS" />
          <EditField label="Year" value={edu.year} onChange={set("year")}
            placeholder="2016 – 2020" />
        </div>
        {/* Grade (full width) */}
        <EditField label="Grade / GPA" value={edu.grade} onChange={set("grade")}
          placeholder="8.4 CGPA" />
      </div>
    </motion.div>
  );
}

// ── Add button ────────────────────────────────────────────────────────────────
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: "100%", padding: "12px",
        borderRadius: "12px",
        border: `1.5px dashed rgba(28,25,23,0.15)`,
        background: "rgba(28,25,23,0.02)",
        color: C.textMuted, fontSize: "13px",
        fontWeight: 600, cursor: "pointer",
        fontFamily: "Inter, sans-serif",
        display: "flex", alignItems: "center",
        justifyContent: "center", gap: "7px",
        letterSpacing: "-0.01em",
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(194,65,12,0.3)";
        (e.currentTarget as HTMLElement).style.background = "rgba(194,65,12,0.03)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(28,25,23,0.15)";
        (e.currentTarget as HTMLElement).style.background = "rgba(28,25,23,0.02)";
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2v10M2 7h10"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {label}
    </motion.button>
  );
}

// ── Preference options (mirrored from JobPreferencesScreen for editing) ───────
const PREF_CATEGORIES = [
  { id: "swe", label: "Software Engineering" },
  { id: "design", label: "Design" },
  { id: "data", label: "Data" },
  { id: "product", label: "Product" },
  { id: "marketing", label: "Marketing" },
  { id: "finance", label: "Finance" },
  { id: "sales", label: "Sales" },
  { id: "hr", label: "Human Resources" },
  { id: "consulting", label: "Consulting" },
  { id: "ops", label: "Operations & Strategy" },
  { id: "cs", label: "Customer Success" },
  { id: "legal", label: "Legal" },
  { id: "security", label: "Security" },
  { id: "health", label: "Healthcare" },
  { id: "misc", label: "Misc. Engineering" },
];

const PREF_SUB_ROLES: Record<string, string[]> = {
  swe: ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Mobile Developer", "DevOps Engineer", "QA Engineer", "Platform Engineer"],
  design: ["Product Designer", "UI Designer", "UX Designer", "Brand Designer", "Motion Designer", "Graphic Designer"],
  data: ["Data Analyst", "Data Scientist", "ML Engineer", "Data Engineer", "BI Analyst"],
  product: ["Product Manager", "Associate PM", "Growth PM", "Technical PM", "Senior PM"],
  marketing: ["Growth Marketer", "Content Marketer", "SEO Specialist", "Performance Marketer", "Brand Marketer"],
  finance: ["Financial Analyst", "Investment Analyst", "Accountant", "Controller", "CFO"],
  sales: ["Account Executive", "SDR", "Enterprise Sales", "Inside Sales", "VP of Sales"],
  hr: ["HR Manager", "Recruiter", "L&D Specialist", "HRBP", "Talent Acquisition"],
  consulting: ["Strategy Consultant", "Management Consultant", "Associate Consultant", "Business Analyst"],
  ops: ["Operations Manager", "Business Analyst", "Chief of Staff", "Strategy Analyst"],
  cs: ["Customer Success Manager", "Account Manager", "Support Lead", "Onboarding Specialist"],
  legal: ["Corporate Lawyer", "Paralegal", "Compliance Officer", "Legal Counsel"],
  security: ["Security Engineer", "Security Analyst", "Penetration Tester", "CISO"],
  health: ["Doctor", "Nurse", "Healthcare Analyst", "Medical Technologist", "Pharmacist"],
  misc: ["Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Chemical Engineer"],
};

const PREF_WORK_SETUPS = ["Onsite", "Hybrid", "Remote"];

const PREF_PRIORITIES = [
  "Meaningful work", "Experienced leaders", "Top investors", "Wear many hats",
  "Smart teammates", "Challenging work", "Growing fast", "Cool startup",
  "Stable company", "Innovative technology", "Flexible hours", "Great benefits",
  "Remote friendly", "Work-life balance",
];

// ── Main screen ───────────────────────────────────────────────────────────────
interface ProfileReviewScreenProps {
  profile: FullProfile;
  /** Default onboarding flow (phone verification may be required). */
  mode?: "onboarding" | "edit";
  onBack: () => void;
  onContinue?: () => void;
  /** When `mode` is `edit`, called with the updated profile on Save. */
  onSave?: (next: FullProfile) => void;
}

export function ProfileReviewScreen({
  profile,
  mode = "onboarding",
  onBack,
  onContinue,
  onSave,
}: ProfileReviewScreenProps) {
  const isEdit = mode === "edit";

  // Personal
  const [name,     setName]     = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [email,    setEmail]    = useState(profile.email || "alex.designer@zappyfind.com");
  const [phone,    setPhone]    = useState(profile.phone);
  const [location, setLocation] = useState(profile.location);

  // Phone OTP (progressive disclosure, local-only for now)
  const [otpStage, setOtpStage] = useState<"idle" | "sending" | "sent" | "verifying" | "verified">("idle");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  // Experience
  const [experiences, setExperiences] = useState<WorkExp[]>(profile.experiences);

  // Education
  const [education, setEducation] = useState<Edu[]>(profile.education);

  // Skills
  const [skills,     setSkills]     = useState<string[]>(profile.skills);
  const [skillInput, setSkillInput] = useState("");

  // Job Preferences
  const [prefCategory, setPrefCategory] = useState(profile.preferences?.category ?? "");
  const [prefRoles, setPrefRoles] = useState<string[]>(profile.preferences?.roles ?? []);
  const [prefWorkSetups, setPrefWorkSetups] = useState<string[]>(profile.preferences?.workSetups ?? []);
  const [prefLocations, setPrefLocations] = useState<string[]>(profile.preferences?.locations ?? []);
  const [prefPriorities, setPrefPriorities] = useState<string[]>(profile.preferences?.priorities ?? []);
  const [prefSalaryMin, setPrefSalaryMin] = useState(profile.preferences?.salaryMin ?? 5);
  const [prefSalaryMax, setPrefSalaryMax] = useState(profile.preferences?.salaryMax ?? 30);
  const [rolesExpanded, setRolesExpanded] = useState(false);
  const [prioritiesExpanded, setPrioritiesExpanded] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setHeadline(profile.headline);
    setEmail(profile.email || "alex.designer@zappyfind.com");
    setPhone(profile.phone);
    setLocation(profile.location);
    setExperiences(profile.experiences);
    setEducation(profile.education);
    setSkills(profile.skills);
    setSkillInput("");
    setPrefCategory(profile.preferences?.category ?? "");
    setPrefRoles(profile.preferences?.roles ?? []);
    setPrefWorkSetups(profile.preferences?.workSetups ?? []);
    setPrefLocations(profile.preferences?.locations ?? []);
    setPrefPriorities(profile.preferences?.priorities ?? []);
    setPrefSalaryMin(profile.preferences?.salaryMin ?? 5);
    setPrefSalaryMax(profile.preferences?.salaryMax ?? 30);
    setOtpStage("idle");
    setOtp("");
    setOtpError(null);
    setSubmitting(false);
  }, [profile]);

  const updateExp = (id: string, updated: WorkExp) =>
    setExperiences((prev) => prev.map((e) => (e.id === id ? updated : e)));
  const removeExp = (id: string) =>
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  const addExp = () =>
    setExperiences((prev) => [
      ...prev,
      { id: `e${Date.now()}`, company: "", role: "", duration: "", description: "" },
    ]);

  const updateEdu = (id: string, updated: Edu) =>
    setEducation((prev) => prev.map((e) => (e.id === id ? updated : e)));
  const removeEdu = (id: string) =>
    setEducation((prev) => prev.filter((e) => e.id !== id));
  const addEdu = () =>
    setEducation((prev) => [
      ...prev,
      { id: `edu${Date.now()}`, institution: "", degree: "", year: "", grade: "" },
    ]);

  const addSkill = (raw: string) => {
    const v = raw.replace(/,$/, "").trim();
    if (v && !skills.includes(v)) setSkills((s) => [...s, v]);
    setSkillInput("");
  };
  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s));

  const canContinue = name.trim().length > 0;
  const hasPhone = phone.trim().length > 0;
  const phoneVerified = otpStage === "verified";
  const canProceed = isEdit
    ? canContinue && skills.length > 0
    : canContinue && (!hasPhone || phoneVerified);

  const normalizePhone = (raw: string) => raw.replace(/[^\d+]/g, "").trim();
  const isLikelyValidPhone = (raw: string) => normalizePhone(raw).replace(/[^\d]/g, "").length >= 10;

  const sendOtp = async () => {
    if (!isLikelyValidPhone(phone) || otpStage === "sending" || otpStage === "verifying" || otpStage === "verified") return;
    setOtpError(null);
    setOtpStage("sending");
    await new Promise((r) => setTimeout(r, 650));
    setOtpStage("sent");
  };

  const verifyOtp = async () => {
    if (otpStage !== "sent" || otp.trim().length < 4) return;
    setOtpError(null);
    setOtpStage("verifying");
    await new Promise((r) => setTimeout(r, 600));
    if (otp.trim() === "1234") {
      setOtpStage("verified");
      setOtpError(null);
      return;
    }
    setOtpStage("sent");
    setOtpError("Incorrect code. Try 1234 for now.");
  };

  const buildProfile = (): FullProfile => ({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    location: location.trim(),
    headline: headline.trim(),
    skills: [...skills],
    experiences: experiences.map((e) => ({ ...e })),
    education: education.map((e) => ({ ...e })),
    preferences: {
      category: prefCategory || undefined,
      roles: prefRoles.length ? [...prefRoles] : undefined,
      workSetups: prefWorkSetups.length ? [...prefWorkSetups] : undefined,
      locations: prefLocations.length ? [...prefLocations] : undefined,
      priorities: prefPriorities.length ? [...prefPriorities] : undefined,
      salaryMin: prefSalaryMin,
      salaryMax: prefSalaryMax,
      salaryCurrency: profile.preferences?.salaryCurrency,
    },
  });

  const handlePrimaryAction = async () => {
    if (!canProceed || submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    if (isEdit) {
      onSave?.(buildProfile());
    } else {
      onContinue?.();
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: C.bg, fontFamily: "Inter, sans-serif" }}>

      {/* Scrollbar styles */}
      <style>{scrollbarStyle}</style>

      {/* Orb */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: "240px", height: "240px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orbA} 0%, transparent 70%)`,
        transform: "translate(35%, -35%)",
      }} />

      {/* ── Sticky header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 px-4 pt-10 pb-4"
        style={{
          background: "rgba(253,251,248,0.94)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid rgba(28,25,23,0.05)`,
        }}>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-4">
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "white", border: `1px solid rgba(28,25,23,0.08)`,
            borderRadius: "12px", padding: "7px 13px 7px 9px",
            cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            fontFamily: "Inter, sans-serif",
          }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M9 11.5L5 7.5l4-4"
                stroke={C.textPrimary} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>Back</span>
          </button>

          {/* Parsed badge */}
          
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>
          <h1 style={{
            fontSize: "clamp(20px, 5.5vw, 24px)", fontWeight: 800,
            color: C.textPrimary, letterSpacing: "-0.04em",
            lineHeight: 1.2, marginBottom: "2px",
          }}>{isEdit ? "Edit Profile" : "Tell us about yourself"}</h1>
        </motion.div>
      </div>

      {/* ── Scrollable body ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-4 py-5 gap-5 overflow-y-auto">

        {/* ── Personal Information ─────────────────────────────────── */}
        <Section delay={0.06} title="Personal Information"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="2.5" stroke={C.brand} strokeWidth="1.3" />
              <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5"
                stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          }>
          {/* Row 1: Name | Location */}
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <EditField label="Full Name" value={name} onChange={setName}
              placeholder="Alex Johnson" required />
            <EditField label="Location" value={location} onChange={setLocation}
              placeholder="Bangalore, India" />
          </div>
          {/* Row 2: Email | Phone */}
          <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <EditField label="Email" value={email} onChange={setEmail}
              placeholder="you@email.com" />
            <EditField label="Phone" value={phone} onChange={(v) => {
              setPhone(v);
              const next = v.trim();
              if (!next) {
                setOtpStage("idle");
                setOtp("");
                setOtpError(null);
                return;
              }
              if (!isLikelyValidPhone(next)) {
                setOtpStage("idle");
                setOtp("");
                setOtpError(null);
                return;
              }
            }}
              placeholder="+91 98765 43210"
              rightAdornment={phoneVerified ? (
                <span
                  aria-label="Phone verified"
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "999px",
                    background: "#059669",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(5,150,105,0.25)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.2 6.3l2.3 2.3L9.9 3.2"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              ) : null}
            />
          </div>

          <AnimatePresence initial={false}>
            {!isEdit && !phoneVerified && hasPhone && isLikelyValidPhone(phone) && (
              <motion.div
                initial={{ opacity: 0, y: 8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 6, height: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginTop: "10px", overflow: "hidden" }}
              >
                <div style={{
                  borderRadius: "12px",
                  border: `1px solid ${C.border}`,
                  background: "rgba(28,25,23,0.02)",
                  padding: "12px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.01em" }}>
                        Phone verification
                      </div>
                      <div style={{ fontSize: "12px", color: C.textMuted, letterSpacing: "-0.01em", lineHeight: 1.35 }}>
                        {otpStage === "verified" ? "Verified" : "Enter the code we send to keep your profile secure."}
                      </div>
                    </div>

                    <motion.button
                      onClick={sendOtp}
                      disabled={otpStage === "sending" || otpStage === "verifying"}
                      whileTap={otpStage === "sending" || otpStage === "verifying" ? {} : { scale: 0.98 }}
                      style={{
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: "transparent",
                        backgroundImage: otpStage === "idle"
                          ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)"
                          : "none",
                        color: otpStage === "idle" ? "white" : C.brand,
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: otpStage === "sending" || otpStage === "verifying" ? "default" : "pointer",
                        fontFamily: "Inter, sans-serif",
                        flexShrink: 0,
                        letterSpacing: "-0.01em",
                        whiteSpace: "nowrap",
                        boxShadow: otpStage === "idle" ? "0 6px 16px rgba(255,107,53,0.28)" : "none",
                      }}
                    >
                      {otpStage === "sending" ? "Sending…" : otpStage === "idle" ? "Send code" : "Resend code"}
                    </motion.button>
                  </div>

                  <AnimatePresence initial={false}>
                    {(otpStage === "sent" || otpStage === "verifying") && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        style={{ marginTop: "10px" }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            inputMode="numeric"
                            placeholder="Enter OTP"
                            style={{
                              width: "100%",
                              padding: "11px 12px",
                              borderRadius: "10px",
                              border: `1px solid ${C.border}`,
                              background: "white",
                              fontFamily: "Inter, sans-serif",
                              fontSize: "14px",
                              letterSpacing: "0.08em",
                              outline: "none",
                              color: C.textPrimary,
                            }}
                          />
                          <motion.button
                            onClick={verifyOtp}
                            disabled={otpStage === "verifying" || otp.trim().length < 4}
                            whileTap={otpStage === "verifying" ? {} : { scale: 0.98 }}
                            style={{
                              width: "100%",
                              padding: "12px 12px",
                              borderRadius: "10px",
                              border: "none",
                              background: otp.trim().length >= 4 ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)" : "rgba(28,25,23,0.12)",
                              color: otp.trim().length >= 4 ? "white" : "rgba(28,25,23,0.45)",
                              fontSize: "13px",
                              fontWeight: 800,
                              cursor: otpStage === "verifying" ? "default" : (otp.trim().length >= 4 ? "pointer" : "not-allowed"),
                              fontFamily: "Inter, sans-serif",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {otpStage === "verifying" ? "Verifying…" : "Verify"}
                          </motion.button>
                        </div>
                        {otpError && (
                          <div style={{ marginTop: "8px", fontSize: "12px", color: "#B91C1C", lineHeight: 1.35 }}>
                            {otpError}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Row 3: Headline (full width) */}
          <div className="mt-3">
            <EditField label="Professional Headline"
              value={headline} onChange={setHeadline}
              placeholder="e.g. Senior Product Designer · 4 years" />
          </div>
        </Section>

        {/* ── Work Experience ──────────────────────────────────────── */}
        <Section delay={0.14} title="Work Experience"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="4" width="12" height="9" rx="2" stroke={C.brand} strokeWidth="1.3" />
              <path d="M4 4V3a1 1 0 011-1h4a1 1 0 011 1v1"
                stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
              <path d="M1 7h12" stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          }>
          <AnimatePresence>
            {experiences.map((exp, idx) => (
              <motion.div key={exp.id}>
                {idx > 0 && <Divider />}
                <ExpEntry
                  exp={exp}
                  onChange={(u) => updateExp(exp.id, u)}
                  onRemove={() => removeExp(exp.id)}
                  showRemove={experiences.length > 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div style={{ marginTop: experiences.length ? "16px" : "0" }}>
            <AddButton label="Add Work Experience" onClick={addExp} />
          </div>
        </Section>

        {/* ── Education ───────────────────────────────────────────── */}
        <Section delay={0.22} title="Education"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 5l6-3 6 3-6 3-6-3z"
                stroke={C.brand} strokeWidth="1.3"
                strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.5 6.5V9.5c0 1 1.6 2 3.5 2s3.5-1 3.5-2V6.5"
                stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          }>
          <AnimatePresence>
            {education.map((edu, idx) => (
              <motion.div key={edu.id}>
                {idx > 0 && <Divider />}
                <EduEntry
                  edu={edu}
                  onChange={(u) => updateEdu(edu.id, u)}
                  onRemove={() => removeEdu(edu.id)}
                  showRemove={education.length > 1}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div style={{ marginTop: education.length ? "16px" : "0" }}>
            <AddButton label="Add Education" onClick={addEdu} />
          </div>
        </Section>

        {/* ── Skills ──────────────────────────────────────────────── */}
        <Section delay={0.3} title="Skills"
          icon={
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1l1.5 3.5 3.5.5-2.5 2.5.5 3.5L7 9.5 4 11l.5-3.5L2 5l3.5-.5L7 1z"
                stroke={C.brand} strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }>
          {/* Tag cloud — brand orange chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.span key={skill}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "100px",
                    background: "rgba(194,65,12,0.09)",
                    border: "1px solid rgba(194,65,12,0.2)",
                    color: C.brand,
                    fontSize: "13px", fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}>
                  {skill}
                  <button onClick={() => removeSkill(skill)}
                    style={{
                      background: "rgba(194,65,12,0.12)",
                      border: "none", borderRadius: "50%",
                      width: "16px", height: "16px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", padding: 0, flexShrink: 0,
                    }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 1l6 6M7 1L1 7"
                        stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Skill input */}
          <div style={{
            borderRadius: "12px", background: C.inputBg,
            border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", paddingRight: "6px",
          }}>
            <input
              type="text"
              value={skillInput}
              placeholder="Add a skill and press Enter"
              onChange={(e) => {
                const v = e.target.value;
                if (v.endsWith(",")) { addSkill(v); return; }
                setSkillInput(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); }
                if (e.key === "Backspace" && !skillInput && skills.length)
                  removeSkill(skills[skills.length - 1]);
              }}
              onFocus={(e) => {
                e.target.parentElement!.style.border = "1px solid rgba(194,65,12,0.32)";
                e.target.parentElement!.style.boxShadow = "0 0 0 3px rgba(194,65,12,0.08)";
              }}
              onBlur={(e) => {
                if (skillInput) addSkill(skillInput);
                e.target.parentElement!.style.border = `1px solid ${C.border}`;
                e.target.parentElement!.style.boxShadow = "none";
              }}
              style={{
                flex: 1, padding: "13px 14px",
                fontSize: "14px", color: C.textPrimary,
                background: "transparent", border: "none", outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
            <AnimatePresence>
              {skillInput && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => addSkill(skillInput)}
                  style={{
                    width: "30px", height: "30px", borderRadius: "9px",
                    background: "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2v8M2 6h8"
                      stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </Section>

        {/* ── Job Preferences (edit mode only) ───────────────────── */}
        {isEdit && (
          <Section delay={0.36} title="Job Preferences"
            icon={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v4M7 9v4M1 7h4M9 7h4"
                  stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="7" cy="7" r="2" stroke={C.brand} strokeWidth="1.3" />
              </svg>
            }>

            {/* Category */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: C.textMuted,
                letterSpacing: "-0.01em", marginBottom: 8,
              }}>
                Job Category
              </div>
              <select
                value={prefCategory}
                onChange={(e) => {
                  setPrefCategory(e.target.value);
                  setPrefRoles([]);
                }}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  background: C.inputBg,
                  fontSize: 14,
                  color: prefCategory ? C.textPrimary : C.textSecondary,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  cursor: "pointer",
                  WebkitAppearance: "none",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23A8A29E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                  paddingRight: 34,
                }}
              >
                <option value="">Select a category…</option>
                {PREF_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Roles (shown when category is selected) */}
            {prefCategory && PREF_SUB_ROLES[prefCategory] && (
              <div style={{ marginBottom: 16 }}>
                <div style={{
                  fontSize: 12, fontWeight: 600, color: C.textMuted,
                  letterSpacing: "-0.01em", marginBottom: 8,
                }}>
                  Preferred Roles
                </div>

                {!rolesExpanded ? (
                  <div>
                    {prefRoles.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                        {prefRoles.map((role) => (
                          <motion.span
                            key={role}
                            layout
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 6,
                              padding: "7px 12px",
                              borderRadius: 100,
                              background: "rgba(194,65,12,0.07)",
                              border: "1.5px solid rgba(194,65,12,0.35)",
                              color: C.brand,
                              fontSize: 13, fontWeight: 600,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {role}
                            <button
                              type="button"
                              onClick={() => setPrefRoles((prev) => prev.filter((r) => r !== role))}
                              style={{
                                background: "rgba(194,65,12,0.12)",
                                border: "none", borderRadius: "50%",
                                width: 16, height: 16,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", padding: 0, flexShrink: 0,
                              }}
                            >
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1 1l6 6M7 1L1 7" stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                              </svg>
                            </button>
                          </motion.span>
                        ))}
                      </div>
                    ) : (
                      <p style={{
                        fontSize: 13, color: C.textSecondary,
                        letterSpacing: "-0.01em", margin: "0 0 10px",
                        lineHeight: 1.45,
                      }}>
                        No roles selected yet
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setRolesExpanded(true)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: 0, border: "none", background: "transparent",
                        color: C.brand, fontSize: 13, fontWeight: 600,
                        cursor: "pointer", fontFamily: "Inter, sans-serif",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <circle cx="6.5" cy="6.5" r="5.5" stroke={C.brand} strokeWidth="1.2" />
                        <path d="M6.5 4.5v4M4.5 6.5h4" stroke={C.brand} strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      {prefRoles.length > 0 ? "Edit roles" : "Browse roles"}
                    </button>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                      {PREF_SUB_ROLES[prefCategory].map((role) => {
                        const sel = prefRoles.includes(role);
                        return (
                          <motion.button
                            key={role}
                            type="button"
                            layout
                            whileTap={{ scale: 0.94 }}
                            onClick={() =>
                              setPrefRoles((prev) =>
                                sel ? prev.filter((r) => r !== role) : [...prev, role]
                              )
                            }
                            style={{
                              padding: "7px 13px",
                              borderRadius: 100,
                              border: `1.5px solid ${sel ? "rgba(194,65,12,0.35)" : C.border}`,
                              background: sel ? "rgba(194,65,12,0.07)" : "white",
                              color: sel ? C.brand : C.textPrimary,
                              fontSize: 13,
                              fontWeight: sel ? 600 : 400,
                              cursor: "pointer",
                              fontFamily: "Inter, sans-serif",
                              letterSpacing: "-0.01em",
                              transition: "border-color 0.15s, background 0.15s, color 0.15s",
                            }}
                          >
                            {role}
                          </motion.button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setRolesExpanded(false)}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        padding: 0, border: "none", background: "transparent",
                        color: C.textMuted, fontSize: 13, fontWeight: 600,
                        cursor: "pointer", fontFamily: "Inter, sans-serif",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M3 8l3.5-3.5L10 8" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Show less
                    </button>
                  </motion.div>
                )}
              </div>
            )}

            {/* Work Setup */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: C.textMuted,
                letterSpacing: "-0.01em", marginBottom: 8,
              }}>
                Work Setup
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {PREF_WORK_SETUPS.map((ws) => {
                  const sel = prefWorkSetups.includes(ws.toLowerCase());
                  return (
                    <motion.button
                      key={ws}
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      onClick={() =>
                        setPrefWorkSetups((prev) =>
                          sel
                            ? prev.filter((w) => w !== ws.toLowerCase())
                            : [...prev, ws.toLowerCase()]
                        )
                      }
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 12,
                        border: `1.5px solid ${sel ? "rgba(194,65,12,0.35)" : C.border}`,
                        background: sel ? "rgba(194,65,12,0.07)" : "white",
                        color: sel ? C.brand : C.textPrimary,
                        fontSize: 13,
                        fontWeight: sel ? 600 : 500,
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        letterSpacing: "-0.01em",
                        transition: "all 0.15s",
                      }}
                    >
                      {ws}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Preferred Locations */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: C.textMuted,
                letterSpacing: "-0.01em", marginBottom: 8,
              }}>
                Preferred Locations
              </div>
              {prefLocations.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {prefLocations.map((loc) => (
                    <span
                      key={loc}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "6px 12px",
                        borderRadius: 100,
                        background: "rgba(194,65,12,0.09)",
                        border: "1px solid rgba(194,65,12,0.2)",
                        color: C.brand,
                        fontSize: 13, fontWeight: 500,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {loc}
                      <button
                        type="button"
                        onClick={() => setPrefLocations((prev) => prev.filter((l) => l !== loc))}
                        style={{
                          background: "rgba(194,65,12,0.12)",
                          border: "none", borderRadius: "50%",
                          width: 16, height: 16,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", padding: 0, flexShrink: 0,
                        }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 1l6 6M7 1L1 7" stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                type="text"
                placeholder="Type a city and press Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v && !prefLocations.includes(v)) {
                      setPrefLocations((prev) => [...prev, v]);
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
                style={{
                  width: "100%",
                  padding: "11px 12px",
                  borderRadius: 12,
                  border: `1px solid ${C.border}`,
                  background: C.inputBg,
                  fontSize: 14,
                  color: C.textPrimary,
                  fontFamily: "Inter, sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Salary Range */}
            <div style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: C.textMuted,
                letterSpacing: "-0.01em", marginBottom: 8,
              }}>
                Salary Expectation (LPA)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 4 }}>Min</div>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={prefSalaryMin}
                    onChange={(e) => {
                      const v = Math.max(0, Math.min(Number(e.target.value), prefSalaryMax));
                      setPrefSalaryMin(v);
                    }}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                      background: C.inputBg,
                      fontSize: 14,
                      color: C.textPrimary,
                      fontFamily: "Inter, sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <span style={{ color: C.textSecondary, marginTop: 18, fontSize: 13 }}>–</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 4 }}>Max</div>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={prefSalaryMax}
                    onChange={(e) => {
                      const v = Math.min(100, Math.max(Number(e.target.value), prefSalaryMin));
                      setPrefSalaryMax(v);
                    }}
                    style={{
                      width: "100%",
                      padding: "11px 12px",
                      borderRadius: 12,
                      border: `1px solid ${C.border}`,
                      background: C.inputBg,
                      fontSize: 14,
                      color: C.textPrimary,
                      fontFamily: "Inter, sans-serif",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Priorities */}
            <div>
              <div style={{
                fontSize: 12, fontWeight: 600, color: C.textMuted,
                letterSpacing: "-0.01em", marginBottom: 8,
              }}>
                What matters most? <span style={{ color: C.textSecondary, fontWeight: 400 }}>(up to 3)</span>
              </div>

              {!prioritiesExpanded ? (
                <div>
                  {prefPriorities.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                      {prefPriorities.map((p) => (
                        <motion.span
                          key={p}
                          layout
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "7px 12px",
                            borderRadius: 100,
                            background: "rgba(194,65,12,0.07)",
                            border: "1.5px solid rgba(194,65,12,0.35)",
                            color: C.brand,
                            fontSize: 13, fontWeight: 600,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {p}
                          <button
                            type="button"
                            onClick={() => setPrefPriorities((prev) => prev.filter((x) => x !== p))}
                            style={{
                              background: "rgba(194,65,12,0.12)",
                              border: "none", borderRadius: "50%",
                              width: 16, height: 16,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", padding: 0, flexShrink: 0,
                            }}
                          >
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1 1l6 6M7 1L1 7" stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                          </button>
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <p style={{
                      fontSize: 13, color: C.textSecondary,
                      letterSpacing: "-0.01em", margin: "0 0 10px",
                      lineHeight: 1.45,
                    }}>
                      No priorities selected yet
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setPrioritiesExpanded(true)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: 0, border: "none", background: "transparent",
                      color: C.brand, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", fontFamily: "Inter, sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <circle cx="6.5" cy="6.5" r="5.5" stroke={C.brand} strokeWidth="1.2" />
                      <path d="M6.5 4.5v4M4.5 6.5h4" stroke={C.brand} strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {prefPriorities.length > 0 ? "Edit priorities" : "Browse priorities"}
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                    {PREF_PRIORITIES.map((p) => {
                      const sel = prefPriorities.includes(p);
                      const atMax = prefPriorities.length >= 3 && !sel;
                      return (
                        <motion.button
                          key={p}
                          type="button"
                          layout
                          whileTap={atMax ? {} : { scale: 0.94 }}
                          onClick={() => {
                            if (atMax) return;
                            setPrefPriorities((prev) =>
                              sel ? prev.filter((x) => x !== p) : [...prev, p]
                            );
                          }}
                          style={{
                            padding: "7px 13px",
                            borderRadius: 100,
                            border: `1.5px solid ${sel ? "rgba(194,65,12,0.35)" : C.border}`,
                            background: sel ? "rgba(194,65,12,0.07)" : "white",
                            color: sel ? C.brand : atMax ? C.textSecondary : C.textPrimary,
                            fontSize: 13,
                            fontWeight: sel ? 600 : 400,
                            cursor: atMax ? "not-allowed" : "pointer",
                            opacity: atMax ? 0.45 : 1,
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "-0.01em",
                            transition: "border-color 0.15s, background 0.15s, color 0.15s, opacity 0.15s",
                          }}
                        >
                          {p}
                        </motion.button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPrioritiesExpanded(false)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: 0, border: "none", background: "transparent",
                      color: C.textMuted, fontSize: 13, fontWeight: 600,
                      cursor: "pointer", fontFamily: "Inter, sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M3 8l3.5-3.5L10 8" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Show less
                  </button>
                </motion.div>
              )}
            </div>
          </Section>
        )}

        {/* ── Continue CTA — inline, below Skills ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ paddingBottom: "32px" }}
        >
          {isEdit && !skills.length && (
            <p
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: C.textSecondary,
                marginBottom: "12px",
                letterSpacing: "-0.01em",
              }}
            >
              Add at least one skill to save
            </p>
          )}
          <motion.button
            onClick={handlePrimaryAction}
            disabled={!canProceed || submitting}
            whileTap={canProceed && !submitting ? { scale: 0.975 } : {}}
            style={{
              width: "100%", padding: "18px",
              borderRadius: "16px", border: "none",
              background: canProceed ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)" : "#EAE6E1",
              color: canProceed ? "white" : "#B8AFA6",
              fontSize: "15px", fontWeight: 600,
              letterSpacing: "-0.01em",
              cursor: canProceed && !submitting ? "pointer" : "not-allowed",
              boxShadow: canProceed
                ? "0 4px 20px rgba(255,107,53,0.35), 0 1px 4px rgba(255,107,53,0.2)"
                : "none",
              fontFamily: "Inter, sans-serif",
              transition: "background 0.25s, color 0.25s, box-shadow 0.25s",
              position: "relative", overflow: "hidden",
            }}>
            <AnimatePresence mode="wait">
              {submitting ? (
                <motion.span key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    style={{
                      display: "block", width: "16px", height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white", borderRadius: "50%",
                    }} />
                  {isEdit ? "Saving…" : "Setting up your profile…"}
                </motion.span>
              ) : (
                <motion.span key="idle"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  {isEdit ? (
                    "Save"
                  ) : (
                    <>
                      Continue
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M5 2l5 5-5 5" stroke="white" strokeWidth="1.6"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {!isEdit && canContinue && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              style={{
                textAlign: "center", fontSize: "12px",
                color: C.textSecondary, marginTop: "10px",
                letterSpacing: "-0.01em",
              }}>
              You can always edit your profile later
            </motion.p>
          )}
        </motion.div>

      </div>
    </div>
  );
}