import {
  useState,
  useEffect,
  useMemo,
  useId,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  BarChart3, Users, Eye, ChevronDown, Check, Focus,
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
  transparentSurface?: boolean;
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
  transparentSurface = false,
}: CallInitiationScreenProps) {
  const sheetTitleId = useId();
  const sheetDescId = useId();
  const [ready, setReady] = useState(false);
  const [focusSheetOpen, setFocusSheetOpen] = useState(false);
  /** Desktop: inline dropdown below call focus control */
  const [focusDropdownOpen, setFocusDropdownOpen] = useState(false);
  const focusButtonRef = useRef<HTMLButtonElement>(null);
  const [focusDropdownLayout, setFocusDropdownLayout] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
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
    if (!focusSheetOpen || transparentSurface) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [focusSheetOpen, transparentSurface]);

  const measureFocusDropdown = useCallback(() => {
    const el = focusButtonRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setFocusDropdownLayout({ top: r.bottom + 6, left: r.left, width: r.width });
  }, []);

  useLayoutEffect(() => {
    if (!transparentSurface || !focusDropdownOpen) {
      setFocusDropdownLayout(null);
      return;
    }
    measureFocusDropdown();
    const onMove = () => measureFocusDropdown();
    window.addEventListener("resize", onMove);
    window.addEventListener("scroll", onMove, true);
    return () => {
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove, true);
    };
  }, [transparentSurface, focusDropdownOpen, measureFocusDropdown]);

  useEffect(() => {
    if (!focusDropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocusDropdownOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusDropdownOpen]);

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
        minHeight: transparentSurface ? "100%" : "100dvh",
        flex: transparentSurface ? 1 : undefined,
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: transparentSurface ? "transparent" : C.bg,
      }}
    >
      {/* ── Ambient background ──────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          display: transparentSurface ? "none" : "block",
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
          width: "100%",
          maxWidth: transparentSurface ? 980 : undefined,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            padding: transparentSurface
              ? "44px 28px 96px"
              : "48px 22px 140px",
          }}
        >

          {/* ── Hero ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: EASE }}
            style={{
              textAlign: "center",
              marginBottom: transparentSurface ? 40 : 32,
              maxWidth: transparentSurface ? 620 : undefined,
              marginLeft: transparentSurface ? "auto" : undefined,
              marginRight: transparentSurface ? "auto" : 0,
            }}
          >
            {/* Pulsing orb */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: transparentSurface ? 28 : 22,
              }}
            >
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
                maxWidth: transparentSurface ? 520 : 310,
                margin: "0 auto",
              }}
            >
              A quick call with Zappy helps recruiters see the real you, not just a resume.
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
              alignItems: "stretch",
              marginBottom: transparentSurface ? 44 : 28,
              width: "100%",
              maxWidth: transparentSurface ? 460 : 340,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {hasMultipleFocusOptions ? (
              <motion.button
                ref={focusButtonRef}
                type="button"
                onClick={() => {
                  if (transparentSurface) setFocusDropdownOpen((o) => !o);
                  else setFocusSheetOpen(true);
                }}
                whileTap={{ scale: 0.992 }}
                transition={{ duration: 0.12, ease: EASE }}
                aria-haspopup={transparentSurface ? "listbox" : "dialog"}
                aria-expanded={transparentSurface ? focusDropdownOpen : focusSheetOpen}
                aria-label={`Change call focus. Currently ${focusedLabel}.`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  width: "100%",
                  padding: "12px 14px",
                  minHeight: 48,
                  borderRadius: 14,
                  background: C.white,
                  border: `1px solid ${C.brandBorder}`,
                  boxShadow: "0 2px 10px rgba(28,25,23,0.05), 0 1px 2px rgba(234,88,12,0.06)",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  WebkitTapHighlightColor: "transparent",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Focus size={18} color={C.brand} strokeWidth={2.1} aria-hidden />
                  <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.textMuted,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase",
                      }}
                    >
                      Call focus
                    </span>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: C.primary,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.25,
                      }}
                    >
                      {focusedLabel}
                    </span>
                  </span>
                </span>
                <span
                  style={{
                    display: "flex",
                    height: 32,
                    width: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 9,
                    background: "rgba(234,88,12,0.08)",
                    flexShrink: 0,
                    transform: transparentSurface && focusDropdownOpen ? "rotate(180deg)" : undefined,
                    transition: "transform 0.2s ease",
                  }}
                >
                  <ChevronDown size={18} color={C.brand} strokeWidth={2.2} aria-hidden />
                </span>
              </motion.button>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "12px 14px",
                  minHeight: 48,
                  borderRadius: 14,
                  background: "rgba(234,88,12,0.04)",
                  border: `1px solid ${C.border}`,
                }}
              >
                <Focus size={18} color={C.brand} strokeWidth={2} strokeOpacity={0.9} aria-hidden />
                <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                    }}
                  >
                    Call focus
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: C.primary,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.25,
                    }}
                  >
                    {focusedLabel}
                  </span>
                </span>
              </div>
            )}
          </motion.div>

          {/* ── What happens after (bento-style, not a heavy list card) ─ */}
          <AnimatePresence>
            {ready && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24, ease: EASE }}
                style={{
                  marginBottom: transparentSurface ? 28 : 16,
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.textSec,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    margin: transparentSurface ? "4px 0 14px" : "0 0 10px",
                    textAlign: "center",
                  }}
                >
                  After your call
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: transparentSurface ? "repeat(3, minmax(0, 1fr))" : "1fr 1fr",
                    gap: transparentSurface ? 14 : 8,
                    gridTemplateRows: transparentSurface ? "auto" : "auto auto",
                  }}
                >
                  {OUTCOMES.slice(0, 2).map((o, i) => (
                    <motion.div
                      key={o.title}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.06, ease: EASE }}
                      style={{
                        borderRadius: 14,
                        padding: transparentSurface ? "16px 15px 14px" : "12px 12px 11px",
                        background: transparentSurface ? "rgba(255,255,255,0.48)" : "rgba(255,255,255,0.7)",
                        border: `1px solid ${C.border}`,
                        minHeight: 0,
                      }}
                    >
                      <div style={{ marginBottom: transparentSurface ? 10 : 8, opacity: 0.9 }}>{o.icon}</div>
                      <p
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: C.primary,
                          margin: 0,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.28,
                        }}
                      >
                        {o.title}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: C.textMuted,
                          margin: "6px 0 0",
                          lineHeight: 1.4,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {o.desc}
                      </p>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.42, ease: EASE }}
                    style={{
                      gridColumn: transparentSurface ? "auto" : "1 / -1",
                      borderRadius: 14,
                      padding: transparentSurface ? "16px 15px 14px" : "12px 14px",
                      background: transparentSurface
                        ? "rgba(255,255,255,0.48)"
                        : "linear-gradient(135deg, rgba(234,88,12,0.06) 0%, rgba(234,88,12,0.02) 100%)",
                      border: transparentSurface ? `1px solid ${C.border}` : `1px solid rgba(234,88,12,0.12)`,
                      minHeight: 0,
                      display: transparentSurface ? "block" : "flex",
                      alignItems: transparentSurface ? undefined : "flex-start",
                      gap: transparentSurface ? undefined : 10,
                    }}
                  >
                    {transparentSurface ? (
                      <>
                        <div style={{ marginBottom: 10, opacity: 0.9 }}>{OUTCOMES[2].icon}</div>
                        <p
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: C.primary,
                            margin: 0,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.28,
                          }}
                        >
                          {OUTCOMES[2].title}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: C.textMuted,
                            margin: "6px 0 0",
                            lineHeight: 1.4,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {OUTCOMES[2].desc}
                        </p>
                      </>
                    ) : (
                      <>
                        <div style={{ opacity: 0.9, flexShrink: 0, lineHeight: 0 }}>
                          {OUTCOMES[2].icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 12.5,
                              fontWeight: 600,
                              color: C.primary,
                              margin: 0,
                              letterSpacing: "-0.02em",
                              lineHeight: 1.28,
                            }}
                          >
                            {OUTCOMES[2].title}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: C.textMuted,
                              margin: "5px 0 0",
                              lineHeight: 1.45,
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {OUTCOMES[2].desc}
                          </p>
                        </div>
                      </>
                    )}
                  </motion.div>
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
          padding: transparentSurface
            ? "12px 20px calc(12px + env(safe-area-inset-bottom))"
            : "14px 20px calc(14px + env(safe-area-inset-bottom))",
          background: transparentSurface ? "transparent" : "rgba(253,251,248,0.94)",
          backdropFilter: transparentSurface ? "none" : "blur(16px)",
          WebkitBackdropFilter: transparentSurface ? "none" : "blur(16px)",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: transparentSurface ? "flex-end" : "stretch",
          alignItems: "center",
          gap: transparentSurface ? 6 : 10,
        }}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onSkip}
          style={{
            width: transparentSurface ? "auto" : "100%",
            minWidth: transparentSurface ? 210 : undefined,
            height: 50,
            padding: transparentSurface ? "0 20px" : undefined,
            borderRadius: 13,
            border: `1.5px solid ${C.border}`,
            background: "transparent",
            color: C.textMuted,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
        >
          I'll do this later
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onStartCall(focusedLabel)}
          style={{
            width: transparentSurface ? "auto" : "100%",
            minWidth: transparentSurface ? 210 : undefined,
            height: 50,
            padding: transparentSurface ? "0 24px" : undefined,
            borderRadius: 15,
            border: "none",
            background: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
            color: "white",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: transparentSurface
              ? "none"
              : "0 6px 24px rgba(234,88,12,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 9,
          }}
        >
          <Mic size={17} color="white" strokeWidth={2} />
          Take the call
        </motion.button>
      </motion.div>

      {/* ── Desktop: dropdown (portal) — call focus options below control ─ */}
      {typeof document !== "undefined" &&
        transparentSurface &&
        hasMultipleFocusOptions &&
        focusDropdownOpen &&
        focusDropdownLayout &&
        createPortal(
          <>
            <div
              role="presentation"
              style={{ position: "fixed", inset: 0, zIndex: 45 }}
              onClick={() => setFocusDropdownOpen(false)}
            />
            <div
              role="listbox"
              aria-label="Call focus options"
              style={{
                position: "fixed",
                top: focusDropdownLayout.top,
                left: focusDropdownLayout.left,
                width: focusDropdownLayout.width,
                zIndex: 46,
                maxHeight: 280,
                overflowY: "auto",
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                boxShadow: "0 12px 40px rgba(15,23,42,0.12)",
                padding: 6,
              }}
            >
              {labels.map((label, i) => {
                const selected = i === focusIndex;
                return (
                  <button
                    key={`dd-${label}-${i}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setFocusIndex(i);
                      setFocusDropdownOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      minHeight: 44,
                      padding: "10px 12px",
                      marginBottom: 2,
                      borderRadius: 8,
                      border: selected ? `1.5px solid rgba(234,88,12,0.35)` : `1px solid transparent`,
                      background: selected ? "rgba(234,88,12,0.05)" : "transparent",
                      cursor: "pointer",
                      fontFamily: "Inter, sans-serif",
                      textAlign: "left",
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
          </>,
          document.body,
        )}

      {/* ── Mobile sheet: switch call focus among selected categories ─ */}
      <AnimatePresence>
        {focusSheetOpen && !transparentSurface && (
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
