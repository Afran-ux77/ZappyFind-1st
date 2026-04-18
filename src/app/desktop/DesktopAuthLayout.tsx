import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, TrendingUp, Radar, Zap, ShieldCheck } from "lucide-react";
import { DT } from "./desktop-tokens";

type DesktopAuthLayoutProps = {
  children: ReactNode;
  /** Right column: form */
  side?: "signup" | "signin";
};

/* ──────────────────────────────────────────────────────────────────────────
   Static content for the visual pane
   ────────────────────────────────────────────────────────────────────────── */

const ROTATING_ROLES = [
  "Designer",
  "Engineer",
  "PM",
  "Marketer",
  "Analyst",
  "Founder",
];

/** Longest visual width — used to reserve space so the headline doesn't reflow. */
const ROLE_PLACEHOLDER = "Designer.";

type MatchCard = {
  company: string;
  logo: string;
  color: string;
  role: string;
  match: number;
  location: string;
  meta: string;
};

const MATCH_CARDS: MatchCard[] = [
  {
    company: "Linear",
    logo: "L",
    color: "#5E6AD2",
    role: "Senior Product Designer",
    match: 96,
    location: "Remote · Global",
    meta: "₹38L–₹52L",
  },
  {
    company: "Stripe",
    logo: "S",
    color: "#635BFF",
    role: "Frontend Engineer",
    match: 92,
    location: "Bangalore · Hybrid",
    meta: "₹32L–₹46L",
  },
  {
    company: "Notion",
    logo: "N",
    color: "#1C1917",
    role: "Product Manager",
    match: 89,
    location: "NYC · Hybrid",
    meta: "$160k–$210k",
  },
];

const VALUE_PROPS = [
  { icon: Radar, label: "Ranked by fit, not keyword luck" },
  { icon: Zap, label: "Salary & work-style baked in" },
  { icon: ShieldCheck, label: "Private until you say go" },
];

/* ──────────────────────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────────────────────── */

