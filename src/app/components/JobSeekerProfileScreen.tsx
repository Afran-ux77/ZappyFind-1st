import {
  useState,
  useEffect,
  useRef,
  useCallback,
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
  Pencil,
} from "lucide-react";
import type { FullProfile } from "./WelcomeScreen";
import { DashboardHeader, SettingsBottomSheet } from "./DashboardPreviewScreen";
import { InterviewRecordingCompactCard } from "./InterviewTranscriptScroll";
import { DT, desktopHubStagger } from "../desktop/desktop-tokens";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Matches `ScanSection` top rule — shared for section dividers. */
const SCAN_SECTION_RULE_GRADIENT =
  "linear-gradient(90deg, transparent 0%, rgba(28,25,23,0.05) 18%, rgba(234,88,12,0.14) 50%, rgba(28,25,23,0.05) 82%, transparent 100%)";

const C = {
  textPrimary: "#1C1917",
  /** Secondary body — was stone-500, bumped for contrast on white. */
  textMuted: "#5C5651",
  /** Dates, captions, pref labels — was stone-400. */
  textSec: "#8A837D",
  avatarGrad: "#FFE7D6",
  avatarShadow: "none",
  avatarInitial: "#C2410C",
};

const prefRowIconInline: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  marginTop: 2,
};

const PROFILE_MILESTONES: Array<{ id: string; title: string; subtitle: string; dateLabel: string }> = [
  { id: "m15", title: "Applied to 12 jobs", subtitle: "Via Zappy Apply and partner postings", dateLabel: "Apr 17, 2026" },
  { id: "m14", title: "56 curated jobs suggested", subtitle: "Roles matched to your preferences", dateLabel: "Feb 3, 2026" },
  { id: "m13", title: "AI voice call completed", subtitle: "We captured your goals and context", dateLabel: "Jan 18, 2026" },
  { id: "m12", title: "Account created", subtitle: "Your ZappyFind profile went live", dateLabel: "Jan 8, 2026" },
  { id: "m11", title: "Saved 8 roles for later", subtitle: "Shortlist updated from recommendations", dateLabel: "Jan 5, 2026" },
  { id: "m10", title: "Profile strength reached 90%", subtitle: "Skills, experience, and preferences aligned", dateLabel: "Jan 4, 2026" },
  { id: "m9", title: "Resume parsed successfully", subtitle: "Experience and education auto-structured", dateLabel: "Jan 3, 2026" },
  { id: "m8", title: "Job preferences saved", subtitle: "Role types, locations, and work setup locked in", dateLabel: "Jan 2, 2026" },
  { id: "m7", title: "First 10 matches reviewed", subtitle: "You skimmed roles and tuned your filters", dateLabel: "Jan 1, 2026" },
  { id: "m6", title: "Salary expectations updated", subtitle: "Range refreshed for the new quarter", dateLabel: "Dec 28, 2025" },
  { id: "m5", title: "Intro tour completed", subtitle: "Walkthrough of ZappyFind job workspace", dateLabel: "Dec 22, 2025" },
  { id: "m4", title: "Email verified", subtitle: "Secure sign-in enabled for your account", dateLabel: "Dec 20, 2025" },
  { id: "m3", title: "Phone number added", subtitle: "Faster OTP and recruiter reach-outs", dateLabel: "Dec 19, 2025" },
  { id: "m2", title: "Location preferences set", subtitle: "Kochi plus remote-friendly roles prioritized", dateLabel: "Dec 18, 2025" },
  { id: "m1", title: "Welcome checklist finished", subtitle: "Basics complete before profile build", dateLabel: "Dec 17, 2025" },
];

const TIMELINE_INITIAL_VISIBLE = 3;
const TIMELINE_EXPAND_BATCH = 10;

