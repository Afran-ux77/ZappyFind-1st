import {
  useState,
  useEffect,
  useRef,
  isValidElement,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase, GraduationCap, Wrench,
  Clock, IndianRupee, Building2, Target, ChevronRight, Heart,
  Contact, Mail, Phone, MapPin, Link2, Pencil, Check, Sparkles,
} from "lucide-react";
import type { FullProfile } from "./WelcomeScreen";
import {
  formatSalaryAnnualDisplay,
  JOB_PRIORITY_LABEL_BY_ID,
  type SalaryCurrencyCode,
} from "./JobPreferencesScreen";
import { JOB_DEPARTMENT_LABEL_BY_ID } from "./jobPrefDepartmentsData";
import { cn } from "./ui/utils";
import { DT } from "../desktop/desktop-tokens";

const SALARY_CURR_SET = new Set<SalaryCurrencyCode>([
  "INR", "USD", "EUR", "GBP", "AED", "SGD", "CAD", "AUD",
]);

const EASE = [0.16, 1, 0.3, 1] as const;

const PRIORITY_LABELS: Record<string, string> = {
  meaningful: "Meaningful work", leaders: "Experienced leaders",
  investors: "Top investors", manyhats: "Wear many hats",
  smart: "Smart teammates", challenge: "Challenging work",
  growth: "Growing fast", startup: "Cool startup",
  stable: "Stable company", tech: "Innovative technology",
  flexible: "Flexible hours", benefits: "Great benefits",
  remote: "Remote friendly", wlb: "Work-life balance",
};

const CATEGORY_LABELS: Record<string, string> = { ...JOB_DEPARTMENT_LABEL_BY_ID };
const SETUP_LABELS: Record<string, string> = {
  onsite: "Onsite", hybrid: "Hybrid", remote: "Remote",
};
const TIMELINE_LABELS: Record<string, string> = {
  immediately: "Immediately", "1month": "Within 1 month",
  "3months": "Around 3 months", exploring: "Just exploring",
};
const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  entry: "0-2y",
  mid: "1-3y",
  senior: "3-6y",
  lead: "5-10y",
};

function isSyntheticPortfolioExp(e: any): boolean {
  const c = String(e?.company || "").trim().toLowerCase();
  const r = String(e?.role || "").trim().toLowerCase();
  return c === "portfolio" && (r === "links" || r === "link");
}

/** Pull http(s) / www URLs from pasted portfolio text (newline, comma, or inline). */
function parsePortfolioUrls(raw: string): string[] {
  if (!raw.trim()) return [];
  const found = new Set<string>();
  const re = /https?:\/\/[^\s<>"')]+|www\.[^\s<>"',;)\]]+/gi;
  let m: RegExpExecArray | null;
  const s = raw;
  while ((m = re.exec(s)) !== null) {
    let u = m[0].replace(/[),.;:]+$/g, "");
    if (u.startsWith("www.")) u = `https://${u}`;
    found.add(u);
  }
  if (found.size > 0) return [...found];
  return s
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => /^https?:\/\//i.test(l));
}

function humanizePortfolioUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.replace(/\/$/, "");
    return (host + path) || url;
  } catch {
    return url;
  }
}

interface ProfileSummaryScreenProps {
  profile: FullProfile | null;
  email: string;
  onEditProfile: (section?: "personal" | "experience" | "education" | "skills" | "preferences") => void;
  onContinue: () => void;
  /** Called after the user verifies email with the on-screen OTP (so you can persist `emailVerified: true` on the profile). */
  onEmailVerified?: () => void;
  /** When true (e.g. desktop onboarding chrome), no cream fill — content uses the parent glass surface. */
  transparentSurface?: boolean;
}

