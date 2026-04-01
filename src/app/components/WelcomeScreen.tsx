import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#FDFBF8",
  primary: "#1C1917",
  brand: "#EA580C",
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSecondary: "#A8A29E",
  border: "rgba(28,25,23,0.09)",
  cardBg: "#FFFFFF",
  orbA: "rgba(234,88,12,0.07)",
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
  specialization?: string;
  year: string; grade: string;
}
export interface JobPreferences {
  /** @deprecated Legacy single category id or custom label; prefer `categories`. */
  category?: string;
  /** @deprecated Legacy flat role list; prefer `rolesByCategory` when using multiple categories. */
  roles?: string[];
  /** Up to 3 job category ids (from onboarding list), in selection order. */
  categories?: string[];
  /** Role titles keyed by category id; max 3 roles per category in the UI. */
  rolesByCategory?: Record<string, string[]>;
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
  preferences: {
    categories: ["design", "product"],
    rolesByCategory: {
      design: ["Product Designer", "UI Designer"],
      product: ["Product Manager"],
    },
    workSetups: ["hybrid", "remote"],
    locations: ["Bangalore", "Mumbai", "Remote"],
    priorities: ["meaningful", "smart", "wlb"],
    salaryMin: 25,
    salaryMax: 45,
    salaryCurrency: "INR",
    switchTimeline: "1month",
  },
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
              background: "radial-gradient(circle, rgba(234,88,12,0.18) 0%, rgba(234,88,12,0.06) 50%, transparent 70%)",
              filter: "blur(4px)",
            }} />
        )}
      </AnimatePresence>
      <svg width="128" height="128" viewBox="0 0 128 128" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8F56" />
            <stop offset="100%" stopColor="#EA580C" />
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
                    background: "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
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
function DocumentIllustration({ hovered }: { hovered: boolean }) {
  return (
    <div style={{ position: "relative", width: 80, height: 100 }}>
      {/* Ambient glow behind the document */}
      <motion.div
        animate={{ opacity: [0.35, 0.55, 0.35], scale: [1, 1.06, 1] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        style={{
          position: "absolute",
          top: 10, left: "50%", transform: "translateX(-50%)",
          width: 64, height: 64, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Soft drop shadow */}
      <motion.div
        animate={{ opacity: hovered ? 0.18 : 0.1, width: hovered ? 58 : 50 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "absolute",
          bottom: -4, left: "50%", transform: "translateX(-50%)",
          height: 10, borderRadius: "50%",
          background: "rgba(28,25,23,1)",
          filter: "blur(7px)",
        }}
      />
      {/* Main document */}
      <motion.div
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        style={{ position: "relative" }}
      >
        <svg width="64" height="82" viewBox="0 0 64 82" fill="none">
          <rect x="0.75" y="0.75" width="62.5" height="80.5" rx="8.25"
            fill="white" stroke="rgba(28,25,23,0.1)" strokeWidth="1.5" />
          {/* Folded corner */}
          <path d="M47 0.75L63.25 16.75H47Z" fill="#F8F4F0" stroke="rgba(28,25,23,0.1)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M47 0.75V16.75H63.25" stroke="rgba(28,25,23,0.1)" strokeWidth="1.5" />
          {/* Avatar circle placeholder */}
          <circle cx="17" cy="28" r="6" fill="rgba(234,88,12,0.1)" stroke="rgba(234,88,12,0.25)" strokeWidth="1" />
          <circle cx="17" cy="26.5" r="2" fill="rgba(234,88,12,0.25)" />
          <path d="M13 31c0-2.2 1.8-3 4-3s4 .8 4 3" stroke="rgba(234,88,12,0.25)" strokeWidth="0.9" strokeLinecap="round" />
          {/* Name + title lines */}
          <rect x="27" y="25" width="26" height="3" rx="1.5" fill="rgba(28,25,23,0.18)" />
          <rect x="27" y="31" width="18" height="2.5" rx="1.25" fill="rgba(234,88,12,0.3)" />
          {/* Divider */}
          <rect x="10" y="40" width="44" height="0.75" rx="0.375" fill="rgba(28,25,23,0.06)" />
          {/* Content lines */}
          <rect x="10" y="46" width="40" height="2" rx="1" fill="rgba(28,25,23,0.1)" />
          <rect x="10" y="52" width="36" height="2" rx="1" fill="rgba(28,25,23,0.07)" />
          <rect x="10" y="58" width="42" height="2" rx="1" fill="rgba(28,25,23,0.07)" />
          <rect x="10" y="66" width="30" height="2" rx="1" fill="rgba(28,25,23,0.05)" />
          <rect x="10" y="72" width="24" height="2" rx="1" fill="rgba(28,25,23,0.05)" />
        </svg>
      </motion.div>

      {/* Always-on scan line */}
      <div style={{
        position: "absolute", top: 1, left: 0.75,
        width: 62.5, height: 80.5,
        borderRadius: 8, overflow: "hidden",
        pointerEvents: "none",
      }}>
        <motion.div
          animate={{ y: ["-100%", "250%"] }}
          transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }}
          style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "30%",
            background: "linear-gradient(to bottom, transparent, rgba(234,88,12,0.1) 40%, rgba(234,88,12,0.06) 60%, transparent)",
          }}
        />
      </div>

      {/* AI sparkle badge — always visible, pulses */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], boxShadow: [
          "0 2px 8px rgba(234,88,12,0.3)",
          "0 3px 12px rgba(234,88,12,0.45)",
          "0 2px 8px rgba(234,88,12,0.3)",
        ]}}
        transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
        style={{
          position: "absolute", bottom: 2, right: 0,
          width: 24, height: 24, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 2,
        }}
      >
        {/* Sparkle / AI icon */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1l1.1 3.2L10 5.5 7.1 7l-1.1 4L4.9 7 2 5.5l2.9-1.3L6 1z" fill="white" />
        </svg>
      </motion.div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface WelcomeScreenProps {
  onResumeUploaded: (data: FullProfile) => void;
  onManual: () => void;
  onBack: () => void;
  /** Use transparent surface when embedded in desktop onboarding chrome. */
  transparentSurface?: boolean;
}

function formatResumeFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_RESUME_BYTES = 10 * 1024 * 1024;

function getResumeValidationError(file: File): string | null {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!["pdf", "doc", "docx"].includes(ext)) {
    return "Use a PDF, Word (.doc), or .docx file.";
  }
  if (file.size > MAX_RESUME_BYTES) {
    return "File must be 10 MB or smaller.";
  }
  return null;
}