function ProfileZappyCoach({
  workingWellItems,
  improveItems,
}: {
  workingWellItems: string[];
  improveItems: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: 0.08, ease: EASE }}
      style={{
        borderRadius: 18,
        padding: "13px 15px 13px 16px",
        background:
          "linear-gradient(155deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.14) 42%, rgba(255,245,238,0.18) 100%)",
        backdropFilter: "blur(26px) saturate(1.45)",
        WebkitBackdropFilter: "blur(26px) saturate(1.45)",
        border: "1px solid rgba(255,255,255,0.55)",
        boxShadow:
          "0 10px 40px rgba(234,88,12,0.09), 0 2px 14px rgba(234,88,12,0.05), inset 0 1px 0 rgba(255,255,255,0.72), inset 0 -1px 0 rgba(255,255,255,0.28)",
        marginBottom: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          borderRadius: 2,
          background: "linear-gradient(90deg, transparent 0%, rgba(234,88,12,0.28) 45%, rgba(251,146,60,0.2) 70%, transparent 100%)",
          opacity: 0.85,
        }}
        aria-hidden
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: -40,
          background: "radial-gradient(ellipse 70% 55% at 50% -20%, rgba(234,88,12,0.14) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, position: "relative", zIndex: 1 }}>
        <span style={{ display: "flex", flexShrink: 0, lineHeight: 0 }} aria-hidden>
          <Sparkles size={13} color="#EA580C" fill="#EA580C" stroke="#C2410C" strokeWidth={1.15} aria-hidden />
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#5C5651",
            letterSpacing: "0.09em",
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
          gap: 10,
          position: "relative",
          zIndex: 1,
        }}
      >
        <CoachBulletBlock subtle title="Working well" variant="positive" lines={workingWellItems} />
        <div aria-hidden style={{ height: 1, background: "rgba(28,25,23,0.06)" }} />
        <CoachBulletBlock subtle title="Could improve" variant="grow" lines={improveItems} />
      </div>
    </motion.div>
  );
}

