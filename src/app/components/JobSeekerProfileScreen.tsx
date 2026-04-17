import {
  useState,
  useEffect,
  useRef,
  cloneElement,
  isValidElement,
  type ChangeEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Briefcase,
  GraduationCap,
  Wrench,
  Mail,
  Phone,
  MapPin,
  Target,
  Building2,
  IndianRupee,
  Camera,
  ChevronDown,
} from "lucide-react";
import type { FullProfile } from "./WelcomeScreen";
import { DashboardHeader, SettingsBottomSheet } from "./DashboardPreviewScreen";

const EASE = [0.16, 1, 0.3, 1] as const;

const C = {
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSec: "#A8A29E",
  avatarGrad: "linear-gradient(145deg, #FFF4ED 0%, #FFE8D9 40%, #FFDCC8 100%)",
  avatarShadow: "0 6px 18px rgba(255, 140, 100, 0.22)",
  avatarInitial: "#B45309",
};

const prefRowIconInline: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginTop: 2,
};

const PROFILE_MILESTONES: Array<{ id: string; title: string; subtitle: string; dateLabel: string }> = [
  { id: "m1", title: "Account created", subtitle: "Your ZappyFind profile went live", dateLabel: "Jan 8, 2026" },
  { id: "m2", title: "AI voice call completed", subtitle: "We captured your goals and context", dateLabel: "Jan 18, 2026" },
  { id: "m3", title: "56 curated jobs suggested", subtitle: "Roles matched to your preferences", dateLabel: "Feb 3, 2026" },
  { id: "m4", title: "Applied to 12 jobs", subtitle: "Via Zappy Apply and partner postings", dateLabel: "Apr 17, 2026" },
];

const TIMELINE_INITIAL_VISIBLE = 2;

interface JobSeekerProfileScreenProps {
  firstName: string;
  email: string;
  profile: FullProfile | null;
  onNavigateHome: () => void;
  onNavigateJobs: () => void;
  onNavigateProfile: () => void;
  onEditProfile: () => void;
  layout?: "mobile" | "desktop";
}

