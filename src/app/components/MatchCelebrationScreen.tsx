import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Lock, MapPin } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const MOCK_JOBS = [
  { company: "Zappyhire", role: "Senior Software Engineer", location: "Remote", logo: "https://logo.clearbit.com/zappyhire.dev" },
  { company: "ZappyVue", role: "Full Stack Engineer", location: "Bangalore", logo: "https://logo.clearbit.com/zappyvue.dev" },
  { company: "ZappyCore", role: "Backend Engineer", location: "Bangalore", logo: "https://logo.clearbit.com/zappycore.dev" },
  { company: "ZappyLabs", role: "Product Engineer", location: "Remote", logo: "https://logo.clearbit.com/zappylabs.dev" },
  { company: "ZappyForge", role: "Frontend Engineer", location: "Remote", logo: "https://logo.clearbit.com/zappyforge.dev" },
  { company: "ZappyStack", role: "Platform Engineer", location: "Remote", logo: "https://logo.clearbit.com/zappystack.dev" },
  { company: "ZappyNest", role: "Senior Engineer", location: "Bangalore", logo: "https://logo.clearbit.com/zappynest.dev" },
  { company: "ZappyOrbit", role: "Mobile Engineer", location: "Bangalore", logo: "https://logo.clearbit.com/zappyorbit.dev" },
  { company: "ZappyGrid", role: "Data Engineer", location: "Bangalore", logo: "https://logo.clearbit.com/zappygrid.dev" },
  { company: "ZappyFlow", role: "Backend Engineer", location: "Remote", logo: "https://logo.clearbit.com/zappyflow.dev" },
  { company: "ZappyWave", role: "Senior Engineer", location: "Bangalore", logo: "https://logo.clearbit.com/zappywave.dev" },
  { company: "ZappyDock", role: "Full Stack Engineer", location: "Bangalore", logo: "https://logo.clearbit.com/zappydock.dev" },
];

const COMPANY_PALETTES = [
  { bg: "#EDE9FE", fg: "#7C3AED", accent: "#DDD6FE" },
  { bg: "#FCE7F3", fg: "#DB2777", accent: "#FBCFE8" },
  { bg: "#FEF3C7", fg: "#D97706", accent: "#FDE68A" },
  { bg: "#D1FAE5", fg: "#059669", accent: "#A7F3D0" },
  { bg: "#E0E7FF", fg: "#4F46E5", accent: "#C7D2FE" },
  { bg: "#FEE2E2", fg: "#DC2626", accent: "#FECACA" },
  { bg: "#CFFAFE", fg: "#0891B2", accent: "#A5F3FC" },
  { bg: "#FFEDD5", fg: "#EA580C", accent: "#FED7AA" },
];

interface MatchCelebrationScreenProps {
  onContinue: () => void;
  transparentSurface?: boolean;
}

