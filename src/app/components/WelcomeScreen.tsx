import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#FDFBF8",
  primary: "#1C1917",
  brand: "#C2410C",
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSecondary: "#A8A29E",
  border: "rgba(28,25,23,0.09)",
  cardBg: "#FFFFFF",
  orbA: "rgba(194,65,12,0.07)",
  orbB: "rgba(146,64,14,0.045)",
};

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ParsedProfile {
  name: string; title: string; experience: string;
  skills: string[]; location: string;
}
export interface WorkExp {
  id: string; company: string; role: string;
  duration: string; description: string;
}
export interface Edu {
  id: string; institution: string; degree: string;
  year: string; grade: string;
}
export interface JobPreferences {
  category?: string;
  roles?: string[];
  workSetups?: string[];
  locations?: string[];
  priorities?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  switchTimeline?: string;
}
export interface FullProfile {
  name: string; email: string; phone: string;
  location: string; headline: string; skills: string[];
  experiences: WorkExp[]; education: Edu[];
  preferences?: JobPreferences;
}

/** Coerce partial / legacy profile data into a full editable profile. */
export function normalizeToFullProfile(p: FullProfile | null): FullProfile {
  if (!p) {
    return {
      name: "",
      email: "",
      phone: "",
      location: "",
      headline: "",
      skills: [],
      experiences: [],
      education: [],
    };
  }
  return {
    name: p.name ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    location: p.location ?? "",
    headline: p.headline ?? "",
    skills: Array.isArray(p.skills) ? [...p.skills] : [],
    experiences: Array.isArray(p.experiences) ? p.experiences.map((e) => ({ ...e })) : [],
    education: Array.isArray(p.education) ? p.education.map((e) => ({ ...e })) : [],
    preferences: p.preferences ? { ...p.preferences } : undefined,
  };
}

// ── Mock full profile ─────────────────────────────────────────────────────────
const MOCK_FULL: FullProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@gmail.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  headline: "Senior Product Designer · 4+ years crafting digital products",
  skills: ["Figma", "React", "UI/UX Design", "Prototyping", "User Research", "Design Systems"],
  experiences: [
    {
      id: "e1", company: "Razorpay",
      role: "Senior Product Designer",
      duration: "Jan 2022 – Present",
      description: "Led end-to-end design for Payment Gateway 3.0, increasing conversion by 22%. Built and maintained the design system across 3 product teams.",
    },
    {
      id: "e2", company: "Swiggy",
      role: "Product Designer",
      duration: "Mar 2020 – Dec 2021",
      description: "Redesigned the merchant dashboard and checkout flow. Improved order completion rate by 18% through user research and rapid prototyping.",
    },
  ],
  education: [
    {
      id: "edu1",
      institution: "Indian Institute of Technology, Delhi",
      degree: "B.Tech in Computer Science",
      year: "2016 – 2020",
      grade: "8.4 CGPA",
    },
  ],
};

// Note: resume extracting/progress UI intentionally removed.

// ── Sparkles for parsing ring ─────────────────────────────────────────────────
const SPARKLES = [
  { angle: 0,   dist: 72, delay: 0    },
  { angle: 60,  dist: 68, delay: 0.06 },
  { angle: 120, dist: 72, delay: 0.12 },
  { angle: 180, dist: 68, delay: 0.04 },
  { angle: 240, dist: 72, delay: 0.08 },
  { angle: 300, dist: 68, delay: 0.02 },
];

// ── What Zappy extracts ───────────────────────────────────────────────────────
const EXTRACTS = [
  { label: "Work history",  icon: "💼" },
  { label: "Skills",        icon: "⚡" },
  { label: "Education",     icon: "🎓" },
];

// ── AI onboarding copy ────────────────────────────────────────────────────────
const AI_ONBOARDING_PARAGRAPHS = [
  "Before we review the 369 matching roles or introduce you directly to the recruiters, we just need answers to three quick questions.",
  "Shall we get started?",
];

type Stage = "choice" | "parsing";

// ── Circular progress ring ────────────────────────────────────────────────────
const R      = 48;
const CIRCUM = 2 * Math.PI * R;

