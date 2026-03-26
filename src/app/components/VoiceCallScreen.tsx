import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhoneOff } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
export type ZappyCallState = "listening" | "thinking" | "speaking";

interface Props {
  firstName: string;
  onEnd: () => void;
}

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = {
  bg: "#FDFBF8",
  primary: "#1C1917",
  textMuted: "#78716C",
  textSec: "#A8A29E",
  border: "rgba(28,25,23,0.09)",
  controlBg: "#EDEBE8",
  endCall: "#E5322D",
  endCallBg: "rgba(229,50,45,0.1)",
};

const STATE_CONFIG: Record<ZappyCallState, {
  label: string;
  color: string;
  bg: string;
  border: string;
  orb: string;
  orbOuter: string;
}> = {
  listening: {
    label: "Listening",
    color: "#D4478A",
    bg: "rgba(212,71,138,0.09)",
    border: "rgba(212,71,138,0.28)",
    orb: "#E879A0",
    orbOuter: "rgba(232,121,160,0.18)",
  },
  thinking: {
    label: "Thinking…",
    color: "#EA580C",
    bg: "rgba(146,64,14,0.09)",
    border: "rgba(146,64,14,0.25)",
    orb: "#EA580C",
    orbOuter: "rgba(234,88,12,0.14)",
  },
  speaking: {
    label: "Speaking",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.25)",
    orb: "#A855F7",
    orbOuter: "rgba(168,85,247,0.16)",
  },
};

// ── Pinwheel animation placeholder ────────────────────────────────────────────
// NOTE: Replace the contents of <PinwheelPlaceholder /> with the
//       CSS/SVG animation code you provide later. The `state` prop
//       exposes the current call state for animation branching.
function PinwheelPlaceholder({ state }: { state: ZappyCallState }) {
  const config = STATE_CONFIG[state];

  const speedMap: Record<ZappyCallState, number> = {
    listening: 3.5,
    thinking: 7,
    speaking: 1.8,
  };

  const scaleMap: Record<ZappyCallState, number> = {
    listening: 1,
    thinking: 0.82,
    speaking: 1.1,
  };

  const speed = speedMap[state];
  const scale = scaleMap[state];

  const petals = 6;

  return (
    <motion.div
      animate={{ scale }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: 160, height: 160, position: "relative" }}
    >
      {/* Outer glow ring */}
      <motion.div
        animate={{
          boxShadow: `0 0 60px 20px ${config.orbOuter}`,
          background: config.orbOuter,
        }}
        transition={{ duration: 0.7 }}
        style={{
          position: "absolute", inset: -20, borderRadius: "50%",
          filter: "blur(14px)",
        }}
      />

      {/* Petal container — spins */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        style={{ position: "absolute", inset: 0 }}
      >
        {Array.from({ length: petals }).map((_, i) => {
          const angle = (i / petals) * 360;
          const isAlternate = i % 2 === 1;
          return (
            <motion.div
              key={i}
              animate={{ opacity: isAlternate ? 0.55 : 0.9 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "absolute",
                left: "50%", top: "50%",
                width: 64, height: 64,
                marginLeft: -32, marginTop: -32,
                transformOrigin: "50% 50%",
                transform: `rotate(${angle}deg) translateY(-30px)`,
              }}
            >
              <motion.div
                animate={{ background: config.orb }}
                transition={{ duration: 0.6 }}
                style={{
                  width: "100%", height: "100%",
                  borderRadius: "60% 40% 60% 40% / 60% 60% 40% 40%",
                  filter: "blur(6px)",
                  opacity: isAlternate ? 0.6 : 1,
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Inner core */}
      <motion.div
        animate={{ background: config.orb, scale: state === "speaking" ? [1, 1.06, 1] : 1 }}
        transition={state === "speaking"
          ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.6 }}
        style={{
          position: "absolute", inset: 40,
          borderRadius: "50%",
          filter: "blur(2px)",
        }}
      />
    </motion.div>
  );
}

// ── Control button ─────────────────────────────────────────────────────────────
function CtrlBtn({
  onClick, active, children, size = 52,
  bg = "white", danger = false,
}: {
  onClick?: () => void;
  active?: boolean;
  children: ReactNode;
  size?: number;
  bg?: string;
  danger?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.06 }}
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: danger ? C.endCall : active ? "rgba(28,25,23,0.14)" : bg,
        border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: danger ? "0 4px 18px rgba(229,50,45,0.32)" : "none",
        transition: "background 0.18s",
      }}
    >
      {children}
    </motion.button>
  );
}

// ── Voice waveform visualiser ──────────────────────────────────────────────────
// Simulates microphone volume bars — active & animated when user is speaking
// (callState === "listening"), flat & dim otherwise.
const BAR_COUNT = 5;
// Natural rhythm: each bar gets a slightly different update cadence
const BAR_DELAYS = [0, 60, 120, 40, 90]; // ms offset per bar

