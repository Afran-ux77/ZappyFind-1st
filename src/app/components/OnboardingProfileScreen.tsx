import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FullProfile, WorkExp, Edu } from "./WelcomeScreen";
import { FloatingLabelInput } from "./ui/FloatingLabelInput";

const C = {
  brand: "#C2410C",
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSecondary: "#A8A29E",
  border: "rgba(28,25,23,0.09)",
  inputBg: "#FFFFFF",
  orbB: "rgba(146,64,14,0.04)",
  success: "#059669",
};
const MAX_RESUME_BYTES = 10 * 1024 * 1024;

type ProfileType = "fresher" | "experienced";

const COURSE_OPTIONS = [
  "B.Tech",
  "B.E.",
  "B.Sc",
  "BCA",
  "BBA",
  "MBA",
  "M.Tech",
  "MCA",
  "Diploma",
  "B.Com",
  "BA",
  "Other",
];
const HIGHEST_QUALIFICATION_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "PhD",
  "Other",
];
const SPECIALIZATION_BY_COURSE: Record<string, string[]> = {
  "B.Tech": [
    "Computer Science Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Electronics and Communication Engineering",
    "Information Technology",
    "Chemical Engineering",
    "Aerospace Engineering",
  ],
};
const MASTER_SKILL_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "Java", "C", "C++", "C#", "Go", "Rust", "Kotlin",
  "Swift", "PHP", "Ruby", "HTML", "CSS", "React", "Next.js", "Angular", "Vue.js",
  "Node.js", "Express.js", "NestJS", "Django", "Flask", "Spring Boot", "ASP.NET",
  "Tailwind CSS", "Bootstrap", "Redux", "GraphQL", "REST API", "PostgreSQL", "MySQL",
  "MongoDB", "Redis", "Firebase", "Supabase", "AWS", "Azure", "GCP", "Docker",
  "Kubernetes", "CI/CD", "Git", "Linux", "Nginx", "Machine Learning", "Deep Learning",
  "Data Structures", "Algorithms", "Power BI", "Tableau", "Figma", "UI/UX", "Testing",
  "Jest", "Cypress", "Playwright", "Selenium", "React Native", "Flutter",
];
const MONTH_OPTIONS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const YEAR_OPTIONS = Array.from({ length: 45 }, (_, i) => String(new Date().getFullYear() - i));
const MONTH_INDEX_BY_LABEL: Record<string, number> = MONTH_OPTIONS.reduce((acc, label, idx) => {
  acc[label] = idx;
  return acc;
}, {} as Record<string, number>);