export function JobSeekerProfileScreen({
  firstName,
  email,
  profile,
  onNavigateHome,
  onNavigateJobs,
  onNavigateProfile,
  onEditProfile,
  layout = "mobile",
}: JobSeekerProfileScreenProps) {
  const isDesktop = layout === "desktop";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null);
  const [timelineExpanded, setTimelineExpanded] = useState(false);
  const displayName = firstName || "Alex";

  const anyProfile = (profile || {}) as Record<string, unknown>;
  const name: string =
    (typeof anyProfile.name === "string" && anyProfile.name) ||
    (typeof anyProfile.fullName === "string" && (anyProfile.fullName as string)) ||
    `${displayName} Sajeeb`;

  const emailDisplay =
    (email && email.trim()) ||
    (typeof anyProfile.email === "string" && anyProfile.email) ||
    "—";

  const phoneDisplay =
    (typeof anyProfile.phone === "string" && anyProfile.phone.trim()) ||
    "—";

  const locationDisplay =
    (typeof anyProfile.location === "string" && anyProfile.location.trim()) ||
    "—";

  const currentRole: string =
    (anyProfile.currentRole as string) ||
    (anyProfile.headline as string) ||
    "Senior product designer";

  const years: string =
    (anyProfile.yearsOfExperience as string) ||
    (anyProfile.totalExperience as string) ||
    "4+ years experience";

  const desiredRole: string =
    (anyProfile.preferredRole as string) || "Product design roles";

  const workSetup: string = (anyProfile.workSetup as string) || "Hybrid or remote";

  const salaryExpectation: string =
    (anyProfile.salaryRange as string) || "₹20L – ₹35L (flexible)";

  const skillsArr =
    Array.isArray(anyProfile.skills) && (anyProfile.skills as string[]).length
      ? (anyProfile.skills as string[])
      : [];

  const experiences = Array.isArray(anyProfile.experiences)
    ? (anyProfile.experiences as Record<string, unknown>[])
    : [];
  const topExperiences = experiences.slice(0, 2);

  const educationArr = Array.isArray(anyProfile.education)
    ? (anyProfile.education as { institution?: string; degree?: string; year?: string }[])
    : [];
  const topEdu = educationArr[0];

  const educationFallback: string =
    (anyProfile.educationSummary as string) ||
    topEdu?.institution ||
    "Bachelor’s degree";

  const experienceBlurb: string =
    (experiences[0] as { description?: string } | undefined)?.description ||
    "Experience across product teams, shipping polished interfaces and scalable design systems.";

  const workingWellItems: string[] = [
    (typeof anyProfile.summary === "string" && String(anyProfile.summary).trim())
      ? String(anyProfile.summary).trim()
      : `Your profile reads clearly as a ${currentRole.toLowerCase()} with ${years.toLowerCase()} and solid communication habits.`,
    `Strong alignment with ${desiredRole.toLowerCase()} and ${workSetup.toLowerCase()} teams you’re targeting.`,
  ];

  const improveItems: string[] = [
    `Add one more shipped case study so senior-level conversations have sharper proof points.`,
    `Refresh salary and location occasionally so matches stay in your comfort zone.`,
  ];

  const firstInitial = name.trim().charAt(0).toUpperCase() || "A";

  const openPhotoPicker = () => fileInputRef.current?.click();

  const onAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      e.target.value = "";
      return;
    }
    setAvatarObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    e.target.value = "";
  };

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 280);
    return () => clearTimeout(t);
  }, []);

  useEffect(
    () => () => {
      if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);
    },
    [avatarObjectUrl],
  );

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
      {!isDesktop && (
        <DashboardHeader
          displayName={displayName}
          onAvatarClick={undefined}
          isLowPerformer={false}
          currentPage="profile"
          onNavigateHome={onNavigateHome}
          onNavigateJobs={onNavigateJobs}
          onNavigateProfile={onNavigateProfile}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overscrollBehavior: "contain",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: "28px 20px calc(32px + env(safe-area-inset-bottom))",
            maxWidth: isDesktop ? 560 : undefined,
            marginLeft: isDesktop ? "auto" : undefined,
            marginRight: isDesktop ? "auto" : undefined,
            width: "100%",
          }}
        >
          {/* Identity + contact — flat, no card */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.02, ease: EASE }}
            style={{ marginBottom: 24 }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  flexShrink: 0,
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onAvatarFileChange}
                />
                <button
                  type="button"
                  onClick={openPhotoPicker}
                  aria-label="Upload profile photo from your device"
                  style={{
                    width: 52,
                    height: 52,
                    padding: 0,
                    border: "none",
                    borderRadius: 16,
                    cursor: "pointer",
                    flexShrink: 0,
                    overflow: "hidden",
                    boxShadow: C.avatarShadow,
                    background: avatarObjectUrl ? "transparent" : C.avatarGrad,
                    backgroundImage: avatarObjectUrl ? `url(${avatarObjectUrl})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {!avatarObjectUrl ? (
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: C.avatarInitial,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {firstInitial}
                    </span>
                  ) : null}
                </button>
                <button
                  type="button"
                  onClick={openPhotoPicker}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 8px",
                    borderRadius: 999,
                    border: "none",
                    background: "rgba(28,25,23,0.04)",
                    color: C.textMuted,
                    fontSize: 11.5,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <Camera size={13} strokeWidth={2} aria-hidden />
                  {avatarObjectUrl ? "Change photo" : "Add photo"}
                </button>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h1
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: C.textPrimary,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.15,
                    margin: 0,
                    minWidth: 0,
                  }}
                >
                  {name}
                </h1>
                {currentRole ? (
                  <p
                    style={{
                      fontSize: 14,
                      color: C.textMuted,
                      margin: "6px 0 0",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.35,
                      fontWeight: 500,
                    }}
                  >
                    {currentRole}
                  </p>
                ) : null}
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                flexDirection: "column",
                gap: 11,
              }}
            >
              <ContactLine icon={<Mail size={15} strokeWidth={2} />} text={emailDisplay} />
              <ContactLine icon={<Phone size={15} strokeWidth={2} />} text={phoneDisplay} />
              <ContactLine icon={<MapPin size={15} strokeWidth={2} />} text={locationDisplay} />
            </div>

            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={onEditProfile}
              aria-label="Edit profile"
              style={{
                width: "100%",
                marginTop: 18,
                height: 50,
                borderRadius: 14,
                border: "1px solid rgba(28, 25, 23, 0.12)",
                background: "#FFFFFF",
                color: C.textMuted,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 1px 2px rgba(28,25,23,0.06)",
              }}
            >
              Edit profile
            </motion.button>
          </motion.div>

          {/* Zappy's read — same glass treatment as ProfileSummaryScreen */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
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
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#C2410C",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Zappy&apos;s read
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                position: "relative",
                zIndex: 1,
              }}
            >
              <CoachBulletBlock title="Working well" variant="positive" lines={workingWellItems} />
              <div
                aria-hidden
                style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(28,25,23,0.07), transparent)" }}
              />
              <CoachBulletBlock title="Could improve" variant="grow" lines={improveItems} />
            </div>
          </motion.div>

          <ProfileMilestoneTimeline
            milestones={PROFILE_MILESTONES}
            initialVisible={TIMELINE_INITIAL_VISIBLE}
            expanded={timelineExpanded}
            onToggleExpand={() => setTimelineExpanded((v) => !v)}
          />

          <AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ display: "flex", flexDirection: "column", gap: 0 }}
              >
                {topExperiences.length > 0 ? (
                  <ScanSection
                    icon={<Briefcase size={14} color="#A8A29E" strokeWidth={2} />}
                    title="Experience"
                    delay={0}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {topExperiences.map((exp, i) => (
                        <motion.div
                          key={String(exp.id ?? `exp-${i}`)}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.35, delay: 0.2 + i * 0.08, ease: EASE }}
                        >
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
                                fontWeight: 700,
                                color: "#1C1917",
                                letterSpacing: "-0.02em",
                              }}
                            >
                              {(exp.company as string) || "Company"}
                            </span>
                            {exp.duration ? (
                              <span
                                style={{
                                  fontSize: 11,
                                  fontWeight: 500,
                                  color: "#A8A29E",
                                  flexShrink: 0,
                                  marginLeft: 8,
                                }}
                              >
                                {String(exp.duration)}
                              </span>
                            ) : null}
                          </div>
                          {exp.role ? (
                            <p
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#78716C",
                                margin: "0 0 4px",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {String(exp.role)}
                            </p>
                          ) : null}
                          {buildExpInsight(exp) ? (
                            <p
                              style={{
                                fontSize: 11,
                                color: "#A8A29E",
                                margin: 0,
                                lineHeight: 1.45,
                                fontStyle: "italic",
                              }}
                            >
                              {buildExpInsight(exp)}
                            </p>
                          ) : null}
                          {i < topExperiences.length - 1 ? (
                            <div style={{ height: 1, background: "rgba(28,25,23,0.05)", marginTop: 12 }} />
                          ) : null}
                        </motion.div>
                      ))}
                    </div>
                  </ScanSection>
                ) : (
                  <ScanSection
                    icon={<Briefcase size={14} color="#A8A29E" strokeWidth={2} />}
                    title="Experience"
                    delay={0}
                  >
                    <p style={{ fontSize: 13, color: "#78716C", margin: 0, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                      {experienceBlurb}
                    </p>
                  </ScanSection>
                )}

                {topEdu ? (
                  <ScanSection
                    icon={<GraduationCap size={14} color="#A8A29E" strokeWidth={2} />}
                    title="Education"
                    delay={0.06}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 3,
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1C1917", letterSpacing: "-0.02em" }}>
                          {topEdu.institution || "Institution"}
                        </span>
                        {topEdu.year ? (
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#A8A29E", flexShrink: 0, marginLeft: 8 }}>
                            {topEdu.year}
                          </span>
                        ) : null}
                      </div>
                      {topEdu.degree ? (
                        <p style={{ fontSize: 12, fontWeight: 500, color: "#78716C", margin: 0, letterSpacing: "-0.01em" }}>
                          {topEdu.degree}
                        </p>
                      ) : null}
                    </div>
                  </ScanSection>
                ) : (
                  <ScanSection
                    icon={<GraduationCap size={14} color="#A8A29E" strokeWidth={2} />}
                    title="Education"
                    delay={0.06}
                  >
                    <p style={{ fontSize: 13, color: "#78716C", margin: 0, lineHeight: 1.5 }}>{educationFallback}</p>
                  </ScanSection>
                )}

                {skillsArr.length > 0 ? (
                  <ScanSection icon={<Wrench size={14} color="#A8A29E" strokeWidth={2} />} title="Skills" delay={0.12}>
                    <p style={{ fontSize: 13, color: "#1C1917", margin: 0, lineHeight: 1.55, letterSpacing: "-0.01em" }}>
                      {skillsArr.join(" · ")}
                    </p>
                  </ScanSection>
                ) : null}

                <ScanSection
                  icon={<Target size={14} color="#A8A29E" strokeWidth={2} />}
                  title="Preferences"
                  delay={0.16}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <PrefRow icon={<Briefcase size={13} strokeWidth={2} />} label="Desired role" value={desiredRole} />
                    <PrefRow icon={<Building2 size={13} strokeWidth={2} />} label="Work setup" value={workSetup} />
                    <PrefRow icon={<IndianRupee size={13} strokeWidth={2} />} label="Salary" value={salaryExpectation} />
                  </div>
                </ScanSection>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SettingsBottomSheet
        open={settingsOpen}
        displayName={displayName}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

function CoachBulletBlock({
  title,
  lines,
  variant,
}: {
  title: string;
  lines: string[];
  variant: "positive" | "grow";
}) {
  const labelColor = variant === "positive" ? "#047857" : "#B45309";
  const dotBg = variant === "positive" ? "rgba(5,150,105,0.4)" : "rgba(217,119,6,0.4)";
  return (
    <div>
      <div
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: labelColor,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {lines.map((line, i) => (
          <li
            key={i}
            style={{
              fontSize: 12.5,
              lineHeight: 1.52,
              color: "#78716C",
              marginTop: i > 0 ? 8 : 0,
              paddingLeft: 15,
              position: "relative",
              letterSpacing: "-0.01em",
            }}
          >
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                top: "0.58em",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: dotBg,
              }}
            />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfileMilestoneTimeline({
  milestones,
  initialVisible,
  expanded,
  onToggleExpand,
}: {
  milestones: Array<{ id: string; title: string; subtitle: string; dateLabel: string }>;
  initialVisible: number;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const shown = expanded ? milestones : milestones.slice(0, Math.min(initialVisible, milestones.length));
  const hiddenCount = Math.max(0, milestones.length - initialVisible);
  const canExpand = milestones.length > initialVisible;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.14, ease: EASE }}
      style={{ marginBottom: 20 }}
    >
      <div style={{ marginBottom: 14 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#78716C",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
          }}
        >
          Your journey
        </span>
      </div>
      <div style={{ position: "relative", paddingLeft: 20 }}>
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: 6,
            top: 10,
            bottom: 10,
            width: 2,
            borderRadius: 2,
            background: "linear-gradient(180deg, rgba(234,88,12,0.45) 0%, rgba(28,25,23,0.1) 100%)",
          }}
        />
        {shown.map((m, i) => (
          <div
            key={m.id}
            style={{
              position: "relative",
              paddingBottom: i < shown.length - 1 ? 14 : 0,
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: -14,
                top: 5,
                width: 11,
                height: 11,
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "2px solid rgba(234,88,12,0.5)",
                boxShadow: "0 0 0 3px rgba(253,251,248,1)",
              }}
            />
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#A8A29E",
                letterSpacing: "-0.01em",
                marginBottom: 3,
              }}
            >
              {m.dateLabel}
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#1C1917",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
              }}
            >
              {m.title}
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#78716C",
                margin: "4px 0 0",
                lineHeight: 1.4,
                letterSpacing: "-0.01em",
              }}
            >
              {m.subtitle}
            </p>
          </div>
        ))}
      </div>
      {canExpand ? (
        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          style={{
            marginTop: 4,
            padding: "8px 4px",
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontFamily: "Inter, sans-serif",
            fontSize: 12.5,
            fontWeight: 600,
            color: "#EA580C",
            letterSpacing: "-0.02em",
          }}
        >
          {expanded ? (
            <>
              Show less
              <ChevronDown size={16} strokeWidth={2.2} style={{ transform: "rotate(180deg)" }} aria-hidden />
            </>
          ) : (
            <>
              Show {hiddenCount} more {hiddenCount === 1 ? "event" : "events"}
              <ChevronDown size={16} strokeWidth={2.2} aria-hidden />
            </>
          )}
        </button>
      ) : null}
    </motion.div>
  );
}

function ScanSection({
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
    <motion.section
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.12 + delay, ease: EASE }}
      style={{
        marginTop: 26,
        paddingBottom: 10,
      }}
    >
      {/* Soft gradient rule — clearer separation than a flat stroke, stays light */}
      <div
        aria-hidden
        style={{
          height: 2,
          marginBottom: 22,
          borderRadius: 2,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(28,25,23,0.05) 18%, rgba(234,88,12,0.14) 50%, rgba(28,25,23,0.05) 82%, transparent 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.6)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ display: "flex", opacity: 0.88 }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#78716C",
            letterSpacing: "0.09em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </motion.section>
  );
}

function ContactLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ display: "flex", color: "#A8A29E", flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span
        style={{
          fontSize: 14,
          color: "#1C1917",
          letterSpacing: "-0.01em",
          lineHeight: 1.45,
          wordBreak: "break-word",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function PrefRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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
        <p
          style={{
            fontSize: 13,
            color: "#1C1917",
            margin: "2px 0 0",
            letterSpacing: "-0.01em",
            fontWeight: 600,
            wordBreak: "break-word",
          }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function buildExpInsight(exp: Record<string, unknown>): string {
  const role = String(exp.role || "").toLowerCase();
  const company = String(exp.company || "");
  if (!role && !company) return "";
  if (role.includes("senior") || role.includes("lead") || role.includes("principal"))
    return "Senior-level impact — strong signal for leadership readiness.";
  if (role.includes("product designer") || role.includes("ux"))
    return "Product design track record across user-facing surfaces.";
  if (role.includes("engineer") || role.includes("developer") || role.includes("swe"))
    return "Hands-on engineering at scale — solid technical depth.";
  if (role.includes("manager") || role.includes("pm"))
    return "Cross-functional ownership — built and shipped end-to-end.";
  if (role.includes("analyst") || role.includes("data"))
    return "Data-driven background — analytical thinking and structured work.";
  return `Relevant industry experience at ${company}.`;
}
