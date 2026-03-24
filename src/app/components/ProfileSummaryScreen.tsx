import React from "react";
import { motion } from "motion/react";
import type { FullProfile } from "./WelcomeScreen";

const C = {
  bgTop: "#FFF5EE",
  bgMiddle: "#FFD7B2",
  bgBottom: "#FFE9DC",
  textPrimary: "#1C1917",
  textMuted: "#6B6B6B",
  textSec: "#8C8C8C",
  cardBorder: "#F2E6DC",
  cardGlow: "rgba(255, 217, 204, 1)",
  avatarGrad: "linear-gradient(135deg, #FFB36B 0%, #FF6A2B 100%)",
  avatarShadow: "0 8px 22px rgba(255,106,43,0.35)",
  preferenceChipBg: "#FCE8DA",
  preferenceChipText: "#5A4A42",
  buttonBorder: "#E3E0DD",
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
  const anyProfile = (profile || {}) as any;
  const name: string = anyProfile.name || anyProfile.fullName || "Alex Johnson";

  const currentRole: string =
    anyProfile.currentRole ||
    anyProfile.headline ||
    "Mid level sales professional";

  const years: string =
    anyProfile.yearsOfExperience ||
    anyProfile.totalExperience ||
    "3–6 years experience";

  const location: string =
    anyProfile.location ||
    anyProfile.city ||
    "Based in India";

  const education: string =
    anyProfile.educationSummary ||
    anyProfile.education?.[0]?.institution ||
    "Bachelor’s degree";

  const desiredRole: string =
    anyProfile.preferredRole ||
    "Mid level sales roles";

  const workSetup: string =
    anyProfile.workSetup ||
    "Hybrid or remote";

  const salaryExpectation: string =
    anyProfile.salaryRange ||
    "₹20L – ₹30L (flexible)";

  const firstInitial = name.trim().charAt(0).toUpperCase() || "Y";

  const aiSummary =
    anyProfile.summary ||
    `ZappyFind sees you as a ${currentRole.toLowerCase()} with around ${years.toLowerCase()}, strong communication skills, and a track record in relationship-driven roles. You’re currently targeting ${desiredRole.toLowerCase()} in modern, growth‑oriented teams.`;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: `linear-gradient(180deg, ${C.bgTop} 0%, ${C.bgMiddle} 45%, ${C.bgBottom} 100%)`,
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 18px",
      }}
    >
      {/* Top icon */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: "#FF6A2B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 26px rgba(255,106,43,0.35)",
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 22, color: "white" }}>✨</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: 360,
          textAlign: "center",
          fontSize: 20,
          lineHeight: "28px",
          fontWeight: 500,
          color: C.textPrimary,
          letterSpacing: "-0.02em",
          marginBottom: 24,
        }}
      >
        We found{" "}
        <span style={{ fontWeight: 800 }}>369 roles</span>{" "}
        that best fits your preference for Sales Manager role 🎉
      </motion.h1>

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: 380,
          borderRadius: 28,
          padding: 4,
          background: "white",
          boxShadow:
            "0px 18px 45px 0px rgba(241, 173, 140, 0.48), 0px 0px 0px 1px rgba(241, 209, 181, 0.9)",
          border: `3px solid ${C.cardGlow}`,
          borderImage: "none",
        }}
      >
        <div
          style={{
            borderRadius: 24,
            background: "white",
            padding: 20,
            boxShadow: "0 12px 32px rgba(15,23,42,0.08)",
          }}
        >
          {/* Profile header */}
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
            </div>
          </div>

          {/* Summary box */}
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
              }}
            >
              {aiSummary}
            </p>
          </div>

          {/* Info sections */}
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
              text="Experience across relationship-driven roles, working closely with customers and revenue teams."
            />
            <SectionRow
              icon="🛠"
              label="Skills"
              text="Strong communication, pipeline ownership, stakeholder management, and closing discipline."
            />
            <SectionRow
              icon="🎓"
              label="Education"
              text="Indian Institute of Technology, Delhi"
            />
          </div>

          {/* Preferences */}
          <div
            style={{
              background: "rgba(247, 245, 243, 0)",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
            }}
          >
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
              Preferences
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <PreferenceChip label={`Desired role: ${desiredRole}`} />
              <PreferenceChip label={`Work setup: ${workSetup}`} />
              <PreferenceChip label={`Salary: ${salaryExpectation}`} />
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 12,
            }}
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onEditProfile}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 24,
                border: `1px solid ${C.buttonBorder}`,
                background: "transparent",
                color: "#333333",
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
                height: 48,
                borderRadius: 24,
                border: "none",
                background: "linear-gradient(135deg, #FF7A3D 0%, #FF5A1F 100%)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 10px 30px rgba(255,106,43,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Continue
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2l5 5-5 5" stroke="white" strokeWidth="1.6"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>
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
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
      }}
    >
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