function dataTransferHasFiles(e: React.DragEvent): boolean {
  const types = e.dataTransfer.types;
  if (!types || types.length === 0) return false;
  return [...types].includes("Files");
}

export function WelcomeScreen({ onResumeUploaded, onManual, onBack, transparentSurface = false }: WelcomeScreenProps) {
  const [stage,           setStage]          = useState<Stage>("choice");
  const [isDragging,      setIsDragging]      = useState(false);
  const [isUploadHovered, setIsUploadHovered] = useState(false);
  const [hasStartedAi,    setHasStartedAi]    = useState(false);
  const [showAiChat,      setShowAiChat]      = useState(false);
  const [typedParagraphs, setTypedParagraphs] = useState<string[]>(["", ""]);
  const [isAiTyping,      setIsAiTyping]      = useState(false);
  const [showQuickReplies,setShowQuickReplies]= useState(false);
  const [userReply,       setUserReply]       = useState<string | null>(null);
  const [resumeFile,      setResumeFile]      = useState<File | null>(null);
  const [resumeDropError, setResumeDropError] = useState<string | null>(null);
  const fileRef   = useRef<HTMLInputElement>(null);
  const resumePreviewUrlRef = useRef<string | null>(null);

  const revokeResumePreview = useCallback(() => {
    if (resumePreviewUrlRef.current) {
      URL.revokeObjectURL(resumePreviewUrlRef.current);
      resumePreviewUrlRef.current = null;
    }
  }, []);

  const setResumeFromFile = useCallback(
    (file: File) => {
      revokeResumePreview();
      resumePreviewUrlRef.current = URL.createObjectURL(file);
      setResumeFile(file);
    },
    [revokeResumePreview],
  );

  useEffect(() => () => revokeResumePreview(), [revokeResumePreview]);

  const submitResume = useCallback(() => {
    // Step 6 (resume): skip extracting/progress; App will show "Setting up your profile".
    setTimeout(() => onResumeUploaded(MOCK_FULL), 100);
  }, [onResumeUploaded]);

  const handleContinue = useCallback(() => {
    if (!resumeFile) return;
    submitResume();
  }, [resumeFile, submitResume]);

  const handleViewResume = useCallback(() => {
    const url = resumePreviewUrlRef.current;
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const handleReplaceResume = useCallback(() => {
    revokeResumePreview();
    setResumeFile(null);
    setResumeDropError(null);
    const input = fileRef.current;
    if (input) input.value = "";
    setTimeout(() => input?.click(), 0);
  }, [revokeResumePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const err = getResumeValidationError(f);
      if (err) {
        setResumeDropError(err);
        window.setTimeout(() => setResumeDropError(null), 4500);
      } else {
        setResumeDropError(null);
        setResumeFromFile(f);
      }
    }
    e.target.value = "";
  };

  const handleResumeDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (resumeFile) return;
      if (dataTransferHasFiles(e)) setIsDragging(true);
    },
    [resumeFile],
  );

  const handleResumeDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const related = e.relatedTarget as Node | null;
    if (related && (e.currentTarget as HTMLElement).contains(related)) return;
    setIsDragging(false);
  }, []);

  const handleResumeDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (resumeFile) return;
      e.dataTransfer.dropEffect = "copy";
      /* Some browsers only expose file types after dragOver, not dragEnter. */
      if (dataTransferHasFiles(e)) setIsDragging(true);
    },
    [resumeFile],
  );

  const handleResumeDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (resumeFile) return;
      const f = e.dataTransfer.files?.[0];
      if (!f) return;
      const err = getResumeValidationError(f);
      if (err) {
        setResumeDropError(err);
        window.setTimeout(() => setResumeDropError(null), 4500);
        return;
      }
      setResumeDropError(null);
      setResumeFromFile(f);
    },
    [resumeFile, setResumeFromFile],
  );

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
      style={{
        background: transparentSurface ? "transparent" : C.bg,
        fontFamily: "Inter, sans-serif",
        minHeight: transparentSurface ? "100%" : "100svh",
        height: transparentSurface ? "100%" : "100svh",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>

      {/* Ambient orbs — mobile only; desktop uses glass chrome behind this view */}
      {!transparentSurface && (
        <>
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
        </>
      )}

      <input ref={fileRef} type="file" accept=".pdf,.doc,.docx"
        style={{ display: "none" }} onChange={handleFileChange} />

      <AnimatePresence mode="wait">

        {/* ── CHOICE ─────────────────────────────────────────────────────── */}
        {stage === "choice" && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 flex-col px-0"
          >

              {/* ── Step indicator (step 6 of 6; steps 1–5 = JobPreferencesScreen) ── */}
              <div className="mb-7">
                <div style={{ display: "flex", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 6, flex: 1 }}>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div
                        key={n}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background:
                            n < 6
                              ? "rgba(234,88,12,0.55)"
                              : transparentSurface
                                ? "#EA580C"
                                : "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <span style={{ fontSize: 11, color: C.textSecondary, letterSpacing: "0.02em" }}>
                    Step 6 of 6
                  </span>
                </div>
              </div>

              {/* ── Greeting (warm / story-led) ───────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-8">

                <h1 style={{
                  fontSize: "clamp(24px, 6.8vw, 28px)", fontWeight: 700,
                  color: C.textPrimary, letterSpacing: "-0.045em",
                  lineHeight: 1.22, marginBottom: 12,
                }}>
                  Tell us your story
                </h1>
                <p
                  style={{
                    fontSize: 14,
                    color: C.textMuted,
                    lineHeight: 1.65,
                    letterSpacing: "-0.015em",
                    maxWidth: 318,
                    margin: "0 auto",
                    fontWeight: 400,
                  }}
                >
                  {"You've shared what you're looking for. Now help us understand your journey."}
                </p>
              </motion.div>

              {/* ── Upload card (primary — always alive) ───────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginBottom: 10 }}>
                <motion.div
                  role="group"
                  aria-label="Upload resume: choose a file or drag and drop"
                  onClick={resumeFile ? undefined : () => fileRef.current?.click()}
                  onDragEnter={handleResumeDragEnter}
                  onDragLeave={handleResumeDragLeave}
                  onDragOver={handleResumeDragOver}
                  onDrop={handleResumeDrop}
                  onHoverStart={() => !resumeFile && setIsUploadHovered(true)}
                  onHoverEnd={() => setIsUploadHovered(false)}
                  whileHover={resumeFile ? undefined : { y: -4 }}
                  whileTap={resumeFile ? undefined : { scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 340, damping: 26 }}
                  style={{
                    borderRadius: 22,
                    background: isDragging
                      ? "rgba(234,88,12,0.025)"
                      : transparentSurface
                        ? "#FFFFFF"
                        : C.cardBg,
                    border: isDragging
                      ? "2px dashed rgba(234,88,12,0.45)"
                      : resumeFile
                        ? "1.5px solid rgba(234,88,12,0.22)"
                        : transparentSurface
                          ? "1.5px dashed rgba(28,25,23,0.12)"
                          : "1.5px solid rgba(28,25,23,0.06)",
                    boxShadow: transparentSurface
                      ? "none"
                      : resumeFile
                        ? "0 4px 24px rgba(234,88,12,0.08)"
                        : "0 4px 24px rgba(28,25,23,0.06)",
                    cursor: resumeFile ? "default" : "pointer",
                    padding: transparentSurface ? "32px 28px 28px" : "28px 20px 22px",
                    position: "relative",
                    overflow: "hidden",
                    transition: "border 0.25s, box-shadow 0.3s, background 0.25s",
                  }}>

                  {!resumeFile && !transparentSurface && (
                    <>
                      {/* Floating ambient particles */}
                      <motion.div
                        animate={{ y: [-6, 6, -6], x: [0, 4, 0], opacity: [0.25, 0.55, 0.25] }}
                        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
                        style={{
                          position: "absolute", top: 18, right: 28,
                          width: 4, height: 4, borderRadius: "50%",
                          background: "rgba(234,88,12,0.2)", pointerEvents: "none",
                        }}
                      />
                      <motion.div
                        animate={{ y: [4, -5, 4], x: [0, -3, 0], opacity: [0.2, 0.45, 0.2] }}
                        transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity, delay: 0.8 }}
                        style={{
                          position: "absolute", top: 50, left: 24,
                          width: 3, height: 3, borderRadius: "50%",
                          background: "rgba(234,88,12,0.15)", pointerEvents: "none",
                        }}
                      />
                      <motion.div
                        animate={{ y: [-3, 5, -3], opacity: [0.15, 0.35, 0.15] }}
                        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1.6 }}
                        style={{
                          position: "absolute", bottom: 30, right: 40,
                          width: 3.5, height: 3.5, borderRadius: "50%",
                          background: "rgba(234,88,12,0.12)", pointerEvents: "none",
                        }}
                      />
                    </>
                  )}

                  {resumeFile ? (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: transparentSurface
                            ? "rgba(234,88,12,0.08)"
                            : "linear-gradient(135deg, rgba(255,143,86,0.12) 0%, rgba(234,88,12,0.07) 100%)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                              stroke="rgba(234,88,12,0.72)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="rgba(234,88,12,0.72)" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      <div style={{
                        fontSize: 11, fontWeight: 500, color: C.textSecondary,
                        letterSpacing: "0.02em",
                        marginBottom: 7,
                      }}>
                        Resume attached
                      </div>
                      <div style={{
                        fontSize: 15, fontWeight: 600, color: C.textPrimary,
                        letterSpacing: "-0.03em", marginBottom: 6, lineHeight: 1.35,
                        wordBreak: "break-word" as const,
                        padding: "0 4px",
                      }}>
                        {resumeFile.name}
                      </div>
                      <div style={{
                        fontSize: 12, color: C.textMuted, letterSpacing: "-0.01em", marginBottom: 20,
                      }}>
                        {formatResumeFileSize(resumeFile.size)}
                        {" · "}
                        {(resumeFile.name.split(".").pop() || "").toUpperCase()}
                      </div>
                      <div style={{
                        display: "flex", flexWrap: "wrap" as const, gap: 10,
                        justifyContent: "center", alignItems: "center",
                      }}>
                        <motion.button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleViewResume(); }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "11px 18px", borderRadius: 12,
                            border: "none",
                            background: "rgba(234,88,12,0.1)",
                            color: C.brand, fontSize: 13, fontWeight: 600,
                            letterSpacing: "-0.01em", cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                            boxShadow: "none",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.5 7s2.5-4 5.5-4 5.5 4 5.5 4-2.5 4-5.5 4S1.5 7 1.5 7z"
                              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.4" />
                          </svg>
                          View file
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleReplaceResume(); }}
                          whileTap={{ scale: 0.97 }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "11px 18px", borderRadius: 12,
                            border: "none",
                            background: "transparent",
                            color: C.textMuted, fontSize: 13, fontWeight: 500,
                            letterSpacing: "-0.01em", cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4"
                              strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Replace file
                        </motion.button>
                      </div>
                      <div style={{
                        fontSize: 11, color: C.textSecondary,
                        marginTop: 14, letterSpacing: "0.01em", lineHeight: 1.4,
                      }}>
                        {"PDF · DOC · DOCX  ·  up to 10 MB"}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Document illustration — always animating */}
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
                        <DocumentIllustration hovered={isUploadHovered || isDragging} />
                      </div>

                      {/* Minimal text — visual-first */}
                      <div style={{ textAlign: "center" }}>
                        <div style={{
                          fontSize: 16, fontWeight: 650,
                          color: C.textPrimary, letterSpacing: "-0.03em",
                          marginBottom: 14,
                        }}>
                          {isDragging
                            ? "Drop your resume"
                            : transparentSurface
                              ? "Drag and drop or upload your resume"
                              : "Upload your resume"}
                        </div>
                        {/* CTA button with breathing arrow */}
                        <motion.div
                          animate={
                            transparentSurface
                              ? {
                                  background: isUploadHovered || isDragging ? "#EA580C" : "rgba(234,88,12,0.08)",
                                }
                              : {
                                  background: isUploadHovered || isDragging
                                    ? "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)"
                                    : "linear-gradient(90deg, rgba(234,88,12,0.08), rgba(234,88,12,0.04))",
                                }
                          }
                          transition={{ duration: 0.25 }}
                          style={{
                            display: "inline-flex", alignItems: "center",
                            gap: 7, borderRadius: 12,
                            padding: "10px 22px",
                          }}
                        >
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}>
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
                            animate={{ color: isUploadHovered || isDragging ? "#ffffff" : C.brand }}
                            transition={{ duration: 0.2 }}
                            style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.01em" }}>
                            {isDragging ? "Release to add" : "Choose a file"}
                          </motion.span>
                        </motion.div>

                        <div style={{
                          fontSize: 11, color: C.textSecondary,
                          marginTop: 12, letterSpacing: "0.01em", lineHeight: 1.4,
                        }}>
                          {"PDF · DOC · DOCX  ·  up to 10 MB"}
                        </div>
                        {resumeDropError && (
                          <div
                            role="alert"
                            style={{
                              fontSize: 12,
                              color: "#B91C1C",
                              marginTop: 10,
                              fontWeight: 600,
                              lineHeight: 1.4,
                            }}
                          >
                            {resumeDropError}
                          </div>
                        )}
                      </div>
                    </>
                  )}
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
                <span style={{ fontSize: 11, color: C.textSecondary, letterSpacing: "0.06em", fontStyle: "italic" }}>or</span>
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
                  whileHover={{ backgroundColor: transparentSurface ? "#F0EEEA" : "#eeebe7", y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 16,
                    background: transparentSurface ? "rgba(255, 255, 255, 0.3)" : "#f5f3f0",
                    border: transparentSurface ? `1px solid ${C.border}` : "none",
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
                    <div style={{ fontSize: 12, fontWeight: 500, color: C.textMuted, letterSpacing: "-0.01em", lineHeight: 1.4 }}>
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

                    {/* Quick reply chips */}
                    <AnimatePresence>
                      {showQuickReplies && !isAiTyping && (
                        <motion.div
                          key="zappy-quick-replies"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}
                        >
                          <button
                            type="button"
                            onClick={() => handleQuickReply("Yes, let's start")}
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
                            onClick={() => handleQuickReply("No, I'll answer later")}
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

      <div style={{
        flexShrink: 0,
        position: "sticky",
        bottom: 0,
        zIndex: 20,
        padding: transparentSurface
          ? "32px 0 8px"
          : "12px 20px calc(20px + env(safe-area-inset-bottom))",
        background: transparentSurface ? "transparent" : "rgba(253,251,248,0.96)",
        backdropFilter: transparentSurface ? "none" : "blur(12px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          aria-label="Go back"
          style={{
            minHeight: "44px",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            gap: 6, padding: "10px 10px", borderRadius: 10,
            border: "none", background: "transparent",
            color: C.textMuted, fontSize: "14px", fontWeight: 500,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ letterSpacing: "-0.01em" }}>Previous</span>
        </motion.button>

        <motion.button
          whileTap={resumeFile ? { scale: 0.97 } : {}}
          onClick={handleContinue}
          disabled={!resumeFile}
          aria-disabled={!resumeFile}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "13px 28px", borderRadius: 14, border: "none",
            background: resumeFile
              ? transparentSurface
                ? "#EA580C"
                : "linear-gradient(90deg, #FF8F56 0%, #EA580C 100%)"
              : "rgba(28,25,23,0.2)",
            color: resumeFile ? "white" : "rgba(255,255,255,0.55)", fontSize: "14px", fontWeight: 600,
            letterSpacing: "-0.01em",
            cursor: resumeFile ? "pointer" : "not-allowed",
            transition: "background 0.2s, box-shadow 0.2s",
            fontFamily: "Inter, sans-serif",
            boxShadow: resumeFile && !transparentSurface ? "0 4px 16px rgba(234,88,12,0.35)" : "none",
          }}
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2l5 5-5 5" stroke={resumeFile ? "white" : "rgba(255,255,255,0.45)"} strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}