export function DesktopAuthLayout({ children, side = "signup" }: DesktopAuthLayoutProps) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [liveCount, setLiveCount] = useState(247);

  // Rotate the headline role word
  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % ROTATING_ROLES.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  // "Live matches" ticker — small, frequent increments to feel alive
  useEffect(() => {
    const id = setInterval(
      () => setLiveCount((c) => c + Math.floor(Math.random() * 3) + 1),
      3800,
    );
    return () => clearInterval(id);
  }, []);

  const isSignup = side === "signup";

  return (
    <div className="flex min-h-screen w-full" style={{ fontFamily: DT.sans }}>
      {/* ═════════════════════════════════════════════════════════════════════
         LEFT — VISUAL PANE
         ═════════════════════════════════════════════════════════════════════ */}
      <div
        className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden lg:flex"
        style={{
          background:
            "linear-gradient(140deg, #FFF8F0 0%, #FBEFE0 30%, #F6E1C9 58%, #F1D4B2 86%, #EFCBA1 100%)",
          color: "#1C1917",
        }}
      >
        {/* ─── Ambient aurora layer (warm, slow drift) ─── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 62% 52% at 22% 18%, rgba(234,88,12,0.30) 0%, transparent 60%), radial-gradient(ellipse 58% 48% at 80% 78%, rgba(251,146,60,0.24) 0%, transparent 62%)",
          }}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ─── Cool accent aurora (depth + premium feel) ─── */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 42% at 70% 22%, rgba(124,58,237,0.14) 0%, transparent 65%), radial-gradient(ellipse 38% 32% at 18% 78%, rgba(59,130,246,0.10) 0%, transparent 62%)",
          }}
          animate={{ x: [0, 22, -10, 0], y: [0, -16, 12, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ─── Faint grid pattern (modern, "calibrated" feel) ─── */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: 0.06, mixBlendMode: "multiply" }}
        >
          <defs>
            <pattern id="zf-auth-grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#1C1917" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zf-auth-grid)" />
        </svg>

        {/* ─── Subtle film grain ─── */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: 0.18, mixBlendMode: "multiply" }}
        >
          <filter id="zf-auth-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#zf-auth-noise)" />
        </svg>

        {/* ─── Floating particles ─── */}
        {[
          { left: 12, top: 22, size: 4, hue: "warm", delay: 0 },
          { left: 28, top: 14, size: 3, hue: "cool", delay: 0.6 },
          { left: 70, top: 18, size: 5, hue: "warm", delay: 1.2 },
          { left: 86, top: 38, size: 3, hue: "white", delay: 0.3 },
          { left: 18, top: 64, size: 4, hue: "white", delay: 1.5 },
          { left: 78, top: 70, size: 3, hue: "warm", delay: 0.9 },
          { left: 46, top: 84, size: 4, hue: "cool", delay: 1.8 },
        ].map((p, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="pointer-events-none absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              background:
                p.hue === "warm"
                  ? "rgba(234,88,12,0.55)"
                  : p.hue === "cool"
                  ? "rgba(124,58,237,0.55)"
                  : "rgba(255,255,255,0.85)",
              filter: "blur(0.6px)",
              boxShadow:
                p.hue === "warm"
                  ? "0 0 12px rgba(234,88,12,0.45)"
                  : p.hue === "cool"
                  ? "0 0 12px rgba(124,58,237,0.4)"
                  : "0 0 10px rgba(255,255,255,0.7)",
            }}
            animate={{
              y: [0, -22, 0],
              opacity: [0.35, 1, 0.35],
              scale: [1, 1.35, 1],
            }}
            transition={{
              duration: 4.5 + (i % 3) * 0.7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        {/* ─── Soft white highlight (top-right) ─── */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-16 h-[380px] w-[380px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.18) 45%, transparent 72%)",
            filter: "blur(2px)",
          }}
        />

        {/* ═════════════════════════════════════════════════════════════════
           CONTENT
           ═════════════════════════════════════════════════════════════════ */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-12 pb-10 pt-10 xl:px-16">
          {/* ─── Top row: brand ─── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 flex items-center"
          >
            <div className="flex items-center gap-2.5">
              <motion.div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #FF9059 0%, #EA580C 60%, #C2410C 100%)",
                  boxShadow:
                    "0 6px 18px rgba(234,88,12,0.38), 0 1px 0 rgba(255,255,255,0.35) inset",
                }}
                whileHover={{ rotate: -6, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              >
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.4} />
              </motion.div>
              <span
                className="text-[16px] font-semibold tracking-tight"
                style={{ color: "#1C1917" }}
              >
                ZappyFind
              </span>
            </div>
          </motion.div>

          {/* ─── Center: headline + visual ─── */}
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <div className="mx-auto w-full max-w-[520px]">
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-5 text-balance font-serif text-[2.4rem] font-normal leading-[1.08] tracking-tight xl:text-[2.85rem]"
                style={{ fontFamily: DT.serif, color: "#0F172A" }}
              >
                {isSignup ? (
                  <>
                    Your next role
                    <br />
                    as a{" "}
                    <span className="relative inline-block align-baseline">
                      {/* Invisible placeholder reserves layout width */}
                      <span aria-hidden className="invisible">
                        {ROLE_PLACEHOLDER}
                      </span>
                      <span className="absolute inset-0 inline-flex items-baseline overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={ROTATING_ROLES[roleIdx]}
                            initial={{ y: 22, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -22, opacity: 0 }}
                            transition={{
                              duration: 0.42,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="inline-block"
                            style={{
                              backgroundImage:
                                "linear-gradient(135deg, #FB923C 0%, #EA580C 55%, #9A3412 100%)",
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              color: "transparent",
                            }}
                          >
                            {ROTATING_ROLES[roleIdx]}.
                          </motion.span>
                        </AnimatePresence>
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    Welcome back.
                    <br />
                    <span
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #FB923C 0%, #EA580C 55%, #9A3412 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                    >
                      Pick up where you left off.
                    </span>
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 max-w-md text-[15.5px] leading-[1.6] text-stone-600"
              >
                {isSignup
                  ? "AI-curated jobs across 50,000+ open roles—filtered to the ones that match your skills, salary, and how you like to work."
                  : "Your matches kept calibrating while you were away. Sign in to see what changed and what’s newly worth a look."}
              </motion.p>

              {/* ─── Floating match-cards stack ─── */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="relative mb-7"
                style={{ height: 200 }}
              >
                {MATCH_CARDS.map((card, i) => {
                  const offsets = [0, 30, 60];
                  const rotations = [-1.2, 0.6, -0.6];
                  return (
                    <motion.div
                      key={card.company}
                      className="absolute left-0 right-0 rounded-2xl px-4 py-3.5"
                      style={{
                        background: "rgba(255,255,255,0.88)",
                        backdropFilter: "blur(18px)",
                        WebkitBackdropFilter: "blur(18px)",
                        border: "1px solid rgba(28,25,23,0.06)",
                        boxShadow:
                          "0 1px 0 rgba(255,255,255,0.85) inset, 0 8px 28px rgba(28,25,23,0.08), 0 1px 3px rgba(28,25,23,0.05)",
                        top: offsets[i],
                        zIndex: MATCH_CARDS.length - i,
                      }}
                      initial={{ y: 22 + i * 6, opacity: 0, rotate: 0 }}
                      animate={{
                        y: [0, -5, 0],
                        opacity: 1,
                        rotate: rotations[i],
                      }}
                      transition={{
                        y: {
                          duration: 4.4 + i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.35,
                        },
                        opacity: { duration: 0.5, delay: 0.45 + i * 0.12 },
                        rotate: {
                          duration: 0.6,
                          delay: 0.45 + i * 0.12,
                          ease: [0.16, 1, 0.3, 1],
                        },
                      }}
                      whileHover={{
                        y: -8,
                        rotate: 0,
                        transition: { type: "spring", stiffness: 320, damping: 22 },
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-bold text-white"
                          style={{
                            background: card.color,
                            boxShadow: `0 4px 14px ${card.color}55`,
                          }}
                        >
                          {card.logo}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[13.5px] font-semibold text-stone-900">
                              {card.role}
                            </p>
                            <motion.div
                              className="flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5"
                              style={{
                                background:
                                  i === 0
                                    ? "linear-gradient(135deg, rgba(16,185,129,0.18), rgba(5,150,105,0.16))"
                                    : "rgba(16,185,129,0.12)",
                                color: "#047857",
                                border:
                                  i === 0
                                    ? "1px solid rgba(16,185,129,0.32)"
                                    : "1px solid rgba(16,185,129,0.18)",
                              }}
                              animate={
                                i === 0
                                  ? { scale: [1, 1.06, 1] }
                                  : { scale: 1 }
                              }
                              transition={{
                                duration: 2.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <span className="text-[10px] font-bold tabular-nums tracking-tight">
                                {card.match}% match
                              </span>
                            </motion.div>
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-stone-500">
                            <span className="truncate font-medium text-stone-700">
                              {card.company}
                            </span>
                            <span className="text-stone-400">·</span>
                            <span className="truncate">{card.location}</span>
                            <span className="text-stone-400">·</span>
                            <span className="truncate">{card.meta}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* ─── Live counter ─── */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mb-7 flex items-center gap-2 text-[12.5px] text-stone-600"
              >
                <TrendingUp className="h-3.5 w-3.5 text-orange-500" strokeWidth={2.2} />
                <span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={liveCount}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 8, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block font-semibold tabular-nums text-stone-800"
                    >
                      {liveCount.toLocaleString()}
                    </motion.span>
                  </AnimatePresence>{" "}
                  matches calibrated in the last hour
                </span>
              </motion.div>

              {/* ─── Value props ─── */}
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } },
                }}
                className="space-y-3"
              >
                {VALUE_PROPS.map(({ icon: Icon, label }) => (
                  <motion.li
                    key={label}
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 text-[13.5px] text-stone-700"
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.65)",
                        border: "1px solid rgba(234,88,12,0.18)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                      }}
                    >
                      <Icon className="h-3.5 w-3.5 text-orange-600" strokeWidth={2} />
                    </div>
                    <span>{label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* ─── Footer microcopy ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="w-full max-w-[520px] shrink-0 self-center pt-6 text-center text-[11.5px] tracking-tight text-stone-500"
          >
            Built for fresh grads to senior ICs exploring their next move.
          </motion.div>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
         RIGHT — FORM PANE (unchanged)
         ═════════════════════════════════════════════════════════════════════ */}
      <div
        className="flex min-h-screen flex-1 flex-col justify-center py-10"
        style={{ background: "#FDFBF8" }}
      >
        <div className="mx-auto w-full max-w-[440px] shrink-0 overflow-x-hidden px-8 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