function ProfileDetailsBody({
  isDesktop,
  ready,
  topExperiences,
  experienceBlurb,
  topEdu,
  educationFallback,
  skillsArr,
  desiredRole,
  workSetup,
  salaryExpectation,
}: {
  isDesktop: boolean;
  ready: boolean;
  topExperiences: Record<string, unknown>[];
  experienceBlurb: string;
  topEdu: { institution?: string; degree?: string; year?: string } | undefined;
  educationFallback: string;
  skillsArr: string[];
  desiredRole: string;
  workSetup: string;
  salaryExpectation: string;
}) {
  return (
    <AnimatePresence>
      {ready && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          {topExperiences.length > 0 ? (
            isDesktop ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: 24,
                  alignItems: "stretch",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <ScanSection
                    icon={<Briefcase size={14} color="#8A837D" strokeWidth={2} />}
                    title="Experience"
                    hideTopRule
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
                                  color: "#8A837D",
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
                                color: "#5C5651",
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
                                color: "#8A837D",
                                margin: 0,
                                lineHeight: 1.45,
                                fontStyle: "italic",
                              }}
                            >
                              {buildExpInsight(exp)}
                            </p>
                          ) : null}
                        </motion.div>
                      ))}
                    </div>
                  </ScanSection>
                </div>
                <div style={{ minWidth: 0 }}>
                  {topEdu ? (
                    <ScanSection
                      icon={<GraduationCap size={14} color="#8A837D" strokeWidth={2} />}
                      title="Education"
                      hideTopRule
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
                            <span style={{ fontSize: 11, fontWeight: 500, color: "#8A837D", flexShrink: 0, marginLeft: 8 }}>
                              {topEdu.year}
                            </span>
                          ) : null}
                        </div>
                        {topEdu.degree ? (
                          <p style={{ fontSize: 12, fontWeight: 500, color: "#5C5651", margin: 0, letterSpacing: "-0.01em" }}>
                            {topEdu.degree}
                          </p>
                        ) : null}
                      </div>
                    </ScanSection>
                  ) : (
                    <ScanSection
                      icon={<GraduationCap size={14} color="#8A837D" strokeWidth={2} />}
                      title="Education"
                      hideTopRule
                      delay={0.06}
                    >
                      <p style={{ fontSize: 13, color: "#5C5651", margin: 0, lineHeight: 1.5 }}>{educationFallback}</p>
                    </ScanSection>
                  )}
                </div>
              </div>
            ) : (
              <>
                <ScanSection
                  icon={<Briefcase size={14} color="#8A837D" strokeWidth={2} />}
                  title="Experience"
                  hideTopRule
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
                                color: "#8A837D",
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
                              color: "#5C5651",
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
                              color: "#8A837D",
                              margin: 0,
                              lineHeight: 1.45,
                              fontStyle: "italic",
                            }}
                          >
                            {buildExpInsight(exp)}
                          </p>
                        ) : null}
                      </motion.div>
                    ))}
                  </div>
                </ScanSection>
              </>
            )
          ) : (
            <ScanSection
              icon={<Briefcase size={14} color="#8A837D" strokeWidth={2} />}
              title="Experience"
              hideTopRule
              delay={0}
            >
              <p style={{ fontSize: 13, color: "#5C5651", margin: 0, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                {experienceBlurb}
              </p>
            </ScanSection>
          )}

          {!isDesktop && topExperiences.length > 0 ? (
            <div
              aria-hidden
              style={{
                height: 2,
                margin: "10px 0 18px",
                borderRadius: 2,
                background: SCAN_SECTION_RULE_GRADIENT,
                boxShadow: "0 1px 0 rgba(255,255,255,0.6)",
                flexShrink: 0,
              }}
            />
          ) : null}

          {!isDesktop
            ? topEdu ? (
                <ScanSection
                  icon={<GraduationCap size={14} color="#8A837D" strokeWidth={2} />}
                  title="Education"
                  hideTopRule
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
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#8A837D", flexShrink: 0, marginLeft: 8 }}>
                          {topEdu.year}
                        </span>
                      ) : null}
                    </div>
                    {topEdu.degree ? (
                      <p style={{ fontSize: 12, fontWeight: 500, color: "#5C5651", margin: 0, letterSpacing: "-0.01em" }}>
                        {topEdu.degree}
                      </p>
                    ) : null}
                  </div>
                </ScanSection>
              ) : (
                <ScanSection
                  icon={<GraduationCap size={14} color="#8A837D" strokeWidth={2} />}
                  title="Education"
                  hideTopRule
                  delay={0.06}
                >
                  <p style={{ fontSize: 13, color: "#5C5651", margin: 0, lineHeight: 1.5 }}>{educationFallback}</p>
                </ScanSection>
              )
            : null}

          {isDesktop && topExperiences.length === 0 ? (
            topEdu ? (
              <ScanSection
                icon={<GraduationCap size={14} color="#8A837D" strokeWidth={2} />}
                title="Education"
                hideTopRule
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
                      <span style={{ fontSize: 11, fontWeight: 500, color: "#8A837D", flexShrink: 0, marginLeft: 8 }}>
                        {topEdu.year}
                      </span>
                    ) : null}
                  </div>
                  {topEdu.degree ? (
                    <p style={{ fontSize: 12, fontWeight: 500, color: "#5C5651", margin: 0, letterSpacing: "-0.01em" }}>
                      {topEdu.degree}
                    </p>
                  ) : null}
                </div>
              </ScanSection>
            ) : (
              <ScanSection
                icon={<GraduationCap size={14} color="#8A837D" strokeWidth={2} />}
                title="Education"
                hideTopRule
                delay={0.06}
              >
                <p style={{ fontSize: 13, color: "#5C5651", margin: 0, lineHeight: 1.5 }}>{educationFallback}</p>
              </ScanSection>
            )
          ) : null}

          {skillsArr.length > 0 ? (
            <ScanSection icon={<Wrench size={14} color="#8A837D" strokeWidth={2} />} title="Skills" delay={0.12}>
              {isDesktop ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skillsArr.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 500,
                        color: "#44403C",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: "rgba(28,25,23,0.04)",
                        border: `1px solid ${DT.border}`,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#1C1917", margin: 0, lineHeight: 1.55, letterSpacing: "-0.01em" }}>
                  {skillsArr.join(" · ")}
                </p>
              )}
            </ScanSection>
          ) : null}

          <ScanSection icon={<Target size={14} color="#8A837D" strokeWidth={2} />} title="Preferences" delay={0.16}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isDesktop ? "repeat(3, minmax(0, 1fr))" : "1fr",
                gap: isDesktop ? 16 : 14,
              }}
            >
              <PrefRow icon={<Briefcase size={13} strokeWidth={2} />} label="Desired role" value={desiredRole} />
              <PrefRow icon={<Building2 size={13} strokeWidth={2} />} label="Work setup" value={workSetup} />
              <PrefRow icon={<IndianRupee size={13} strokeWidth={2} />} label="Salary" value={salaryExpectation} />
            </div>
          </ScanSection>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface JobSeekerProfileScreenProps {
  firstName: string;
  email: string;
  profile: FullProfile | null;
  onNavigateHome: () => void;
  onNavigateJobs: () => void;
  onNavigateProfile: () => void;
  onEditProfile: () => void;
  /** Settings → Account: sign out (clears session and returns to login). */
  onLogout?: () => void;
  /** After delete confirmation; prototype clears session like sign-out. */
  onDeleteAccount?: () => void;
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
  onLogout,
  onDeleteAccount,
  layout = "mobile",
}: JobSeekerProfileScreenProps) {
  const isDesktop = layout === "desktop";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null);
  const [timelineExpandSteps, setTimelineExpandSteps] = useState(0);
  const journeyScrollRef = useRef<HTMLDivElement>(null);
  const journeyScrollHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [journeyScrollbarVisible, setJourneyScrollbarVisible] = useState(false);
  const displayName = firstName || "Alex";

  const onJourneyScroll = useCallback(() => {
    setJourneyScrollbarVisible(true);
    if (journeyScrollHideTimerRef.current) clearTimeout(journeyScrollHideTimerRef.current);
    journeyScrollHideTimerRef.current = setTimeout(() => {
      setJourneyScrollbarVisible(false);
      journeyScrollHideTimerRef.current = null;
    }, 900);
  }, []);

  useEffect(() => {
    return () => {
      if (journeyScrollHideTimerRef.current) clearTimeout(journeyScrollHideTimerRef.current);
    };
  }, []);

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

  const latestExp = experiences[0] as Record<string, unknown> | undefined;
  const latestRole =
    latestExp && typeof latestExp.role === "string" ? latestExp.role.trim() : "";
  const latestCompany =
    latestExp && typeof latestExp.company === "string" ? latestExp.company.trim() : "";
  const latestJobDisplay =
    (latestRole && latestCompany && `${latestRole} at ${latestCompany}`) ||
    latestRole ||
    latestCompany ||
    "Add in edit";

  const educationFallback: string =
    (anyProfile.educationSummary as string) ||
    topEdu?.institution ||
    "Bachelor’s degree";

  const topDegree = topEdu?.degree?.trim() || "";
  const topInstitution = topEdu?.institution?.trim() || "";
  const highestQualificationDisplay =
    (topDegree && topInstitution && `${topDegree}, ${topInstitution}`) ||
    topDegree ||
    topInstitution ||
    educationFallback ||
    "Add in edit";

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
        width: "100%",
        minWidth: 0,
        minHeight: isDesktop ? "0" : "100dvh",
        ...(!isDesktop
          ? { height: "100dvh", maxHeight: "100dvh", overflow: "hidden" }
          : {
              flex: "1 1 0%",
              minHeight: 0,
              overflow: "visible",
            }),
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: isDesktop ? DT.pageBg : "#FDFBF8",
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
        style={
          isDesktop
            ? {
                flex: "0 0 auto",
                minWidth: 0,
                overflowX: "hidden",
                overflowY: "visible",
                position: "relative",
                zIndex: 1,
              }
            : {
                flex: "1 1 0%",
                minHeight: 0,
                minWidth: 0,
                overflowY: "auto",
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
                position: "relative",
                zIndex: 1,
              }
        }
      >
        {isDesktop ? (
          <div
            style={{
              maxWidth: 1180,
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              padding: "24px 32px 48px",
            }}
          >
            <motion.div
              variants={desktopHubStagger.container}
              initial="hidden"
              animate="show"
              style={{ display: "flex", flexDirection: "column", gap: 0 }}
            >
            <motion.div
              variants={desktopHubStagger.item}
              style={{
                marginBottom: 28,
                borderRadius: 20,
                border: `1px solid ${DT.border}`,
                background: "linear-gradient(165deg, #FFFFFF 0%, #FAF8F5 55%, rgba(255,247,242,0.5) 100%)",
                boxShadow: "0 4px 24px rgba(28,25,23,0.06), 0 1px 0 rgba(255,255,255,0.9) inset",
                padding: "20px 22px 18px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "linear-gradient(90deg, rgba(234,88,12,0.12) 0%, rgba(234,88,12,0.45) 45%, rgba(251,146,60,0.15) 100%)",
                  opacity: 0.85,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 20,
                  flexWrap: "wrap",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 24, minWidth: 0, flex: "1 1 260px" }}>
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
                        width: 64,
                        height: 64,
                        padding: 0,
                        border: "none",
                        borderRadius: 18,
                        cursor: "pointer",
                        flexShrink: 0,
                        overflow: "hidden",
                        boxShadow: "0 2px 12px rgba(28,25,23,0.08)",
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
                            fontSize: 26,
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
                        gap: 4,
                        padding: "3px 9px",
                        borderRadius: 999,
                        border: "none",
                        background: "rgba(28,25,23,0.05)",
                        color: DT.textMuted,
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      <Camera size={12} strokeWidth={2} aria-hidden />
                      {avatarObjectUrl ? "Change" : "Photo"}
                    </button>
                  </div>
                  <div style={{ minWidth: 0, flex: 1, paddingTop: 2 }}>
                    <h1
                      style={{
                        fontSize: 24,
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
                    <div
                      style={{
                        marginTop: 12,
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        minWidth: 0,
                      }}
                    >
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                        <HeaderMetaChip
                          icon={<Briefcase size={13} strokeWidth={2} />}
                          label="Latest role"
                          value={latestJobDisplay}
                        />
                        <HeaderMetaChip
                          icon={<GraduationCap size={13} strokeWidth={2} />}
                          label="Top qualification"
                          value={highestQualificationDisplay}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "nowrap",
                          alignItems: "flex-start",
                          gap: 20,
                          width: "100%",
                          minWidth: 0,
                          overflowX: "auto",
                          overscrollBehaviorX: "contain",
                          WebkitOverflowScrolling: "touch",
                          paddingBottom: 2,
                        }}
                      >
                        <HeaderContactChip kind="Email" icon={<Mail size={14} strokeWidth={2} />} value={emailDisplay} />
                        <HeaderContactChip kind="Phone" icon={<Phone size={14} strokeWidth={2} />} value={phoneDisplay} />
                        <HeaderContactChip kind="Location" icon={<MapPin size={14} strokeWidth={2} />} value={locationDisplay} />
                      </div>
                    </div>
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={onEditProfile}
                  aria-label="Edit profile"
                  style={{
                    flexShrink: 0,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    minWidth: 132,
                    height: 40,
                    padding: "0 16px 0 14px",
                    borderRadius: 11,
                    border: "1px solid rgba(234, 88, 12, 0.42)",
                    background: "transparent",
                    color: DT.accent,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    boxShadow: "none",
                  }}
                >
                  <Pencil size={15} strokeWidth={2} color="currentColor" aria-hidden />
                  Edit profile
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              variants={desktopHubStagger.item}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) minmax(260px, 300px)",
                gap: 32,
                alignItems: "start",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <ProfileZappyCoach workingWellItems={workingWellItems} improveItems={improveItems} />
                <div style={{ marginTop: 16 }}>
                  <InterviewRecordingCompactCard />
                </div>
                <ProfileDetailsBody
                  isDesktop
                  ready={ready}
                  topExperiences={topExperiences}
                  experienceBlurb={experienceBlurb}
                  topEdu={topEdu}
                  educationFallback={educationFallback}
                  skillsArr={skillsArr}
                  desiredRole={desiredRole}
                  workSetup={workSetup}
                  salaryExpectation={salaryExpectation}
                />
              </div>
              <aside
                style={{
                  position: "sticky",
                  top: 16,
                  alignSelf: "start",
                  width: "100%",
                  maxWidth: 300,
                  minHeight: 0,
                }}
              >
                <div
                  ref={journeyScrollRef}
                  onScroll={onJourneyScroll}
                  className={`journey-scroll${journeyScrollbarVisible ? " journey-scroll--scrollbar-visible" : ""}`}
                  style={{
                    minHeight: 0,
                    width: "100%",
                    maxHeight: "min(560px, calc(100dvh - 280px))",
                  }}
                >
                  <ProfileMilestoneTimeline
                    milestones={PROFILE_MILESTONES}
                    initialVisible={TIMELINE_INITIAL_VISIBLE}
                    expandBatchSize={TIMELINE_EXPAND_BATCH}
                    expandSteps={timelineExpandSteps}
                    onExpandMore={() => setTimelineExpandSteps((s) => s + 1)}
                    onCollapse={() => setTimelineExpandSteps(0)}
                  />
                </div>
              </aside>
            </motion.div>
            </motion.div>
          </div>
        ) : (
          <div
            style={{
              padding: "28px 20px calc(32px + env(safe-area-inset-bottom))",
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
                color: DT.accent,
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

          <ProfileZappyCoach workingWellItems={workingWellItems} improveItems={improveItems} />

          <div style={{ marginTop: 16 }}>
            <InterviewRecordingCompactCard />
          </div>

          <ProfileMilestoneTimeline
            milestones={PROFILE_MILESTONES}
            initialVisible={TIMELINE_INITIAL_VISIBLE}
            expandBatchSize={TIMELINE_EXPAND_BATCH}
            expandSteps={timelineExpandSteps}
            onExpandMore={() => setTimelineExpandSteps((s) => s + 1)}
            onCollapse={() => setTimelineExpandSteps(0)}
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
                    icon={<Briefcase size={14} color="#8A837D" strokeWidth={2} />}
                    title="Experience"
                    hideTopRule
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
                                  color: "#8A837D",
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
                                color: "#5C5651",
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
                                color: "#8A837D",
                                margin: 0,
                                lineHeight: 1.45,
                                fontStyle: "italic",
                              }}
                            >
                              {buildExpInsight(exp)}
                            </p>
                          ) : null}
                        </motion.div>
                      ))}
                    </div>
                  </ScanSection>
                ) : (
                  <ScanSection
                    icon={<Briefcase size={14} color="#8A837D" strokeWidth={2} />}
                    title="Experience"
                    hideTopRule
                    delay={0}
                  >
                    <p style={{ fontSize: 13, color: "#5C5651", margin: 0, lineHeight: 1.5, letterSpacing: "-0.01em" }}>
                      {experienceBlurb}
                    </p>
                  </ScanSection>
                )}

                {topExperiences.length > 0 ? (
                  <div
                    aria-hidden
                    style={{
                      height: 2,
                      margin: "10px 0 18px",
                      borderRadius: 2,
                      background: SCAN_SECTION_RULE_GRADIENT,
                      boxShadow: "0 1px 0 rgba(255,255,255,0.6)",
                      flexShrink: 0,
                    }}
                  />
                ) : null}

                {topEdu ? (
                  <ScanSection
                    icon={<GraduationCap size={14} color="#8A837D" strokeWidth={2} />}
                    title="Education"
                    hideTopRule
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
                          <span style={{ fontSize: 11, fontWeight: 500, color: "#8A837D", flexShrink: 0, marginLeft: 8 }}>
                            {topEdu.year}
                          </span>
                        ) : null}
                      </div>
                      {topEdu.degree ? (
                        <p style={{ fontSize: 12, fontWeight: 500, color: "#5C5651", margin: 0, letterSpacing: "-0.01em" }}>
                          {topEdu.degree}
                        </p>
                      ) : null}
                    </div>
                  </ScanSection>
                ) : (
                  <ScanSection
                    icon={<GraduationCap size={14} color="#8A837D" strokeWidth={2} />}
                    title="Education"
                    hideTopRule
                    delay={0.06}
                  >
                    <p style={{ fontSize: 13, color: "#5C5651", margin: 0, lineHeight: 1.5 }}>{educationFallback}</p>
                  </ScanSection>
                )}

                {skillsArr.length > 0 ? (
                  <ScanSection icon={<Wrench size={14} color="#8A837D" strokeWidth={2} />} title="Skills" delay={0.12}>
                    <p style={{ fontSize: 13, color: "#1C1917", margin: 0, lineHeight: 1.55, letterSpacing: "-0.01em" }}>
                      {skillsArr.join(" · ")}
                    </p>
                  </ScanSection>
                ) : null}

                <ScanSection
                  icon={<Target size={14} color="#8A837D" strokeWidth={2} />}
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
        )}
      </div>

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