function toMonthInputValue(monthLabel: string, year: string): string {
  if (!monthLabel || !year) return "";
  const monthIndex = MONTH_INDEX_BY_LABEL[monthLabel];
  if (typeof monthIndex !== "number") return "";
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function fromMonthInputValue(value: string): { monthLabel: string; year: string } {
  if (!value || !/^\d{4}-\d{2}$/.test(value)) return { monthLabel: "", year: "" };
  const [year, monthPart] = value.split("-");
  const monthIndex = Number(monthPart) - 1;
  if (monthIndex < 0 || monthIndex > 11) return { monthLabel: "", year: "" };
  return { monthLabel: MONTH_OPTIONS[monthIndex], year };
}

interface Props {
  email: string;
  signupFullName: string;
  onComplete: (profile: FullProfile) => void;
  onBack: () => void;
}

// ── Reusable input ────────────────────────────────────────────────────────────
function Input({
  label, value, onChange, placeholder, required, readOnly, type = "text",
  rightAdornment, inputMode, multiline, multilineRows = 3, multilineHeight, error, errorText,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; required?: boolean; readOnly?: boolean;
  type?: string; rightAdornment?: React.ReactNode;
  inputMode?: "text" | "numeric" | "tel" | "email";
  multiline?: boolean;
  multilineRows?: number;
  multilineHeight?: number | string;
  error?: boolean;
  errorText?: string;
}) {
  const computedLabel = `${label}${required ? " *" : ""}`;
  const computedError = error ? (errorText ?? "This field is required.") : undefined;

  const controlStyle: React.CSSProperties = multiline
    ? {
        lineHeight: 1.55,
        resize: "vertical",
        ...(multilineHeight !== undefined ? { minHeight: multilineHeight } : {}),
      }
    : {
        lineHeight: 1.55,
        ...(readOnly ? { cursor: "default" } : {}),
      };

  if (multiline) {
    return (
      <FloatingLabelInput
        multiline
        rows={multilineRows}
        label={computedLabel}
        value={value}
        onChange={onChange ? (e) => onChange((e.target as HTMLTextAreaElement).value) : undefined}
        readOnly={readOnly}
        errorText={computedError}
        rightAdornment={rightAdornment}
        rightAdornmentWidth={rightAdornment ? 32 : undefined}
        fieldStyle={{ minHeight: multilineHeight }}
        style={controlStyle}
      />
    );
  }

  return (
    <FloatingLabelInput
      label={computedLabel}
      value={value}
      onChange={onChange ? (e) => onChange((e.target as HTMLInputElement).value) : undefined}
      readOnly={readOnly}
      type={type}
      inputMode={inputMode}
      errorText={computedError}
      rightAdornment={rightAdornment}
      rightAdornmentWidth={rightAdornment ? 32 : undefined}
      style={controlStyle}
    />
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
  errorText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: boolean;
  errorText?: string;
}) {
  const [focused, setFocused] = useState(false);
  const selectId = useId();
  const hasError = Boolean(error);
  const isFloating = focused || Boolean(value);
  return (
    <div className="zf-float">
      <div
        className="zf-float__field"
        data-zf-error={hasError ? "true" : undefined}
        data-zf-has-right="true"
      >
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={hasError || undefined}
          className="zf-float__control"
          style={{
            color: value ? C.textPrimary : C.textMuted,
            paddingTop: 20,
            paddingBottom: 6,
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
        >
          <option value="">{""}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <label
          htmlFor={selectId}
          className="zf-float__label"
          style={{
            transform: isFloating ? "translateY(-18px) scale(0.78)" : "translateY(-50%) scale(1)",
            color: hasError ? "#B91C1C" : C.textMuted,
          }}
        >
          {label}
          {required && <span> *</span>}
        </label>
        <div className="zf-float__right" style={{ pointerEvents: "none", color: C.textMuted }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {hasError && (
        <div className="zf-float__help zf-float__help--error">
          {errorText ?? "This field is required."}
        </div>
      )}
    </div>
  );
}

function SkillsField({
  skills,
  skillInput,
  setSkillInput,
  onAddSkill,
  onRemoveSkill,
  error,
  errorText,
}: {
  skills: string[];
  skillInput: string;
  setSkillInput: (value: string) => void;
  onAddSkill: (value: string) => void;
  onRemoveSkill: (value: string) => void;
  error?: boolean;
  errorText?: string;
}) {
  const trimmedInput = skillInput.trim();
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputId = useId();
  const normalizedQuery = trimmedInput.toLowerCase();

  const filteredSkills = MASTER_SKILL_OPTIONS
    .filter((skill) => !skills.some((selected) => selected.toLowerCase() === skill.toLowerCase()))
    .filter((skill) => skill.toLowerCase().includes(normalizedQuery))
    .slice(0, 8);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const handleAddFromInput = () => {
    if (!trimmedInput) return;
    onAddSkill(trimmedInput);
    setOpen(false);
  };

  const handleSelectSkill = (skill: string) => {
    onAddSkill(skill);
    setOpen(false);
  };

  const shouldShowMenu = open && (filteredSkills.length > 0 || trimmedInput.length > 0);

  return (
    <div ref={rootRef}>
      <div className="zf-float" style={{ position: "relative" }}>
        <div
          className="zf-float__field"
          data-zf-has-right="true"
          data-zf-error={error ? "true" : undefined}
        >
          <input
            id={inputId}
            type="text"
            value={skillInput}
            onChange={(e) => {
              setSkillInput(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              setFocused(true);
              setOpen(true);
            }}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                handleAddFromInput();
              }
              if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder=" "
            className="zf-float__control"
            style={{ lineHeight: 1.55 }}
          />
          <label
            htmlFor={inputId}
            className="zf-float__label"
            style={{
              transform: focused || Boolean(trimmedInput) ? "translateY(-18px) scale(0.78)" : "translateY(-50%) scale(1)",
              color: C.textMuted,
            }}
          >
            Skills *
          </label>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="zf-float__right"
            style={{ border: "none", background: "transparent", color: C.textMuted, cursor: "pointer", padding: 0 }}
            aria-label="Toggle skills dropdown"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {shouldShowMenu && (
          <div style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            borderRadius: 12,
            border: `1px solid ${C.border}`,
            background: "white",
            boxShadow: "0 8px 22px rgba(28,25,23,0.09)",
            maxHeight: 220,
            overflowY: "auto",
            zIndex: 25,
            padding: 6,
          }}>
            {trimmedInput && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleAddFromInput}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: 9,
                  padding: "9px 10px",
                  color: C.textPrimary,
                  fontSize: 13,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Add "{trimmedInput}"
              </button>
            )}
            {filteredSkills.map((skill) => (
              <button
                key={skill}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectSkill(skill)}
                style={{
                  width: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  borderRadius: 9,
                  padding: "9px 10px",
                  color: C.textPrimary,
                  fontSize: 13,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <div className="zf-float__help zf-float__help--error">
          {errorText ?? "At least one skill is required."}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {skills.map((skill) => (
            <span
              key={skill}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                borderRadius: 999,
                background: "rgba(194,65,12,0.08)",
                border: "1px solid rgba(194,65,12,0.2)",
                color: C.brand,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: C.brand,
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 1,
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "Inter, sans-serif",
                }}
                aria-label={`Remove ${skill}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Experience duration picker (years + months stepper) ──────────────────────
function ExperienceDurationPicker({
  years, months, onYearsChange, onMonthsChange,
  yearsError,
}: {
  years: string; months: string;
  onYearsChange: (v: string) => void;
  onMonthsChange: (v: string) => void;
  yearsError?: boolean;
}) {
  const sanitizeYears = (value: string) => value.replace(/\D/g, "").slice(0, 2);
  const sanitizeMonths = (value: string) => value.replace(/\D/g, "").slice(0, 2);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
      {/* Years */}
      <div>
        <Input
          label="Years"
          value={years}
          onChange={(v) => {
            const cleaned = sanitizeYears(v);
            if (!cleaned) {
              onYearsChange("");
              return;
            }
            const n = Math.min(30, Number(cleaned));
            onYearsChange(String(n));
          }}
          placeholder="0-30"
          inputMode="numeric"
          required
          error={yearsError}
          errorText="Years is required."
        />
      </div>

      {/* Months */}
      <div>
        <Input
          label="Months"
          value={months}
          onChange={(v) => {
            const cleaned = sanitizeMonths(v);
            if (!cleaned) {
              onMonthsChange("");
              return;
            }
            const n = Math.min(11, Number(cleaned));
            onMonthsChange(String(n));
          }}
          placeholder="0-11"
          inputMode="numeric"
        />
      </div>
    </div>
  );
}

function formatExperienceDuration(years: number, months: number): string {
  if (years === 0 && months === 0) return "";
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years !== 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months !== 1 ? "s" : ""}`);
  return parts.join(" ");
}

// ── Section label ─────────────────────────────────────────────────────────────
function SectionLabel({ icon, children }: { icon: React.ReactNode; children: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 14,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 7,
        background: "rgba(194,65,12,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700, color: C.textSecondary,
        letterSpacing: "0.07em", textTransform: "uppercase" as const,
      }}>{children}</span>
    </div>
  );
}

// ── Expandable optional section ───────────────────────────────────────────────
function OptionalSection({
  icon, title, subtitle, expanded, onToggle, children,
}: {
  icon: React.ReactNode; title: string; subtitle: string;
  expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{
      borderRadius: 13,
      border: expanded ? `1.5px solid rgba(194,65,12,0.18)` : `1.5px dashed rgba(28,25,23,0.13)`,
      background: expanded ? "rgba(194,65,12,0.02)" : "transparent",
      overflow: "hidden",
      transition: "border-color 0.25s, background 0.25s",
    }}>
      <motion.button
        onClick={onToggle}
        whileTap={{ scale: 0.98 }}
        style={{
          width: "100%", padding: "12px 14px",
          display: "flex", alignItems: "center", gap: 10,
          border: "none", background: "transparent",
          cursor: "pointer", fontFamily: "Inter, sans-serif",
          textAlign: "left" as const,
        }}
      >
        <span style={{ lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
            {title}
          </div>
          <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 1 }}>
            {subtitle}
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 24 }}
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M9 4v10M4 9h10" stroke={expanded ? C.brand : C.textSecondary}
              strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </motion.div>
      </motion.button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 14px 14px" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function OnboardingProfileScreen({ email, signupFullName, onComplete, onBack }: Props) {
  const [profileType, setProfileType] = useState<ProfileType | null>(null);
  const isPhoneLogin = /^\+?\d/.test(email.trim());

  // Basics
  const [name, setName] = useState(signupFullName);
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState(isPhoneLogin ? email : "");
  const [userEmail, setUserEmail] = useState(isPhoneLogin ? "" : email);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  // Phone OTP
  const [otpStage, setOtpStage] = useState<"idle" | "sending" | "sent" | "verifying" | "verified">(
    isPhoneLogin ? "verified" : "idle",
  );
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const normalizePhone = (raw: string) => raw.replace(/[^\d+]/g, "").trim();
  const isValidPhone = (raw: string) => normalizePhone(raw).replace(/[^\d]/g, "").length >= 10;
  const hasPhone = phone.trim().length > 0;
  const phoneVerified = otpStage === "verified";

  const validateResumeFile = (file: File): string | null => {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      return "Use a PDF, DOC, or DOCX file.";
    }
    if (file.size > MAX_RESUME_BYTES) {
      return "Resume must be 10 MB or smaller.";
    }
    return null;
  };

  const handleResumeSelect = (file: File | null) => {
    if (!file) return;
    const err = validateResumeFile(file);
    if (err) {
      setResumeError(err);
      return;
    }
    setResumeError(null);
    setResumeFile(file);
  };

  const sendOtp = async () => {
    if (!isValidPhone(phone) || otpStage === "sending" || otpStage === "verifying" || phoneVerified) return;
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
      return;
    }
    setOtpStage("sent");
    setOtpError("Incorrect code. Try 1234 for now.");
  };

  // Education (fresher)
  const [institution, setInstitution] = useState("");
  const [course, setCourse] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [moreEdu, setMoreEdu] = useState<Array<{ institution: string; degree: string; year: string }>>([]);

  // Experience (experienced)
  const [expYears, setExpYears] = useState("");
  const [expMonths, setExpMonths] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [isCurrent, setIsCurrent] = useState(true);
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [moreExp, setMoreExp] = useState<Array<{
    company: string; title: string;
    startMonth: string; startYear: string;
    current: boolean;
    endMonth: string; endYear: string;
  }>>([]);

  // Optionals
  const [internships, setInternships] = useState<Array<{ company: string; role: string; desc: string }>>([]);
  const [showResumeOptional, setShowResumeOptional] = useState(false);
  const [showInternships, setShowInternships] = useState(false);
  const [projects, setProjects] = useState<Array<{ name: string; desc: string }>>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [achievements, setAchievements] = useState<Array<{ title: string; desc: string }>>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showOtherOffers, setShowOtherOffers] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState("");
  const [hasOtherOffers, setHasOtherOffers] = useState<"" | "yes" | "no">("");
  const [offerCompany, setOfferCompany] = useState("");
  const [offerRole, setOfferRole] = useState("");
  const [optEdu, setOptEdu] = useState({
    institution: "",
    course: "",
    specialization: "",
    year: "",
  });
  const [optMoreEdu, setOptMoreEdu] = useState<Array<{
    institution: string; course: string; specialization: string; year: string;
  }>>([]);
  const [showOptEdu, setShowOptEdu] = useState(false);
  const [highestQualification, setHighestQualification] = useState("");
  const formScrollRef = useRef<HTMLDivElement | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [showRequiredErrors, setShowRequiredErrors] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Validation ──────────────────────────────────────────────────────────────
  const missingFullName = name.trim().length < 2;
  const missingLocation = location.trim().length === 0;
  const missingEmail = userEmail.trim().length === 0;
  const missingPhone = phone.trim().length === 0;
  const missingPhoneVerification = !isPhoneLogin && !phoneVerified;
  const missingInstitution = institution.trim().length === 0;
  const missingCourse = course.trim().length === 0;
  const missingSpecialization = course === "B.Tech" && specialization.trim().length === 0;
  const missingGradYear = gradYear.trim().length === 0;
  const missingCompany = company.trim().length === 0;
  const missingJobTitle = jobTitle.trim().length === 0;
  const missingHighestQualification = highestQualification.trim().length === 0;
  const missingExpYears = profileType === "experienced" && expYears.trim().length === 0;
  const missingSkills = skills.length === 0;

  const addSkill = (raw: string) => {
    const value = raw.trim().replace(/\s+/g, " ");
    if (!value) return;
    if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) return;
    setSkills((prev) => [...prev, value]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const requiredMissingFields: string[] = [];
  if (missingFullName) requiredMissingFields.push("Full Name");
  if (missingLocation) requiredMissingFields.push("Location");
  if (missingEmail) requiredMissingFields.push("Email");
  if (missingSkills) requiredMissingFields.push("Skills");
  if (missingPhone) {
    requiredMissingFields.push("Phone");
  } else if (missingPhoneVerification) {
    requiredMissingFields.push("Phone verification");
  }
  if (profileType === null) {
    requiredMissingFields.push("Profile type (fresher or experienced)");
  } else if (profileType === "fresher") {
    if (missingInstitution) requiredMissingFields.push("Institution");
    if (missingCourse) requiredMissingFields.push("Course");
    if (missingSpecialization) requiredMissingFields.push("Specialization");
    if (missingGradYear) requiredMissingFields.push("Graduation Year");
  } else {
    if (missingExpYears) requiredMissingFields.push("Total experience years");
    if (missingCompany) requiredMissingFields.push("Company");
    if (missingJobTitle) requiredMissingFields.push("Job Title");
    if (missingHighestQualification) requiredMissingFields.push("Highest qualification");
  }

  // ── Build FullProfile ───────────────────────────────────────────────────────
  const handleComplete = async () => {
    if (submitting) return;

    if (requiredMissingFields.length > 0) {
      setShowRequiredErrors(true);
      setSubmitError("Please complete the required fields.");
      formScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    const experiences: WorkExp[] = [];
    const education: Edu[] = [];

    if (profileType === "experienced") {
      education.push({
        id: "edu-0",
        institution: "",
        degree: highestQualification.trim(),
        year: "",
        grade: "",
      });
      if (company.trim()) {
        const fromLabel = [startMonth, startYear].filter(Boolean).join(" ").trim();
        const toLabel = isCurrent ? "Present" : [endMonth, endYear].filter(Boolean).join(" ").trim();
        const dur = fromLabel || toLabel ? `${fromLabel || "—"} – ${toLabel || "—"}` : "";
        experiences.push({
          id: "exp-0", company: company.trim(), role: jobTitle.trim(),
          duration: dur, description: "",
        });
      }
      moreExp.forEach((e, i) => {
        if (e.company.trim()) {
          const fromLabel = [e.startMonth, e.startYear].filter(Boolean).join(" ").trim();
          const toLabel = e.current ? "Present" : [e.endMonth, e.endYear].filter(Boolean).join(" ").trim();
          experiences.push({
            id: `exp-${i + 1}`, company: e.company.trim(), role: e.title.trim(),
            duration: fromLabel || toLabel ? `${fromLabel || "—"} – ${toLabel || "—"}` : "",
            description: "",
          });
        }
      });
      if (optEdu.institution.trim()) {
        const optDegree = optEdu.specialization.trim()
          ? `${optEdu.course.trim()} - ${optEdu.specialization.trim()}`
          : optEdu.course.trim();
        education.push({
          id: "edu-1", institution: optEdu.institution.trim(),
          degree: optDegree, year: optEdu.year.trim(), grade: "",
        });
      }
      optMoreEdu.forEach((e, i) => {
        if (e.institution.trim()) {
          const earlierDegree = e.specialization.trim()
            ? `${e.course.trim()} - ${e.specialization.trim()}`
            : e.course.trim();
          education.push({
            id: `edu-${i + 2}`, institution: e.institution.trim(),
            degree: earlierDegree, year: e.year.trim(), grade: "",
          });
        }
      });
      if (portfolioLinks.trim()) {
        experiences.push({
          id: "portfolio-0",
          company: "Portfolio",
          role: "Links",
          duration: "",
          description: portfolioLinks.trim(),
        });
      }
      if (linkedinUrl.trim()) {
        experiences.push({
          id: "linkedin-0",
          company: "LinkedIn",
          role: "Profile",
          duration: "",
          description: linkedinUrl.trim(),
        });
      }
    }

    if (profileType === "fresher") {
      const fresherDegree = specialization.trim()
        ? `${course.trim()} - ${specialization.trim()}`
        : course.trim();
      if (institution.trim()) {
        education.push({
          id: "edu-0", institution: institution.trim(),
          degree: fresherDegree, year: gradYear.trim(), grade: "",
        });
      }
      moreEdu.forEach((e, i) => {
        if (e.institution.trim()) {
          education.push({
            id: `edu-${i + 1}`, institution: e.institution.trim(),
            degree: e.degree.trim(), year: e.year.trim(), grade: "",
          });
        }
      });
      internships.forEach((int, i) => {
        if (int.company.trim()) {
          experiences.push({
            id: `int-${i}`, company: int.company.trim(),
            role: int.role.trim(), duration: "",
            description: int.desc.trim() || "Internship",
          });
        }
      });
      projects.forEach((proj, i) => {
        if (proj.name.trim()) {
          experiences.push({
            id: `proj-${i}`, company: proj.name.trim(),
            role: "Project", duration: "", description: proj.desc.trim(),
          });
        }
      });
      achievements.forEach((item, i) => {
        if (item.title.trim()) {
          experiences.push({
            id: `ach-${i}`, company: item.title.trim(),
            role: "Achievement", duration: "", description: item.desc.trim(),
          });
        }
      });
      if (portfolioLinks.trim()) {
        experiences.push({
          id: "portfolio-0",
          company: "Portfolio",
          role: "Links",
          duration: "",
          description: portfolioLinks.trim(),
        });
      }
      if (linkedinUrl.trim()) {
        experiences.push({
          id: "linkedin-0",
          company: "LinkedIn",
          role: "Profile",
          duration: "",
          description: linkedinUrl.trim(),
        });
      }
      if (hasOtherOffers === "yes" && (offerCompany.trim() || offerRole.trim())) {
        experiences.push({
          id: "offer-0",
          company: offerCompany.trim() || "Current offer",
          role: offerRole.trim() || "Role not specified",
          duration: "Current offer",
          description: "Candidate has another active offer.",
        });
      }
    }

    let headline = "";
    if ((profileType === "fresher") && course.trim() && institution.trim()) {
      const fresherHeadline = specialization.trim()
        ? `${course.trim()} - ${specialization.trim()}`
        : course.trim();
      headline = `${fresherHeadline} · ${institution.trim()}`;
    } else if ((profileType === "experienced") && jobTitle.trim()) {
      headline = company.trim() ? `${jobTitle.trim()} at ${company.trim()}` : jobTitle.trim();
      const parsedYears = Number.parseInt(expYears, 10);
      const parsedMonths = Number.parseInt(expMonths, 10);
      const expStr = formatExperienceDuration(
        Number.isFinite(parsedYears) ? parsedYears : 0,
        Number.isFinite(parsedMonths) ? parsedMonths : 0,
      );
      if (expStr) headline += ` · ${expStr}`;
    }

    const profile: FullProfile = {
      name: name.trim(),
      email: (userEmail || email).trim(),
      phone: phone.trim(),
      location: location.trim(),
      headline,
      skills,
      experiences,
      education,
    };
    if (resumeFile) {
      (
        profile as FullProfile & {
          resumeAttachment?: { name: string; size: number; type: string };
        }
      ).resumeAttachment = {
        name: resumeFile.name,
        size: resumeFile.size,
        type: resumeFile.type || "application/octet-stream",
      };
    }

    await new Promise((r) => setTimeout(r, 600));
    onComplete(profile);
  };

  /** Narrow readable column inside the desktop glass card; outer chrome width unchanged. */
  const formColumnClass = "w-full max-w-xl mx-auto";

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Ambient orb (bottom-left only — avoid a second “layer” in the top-right on desktop glass) */}
      <div className="absolute pointer-events-none" style={{
        bottom: "8%", left: "-12%",
        width: 200, height: 200, borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orbB} 0%, transparent 70%)`,
      }} />

      {/* ── Sticky header (back + title, one row) ─────────────────── */}
      <div
        className="sticky top-0 z-20 px-4 pt-10 pb-3"
        style={{
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          borderBottom: "1px solid rgba(28,25,23,0.05)",
        }}
      >
        <div className={formColumnClass}>
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
          style={{ minHeight: 44 }}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            style={{
              width: "44px", height: "44px",
              flexShrink: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "transparent", border: "none",
              borderRadius: 10,
              cursor: "pointer",
              color: C.textMuted,
              fontFamily: "Inter, sans-serif",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 10.5L5 7l3.5-3.5" stroke="currentColor"
                strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 style={{
            flex: 1,
            minWidth: 0,
            margin: 0,
            fontSize: "clamp(18px, 5vw, 22px)", fontWeight: 800,
            color: C.textPrimary, letterSpacing: "-0.04em",
            lineHeight: 1.2,
          }}>
            Tell us about yourself
          </h1>
        </motion.div>
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────── */}
      <div
        ref={formScrollRef}
        className="flex flex-col flex-1 overflow-y-auto px-4 py-5 lg:px-6"
        style={{ paddingBottom: 24 }}
      >
        <div className={`${formColumnClass} flex flex-col gap-7 lg:gap-9`}>

        {showRequiredErrors && submitError && (
          <div style={{
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(185,28,28,0.24)",
            background: "rgba(254,242,242,0.95)",
            color: "#B91C1C",
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.4,
            letterSpacing: "-0.01em",
          }}>
            {submitError}
          </div>
        )}

        {/* ── Basics ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionLabel icon={
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="2.5" stroke={C.brand} strokeWidth="1.3" />
              <path d="M2 12c0-2.76 2.24-5 5-5s5 2.24 5 5"
                stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          }>Basics</SectionLabel>

          <div style={{
            borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
            background: "white", padding: 16,
            boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
          }}>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Full Name" value={name} onChange={setName}
                  placeholder="Your full name" required
                  error={showRequiredErrors && missingFullName}
                  errorText="Full Name is required." />
                <Input label="Location" value={location} onChange={setLocation}
                  placeholder="e.g. Bangalore" required
                  error={showRequiredErrors && missingLocation}
                  errorText="Location is required." />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {isPhoneLogin ? (
                  <>
                    <Input label="Email" value={userEmail} onChange={setUserEmail}
                      placeholder="you@email.com" inputMode="email" required
                      error={showRequiredErrors && missingEmail}
                      errorText="Email is required." />
                    <Input label="Phone" value={phone} readOnly required
                      error={showRequiredErrors && missingPhone}
                      errorText="Phone is required."
                      rightAdornment={
                        <span style={{
                          width: 20, height: 20, borderRadius: 999,
                          background: C.success,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 2px 6px rgba(5,150,105,0.25)",
                        }}>
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2.2 6.3l2.3 2.3L9.9 3.2" stroke="white"
                              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      }
                    />
                  </>
                ) : (
                  <>
                    <Input label="Email" value={userEmail} readOnly required
                      error={showRequiredErrors && missingEmail}
                      errorText="Email is required." />
                    <Input label="Phone" value={phone}
                      onChange={(v) => {
                        setPhone(v);
                        if (!v.trim() || !isValidPhone(v)) {
                          setOtpStage("idle");
                          setOtp("");
                          setOtpError(null);
                        }
                      }}
                      placeholder="+91 98765 43210"
                      inputMode="tel"
                      required
                      error={showRequiredErrors && (missingPhone || missingPhoneVerification)}
                      errorText={missingPhone ? "Phone is required." : "Please verify your phone number."}
                      rightAdornment={phoneVerified ? (
                        <span style={{
                          width: 20, height: 20, borderRadius: 999,
                          background: C.success,
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          boxShadow: "0 2px 6px rgba(5,150,105,0.25)",
                        }}>
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2.2 6.3l2.3 2.3L9.9 3.2" stroke="white"
                              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      ) : undefined}
                    />
                  </>
                )}
              </div>

              {/* ── Phone OTP ─────────────────────────────────────── */}
              <AnimatePresence initial={false}>
                {!isPhoneLogin && !phoneVerified && hasPhone && isValidPhone(phone) && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 6, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{
                      borderRadius: 12, border: `1px solid ${C.border}`,
                      background: "rgba(28,25,23,0.02)", padding: 12,
                    }}>
                      <div style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between", gap: 10,
                      }}>
                        <div>
                          <div style={{
                            fontSize: 12, fontWeight: 700, color: C.textPrimary,
                            letterSpacing: "-0.01em",
                          }}>Phone verification</div>
                          <div style={{
                            fontSize: 12, color: C.textMuted,
                            letterSpacing: "-0.01em", lineHeight: 1.35,
                          }}>
                            Enter the code we send to verify your number.
                          </div>
                        </div>
                        <motion.button
                          onClick={sendOtp}
                          disabled={otpStage === "sending" || otpStage === "verifying"}
                          whileTap={otpStage === "idle" ? { scale: 0.98 } : {}}
                          style={{
                            padding: "8px 12px", borderRadius: 10, border: "none",
                            backgroundColor: "transparent",
                            backgroundImage: otpStage === "idle"
                              ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)" : "none",
                            color: otpStage === "idle" ? "white" : C.brand,
                            fontSize: 13, fontWeight: 700, cursor: "pointer",
                            fontFamily: "Inter, sans-serif", flexShrink: 0,
                            letterSpacing: "-0.01em", whiteSpace: "nowrap" as const,
                            boxShadow: otpStage === "idle" ? "0 4px 12px rgba(255,107,53,0.25)" : "none",
                          }}
                        >
                          {otpStage === "sending" ? "Sending…" : otpStage === "idle" ? "Send code" : "Resend"}
                        </motion.button>
                      </div>

                      <AnimatePresence initial={false}>
                        {(otpStage === "sent" || otpStage === "verifying") && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            style={{ marginTop: 10 }}
                          >
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                              <FloatingLabelInput
                                label="OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                inputMode="numeric"
                                type="text"
                                style={{
                                  fontFamily: "Inter, sans-serif", fontSize: 14,
                                  letterSpacing: "0.08em", outline: "none",
                                  color: C.textPrimary,
                                }}
                              />
                              <motion.button
                                onClick={verifyOtp}
                                disabled={otpStage === "verifying" || otp.trim().length < 4}
                                whileTap={otp.trim().length >= 4 ? { scale: 0.98 } : {}}
                                style={{
                                  width: "100%", padding: "11px 12px", borderRadius: 10,
                                  border: "none",
                                  background: otp.trim().length >= 4
                                    ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)"
                                    : "rgba(28,25,23,0.1)",
                                  color: otp.trim().length >= 4 ? "white" : "rgba(28,25,23,0.4)",
                                  fontSize: 13, fontWeight: 800,
                                  cursor: otp.trim().length >= 4 ? "pointer" : "not-allowed",
                                  fontFamily: "Inter, sans-serif",
                                }}
                              >
                                {otpStage === "verifying" ? "Verifying…" : "Verify"}
                              </motion.button>
                            </div>
                            {otpError && (
                              <div style={{
                                marginTop: 8, fontSize: 12,
                                color: "#B91C1C", lineHeight: 1.35,
                              }}>{otpError}</div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>

        {/* ── Fresher / Experienced (choice chips) ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            fontSize: 13, fontWeight: 500, color: C.textMuted,
            marginBottom: 10, letterSpacing: "-0.01em",
          }}>
            Are you a fresher or experienced?
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(["fresher", "experienced"] as const).map((t) => {
              const sel = profileType === t;
              const other = profileType !== null && !sel;
              return (
                <motion.button
                  key={t}
                  type="button"
                  onClick={() => setProfileType(t)}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    borderColor: sel
                      ? "rgba(194,65,12,0.4)"
                      : other
                        ? "rgba(28,25,23,0.07)"
                        : "rgba(28,25,23,0.12)",
                    opacity: other ? 0.55 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    minWidth: 0,
                    width: "100%",
                    padding: "11px 10px",
                    borderRadius: 12,
                    border: "1.5px solid",
                    background: sel ? "rgba(194,65,12,0.05)" : "white",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 7,
                    boxShadow: sel
                      ? "0 0 0 3px rgba(194,65,12,0.06)"
                      : "0 1px 3px rgba(0,0,0,0.04)",
                    transition: "background 0.2s, box-shadow 0.2s",
                  }}
                >
                  <span style={{ fontSize: 15, lineHeight: 1 }} aria-hidden>
                    {t === "fresher" ? "🎓" : "💼"}
                  </span>
                  <span style={{
                    fontSize: 13.5,
                    fontWeight: sel ? 700 : 500,
                    color: sel ? C.brand : C.textPrimary,
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap" as const,
                  }}>
                    {t === "fresher" ? "Fresher" : "Experienced"}
                  </span>
                  {sel && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 26 }}
                      style={{
                        width: 16, height: 16, borderRadius: "50%",
                        background: C.brand,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginLeft: 1, flexShrink: 0,
                      }}
                    >
                      <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5.2l2 2L8 3" stroke="white" strokeWidth="1.6"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {showRequiredErrors && profileType === null && (
            <div style={{
              marginTop: 6, fontSize: 11, color: "#B91C1C",
              lineHeight: 1.35, letterSpacing: "-0.01em",
            }}>
              Please select to continue.
            </div>
          )}
        </motion.div>

        {/* ── Background-specific sections (only after Fresher / Experienced) ─ */}
        <AnimatePresence>
          {(profileType === "fresher" || profileType === "experienced") && (
            <motion.div
              key="type-sections"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", flexDirection: "column", gap: 28 }}
            >

        {/* ── Background fields (adapts) — explicit branches (no ternary on null) ─ */}
        <div>
          <AnimatePresence mode="wait">
            {profileType === "fresher" && (
              <motion.div
                key="fresher-bg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <SectionLabel icon={
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 5l6-3 6 3-6 3-6-3z" stroke={C.brand} strokeWidth="1.3"
                      strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3.5 6.5V9.5c0 1 1.6 2 3.5 2s3.5-1 3.5-2V6.5"
                      stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                }>Education</SectionLabel>

                <div style={{
                  borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
                  background: "white", padding: 16,
                  boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
                }}>
                  <div className="flex flex-col gap-3">
                    <Input label="Institution" value={institution} onChange={setInstitution}
                      placeholder="e.g. IIT Delhi" required
                      error={showRequiredErrors && missingInstitution}
                      errorText="Institution is required." />
                    <div className="grid grid-cols-1 gap-3">
                      <SelectField
                        label="Course"
                        value={course}
                        onChange={(v) => {
                          setCourse(v);
                          if (v !== "B.Tech") setSpecialization("");
                        }}
                        options={COURSE_OPTIONS}
                        placeholder="Select course"
                        required
                        error={showRequiredErrors && missingCourse}
                        errorText="Course is required."
                      />
                      <SelectField
                        label="Specialization"
                        value={specialization}
                        onChange={setSpecialization}
                        options={course === "B.Tech"
                          ? SPECIALIZATION_BY_COURSE["B.Tech"]
                          : ["General"]}
                        placeholder={course ? "Select specialization" : "Select course first"}
                        required
                        error={showRequiredErrors && missingSpecialization}
                        errorText="Specialization is required for B.Tech."
                      />
                    </div>
                    <div className="flex flex-col gap-3" style={{ width: "100%" }}>
                      <Input label="Graduation Year" value={gradYear}
                        onChange={(v) => setGradYear(v.replace(/\D/g, "").slice(0, 4))}
                        placeholder="2024" inputMode="numeric" required
                        error={showRequiredErrors && missingGradYear}
                        errorText="Graduation Year is required." />
                    </div>
                  </div>
                </div>

                {/* Extra education */}
                <AnimatePresence>
                  {moreEdu.map((edu, idx) => (
                    <motion.div
                      key={`more-edu-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        borderRadius: 13, border: `1px solid ${C.border}`,
                        background: "white", padding: 14, marginTop: 10,
                      }}
                    >
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 10,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.textSecondary }}>
                          Earlier education
                        </span>
                        <button
                          onClick={() => setMoreEdu((prev) => prev.filter((_, i) => i !== idx))}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontSize: 11, fontWeight: 600, color: C.textSecondary,
                            fontFamily: "Inter, sans-serif",
                            display: "flex", alignItems: "center", gap: 3,
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke={C.textSecondary}
                              strokeWidth="1.3" strokeLinecap="round" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Input label="Institution" value={edu.institution}
                          onChange={(v) => { const n = [...moreEdu]; n[idx] = { ...n[idx], institution: v }; setMoreEdu(n); }}
                          placeholder="Institution" />
                        <Input label="Degree" value={edu.degree}
                          onChange={(v) => { const n = [...moreEdu]; n[idx] = { ...n[idx], degree: v }; setMoreEdu(n); }}
                          placeholder="Degree" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => setMoreEdu((prev) => [...prev, { institution: "", degree: "", year: "" }])}
                  style={{
                    width: "100%", padding: 11, borderRadius: 11, marginTop: 10,
                    border: `1.5px dashed rgba(28,25,23,0.12)`,
                    background: "transparent", cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    fontSize: 12, fontWeight: 600, color: C.textMuted,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Add earlier education
                </button>
              </motion.div>
            )}
            {profileType === "experienced" && (
              <motion.div
                key="exp-bg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <SectionLabel icon={
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="4" width="12" height="9" rx="2" stroke={C.brand} strokeWidth="1.3" />
                    <path d="M4 4V3a1 1 0 011-1h4a1 1 0 011 1v1"
                      stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                }>Experience</SectionLabel>

                <div style={{
                  borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
                  background: "white", padding: 16,
                  boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
                }}>
                  <div style={{
                    borderBottom: "1px solid rgba(28,25,23,0.08)",
                    marginBottom: 20,
                    paddingBottom: 16,
                  }}>
                    <label style={{
                      display: "block", fontSize: 10, fontWeight: 700,
                      color: C.textSecondary, letterSpacing: "0.07em",
                      textTransform: "uppercase" as const,
                      marginBottom: 8, fontFamily: "Inter, sans-serif",
                    }}>Total Experience</label>
                    <ExperienceDurationPicker
                      years={expYears} months={expMonths}
                      yearsError={showRequiredErrors && missingExpYears}
                      onYearsChange={setExpYears} onMonthsChange={setExpMonths}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input label="Company" value={company} onChange={setCompany}
                        placeholder="e.g. ZappyVue" required
                        error={showRequiredErrors && missingCompany}
                        errorText="Company is required." />
                      <Input label="Job Title" value={jobTitle} onChange={setJobTitle}
                        placeholder="e.g. Designer" required
                        error={showRequiredErrors && missingJobTitle}
                        errorText="Job Title is required." />
                    </div>
                    <Input
                      label="From month & year"
                      type="month"
                      value={toMonthInputValue(startMonth, startYear)}
                      onChange={(value) => {
                        const { monthLabel, year } = fromMonthInputValue(value);
                        setStartMonth(monthLabel);
                        setStartYear(year);
                      }}
                    />
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 2,
                        cursor: "pointer",
                        userSelect: "none",
                        fontSize: 12,
                        fontWeight: 600,
                        color: C.textPrimary,
                        letterSpacing: "-0.01em",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isCurrent}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsCurrent(checked);
                          if (checked) {
                            setEndMonth("");
                            setEndYear("");
                          }
                        }}
                        style={{ accentColor: C.brand }}
                      />
                      Currently working here
                    </label>
                    {!isCurrent && (
                      <Input
                        label="To month & year"
                        type="month"
                        value={toMonthInputValue(endMonth, endYear)}
                        onChange={(value) => {
                          const { monthLabel, year } = fromMonthInputValue(value);
                          setEndMonth(monthLabel);
                          setEndYear(year);
                        }}
                      />
                    )}
                    {isCurrent && (
                      <div style={{ fontSize: 11, color: C.textSecondary, marginTop: -2 }}>
                        To date will be saved as Present.
                      </div>
                    )}
                  </div>
                </div>
                

                {/* Extra experience */}
                <AnimatePresence>
                  {moreExp.map((exp, idx) => (
                    <motion.div
                      key={`more-exp-${idx}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
                        background: "white", padding: 16, marginTop: 10,
                        boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
                      }}
                    >
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 10,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.textSecondary }}>
                          Previous role
                        </span>
                        <button
                          onClick={() => setMoreExp((prev) => prev.filter((_, i) => i !== idx))}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontSize: 11, fontWeight: 600, color: C.textSecondary,
                            fontFamily: "Inter, sans-serif",
                            display: "flex", alignItems: "center", gap: 3,
                          }}
                        >
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke={C.textSecondary}
                              strokeWidth="1.3" strokeLinecap="round" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Input label="Company" value={exp.company}
                          onChange={(v) => { const n = [...moreExp]; n[idx] = { ...n[idx], company: v }; setMoreExp(n); }}
                          placeholder="Company" />
                        <Input label="Title" value={exp.title}
                          onChange={(v) => { const n = [...moreExp]; n[idx] = { ...n[idx], title: v }; setMoreExp(n); }}
                          placeholder="Role" />
                      </div>
                      <div className="mt-3">
                        <Input
                          label="From month & year"
                          type="month"
                          value={toMonthInputValue(exp.startMonth, exp.startYear)}
                          onChange={(value) => {
                            const { monthLabel, year } = fromMonthInputValue(value);
                            const n = [...moreExp];
                            n[idx] = { ...n[idx], startMonth: monthLabel, startYear: year };
                            setMoreExp(n);
                          }}
                        />
                      </div>
                      <label
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 8,
                          cursor: "pointer",
                          userSelect: "none",
                          fontSize: 12,
                          fontWeight: 600,
                          color: C.textPrimary,
                          letterSpacing: "-0.01em",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const n = [...moreExp];
                            n[idx] = {
                              ...n[idx],
                              current: checked,
                              endMonth: checked ? "" : n[idx].endMonth,
                              endYear: checked ? "" : n[idx].endYear,
                            };
                            setMoreExp(n);
                          }}
                          style={{ accentColor: C.brand }}
                        />
                        Currently working here
                      </label>
                      {!exp.current && (
                        <div className="mt-3">
                          <Input
                            label="To month & year"
                            type="month"
                            value={toMonthInputValue(exp.endMonth, exp.endYear)}
                            onChange={(value) => {
                              const { monthLabel, year } = fromMonthInputValue(value);
                              const n = [...moreExp];
                              n[idx] = { ...n[idx], endMonth: monthLabel, endYear: year };
                              setMoreExp(n);
                            }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() =>
                    setMoreExp((prev) => [
                      ...prev,
                      { company: "", title: "", startMonth: "", startYear: "", current: false, endMonth: "", endYear: "" },
                    ])
                  }
                  style={{
                    width: "100%", padding: 11, borderRadius: 11, marginTop: 10,
                    border: `1.5px dashed rgba(28,25,23,0.12)`,
                    background: "transparent", cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    fontSize: 12, fontWeight: 600, color: C.textMuted,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  Add another role
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {profileType === "experienced" && (
          <div>
            <SectionLabel icon={
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 7c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z"
                  stroke={C.brand} strokeWidth="1.2" />
                <path d="M5 5h4M5 7h3M5 9h4" stroke={C.brand} strokeWidth="1.2"
                  strokeLinecap="round" />
              </svg>
            }>Skills</SectionLabel>

            <div style={{
              borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
              background: "white", padding: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <SkillsField
                skills={skills}
                skillInput={skillInput}
                setSkillInput={setSkillInput}
                onAddSkill={addSkill}
                onRemoveSkill={removeSkill}
                error={showRequiredErrors && missingSkills}
                errorText="At least one skill is required."
              />
            </div>
          </div>
        )}

        {profileType === "experienced" && (
          <div>
            <SectionLabel icon={
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 7c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6z"
                  stroke={C.brand} strokeWidth="1.2" />
                <path d="M5 5h4M5 7h3M5 9h4" stroke={C.brand} strokeWidth="1.2"
                  strokeLinecap="round" />
              </svg>
            }>Portfolio</SectionLabel>

            <div style={{
              borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
              background: "white", padding: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div className="flex flex-col gap-5">
                <Input
                  label="LinkedIn"
                  value={linkedinUrl}
                  onChange={setLinkedinUrl}
                  placeholder="linkedin.com/in/username"
                />
                <Input
                  label="Portfolio links"
                  value={portfolioLinks}
                  onChange={setPortfolioLinks}
                  placeholder="Personal website, GitHub, Behance etc"
                />
              </div>
            </div>
          </div>
        )}

        {profileType === "fresher" && (
          <div>
            <SectionLabel icon={
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5 4.2V3.7c0-.8.65-1.45 1.45-1.45h1.1c.8 0 1.45.65 1.45 1.45v.5M2.4 5.2h9.2c.72 0 1.3.58 1.3 1.3v4.25c0 .72-.58 1.3-1.3 1.3H2.4c-.72 0-1.3-.58-1.3-1.3V6.5c0-.72.58-1.3 1.3-1.3Z"
                  stroke={C.brand}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M1.4 7.6h11.2" stroke={C.brand} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            }>Skills</SectionLabel>

            <div style={{
              borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
              background: "white", padding: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <SkillsField
                skills={skills}
                skillInput={skillInput}
                setSkillInput={setSkillInput}
                onAddSkill={addSkill}
                onRemoveSkill={removeSkill}
                error={showRequiredErrors && missingSkills}
                errorText="At least one skill is required."
              />
            </div>
          </div>
        )}

        {profileType === "fresher" && (
          <div>
            <SectionLabel icon={
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M5 4.2V3.7c0-.8.65-1.45 1.45-1.45h1.1c.8 0 1.45.65 1.45 1.45v.5M2.4 5.2h9.2c.72 0 1.3.58 1.3 1.3v4.25c0 .72-.58 1.3-1.3 1.3H2.4c-.72 0-1.3-.58-1.3-1.3V6.5c0-.72.58-1.3 1.3-1.3Z"
                  stroke={C.brand}
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M1.4 7.6h11.2" stroke={C.brand} strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            }>Portfolio</SectionLabel>

            <div style={{
              borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
              background: "white", padding: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div className="flex flex-col gap-5">
                <Input
                  label="LinkedIn"
                  value={linkedinUrl}
                  onChange={setLinkedinUrl}
                  placeholder="linkedin.com/in/username"
                />
                <Input
                  label="Portfolio links"
                  value={portfolioLinks}
                  onChange={setPortfolioLinks}
                  placeholder="Personal website, GitHub, Behance etc"
                />
              </div>
            </div>
          </div>
        )}

        {profileType === "experienced" && (
          <div>
            <SectionLabel icon={
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M1 5l6-3 6 3-6 3-6-3z" stroke={C.brand} strokeWidth="1.3"
                  strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 6.5V9.5c0 1 1.6 2 3.5 2s3.5-1 3.5-2V6.5"
                  stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            }>Education</SectionLabel>

            <div style={{
              borderRadius: 14, border: `1.5px solid rgba(194,65,12,0.12)`,
              background: "white", padding: 16,
              boxShadow: "0 1px 8px rgba(0,0,0,0.03)",
            }}>
              <div className="flex flex-col gap-3">
                <SelectField
                  label="Highest qualification"
                  value={highestQualification}
                  onChange={setHighestQualification}
                  options={HIGHEST_QUALIFICATION_OPTIONS}
                  placeholder="Select highest qualification"
                  required
                  error={showRequiredErrors && missingHighestQualification}
                  errorText="Highest qualification is required."
                />

                {/* Subtle opt-in link for additional education details */}
                <AnimatePresence initial={false}>
                  {!showOptEdu && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ marginTop: 2 }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowOptEdu(true)}
                        style={{
                          background: "transparent",
                          border: "none",
                          borderRadius: 0,
                          minHeight: 40,
                          width: "100%",
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 11, fontWeight: 600, color: C.brand,
                          padding: "10px 0",
                          display: "inline-flex", alignItems: "center", gap: 6,
                          justifyContent: "center",
                          WebkitTapHighlightColor: "rgba(194,65,12,0.12)",
                          touchAction: "manipulation" as const,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                        Want to add institution & course details?
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false}>
                  {showOptEdu && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{
                        borderTop: "1px solid rgba(28,25,23,0.06)",
                        paddingTop: 14,
                        marginTop: 4,
                      }}>
                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginBottom: 10,
                        }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: C.textSecondary,
                            fontFamily: "Inter, sans-serif",
                          }}>
                            Recent education (optional)
                          </span>
                          <button
                            onClick={() => {
                              setShowOptEdu(false);
                              setOptEdu({ institution: "", course: "", specialization: "", year: "" });
                              setOptMoreEdu([]);
                            }}
                            style={{
                              background: "none", border: "none", cursor: "pointer",
                              fontSize: 11, fontWeight: 600, color: C.textSecondary,
                              fontFamily: "Inter, sans-serif",
                              display: "flex", alignItems: "center", gap: 3,
                            }}
                          >
                            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke={C.textSecondary}
                                strokeWidth="1.3" strokeLinecap="round" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        <div className="flex flex-col gap-3">
                          <Input label="Institution" value={optEdu.institution}
                            onChange={(v) => setOptEdu((prev) => ({ ...prev, institution: v }))}
                            placeholder="e.g. IIT Delhi" />
                          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr" }}>
                            <SelectField
                              label="Course"
                              value={optEdu.course}
                              onChange={(v) => {
                                setOptEdu((prev) => ({
                                  ...prev,
                                  course: v,
                                  specialization: v === "B.Tech" ? prev.specialization : "",
                                }));
                              }}
                              options={COURSE_OPTIONS}
                              placeholder="Select course"
                            />
                            <SelectField
                              label="Specialization"
                              value={optEdu.specialization}
                              onChange={(v) => setOptEdu((prev) => ({ ...prev, specialization: v }))}
                              options={optEdu.course === "B.Tech"
                                ? SPECIALIZATION_BY_COURSE["B.Tech"]
                                : ["General"]}
                              placeholder={optEdu.course ? "Select specialization" : "Select course first"}
                            />
                          </div>
                          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr" }}>
                            <Input label="Graduation Year" value={optEdu.year}
                              onChange={(v) => setOptEdu((prev) => ({ ...prev, year: v.replace(/\D/g, "").slice(0, 4) }))}
                              placeholder="2024" inputMode="numeric" />
                          </div>
                        </div>
                      </div>

                      {/* Earlier education entries */}
                      <AnimatePresence>
                        {optMoreEdu.map((edu, idx) => (
                          <motion.div
                            key={`exp-edu-${idx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{
                              borderRadius: 13, border: `1px solid ${C.border}`,
                              background: "rgba(28,25,23,0.015)", padding: 14, marginTop: 10,
                            }}
                          >
                            <div style={{
                              display: "flex", justifyContent: "space-between",
                              alignItems: "center", marginBottom: 10,
                            }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: C.textSecondary }}>
                                Earlier education {idx + 1}
                              </span>
                              <button
                                onClick={() => setOptMoreEdu((prev) => prev.filter((_, i) => i !== idx))}
                                style={{
                                  background: "none", border: "none", cursor: "pointer",
                                  fontSize: 11, fontWeight: 600, color: C.textSecondary,
                                  fontFamily: "Inter, sans-serif",
                                  display: "flex", alignItems: "center", gap: 3,
                                }}
                              >
                                <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                  <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke={C.textSecondary}
                                    strokeWidth="1.3" strokeLinecap="round" />
                                </svg>
                                Remove
                              </button>
                            </div>
                            <div className="grid gap-3" style={{ gridTemplateColumns: "1fr" }}>
                              <Input label="Institution" value={edu.institution}
                                onChange={(v) => {
                                  const n = [...optMoreEdu];
                                  n[idx] = { ...n[idx], institution: v };
                                  setOptMoreEdu(n);
                                }}
                                placeholder="Institution" />
                              <SelectField
                                label="Course"
                                value={edu.course}
                                onChange={(v) => {
                                  const n = [...optMoreEdu];
                                  n[idx] = {
                                    ...n[idx],
                                    course: v,
                                    specialization: v === "B.Tech" ? n[idx].specialization : "",
                                  };
                                  setOptMoreEdu(n);
                                }}
                                options={COURSE_OPTIONS}
                                placeholder="Select course"
                              />
                            </div>
                            <div className="grid gap-3" style={{ gridTemplateColumns: "1fr", marginTop: 12 }}>
                              <SelectField
                                label="Specialization"
                                value={edu.specialization}
                                onChange={(v) => {
                                  const n = [...optMoreEdu];
                                  n[idx] = { ...n[idx], specialization: v };
                                  setOptMoreEdu(n);
                                }}
                                options={edu.course === "B.Tech"
                                  ? SPECIALIZATION_BY_COURSE["B.Tech"]
                                  : ["General"]}
                                placeholder={edu.course ? "Select specialization" : "Select course first"}
                              />
                              <Input label="Graduation Year" value={edu.year}
                                onChange={(v) => {
                                  const n = [...optMoreEdu];
                                  n[idx] = { ...n[idx], year: v.replace(/\D/g, "").slice(0, 4) };
                                  setOptMoreEdu(n);
                                }}
                                placeholder="2024" inputMode="numeric" />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <button
                        onClick={() => setOptMoreEdu((prev) => [...prev, { institution: "", course: "", specialization: "", year: "" }])}
                        style={{
                          width: "100%", padding: 11, borderRadius: 11, marginTop: 10,
                          border: `1.5px dashed rgba(28,25,23,0.12)`,
                          background: "transparent", cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          fontSize: 12, fontWeight: 600, color: C.textMuted,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                        Add earlier education
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* ── Optional boosts (experienced) ─────────────────────────────── */}
        {profileType === "experienced" && (
        <div>
          <SectionLabel icon={
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke={C.brand} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }>Boost your profile (optional)</SectionLabel>

          <div className="flex flex-col gap-5">
                <OptionalSection
                  icon={(
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M7.2 2.2l1.8 1.8-2.2 2.2L5 4.4l2.2-2.2z" stroke={C.brand} strokeWidth="1.2" />
                      <path d="M8.9 4.1l3 3c1.1 1.1 1.1 2.9 0 4l-.8.8-4.1-4.1.8-.8c1.1-1.1 2.9-1.1 4 0z" stroke={C.brand} strokeWidth="1.2" />
                      <path d="M6.9 8.8L4.4 11.3" stroke={C.brand} strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M3 13l1.2-1.2" stroke={C.brand} strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  )} title="Any projects to showcase?"
                  subtitle="Great way to show what you've built"
                  expanded={showProjects}
                  onToggle={() => {
                    if (!showProjects && projects.length === 0)
                      setProjects([{ name: "", desc: "" }]);
                    setShowProjects(!showProjects);
                  }}
                >
                  <div className="flex flex-col gap-3">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        {idx > 0 && <div style={{ height: 1, background: "rgba(28,25,23,0.06)", margin: "4px 0" }} />}
                        <Input label="Project name" value={proj.name}
                          onChange={(v) => { const n = [...projects]; n[idx] = { ...n[idx], name: v }; setProjects(n); }}
                          placeholder="e.g. Portfolio website" />
                        <Input label="Brief description" value={proj.desc}
                          onChange={(v) => { const n = [...projects]; n[idx] = { ...n[idx], desc: v }; setProjects(n); }}
                          placeholder="What did you build?"
                          multiline
                          multilineRows={4}
                          multilineHeight={76} />
                      </div>
                    ))}
                    <button onClick={() => setProjects((prev) => [...prev, { name: "", desc: "" }])}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, color: C.brand,
                        fontFamily: "Inter, sans-serif", padding: "4px 0", textAlign: "left" as const,
                      }}>+ Add another</button>
                  </div>
                </OptionalSection>

                <OptionalSection
                  icon={(
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2.2l1.7 3.4 3.8.5-2.8 2.7.7 3.7L8 10.9l-3.4 1.6.7-3.7-2.8-2.7 3.8-.5L8 2.2z"
                        stroke={C.brand} strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                  )} title="Any achievements or extracurriculars?"
                  subtitle="Highlights your impact beyond work"
                  expanded={showAchievements}
                  onToggle={() => {
                    if (!showAchievements && achievements.length === 0)
                      setAchievements([{ title: "", desc: "" }]);
                    setShowAchievements(!showAchievements);
                  }}
                >
                  <div className="flex flex-col gap-3">
                    {achievements.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        {idx > 0 && <div style={{ height: 1, background: "rgba(28,25,23,0.06)", margin: "4px 0" }} />}
                        <Input label="Achievement" value={item.title}
                          onChange={(v) => { const n = [...achievements]; n[idx] = { ...n[idx], title: v }; setAchievements(n); }}
                          placeholder="e.g. Award, Conference talk, Leadership milestone" />
                        <Input label="Brief description" value={item.desc}
                          onChange={(v) => { const n = [...achievements]; n[idx] = { ...n[idx], desc: v }; setAchievements(n); }}
                          placeholder="What did you achieve?"
                          multiline
                          multilineHeight={76} />
                      </div>
                    ))}
                    <button onClick={() => setAchievements((prev) => [...prev, { title: "", desc: "" }])}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, color: C.brand,
                        fontFamily: "Inter, sans-serif", padding: "4px 0", textAlign: "left" as const,
                      }}>+ Add another</button>
                  </div>
                </OptionalSection>

                <OptionalSection
                  icon={(
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2.2" y="3" width="11.6" height="10.6" rx="2" stroke={C.brand} strokeWidth="1.3" />
                      <path d="M6 3V2.8c0-.44.36-.8.8-.8h2.4c.44 0 .8.36.8.8V3" stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M2.2 7.4h11.6" stroke={C.brand} strokeWidth="1.15" />
                    </svg>
                  )}
                  title="Upload your resume"
                  subtitle="We will not parse it in this step."
                  expanded={showResumeOptional}
                  onToggle={() => setShowResumeOptional((prev) => !prev)}
                >
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handleResumeSelect(e.target.files?.[0] || null);
                      e.target.value = "";
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      {resumeFile ? (
                        <div
                          style={{
                            fontSize: 12,
                            color: C.textPrimary,
                            lineHeight: 1.35,
                            wordBreak: "break-word",
                            fontWeight: 600,
                          }}
                        >
                          {resumeFile.name}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: C.textSecondary }}>
                          PDF, DOC, DOCX up to 10 MB
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => resumeInputRef.current?.click()}
                        style={{
                          border: "1px solid rgba(194,65,12,0.2)",
                          background: "rgba(194,65,12,0.05)",
                          color: C.brand,
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {resumeFile ? "Replace" : "Attach"}
                      </button>
                      {resumeFile ? (
                        <button
                          type="button"
                          onClick={() => {
                            setResumeFile(null);
                            setResumeError(null);
                          }}
                          style={{
                            border: `1px solid ${C.border}`,
                            background: "white",
                            color: C.textMuted,
                            borderRadius: 10,
                            padding: "8px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                  {resumeError ? (
                    <div style={{ marginTop: 7, fontSize: 11, fontWeight: 600, color: "#B91C1C" }}>
                      {resumeError}
                    </div>
                  ) : null}
                </OptionalSection>
          </div>
        </div>
        )}

        {/* ── Optional (fresher only) ──────────────────────────────── */}
        {profileType === "fresher" && (
        <div>
          <SectionLabel icon={
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke={C.brand} strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          }>Boost your profile (optional)</SectionLabel>

          <div className="flex flex-col gap-5">
                <OptionalSection
                  icon={(
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2.5 5.5h11M2.5 8h11M2.5 10.5h7.5" stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M12.2 12.6l1.3 1.2 2.4-2.6" stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  title="Any other job offers currently?"
                  subtitle="Share active offers if you have them"
                  expanded={showOtherOffers}
                  onToggle={() => setShowOtherOffers((prev) => !prev)}
                >
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => setHasOtherOffers("yes")}
                      style={{
                        flex: 1, padding: "10px 12px", borderRadius: 10,
                        border: `1.5px solid ${hasOtherOffers === "yes" ? "rgba(194,65,12,0.35)" : C.border}`,
                        background: hasOtherOffers === "yes" ? "rgba(194,65,12,0.08)" : "white",
                        color: hasOtherOffers === "yes" ? C.brand : C.textPrimary,
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHasOtherOffers("no");
                        setOfferCompany("");
                        setOfferRole("");
                      }}
                      style={{
                        flex: 1, padding: "10px 12px", borderRadius: 10,
                        border: `1.5px solid ${hasOtherOffers === "no" ? "rgba(194,65,12,0.35)" : C.border}`,
                        background: hasOtherOffers === "no" ? "rgba(194,65,12,0.08)" : "white",
                        color: hasOtherOffers === "no" ? C.brand : C.textPrimary,
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      No
                    </button>
                  </div>

                  {hasOtherOffers === "yes" && (
                    <div className="mt-3 flex flex-col gap-3">
                      <Input
                        label="Offer company"
                        value={offerCompany}
                        onChange={setOfferCompany}
                        placeholder="e.g. Company name"
                      />
                      <Input
                        label="Offer role"
                        value={offerRole}
                        onChange={setOfferRole}
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                  )}
                </OptionalSection>

                <OptionalSection
                  icon={(
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2" y="3" width="12" height="11" rx="2" stroke={C.brand} strokeWidth="1.4" />
                      <path d="M6 3V2.8C6 2.36 6.36 2 6.8 2h2.4c.44 0 .8.36.8.8V3" stroke={C.brand} strokeWidth="1.4" strokeLinecap="round" />
                      <path d="M2 7.5h12" stroke={C.brand} strokeWidth="1.2" />
                    </svg>
                  )} title="Any internships?"
                  subtitle="Companies love seeing initiative"
                  expanded={showInternships}
                  onToggle={() => {
                    if (!showInternships && internships.length === 0)
                      setInternships([{ company: "", role: "", desc: "" }]);
                    setShowInternships(!showInternships);
                  }}
                >
                  <div className="flex flex-col" style={{ gap: 0 }}>
                    {internships.map((int, idx) => (
                      <div key={idx}>
                        {idx > 0 && (
                          <div style={{
                            height: 1,
                            background: "rgba(28,25,23,0.08)",
                            margin: "14px 0",
                          }} />
                        )}
                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          alignItems: "center", marginBottom: 8,
                        }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, color: C.textSecondary,
                            fontFamily: "Inter, sans-serif",
                          }}>
                            Internship {idx + 1}
                          </span>
                          {internships.length > 1 && (
                            <button
                              onClick={() => setInternships((prev) => prev.filter((_, i) => i !== idx))}
                              style={{
                                background: "none", border: "none", cursor: "pointer",
                                fontSize: 11, fontWeight: 600, color: C.textSecondary,
                                fontFamily: "Inter, sans-serif",
                                display: "flex", alignItems: "center", gap: 3,
                              }}
                            >
                              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                                <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke={C.textSecondary}
                                  strokeWidth="1.3" strokeLinecap="round" />
                              </svg>
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Input label="Company" value={int.company}
                              onChange={(v) => { const n = [...internships]; n[idx] = { ...n[idx], company: v }; setInternships(n); }}
                              placeholder="Company" />
                            <Input label="Role" value={int.role}
                              onChange={(v) => { const n = [...internships]; n[idx] = { ...n[idx], role: v }; setInternships(n); }}
                              placeholder="Intern role" />
                          </div>
                          <Input label="Description" value={int.desc}
                            onChange={(v) => { const n = [...internships]; n[idx] = { ...n[idx], desc: v }; setInternships(n); }}
                            placeholder="What did you do? Any impressive achievements?"
                            multiline
                            multilineHeight={76} />
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setInternships((prev) => [...prev, { company: "", role: "", desc: "" }])}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, color: C.brand,
                        fontFamily: "Inter, sans-serif", padding: "4px 0",
                        textAlign: "left" as const, marginTop: 10,
                      }}>+ Add another</button>
                  </div>
                </OptionalSection>

                <OptionalSection
                  icon={(
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M7.2 2.2l1.8 1.8-2.2 2.2L5 4.4l2.2-2.2z" stroke={C.brand} strokeWidth="1.2" />
                      <path d="M8.9 4.1l3 3c1.1 1.1 1.1 2.9 0 4l-.8.8-4.1-4.1.8-.8c1.1-1.1 2.9-1.1 4 0z" stroke={C.brand} strokeWidth="1.2" />
                      <path d="M6.9 8.8L4.4 11.3" stroke={C.brand} strokeWidth="1.2" strokeLinecap="round" />
                      <path d="M3 13l1.2-1.2" stroke={C.brand} strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  )} title="Any projects to showcase?"
                  subtitle="Great way to show what you've built"
                  expanded={showProjects}
                  onToggle={() => {
                    if (!showProjects && projects.length === 0)
                      setProjects([{ name: "", desc: "" }]);
                    setShowProjects(!showProjects);
                  }}
                >
                  <div className="flex flex-col gap-3">
                    {projects.map((proj, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        {idx > 0 && <div style={{ height: 1, background: "rgba(28,25,23,0.06)", margin: "4px 0" }} />}
                        <Input label="Project name" value={proj.name}
                          onChange={(v) => { const n = [...projects]; n[idx] = { ...n[idx], name: v }; setProjects(n); }}
                          placeholder="e.g. Portfolio website" />
                        <Input label="Brief description" value={proj.desc}
                          onChange={(v) => { const n = [...projects]; n[idx] = { ...n[idx], desc: v }; setProjects(n); }}
                          placeholder="What did you build?"
                          multiline
                          multilineRows={4}
                          multilineHeight={76} />
                      </div>
                    ))}
                    <button onClick={() => setProjects((prev) => [...prev, { name: "", desc: "" }])}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, color: C.brand,
                        fontFamily: "Inter, sans-serif", padding: "4px 0", textAlign: "left" as const,
                      }}>+ Add another</button>
                  </div>
                </OptionalSection>

                <OptionalSection
                  icon={(
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2.2l1.7 3.4 3.8.5-2.8 2.7.7 3.7L8 10.9l-3.4 1.6.7-3.7-2.8-2.7 3.8-.5L8 2.2z"
                        stroke={C.brand} strokeWidth="1.2" strokeLinejoin="round" />
                    </svg>
                  )} title="Any achievements or extracurriculars?"
                  subtitle="Highlights your impact beyond coursework"
                  expanded={showAchievements}
                  onToggle={() => {
                    if (!showAchievements && achievements.length === 0)
                      setAchievements([{ title: "", desc: "" }]);
                    setShowAchievements(!showAchievements);
                  }}
                >
                  <div className="flex flex-col gap-3">
                    {achievements.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-3">
                        {idx > 0 && <div style={{ height: 1, background: "rgba(28,25,23,0.06)", margin: "4px 0" }} />}
                        <Input label="Achievement" value={item.title}
                          onChange={(v) => { const n = [...achievements]; n[idx] = { ...n[idx], title: v }; setAchievements(n); }}
                          placeholder="e.g. Hackathon finalist, Club lead, Scholarship" />
                        <Input label="Brief description" value={item.desc}
                          onChange={(v) => { const n = [...achievements]; n[idx] = { ...n[idx], desc: v }; setAchievements(n); }}
                          placeholder="What did you achieve or organize?"
                          multiline
                          multilineHeight={76} />
                      </div>
                    ))}
                    <button onClick={() => setAchievements((prev) => [...prev, { title: "", desc: "" }])}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, color: C.brand,
                        fontFamily: "Inter, sans-serif", padding: "4px 0", textAlign: "left" as const,
                      }}>+ Add another</button>
                  </div>
                </OptionalSection>

                <OptionalSection
                  icon={(
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="2.2" y="3" width="11.6" height="10.6" rx="2" stroke={C.brand} strokeWidth="1.3" />
                      <path d="M6 3V2.8c0-.44.36-.8.8-.8h2.4c.44 0 .8.36.8.8V3" stroke={C.brand} strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M2.2 7.4h11.6" stroke={C.brand} strokeWidth="1.15" />
                    </svg>
                  )}
                  title="Upload your resume"
                  subtitle="We will not parse it in this step."
                  expanded={showResumeOptional}
                  onToggle={() => setShowResumeOptional((prev) => !prev)}
                >
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      handleResumeSelect(e.target.files?.[0] || null);
                      e.target.value = "";
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      {resumeFile ? (
                        <div
                          style={{
                            fontSize: 12,
                            color: C.textPrimary,
                            lineHeight: 1.35,
                            wordBreak: "break-word",
                            fontWeight: 600,
                          }}
                        >
                          {resumeFile.name}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: C.textSecondary }}>
                          PDF, DOC, DOCX up to 10 MB
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => resumeInputRef.current?.click()}
                        style={{
                          border: "1px solid rgba(194,65,12,0.2)",
                          background: "rgba(194,65,12,0.05)",
                          color: C.brand,
                          borderRadius: 10,
                          padding: "8px 10px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {resumeFile ? "Replace" : "Attach"}
                      </button>
                      {resumeFile ? (
                        <button
                          type="button"
                          onClick={() => {
                            setResumeFile(null);
                            setResumeError(null);
                          }}
                          style={{
                            border: `1px solid ${C.border}`,
                            background: "white",
                            color: C.textMuted,
                            borderRadius: 10,
                            padding: "8px 10px",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </div>
                  {resumeError ? (
                    <div style={{ marginTop: 7, fontSize: 11, fontWeight: 600, color: "#B91C1C" }}>
                      {resumeError}
                    </div>
                  ) : null}
                </OptionalSection>
          </div>
        </div>
        )}

            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>

      {/* ── CTA footer (matches WelcomeScreen sticky bar: Previous | Continue) ─ */}
      <div
        className={`px-0 ${formColumnClass}`}
        style={{
          flexShrink: 0,
          position: "sticky",
          bottom: 0,
          zIndex: 20,
          paddingTop: 12,
          paddingBottom: 20,
          background: "transparent",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <motion.button
          type="button"
          whileTap={submitting ? {} : { scale: 0.95 }}
          onClick={onBack}
          disabled={submitting}
          aria-label="Go back"
          style={{
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "10px 10px",
            borderRadius: 10,
            border: "none",
            background: "transparent",
            color: C.textMuted,
            fontSize: 14,
            fontWeight: 500,
            cursor: submitting ? "not-allowed" : "pointer",
            opacity: submitting ? 0.45 : 1,
            fontFamily: "Inter, sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ letterSpacing: "-0.01em" }}>Previous</span>
        </motion.button>

        <motion.button
          onClick={handleComplete}
          disabled={submitting}
          whileTap={!submitting ? { scale: 0.97 } : {}}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "13px 28px",
            borderRadius: 14,
            border: "none",
            background: submitting
              ? "rgba(28,25,23,0.2)"
              : "#EA580C",
            color: submitting ? "rgba(255,255,255,0.55)" : "white",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            cursor: submitting ? "not-allowed" : "pointer",
            transition: "background 0.2s, box-shadow 0.2s",
            fontFamily: "Inter, sans-serif",
            boxShadow: submitting ? "none" : "0 4px 16px rgba(234,88,12,0.35)",
          }}
        >
          <AnimatePresence mode="wait">
            {submitting ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(255,255,255,0.25)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "onb-spin 0.65s linear infinite",
                    display: "inline-block",
                  }}
                />
                Setting up…
              </motion.span>
            ) : (
              <motion.span
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                Continue
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M5 2l5 5-5 5"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <style>{`@keyframes onb-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