export function MatchCelebrationScreen({
  onContinue,
  transparentSurface = false,
}: MatchCelebrationScreenProps) {
  const [phase, setPhase] = useState<"counting" | "reveal">("counting");
  const [count, setCount] = useState(0);
  const targetCount = 74;
  const lowEndAndroid = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = ua.includes("android");
    const memory = "deviceMemory" in navigator ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8 : 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    return isAndroid && (memory <= 4 || cores <= 6);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 5,
        dur: (lowEndAndroid ? 7.5 : 6) + Math.random() * (lowEndAndroid ? 8.5 : 8),
        delay: Math.random() * 4,
        hue: [24, 30, 15, 35, 20, 40, 10][i % 7],
        opacity: 0.12 + Math.random() * 0.14,
      })),
    [lowEndAndroid],
  );

  useEffect(() => {
    const duration = 2200;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const t = step / steps;
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * targetCount));
      if (step >= steps) {
        clearInterval(timer);
        setCount(targetCount);
        setTimeout(() => setPhase("reveal"), 500);
      }
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        height: transparentSurface ? "100%" : "100dvh",
        minHeight: transparentSurface ? 0 : undefined,
        maxHeight: transparentSurface ? "100%" : undefined,
        flex: transparentSurface ? 1 : undefined,
        fontFamily: "Inter, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        background: transparentSurface ? "transparent" : "#FAF9F7",
        isolation: "isolate",
      }}
    >
      {/* ── Atmosphere ────────────────────────────────────────────── */}

      {/* Warm center radial mesh — amber/peach/charcoal blend */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: transparentSurface
            ? "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(255,165,90,0.08) 0%, transparent 58%), radial-gradient(ellipse 55% 45% at 75% 50%, rgba(253,186,116,0.08) 0%, transparent 52%)"
            : "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(255,165,90,0.14) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 25% 55%, rgba(28,25,23,0.04) 0%, transparent 50%), radial-gradient(ellipse 55% 45% at 75% 50%, rgba(253,186,116,0.12) 0%, transparent 50%)",
        }}
      />

      {/* Subtle dark vignette for luxury depth (disabled on transparent desktop surface) */}
      {!transparentSurface && (
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(28,25,23,0.04) 100%)",
        }}
      />
      )}

      {/* Slow-breathing center glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: lowEndAndroid ? 7.2 : 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,143,86,0.16) 0%, rgba(234,88,12,0.06) 40%, transparent 65%)",
          filter: `blur(${lowEndAndroid ? 38 : 50}px)`,
          pointerEvents: "none",
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      />

      {/* Dot grid pattern */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern id="dotgrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="14" cy="14" r="0.6" fill="rgba(28,25,23,0.06)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>

      {/* Grain texture */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: lowEndAndroid ? 0.03 : 0.04,
          pointerEvents: "none",
          mixBlendMode: "multiply",
        }}
      >
        <filter id="celebgrain">
          <feTurbulence type="fractalNoise" baseFrequency={lowEndAndroid ? "0.75" : "0.8"} numOctaves={lowEndAndroid ? 3 : 4} stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#celebgrain)" />
      </svg>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -20, 10, -15, 0],
            x: [0, 8, -6, 4, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.6, p.opacity * 1.3, p.opacity],
          }}
          transition={{
            duration: p.dur,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `hsla(${p.hue}, 70%, 58%, ${p.opacity})`,
            pointerEvents: "none",
            willChange: "transform, opacity",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        />
      ))}

      {/* Concentric achievement rings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: phase === "reveal" ? 1 : 0, scale: phase === "reveal" ? 1 : 0.5 }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{
          position: "absolute",
          top: "12%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 320,
          height: 320,
          pointerEvents: "none",
        }}
      >
        {[1, 0.75, 0.5].map((s, i) => (
          <motion.div
            key={i}
            animate={{ scale: [s, s + 0.02, s] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1px solid rgba(28,25,23,${0.05 - i * 0.015})`,
              transform: `scale(${s})`,
            }}
          />
        ))}
      </motion.div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          maxWidth: transparentSurface ? 980 : undefined,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Counter + headline */}
        <div
          style={{
            textAlign: "center",
            paddingTop: transparentSurface ? 28 : 60,
            paddingBottom: transparentSurface ? 48 : 0,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          >
            {/* Opportunity constellation — scattered prisms */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
                position: "relative",
                width: 88,
                height: 76,
              }}
            >
              {[
                { x: -26, y: -8, size: 18, rotate: -18, r: 6, bg: "linear-gradient(145deg, rgba(253,186,116,0.65) 0%, rgba(234,88,12,0.28) 100%)", shadow: "0 2px 8px rgba(28,25,23,0.04)", delay: 0, z: 1 },
                { x: 26, y: -5, size: 15, rotate: 14, r: 5, bg: "linear-gradient(145deg, rgba(234,88,12,0.5) 0%, rgba(28,25,23,0.18) 100%)", shadow: "0 2px 8px rgba(28,25,23,0.04)", delay: 0.06, z: 1 },
                { x: -18, y: 20, size: 11, rotate: 0, r: 99, bg: "linear-gradient(135deg, #FDBA74, #F97316)", shadow: "0 2px 6px rgba(249,115,22,0.2)", delay: 0.1, z: 1 },
                { x: 22, y: 18, size: 12, rotate: 25, r: 4, bg: "linear-gradient(145deg, rgba(255,143,86,0.5) 0%, rgba(234,88,12,0.22) 100%)", shadow: "0 2px 6px rgba(28,25,23,0.03)", delay: 0.04, z: 1 },
                { x: -32, y: 8, size: 7, rotate: 0, r: 99, bg: "rgba(234,88,12,0.3)", shadow: "none", delay: 0.12, z: 1 },
                { x: 34, y: 6, size: 8, rotate: 45, r: 2, bg: "rgba(253,186,116,0.45)", shadow: "none", delay: 0.08, z: 1 },
                { x: 0, y: 0, size: 44, rotate: -2, r: 14, bg: "linear-gradient(135deg, #FF8F56 0%, #EA580C 55%, #1C1917 140%)", shadow: "0 6px 24px rgba(234,88,12,0.22), 0 1px 4px rgba(28,25,23,0.1)", delay: 0.16, z: 2 },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
                  transition={{ duration: 0.65, delay: 0.12 + s.delay, ease: EASE }}
                  style={{
                    position: "absolute",
                    width: s.size,
                    height: s.size,
                    borderRadius: s.r,
                    background: s.bg,
                    boxShadow: s.shadow,
                    left: `calc(50% - ${s.size / 2}px + ${s.x}px)`,
                    top: `calc(50% - ${s.size / 2}px + ${s.y}px)`,
                    zIndex: s.z,
                  }}
                />
              ))}

              {/* Abstract content marks on hero face */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.55, ease: EASE }}
                style={{
                  position: "relative",
                  zIndex: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3.5,
                  alignItems: "flex-start",
                  transform: "rotate(-2deg)",
                }}
              >
                <div style={{ width: 16, height: 2.5, borderRadius: 2, background: "rgba(255,255,255,0.5)" }} />
                <div style={{ width: 10, height: 2.5, borderRadius: 2, background: "rgba(255,255,255,0.28)" }} />
              </motion.div>

              {/* Reveal-phase breathing glow behind hero */}
              <motion.div
                animate={
                  phase === "reveal"
                    ? { opacity: [0, 0.4, 0], scale: [0.8, 1.4, 0.8] }
                    : { opacity: 0 }
                }
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: "rgba(234,88,12,0.15)",
                  filter: "blur(12px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
            </div>

            <motion.div
              animate={phase === "reveal" ? { scale: [1, 1.015, 1] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontSize: "clamp(64px, 20vw, 88px)",
                fontWeight: 900,
                letterSpacing: "-0.06em",
                lineHeight: 0.9,
                backgroundImage:
                  "linear-gradient(155deg, #EA580C 0%, #1C1917 45%, #EA580C 75%, #FF8F56 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 8,
              }}
            >
              {count}+
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: "#1C1917",
                letterSpacing: "-0.03em",
                marginBottom: 8,
              }}
            >
              curated roles for you
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
              style={{
                fontSize: 13,
                color: "#908A84",
                letterSpacing: "-0.01em",
                lineHeight: 1.5,
                width: "100%",
                maxWidth: 295,
                margin: "0 auto",
              }}
            >
              <span style={{ color: "#57534E", fontWeight: 700 }}>Next and last step:</span>{" "}
              take a short <span style={{ color: "#44403C", fontWeight: 600 }}>AI call</span>{" "}
              so we understand you beyond your resume,{" "}
              then directly introduce you to relevant recruiters{" "}
              before you apply.
            </motion.p>
          </motion.div>
        </div>

        {/* ── Scrolling job cards ──────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: transparentSurface ? "0 8px" : "0",
            marginTop: transparentSurface ? 16 : 0,
            marginBottom: transparentSurface ? 40 : 0,
            gap: transparentSurface ? 14 : 10,
            position: "relative",
            boxSizing: "content-box",
            overflow: "hidden",
          }}
        >
          {/* Top fade — tall and soft for seamless blend from headline area */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 80,
              backgroundColor: "unset",
              background: "unset",
              backgroundImage: "none",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          {/* Bottom fade */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 70,
              backgroundColor: "unset",
              background: "unset",
              backgroundImage: "none",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          <AnimatePresence>
            {phase === "reveal" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
                style={{ display: "flex", flexDirection: "column", gap: transparentSurface ? 16 : 10 }}
              >
                <ScrollRow direction="right" speed={0.3} jobs={MOCK_JOBS.slice(0, 6)} rowIndex={0} />
                <ScrollRow direction="left" speed={0.25} jobs={MOCK_JOBS.slice(6, 12)} rowIndex={1} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{
            opacity: phase === "reveal" ? 1 : 0,
            y: phase === "reveal" ? 0 : 16,
          }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          style={{
            flexShrink: 0,
            padding: transparentSurface
              ? "8px 20px 0"
              : "12px 20px calc(18px + env(safe-area-inset-bottom))",
            position: "relative",
            zIndex: 20,
            display: "flex",
            justifyContent: transparentSurface ? "flex-end" : "stretch",
            marginTop: transparentSurface ? 8 : 0,
            pointerEvents: phase === "reveal" ? "auto" : "none",
          }}
        >
          <motion.div whileTap={{ scale: 0.97 }} style={{ width: transparentSurface ? "auto" : "100%" }}>
            <button
              type="button"
              onClick={() => onContinue()}
              style={{
                width: transparentSurface ? "auto" : "100%",
                minWidth: transparentSurface ? 220 : undefined,
                padding: transparentSurface ? "0 28px" : undefined,
                height: transparentSurface ? 50 : 54,
                borderRadius: 16,
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
                  : "0 8px 32px rgba(234,88,12,0.35), 0 0 0 1px rgba(255,143,86,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Continue
              <ChevronRight size={18} strokeWidth={2.2} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Scrolling row ──────────────────────────────────────────────────────── */

function ScrollRow({
  direction,
  speed,
  jobs,
  rowIndex,
}: {
  direction: "left" | "right";
  speed: number;
  jobs: typeof MOCK_JOBS;
  rowIndex: number;
}) {
  const rowWidth = jobs.length * 210 + (jobs.length - 1) * 10;
  const pixelsPerSecond = Math.max(12, speed * 60);
  const durationSeconds = rowWidth / pixelsPerSecond;
  const fromX = direction === "right" ? 0 : -rowWidth;
  const toX = direction === "right" ? -rowWidth : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 + rowIndex * 0.15, ease: EASE }}
      style={{ padding: "6px 0" }}
    >
      <div
        style={{
          overflowX: "hidden",
          overflowY: "visible",
          boxSizing: "content-box",
          padding: "10px 0",
          margin: "-10px 0",
          whiteSpace: "nowrap",
          maskImage:
            "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <motion.div
          animate={{ x: [fromX, toX] }}
          transition={{
            duration: durationSeconds,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            display: "inline-flex",
            gap: 10,
            width: "max-content",
            willChange: "transform",
            transform: "translate3d(0, 0, 0)",
            backfaceVisibility: "hidden",
          }}
        >
          {[...jobs, ...jobs].map((job, i) => (
            <JobCard key={`r${rowIndex}-${i}`} job={job} index={(rowIndex * 6 + i) % COMPANY_PALETTES.length} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Job card with blurred details ──────────────────────────────────────── */

function JobCard({ job, index }: { job: (typeof MOCK_JOBS)[0]; index: number }) {
  const palette = COMPANY_PALETTES[index % COMPANY_PALETTES.length];

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        width: 210,
        padding: "14px 16px 14px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(28,25,23,0.05)",
        boxShadow:
          "0 1px 3px rgba(28,25,23,0.06), 0 4px 16px rgba(28,25,23,0.04), inset 0 1px 0 rgba(255,255,255,0.7)",
        whiteSpace: "normal",
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle inner accent glow */}
      <div
        style={{
          position: "absolute",
          top: -10,
          right: -10,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${palette.accent}44, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Company header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 9,
            background: palette.bg,
            border: `1px solid ${palette.accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: palette.fg }}>
            {job.company.charAt(0)}
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#1C1917",
              margin: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {job.company}
          </p>
          <span
            style={{
              display: "inline-block",
              marginTop: 2,
              fontSize: 11,
              color: "#78716C",
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <MapPin size={10} color="#A8A29E" strokeWidth={2} />
              {job.location}
            </span>
          </span>
        </div>
      </div>

      {/* Role */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#44403C",
          margin: "0 0 8px",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}
      >
        {job.role}
      </p>

      {/* Blurred details strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          position: "relative",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            filter: "blur(4px)",
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            flexWrap: "nowrap",
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: 11, color: "#78716C" }}>Compensation Details</span>
          <span style={{ fontSize: 11, color: "#D6D3D1" }}>·</span>
          <span style={{ fontSize: 11, color: "#78716C" }}>Hiring Priority</span>
        </div>
        <Lock
          size={10}
          color="#A8A29E"
          strokeWidth={2.2}
          style={{ marginLeft: "auto", flexShrink: 0, opacity: 0.5 }}
        />
      </div>

    </div>
  );
}