function CoachBulletBlock({
  title,
  lines,
  variant,
  subtle = false,
}: {
  title: string;
  lines: string[];
  variant: "positive" | "grow";
  subtle?: boolean;
}) {
  const labelColor = subtle
    ? variant === "positive"
      ? "#047857"
      : "#A16207"
    : variant === "positive"
      ? "#047857"
      : "#B45309";
  const dotBg = subtle
    ? variant === "positive"
      ? "#047857"
      : "#C2410C"
    : variant === "positive"
      ? "#059669"
      : "#B45309";
  const lineColor = subtle ? "#6B6560" : "#57534E";
  return (
    <div>
      <div
        style={{
          fontSize: subtle ? 10 : 10.5,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: labelColor,
          marginBottom: subtle ? 6 : 8,
        }}
      >
        {title}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {lines.map((line, i) => (
          <li
            key={i}
            style={{
              fontSize: subtle ? 12.25 : 12.5,
              lineHeight: 1.52,
              color: lineColor,
              marginTop: i > 0 ? (subtle ? 6 : 8) : 0,
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
  expandBatchSize,
  expandSteps,
  onExpandMore,
  onCollapse,
}: {
  milestones: Array<{ id: string; title: string; subtitle: string; dateLabel: string }>;
  initialVisible: number;
  expandBatchSize: number;
  expandSteps: number;
  onExpandMore: () => void;
  onCollapse: () => void;
}) {
  const baseVisible = Math.min(initialVisible, milestones.length);
  const extraVisible = expandSteps * expandBatchSize;
  const visibleCount = Math.min(baseVisible + extraVisible, milestones.length);
  const shown = milestones.slice(0, visibleCount);
  const canExpandMore = visibleCount < milestones.length;
  const isCollapsible = expandSteps > 0;
  const nextReveal = Math.min(expandBatchSize, milestones.length - visibleCount);

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
            color: "#5C5651",
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
                color: "#8A837D",
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
                color: "#5C5651",
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
      {canExpandMore ? (
        <button
          type="button"
          onClick={onExpandMore}
          aria-expanded={expandSteps > 0}
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
            color: DT.accent,
            letterSpacing: "-0.02em",
          }}
        >
          Show {nextReveal} more {nextReveal === 1 ? "event" : "events"}
          <ChevronDown size={16} strokeWidth={2.2} aria-hidden />
        </button>
      ) : isCollapsible ? (
        <button
          type="button"
          onClick={onCollapse}
          aria-expanded
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
            color: DT.accent,
            letterSpacing: "-0.02em",
          }}
        >
          Show less
          <ChevronDown size={16} strokeWidth={2.2} style={{ transform: "rotate(180deg)" }} aria-hidden />
        </button>
      ) : null}
    </motion.div>
  );
}

