import type { ReactNode } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Radar, Zap } from "lucide-react";
import { DT } from "./desktop-tokens";
import { Ticker } from "../components/Ticker";

type DesktopAuthLayoutProps = {
  children: ReactNode;
  /** Right column: form */
  side?: "signup" | "signin";
};

export function DesktopAuthLayout({ children, side = "signup" }: DesktopAuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full" style={{ fontFamily: DT.sans }}>
      <div
        className="relative hidden min-h-screen flex-1 flex-col justify-between overflow-hidden lg:flex"
        style={{
          background: "linear-gradient(158deg, #FCF8F4 0%, #F9F3EC 38%, #F6EFE6 72%, #F4ECE3 100%)",
          color: "#1C1917",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 78% 58% at 10% 8%, rgba(234,88,12,0.16) 0%, rgba(234,88,12,0.06) 36%, transparent 62%), radial-gradient(ellipse 68% 50% at 82% 14%, rgba(251,146,60,0.14) 0%, transparent 64%)",
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-24 h-56 w-56 rounded-full"
          animate={{ x: [0, 26, -8, 0], y: [0, -16, 10, 0], scale: [1, 1.08, 0.95, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(234,88,12,0.22) 0%, rgba(234,88,12,0.06) 44%, transparent 74%)",
            filter: "blur(2px)",
          }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute right-6 top-1/3 h-44 w-44 rounded-full"
          animate={{ x: [0, -14, 8, 0], y: [0, 14, -8, 0], scale: [1, 0.9, 1.06, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(59,130,246,0.05) 42%, transparent 72%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "conic-gradient(from 225deg at 82% 30%, rgba(234,88,12,0.06), rgba(255,255,255,0.0) 24%, rgba(59,130,246,0.04) 56%, rgba(255,255,255,0.0) 78%, rgba(234,88,12,0.05))",
            opacity: 0.65,
          }}
        />
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: 0.2, mixBlendMode: "multiply" }}
        >
          <filter id="desktop-auth-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#desktop-auth-noise)" />
        </svg>
        <div
          className="pointer-events-none absolute -right-24 top-20 h-[360px] w-[360px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.22) 45%, transparent 74%)",
            filter: "blur(3px)",
          }}
        />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col px-12 pb-10 pt-10 xl:px-16">
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-[480px] self-center text-left"
            >
              <h1
                className="mb-4 text-balance font-serif text-[2.25rem] font-normal leading-[1.12] tracking-tight xl:text-[2.6rem]"
                style={{ fontFamily: DT.serif, color: "#111827" }}
              >
                {side === "signup" ? (
                  <>
                    Your next role,
                    <br />
                    <span style={{ color: "#C2410C" }}>without the noise.</span>
                  </>
                ) : (
                  <>
                    Welcome back.
                    <br />
                    <span style={{ color: "#C2410C" }}>Pick up where you left off.</span>
                  </>
                )}
              </h1>
              <p className="mb-7 max-w-md text-[15px] leading-relaxed text-stone-600">
                One profile, calibrated matches, and a clear read on fit—so you spend time on
                conversations that matter, not endless forms.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 w-full"
              >
                <Ticker
                  fadeColor="transparent"
                  chipBackground="rgba(255,255,255,0.35)"
                />
              </motion.div>

              <ul className="space-y-3.5 text-left">
                {[
                  { icon: Radar, t: "Matches ranked by fit, not keyword luck" },
                  { icon: Zap, t: "Faster decisions with salary & work-style context" },
                  { icon: CheckCircle2, t: "Save, compare, and act from one workspace" },
                ].map(({ icon: Icon, t }) => (
                  <li key={t} className="flex items-start gap-3 text-[14px] text-stone-700">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" strokeWidth={1.75} />
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <div className="w-full max-w-[480px] shrink-0 self-center pt-6 text-center text-[12px] text-stone-500">
            Built for focused candidates exploring their next move.
          </div>
        </div>
      </div>

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