function ProgressRing({ progress, isSpecial }: { progress: number; isSpecial: boolean }) {
  const offset = CIRCUM * (1 - progress / 100);
  return (
    <div className="relative flex items-center justify-center"
      style={{ width: 128, height: 128 }}>
      <AnimatePresence>
        {isSpecial && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute", inset: "-12px", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(194,65,12,0.18) 0%, rgba(194,65,12,0.06) 50%, transparent 70%)",
              filter: "blur(4px)",
            }} />
        )}
      </AnimatePresence>
      <svg width="128" height="128" viewBox="0 0 128 128" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8F56" />
            <stop offset="100%" stopColor="#FF6B35" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r={R}
          fill="none" stroke="rgba(28,25,23,0.07)" strokeWidth="7" />
        <motion.circle
          cx="64" cy="64" r={R}
          fill="none" stroke="url(#ring-grad)"
          strokeWidth="7" strokeLinecap="round"
          strokeDasharray={CIRCUM}
          initial={{ strokeDashoffset: CIRCUM }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div className="relative flex flex-col items-center justify-center">
        <motion.span
          key={Math.floor(progress / 10)}
          animate={isSpecial ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: "26px", fontWeight: 800,
            color: isSpecial ? C.brand : C.textPrimary,
            letterSpacing: "-0.05em", lineHeight: 1,
            transition: "color 0.3s",
          }}>
          {Math.round(progress)}%
        </motion.span>
      </div>
      <AnimatePresence>
        {isSpecial && (
          <>
            {SPARKLES.map((s, i) => {
              const rad = (s.angle * Math.PI) / 180;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.cos(rad) * s.dist,
                    y: Math.sin(rad) * s.dist,
                    scale: [0, 1.2, 0],
                  }}
                  transition={{ duration: 1.1, delay: s.delay, repeat: Infinity, repeatDelay: 1.6 }}
                  style={{
                    position: "absolute",
                    width: 6, height: 6, borderRadius: "50%",
                    background: "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)",
                    top: "50%", left: "50%",
                    marginTop: -3, marginLeft: -3,
                  }} />
              );
            })}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Document Illustration ─────────────────────────────────────────────────────
