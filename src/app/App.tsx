import { useState, useEffect, useRef, useMemo } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mic, MessageCircle, Send, Sparkles, ArrowRight, Users, CheckCircle2, Shield } from "lucide-react";
import { LoginScreen } from "./components/LoginScreen";
import { OTPScreen } from "./components/OTPScreen";
import { WelcomeScreen, type FullProfile, type JobPreferences, normalizeToFullProfile } from "./components/WelcomeScreen";
import { ProfileReviewScreen } from "./components/ProfileReviewScreen";
import { OnboardingProfileScreen } from "./components/OnboardingProfileScreen";
import { JobPreferencesScreen } from "./components/JobPreferencesScreen";
import { ProfileSummaryScreen } from "./components/ProfileSummaryScreen";
import { VoiceCallScreen } from "./components/VoiceCallScreen";
import { DashboardPreviewScreen } from "./components/DashboardPreviewScreen";
import { JobReviewScreen } from "./components/JobReviewScreen";
import { JobSeekerProfileScreen } from "./components/JobSeekerProfileScreen";
import { MatchCelebrationScreen } from "./components/MatchCelebrationScreen";

type Screen =
  | "login"
  | "otp"
  | "welcome"
  | "profileReview"
  | "profileEdit"
  | "jobPreferences"
  | "profileSummary"
  | "settingUpProfile"
  | "matchCelebration"
  | "success"
  | "dashboardPreview"
  | "voiceCall"
  | "jobReview"
  | "jobSeekerProfile";

const slide = {
  fromRight:  { x: "100%",  opacity: 0 },
  fromLeft:   { x: "-100%", opacity: 0 },
  center:     { x: 0,       opacity: 1 },
  toLeft:     { x: "-60%",  opacity: 0, scale: 0.96 },
  toRight:    { x: "100%",  opacity: 0 },
};
const SPRING = { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const };

