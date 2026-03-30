import { useState, useEffect, useMemo, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic, Sparkles,
  BarChart3, Users, Eye, ChevronDown, Check,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const C = {
  bg: "#FDFBF8",
  primary: "#1C1917",
  brand: "#EA580C",
  brandLight: "rgba(234,88,12,0.08)",
  brandBorder: "rgba(234,88,12,0.18)",
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSec: "#A8A29E",
  border: "rgba(28,25,23,0.07)",
  white: "#FFFFFF",
};

interface CallInitiationScreenProps {
  firstName: string;
  /** Ordered job category labels (first = primary). Used for call focus; user can switch when length > 1. */
  jobCategoryLabels: string[];
  onStartCall: (focusedJobCategory: string) => void;
  onSkip: () => void;
}

const OUTCOMES = [
  {
    icon: <BarChart3 size={15} color={C.brand} strokeWidth={2} />,
    title: "5× more visibility",
    desc: "Your profile gets surfaced to recruiters actively hiring",
  },
  {
    icon: <Users size={15} color={C.brand} strokeWidth={2} />,
    title: "Direct recruiter intros",
    desc: "Zappy pitches you to hiring managers — no cold applications",
  },
  {
    icon: <Eye size={15} color={C.brand} strokeWidth={2} />,
    title: "Smarter matches",
    desc: "We learn what makes you unique to refine your job recommendations",
  },
];

export function CallInitiationScreen({
  firstName,
  jobCategoryLabels,
  onStartCall,
  onSkip,
}: CallInitiationScreenProps) {
  const sheetTitleId = useId();
  const sheetDescId = useId();
  const [ready, setReady] = useState(false);
  const [focusSheetOpen, setFocusSheetOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);

  const labels = useMemo(
    () => (jobCategoryLabels.length > 0 ? jobCategoryLabels : ["your expertise"]),
    [jobCategoryLabels],
  );
  const hasMultipleFocusOptions = labels.length > 1;
  const focusedLabel = labels[Math.min(focusIndex, labels.length - 1)] ?? "your expertise";

  useEffect(() => {
    setFocusIndex((i) => Math.min(i, Math.max(0, labels.length - 1)));
  }, [labels.length]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!focusSheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [focusSheetOpen]);

  const lowEndAndroid = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");
    const memory = "deviceMemory" in navigator
      ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
      : 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    return isAndroid && (memory <= 4 || cores <= 6);
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
        background: C.bg,
      }}
    >
      {/* ── Ambient background ──────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{
            x: lowEndAndroid ? [0, 16, -10, 0] : [0, 22, -14, 0],
            y: lowEndAndroid ? [0, -14, 10, 0] : [0, -20, 14, 0],
            scale: [1, 1.12, 0.92, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "8%",
            right: "-10%",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,143,86,0.14) 0%, transparent 65%)",
            filter: "blur(40px)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -12, 8, 0],
            y: [0, 10, -12, 0],
            scale: [1, 0.9, 1.08, 1],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: "25%",
            left: "-8%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(234,88,12,0.07) 0%, transparent 60%)",
            filter: "blur(45px)",
          }}
        />
      </div>

      {/* ── Scrollable content ──────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overscrollBehavior: "contain",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ padding: "48px 22px 140px" }}>

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
            style={{ textAlign: "center", marginBottom: 32 }}
          >
            {/* Pulsing orb */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    "0 0 0 0px rgba(234,88,12,0.12), 0 4px 24px rgba(234,88,12,0.12)",
                    "0 0 0 14px rgba(234,88,12,0.03), 0 6px 32px rgba(234,88,12,0.18)",
                    "0 0 0 0px rgba(234,88,12,0.12), 0 4px 24px rgba(234,88,12,0.12)",
                  ],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(255,245,238,0.8) 100%)",
                  border: "1.5px solid rgba(234,88,12,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mic size={26} color={C.brand} strokeWidth={1.8} />
              </motion.div>
            </div>

            <h1
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: C.primary,
                letterSpacing: "-0.045em",
                lineHeight: 1.18,
                margin: "0 0 10px",
              }}
            >
              One conversation,
              <br />
              <span style={{ color: C.brand }}>5× more opportunities</span>
            </h1>

            <p
              style={{
                fontSize: 14,
                color: C.textMuted,
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
                maxWidth: 310,
                margin: "0 auto",
              }}
            >
              A quick chat with Zappy helps recruiters see the real you, not just a resume.
            </p>
          </motion.div>

          {/* ── Call focus (primary category; switchable when multiple) ─ */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18, ease: EASE }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: 28,
              gap: 6,
            }}
          >
            {hasMultipleFocusOptions ? (
              <button
                type="button"
                onClick={() => setFocusSheetOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  minHeight: 44,
                  borderRadius: 12,
                  background: "rgba(234,88,12,0.05)",
                  border: "1px solid rgba(234,88,12,0.14)",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.brand,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: C.brand,
                    letterSpacing: "-0.01em",
                    textAlign: "left",
                  }}
                >
                  Focused on {focusedLabel}
                </span>
                <ChevronDown size={16} color={C.brand} strokeWidth={2.2} aria-hidden />
              </button>
            ) : (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 12,
                  background: "rgba(234,88,12,0.05)",
                  border: "1px solid rgba(234,88,12,0.1)",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.brand,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: C.brand,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Focused on {focusedLabel}
                </span>
              </div>
            )}
            {hasMultipleFocusOptions && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: C.textSec,
                  letterSpacing: "-0.01em",
                }}
              >
                Tap to change call focus
              </span>
            )}
          </motion.div>

          {/* ── What happens after ────────────────────────────────────── */}
          <AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
                style={{
                  borderRadius: 20,
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  boxShadow: "0 2px 16px rgba(28,25,23,0.04)",
                  padding: "18px 18px 16px",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 9,
                      background: "rgba(234,88,12,0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={13} color={C.brand} strokeWidth={2.2} />
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: C.primary,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    What you unlock
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {OUTCOMES.map((o, i) => (
                    <motion.div
                      key={o.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.32 + i * 0.08, ease: EASE }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: C.brandLight,
                          border: `1px solid ${C.brandBorder}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {o.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: C.primary,
                            margin: 0,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.25,
                          }}
                        >
                          {o.title}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: C.textMuted,
                            margin: "3px 0 0",
                            lineHeight: 1.45,
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {o.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── Sticky CTAs ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px calc(14px + env(safe-area-inset-bottom))",
          borderTop: `1px solid ${C.border}`,
          background: "rgba(253,251,248,0.94)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onStartCall(focusedLabel)}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 15,
            border: "none",
            background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
            color: "white",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 6px 24px rgba(234,88,12,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
          }}
        >
          <Mic size={17} color="white" strokeWidth={2} />
          Take the call
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onSkip}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 13,
            border: `1.5px solid ${C.border}`,
            background: "transparent",
            color: C.textMuted,
            fontSize: 13.5,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          I'll do this later
        </motion.button>
      </motion.div>

      {/* ── Mobile sheet: switch call focus among selected categories ─ */}
      <AnimatePresence>
        {focusSheetOpen && (
          <motion.div
            key="call-focus-sheet"
            role="presentation"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              type="button"
              aria-label="Close"
              onClick={() => setFocusSheetOpen(false)}
              style={{
                position: "absolute",
                inset: 0,
                border: "none",
                padding: 0,
                margin: 0,
                background: "rgba(28,25,23,0.45)",
                cursor: "pointer",
              }}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={sheetTitleId}
              aria-describedby={sheetDescId}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                zIndex: 1,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                background: C.white,
                padding: "12px 0 calc(16px + env(safe-area-inset-bottom))",
                boxShadow: "0 -8px 40px rgba(28,25,23,0.12)",
                maxHeight: "72vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(28,25,23,0.12)",
                  margin: "0 auto 14px",
                  flexShrink: 0,
                }}
              />
              <h2
                id={sheetTitleId}
                style={{
                  margin: "0 20px 4px",
                  fontSize: 17,
                  fontWeight: 700,
                  color: C.primary,
                  letterSpacing: "-0.03em",
                }}
              >
                Call focus
              </h2>
              <p
                id={sheetDescId}
                style={{
                  margin: "0 20px 14px",
                  fontSize: 13,
                  color: C.textMuted,
                  lineHeight: 1.45,
                  letterSpacing: "-0.01em",
                }}
              >
                {firstName
                  ? `${firstName.charAt(0).toUpperCase() + firstName.slice(1)}, pick where Zappy should dig in—`
                  : "Pick where Zappy should dig in—"}
                questions follow{" "}
                <span style={{ fontWeight: 600, color: C.primary }}>this focus</span>.
              </p>
              <div
                style={{
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                  padding: "0 12px",
                }}
              >
                {labels.map((label, i) => {
                  const selected = i === focusIndex;
                  return (
                    <button
                      key={`${label}-${i}`}
                      type="button"
                      onClick={() => {
                        setFocusIndex(i);
                        setFocusSheetOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        minHeight: 52,
                        padding: "12px 12px",
                        marginBottom: 4,
                        borderRadius: 12,
                        border: selected ? `1.5px solid rgba(234,88,12,0.35)` : `1px solid ${C.border}`,
                        background: selected ? "rgba(234,88,12,0.05)" : "transparent",
                        cursor: "pointer",
                        fontFamily: "Inter, sans-serif",
                        textAlign: "left",
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: selected ? 600 : 500,
                          color: C.primary,
                          letterSpacing: "-0.02em",
                          flex: 1,
                        }}
                      >
                        {label}
                        {i === 0 && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: 11,
                              fontWeight: 600,
                              color: C.brand,
                              letterSpacing: "0.02em",
                              textTransform: "uppercase" as const,
                            }}
                          >
                            Primary
                          </span>
                        )}
                      </span>
                      {selected ? (
                        <Check size={18} color={C.brand} strokeWidth={2.5} aria-hidden />
                      ) : (
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            border: `1.5px solid ${C.border}`,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
