import {
  useState,
  useEffect,
  useRef,
  isValidElement,
  cloneElement,
  type ReactElement,
  type ReactNode,
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
import { cn } from "./ui/utils";

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
const CATEGORY_LABELS: Record<string, string> = {
  swe: "Software Engineering", design: "Design", data: "Data",
  product: "Product", marketing: "Marketing", finance: "Finance",
  sales: "Sales", hr: "Human Resources", consulting: "Consulting",
  ops: "Operations & Strategy", cs: "Customer Success", legal: "Legal",
  security: "Security", health: "Healthcare", misc: "Misc. Engineering",
  other: "Other",
};
const SETUP_LABELS: Record<string, string> = {
  onsite: "Onsite", hybrid: "Hybrid", remote: "Remote",
};
const TIMELINE_LABELS: Record<string, string> = {
  immediately: "Immediately", "1month": "Within 1 month",
  "3months": "Within 3 months", exploring: "Just exploring",
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
  /** When true (e.g. desktop onboarding chrome), no cream fill — content uses the parent glass surface. */
  transparentSurface?: boolean;
}

export function ProfileSummaryScreen({
  profile,
  email,
  onEditProfile,
  onContinue,
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
    .map((id: string) => CATEGORY_LABELS[id] || id)
    .slice(0, 3);
  const allRoles = Array.from(new Set((
    Object.values(prefs.rolesByCategory || {}).flat() as string[]
  ).concat(Array.isArray(prefs.roles) ? prefs.roles : [])));
  const selectedCategoryIds: string[] = Array.isArray(prefs.categories) && prefs.categories.length > 0
    ? prefs.categories
    : (prefs.category ? [prefs.category] : []);
  const categoryRolePairs = selectedCategoryIds
    .map((catId: string) => {
      const catLabel = CATEGORY_LABELS[catId] || catId;
      const roles = Array.isArray(prefs.rolesByCategory?.[catId])
        ? (prefs.rolesByCategory[catId] as string[]).filter(Boolean)
        : [];
      return roles.length > 0 ? `${catLabel}: ${roles.slice(0, 2).join(", ")}` : catLabel;
    })
    .slice(0, 2);
  const lookingForText =
    categoryRolePairs.length > 0
      ? categoryRolePairs.join(" | ")
      : allRoles.length > 0 && categoryLabels.length > 0
        ? `${categoryLabels[0]}: ${allRoles.slice(0, 2).join(", ")}`
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
    ? `${currentExperience.role} @ ${currentExperience.company}`
    : (headline || (isFresherProfile ? "Fresher" : "Professional"));
  const totalExperienceMeta =
    (() => {
      const match = String(headline || "").match(/(\d+\+?\s*(?:years?|yrs?))/i);
      if (match?.[1]) return match[1].replace(/\s+/g, " ");
      return "";
    })();
  const highestQualificationMeta = String(topEdu?.degree || "").trim();
  const topSkillChips = skills.slice(0, 5);

  const [ready, setReady] = useState(false);
  const [otpStage, setOtpStage] = useState<"idle" | "sending" | "sent" | "verifying" | "verified">("idle");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);

  const normalizePhone = (raw: string) => raw.replace(/[^\d+]/g, "").trim();
  const isLikelyValidPhone = (raw: string) => normalizePhone(raw).replace(/[^\d]/g, "").length >= 10;
  const hasPhone = phoneDisplay.length > 0;
  const phoneVerified = otpStage === "verified";
  const canContinue = hasPhone && phoneVerified;
  const phoneVerificationRef = useRef<HTMLDivElement>(null);
  const [continueGateHint, setContinueGateHint] = useState<string | null>(null);

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

  useEffect(() => {
    if (otpStage !== "sent") return;
    if (otp.trim().length !== 4) return;
    void verifyOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, otpStage]);

  useEffect(() => {
    if (phoneVerified) setContinueGateHint(null);
  }, [phoneVerified]);

  useEffect(() => {
    if (!hasPhone || !isLikelyValidPhone(phoneDisplay)) {
      setOtpStage("idle");
      setOtp("");
      setOtpError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneDisplay]);

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
            padding: transparentSurface ? "20px 20px 24px" : "44px 20px 120px",
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
              className="m-0 text-[clamp(1.45rem,5.4vw,1.9rem)] font-normal leading-[1.12] tracking-[-0.02em] text-stone-900"
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
                <p className="m-0 text-[12px] font-medium leading-snug tracking-[-0.01em] text-stone-500">
                  {[totalExperienceMeta, highestQualificationMeta].filter(Boolean).join(" • ")}
                </p>
              )}
              {topSkillChips.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {topSkillChips.map((s) => (
                    <span
                      key={s}
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
              delay={0.02}
              onEdit={() => onEditProfile("personal")}
              editAriaLabel="Edit basic details"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {emailDisplay ? (
                  <PrefItem icon={<Mail size={13} strokeWidth={2} />} label="Email" value={emailDisplay} />
                ) : null}
                {phoneDisplay ? (
                  <PrefItem
                    icon={<Phone size={13} strokeWidth={2} />}
                    label="Phone"
                    value={
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                        <span>{phoneDisplay}</span>
                        {phoneVerified && (
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 999,
                              background: "#10B981",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                            aria-label="Phone verified"
                            title="Phone verified"
                          >
                            <Check size={11} color="white" strokeWidth={2.8} />
                          </span>
                        )}
                      </span>
                    }
                  />
                ) : null}
                {locationDisplay ? (
                  <PrefItem icon={<MapPin size={13} strokeWidth={2} />} label="Location" value={locationDisplay} />
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
                {!phoneVerified ? (
                <div
                  ref={phoneVerificationRef}
                  className={cn(
                    "mt-2 flex flex-col gap-1.5 rounded-[12px]",
                    "bg-gradient-to-b from-orange-50 to-orange-100/55",
                    "px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
                  )}
                >
                  {continueGateHint && (
                    <div
                      role="status"
                      style={{
                        margin: 0,
                        padding: "5px 8px",
                        borderRadius: 8,
                        background: "rgba(234,88,12,0.08)",
                        border: "1px solid rgba(234,88,12,0.16)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#C2410C",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.35,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 6,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={14}
                        height={14}
                        viewBox="0 0 24 24"
                        className="mt-0.5 shrink-0 text-red-600"
                        aria-hidden
                      >
                        <circle cx="12" cy="12" r="10" fill="currentColor" />
                        <circle cx="12" cy="8" r="1.5" fill="white" />
                        <rect x="11" y="11" width="2" height="7.5" rx="1" fill="white" />
                      </svg>
                      <span style={{ minWidth: 0 }}>{continueGateHint}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 pr-0.5">
                      <p className="m-0 text-[12px] font-semibold leading-tight tracking-[-0.02em] text-stone-900">
                        Phone verification
                      </p>
                      <p className="m-0 mt-0.5 text-[11px] font-medium leading-snug tracking-[-0.01em] text-stone-600">
                        We need to verify your phone first.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpStage === "sending" || otpStage === "verifying" || phoneVerified || !isLikelyValidPhone(phoneDisplay)}
                      style={{
                        minHeight: 34,
                        padding: "0 10px",
                        borderRadius: 8,
                        border: "none",
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
                  {(otpStage === "sent" || otpStage === "verifying") && !phoneVerified && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="Enter 4-digit OTP"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: 34,
                          borderRadius: 8,
                          border: "1px solid rgba(28,25,23,0.12)",
                          background: "white",
                          padding: "0 10px",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#1C1917",
                          fontFamily: "Inter, sans-serif",
                          outline: "none",
                        }}
                      />
                    </div>
                  )}
                  {otpError && (
                    <p style={{ margin: 0, fontSize: 11, color: "#B91C1C", fontWeight: 600 }}>
                      {otpError}
                    </p>
                  )}
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
                              {exp.company || "Company"}
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
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {skills.slice(0, 8).map((s, i) => (
                        <motion.span
                          key={s}
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
                            color: "#C2410C",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {s}
                        </motion.span>
                      ))}
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
                              color: "#78716C",
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
                          label="Switch timeline"
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
                                  color: "#C2410C",
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
        </div>
      </div>

      {/* ── Footer CTAs ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
        style={{
          position: transparentSurface ? "relative" : "fixed",
          bottom: transparentSurface ? undefined : 0,
          left: transparentSurface ? undefined : 0,
          right: transparentSurface ? undefined : 0,
          marginTop: transparentSurface ? 0 : undefined,
          padding: "14px 20px calc(14px + env(safe-area-inset-bottom))",
          background: "transparent",
          display: "flex",
          justifyContent: "stretch",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => {
            if (canContinue) {
              setContinueGateHint(null);
              onContinue();
              return;
            }
            setContinueGateHint(
              !isLikelyValidPhone(phoneDisplay)
                ? "Add a valid phone number in your profile, then send the code and verify before continuing."
                : "Please verify your phone number before continuing.",
            );
            requestAnimationFrame(() => {
              phoneVerificationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            });
          }}
          style={{
            width: "100%",
            height: 50,
            minWidth: 0,
            padding: "0 16px",
            borderRadius: 14,
            border: "none",
            background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: transparentSurface ? "none" : "0 6px 24px rgba(234,88,12,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Continue
          <ChevronRight size={16} strokeWidth={2.2} />
        </motion.button>
      </motion.div>
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
  delay = 0,
  onEdit,
  editAriaLabel,
  children,
}: {
  icon: React.ReactNode;
  title: string;
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
        border: "1px solid rgba(28,25,23,0.06)",
        boxShadow: "0 2px 12px rgba(28,25,23,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
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
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em" }}>{title}</span>
        {onEdit ? (
          <button
            type="button"
            aria-label={editAriaLabel || `Edit ${title}`}
            onClick={onEdit}
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
                color: "#78716C",
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

function PrefItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  const iconMuted = isValidElement(icon)
    ? cloneElement(icon as ReactElement<{ size?: number; color?: string; strokeWidth?: number }>, {
        size: 12,
        color: "#A8A29E",
        strokeWidth: 1.75,
      })
    : icon;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
      <div style={prefRowIconInline} aria-hidden>
        {iconMuted}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 11, color: "#A8A29E", margin: 0, fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: 13, color: "#1C1917", margin: "2px 0 0", letterSpacing: "-0.01em", fontWeight: 600 }}>{value}</p>
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