export default function App() {
  const [screen,        setScreen]        = useState<Screen>("login");
  const [direction,     setDirection]     = useState<"forward" | "back">("forward");
  const [email,         setEmail]         = useState("");
  /** Full name from signup login step; used for greetings before profile name exists. */
  const [signupFullName, setSignupFullName] = useState("");
  const [mode,          setMode]          = useState<"signup" | "signin">("signup");
  const [parsedProfile, setParsedProfile] = useState<FullProfile | null>(null);
  /** Previous screen for JobPreferences "Back" (and similar flows). */
  const [prefPrev, setPrefPrev] = useState<Screen>("profileReview");
  /** After completing prefs, Welcome is step 6; going back should reopen prefs at step 5. */
  const [jobPrefsResumeStep, setJobPrefsResumeStep] = useState<1 | 2 | 3 | 4 | 5 | undefined>(
    undefined,
  );
  /** Return target after profile edit (Save / Back). */
  const [profileReturnScreen, setProfileReturnScreen] = useState<Screen>("welcome");

  const profileForEdit = useMemo(
    () => (parsedProfile ? normalizeToFullProfile(parsedProfile) : null),
    [parsedProfile],
  );
  const [hasCompletedInterview, setHasCompletedInterview] = useState(false);
  const [jobReviewInitialTab, setJobReviewInitialTab] = useState<"new" | "saved">("new");

  const STORAGE_KEY = "zappyfind.session.v1";
  const readSession = () => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as {
        email?: string;
        signupFullName?: string;
        mode?: "signup" | "signin";
        profile?: FullProfile | null;
        hasCompletedInterview?: boolean;
        onboardingComplete?: boolean;
      };
    } catch {
      return null;
    }
  };
  const writeSession = (next: Partial<NonNullable<ReturnType<typeof readSession>>>) => {
    if (typeof window === "undefined") return;
    try {
      const prev = readSession() ?? {};
      const merged = { ...prev, ...next };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const s = readSession();
    if (!s) return;
    if (typeof s.email === "string") setEmail(s.email);
    if (typeof s.signupFullName === "string") setSignupFullName(s.signupFullName);
    if (s.mode === "signup" || s.mode === "signin") setMode(s.mode);
    if (typeof s.hasCompletedInterview === "boolean") {
      setHasCompletedInterview(s.hasCompletedInterview);
    }
    if (s.profile) setParsedProfile(s.profile);
    // Intentionally don't auto-navigate; we decide where to land after OTP verification.
    // This keeps the prototype flow predictable while still persisting state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    writeSession({ email, signupFullName, mode, profile: parsedProfile, hasCompletedInterview });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, signupFullName, mode, parsedProfile, hasCompletedInterview]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [screen]);

  const goTo = (s: Screen, dir: "forward" | "back" = "forward") => {
    setDirection(dir);
    setScreen(s);
  };

  const enterFrom = (dir: "forward" | "back") =>
    dir === "forward" ? slide.fromRight : slide.fromLeft;

  const exitTo = (dir: "forward" | "back") =>
    dir === "forward" ? slide.toLeft : slide.toRight;

  // Derive first name from profile, else signup full name, else email local part
  const firstName = parsedProfile
    ? ((parsedProfile as any).name || (parsedProfile as any).fullName || "").trim().split(/\s+/)[0] || ""
    : signupFullName.trim().split(/\s+/).filter(Boolean)[0] || email.split("@")[0] || "";

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "#FDFBF8", fontFamily: "Inter, sans-serif" }}
    >
      <div
        className="relative overflow-hidden mx-auto"
        style={{ maxWidth: "390px", minHeight: "100vh" }}
      >
        <AnimatePresence mode="wait" initial={false}>

          {screen === "login" && (
            <motion.div key="login" initial={direction === "back" ? slide.fromLeft : { opacity: 0, scale: 0.97 }} animate={slide.center} exit={slide.toLeft} transition={SPRING} style={{ width: "100%" }}>
              <LoginScreen
                mode={mode}
                setMode={setMode}
                email={email}
                setEmail={setEmail}
                fullName={signupFullName}
                setFullName={setSignupFullName}
                onContinue={() => goTo("otp", "forward")}
              />
            </motion.div>
          )}

          {screen === "otp" && (
            <motion.div key="otp" initial={enterFrom(direction)} animate={slide.center} exit={exitTo(direction)} transition={SPRING} style={{ width: "100%" }}>
              <OTPScreen
                email={email}
                onBack={() => goTo("login", "back")}
                onVerified={() => {
                  const isPhoneLogin = email.trim().startsWith("+");
                  if (isPhoneLogin) {
                    setHasCompletedInterview(false);
                    writeSession({
                      email,
                      mode,
                      profile: parsedProfile,
                      hasCompletedInterview: false,
                      onboardingComplete: true,
                    });
                    goTo("dashboardPreview", "forward");
                    return;
                  }

                  // Email login should always run the full onboarding flow,
                  // regardless of any previously persisted session state.
                  setParsedProfile(null);
                  setHasCompletedInterview(false);
                  writeSession({
                    email,
                    mode,
                    profile: null,
                    hasCompletedInterview: false,
                    onboardingComplete: false,
                  });
                  setJobPrefsResumeStep(undefined);
                  setPrefPrev("otp");
                  goTo("jobPreferences", "forward");
                }}
              />
            </motion.div>
          )}

          {screen === "welcome" && (
            <motion.div key="welcome" initial={enterFrom(direction)} animate={slide.center} exit={exitTo(direction)} transition={SPRING} style={{ width: "100%" }}>
              <WelcomeScreen
                onResumeUploaded={(data) => {
                  setParsedProfile(data);
                  writeSession({ profile: data });
                  goTo("settingUpProfile", "forward");
                }}
                onManual={() => {
                  goTo("profileReview", "forward");
                }}
                onBack={() => goTo("jobPreferences", "back")}
              />
            </motion.div>
          )}

          {screen === "profileReview" && (
            <motion.div key="profileReview" initial={enterFrom(direction)} animate={slide.center} exit={exitTo(direction)} transition={SPRING} style={{ width: "100%" }}>
              <OnboardingProfileScreen
                email={email}
                signupFullName={signupFullName}
                onComplete={(profile) => {
                  setParsedProfile(profile);
                  writeSession({ profile });
                  setPrefPrev("profileReview");
                  goTo("settingUpProfile", "forward");
                }}
                onBack={() => goTo("welcome", "back")}
              />
            </motion.div>
          )}

          {screen === "profileEdit" && profileForEdit && (
            <motion.div
              key="profileEdit"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              style={{ width: "100%" }}
            >
              <ProfileReviewScreen
                mode="edit"
                profile={profileForEdit}
                onBack={() => goTo(profileReturnScreen, "back")}
                onSave={(next) => {
                  setParsedProfile(next);
                  writeSession({ profile: next });
                  goTo(profileReturnScreen, "back");
                }}
              />
            </motion.div>
          )}

          {screen === "jobPreferences" && (
            <motion.div key="jobPreferences" initial={enterFrom(direction)} animate={slide.center} exit={exitTo(direction)} transition={SPRING} style={{ width: "100%" }}>
              <JobPreferencesScreen
                firstName={firstName}
                resumeAtStep={jobPrefsResumeStep}
                onComplete={(prefs: JobPreferences) => {
                  setParsedProfile((prev) =>
                    prev ? { ...prev, preferences: prefs } : prev
                  );
                  writeSession({
                    profile: parsedProfile
                      ? { ...parsedProfile, preferences: prefs }
                      : undefined,
                  });
                  setJobPrefsResumeStep(5);
                  goTo("welcome", "forward");
                }}
                onBack={() => {
                  setJobPrefsResumeStep(undefined);
                  goTo(prefPrev, "back");
                }}
              />
            </motion.div>
          )}

          {screen === "settingUpProfile" && (
            <motion.div key="settingUpProfile" initial={enterFrom(direction)} animate={slide.center} exit={exitTo(direction)} transition={SPRING} style={{ width: "100%" }}>
              <SettingUpProfileScreen onDone={() => goTo("profileSummary", "forward")} />
            </motion.div>
          )}

          {screen === "profileSummary" && (
            <motion.div
              key="profileSummary"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              style={{ width: "100%" }}
            >
              <ProfileSummaryScreen
                profile={parsedProfile}
                email={email}
                onEditProfile={() => {
                  setProfileReturnScreen("profileSummary");
                  goTo("profileEdit", "forward");
                }}
                onContinue={() => goTo("matchCelebration", "forward")}
              />
            </motion.div>
          )}

          {screen === "matchCelebration" && (
            <motion.div key="matchCelebration" initial={enterFrom(direction)} animate={slide.center} exit={exitTo(direction)} transition={SPRING} style={{ width: "100%" }}>
              <MatchCelebrationScreen onContinue={() => goTo("success", "forward")} />
            </motion.div>
          )}

          {screen === "success" && (
            <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} style={{ width: "100%" }}>
              <ZappyHomeScreen
                firstName={firstName}
                onReset={() => {
                  setEmail("");
                  setSignupFullName("");
                  setParsedProfile(null);
                  setHasCompletedInterview(false);
                  if (typeof window !== "undefined") {
                    try {
                      window.localStorage.removeItem(STORAGE_KEY);
                    } catch {
                      // ignore
                    }
                  }
                  goTo("login", "back");
                }}
                onGoToDashboard={() => {
                  setHasCompletedInterview(false);
                  writeSession({ hasCompletedInterview: false, onboardingComplete: true });
                  goTo("dashboardPreview", "forward");
                }}
                onStartInterview={() => {
                  goTo("voiceCall", "forward");
                }}
              />
            </motion.div>
          )}

          {screen === "dashboardPreview" && (
            <motion.div
              key="dashboardPreview"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              style={{ width: "100%" }}
            >
              <DashboardPreviewScreen
                firstName={firstName}
                profile={parsedProfile}
                hasCompletedInterview={hasCompletedInterview}
                onStartInterview={() => goTo("voiceCall", "forward")}
                onReviewJobs={() => {
                  setJobReviewInitialTab("new");
                  goTo("jobReview", "forward");
                }}
                onViewSavedJobs={() => {
                  setJobReviewInitialTab("saved");
                  goTo("jobReview", "forward");
                }}
                onViewProfile={() => goTo("jobSeekerProfile", "forward")}
              />
            </motion.div>
          )}

          {screen === "jobSeekerProfile" && (
            <motion.div
              key="jobSeekerProfile"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              style={{ width: "100%" }}
            >
              <JobSeekerProfileScreen
                firstName={firstName || "Alex"}
                email={email}
                profile={parsedProfile}
                onNavigateHome={() => goTo("dashboardPreview", "back")}
                onNavigateJobs={() => {
                  setJobReviewInitialTab("new");
                  goTo("jobReview", "forward");
                }}
                onNavigateProfile={() => {}}
                onEditProfile={() => {
                  setProfileReturnScreen("jobSeekerProfile");
                  goTo("profileEdit", "forward");
                }}
              />
            </motion.div>
          )}

          {screen === "voiceCall" && (
            <VoiceCallScreen
              firstName={firstName}
              onEnd={() => {
                setHasCompletedInterview(true);
                writeSession({ hasCompletedInterview: true, onboardingComplete: true });
                goTo("dashboardPreview", "back");
              }}
            />
          )}

          {screen === "jobReview" && (
            <motion.div
              key="jobReview"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              style={{ width: "100%" }}
            >
              <JobReviewScreen
                firstName={firstName || "Alex"}
                initialTab={jobReviewInitialTab}
                onNavigateHome={() => goTo("dashboardPreview", "back")}
                onNavigateJobs={() => goTo("jobReview", "forward")}
                onNavigateProfile={() => goTo("jobSeekerProfile", "forward")}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Setting up your profile (after step 5: upload resume) ─────────────────────
const SETUP_STEPS = [
  "Setting up your profile…",
  "Analyzing your experience…",
  "Calibrating job matches…",
  "Almost ready!",
];
const STEP_INTERVAL = 1700;
const SETUP_TOTAL_DURATION = SETUP_STEPS.length * STEP_INTERVAL + 800;

const FLOATING_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  initialX: 8 + ((i * 7 + 13) % 84),
  initialY: 55 + ((i * 11 + 5) % 40),
  size: 3 + ((i * 3) % 5),
  duration: 4 + ((i * 7) % 5),
  delay: (i * 0.4) % 3,
  opacity: 0.15 + ((i * 5) % 25) / 100,
}));

