import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LoginScreen } from "../components/LoginScreen";
import { OTPScreen } from "../components/OTPScreen";
import { WelcomeScreen, type FullProfile, type JobPreferences } from "../components/WelcomeScreen";
import { ProfileReviewScreen } from "../components/ProfileReviewScreen";
import { OnboardingProfileScreen } from "../components/OnboardingProfileScreen";
import { JobPreferencesScreen } from "../components/JobPreferencesScreen";
import { ProfileSummaryScreen } from "../components/ProfileSummaryScreen";
import { VoiceCallScreen } from "../components/VoiceCallScreen";
import { JobSeekerProfileScreen } from "../components/JobSeekerProfileScreen";
import { MatchCelebrationScreen } from "../components/MatchCelebrationScreen";
import { CallInitiationScreen } from "../components/CallInitiationScreen";
import { DesktopAuthLayout } from "./DesktopAuthLayout";
import { DesktopAppShell, type DesktopNavId } from "./DesktopAppShell";
import { DesktopDashboardView } from "./DesktopDashboardView";
import { DesktopJobReviewView, type JobWorkspaceTab } from "./DesktopJobReviewView";
import { DesktopOnboardingChrome } from "./DesktopOnboardingChrome";
import { DesktopOnboardingIntroCards } from "./DesktopOnboardingIntroCards";
import { DT } from "./desktop-tokens";

type Screen =
  | "login"
  | "otp"
  | "onboardingJourney"
  | "welcome"
  | "profileReview"
  | "profileEdit"
  | "jobPreferences"
  | "profileSummary"
  | "settingUpProfile"
  | "matchCelebration"
  | "callInitiation"
  | "success"
  | "dashboardPreview"
  | "voiceCall"
  | "jobReview"
  | "jobSeekerProfile";

