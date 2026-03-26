import { useState } from "react";
import { motion } from "motion/react";
import type { FullProfile } from "./WelcomeScreen";
import { DashboardHeader, SettingsBottomSheet } from "./DashboardPreviewScreen";

const C = {
  textPrimary: "#1C1917",
  textMuted: "#6B6B6B",
  textSec: "#8C8C8C",
  cardGlow: "rgba(255, 217, 204, 1)",
  avatarGrad: "linear-gradient(135deg, #FFB36B 0%, #FF6A2B 100%)",
  avatarShadow: "0 8px 22px rgba(255,106,43,0.35)",
  preferenceChipBg: "#FCE8DA",
  preferenceChipText: "#5A4A42",
  buttonBorder: "#E3E0DD",
};

const T_PAGE = {
  pageBg: "#FDFBF8",
  border: "rgba(28,25,23,0.06)",
  sans: "'Inter', sans-serif",
};

const EASE = [0.16, 1, 0.3, 1] as const;

interface JobSeekerProfileScreenProps {
  firstName: string;
  email: string;
  profile: FullProfile | null;
  onNavigateHome: () => void;
  onNavigateJobs: () => void;
  onNavigateProfile: () => void;
  onEditProfile: () => void;
}

export function JobSeekerProfileScreen({
  firstName,
  email,
  profile,
  onNavigateHome,
  onNavigateJobs,
  onNavigateProfile,
  onEditProfile,
}: JobSeekerProfileScreenProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const displayName = firstName || "Alex";

  const anyProfile = (profile || {}) as Record<string, unknown>;
  const name: string =
    (typeof anyProfile.name === "string" && anyProfile.name) ||
    (typeof anyProfile.fullName === "string" && (anyProfile.fullName as string)) ||
    `${displayName} Sajeeb`;

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

  const education: string =
    (anyProfile.educationSummary as string) ||
    (Array.isArray(anyProfile.education) &&
      (anyProfile.education as { institution?: string }[])?.[0]?.institution) ||
    "Bachelor’s degree";

  const skillsText =
    Array.isArray(anyProfile.skills) && (anyProfile.skills as string[]).length
      ? (anyProfile.skills as string[]).slice(0, 6).join(", ")
      : "Figma, design systems, prototyping, user research";

  const experienceBlurb: string =
    (anyProfile.experiences as { description?: string }[])?.[0]?.description ||
    "Experience across product teams, shipping polished interfaces and scalable design systems.";

  const aiSummary =
    (typeof anyProfile.summary === "string" && anyProfile.summary) ||
    `ZappyFind sees you as a ${currentRole.toLowerCase()} · ${years.toLowerCase()}, strong communication skills, and a track record in relationship-driven product work. You’re currently targeting ${desiredRole.toLowerCase()} in modern, growth‑oriented teams.`;

  const firstInitial = name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T_PAGE.pageBg,
        fontFamily: T_PAGE.sans,
        position: "relative",
      }}
    >
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

      <main
        style={{
          position: "relative",
          zIndex: 1,
          padding: "16px 16px 32px",
        }}
      >
        <div style={{ maxWidth: 420, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            style={{
              width: "100%",
              maxWidth: 380,
              margin: "0 auto",
              borderRadius: 28,
              padding: 4,
              background: "#FFFFFF",
              boxShadow:
                "0px 18px 45px 0px rgba(241, 173, 140, 0.48), 0px 0px 0px 1px rgba(241, 209, 181, 0.9)",
              border: `3px solid ${C.cardGlow}`,
              borderImage: "none",
            }}
          >
            <div
              style={{
                borderRadius: 24,
                background: "#FFFFFF",
                padding: 20,
                boxShadow: "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: C.avatarGrad,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: C.avatarShadow,
                  }}
                >
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: "white",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {firstInitial}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: C.textPrimary,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {name}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: 13,
                      color: C.textMuted,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {currentRole}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: "rgba(248, 235, 228, 1)",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 20,
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: "22px",
                    color: "rgba(31, 31, 31, 1)",
                    letterSpacing: "-0.01em",
                    margin: 0,
                  }}
                >
                  {aiSummary}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <SectionRow
                  icon="💼"
                  label="Experience"
                  text={experienceBlurb}
                />
                <SectionRow icon="🛠" label="Skills" text={skillsText} />
                <SectionRow icon="🎓" label="Education" text={education} />
              </div>

              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: C.textSec,
                    marginBottom: 12,
                  }}
                >
                  Contact & preferences
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <PreferenceChip label={`Email: ${email || (anyProfile.email as string) || "—"}`} />
                  <PreferenceChip label={`Desired role: ${desiredRole}`} />
                  <PreferenceChip label={`Work setup: ${workSetup}`} />
                  <PreferenceChip label={`Salary: ${salaryExpectation}`} />
                </div>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={onEditProfile}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  cursor: "pointer",
                  fontFamily: T_PAGE.sans,
                  boxShadow: "0 10px 28px rgba(234,88,12,0.35)",
                }}
              >
                Edit profile
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      <SettingsBottomSheet
        open={settingsOpen}
        displayName={displayName}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

function SectionRow({
  icon,
  label,
  text,
}: {
  icon: string;
  label: string;
  text: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 999,
          background: "rgba(0,0,0,0.02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
        }}
      >
        <span>{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: C.textPrimary,
            letterSpacing: "-0.01em",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <p
          style={{
            fontSize: 13,
            color: "#6B6B6B",
            lineHeight: 1.6,
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function PreferenceChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "8px 14px",
        borderRadius: 999,
        background: C.preferenceChipBg,
        color: C.preferenceChipText,
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: "-0.01em",
      }}
    >
      {label}
    </span>
  );
}
