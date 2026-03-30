import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence, animate, useReducedMotion, useMotionValue } from "motion/react";
import { Search, Mic, Briefcase, ChevronRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 300, damping: 32 };
const BG_CROSSFADE = { duration: 1.15, ease: EASE };

const BG = "#FDFBF8";
const BRAND_GRADIENT = "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)";

/** SVG fractal noise — premium paper-like grain (no external asset). */
const CARD_NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='a' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)' opacity='0.55'/%3E%3C/svg%3E\")";

interface OnboardingJourneyScreenProps {
  firstName: string;
  onComplete: () => void;
}

interface Blob {
  gradient: string;
  size: number;
  blur: number;
  left: string;
  top: string;
  x: number[];
  y: number[];
  scale: number[];
  rotate: number[];
  duration: number;
  /** Organic silhouette (Apple-style blobs are not perfect circles). */
  shape?: string;
}

const CARDS: {
  icon: typeof Search;
  title: string;
  desc: string;
  gradient: string;
  iconColor: string;
  mesh: string;
  meshAlt: string;
  blobs: Blob[];
  bg: {
    tint: string;
    wash: string;
    orbTopRight: string;
    orbMidLeft: string;
    orbBottom: string;
    ringColor: string;
  };
}[] = [
  {
    icon: Search,
    title: "Tell us what you're looking for",
    desc: "Share your role, preferences, and expectations",
    gradient: "linear-gradient(160deg, #ffedd5 0%, #fed7aa 38%, #fdba74 72%, #fb923c 100%)",
    iconColor: "#EA580C",
    mesh:
      "conic-gradient(from 225deg at 34% 26%, #ff3d00 0deg, #ffb04a 52deg, #fff4e8 118deg, #ea580c 188deg, #c2410c 268deg, #ff6b35 328deg, #ff3d00 360deg)",
    meshAlt:
      "conic-gradient(from 75deg at 64% 54%, #fff7ed 0deg, #ff8f56 110deg, #9a3412 220deg, #fecaca 300deg, #fff7ed 360deg)",
    blobs: [
      {
        gradient:
          "radial-gradient(ellipse 52% 54% at 44% 10%, rgba(255,255,255,0.95) 0%, rgba(255,228,180,0.92) 14%, rgba(255,140,60,0.78) 34%, rgba(234,88,12,0.48) 52%, transparent 64%)",
        size: 268, blur: 30, left: "24%", top: "14%",
        shape: "58% 42% 48% 52% / 46% 54% 51% 49%",
        x: [0, 85, -48, 0], y: [0, 92, -38, 0], scale: [1, 1.22, 0.88, 1], rotate: [0, 14, -10, 0], duration: 11,
      },
      {
        gradient:
          "radial-gradient(ellipse 58% 56% at 72% 58%, rgba(194,65,12,0.92) 0%, rgba(154,52,18,0.65) 28%, rgba(124,45,18,0.35) 48%, transparent 62%)",
        size: 240, blur: 32, left: "84%", top: "54%",
        shape: "44% 56% 52% 48% / 54% 46% 49% 51%",
        x: [0, -72, 40, 0], y: [0, -78, 48, 0], scale: [1.08, 0.86, 1.14, 1.08], rotate: [0, -12, 10, 0], duration: 14,
      },
      {
        gradient:
          "radial-gradient(circle at 38% 42%, rgba(255,210,150,0.98) 0%, rgba(255,160,90,0.72) 22%, rgba(251,146,60,0.38) 45%, transparent 60%)",
        size: 200, blur: 26, left: "48%", top: "28%",
        shape: "52% 48% 55% 45% / 48% 52% 47% 53%",
        x: [0, -55, 68, 0], y: [0, 58, -65, 0], scale: [0.92, 1.18, 1.02, 0.92], rotate: [0, 11, -14, 0], duration: 9,
      },
    ],
    bg: {
      tint: "#FDF5EE",
      wash:
        "radial-gradient(ellipse 95% 70% at 50% -5%, rgba(255,120,55,0.5) 0%, rgba(255,163,102,0.22) 42%, transparent 62%), " +
        "radial-gradient(ellipse 85% 55% at 100% 35%, rgba(253,170,90,0.32) 0%, transparent 54%), " +
        "radial-gradient(ellipse 75% 50% at -5% 85%, rgba(234,88,12,0.22) 0%, transparent 50%)",
      orbTopRight: "radial-gradient(circle, rgba(255,120,60,0.55) 0%, rgba(255,200,140,0.35) 38%, transparent 68%)",
      orbMidLeft:  "radial-gradient(circle, rgba(234,88,12,0.38) 0%, rgba(251,146,60,0.2) 45%, transparent 58%)",
      orbBottom:   "radial-gradient(circle, rgba(255,140,70,0.42) 0%, rgba(255,210,160,0.22) 42%, transparent 62%)",
      ringColor:   "rgba(234,88,12,0.32)",
    },
  },
  {
    icon: Mic,
    title: "Help us understand you beyond your resume",
    desc: "A quick AI conversation to learn your strengths",
    gradient: "linear-gradient(160deg, #fffbeb 0%, #fef08a 36%, #facc15 68%, #eab308 100%)",
    iconColor: "#D97706",
    mesh:
      "conic-gradient(from 175deg at 40% 26%, #ca8a04 0deg, #fde047 58deg, #ffffff 125deg, #a16207 198deg, #f59e0b 275deg, #fef3c7 320deg, #ca8a04 360deg)",
    meshAlt:
      "conic-gradient(from -25deg at 58% 58%, #fffbeb 0deg, #fbbf24 125deg, #713f12 245deg, #fde68a 310deg, #fffbeb 360deg)",
    blobs: [
      {
        gradient:
          "radial-gradient(ellipse 56% 58% at 40% 12%, rgba(255,255,255,0.98) 0%, rgba(254,240,138,0.95) 12%, rgba(250,204,21,0.82) 30%, rgba(217,119,6,0.5) 50%, transparent 63%)",
        size: 262, blur: 28, left: "26%", top: "15%",
        shape: "56% 44% 50% 50% / 44% 56% 48% 52%",
        x: [0, 80, -44, 0], y: [0, 88, -36, 0], scale: [1.02, 1.24, 0.86, 1.02], rotate: [0, 16, -11, 0], duration: 12,
      },
      {
        gradient:
          "radial-gradient(ellipse 58% 54% at 70% 62%, rgba(146,64,14,0.9) 0%, rgba(113,63,18,0.68) 26%, rgba(88,45,12,0.4) 46%, transparent 60%)",
        size: 232, blur: 30, left: "80%", top: "50%",
        shape: "48% 52% 46% 54% / 52% 48% 51% 49%",
        x: [0, -76, 34, 0], y: [0, -80, 46, 0], scale: [1.06, 0.84, 1.16, 1.06], rotate: [0, -13, 14, 0], duration: 15,
      },
      {
        gradient:
          "radial-gradient(circle at 36% 44%, rgba(255,248,200,0.98) 0%, rgba(253,224,71,0.75) 24%, rgba(234,179,8,0.42) 46%, transparent 58%)",
        size: 188, blur: 24, left: "52%", top: "32%",
        shape: "50% 50% 54% 46% / 52% 48% 50% 50%",
        x: [0, -50, 62, 0], y: [0, 54, -58, 0], scale: [0.9, 1.15, 1.04, 0.9], rotate: [0, 9, -16, 0], duration: 10,
      },
    ],
    bg: {
      tint: "#FFF8EA",
      wash:
        "radial-gradient(ellipse 95% 72% at 45% -8%, rgba(245,180,30,0.52) 0%, rgba(253,224,120,0.28) 44%, transparent 58%), " +
        "radial-gradient(ellipse 88% 58% at 105% 55%, rgba(234,160,20,0.36) 0%, transparent 54%), " +
        "radial-gradient(ellipse 70% 48% at 10% 90%, rgba(180,110,10,0.2) 0%, transparent 48%)",
      orbTopRight: "radial-gradient(circle, rgba(250,185,40,0.56) 0%, rgba(254,240,150,0.38) 40%, transparent 66%)",
      orbMidLeft:  "radial-gradient(circle, rgba(200,130,15,0.4) 0%, rgba(253,200,80,0.26) 48%, transparent 56%)",
      orbBottom:   "radial-gradient(circle, rgba(250,210,70,0.45) 0%, rgba(253,230,140,0.28) 44%, transparent 60%)",
      ringColor:   "rgba(217,119,6,0.34)",
    },
  },
  {
    icon: Briefcase,
    title: "Get matched with the right opportunities",
    desc: "Curated jobs + direct visibility to recruiters",
    gradient: "linear-gradient(160deg, #ecfdf5 0%, #a7f3d0 40%, #5eead4 72%, #14b8a6 100%)",
    iconColor: "#059669",
    mesh:
      "conic-gradient(from 205deg at 34% 28%, #0f766e 0deg, #5eead4 55deg, #f0fdfa 120deg, #047857 190deg, #2dd4bf 265deg, #134e4a 330deg, #0f766e 360deg)",
    meshAlt:
      "conic-gradient(from 35deg at 62% 56%, #ccfbf1 0deg, #14b8a6 120deg, #064e3b 235deg, #99f6e4 305deg, #ccfbf1 360deg)",
    blobs: [
      {
        gradient:
          "radial-gradient(ellipse 56% 56% at 42% 14%, rgba(255,255,255,0.96) 0%, rgba(167,243,208,0.9) 14%, rgba(45,212,191,0.78) 32%, rgba(15,118,110,0.52) 50%, transparent 62%)",
        size: 258, blur: 28, left: "22%", top: "16%",
        shape: "54% 46% 48% 52% / 45% 55% 52% 48%",
        x: [0, 78, -46, 0], y: [0, 90, -40, 0], scale: [1, 1.2, 0.88, 1], rotate: [0, 13, -12, 0], duration: 12,
      },
      {
        gradient:
          "radial-gradient(ellipse 58% 54% at 74% 58%, rgba(6,78,59,0.92) 0%, rgba(4,120,87,0.65) 28%, rgba(6,95,70,0.38) 48%, transparent 60%)",
        size: 228, blur: 30, left: "82%", top: "52%",
        shape: "46% 54% 53% 47% / 53% 47% 48% 52%",
        x: [0, -70, 38, 0], y: [0, -78, 44, 0], scale: [1.08, 0.86, 1.14, 1.08], rotate: [0, -15, 11, 0], duration: 14,
      },
      {
        gradient:
          "radial-gradient(circle at 34% 40%, rgba(204,251,241,0.98) 0%, rgba(45,212,191,0.72) 22%, rgba(20,184,166,0.42) 44%, transparent 58%)",
        size: 182, blur: 24, left: "50%", top: "30%",
        shape: "50% 50% 48% 52% / 50% 50% 54% 46%",
        x: [0, -52, 64, 0], y: [0, 56, -62, 0], scale: [0.92, 1.14, 1.02, 0.92], rotate: [0, 12, -14, 0], duration: 10,
      },
    ],
    bg: {
      tint: "#F2FAF6",
      wash:
        "radial-gradient(ellipse 95% 70% at 50% 0%, rgba(30,195,140,0.48) 0%, rgba(140,240,200,0.24) 46%, transparent 58%), " +
        "radial-gradient(ellipse 82% 55% at -5% 40%, rgba(15,170,120,0.36) 0%, transparent 52%), " +
        "radial-gradient(ellipse 75% 52% at 96% 88%, rgba(80,220,180,0.32) 0%, transparent 50%)",
      orbTopRight: "radial-gradient(circle, rgba(40,200,150,0.54) 0%, rgba(180,245,220,0.36) 40%, transparent 66%)",
      orbMidLeft:  "radial-gradient(circle, rgba(5,130,95,0.42) 0%, rgba(90,210,175,0.24) 48%, transparent 56%)",
      orbBottom:   "radial-gradient(circle, rgba(70,220,185,0.44) 0%, rgba(190,250,230,0.26) 44%, transparent 60%)",
      ringColor:   "rgba(5,150,105,0.34)",
    },
  },
];