function ScanSection({
  icon,
  title,
  delay = 0,
  hideTopRule = false,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  delay?: number;
  /** When true, omit the gradient rule above the section title (used for Experience & Education). */
  hideTopRule?: boolean;
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
      {!hideTopRule ? (
        <div
          aria-hidden
          style={{
            height: 2,
            marginBottom: 22,
            borderRadius: 2,
            background: SCAN_SECTION_RULE_GRADIENT,
            boxShadow: "0 1px 0 rgba(255,255,255,0.6)",
          }}
        />
      ) : null}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ display: "flex", opacity: 0.88 }}>{icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#5C5651",
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

function HeaderContactChip({
  icon,
  value,
  kind,
}: {
  icon: ReactNode;
  value: string;
  kind: "Email" | "Phone" | "Location";
}) {
  const unset = !value || value === "—";
  const a11y = unset ? `${kind} not set, add in profile edit` : `${kind}: ${value}`;
  return (
    <span
      role="group"
      aria-label={a11y}
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: 8,
        flexShrink: 0,
        padding: "3px 0",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: 999,
          background: unset ? "rgba(28,25,23,0.06)" : DT.accentSoft,
          color: unset ? DT.textSubtle : DT.accent,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0, maxWidth: "100%" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: DT.textSubtle,
            lineHeight: 1.25,
          }}
        >
          {kind}
        </span>
        <span
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: unset ? DT.textSubtle : DT.text,
            lineHeight: 1.3,
            minWidth: 0,
            whiteSpace: "normal",
            wordBreak: "break-word",
          }}
        >
          {unset ? "Add in edit" : value}
        </span>
      </span>
    </span>
  );
}