export function ProfileSummaryScreen({
  profile,
  email,
  onEditProfile,
  onContinue,
  onEmailVerified,
  transparentSurface = false,
}: ProfileSummaryScreenProps) {
  const p = (profile || {}) as any;
  const name: string = p.name || p.fullName || "";
  const firstName = name.trim().split(/\s+/)[0] || email.split("@")[0] || "there";
  const initial = firstName.charAt(0).toUpperCase();
  const headline: string = p.headline || p.currentRole || "";
  const location: string = p.location || p.city || "";
  const skills: string[] = Array.isArray(p.skills) ? p.skills : [];
  const experiences: any[] = Array.isArray(p.experiences) ? p.experiences : [];
  const education: any[] = Array.isArray(p.education) ? p.education : [];
  const prefs = p.preferences || {};

  const workExperiences = experiences.filter((e) => !isSyntheticPortfolioExp(e));
  const portfolioRaw = String(
    experiences.find(isSyntheticPortfolioExp)?.description
      || p.portfolioLinks
      || p.linkedIn
      || p.linkedin
      || "",
  ).trim();
  const portfolioUrls = parsePortfolioUrls(portfolioRaw);

  const emailDisplay = String(p.email || email || "").trim();
  const phoneDisplay = String(p.phone || "").trim();
  const locationDisplay = String(location || "").trim();
  const hasBasicDetails =
    Boolean(emailDisplay || phoneDisplay || locationDisplay || portfolioRaw);

  const topExperiences = workExperiences.slice(0, 2);
  const topEdu = education[0];
  const categoryLabels = ((prefs.categories && prefs.categories.length > 0)
    ? prefs.categories
    : (prefs.category ? [prefs.category] : []))
    .map((id: string) =>
      id === "other" && String(prefs.otherDepartmentLabel || "").trim()
        ? String(prefs.otherDepartmentLabel).trim()
        : (CATEGORY_LABELS[id] || id))
    .slice(0, 3);
  const allRoles = Array.from(new Set((
    Object.values(prefs.rolesByCategory || {}).flat() as string[]
  ).concat(Array.isArray(prefs.roles) ? prefs.roles : [])));
  const selectedCategoryIds: string[] = Array.isArray(prefs.categories) && prefs.categories.length > 0
    ? prefs.categories
    : (prefs.category ? [prefs.category] : []);
  const experienceLevelByCategory: Record<string, string> = prefs.experienceLevelByCategory || {};
  const formatCategoryLabelWithExperience = (catId: string): string => {
    const catLabel =
      catId === "other" && String(prefs.otherDepartmentLabel || "").trim()
        ? String(prefs.otherDepartmentLabel).trim()
        : CATEGORY_LABELS[catId] || catId;
    const expId = experienceLevelByCategory[catId];
    const expLabel = expId ? (EXPERIENCE_LEVEL_LABELS[expId] || expId) : "";
    return expLabel ? `${catLabel} (${expLabel})` : catLabel;
  };
  const categoryRolePairs = selectedCategoryIds
    .map((catId: string) => {
      const catLabel = formatCategoryLabelWithExperience(catId);
      const roles = Array.isArray(prefs.rolesByCategory?.[catId])
        ? (prefs.rolesByCategory[catId] as string[]).filter(Boolean)
        : [];
      return roles.length > 0 ? `${catLabel}: ${roles.slice(0, 2).join(", ")}` : catLabel;
    })
    .slice(0, 2);
  const fallbackCategoryLabel = selectedCategoryIds.length > 0
    ? formatCategoryLabelWithExperience(selectedCategoryIds[0])
    : categoryLabels[0];
  const lookingForText =
    categoryRolePairs.length > 0
      ? categoryRolePairs.join(" | ")
      : allRoles.length > 0 && categoryLabels.length > 0
        ? `${fallbackCategoryLabel}: ${allRoles.slice(0, 2).join(", ")}`
        : allRoles.length > 0
          ? allRoles.slice(0, 3).join(", ")
          : categoryLabels.join(", ");
  const workSetups = (prefs.workSetups || [])
    .map((id: string) => SETUP_LABELS[id] || id);
  const locations: string[] = Array.isArray(prefs.locations) ? prefs.locations : [];
  const priorities = (prefs.priorities || []).map((id: string) => {
    const fromJobPrefs = JOB_PRIORITY_LABEL_BY_ID[id];
    const fromLegacy = PRIORITY_LABELS[id];
    if (fromJobPrefs) return fromJobPrefs;
    if (fromLegacy) return fromLegacy;
    return id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  });
  const timeline = TIMELINE_LABELS[prefs.switchTimeline] || prefs.switchTimeline || "";
  const salMin = prefs.salaryMin;
  const salMax = prefs.salaryMax;
  const salCurrencyRaw = prefs.salaryCurrency || "INR";
  const salCurrency: SalaryCurrencyCode = SALARY_CURR_SET.has(salCurrencyRaw as SalaryCurrencyCode)
    ? (salCurrencyRaw as SalaryCurrencyCode)
    : "INR";
  const salaryText =
    salMin != null && salMax != null
      ? `${formatSalaryAnnualDisplay(salMin, salCurrency)} – ${formatSalaryAnnualDisplay(salMax, salCurrency)}`
      : "";

  const aiSummary =
    p.summary ||
    buildAiSummary(
      firstName,
      headline,
      skills,
      workExperiences,
      education,
      categoryLabels,
      allRoles,
      workSetups,
      locations,
      priorities,
    );
  const isFresherProfile = workExperiences.length === 0;
  const currentExperience = workExperiences[0];
  const currentRoleCompany = currentExperience?.role && currentExperience?.company
    ? `${String(currentExperience.role).replace(/^Senior\s+/i, "").trim()} @ ${String(currentExperience.company).trim().toLowerCase() === "zappyhire" ? "HR Tech Platform" : currentExperience.company}`
    : (headline || (isFresherProfile ? "Fresher" : "Professional"));
  const totalExperienceMeta =
    (() => {
      const match = String(headline || "").match(/(\d+\+?\s*(?:years?|yrs?))/i);
      if (match?.[1]) return match[1].replace(/\s+/g, " ");
      return "";
    })();
  const highestQualificationMeta = String(topEdu?.degree || "").trim();
  const INITIAL_PROFILE_SKILL_CHIPS = 5;
  const INITIAL_SECTION_SKILLS = 8;
  const visibleSkillChips = skills.slice(0, INITIAL_PROFILE_SKILL_CHIPS);
  const [showAllSectionSkills, setShowAllSectionSkills] = useState(false);
  const visibleSectionSkills = showAllSectionSkills ? skills : skills.slice(0, INITIAL_SECTION_SKILLS);
  const hasMoreSectionSkills = skills.length > INITIAL_SECTION_SKILLS;

  const [ready, setReady] = useState(false);
  const [otpStage, setOtpStage] = useState<"idle" | "sending" | "sent" | "verifying" | "verified">("idle");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const [emailOtpStage, setEmailOtpStage] = useState<"idle" | "sending" | "sent" | "verifying" | "verified">("idle");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpError, setEmailOtpError] = useState<string | null>(null);

  const normalizePhone = (raw: string) => raw.replace(/[^\d+]/g, "").trim();
  const isLikelyValidPhone = (raw: string) => normalizePhone(raw).replace(/[^\d]/g, "").length >= 10;
  const hasPhone = phoneDisplay.length > 0;
  const phoneVerified = otpStage === "verified";
  const emailVerifiedFromProfile = p.emailVerified === true;
  const emailVerified = emailVerifiedFromProfile || emailOtpStage === "verified";
  const otpDigitRefs = useRef<Array<HTMLInputElement | null>>([]);
  const emailOtpDigitRefs = useRef<Array<HTMLInputElement | null>>([]);

  const updateOtpDigits = (next: string) => {
    setOtp(next.replace(/\D/g, "").slice(0, 4));
  };

  const handleOtpDigitChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      const current = otp.padEnd(4, " ").split("");
      current[index] = " ";
      updateOtpDigits(current.join("").trim());
      return;
    }

    if (digits.length === 1) {
      const current = otp.padEnd(4, " ").split("");
      current[index] = digits;
      updateOtpDigits(current.join(""));
      if (index < 3) otpDigitRefs.current[index + 1]?.focus();
      return;
    }

    // Handle autofill/paste into a single box.
    const current = otp.padEnd(4, " ").split("");
    for (let i = index; i < 4; i += 1) {
      current[i] = digits[i - index] ?? current[i];
    }
    updateOtpDigits(current.join(""));
    const focusIdx = Math.min(index + digits.length, 3);
    otpDigitRefs.current[focusIdx]?.focus();
  };

  const handleOtpDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") return;
    const digit = otp[index] ?? "";
    if (digit) return;
    if (index === 0) return;
    otpDigitRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    updateOtpDigits(pasted);
    otpDigitRefs.current[Math.min(pasted.length - 1, 3)]?.focus();
  };

  const isLikelyValidEmail = (raw: string) => {
    const t = raw.trim();
    return t.length >= 5 && t.includes("@") && !t.startsWith("@") && !t.endsWith("@");
  };

  const updateEmailOtpDigits = (next: string) => {
    setEmailOtp(next.replace(/\D/g, "").slice(0, 4));
  };

  const handleEmailOtpDigitChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      const current = emailOtp.padEnd(4, " ").split("");
      current[index] = " ";
      updateEmailOtpDigits(current.join("").trim());
      return;
    }

    if (digits.length === 1) {
      const current = emailOtp.padEnd(4, " ").split("");
      current[index] = digits;
      updateEmailOtpDigits(current.join(""));
      if (index < 3) emailOtpDigitRefs.current[index + 1]?.focus();
      return;
    }

    const current = emailOtp.padEnd(4, " ").split("");
    for (let i = index; i < 4; i += 1) {
      current[i] = digits[i - index] ?? current[i];
    }
    updateEmailOtpDigits(current.join(""));
    const focusIdx = Math.min(index + digits.length, 3);
    emailOtpDigitRefs.current[focusIdx]?.focus();
  };

  const handleEmailOtpDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Backspace") return;
    const digit = emailOtp[index] ?? "";
    if (digit) return;
    if (index === 0) return;
    emailOtpDigitRefs.current[index - 1]?.focus();
  };

  const handleEmailOtpPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (!pasted) return;
    e.preventDefault();
    updateEmailOtpDigits(pasted);
    emailOtpDigitRefs.current[Math.min(pasted.length - 1, 3)]?.focus();
  };

  const sendOtp = async () => {
    if (!isLikelyValidPhone(phoneDisplay) || otpStage === "sending" || otpStage === "verifying" || phoneVerified) return;
    setOtpError(null);
    setOtpStage("sending");
    await new Promise((r) => setTimeout(r, 650));
    setOtp("");
    setOtpStage("sent");
  };

  const verifyOtp = async () => {
    if (otpStage !== "sent" || otp.trim().length < 4) return;
    setOtpError(null);
    setOtpStage("verifying");
    await new Promise((r) => setTimeout(r, 550));
    if (otp.trim() === "1234") {
      setOtpStage("verified");
      return;
    }
    setOtpStage("sent");
    setOtp("");
    setOtpError("Incorrect code. Please try again.");
  };

  const sendEmailOtp = async () => {
    if (
      !isLikelyValidEmail(emailDisplay) ||
      emailOtpStage === "sending" ||
      emailOtpStage === "verifying" ||
      emailVerified
    )
      return;
    setEmailOtpError(null);
    setEmailOtpStage("sending");
    await new Promise((r) => setTimeout(r, 650));
    setEmailOtp("");
    setEmailOtpStage("sent");
  };

  const verifyEmailOtp = async () => {
    if (emailOtpStage !== "sent" || emailOtp.trim().length < 4) return;
    setEmailOtpError(null);
    setEmailOtpStage("verifying");
    await new Promise((r) => setTimeout(r, 550));
    if (emailOtp.trim() === "1234") {
      setEmailOtpStage("verified");
      onEmailVerified?.();
      return;
    }
    setEmailOtpStage("sent");
    setEmailOtp("");
    setEmailOtpError("Incorrect code. Please try again.");
  };

  useEffect(() => {
    if (otpStage !== "sent") return;
    if (otp.trim().length !== 4) return;
    void verifyOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, otpStage]);

  useEffect(() => {
    if (emailOtpStage !== "sent") return;
    if (emailOtp.trim().length !== 4) return;
    void verifyEmailOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailOtp, emailOtpStage]);

  useEffect(() => {
    if (!hasPhone || !isLikelyValidPhone(phoneDisplay)) {
      setOtpStage("idle");
      setOtp("");
      setOtpError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneDisplay]);

  useEffect(() => {
    if (!emailDisplay.trim() || !isLikelyValidEmail(emailDisplay)) {
      setEmailOtpStage("idle");
      setEmailOtp("");
      setEmailOtpError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailDisplay]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: transparentSurface ? "auto" : "100dvh",
        height: transparentSurface ? "auto" : "100dvh",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: transparentSurface ? "visible" : "hidden",
        background: transparentSurface ? "transparent" : "#FDFBF8",
      }}
    >
      {/* ── Noisy gradient header blob (mobile / standalone only) ─── */}
      {!transparentSurface && (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 320,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(145deg, rgba(255,220,188,0.7) 0%, rgba(255,200,160,0.5) 25%, rgba(255,240,225,0.4) 50%, rgba(253,251,248,1) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-20%",
            width: "80%",
            height: "140%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,143,86,0.2) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "-10%",
            width: "60%",
            height: "100%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(234,88,12,0.08) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />
        {/* Noise texture */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.35, mixBlendMode: "overlay" }}
        >
          <filter id="psnoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#psnoise)" />
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            background: "linear-gradient(to bottom, transparent, #FDFBF8)",
          }}
        />
      </div>
      )}

      {/* ── Main content (inner scroll on mobile only; desktop glass uses page scroll) ─ */}
      <div
        style={{
          flex: transparentSurface ? undefined : 1,
          overflowY: transparentSurface ? "visible" : "auto",
          overflowX: "hidden",
          minHeight: 0,
          overscrollBehavior: transparentSurface ? undefined : "contain",
          WebkitOverflowScrolling: transparentSurface ? undefined : "touch",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: transparentSurface ? "20px 40px 24px" : "44px 20px 120px",
            background: transparentSurface ? "transparent" : undefined,
          }}
        >
          {/* ── Screen header + premium glass hero (compact card like earlier layout) ─ */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mb-[18px]"
          >
            <h2
              className="m-0 text-center text-[clamp(1.45rem,5.4vw,1.9rem)] font-normal leading-[1.12] tracking-[-0.02em] text-stone-900"
              style={{ fontFamily: "'DM Serif Display', Georgia, 'Times New Roman', serif" }}
            >
              Does this look like you?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className={cn(
              "relative mb-[18px] flex flex-col gap-3 overflow-hidden rounded-[22px] border px-5 py-5 antialiased",
              "backdrop-blur-3xl backdrop-saturate-[1.58]",
              "shadow-[0_1px_0_rgba(255,255,255,0.78)_inset,0_0_0_1px_rgba(255,255,255,0.22)_inset,inset_0_36px_64px_-36px_rgba(255,255,255,0.55),0_1px_2px_rgba(28,25,23,0.03),0_12px_36px_-12px_rgba(28,25,23,0.045),0_26px_70px_-30px_rgba(28,25,23,0.065)]",
              transparentSurface
                ? "border-white/55 bg-white/[0.52] ring-1 ring-white/40"
                : "border-stone-900/[0.06] bg-gradient-to-b from-white/[0.48] via-white/[0.24] to-stone-50/[0.12] ring-1 ring-white/65",
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/55 via-white/[0.06] to-stone-900/[0.014]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 rounded-[22px] bg-[radial-gradient(120%_70%_at_50%_-10%,rgba(255,255,255,0.55),transparent_55%)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-20 -top-28 h-[240px] w-[240px] rounded-full bg-gradient-to-br from-orange-400/[0.14] via-amber-100/[0.07] to-transparent blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -left-16 top-1/2 h-[180px] w-[180px] -translate-y-1/2 rounded-full bg-gradient-to-tr from-sky-100/[0.09] via-transparent to-transparent blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-5 top-0 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-white/95 to-transparent shadow-[0_6px_18px_rgba(255,255,255,0.42)]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 rounded-b-[22px] bg-gradient-to-t from-stone-800/[0.022] to-transparent"
              aria-hidden
            />

            <div className="relative z-[1] flex flex-col gap-3">
              <div>
                <h1 className="m-0 text-[24px] font-extrabold leading-[1.08] tracking-[-0.05em] text-stone-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.55)]">
                  {name || "Candidate"}
                </h1>
                <p className="mt-2 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-stone-800/95">
                  {currentRoleCompany}
                </p>
              </div>
              {(totalExperienceMeta || highestQualificationMeta) && (
                <div className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium leading-snug tracking-[-0.01em] text-stone-500">
                  {totalExperienceMeta && (
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-[12px] w-[12px]" strokeWidth={2} aria-hidden />
                      {totalExperienceMeta}
                    </span>
                  )}
                  {highestQualificationMeta && (
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="h-[12px] w-[12px]" strokeWidth={2} aria-hidden />
                      {highestQualificationMeta}
                    </span>
                  )}
                </div>
              )}
              {visibleSkillChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {visibleSkillChips.map((s, idx) => (
                    <span
                      key={`${s}-${idx}`}
                      className="rounded-full border border-stone-200/90 bg-stone-100 px-3 py-1 text-[11.5px] font-medium tracking-[-0.01em] text-stone-600 shadow-[0_1px_0_rgba(255,255,255,0.45)_inset,0_1px_2px_rgba(28,25,23,0.05)] whitespace-nowrap"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {String(aiSummary).trim() ? (
                <div
                  className={cn(
                    "mt-0.5 flex gap-2.5 rounded-2xl border border-orange-200/40 bg-gradient-to-br from-white/90 via-orange-50/40 to-stone-50/70",
                    "px-3.5 py-3 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_8px_24px_-10px_rgba(234,88,12,0.12)] ring-1 ring-inset ring-orange-500/[0.06]",
                  )}
                >
                  <Sparkles
                    className="mt-0.5 h-[14px] w-[14px] shrink-0 text-orange-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-700/80">
                      AI summary
                    </p>
                    <p className="m-0 text-[13px] font-normal leading-relaxed tracking-[-0.01em] text-stone-600">
                      {aiSummary}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>

          {/* Basic contact & links — same card language as other sections */}
          {hasBasicDetails && (
            <div style={{ marginBottom: 12 }}>
            <Section
              icon={<Contact size={14} color="#EA580C" strokeWidth={2} />}
              title="Basic details"
              needsAttention={!phoneVerified || (phoneVerified && Boolean(emailDisplay) && !emailVerified)}
              delay={0.02}
              onEdit={() => onEditProfile("personal")}
              editAriaLabel="Edit basic details"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {!phoneVerified && phoneDisplay ? (
                  <PrefItem
                    icon={<Phone size={13} strokeWidth={2} />}
                    label="Phone"
                    value={phoneDisplay}
                    unverified
                  />
                ) : null}
                {!phoneVerified ? (
                <div
                  id="profile-phone-verify-block"
                  className={cn(
                    "flex flex-col gap-3 rounded-[12px]",
                    "bg-gradient-to-b from-orange-50 to-orange-100/55",
                    "px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ring-1 ring-inset ring-orange-500/15",
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/90 text-orange-600 shadow-sm ring-1 ring-orange-200/60"
                      aria-hidden
                    >
                      <Phone size={15} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="m-0 text-[12px] font-semibold leading-tight tracking-[-0.02em] text-stone-900">
                        Phone verification
                      </p>
                      <p className="m-0 mt-1 text-[11px] font-medium leading-relaxed tracking-[-0.01em] text-stone-600">
                        Recruiters reach you here; ZappyFind sends job updates on WhatsApp.
                      </p>
                    </div>
                  </div>
                  {(otpStage === "sent" || otpStage === "verifying") && !phoneVerified && (
                    <div className="flex items-center gap-2" onPaste={handleOtpPaste}>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <input
                          key={`otp-${i}`}
                          ref={(el) => {
                            otpDigitRefs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={otp[i] ?? ""}
                          onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpDigitKeyDown(i, e)}
                          aria-label={`OTP digit ${i + 1}`}
                          style={{
                            width: 34,
                            minWidth: 34,
                            height: 34,
                            borderRadius: 8,
                            border: "1px solid rgba(28,25,23,0.12)",
                            background: "white",
                            textAlign: "center",
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1C1917",
                            fontFamily: "Inter, sans-serif",
                            outline: "none",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {otpError && (
                    <p style={{ margin: 0, fontSize: 11, color: "#B91C1C", fontWeight: 600 }}>
                      {otpError}
                    </p>
                  )}
                  <div className="flex w-full">
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpStage === "sending" || otpStage === "verifying" || phoneVerified || !isLikelyValidPhone(phoneDisplay)}
                      style={{
                        width: "100%",
                        minHeight: 34,
                        padding: "0 10px",
                        borderRadius: 8,
                        background: phoneVerified
                          ? "rgba(5,150,105,0.12)"
                          : otpStage === "sent" || otpStage === "verifying"
                            ? "transparent"
                            : "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
                        color:
                          phoneVerified
                            ? "#047857"
                            : otpStage === "sent" || otpStage === "verifying"
                              ? "#EA580C"
                              : "white",
                        boxShadow:
                          phoneVerified
                            ? "none"
                            : otpStage === "sent" || otpStage === "verifying"
                              ? "none"
                              : "0 4px 12px rgba(255,107,53,0.25)",
                        border:
                          otpStage === "sent" || otpStage === "verifying"
                            ? "1px solid rgba(234,88,12,0.2)"
                            : "none",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        cursor:
                          otpStage === "sending" || otpStage === "verifying" || phoneVerified || !isLikelyValidPhone(phoneDisplay)
                            ? "default"
                            : "pointer",
                        fontFamily: "Inter, sans-serif",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {phoneVerified
                        ? "Verified"
                        : otpStage === "sending"
                          ? "Sending…"
                          : otpStage === "sent" || otpStage === "verifying"
                            ? "Resend"
                            : "Send Code"}
                    </button>
                  </div>
                </div>
                ) : null}
                {phoneVerified ? (
                  <>
                    {phoneDisplay ? (
                      <PrefItem
                        icon={<Phone size={13} strokeWidth={2} />}
                        label="Phone"
                        value={phoneDisplay}
                        verified
                      />
                    ) : null}
                    {locationDisplay ? (
                      <PrefItem icon={<MapPin size={13} strokeWidth={2} />} label="Location" value={locationDisplay} />
                    ) : null}
                    {emailDisplay ? (
                      <PrefItem
                        icon={<Mail size={13} strokeWidth={2} />}
                        label="Email"
                        value={emailDisplay}
                        verified={emailVerified}
                        unverified={!emailVerified && Boolean(emailDisplay)}
                      />
                    ) : null}
                    {phoneVerified && !emailVerified && emailDisplay ? (
                      <div
                        id="profile-email-verify-block"
                        className={cn(
                          "flex flex-col gap-3 rounded-[12px]",
                          "bg-gradient-to-b from-orange-50 to-orange-100/55",
                          "px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] ring-1 ring-inset ring-orange-500/15",
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/90 text-orange-600 shadow-sm ring-1 ring-orange-200/60"
                            aria-hidden
                          >
                            <Mail size={15} strokeWidth={2.2} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="m-0 text-[12px] font-semibold leading-tight tracking-[-0.02em] text-stone-900">
                              Email verification
                            </p>
                            <p className="m-0 mt-1 text-[11px] font-medium leading-relaxed tracking-[-0.01em] text-stone-600">
                              Recruiters and ZappyFind will reach out in this inbox. Confirm it's yours.
                            </p>
                          </div>
                        </div>
                        {(emailOtpStage === "sent" || emailOtpStage === "verifying") && !emailVerified && (
                          <div className="flex items-center gap-2" onPaste={handleEmailOtpPaste}>
                            {Array.from({ length: 4 }).map((_, i) => (
                              <input
                                key={`email-otp-${i}`}
                                ref={(el) => {
                                  emailOtpDigitRefs.current[i] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                value={emailOtp[i] ?? ""}
                                onChange={(e) => handleEmailOtpDigitChange(i, e.target.value)}
                                onKeyDown={(e) => handleEmailOtpDigitKeyDown(i, e)}
                                aria-label={`Email verification code digit ${i + 1}`}
                                style={{
                                  width: 34,
                                  minWidth: 34,
                                  height: 34,
                                  borderRadius: 8,
                                  border: "1px solid rgba(28,25,23,0.12)",
                                  background: "white",
                                  textAlign: "center",
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#1C1917",
                                  fontFamily: "Inter, sans-serif",
                                  outline: "none",
                                }}
                              />
                            ))}
                          </div>
                        )}
                        {emailOtpError && (
                          <p style={{ margin: 0, fontSize: 11, color: "#B91C1C", fontWeight: 600 }}>
                            {emailOtpError}
                          </p>
                        )}
                        <div className="flex w-full">
                          <button
                            type="button"
                            onClick={sendEmailOtp}
                            disabled={
                              emailOtpStage === "sending" ||
                              emailOtpStage === "verifying" ||
                              emailVerified ||
                              !isLikelyValidEmail(emailDisplay)
                            }
                            style={{
                              width: "100%",
                              minHeight: 34,
                              padding: "0 10px",
                              borderRadius: 8,
                              background: emailVerified
                                ? "rgba(5,150,105,0.12)"
                                : emailOtpStage === "sent" || emailOtpStage === "verifying"
                                  ? "transparent"
                                  : "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
                              color:
                                emailVerified
                                  ? "#047857"
                                  : emailOtpStage === "sent" || emailOtpStage === "verifying"
                                    ? "#EA580C"
                                    : "white",
                              boxShadow:
                                emailVerified
                                  ? "none"
                                  : emailOtpStage === "sent" || emailOtpStage === "verifying"
                                    ? "none"
                                    : "0 4px 12px rgba(255,107,53,0.25)",
                              border:
                                emailOtpStage === "sent" || emailOtpStage === "verifying"
                                  ? "1px solid rgba(234,88,12,0.2)"
                                  : "none",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: "-0.01em",
                              cursor:
                                emailOtpStage === "sending" ||
                                emailOtpStage === "verifying" ||
                                emailVerified ||
                                !isLikelyValidEmail(emailDisplay)
                                  ? "default"
                                  : "pointer",
                              fontFamily: "Inter, sans-serif",
                              whiteSpace: "nowrap",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {emailVerified
                              ? "Verified"
                              : emailOtpStage === "sending"
                                ? "Sending…"
                                : emailOtpStage === "sent" || emailOtpStage === "verifying"
                                  ? "Resend"
                                  : "Send Code"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </>
                ) : null}
                {!phoneVerified ? (
                  <>
                    {emailDisplay ? (
                      <PrefItem
                        icon={<Mail size={13} strokeWidth={2} />}
                        label="Email"
                        value={emailDisplay}
                        verified={emailVerified}
                        unverified={false}
                      />
                    ) : null}
                    {locationDisplay ? (
                      <PrefItem icon={<MapPin size={13} strokeWidth={2} />} label="Location" value={locationDisplay} />
                    ) : null}
                  </>
                ) : null}
                {portfolioRaw ? (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                    <div style={prefRowIconInline} aria-hidden>
                      <Link2 size={12} color="#A8A29E" strokeWidth={1.75} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 11, color: "#A8A29E", margin: 0, fontWeight: 500 }}>
                        LinkedIn / portfolio
                      </p>
                      {portfolioUrls.length > 0 ? (
                        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
                          {portfolioUrls.map((url) => (
                            <a
                              key={url}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#EA580C",
                                letterSpacing: "-0.01em",
                                textDecoration: "none",
                                wordBreak: "break-all" as const,
                                lineHeight: 1.35,
                              }}
                            >
                              {humanizePortfolioUrl(url)}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p
                          style={{
                            fontSize: 13,
                            color: "#1C1917",
                            margin: "6px 0 0",
                            letterSpacing: "-0.01em",
                            fontWeight: 600,
                            lineHeight: 1.45,
                            whiteSpace: "pre-wrap" as const,
                            wordBreak: "break-word" as const,
                          }}
                        >
                          {portfolioRaw}
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </Section>
            </div>
          )}

          {/* Sections appear staggered */}
          <AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {/* ── Experience ──────────────────────────────────────── */}
                {topExperiences.length > 0 && (
                  <Section
                    icon={<Briefcase size={14} color="#EA580C" strokeWidth={2} />}
                    title="Experience"
                    delay={0}
                    onEdit={() => onEditProfile("experience")}
                    editAriaLabel="Edit experience"
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {topExperiences.map((exp: any, i: number) => (
                        <motion.div
                          key={exp.id || i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: 0.22 + i * 0.08, ease: EASE }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em" }}>
                              {String(exp.company || "").trim().toLowerCase() === "hr tech platform"
                                ? "Zappyhire"
                                : exp.company || "Company"}
                            </span>
                            {exp.duration && (
                              <span style={{ fontSize: 11, fontWeight: 500, color: "#A8A29E", letterSpacing: "-0.01em", flexShrink: 0, marginLeft: 8 }}>
                                {exp.duration}
                              </span>
                            )}
                          </div>
                          {exp.role && (
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#78716C", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                              {exp.role}
                            </p>
                          )}
                          {buildExpInsight(exp) && (
                            <p style={{ fontSize: 11, color: "#A8A29E", margin: 0, lineHeight: 1.45, letterSpacing: "-0.005em", fontStyle: "italic" }}>
                              {buildExpInsight(exp)}
                            </p>
                          )}
                          {i < topExperiences.length - 1 && (
                            <div style={{ height: 1, background: "rgba(28,25,23,0.05)", marginTop: 12 }} />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* ── Education ───────────────────────────────────────── */}
                {topEdu && (
                  <Section
                    icon={<GraduationCap size={14} color="#EA580C" strokeWidth={2} />}
                    title="Education"
                    delay={0.08}
                    onEdit={() => onEditProfile("education")}
                    editAriaLabel="Edit education"
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em" }}>
                          {topEdu.institution || "Institution"}
                        </span>
                        {topEdu.year && (
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#A8A29E", flexShrink: 0, marginLeft: 8 }}>
                            {topEdu.year}
                          </span>
                        )}
                      </div>
                      {topEdu.degree && (
                        <p style={{ fontSize: 12, fontWeight: 500, color: "#78716C", margin: 0, letterSpacing: "-0.01em" }}>
                          {topEdu.degree}{topEdu.grade ? ` · ${topEdu.grade}` : ""}
                        </p>
                      )}
                    </div>
                  </Section>
                )}

                {/* ── Skills ──────────────────────────────────────────── */}
                {skills.length > 0 && (
                  <Section
                    icon={<Wrench size={14} color="#EA580C" strokeWidth={2} />}
                    title="Skills"
                    delay={0.14}
                    onEdit={() => onEditProfile("skills")}
                    editAriaLabel="Edit skills"
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {visibleSectionSkills.map((s, i) => (
                          <motion.span
                            key={`${s}-${i}`}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25, delay: 0.28 + i * 0.025, ease: EASE }}
                            style={{
                              padding: "5px 11px",
                              borderRadius: 8,
                              background: "rgba(234,88,12,0.06)",
                              border: "1px solid rgba(234,88,12,0.1)",
                              fontSize: 12,
                              fontWeight: 500,
                              color: DT.accent,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {s}
                          </motion.span>
                        ))}
                      </div>
                      {hasMoreSectionSkills && (
                        <button
                          type="button"
                          onClick={() => setShowAllSectionSkills((prev) => !prev)}
                          style={{
                            alignSelf: "flex-start",
                            padding: "5px 11px",
                            minHeight: 40,
                            borderRadius: 14,
                            border: "1px solid rgba(234,88,12,0.18)",
                            background: "rgba(255,255,255,0.9)",
                            color: DT.accent,
                            fontSize: 11.5,
                            fontWeight: 500,
                            letterSpacing: "-0.01em",
                            cursor: "pointer",
                          }}
                        >
                          {showAllSectionSkills ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </Section>
                )}

                {/* ── Preferences ─────────────────────────────────────── */}
                {(categoryLabels.length > 0 || allRoles.length > 0 || workSetups.length > 0 || locations.length > 0 || salaryText || timeline || priorities.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.26, ease: EASE }}
                    style={{
                      borderRadius: 18,
                      background: "white",
                      border: "1px solid rgba(28,25,23,0.06)",
                      boxShadow: "0 2px 12px rgba(28,25,23,0.04)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 8,
                            background: "rgba(234,88,12,0.07)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Target size={14} color="#EA580C" strokeWidth={2} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em" }}>Preferences</span>
                        <button
                          type="button"
                          aria-label="Edit preferences"
                          onClick={() => onEditProfile("preferences")}
                          style={{
                            marginLeft: "auto",
                            width: 44,
                            height: 44,
                            borderRadius: 10,
                            border: "none",
                            background: "transparent",
                            color: "inherit",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <span
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: 8,
                              border: "1px solid rgba(28,25,23,0.1)",
                              background: "white",
                              color: DT.accent,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Pencil size={12} strokeWidth={2} />
                          </span>
                        </button>
                      </div>
                      {/* Job type row */}
                      {(categoryLabels.length > 0 || allRoles.length > 0) && (
                        <PrefItem
                          icon={<Briefcase size={13} strokeWidth={2} />}
                          label="Looking for"
                          value={lookingForText}
                        />
                      )}

                      {/* Work setup */}
                      {workSetups.length > 0 && (
                        <PrefItem
                          icon={<Building2 size={13} strokeWidth={2} />}
                          label="Work setup"
                          value={workSetups.join(", ")}
                        />
                      )}

                      {locations.length > 0 && (
                        <PrefItem
                          icon={<Target size={13} strokeWidth={2} />}
                          label="Preferred locations"
                          value={locations.slice(0, 3).join(", ")}
                        />
                      )}

                      {/* Salary */}
                      {salaryText && (
                        <PrefItem
                          icon={<IndianRupee size={13} strokeWidth={2} />}
                          label="Expected salary"
                          value={salaryText}
                        />
                      )}

                      {/* Timeline */}
                      {timeline && (
                        <PrefItem
                          icon={<Clock size={13} strokeWidth={2} />}
                          label="Notice period"
                          value={timeline}
                        />
                      )}

                      {/* Priorities */}
                      {priorities.length > 0 && (
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8 }}>
                            <Heart size={12} color="#A8A29E" strokeWidth={1.75} aria-hidden />
                            <span style={{ fontSize: 11, fontWeight: 500, color: "#A8A29E" }}>What matters most</span>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {priorities.map((pr) => (
                              <span
                                key={pr}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 100,
                                  background: "rgba(234,88,12,0.06)",
                                  border: "1px solid rgba(234,88,12,0.1)",
                                  fontSize: 11,
                                  fontWeight: 500,
                                  color: DT.accent,
                                }}
                              >
                                {pr}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
            style={{
              marginTop: 14,
              padding: transparentSurface
                ? "0 0 6px"
                : "14px 0 calc(14px + env(safe-area-inset-bottom))",
              background: "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => onContinue()}
              style={{
                width: "auto",
                height: 50,
                minWidth: 148,
                flexShrink: 0,
                padding: "0 22px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                boxShadow:
                  !transparentSurface ? "0 6px 24px rgba(234,88,12,0.3)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                opacity: 1,
              }}
            >
              Continue
              <ChevronRight size={16} strokeWidth={2.2} aria-hidden />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared styles / helpers ──────────────────────────────────────────────── */

/** Inline muted icon only (no fill) — matches “What matters most” heart treatment */
const prefRowIconInline: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginTop: 2,
};

function Section({
  icon,
  title,
  titleAccessory,
  needsAttention,
  delay = 0,
  onEdit,
  editAriaLabel,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  titleAccessory?: ReactNode;
  needsAttention?: boolean;
  delay?: number;
  onEdit?: () => void;
  editAriaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.18 + delay, ease: EASE }}
      style={{
        borderRadius: 18,
        padding: "16px 18px",
        background: "white",
        border: needsAttention ? "1px solid rgba(234,88,12,0.34)" : "1px solid rgba(28,25,23,0.06)",
        boxShadow: needsAttention
          ? "0 3px 14px rgba(28,25,23,0.055), 0 10px 28px -10px rgba(234,88,12,0.11), 0 0 0 3px rgba(234,88,12,0.11)"
          : "0 2px 12px rgba(28,25,23,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
          marginBottom: 12,
          flexWrap: "nowrap",
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "rgba(234,88,12,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
            justifyContent: "flex-start",
            columnGap: 10,
            flexWrap: "nowrap",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1C1917",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              flexShrink: 0,
              lineHeight: 1.15,
            }}
          >
            {title}
          </span>
          {titleAccessory ? (
            <>
              <div
                aria-hidden
                style={{
                  width: 1,
                  height: 15,
                  flexShrink: 0,
                  borderRadius: 1,
                  background: "rgba(120, 113, 108, 0.28)",
                  marginBottom: 1,
                }}
              />
              <div style={{ flexShrink: 0, height: 29 }}>{titleAccessory}</div>
            </>
          ) : null}
        </div>
        {onEdit ? (
          <button
            type="button"
            aria-label={editAriaLabel || `Edit ${title}`}
            onClick={onEdit}
            style={{
              flexShrink: 0,
              marginLeft: "auto",
              width: 44,
              height: 44,
              borderRadius: 10,
              border: "none",
              background: "transparent",
              color: "inherit",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid rgba(28,25,23,0.1)",
                background: "white",
                color: DT.accent,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Pencil size={12} strokeWidth={2} />
            </span>
          </button>
        ) : null}
      </div>
      {children}
    </motion.div>
  );
}

const verifiedFieldBadgeStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: 999,
  background: "#10B981",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

function PrefItem({
  icon,
  label,
  value,
  verified,
  unverified,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  verified?: boolean;
  /** Shown next to value when profile phone is not yet verified (mutually exclusive with `verified` in normal use). */
  unverified?: boolean;
}) {
  const iconMuted = isValidElement(icon)
    ? cloneElement(icon as ReactElement<{ size?: number; color?: string; strokeWidth?: number }>, {
        size: 12,
        color: "#A8A29E",
        strokeWidth: 1.75,
      })
    : icon;
  const verifiedLabel = label === "Phone" ? "Phone verified" : "Email on file";
  const unverifiedLabel = label === "Email" ? "Email not verified" : "Phone not verified";
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
      <div style={prefRowIconInline} aria-hidden>
        {iconMuted}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 11, color: "#A8A29E", margin: 0, fontWeight: 500 }}>{label}</p>
        <p
          style={{
            fontSize: 13,
            color: "#1C1917",
            margin: "2px 0 0",
            letterSpacing: "-0.01em",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 7,
            flexWrap: "wrap",
          }}
        >
          <span style={{ minWidth: 0, wordBreak: "break-word" as const }}>{value}</span>
          {verified ? (
            <span style={verifiedFieldBadgeStyle} aria-label={verifiedLabel} title={verifiedLabel}>
              <Check size={11} color="white" strokeWidth={2.8} />
            </span>
          ) : unverified ? (
            <span
              className="inline-flex shrink-0 items-center rounded-md border border-stone-300/70 bg-stone-50 px-1.5 py-0.5"
              aria-label={unverifiedLabel}
              title={unverifiedLabel}
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-stone-600">
                Unverified
              </span>
            </span>
          ) : null}
        </p>
      </div>
    </div>
  );
}

function buildExpInsight(exp: any): string {
  const role = (exp.role || "").toLowerCase();
  const company = exp.company || "";
  if (!role && !company) return "";
  if (role.includes("senior") || role.includes("lead") || role.includes("principal"))
    return `Senior-level impact — strong signal for leadership readiness.`;
  if (role.includes("product designer") || role.includes("ux"))
    return `Product design track record across user-facing surfaces.`;
  if (role.includes("engineer") || role.includes("developer") || role.includes("swe"))
    return `Hands-on engineering at scale — solid technical depth.`;
  if (role.includes("manager") || role.includes("pm") || role.includes("product manager"))
    return `Cross-functional ownership — built and shipped end-to-end.`;
  if (role.includes("analyst") || role.includes("data"))
    return `Data-driven background — analytical thinking and structured work.`;
  return `Relevant industry experience at ${company}.`;
}

function buildAiSummary(
  firstName: string,
  headline: string,
  skills: string[],
  experiences: any[],
  education: any[],
  categories: string[],
  allRoles: string[],
  workSetups: string[],
  locations: string[],
  priorities: string[],
): string {
  const topExp = experiences.slice(0, 2);
  const companies = topExp
    .map((e) => String(e?.company || "").trim())
    .filter(Boolean);
  const rolesRecent = topExp
    .map((e) => String(e?.role || "").trim())
    .filter(Boolean);

  const blurbs = topExp.map((e) => String(e?.description || "")).join(" ");
  const hasQuantProof =
    /\d/.test(blurbs) && /%|conversion|growth|reduction|increase|improv|revenue|saved|lift|drop/i.test(blurbs);

  const institute = String(education[0]?.institution || "").trim();
  const stemEdu =
    /IIT|IIM|ISB|Indian Institute of Technology|Stanford|MIT\b|Oxford|Cambridge/i.test(institute);
  const degreeShort = String(education[0]?.degree || "").trim();
  const degreeClause =
    degreeShort && degreeShort.length <= 48 ? degreeShort.toLowerCase() : "";

  const cats = categories.filter(Boolean).slice(0, 2);
  const roles = allRoles.filter(Boolean).slice(0, 2);
  const locs = locations.filter(Boolean).slice(0, 2);
  const modes = workSetups.filter(Boolean).slice(0, 2);
  const cares = priorities.filter(Boolean).slice(0, 2);

  const topSkills = skills.filter(Boolean).slice(0, 3);

  const targetTitle =
    roles.length > 0 ? roles.join(" or ") : cats.length > 0 ? cats[0] : "";

  const credParts: string[] = [];
  if (companies.length >= 2) {
    credParts.push(`progression ${companies[1]} → ${companies[0]}`);
  } else if (companies.length === 1) {
    credParts.push(`depth from work at ${companies[0]}`);
  }
  if (rolesRecent[0] && companies[0]) {
    credParts.push(`recently as ${rolesRecent[0]}`);
  }
  if (hasQuantProof) credParts.push("comfort with measurable impact");
  else if (stemEdu) credParts.push("rigorous technical training");
  else if (degreeClause) credParts.push(`${degreeClause} as a base`);

  const attrPick = credParts.filter(Boolean).slice(0, 2);
  const skillCore =
    topSkills.length > 0
      ? `${firstName} is strong in ${topSkills.join(", ")}${skills.length > 3 ? ", with more in the toolkit" : ""}`
      : "";

  const competencyLine =
    skillCore && attrPick.length
      ? `${skillCore}, with ${attrPick.join(" and ")}.`
      : skillCore
        ? `${skillCore}.`
        : attrPick.length
          ? `${firstName} shows ${attrPick.join(" and ")}.`
          : headline.trim()
            ? `${firstName}: ${headline.trim()}.`
            : `${firstName} is defining strengths to highlight.`;

  const intentBits: string[] = [];
  if (targetTitle) intentBits.push(targetTitle);
  if (modes.length) intentBits.push(modes.join(" · "));
  if (locs.length) intentBits.push(locs.join(", "));

  let intentLine = "";
  if (intentBits.length > 0) {
    intentLine = `Looking for ${intentBits.join(" · ")}`;
    intentLine += cares.length
      ? `; ${cares.join(" & ")} matter most.`
      : ".";
  } else if (cares.length > 0) {
    intentLine = `${cares.join(" & ")} shape what a good fit means.`;
  } else {
    intentLine = "Add preferences to tighten role fit.";
  }

  return `${competencyLine} ${intentLine}`.replace(/\s+/g, " ").trim();
}