const slide = {
  fromRight: { x: "1.5%", opacity: 0 },
  fromLeft: { x: "-1.5%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  toLeft: { x: "-1.5%", opacity: 0 },
  toRight: { x: "1.5%", opacity: 0 },
};
const SPRING = { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const };

type DesktopHubScreen = "dashboardPreview" | "jobReview" | "jobSeekerProfile";
const DESKTOP_HUB_ORDER: Record<DesktopHubScreen, number> = {
  dashboardPreview: 0,
  jobReview: 1,
  jobSeekerProfile: 2,
};
const DESKTOP_HUB_CROSSFADE = {
  duration: 0.26,
  ease: [0.16, 1, 0.3, 1] as const,
};

/** Right-column only: login ↔ OTP inside a stable `DesktopAuthLayout`. */
const AUTH_PANEL_SPRING = { type: "spring" as const, stiffness: 220, damping: 30, mass: 0.95 };

function onboardingMeta(screen: Screen): { step: number; title: string; subtitle?: string } | null {
  switch (screen) {
    case "onboardingJourney":
      return { step: 0, title: "Welcome to ZappyFind", subtitle: "A quick orientation before we tune your search." };
    case "jobPreferences":
      return { step: 1, title: "Job preferences", subtitle: "What roles, locations, and work styles matter most?" };
    case "welcome":
      return { step: 2, title: "Build your profile", subtitle: "Upload a resume or enter details manually." };
    case "profileReview":
      return { step: 3, title: "Review your profile", subtitle: "Confirm basics so matches stay accurate." };
    case "settingUpProfile":
      return { step: 4, title: "Setting up", subtitle: "We’re structuring your profile for matching." };
    case "profileSummary":
      return { step: 5, title: "Profile summary", subtitle: "Almost ready—review and continue." };
    case "matchCelebration":
      return { step: 6, title: "You’re on the map", subtitle: "Here’s how you compare in-market." };
    case "callInitiation":
      return { step: 7, title: "Voice interview", subtitle: "Optional: add a communication signal for recruiters." };
    default:
      return null;
  }
}

export type DesktopAppRootProps = {
  screen: Screen;
  direction: "forward" | "back";
  email: string;
  setEmail: (v: string) => void;
  signupFullName: string;
  setSignupFullName: (v: string) => void;
  mode: "signup" | "signin";
  setMode: (v: "signup" | "signin") => void;
  parsedProfile: FullProfile | null;
  setParsedProfile: React.Dispatch<React.SetStateAction<FullProfile | null>>;
  pendingPrefs: JobPreferences | null;
  setPendingPrefs: React.Dispatch<React.SetStateAction<JobPreferences | null>>;
  prefPrev: Screen;
  setPrefPrev: (s: Screen) => void;
  jobPrefsResumeStep: 1 | 2 | 3 | undefined;
  setJobPrefsResumeStep: React.Dispatch<React.SetStateAction<1 | 2 | 3 | undefined>>;
  profileReturnScreen: Screen;
  setProfileReturnScreen: (s: Screen) => void;
  profileEditSection?: "personal" | "experience" | "education" | "skills" | "preferences";
  setProfileEditSection: (s: "personal" | "experience" | "education" | "skills" | "preferences" | undefined) => void;
  profileForEdit: FullProfile | null;
  hasCompletedInterview: boolean;
  setHasCompletedInterview: (v: boolean) => void;
  jobReviewInitialTab: JobWorkspaceTab;
  setJobReviewInitialTab: React.Dispatch<React.SetStateAction<JobWorkspaceTab>>;
  firstName: string;
  jobCategoryLabels: string[];
  goTo: (s: Screen, dir?: "forward" | "back") => void;
  writeSession: (next: Record<string, unknown>) => void;
  /** Screens that live in App.tsx — injected to avoid circular imports. */
  renderSettingUp: (onDone: () => void) => ReactNode;
  renderZappyHome: (props: {
    firstName: string;
    onReset: () => void;
    onGoToDashboard: () => void;
    onStartInterview: () => void;
  }) => ReactNode;
};

export function DesktopAppRoot({
  screen,
  direction,
  email,
  setEmail,
  signupFullName,
  setSignupFullName,
  mode,
  setMode,
  parsedProfile,
  setParsedProfile,
  pendingPrefs,
  setPendingPrefs,
  prefPrev,
  setPrefPrev,
  jobPrefsResumeStep,
  setJobPrefsResumeStep,
  profileReturnScreen,
  setProfileReturnScreen,
  profileEditSection,
  setProfileEditSection,
  profileForEdit,
  hasCompletedInterview,
  setHasCompletedInterview,
  jobReviewInitialTab,
  setJobReviewInitialTab,
  firstName,
  jobCategoryLabels,
  goTo,
  writeSession,
  renderSettingUp,
  renderZappyHome,
}: DesktopAppRootProps) {
  const enterFrom = (dir: "forward" | "back") => (dir === "forward" ? slide.fromRight : slide.fromLeft);
  const exitTo = (dir: "forward" | "back") => (dir === "forward" ? slide.toLeft : slide.toRight);

  const displayName = firstName || "Alex";

  const prevDesktopHubScreen = useRef<DesktopHubScreen | null>(null);
  useEffect(() => {
    if (screen === "dashboardPreview" || screen === "jobReview" || screen === "jobSeekerProfile") {
      prevDesktopHubScreen.current = screen;
    } else {
      prevDesktopHubScreen.current = null;
    }
  }, [screen]);

  const handleLogout = () => {
    setEmail("");
    setSignupFullName("");
    setParsedProfile(null);
    setPendingPrefs(null);
    setHasCompletedInterview(false);
    setJobPrefsResumeStep(undefined);
    setPrefPrev("profileReview");
    setProfileReturnScreen("welcome");
    setProfileEditSection(undefined);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("zappyfind.session.v1");
      } catch {
        // ignore
      }
    }
    goTo("login", "back");
  };

  const desktopNav = (id: DesktopNavId) => {
    if (id === "home") goTo("dashboardPreview", "forward");
    if (id === "jobs") {
      setJobReviewInitialTab("recommended");
      goTo("jobReview", "forward");
    }
    if (id === "profile") goTo("jobSeekerProfile", "forward");
  };

  const activeNav = (): DesktopNavId => {
    if (screen === "jobReview") return "jobs";
    if (screen === "jobSeekerProfile") return "profile";
    return "home";
  };

  let hubEnter = { x: 0, y: 10 };
  let hubExitX = 0;
  if (screen === "dashboardPreview" || screen === "jobReview" || screen === "jobSeekerProfile") {
    const prevHub = prevDesktopHubScreen.current;
    if (prevHub && prevHub !== screen) {
      const delta = DESKTOP_HUB_ORDER[screen] - DESKTOP_HUB_ORDER[prevHub];
      if (delta > 0) {
        hubEnter = { x: 16, y: 7 };
        hubExitX = -14;
      } else if (delta < 0) {
        hubEnter = { x: -16, y: 7 };
        hubExitX = 14;
      } else {
        hubEnter = { x: 0, y: 8 };
      }
    }
  }

  const wrapOnboarding = (
    children: ReactNode,
    s: Screen,
    chromeOpts?: {
      cardMinHeightClass?: string;
      cardHeightClass?: string;
      contentMinHeightClass?: string;
      cardFooterPaddingClass?: string;
      scrollColumnGrow?: boolean;
    },
  ) => {
    const meta = onboardingMeta(s);
    if (!meta) return children;
    return (
      <DesktopOnboardingChrome
        title={meta.title}
        subtitle={meta.subtitle}
        activeStep={meta.step}
        {...chromeOpts}
      >
        {children}
      </DesktopOnboardingChrome>
    );
  };

  const appShell = (children: ReactNode, opts?: { hideSidebar?: boolean; hideHeader?: boolean }) => (
    <DesktopAppShell
      userName={displayName}
      active={activeNav()}
      onNavigate={desktopNav}
      hideSidebar={opts?.hideSidebar}
      hideHeader={opts?.hideHeader}
    >
      {children}
    </DesktopAppShell>
  );

  return (
    <div className="min-h-screen w-full" style={{ background: DT.pageBg, fontFamily: DT.sans }}>
      <AnimatePresence mode="wait" initial={false}>
        {(screen === "login" || screen === "otp") && (
          <motion.div
            key="auth-d"
            initial={false}
            animate={slide.center}
            exit={exitTo(direction)}
            transition={SPRING}
            className="min-h-screen w-full"
          >
            <DesktopAuthLayout side={mode === "signup" ? "signup" : "signin"}>
              <div className="relative w-full overflow-x-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {screen === "login" && (
                    <motion.div
                      key="login-panel"
                      className="w-full"
                      initial={{ x: direction === "back" ? -28 : 0, opacity: direction === "back" ? 0 : 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -28, opacity: 0 }}
                      transition={AUTH_PANEL_SPRING}
                    >
                      <LoginScreen
                        layout="desktop"
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
                    <motion.div
                      key="otp-panel"
                      className="w-full"
                      initial={{ x: direction === "forward" ? 28 : 0, opacity: direction === "forward" ? 0 : 1 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 28, opacity: 0 }}
                      transition={AUTH_PANEL_SPRING}
                    >
                      <OTPScreen
                        layout="desktop"
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
                          setPrefPrev("onboardingJourney");
                          goTo("onboardingJourney", "forward");
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </DesktopAuthLayout>
          </motion.div>
        )}

        {screen === "onboardingJourney" &&
          wrapOnboarding(
            <motion.div
              key="oj-d"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              className="h-fit w-full"
            >
              <DesktopOnboardingIntroCards
                firstName={firstName}
                onComplete={() => goTo("jobPreferences", "forward")}
              />
            </motion.div>,
            "onboardingJourney",
          )}

        {screen === "welcome" &&
          wrapOnboarding(
            <motion.div key="w-d" initial={enterFrom(direction)} animate={slide.center} exit={exitTo(direction)} transition={SPRING}>
              <WelcomeScreen
                transparentSurface
                onResumeUploaded={(data) => {
                  const merged = pendingPrefs ? { ...data, preferences: pendingPrefs } : data;
                  setParsedProfile(merged);
                  writeSession({ profile: merged });
                  goTo("settingUpProfile", "forward");
                }}
                onManual={() => goTo("profileReview", "forward")}
                onBack={() => goTo("jobPreferences", "back")}
              />
            </motion.div>,
            "welcome",
          )}

        {screen === "profileReview" &&
          wrapOnboarding(
            <motion.div key="pr-d" initial={enterFrom(direction)} animate={slide.center} exit={exitTo(direction)} transition={SPRING}>
              <OnboardingProfileScreen
                email={email}
                signupFullName={signupFullName}
                onComplete={(profile) => {
                  const merged = pendingPrefs ? { ...profile, preferences: pendingPrefs } : profile;
                  setParsedProfile(merged);
                  writeSession({ profile: merged });
                  setPrefPrev("profileReview");
                  goTo("settingUpProfile", "forward");
                }}
                onBack={() => goTo("welcome", "back")}
              />
            </motion.div>,
            "profileReview",
          )}

        {screen === "profileEdit" && profileForEdit && (
          <motion.div
            key="pe-d"
            initial={enterFrom(direction)}
            animate={slide.center}
            exit={exitTo(direction)}
            transition={SPRING}
            className="min-h-screen"
          >
            <div className="border-b px-10 py-6" style={{ background: DT.surface, borderColor: DT.border }}>
              <h1 className="text-xl font-semibold">Edit profile</h1>
              <p className="mt-1 text-[14px]" style={{ color: DT.textMuted }}>
                Update how employers and matches see you.
              </p>
            </div>
            <div className="mx-auto max-w-3xl px-6 py-8">
              <ProfileReviewScreen
                mode="edit"
                profile={profileForEdit}
                initialScrollSection={profileEditSection}
                onBack={() => goTo(profileReturnScreen, "back")}
                onSave={(next) => {
                  setParsedProfile(next);
                  writeSession({ profile: next });
                  goTo(profileReturnScreen, "back");
                }}
              />
            </div>
          </motion.div>
        )}

        {screen === "jobPreferences" &&
          wrapOnboarding(
            <motion.div
              key="jp-d"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              className="flex min-h-0 h-full w-full min-w-0 flex-1 flex-col"
            >
              <JobPreferencesScreen
                transparentSurface
                resumeAtStep={jobPrefsResumeStep}
                onComplete={(prefs: JobPreferences) => {
                  setPendingPrefs(prefs);
                  setParsedProfile((prev) => {
                    if (!prev) return prev;
                    const updated = { ...prev, preferences: prefs };
                    writeSession({ profile: updated });
                    return updated;
                  });
                  setJobPrefsResumeStep(3);
                  goTo("welcome", "forward");
                }}
                onBack={() => {
                  setJobPrefsResumeStep(undefined);
                  goTo(prefPrev, "back");
                }}
              />
            </motion.div>,
            "jobPreferences",
          )}

        {screen === "settingUpProfile" &&
          wrapOnboarding(
            <motion.div
              key="sup-d"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              className="flex min-h-0 w-full flex-1 flex-col"
            >
              {renderSettingUp(() => goTo("profileSummary", "forward"))}
            </motion.div>,
            "settingUpProfile",
          )}

        {screen === "profileSummary" &&
          wrapOnboarding(
            <motion.div
              key="ps-d"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              className="flex w-full flex-col"
            >
              <ProfileSummaryScreen
                transparentSurface
                profile={parsedProfile}
                email={email}
                onEditProfile={(section) => {
                  setProfileReturnScreen("profileSummary");
                  setProfileEditSection(section);
                  goTo("profileEdit", "forward");
                }}
                onContinue={() => goTo("matchCelebration", "forward")}
              />
            </motion.div>,
            "profileSummary",
          )}

        {screen === "matchCelebration" &&
          wrapOnboarding(
            <motion.div
              key="mc-d"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              className="flex min-h-0 w-full flex-1 flex-col"
            >
              <MatchCelebrationScreen
                transparentSurface
                onContinue={() => goTo("callInitiation", "forward")}
              />
            </motion.div>,
            "matchCelebration",
            { cardFooterPaddingClass: "pb-[44px]" },
          )}

        {screen === "callInitiation" &&
          wrapOnboarding(
            <motion.div
              key="ci-d"
              initial={enterFrom(direction)}
              animate={slide.center}
              exit={exitTo(direction)}
              transition={SPRING}
              className="flex min-h-0 w-full h-fit flex-col"
            >
              <CallInitiationScreen
                transparentSurface
                firstName={firstName}
                jobCategoryLabels={jobCategoryLabels}
                onStartCall={() => goTo("voiceCall", "forward")}
                onSkip={() => {
                  setHasCompletedInterview(false);
                  writeSession({ hasCompletedInterview: false, onboardingComplete: true });
                  goTo("dashboardPreview", "forward");
                }}
              />
            </motion.div>,
            "callInitiation",
            {
              cardHeightClass: "h-fit",
              scrollColumnGrow: false,
              cardFooterPaddingClass: "pb-[28px]",
            },
          )}

        {screen === "success" && (
          <motion.div
            key="succ-d"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen"
          >
            <div className="mx-auto max-w-3xl px-8 py-16">
              {renderZappyHome({
                firstName,
                onReset: () => {
                  setEmail("");
                  setSignupFullName("");
                  setParsedProfile(null);
                  setHasCompletedInterview(false);
                  if (typeof window !== "undefined") {
                    try {
                      window.localStorage.removeItem("zappyfind.session.v1");
                    } catch {
                      /* ignore */
                    }
                  }
                  goTo("login", "back");
                },
                onGoToDashboard: () => {
                  setHasCompletedInterview(false);
                  writeSession({ hasCompletedInterview: false, onboardingComplete: true });
                  goTo("dashboardPreview", "forward");
                },
                onStartInterview: () => goTo("voiceCall", "forward"),
              })}
            </div>
          </motion.div>
        )}

        {(screen === "dashboardPreview" || screen === "jobReview" || screen === "jobSeekerProfile") && (
          <motion.div
            key="desktop-app"
            initial={enterFrom(direction)}
            animate={slide.center}
            exit={exitTo(direction)}
            transition={SPRING}
            className="min-h-screen w-full"
          >
            {appShell(
              <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-1 [&>*]:min-h-0">
                <AnimatePresence mode="sync" initial={false}>
                  {screen === "dashboardPreview" && (
                    <motion.div
                      key="dashboardPreview"
                      className="col-start-1 row-start-1 flex min-h-0 min-w-0 flex-col overflow-auto"
                      initial={{ opacity: 0, x: hubEnter.x, y: hubEnter.y }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: hubExitX, y: -6 }}
                      transition={DESKTOP_HUB_CROSSFADE}
                    >
                      <DesktopDashboardView
                        firstName={firstName}
                        profile={parsedProfile}
                        hasCompletedInterview={hasCompletedInterview}
                        onStartInterview={() => goTo("voiceCall", "forward")}
                        onReviewJobs={() => {
                          setJobReviewInitialTab("recommended");
                          goTo("jobReview", "forward");
                        }}
                        onViewSavedJobs={() => {
                          setJobReviewInitialTab("saved");
                          goTo("jobReview", "forward");
                        }}
                      />
                    </motion.div>
                  )}
                  {screen === "jobReview" && (
                    <motion.div
                      key="jobReview"
                      className="col-start-1 row-start-1 flex min-h-0 min-w-0 flex-col overflow-auto"
                      initial={{ opacity: 0, x: hubEnter.x, y: hubEnter.y }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: hubExitX, y: -6 }}
                      transition={DESKTOP_HUB_CROSSFADE}
                    >
                      <DesktopJobReviewView initialTab={jobReviewInitialTab} />
                    </motion.div>
                  )}
                  {screen === "jobSeekerProfile" && (
                    <motion.div
                      key="jobSeekerProfile"
                      className="col-start-1 row-start-1 flex min-h-0 min-w-0 flex-col overflow-auto"
                      initial={{ opacity: 0, x: hubEnter.x, y: hubEnter.y }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: hubExitX, y: -6 }}
                      transition={DESKTOP_HUB_CROSSFADE}
                    >
                      <JobSeekerProfileScreen
                        layout="desktop"
                        firstName={firstName || "Alex"}
                        email={email}
                        profile={parsedProfile}
                        onNavigateHome={() => goTo("dashboardPreview", "back")}
                        onNavigateJobs={() => {
                          setJobReviewInitialTab("recommended");
                          goTo("jobReview", "forward");
                        }}
                        onNavigateProfile={() => {}}
                        onEditProfile={() => {
                          setProfileReturnScreen("jobSeekerProfile");
                          setProfileEditSection(undefined);
                          goTo("profileEdit", "forward");
                        }}
                        onLogout={handleLogout}
                        onDeleteAccount={handleLogout}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>,
            )}
          </motion.div>
        )}

        {screen === "voiceCall" && (
          <motion.div
            key="vc-d"
            initial={enterFrom(direction)}
            animate={slide.center}
            exit={exitTo(direction)}
            transition={SPRING}
            className="min-h-screen"
          >
            {appShell(
              <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col items-stretch justify-center p-0">
                <VoiceCallScreen
                  layout="desktop"
                  firstName={firstName}
                  onEnd={() => {
                    setHasCompletedInterview(true);
                    writeSession({ hasCompletedInterview: true, onboardingComplete: true });
                    goTo("dashboardPreview", "back");
                  }}
                />
              </div>,
              { hideSidebar: true, hideHeader: true },
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