function SettingUpProfileScreen({ onDone }: { onDone: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setStepIndex((i) => Math.min(i + 1, SETUP_STEPS.length - 1)),
      STEP_INTERVAL,
    );
    const done = setTimeout(onDone, SETUP_TOTAL_DURATION);
    let accumulated = 0;
    const increment = 100 / (SETUP_TOTAL_DURATION / 50);
    const tick = setInterval(() => {
      accumulated = Math.min(accumulated + increment, 100);
      setProgress(accumulated);
    }, 50);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
      clearInterval(tick);
    };
  }, [onDone]);

  return (
    <div
      style={{
        height: "100vh",
        background: "#FDFBF8",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background gradient orbs */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,143,86,0.12) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 20, -25, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "20%",
          right: "5%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ x: [0, 15, -10, 0], y: [0, -15, 10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "45%",
          right: "30%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234,88,12,0.06) 0%, transparent 70%)",
          filter: "blur(35px)",
          pointerEvents: "none",
        }}
      />

      {/* Floating rising particles */}
      {FLOATING_PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -(120 + (p.id % 4) * 20)],
            x: [0, ((p.id % 2 === 0 ? 1 : -1) * ((p.id * 7) % 30))],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: `${p.initialX}%`,
            top: `${p.initialY}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF8F56, #EA580C)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Softer icon cluster (no ripple rings) */}
      <div
        style={{
          position: "relative",
          marginBottom: 34,
          width: 120,
          height: 66,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(234,88,12,0.18)",
            boxShadow: "0 4px 16px rgba(234,88,12,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          <Shield size={20} color="#EA580C" strokeWidth={2.1} />
        </motion.div>

        <motion.div
          animate={{ x: [0, -2, 0], opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: 14,
            top: 20,
            width: 28,
            height: 28,
            borderRadius: 10,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(234,88,12,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Users size={14} color="#C2410C" strokeWidth={2} />
        </motion.div>

        <motion.div
          animate={{ x: [0, 2, 0], opacity: [0.55, 0.8, 0.55] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          style={{
            position: "absolute",
            right: 14,
            top: 20,
            width: 28,
            height: 28,
            borderRadius: 10,
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(234,88,12,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageCircle size={14} color="#C2410C" strokeWidth={2} />
        </motion.div>
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          fontSize: "22px",
          fontWeight: 800,
          color: "#1C1917",
          letterSpacing: "-0.035em",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Setting up your profile
      </motion.h2>

      {/* Animated subtitle with crossfade */}
      <div
        style={{
          height: 28,
          position: "relative",
          marginBottom: 32,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "14px",
              color: "#78716C",
              textAlign: "center",
              position: "absolute",
              width: "100%",
              margin: 0,
            }}
          >
            {SETUP_STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Smooth progress bar */}
      <div
        style={{
          width: "min(220px, 60%)",
          height: 4,
          borderRadius: 4,
          background: "rgba(28,25,23,0.06)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
          style={{
            height: "100%",
            borderRadius: 4,
            background: "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
            boxShadow: "0 0 8px rgba(234,88,12,0.3)",
          }}
        />
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {SETUP_STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              background:
                i <= stepIndex
                  ? "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)"
                  : "rgba(28,25,23,0.1)",
              scale: i === stepIndex ? 1.4 : 1,
              boxShadow:
                i === stepIndex
                  ? "0 0 8px rgba(234,88,12,0.4)"
                  : "0 0 0px rgba(234,88,12,0)",
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: 6, height: 6, borderRadius: "50%" }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Zappy Home Screen ─────────────────────────────────────────────────────────
const C = {
  bg: "#FDFBF8", primary: "#1C1917", brand: "#EA580C",
  brandLight: "rgba(234,88,12,0.08)", brandBorder: "rgba(234,88,12,0.2)",
  textPrimary: "#1C1917", textMuted: "#78716C", textSec: "#A8A29E",
  border: "rgba(28,25,23,0.08)", white: "#FFFFFF",
};

const AI_ONBOARDING_PARAGRAPHS = [
  "Before we review the 74 matching roles or introduce you directly to the recruiters, we just need answers to 3 quick questions.",
  "Shall we get started?",
];

type ChatMessage = {
  id: number;
  role: "user" | "system";
  text: string;
};

// ── Analysis Steps Data ───────────────────────────────────────────────────────
const ANALYSIS_STEPS = [
  { label: "Reading your preferences", duration: 1100 },
  { label: "Matching with opportunities", duration: 1200 },
  { label: "Building your candidate profile", duration: 1000 },
];

const INTERVIEW_BENEFITS = [
  {
    icon: "message",
    title: "Go beyond the resume",
    description: "Share your motivations, strengths, and what makes you unique",
  },
  {
    icon: "target",
    title: "Better recruiter matches",
    description: "Zappy uses your voice insights to pitch you directly to hiring managers",
  },
  {
    icon: "sparkle",
    title: "3x more visibility",
    description: "Candidates with interviews get 3x more recruiter views",
  },
];

function AnalyzingPhase() {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsComplete, setStepsComplete] = useState<boolean[]>(
    ANALYSIS_STEPS.map(() => false)
  );

  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    ANALYSIS_STEPS.forEach((step, i) => {
      elapsed += step.duration;
      const showTimer = setTimeout(() => setCurrentStep(i), i === 0 ? 0 : elapsed - step.duration);
      const completeTimer = setTimeout(
        () => setStepsComplete((prev) => { const n = [...prev]; n[i] = true; return n; }),
        elapsed
      );
      timers.push(showTimer, completeTimer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: "100%",
        maxWidth: 360,
        padding: "28px 24px",
        borderRadius: 22,
        background: C.white,
        border: `1px solid ${C.border}`,
        boxShadow: "0 2px 16px rgba(28,25,23,0.06)",
      }}
    >
      {/* Pulsing orb */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            boxShadow: [
              "0 0 0 0px rgba(234,88,12,0.15), 0 0 20px rgba(234,88,12,0.1)",
              "0 0 0 12px rgba(234,88,12,0.06), 0 0 30px rgba(234,88,12,0.15)",
              "0 0 0 0px rgba(234,88,12,0.15), 0 0 20px rgba(234,88,12,0.1)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 50%, #E85A22 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Sparkles size={20} color="white" strokeWidth={2} />
        </motion.div>
      </div>

      <h2
        style={{
          margin: 0,
          marginBottom: 6,
          fontFamily: "'DM Serif Display', Georgia, serif",
          fontWeight: 400,
          fontSize: 20,
          color: C.textPrimary,
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        Analyzing your responses
      </h2>
      <p
        style={{
          margin: "0 0 22px",
          fontSize: 13,
          lineHeight: 1.55,
          color: C.textMuted,
          textAlign: "center",
          letterSpacing: "-0.01em",
        }}
      >
        Zappy is processing what you shared to build your profile
      </p>

      {/* Step indicators */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {ANALYSIS_STEPS.map((step, i) => {
          const isActive = currentStep >= i;
          const isDone = stepsComplete[i];
          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isActive ? 1 : 0.35, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 0",
                borderBottom: i < ANALYSIS_STEPS.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 8,
                  background: isDone
                    ? "rgba(5,150,105,0.1)"
                    : isActive
                      ? "rgba(234,88,12,0.1)"
                      : "rgba(28,25,23,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.3s",
                }}
              >
                {isDone ? (
                  <motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    width={13} height={13} viewBox="0 0 24 24" fill="none"
                    stroke="#059669" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </motion.svg>
                ) : isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{
                      width: 13,
                      height: 13,
                      border: "2px solid rgba(234,88,12,0.2)",
                      borderTopColor: "#EA580C",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "rgba(28,25,23,0.15)",
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: isDone ? 600 : 500,
                  color: isDone ? "#059669" : isActive ? C.textPrimary : C.textSec,
                  letterSpacing: "-0.01em",
                  transition: "color 0.3s",
                }}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function InterviewPromptPhase({
  firstName,
  onStartInterview,
  onSkip,
}: {
  firstName: string;
  onStartInterview: () => void;
  onSkip: () => void;
}) {
  const EASE = [0.16, 1, 0.3, 1] as const;

  const FLOW_STEPS = [
    {
      icon: <Mic size={18} color="#EA580C" strokeWidth={2} />,
      label: "You share",
      sub: "~10 min call",
    },
    {
      icon: <Sparkles size={18} color="#EA580C" strokeWidth={2} />,
      label: "Zappy Enhances",
      sub: "your profile",
    },
    {
      icon: <Users size={18} color="#EA580C" strokeWidth={2} />,
      label: "Recruiters",
      sub: "contact you",
    },
  ];

  const PROOF_POINTS = [
    {
      icon: <CheckCircle2 size={13} color="#059669" strokeWidth={2.5} />,
      text: "3× more views from hiring managers",
      color: "#059669",
    },
    {
      icon: <Sparkles size={13} color="#EA580C" strokeWidth={2} />,
      text: "Required to activate direct recruiter introductions",
      color: "#EA580C",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
      style={{
        width: "100%",
        maxWidth: 360,
        borderRadius: 22,
        overflow: "hidden",
        background: C.white,
        border: `1px solid ${C.border}`,
        filter: "none",
        boxShadow:
          "0 4px 24px rgba(28,25,23,0.08), 0 1px 3px rgba(28,25,23,0.04)",
      }}
    >
      {/* Warm accent stripe */}
      <div
        style={{
          height: 3,
          background:
            "linear-gradient(90deg, #FF8F56 0%, #EA580C 50%, #E85A22 100%)",
        }}
      />

      <div style={{ padding: "24px 22px 0" }}>
        {/* Zappy icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
          style={{ marginBottom: 18 }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(234,88,12,0.12)",
                "0 0 0 8px rgba(234,88,12,0.04)",
                "0 0 0 0px rgba(234,88,12,0.12)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: "rgba(234,88,12,0.10)",
              border: "1px solid rgba(234,88,12,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(28,25,23,0.06)",
            }}
          >
            <Sparkles size={20} color="#EA580C" strokeWidth={2} />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: EASE }}
        >
          <div
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: 23,
              color: C.textPrimary,
              letterSpacing: "-0.025em",
              lineHeight: 1.22,
              marginBottom: 10,
            }}
          >
            Get in front of the
            <br />
            right recruiters{firstName ? `, ${firstName}` : ""}
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.textMuted,
              lineHeight: 1.55,
              letterSpacing: "-0.01em",
            }}
          >
            A 10-minute AI conversation that Zappy shares{" "}
            <span style={{ fontWeight: 600, color: C.textPrimary }}>
              directly with hiring managers
            </span>{" "}
            — so they see the real you, not just a resume.
          </div>
        </motion.div>

        {/* Visual flow: You → Zappy → Recruiters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32, ease: EASE }}
          style={{
            marginTop: 24,
            marginBottom: 0,
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 14,
            paddingRight: 14,
            borderRadius: 16,
            background:
              "linear-gradient(135deg, rgba(234,88,12,0.04) 0%, rgba(255,143,86,0.02) 100%)",
            border: "1px solid rgba(234,88,12,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {FLOW_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.35,
                delay: 0.4 + i * 0.12,
                ease: EASE,
              }}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  minWidth: 74,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: C.white,
                    border: "1px solid rgba(234,88,12,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 1px 4px rgba(234,88,12,0.08)",
                  }}
                >
                  {step.icon}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.textPrimary,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textSec,
                      letterSpacing: "-0.01em",
                      marginTop: 1,
                    }}
                  >
                    {step.sub}
                  </div>
                </div>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.55 + i * 0.12,
                    ease: EASE,
                  }}
                  style={{
                    margin: "0 2px",
                    marginBottom: 20,
                  }}
                >
                  <ArrowRight
                    size={14}
                    color="rgba(234,88,12,0.35)"
                    strokeWidth={2.5}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55, ease: EASE }}
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {PROOF_POINTS.map((point, i) => (
            <motion.div
              key={point.text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.6 + i * 0.08,
                ease: EASE,
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {point.icon}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: C.textMuted,
                  letterSpacing: "-0.01em",
                }}
              >
                {point.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTAs */}
      <div style={{ padding: "18px 22px 22px" }}>
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.65, ease: EASE }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartInterview}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
            color: "white",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 4px 18px rgba(234,88,12,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Mic size={16} color="white" strokeWidth={2} />
          Start Interview Now
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.75, ease: EASE }}
          whileTap={{ scale: 0.97 }}
          onClick={onSkip}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 14,
            border: `1.5px solid ${C.border}`,
            background: "transparent",
            color: C.textMuted,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            marginTop: 10,
          }}
        >
          I'll do this later
        </motion.button>
      </div>
    </motion.div>
  );
}

function ZappyHomeScreen({
  firstName,
  onReset,
  onGoToDashboard,
  onStartInterview,
}: {
  firstName: string;
  onReset: () => void;
  onGoToDashboard: () => void;
  onStartInterview: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [voiceActive, setVoiceActive] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>(["", ""]);
  const [typing, setTyping] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [secondQuestionSource, setSecondQuestionSource] = useState<string | null>(null);
  const [typedSecondQuestion, setTypedSecondQuestion] = useState("");
  const [secondTyping, setSecondTyping] = useState(false);
  const [postChatPhase, setPostChatPhase] = useState<"analyzing" | "interview_prompt" | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showCallCard, setShowCallCard] = useState(false);
  const nextMessageIdRef = useRef(1);

  const greeting = firstName
    ? `Welcome, ${firstName.charAt(0).toUpperCase() + firstName.slice(1)} 👋`
    : "Welcome to ZappyFind 👋";

  // Initialize browser speech recognition for voice-to-text
  useEffect(() => {
    if (typeof window === "undefined") return;
    const anyWindow = window as any;
    const SpeechRecognitionCtor =
      anyWindow.SpeechRecognition || anyWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setSpeechAvailable(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;
    setSpeechAvailable(true);

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Auto-start the AI conversation shortly after screen load
  useEffect(() => {
    if (conversationStarted) return;
    if (typeof window === "undefined") return;

    const timeoutId = window.setTimeout(() => {
      setConversationStarted(true);
      setVoiceActive(false);
      setCallOpen(false);
      setPrompt("");
      setMessages([]);
      setShowCallCard(false);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [conversationStarted]);

  // Typewriter effect for Zappy's first message (word-by-word, two paragraphs)
  useEffect(() => {
    if (!conversationStarted) {
      setTypedParagraphs(["", ""]);
      setTyping(false);
      setTypingDone(false);
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const run = async () => {
      setTyping(true);
      setTypingDone(false);
      setTypedParagraphs(["", ""]);
      setShowQuickReplies(false);

      for (let pIndex = 0; pIndex < AI_ONBOARDING_PARAGRAPHS.length; pIndex++) {
        const words = AI_ONBOARDING_PARAGRAPHS[pIndex].split(" ");

        for (let wIndex = 0; wIndex < words.length; wIndex++) {
          if (cancelled) return;

          const word = words[wIndex];
          setTypedParagraphs((prev) => {
            const next = [...prev];
            const current = next[pIndex] || "";
            next[pIndex] = current ? `${current} ${word}` : word;
            return next;
          });

          const trimmed = word.replace(/["']+$/, "");
          const isSentenceEnd = /[.!?]$/.test(trimmed);
          const baseDelay = 40 + Math.random() * 20; // 40–60ms per word
          const sentencePause = isSentenceEnd ? 260 : 0;
          await sleep(baseDelay + sentencePause);
        }

        if (pIndex === 0) {
          await sleep(320);
        }
      }

      if (!cancelled) {
        setTyping(false);
        setTypingDone(true);
        setShowQuickReplies(true);
        queueMicrotask(() => {
          inputRef.current?.focus();
        });
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [conversationStarted]);

  // Typewriter effect for follow-up question after quick reply
  useEffect(() => {
    if (!secondQuestionSource) {
      setTypedSecondQuestion("");
      setSecondTyping(false);
      return;
    }

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const run = async () => {
      setSecondTyping(true);
      setTypedSecondQuestion("");

      // slight delay before starting the follow-up question
      await sleep(260);
      if (cancelled) return;

      const words = secondQuestionSource.split(" ");

      for (let i = 0; i < words.length; i++) {
        if (cancelled) return;
        const word = words[i];

        setTypedSecondQuestion((prev) =>
          prev ? `${prev} ${word}` : word
        );

        const trimmed = word.replace(/["']+$/, "");
        const isSentenceEnd = /[.!?]$/.test(trimmed);
        const baseDelay = 40 + Math.random() * 20;
        const sentencePause = isSentenceEnd ? 260 : 0;
        await sleep(baseDelay + sentencePause);
      }

      if (!cancelled) {
        setSecondTyping(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [secondQuestionSource]);

  // Auto-transition from analyzing → interview_prompt
  useEffect(() => {
    if (postChatPhase !== "analyzing") return;
    const totalAnalysis = ANALYSIS_STEPS.reduce((sum, s) => sum + s.duration, 0);
    const timer = setTimeout(() => setPostChatPhase("interview_prompt"), totalAnalysis + 600);
    return () => clearTimeout(timer);
  }, [postChatPhase]);

  const startRecording = () => {
    if (!speechAvailable || !recognitionRef.current || isRecording) return;

    const recognition = recognitionRef.current as any;
    setIsRecording(true);

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const transcript = result[0]?.transcript ?? "";
          if (!transcript) continue;
          setPrompt((prev) => {
            const trimmedPrev = prev.trimEnd();
            const prefix = trimmedPrev ? trimmedPrev + " " : "";
            return prefix + transcript.trim();
          });
        }
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    try {
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!isRecording || !recognitionRef.current) return;
    try {
      (recognitionRef.current as any).stop();
    } catch {
      // ignore
    }
  };

  const handleSend = () => {
    if (!conversationStarted || !typingDone || postChatPhase) return;
    const text = prompt.trim();
    if (!text) return;

    const id = nextMessageIdRef.current++;
    setMessages((prev) => {
      const next = [...prev, { id, role: "user", text }];
      const userCount = next.filter((m) => m.role === "user").length;
      if (userCount >= 2) {
        setPostChatPhase("analyzing");
        setShowQuickReplies(false);
      }
      return next;
    });
    setPrompt("");

    if (!showCallCard) {
      setShowCallCard(true);
    }
  };
  const hasPromptText = prompt.trim().length > 0;

  const renderWithBoldThreeQuestions = (text: string) => {
    const target = "3 quick questions";
    const idx = text.indexOf(target);
    if (idx === -1) return text;
    const before = text.slice(0, idx);
    const after = text.slice(idx + target.length);
    return (
      <>
        {before}
        <span style={{ fontWeight: 700 }}>{target}</span>
        {after}
      </>
    );
  };

  return (
    <div style={{
      height: "100dvh" as CSSProperties["height"],
      background: C.bg, fontFamily: "Inter, sans-serif",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        padding: "20px 20px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={14} color="white" strokeWidth={2} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: C.textPrimary, letterSpacing: "-0.03em" }}>
            ZappyFind
          </span>
        </div>
        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: C.brandLight,
          border: `1px solid ${C.brandBorder}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "13px", fontWeight: 600, color: C.brand, letterSpacing: "-0.01em",
        }}>
          {firstName ? firstName[0].toUpperCase() : "Z"}
        </div>
      </div>

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", padding: "28px 20px 20px" }}>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 28 }}
        >
          <h1 style={{
            fontSize: "clamp(22px, 6.5vw, 26px)", fontWeight: 800,
            color: C.textPrimary, letterSpacing: "-0.045em",
            lineHeight: 1.2, marginBottom: 10,
          }}>
            {greeting}
          </h1>
        </motion.div>

        {/* Zappy's first message (AI onboarding bubble) and conversation thread */}
        {conversationStarted && (
          <>
            {/* AI message (modern LLM style, no bubble) */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: 4, marginBottom: 6 }}
            >
              <div
                style={{
                  width: "100%",
                  color: "#333333",
                  fontSize: "14px",
                  lineHeight: 1.5,
                  letterSpacing: "-0.01em",
                }}
              >
                <p style={{ margin: 0, marginBottom: 8 }}>
                  {renderWithBoldThreeQuestions(typedParagraphs[0])}
                </p>
                <p style={{ margin: 0 }}>
                  {typedParagraphs[1]}
                </p>
              </div>
            </motion.div>

            {/* Conversation thread with follow-up question between first and second user messages */}
            {(() => {
              let userCount = 0;
              const shouldShowFollowUp = typedSecondQuestion || secondTyping;

              return messages.map((m) => {
                const isUser = m.role === "user";
                const elements: JSX.Element[] = [];

                elements.push(
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: isUser ? "flex-end" : "flex-start",
                      marginTop: 10,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: isUser ? "80%" : "100%",
                        padding: isUser ? "10px 12px" : 0,
                        borderRadius: isUser ? 16 : 0,
                        background: isUser ? "#FF6A2B" : "transparent",
                        color: isUser ? "#FFFFFF" : "#333333",
                        fontSize: "14px",
                        lineHeight: 1.5,
                        letterSpacing: "-0.01em",
                        boxShadow: isUser ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      }}
                    >
                      {m.text}
                    </div>
                  </div>
                );

                if (isUser) {
                  userCount += 1;
                  if (userCount === 1 && shouldShowFollowUp) {
                    elements.push(
                      <div
                        key="second-question-follow-up"
                        style={{
                          marginTop: 12,
                          width: "100%",
                          color: "#333333",
                          fontSize: "14px",
                          lineHeight: 1.5,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {typedSecondQuestion}
                        </p>
                      </div>
                    );
                  }
                }

                return elements;
              });
            })()}

            {/* Insight call card removed per latest spec */}
          </>
        )}

        {/* Post-chat phases: analyzing → interview prompt */}
        {postChatPhase && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
            }}
          >
            <AnimatePresence mode="wait">
              {postChatPhase === "analyzing" && (
                <AnalyzingPhase key="analyzing" />
              )}
              {postChatPhase === "interview_prompt" && (
                <InterviewPromptPhase
                  key="interview_prompt"
                  firstName={firstName}
                  onStartInterview={onStartInterview}
                  onSkip={onGoToDashboard}
                />
              )}
            </AnimatePresence>
          </div>
        )}

      </div>

      {/* ── Sticky prompt bar ──────────────────────────────────────────────── */}
      {!postChatPhase && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flexShrink: 0,
            padding: "12px 16px 24px",
            background: "rgba(253,251,248,0.96)",
            backdropFilter: "blur(14px)",
          }}
        >
          {/* Quick reply chips */}
          <AnimatePresence>
            {showQuickReplies && typingDone && (
              <motion.div
                key="quick-replies"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const userId = nextMessageIdRef.current++;
                    const displayName = firstName ? firstName.split(" ")[0] : "Alex";
                    const followUp = `Great ${displayName}, so what is the tech stack you have been using mostly at Amazon?`;
                    setMessages((prev) => {
                      const next = [...prev, { id: userId, role: "user", text: "Yes, let's start" }];
                      const userCount = next.filter((m) => m.role === "user").length;
                      if (userCount >= 2) { setPostChatPhase("analyzing"); setShowQuickReplies(false); }
                      return next;
                    });
                    setShowQuickReplies(false);
                    setSecondQuestionSource(followUp);
                  }}
                  style={{
                    border: "1px solid rgba(234,88,12,0.22)",
                    cursor: "pointer",
                    borderRadius: 999,
                    padding: "6px 13px",
                    background: "rgba(255,241,232,0.7)",
                    color: "#C2410C",
                    fontSize: 12.5,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Yes, let's start
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = nextMessageIdRef.current++;
                    setMessages((prev) => {
                      const next = [...prev, { id, role: "user", text: "No, I'll answer later" }];
                      const userCount = next.filter((m) => m.role === "user").length;
                      if (userCount >= 2) { setPostChatPhase("analyzing"); setShowQuickReplies(false); }
                      return next;
                    });
                    setShowQuickReplies(false);
                  }}
                  style={{
                    border: "1px solid rgba(234,88,12,0.22)",
                    cursor: "pointer",
                    borderRadius: 999,
                    padding: "6px 13px",
                    background: "rgba(255,241,232,0.7)",
                    color: "#C2410C",
                    fontSize: 12.5,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  No, I'll answer later
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: C.white, borderRadius: 16,
            border: `1.5px solid ${C.border}`,
            padding: "4px 4px 4px 16px",
            boxShadow: "0 2px 12px rgba(28,25,23,0.07)",
          }}>
            <input
              type="text"
              placeholder="Ask Zappy anything…"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              ref={inputRef}
              style={{
                flex: 1, border: "none", background: "transparent", outline: "none",
                fontSize: "14px", color: C.textPrimary, fontFamily: "Inter, sans-serif",
                letterSpacing: "-0.01em", padding: "10px 0",
              }}
            />
            {speechAvailable && (
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                  width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                  background: isRecording ? "rgba(234,88,12,0.1)" : "rgba(28,25,23,0.04)",
                  border: isRecording ? "1px solid rgba(234,88,12,0.28)" : "1px solid rgba(28,25,23,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.18s, border-color 0.18s",
                }}
              >
                <Mic size={16} color={isRecording ? "#C2410C" : "#78716C"} strokeWidth={2} />
              </motion.button>
            )}
            <motion.button
              whileTap={hasPromptText ? { scale: 0.92 } : undefined}
              onClick={handleSend}
              disabled={!hasPromptText}
              style={{
                width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                background: hasPromptText ? "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)" : "rgba(28,25,23,0.08)",
                border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: hasPromptText ? "pointer" : "not-allowed",
                opacity: hasPromptText ? 1 : 0.72,
                transition: "background 0.18s, opacity 0.18s",
              }}
            >
              <Send size={15} color={hasPromptText ? "white" : C.textSec} strokeWidth={2} />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ── Voice Call Overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {callOpen && (
          <VoiceCallScreen
            firstName={firstName}
            onEnd={() => { setCallOpen(false); setVoiceActive(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}