function VoiceWaveform({ isActive }: { isActive: boolean }) {
  const [heights, setHeights] = useState<number[]>(Array(BAR_COUNT).fill(4));

  useEffect(() => {
    if (!isActive) {
      setHeights(Array(BAR_COUNT).fill(4));
      return;
    }

    // Staggered per-bar timers for an organic feel
    const timers = BAR_DELAYS.map((delay, i) => {
      let t: ReturnType<typeof setTimeout>;
      const tick = () => {
        setHeights(prev => {
          const next = [...prev];
          // Each bar independently picks a random height
          next[i] = Math.round(Math.random() * 20 + 4);
          return next;
        });
        t = setTimeout(tick, 110 + Math.random() * 80);
      };
      return setTimeout(tick, delay);
    });

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 4, height: 52, width: 72,
      paddingLeft: 4,
    }}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: isActive ? h : 4 }}
          transition={{ duration: 0.13, ease: "easeOut" }}
          style={{
            width: 3.5, borderRadius: 10,
            background: isActive
              ? `rgba(234,88,12,${0.55 + (h / 24) * 0.45})`
              : "rgba(28,25,23,0.2)",
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function VoiceCallScreen({ firstName, onEnd }: Props) {
  const [callState, setCallState] = useState<ZappyCallState>("listening");
  const [isMuted, setIsMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Demo: auto-cycle through states to simulate a live call
  useEffect(() => {
    const sequence: { state: ZappyCallState; duration: number }[] = [
      { state: "listening", duration: 3200 },
      { state: "thinking",  duration: 1800 },
      { state: "speaking",  duration: 4500 },
      { state: "listening", duration: 2800 },
      { state: "thinking",  duration: 1400 },
      { state: "speaking",  duration: 5200 },
    ];
    let idx = 0;
    let t: ReturnType<typeof setTimeout>;

    const advance = () => {
      idx = (idx + 1) % sequence.length;
      setCallState(sequence[idx].state);
      t = setTimeout(advance, sequence[idx].duration);
    };

    t = setTimeout(advance, sequence[0].duration);
    return () => clearTimeout(t);
  }, []);

  // Elapsed timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const cfg = STATE_CONFIG[callState];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: C.bg,
        display: "flex", flexDirection: "column",
        fontFamily: "Inter, sans-serif",
        maxWidth: 390, margin: "0 auto",
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div style={{
        padding: "20px 20px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        {/* Timer */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "5px 12px", borderRadius: 100,
          background: "rgba(28,25,23,0.05)",
        }}>
          {/* Green live dot */}
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22C55E",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: C.primary, letterSpacing: "-0.01em" }}>
            {formatTime(elapsed)}
          </span>
        </div>

        {/* Caller label */}
        <div style={{ textAlign: "center" }}>
          
        </div>

        {/* Close button */}
        
      </div>

      {/* ── Centre animation area ────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 36,
      }}>

        {/* ─── ANIMATION SLOT ─────────────────────────────────────────────────
            Replace everything inside this wrapper with your CSS/SVG code.
            The `callState` variable holds: "listening" | "thinking" | "speaking"
        ─────────────────────────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={callState}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <PinwheelPlaceholder state={callState} />
          </motion.div>
        </AnimatePresence>
        {/* ─── END ANIMATION SLOT ──────────────────────────────────────────── */}

        {/* Status pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={callState + "-pill"}
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: "7px 20px", borderRadius: 100,
              background: cfg.bg,
              border: `1.5px solid ${cfg.border}`,
            }}
          >
            <span style={{
              fontSize: 14, fontWeight: 500,
              color: cfg.color, letterSpacing: "-0.01em",
            }}>
              {cfg.label}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom controls ──────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        padding: "0 20px 52px",
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 16,
      }}>

        {/* Main pill control bar */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: C.controlBg,
          borderRadius: 100, padding: "10px 14px",
        }}>

          {/* ── Voice waveform (left of mic) ── */}
          <VoiceWaveform isActive={callState === "listening" && !isMuted} />

          {/* Microphone */}
          <CtrlBtn onClick={() => setIsMuted(v => !v)} active={isMuted}>
            {isMuted ? (
              /* Muted mic with slash */
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4a3 3 0 016 0v4a3 3 0 01-6 0V4z"
                  stroke={C.primary} strokeWidth="1.6" strokeLinecap="round" />
                <path d="M4 9.5a6 6 0 0012 0"
                  stroke={C.primary} strokeWidth="1.6" strokeLinecap="round" />
                <path d="M10 15.5v3"
                  stroke={C.primary} strokeWidth="1.6" strokeLinecap="round" />
                <path d="M3 3l14 14" stroke={C.endCall} strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4a3 3 0 016 0v4a3 3 0 01-6 0V4z"
                  stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M4 9.5a6 6 0 0012 0"
                  stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M10 15.5v3"
                  stroke="#1C1917" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            )}
          </CtrlBtn>

          {/* divider */}
          <div style={{ width: 1, height: 28, background: "rgba(28,25,23,0.12)", margin: "0 2px" }} />

          {/* End call — PhoneOff (lucide) is the universal hang-up icon */}
          <CtrlBtn onClick={onEnd} danger size={52}>
            <PhoneOff size={20} color="white" strokeWidth={2} />
          </CtrlBtn>
        </div>

        {/* Muted indicator */}
        <AnimatePresence>
          {isMuted && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              style={{ fontSize: 12, color: C.textSec, letterSpacing: "0.01em" }}
            >
              Your microphone is muted
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}