function HeaderMetaChip({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: "Latest role" | "Top qualification";
  value: string;
}) {
  const unset = !value || value === "—" || value === "Add in edit";
  const a11y = unset ? `${label} not set, add in profile edit` : `${label}: ${value}`;
  return (
    <span
      role="group"
      aria-label={a11y}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        maxWidth: "min(100%, 340px)",
        padding: "6px 11px 6px 9px",
        borderRadius: 999,
        border: `1px solid ${DT.border}`,
        background: "rgba(255,255,255,0.7)",
      }}
    >
      <span style={{ display: "flex", color: unset ? DT.textSubtle : DT.accent, flexShrink: 0, opacity: unset ? 0.6 : 1 }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: 12,
          color: DT.textSubtle,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          width: 1,
          height: 12,
          background: DT.border,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: unset ? DT.textSubtle : DT.text,
          lineHeight: 1.3,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {unset ? "Add in edit" : value}
      </span>
    </span>
  );
}

function ContactLine({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ display: "flex", color: "#8A837D", flexShrink: 0, marginTop: 1 }}>{icon}</span>
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
        color: "#8A837D",
        strokeWidth: 1.75,
      })
    : icon;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
      <div style={prefRowIconInline} aria-hidden>
        {iconMuted}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 11, color: "#8A837D", margin: 0, fontWeight: 500 }}>{label}</p>
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