const ONB_BLOB_STYLE_ID = "zf-onb-card-blob-css";

function buildOnboardingCardBlobCSS(): string {
  let css = "";
  CARDS.forEach((card, ci) => {
    card.blobs.forEach((blob, bi) => {
      const name = `zf_onb_blob_${ci}_${bi}`;
      const n = blob.x.length;
      css += `@keyframes ${name}{`;
      for (let k = 0; k < n; k++) {
        const pct = n === 1 ? 0 : (k / (n - 1)) * 100;
        css += `${pct}%{transform:translate3d(${blob.x[k]}px,${blob.y[k]}px,0) scale(${blob.scale[k]}) rotate(${blob.rotate[k]}deg);}`;
      }
      css += `}`;
      css += `[data-zf-onb-blob="${ci}-${bi}"]{animation:${name} ${blob.duration}s ease-in-out infinite;will-change:transform;}`;
    });
  });
  css +=
    "@keyframes zf_onb_mesh_spin{" +
    "0%{transform:rotate(0deg) scale(1.28);}" +
    "20%{transform:rotate(72deg) scale(1.52);}" +
    "40%{transform:rotate(144deg) scale(1.34);}" +
    "60%{transform:rotate(216deg) scale(1.48);}" +
    "80%{transform:rotate(288deg) scale(1.36);}" +
    "100%{transform:rotate(360deg) scale(1.28);}" +
    "}" +
    "@keyframes zf_onb_mesh_rev{" +
    "0%{transform:rotate(0deg) scale(1.22);}" +
    "25%{transform:rotate(-90deg) scale(1.46);}" +
    "50%{transform:rotate(-180deg) scale(1.3);}" +
    "75%{transform:rotate(-270deg) scale(1.42);}" +
    "100%{transform:rotate(-360deg) scale(1.22);}" +
    "}";
  return css;
}

