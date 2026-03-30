import {
  useState,
  useEffect,
  isValidElement,
  cloneElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Briefcase, GraduationCap, Wrench,
  Clock, IndianRupee, Building2, Target, ChevronRight, Heart,
} from "lucide-react";
import type { FullProfile } from "./WelcomeScreen";
import {
  formatSalaryAnnualDisplay,
  type SalaryCurrencyCode,
} from "./JobPreferencesScreen";

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

interface ProfileSummaryScreenProps {
  profile: FullProfile | null;
  email: string;
  onEditProfile: () => void;
  onContinue: () => void;
}

export function ProfileSummaryScreen({
  profile,
  email,
  onEditProfile,
  onContinue,
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

  const topExperiences = experiences.slice(0, 2);
  const topEdu = education[0];
  const totalYears = p.yearsOfExperience || p.totalExperience || "";

  const categoryLabels = ((prefs.categories && prefs.categories.length > 0)
    ? prefs.categories
    : (prefs.category ? [prefs.category] : []))
    .map((id: string) => CATEGORY_LABELS[id] || id)
    .slice(0, 3);
  const allRoles = (
    Object.values(prefs.rolesByCategory || {}).flat() as string[]
  ).concat(Array.isArray(prefs.roles) ? prefs.roles : []);
  const workSetups = (prefs.workSetups || [])
    .map((id: string) => SETUP_LABELS[id] || id);
  const locations: string[] = Array.isArray(prefs.locations) ? prefs.locations : [];
  const priorities = (prefs.priorities || [])
    .map((id: string) => PRIORITY_LABELS[id] || id);
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

  const aiSummary = p.summary || buildAiSummary(firstName, headline, totalYears, skills, categoryLabels, workSetups);

  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: "#FDFBF8",
      }}
    >
      {/* ── Noisy gradient header blob ──────────────────────────────── */}
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

      {/* ── Scrollable content ─────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overscrollBehavior: "contain",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ padding: "44px 20px 120px" }}>
          {/* Screen heading */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.04, ease: EASE }}
            style={{ marginBottom: 30 }}
          >
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1C1917", letterSpacing: "-0.05em", lineHeight: 1.15, margin: "0 0 10px" }}>
              Does think look like you, Alex?
            </h1>

          </motion.div>

          {/* ── AI Snapshot ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
            style={{
              borderRadius: 22,
              padding: "14px 16px",
              background: "linear-gradient(145deg, rgba(255,255,255,0.64) 0%, rgba(255,255,255,0.5) 55%, rgba(255,245,238,0.54) 100%)",
              backdropFilter: "blur(28px) saturate(1.7)",
              WebkitBackdropFilter: "blur(28px) saturate(1.7)",
              border: "1px solid rgba(255,255,255,0.74)",
              boxShadow:
                "0 10px 36px rgba(234,88,12,0.11), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(255,255,255,0.4)",
              marginBottom: 18,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Prismatic edge ring */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 22,
                border: "1px solid transparent",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.2), rgba(255,220,188,0.34)) border-box",
                WebkitMask:
                  "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
              }}
            />
            {/* Reflection sheets */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "64%",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.24) 45%, rgba(255,255,255,0) 100%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-24%",
                left: "-20%",
                width: "72%",
                height: "112%",
                transform: "rotate(-15deg)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.54) 0%, rgba(255,255,255,0) 72%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "-18%",
                right: "-24%",
                width: "64%",
                height: "102%",
                transform: "rotate(12deg)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0) 74%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "30%",
                left: "-8%",
                width: "42%",
                height: 1,
                transform: "rotate(-12deg)",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "43%",
                right: "-10%",
                width: "38%",
                height: 1,
                transform: "rotate(10deg)",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.88), transparent)",
                pointerEvents: "none",
              }}
            />
            {/* Inner glow orb */}
            <div
              style={{
                position: "absolute",
                top: "-40%",
                right: "-20%",
                width: "70%",
                height: "120%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(255,143,86,0.12) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-30%",
                left: "-10%",
                width: "50%",
                height: "80%",
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(234,88,12,0.06) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
            {/* Top accent line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 16,
                right: 16,
                height: 2,
                borderRadius: 2,
                background: "linear-gradient(90deg, transparent, rgba(234,88,12,0.35), transparent)",
              }}
            />
            {/* Header label */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, position: "relative", zIndex: 1 }}>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: "rgba(234,88,12,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={12} color="#EA580C" strokeWidth={2.2} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#C2410C", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                Zappy's read
              </span>
            </div>

            {/* Role + identity line */}
            <p style={{ fontSize: 17, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.04em", lineHeight: 1.2, margin: "0 0 8px", position: "relative", zIndex: 1 }}>
              {headline || (categoryLabels[0] ? categoryLabels[0] + " specialist" : "Professional")}
            </p>

            {/* Chips row — years + domain */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10, position: "relative", zIndex: 1 }}>
              {totalYears && (
                <span style={{ padding: "3px 9px", borderRadius: 6, background: "rgba(234,88,12,0.08)", border: "1px solid rgba(234,88,12,0.12)", fontSize: 11, fontWeight: 600, color: "#C2410C", letterSpacing: "-0.01em" }}>
                  {totalYears}
                </span>
              )}
              {skills.slice(0, 3).map((sk) => (
                <span key={sk} style={{ padding: "3px 9px", borderRadius: 6, background: "rgba(28,25,23,0.04)", border: "1px solid rgba(28,25,23,0.07)", fontSize: 11, fontWeight: 500, color: "#57534E", letterSpacing: "-0.01em" }}>
                  {sk}
                </span>
              ))}
            </div>

            {/* One-line insight */}
            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: "#78716C", letterSpacing: "-0.01em", margin: 0, position: "relative", zIndex: 1 }}>
              {aiSummary}
            </p>
          </motion.div>

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
                      </div>
                      {/* Job type row */}
                      {categoryLabels.length > 0 && (
                        <PrefItem
                          icon={<Briefcase size={13} strokeWidth={2} />}
                          label="Looking for"
                          value={allRoles.length > 0 ? allRoles.slice(0, 3).join(", ") : categoryLabels.join(", ")}
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
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px calc(14px + env(safe-area-inset-bottom))",
          borderTop: "1px solid rgba(28,25,23,0.06)",
          background: "rgba(253,251,248,0.92)",
          backdropFilter: "blur(16px)",
          display: "flex",
          gap: 12,
          zIndex: 10,
        }}
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onEditProfile}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 14,
            border: "1.5px solid rgba(28,25,23,0.1)",
            background: "transparent",
            color: "#78716C",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Edit profile
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onContinue}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 14,
            border: "none",
            background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 6px 24px rgba(234,88,12,0.3)",
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
  children,
}: {
  icon: React.ReactNode;
  title: string;
  delay?: number;
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
  totalYears: string,
  skills: string[],
  categories: string[],
  workSetups: string[],
): string {
  const domain = categories[0] || (headline ? headline.toLowerCase() : "their field");
  const expDesc = totalYears ? `${totalYears} of experience` : "a strong background";
  const skillNote = skills.length > 1 ? ` with hands-on depth in ${skills[0]} and ${skills[1]}` : "";
  const setupNote = workSetups.length > 0 ? ` — prefers ${workSetups[0].toLowerCase()}` : "";
  return `${firstName} brings ${expDesc} in ${domain.toLowerCase()}${skillNote}${setupNote}. A strong candidate for senior IC or lead roles.`;
}