function DocumentIllustration({ scanning }: { scanning: boolean }) {
  return (
    <div style={{ position: "relative", width: 72, height: 90 }}>
      {/* Drop shadow layer */}
      <div style={{
        position: "absolute",
        bottom: -6, left: "50%", transform: "translateX(-50%)",
        width: 52, height: 12,
        background: "rgba(28,25,23,0.1)",
        borderRadius: "50%",
        filter: "blur(6px)",
      }} />
      {/* Document body */}
      <svg width="72" height="88" viewBox="0 0 72 88" fill="none" style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Page body */}
        <rect x="0.75" y="0.75" width="56.5" height="74.5" rx="7.25"
          fill="white" stroke={C.border} strokeWidth="1.5" />
        {/* Folded corner background */}
        <path d="M43 0.75 L57.25 14.75 L43 14.75 Z"
          fill="#F5F0EB" stroke={C.border} strokeWidth="1.5" strokeLinejoin="round" />
        {/* Fold crease */}
        <path d="M43 0.75 L43 14.75 L57.25 14.75"
          stroke={C.border} strokeWidth="1.5" />
        {/* Name line (bold) */}
        <rect x="8" y="22" width="32" height="3.5" rx="1.75" fill="rgba(28,25,23,0.22)" />
        {/* Title line */}
        <rect x="8" y="29" width="24" height="2.5" rx="1.25" fill="rgba(194,65,12,0.35)" />
        {/* Divider */}
        <rect x="8" y="35.5" width="42" height="1" rx="0.5" fill="rgba(28,25,23,0.07)" />
        {/* Body lines */}
        <rect x="8" y="40" width="38" height="2" rx="1" fill="rgba(28,25,23,0.12)" />
        <rect x="8" y="45" width="34" height="2" rx="1" fill="rgba(28,25,23,0.09)" />
        <rect x="8" y="50" width="40" height="2" rx="1" fill="rgba(28,25,23,0.09)" />
        <rect x="8" y="57" width="36" height="2" rx="1" fill="rgba(28,25,23,0.07)" />
        <rect x="8" y="62" width="28" height="2" rx="1" fill="rgba(28,25,23,0.07)" />
        <rect x="8" y="67" width="32" height="2" rx="1" fill="rgba(28,25,23,0.07)" />
      </svg>
      {/* AI scan overlay */}
      <div style={{
        position: "absolute", top: 1, left: 1,
        width: 56, height: 74,
        borderRadius: 7, overflow: "hidden",
        pointerEvents: "none",
      }}>
        <motion.div
          animate={scanning
            ? { y: ["-100%", "220%"], opacity: [0, 1, 1, 0] }
            : { opacity: 0 }}
          transition={scanning
            ? { duration: 1.1, ease: "linear", repeat: Infinity, repeatDelay: 0.25 }
            : { duration: 0.2 }}
          style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "38%",
            background: "linear-gradient(to bottom, transparent 0%, rgba(194,65,12,0.18) 40%, rgba(194,65,12,0.12) 60%, transparent 100%)",
          }}
        />
      </div>
      {/* AI badge */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            style={{
              position: "absolute", bottom: 0, right: -4,
              width: 22, height: 22, borderRadius: "50%",
              background: "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 8px rgba(194,65,12,0.4)",
            }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5L4.5 8L9 3" stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface WelcomeScreenProps {
  onResumeUploaded: (data: FullProfile) => void;
  onManual: () => void;
  onBack: () => void;
}

export function WelcomeScreen({ onResumeUploaded, onManual, onBack }: WelcomeScreenProps) {
  const [stage,           setStage]          = useState<Stage>("choice");
  const [isDragging,      setIsDragging]      = useState(false);
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  const [hasStartedAi,    setHasStartedAi]    = useState(false);
  const [showAiChat,      setShowAiChat]      = useState(false);
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>(["", ""]);
  const [isAiTyping,      setIsAiTyping]      = useState(false);
  const [showQuickReplies,setShowQuickReplies]= useState(false);
  const [userReply,       setUserReply]       = useState<string | null>(null);
  const fileRef   = useRef<HTMLInputElement>(null);
  const submitResume = useCallback(() => {
    // Step 5: skip extracting/progress; App will show "Setting up your profile".
    setTimeout(() => onResumeUploaded(MOCK_FULL), 100);
  }, [onResumeUploaded]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) submitResume();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.[0]) submitResume();
  };

  // ── Delayed AI onboarding conversation ──────────────────────────────────────
  useEffect(() => {
    if (stage !== "choice") return;
    if (hasStartedAi) return;
    setHasStartedAi(true);

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const run = async () => {
      await sleep(2000);
      if (cancelled) return;

      setShowAiChat(true);
      setIsAiTyping(true);

      // Type each paragraph word-by-word with small pauses.
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

        // Small natural pause between the two paragraphs.
        if (pIndex === 0) {
          await sleep(320);
        }
      }

      if (!cancelled) {
        setIsAiTyping(false);
        setShowQuickReplies(true);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [stage, hasStartedAi]);

  const handleQuickReply = (text: string) => {
    setUserReply(text);
    setShowQuickReplies(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: C.bg, fontFamily: "Inter, sans-serif" }}>

      {/* Ambient orbs */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: "280px", height: "280px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orbA} 0%, transparent 70%)`,
        transform: "translate(35%, -35%)",
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: "12%", left: "-12%",
        width: "240px", height: "240px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orbB} 0%, transparent 70%)`,
      }} />

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx"
        style={{ display: "none" }} onChange={handleFileChange} />

      <div className="flex flex-col flex-1 px-5 pt-10 pb-24">
        <AnimatePresence mode="wait">

          {/* ── CHOICE ─────────────────────────────────────────────────────── */}
          {stage === "choice" && (
            <motion.div key="choice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col flex-1">

              {/* ── Step indicator (Step 5 of 5) ───────────────────────────── */}
              <div className="mb-7">
                <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 6, flex: 1 }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background:
                            n < 5
                              ? "rgba(255,107,53,0.55)"
                              : "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: C.textSecondary, letterSpacing: "0.02em" }}>
                    Step 5 of 5
                  </span>
                </div>
              </div>

              {/* ── Greeting ──────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-7">

                {/* Lightning bolt icon */}
                

                <h1 style={{
                  fontSize: "clamp(23px, 6.5vw, 27px)", fontWeight: 800,
                  color: C.textPrimary, letterSpacing: "-0.04em",
                  lineHeight: 1.18, marginBottom: 8,
                }}>
                  Finally, tell us a bit about yourself.
                </h1>
                <p
                  aria-hidden="true"
                  style={{
                    display: "none",
                    fontSize: 12,
                    color: C.textMuted,
                    lineHeight: 1.65,
                    letterSpacing: "-0.01em",
                    maxWidth: 290,
                    margin: "0 auto",
                  }}
                >
                  Zappy finds jobs that fit{" "}
                  <span style={{ color: C.textPrimary, fontWeight: 600 }}>beyond keywords</span>
                  {" "}— based on your actual experience and goals.
                </p>
              </motion.div>

              {/* ── Upload card (primary) ──────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: 10 }}>
                <motion.div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onHoverStart={() => setIsUploadHovered(true)}
                  onHoverEnd={() => setIsUploadHovered(false)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 340, damping: 26 }}
                  style={{
                    borderRadius: 22,
                    background: isDragging ? "rgba(194,65,12,0.03)" : C.cardBg,
                    border: isDragging
                      ? "2px dashed rgba(194,65,12,0.5)"
                      : isUploadHovered
                        ? "1.5px solid rgba(194,65,12,0.3)"
                        : `1.5px solid ${C.border}`,
                    boxShadow: isUploadHovered
                      ? "0 10px 36px rgba(28,25,23,0.11)"
                      : "0 2px 12px rgba(28,25,23,0.06)",
                    cursor: "pointer",
                    padding: "22px 20px 20px",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border 0.2s, box-shadow 0.25s, background 0.2s",
                  }}>

                  {/* Recommended badge */}
                  

                  {/* Document + scan area */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                    <motion.div
                      animate={{ y: isUploadHovered ? -3 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}>
                      <DocumentIllustration scanning={isUploadHovered || isDragging} />
                    </motion.div>
                  </div>

                  {/* Text block */}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700,
                      color: C.textPrimary, letterSpacing: "-0.025em",
                      marginBottom: 4,
                    }}>
                      {isDragging ? "Drop to upload your resume" : "Upload your resume"}
                    </div>
                    <div style={{
                      fontSize: 13, color: C.textMuted,
                      letterSpacing: "-0.01em", marginBottom: 14,
                    }}>
                      AI reads and extracts your details in seconds
                    </div>

                    {/* CTA pill */}
                    <motion.div
                      animate={{
                        background: isUploadHovered || isDragging
                          ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)"
                          : "rgba(194,65,12,0.07)",
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: "inline-flex", alignItems: "center",
                        gap: 6, borderRadius: 10,
                        padding: "8px 18px",
                      }}>
                      {/* Upload arrow icon */}
                      <motion.div
                        animate={isUploadHovered ? { y: [-1, -3, -1] } : { y: 0 }}
                        transition={{ duration: 0.6, repeat: isUploadHovered ? Infinity : 0 }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 10V4M4 7l3-3 3 3"
                            stroke={isUploadHovered || isDragging ? "white" : C.brand}
                            strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2 12h10"
                            stroke={isUploadHovered || isDragging ? "white" : C.brand}
                            strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </motion.div>
                      <motion.span
                        animate={{
                          color: isUploadHovered || isDragging ? "#ffffff" : C.brand,
                        }}
                        transition={{ duration: 0.2 }}
                        style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>
                        {isDragging ? "Drop file here" : "Tap to upload"}
                      </motion.span>
                    </motion.div>

                    <div style={{
                      fontSize: 11, color: C.textSecondary,
                      marginTop: 10, letterSpacing: "0.02em",
                    }}>
                      PDF · DOC · DOCX supported
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* ── What Zappy extracts ────────────────────────────────────── */}
              

              {/* ── OR divider ────────────────────────────────────────────── */}
              {/* Resume upload is required to proceed */}
              {/* ── OR divider ────────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, marginTop: 8 }}
              >
                <div style={{ flex: 1, height: 1, background: C.border }} />
                <span style={{ fontSize: 11, color: C.textSecondary, letterSpacing: "0.04em" }}>or</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </motion.div>

              {/* ── Manual entry ──────────────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.54, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.button
                  onClick={onManual}
                  whileHover={{ backgroundColor: "#eeebe7", y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 16,
                    background: "#f5f3f0",
                    border: "none",
                    boxShadow: "none",
                    cursor: "pointer", textAlign: "left" as const,
                    fontFamily: "Inter, sans-serif",
                    transition: "background 0.18s",
                  }}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                    background: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 12l1.2-4 7.5-7.5 2.8 2.8L6 11 2 12z"
                        stroke={C.textMuted} strokeWidth="1.3"
                        strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.5 2.5l2.8 2.8"
                        stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.02em", marginBottom: 2 }}>
                      Fill in manually
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.textMuted, letterSpacing: "-0.01em" }}>
                      Takes about 3 minutes
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <path d="M4.5 2.5l5 5-5 5"
                        stroke={C.textMuted} strokeWidth="1.4"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </motion.button>
              </motion.div>
              {/* ── AI conversational onboarding with Zappy ───────────────── */}
              <AnimatePresence>
                {showAiChat && (
                  <motion.div
                    key="zappy-chat"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ marginTop: 18 }}
                  >
                    {/* Chat thread */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {/* AI bubble */}
                      <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div
                          style={{
                            maxWidth: "78%",
                            borderRadius: 16,
                            padding: "10px 14px",
                            background: "#FFFFFF",
                            border: `1px solid ${C.border}`,
                            fontSize: 13,
                            color: C.textPrimary,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.55,
                          }}
                        >
                          <p style={{ margin: 0, marginBottom: 8 }}>
                            {typedParagraphs[0]}
                          </p>
                          <p style={{ margin: 0 }}>
                            {typedParagraphs[1]}
                          </p>
                        </div>
                      </div>

                      {/* User reply bubble (after quick reply tap) */}
                      {userReply && (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <div
                            style={{
                              maxWidth: "72%",
                              borderRadius: 16,
                              padding: "10px 14px",
                              background: "#FF6A2B",
                              color: "#FFFFFF",
                              fontSize: 13,
                              fontWeight: 500,
                              letterSpacing: "-0.01em",
                              lineHeight: 1.55,
                            }}
                          >
                            {userReply}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick reply chips (shown only after AI finishes typing) */}
                    <AnimatePresence>
                      {showQuickReplies && !isAiTyping && (
                        <motion.div
                          key="zappy-quick-replies"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 14,
                            marginBottom: 10,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleQuickReply("Yes, let's start")}
                            style={{
                              border: "none",
                              cursor: "pointer",
                              borderRadius: 999,
                              padding: "10px 16px",
                              background: "#FFF1E8",
                              color: "#FF6A2B",
                              fontSize: 14,
                              fontWeight: 500,
                              letterSpacing: "-0.01em",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            Yes, let's start
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickReply("No, I'll answer later")}
                            style={{
                              border: "none",
                              cursor: "pointer",
                              borderRadius: 999,
                              padding: "10px 16px",
                              background: "#FFF1E8",
                              color: "#FF6A2B",
                              fontSize: 14,
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

                    {/* Prompt input bar (non-interactive visual affordance) */}
                    <div
                      style={{
                        marginTop: 4,
                        borderRadius: 999,
                        border: `1px solid ${C.border}`,
                        padding: "9px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        background: "#FFFFFF",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: C.textSecondary,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Type a reply to Zappy…
                      </span>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "rgba(28,25,23,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path
                            d="M2 9l7-3.5L2 2v2.5L6.2 5.5 2 6.5V9z"
                            stroke={C.textSecondary}
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

          {/* Extracting/progress UI removed. After upload, App shows "Setting up your profile". */}

        </AnimatePresence>
      </div>

      <div style={{
        flexShrink: 0,
        position: "sticky",
        bottom: 0,
        zIndex: 20,
        padding: "12px 20px 20px",
        background: "rgba(253,251,248,0.96)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 12,
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "13px 20px", borderRadius: 14,
            border: `1.5px solid ${C.border}`, background: "white",
            color: C.textMuted, fontSize: "14px", fontWeight: 500,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Previous
        </motion.button>
      </div>
    </div>
  );
}