const CARD_W = 300;
const CARD_H = 396;
const CARD_GAP = 16;
const PEEK_GUTTER = 20;

export function OnboardingJourneyScreen({
  firstName,
  onComplete,
}: OnboardingJourneyScreenProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [entered, setEntered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (document.getElementById(ONB_BLOB_STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = ONB_BLOB_STYLE_ID;
    el.textContent = buildOnboardingCardBlobCSS();
    document.head.appendChild(el);
    return () => {
      document.getElementById(ONB_BLOB_STYLE_ID)?.remove();
    };
  }, []);

  const handleNext = useCallback(() => {
    if (activeStep < CARDS.length - 1) {
      setActiveStep((s) => s + 1);
    } else {
      onComplete();
    }
  }, [activeStep, onComplete]);

  const isLastStep = activeStep === CARDS.length - 1;
  const crossfadeTransition = reduceMotion
    ? { duration: 0.2, ease: "easeOut" as const }
    : BG_CROSSFADE;

  const containerWidth = typeof window !== "undefined"
    ? Math.min(390, window.innerWidth)
    : 390;
  const stepStride = CARD_W + CARD_GAP;
  const lastStep = CARDS.length - 1;
  const translateXForStep = useCallback(
    (step: number) => {
      if (step <= 0) return PEEK_GUTTER;
      if (step >= lastStep) {
        return containerWidth - PEEK_GUTTER - CARD_W - step * stepStride;
      }
      return PEEK_GUTTER - step * stepStride;
    },
    [containerWidth, lastStep, stepStride],
  );
  const trackX = useMotionValue(translateXForStep(0));

  useEffect(() => {
    animate(
      trackX,
      translateXForStep(activeStep),
      reduceMotion ? { duration: 0.2, ease: "easeOut" } : SPRING,
    );
  }, [activeStep, reduceMotion, trackX, translateXForStep]);

  const onTrackDragEnd = useCallback(
    (
      _e: PointerEvent | MouseEvent | TouchEvent,
      info: { offset: { x: number }; velocity: { x: number } },
    ) => {
      const dx = info.offset.x;
      const vx = info.velocity.x;
      const thresholdPx = 52;
      const flickVx = 420;
      let next = activeStep;
      if ((dx <= -thresholdPx || vx <= -flickVx) && activeStep < CARDS.length - 1) {
        next = activeStep + 1;
      } else if ((dx >= thresholdPx || vx >= flickVx) && activeStep > 0) {
        next = activeStep - 1;
      }
      if (next === activeStep) {
        animate(
          trackX,
          translateXForStep(activeStep),
          reduceMotion ? { duration: 0.2, ease: "easeOut" } : SPRING,
        );
      } else {
        setActiveStep(next);
      }
    },
    [activeStep, reduceMotion, trackX, translateXForStep],
  );

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

  const drift = reduceMotion
    ? { x: 0, y: 0, scale: 1 }
    : lowEndAndroid
      ? { x: [0, 18, -12, 0], y: [0, -14, 10, 0], scale: [1, 1.12, 0.9, 1] }
      : { x: [0, 28, -22, 0], y: [0, -22, 17, 0], scale: [1, 1.16, 0.86, 1] };

  const driftSlow = reduceMotion
    ? { x: 0, y: 0 }
    : { x: [0, -16, 12, 0], y: [0, 10, -14, 0] };

  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: CARDS[activeStep].bg.tint }}
      transition={crossfadeTransition}
      style={{
        minHeight: "100dvh",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        backgroundColor: BG,
      }}
    >
      {/* ── Ambient background: crossfade layers (smooth gradient transitions) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* Full-bleed color washes — crossfade between steps; active layer slowly drifts */}
        <div style={{ position: "absolute", inset: 0 }}>
          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={
                activeStep === i && !reduceMotion
                  ? { opacity: 1, backgroundPosition: ["20% 20%", "80% 55%", "50% 85%", "20% 20%"] }
                  : { opacity: activeStep === i ? 1 : 0, backgroundPosition: "50% 50%" }
              }
              transition={
                activeStep === i && !reduceMotion
                  ? {
                      opacity: crossfadeTransition,
                      backgroundPosition: { duration: 26, repeat: Infinity, ease: "easeInOut" },
                    }
                  : crossfadeTransition
              }
              style={{
                position: "absolute",
                inset: "-8%",
                backgroundImage: c.bg.wash,
                backgroundSize: "130% 130%",
                backgroundColor: "transparent",
              }}
            />
          ))}
        </div>

        {/* Large orb — top right */}
        <motion.div
          animate={drift}
          transition={{ duration: lowEndAndroid ? 14 : 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "-12%",
            right: "-18%",
            width: 380,
            height: 380,
            borderRadius: "50%",
            filter: "blur(44px) saturate(1.55)",
            opacity: 1,
          }}
        >
          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: activeStep === i ? 1 : 0 }}
              transition={crossfadeTransition}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: c.bg.orbTopRight,
              }}
            />
          ))}
        </motion.div>

        {/* Mid orb — left */}
        <motion.div
          animate={driftSlow}
          transition={{ duration: lowEndAndroid ? 16 : 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "34%",
            left: "-24%",
            width: 360,
            height: 360,
            borderRadius: "50%",
            filter: "blur(50px) saturate(1.5)",
            opacity: 1,
          }}
        >
          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: activeStep === i ? 1 : 0 }}
              transition={crossfadeTransition}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: c.bg.orbMidLeft,
              }}
            />
          ))}
        </motion.div>

        {/* Bottom orb */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, 18, -12, 0],
                  y: [0, -10, 14, 0],
                  scale: [1, 1.05, 0.98, 1],
                }
          }
          transition={{ duration: lowEndAndroid ? 17 : 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute",
            bottom: "-16%",
            right: "4%",
            width: 336,
            height: 336,
            borderRadius: "50%",
            filter: "blur(46px) saturate(1.52)",
            opacity: 1,
          }}
        >
          {CARDS.map((c, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: activeStep === i ? 1 : 0 }}
              transition={crossfadeTransition}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: c.bg.orbBottom,
              }}
            />
          ))}
        </motion.div>

        {/* Decorative rings — stacked crossfade */}
        {!reduceMotion && (
          <>
            <motion.div
              animate={{ rotate: [0, 360], opacity: [0.14, 0.28, 0.14] }}
              transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                top: "8%",
                left: "50%",
                marginLeft: -100,
                width: 200,
                height: 200,
                borderRadius: "50%",
              }}
            >
              {CARDS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ opacity: activeStep === i ? 1 : 0 }}
                  transition={crossfadeTransition}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `1px solid ${c.bg.ringColor}`,
                  }}
                />
              ))}
            </motion.div>
            <motion.div
              animate={{ rotate: [360, 0], opacity: [0.11, 0.24, 0.11] }}
              transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
              style={{
                position: "absolute",
                bottom: "24%",
                right: "4%",
                width: 140,
                height: 140,
                borderRadius: "50%",
              }}
            >
              {CARDS.map((c, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ opacity: activeStep === i ? 1 : 0 }}
                  transition={crossfadeTransition}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: `1px solid ${c.bg.ringColor}`,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* ── Header ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 14 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{
          position: "relative",
          zIndex: 2,
          padding: "60px 28px 0",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#1C1917",
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Welcome{firstName ? ` ${firstName}` : ""} 🙌🏻
        </h1>
        <p
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#78716C",
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
            margin: "8px 0 0",
          }}
        >
          Here is how it works
        </p>
      </motion.div>

      {/* ── Card carousel ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
        ref={containerRef}
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          overflow: "visible",
          minHeight: 0,
          paddingTop: 16,
          paddingBottom: 28,
        }}
      >
        <motion.div
          style={{
            x: trackX,
            display: "flex",
            gap: CARD_GAP,
            paddingLeft: 0,
            willChange: "transform",
            touchAction: reduceMotion ? undefined : "none",
            cursor: reduceMotion ? undefined : "grab",
          }}
          drag={reduceMotion ? false : "x"}
          dragElastic={0.14}
          dragMomentum={false}
          onDragEnd={onTrackDragEnd}
          whileDrag={{ cursor: "grabbing" }}
        >
          {CARDS.map((card, i) => {
            const isActive = i === activeStep;
            const CardIcon = card.icon;

            return (
              <motion.div
                key={i}
                animate={{
                  scale: isActive ? 1 : 0.88,
                  opacity: isActive ? 1 : 0.5,
                }}
                transition={SPRING}
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  flexShrink: 0,
                  borderRadius: 30,
                  position: "relative",
                  overflow: "visible",
                  isolation: "isolate",
                  boxShadow: isActive
                    ? "0 20px 60px rgba(28,25,23,0.12), 0 4px 20px rgba(28,25,23,0.06)"
                    : "0 8px 30px rgba(28,25,23,0.06)",
                  cursor: i !== activeStep ? "pointer" : undefined,
                }}
                onClick={() => {
                  if (i !== activeStep) {
                    setActiveStep(i);
                  }
                }}
              >
                {/* Base fill — clipped; stays inside rounded rect */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 30,
                    overflow: "hidden",
                    zIndex: 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: card.gradient,
                    }}
                  />
                </div>

                {/* Mesh + blobs — card overflow visible so blur extends past top edge */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "-40%",
                    zIndex: 1,
                    background: card.mesh,
                    opacity: isActive ? 0.74 : 0.42,
                    filter: "blur(22px) saturate(1.62)",
                    mixBlendMode: "soft-light",
                    pointerEvents: "none",
                    animation: reduceMotion ? "none" : "zf_onb_mesh_spin 22s linear infinite",
                    animationPlayState: reduceMotion || !isActive ? "paused" : "running",
                  }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: "-38%",
                    zIndex: 1,
                    background: card.meshAlt,
                    opacity: isActive ? 0.58 : 0.34,
                    filter: "blur(24px) saturate(1.55)",
                    mixBlendMode: "overlay",
                    pointerEvents: "none",
                    animation: reduceMotion ? "none" : "zf_onb_mesh_rev 34s linear infinite",
                    animationPlayState: reduceMotion || !isActive ? "paused" : "running",
                  }}
                />

                {card.blobs.map((blob, bi) => (
                  <div
                    key={`blob-${bi}`}
                    data-zf-onb-blob={`${i}-${bi}`}
                    style={{
                      position: "absolute",
                      left: blob.left,
                      top: blob.top,
                      width: blob.size,
                      height: blob.size,
                      marginLeft: -blob.size / 2,
                      marginTop: -blob.size / 2,
                      borderRadius: blob.shape ?? "50%",
                      zIndex: 1,
                      pointerEvents: "none",
                      transform: "translateZ(0)",
                      animation: reduceMotion ? "none" : undefined,
                      animationPlayState: reduceMotion || !isActive ? "paused" : "running",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: blob.shape ?? "50%",
                        background: blob.gradient,
                        filter: `blur(${Math.max(blob.blur - 4, 12)}px) saturate(1.45)`,
                        transform: "translateZ(0) scale(1.05)",
                      }}
                    />
                  </div>
                ))}

                {/* Noise, glass, content — clipped to card */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 2,
                    borderRadius: 30,
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 30,
                      backgroundImage: CARD_NOISE_DATA_URI,
                      backgroundSize: "240px 240px",
                      opacity: isActive ? 0.26 : 0.17,
                      mixBlendMode: "overlay",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background: "linear-gradient(to top, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.52) 58%, transparent 100%)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        background: "rgba(255,255,255,0.75)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(28,25,23,0.06)",
                      }}
                    >
                      <CardIcon
                        size={20}
                        color={card.iconColor}
                        strokeWidth={2}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "rgba(28,25,23,0.45)",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Step {i + 1} of {CARDS.length}
                    </span>
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#1C1917",
                        letterSpacing: "-0.035em",
                        lineHeight: 1.2,
                        margin: "0 0 8px",
                      }}
                    >
                      {card.title}
                    </h2>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#57534E",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.45,
                        margin: 0,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ── Bottom controls ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: entered ? 1 : 0, y: entered ? 0 : 20 }}
        transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
        style={{
          position: "relative",
          zIndex: 3,
          padding: "0 28px calc(24px + env(safe-area-inset-bottom))",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {CARDS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === activeStep ? 28 : 8,
                background:
                  i <= activeStep
                    ? BRAND_GRADIENT
                    : "rgba(234,88,12,0.15)",
                opacity: i <= activeStep ? 1 : 0.65,
              }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{
                height: 8,
                borderRadius: 4,
              }}
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          layout
          style={{
            width: "100%",
            height: 56,
            borderRadius: 18,
            border: "none",
            background: BRAND_GRADIENT,
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            boxShadow: "0 8px 28px rgba(234,88,12,0.38)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={isLastStep ? "start" : "next"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: EASE }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {isLastStep ? "Get Started" : "Next"}
              <ChevronRight size={18} strokeWidth={2.2} />
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          style={{
            display: "block",
            width: "fit-content",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: 6,
            padding: "6px 10px",
            border: "none",
            borderRadius: 8,
            background: "transparent",
            color: "#A8A29E",
            fontSize: 12.5,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          Skip intro
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
