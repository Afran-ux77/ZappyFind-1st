import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { BriefcaseBusiness, ChevronRight, Mic, Sparkles } from "lucide-react";

type DesktopOnboardingIntroCardsProps = {
  firstName?: string;
  onComplete: () => void;
};

const CARDS = [
  {
    id: "focus",
    title: "Tell us what you're looking for",
    body: "Share your role goals and preferences so we can tailor your matches.",
    icon: Sparkles,
    tint:
      "radial-gradient(ellipse 120% 100% at 14% 10%, rgba(251,146,60,0.22) 0%, transparent 52%), linear-gradient(150deg, #FFF5EC 0%, #FFE9D6 100%)",
    mesh:
      "conic-gradient(from 220deg at 30% 20%, rgba(251,146,60,0.34), rgba(255,255,255,0) 25%, rgba(234,88,12,0.2) 55%, rgba(255,255,255,0) 80%, rgba(251,146,60,0.3))",
    blobA: "radial-gradient(circle, rgba(251,146,60,0.26) 0%, rgba(251,146,60,0.08) 45%, transparent 72%)",
    blobB: "radial-gradient(circle, rgba(234,88,12,0.22) 0%, rgba(234,88,12,0.06) 42%, transparent 72%)",
    iconTone: "#EA580C",
  },
  {
    id: "voice",
    title: "Help us understand you beyond your resume",
    body: "A quick AI conversation to learn your strengths",
    icon: Mic,
    tint:
      "radial-gradient(ellipse 120% 100% at 14% 10%, rgba(253,224,71,0.22) 0%, transparent 52%), linear-gradient(150deg, #FFFCEA 0%, #FFF3BE 100%)",
    mesh:
      "conic-gradient(from 205deg at 32% 24%, rgba(245,158,11,0.33), rgba(255,255,255,0) 28%, rgba(234,179,8,0.18) 56%, rgba(255,255,255,0) 82%, rgba(245,158,11,0.3))",
    blobA: "radial-gradient(circle, rgba(250,204,21,0.26) 0%, rgba(250,204,21,0.08) 46%, transparent 72%)",
    blobB: "radial-gradient(circle, rgba(217,119,6,0.2) 0%, rgba(217,119,6,0.06) 42%, transparent 72%)",
    iconTone: "#D97706",
  },
  {
    id: "match",
    title: "Get matched with the right opportunities",
    body: "Curated jobs + direct visibility to recruiters",
    icon: BriefcaseBusiness,
    tint:
      "radial-gradient(ellipse 120% 100% at 14% 10%, rgba(52,211,153,0.2) 0%, transparent 52%), linear-gradient(150deg, #EEFCF6 0%, #DDF9ED 100%)",
    mesh:
      "conic-gradient(from 210deg at 30% 22%, rgba(16,185,129,0.3), rgba(255,255,255,0) 28%, rgba(5,150,105,0.18) 56%, rgba(255,255,255,0) 82%, rgba(52,211,153,0.28))",
    blobA: "radial-gradient(circle, rgba(16,185,129,0.23) 0%, rgba(16,185,129,0.08) 46%, transparent 72%)",
    blobB: "radial-gradient(circle, rgba(5,150,105,0.2) 0%, rgba(5,150,105,0.06) 42%, transparent 72%)",
    iconTone: "#059669",
  },
] as const;

const POSITIONS = [
  { x: 0, y: 0, scale: 1, z: 30, opacity: 1, blur: "0px", rotate: 0 },
  { x: 112, y: 18, scale: 0.88, z: 20, opacity: 1, blur: "1px", rotate: 2.5 },
  { x: -112, y: 18, scale: 0.88, z: 10, opacity: 1, blur: "1.1px", rotate: -3 },
] as const;

export function DesktopOnboardingIntroCards({ firstName, onComplete }: DesktopOnboardingIntroCardsProps) {
  const [centerIndex, setCenterIndex] = useState(0);
  const [step, setStep] = useState(0);
  const isLast = step >= CARDS.length - 1;

  const ordered = useMemo(
    () => [centerIndex, (centerIndex + 1) % CARDS.length, (centerIndex + 2) % CARDS.length],
    [centerIndex],
  );

  const handleNext = () => {
    if (isLast) {
      onComplete();
      return;
    }
    setCenterIndex((prev) => (prev + 1) % CARDS.length);
    setStep((prev) => prev + 1);
  };

  return (
    <div className="mx-auto h-fit w-full max-w-[960px]">
      <div className="mb-8 text-center">
        <h2 className="text-[32px] font-semibold tracking-tight text-stone-900">
          Welcome{firstName ? `, ${firstName}` : ""} 🙌🏻
        </h2>
        <p className="mt-2 text-[15px] text-stone-600">Here is how it works in three simple steps.</p>
      </div>

      <div className="relative mx-auto mb-10 h-[340px] w-full max-w-[820px] overflow-visible">
        {ordered.map((cardIdx, posIdx) => {
          const card = CARDS[cardIdx];
          const Icon = card.icon;
          const pos = POSITIONS[posIdx];
          return (
            <motion.article
              key={card.id}
              animate={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
                opacity: pos.opacity,
                rotate: pos.rotate,
              }}
              transition={{
                x: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.92, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.96, ease: "easeOut" },
                rotate: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
              }}
              className="absolute left-1/2 top-0 flex h-[300px] w-[520px] -translate-x-1/2 flex-col overflow-hidden rounded-[28px] border p-8"
              style={{
                zIndex: pos.z,
                filter: `blur(${pos.blur})`,
                background: card.tint,
                borderColor: "rgba(255,255,255,0.92)",
                boxShadow: "0 30px 70px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.76)",
                backdropFilter: "blur(14px) saturate(150%)",
                WebkitBackdropFilter: "blur(14px) saturate(150%)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: card.mesh, opacity: 0.6, mixBlendMode: "soft-light" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full"
                style={{ background: card.blobA, filter: "blur(8px)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 bottom-6 h-40 w-40 rounded-full"
                style={{ background: card.blobB, filter: "blur(10px)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-14 top-6 h-10 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
                  filter: "blur(4px)",
                }}
              />

              <div className="relative z-10 flex min-h-0 min-w-0 flex-1 flex-col items-start justify-center px-1">
                <div className="flex w-full max-w-[420px] flex-col items-start text-left">
                  <div
                    className="mb-5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80"
                    style={{ color: card.iconTone }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.9} />
                  </div>
                  <h3 className="text-[31px] font-semibold leading-[1.14] tracking-tight text-stone-900">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone-600">{card.body}</p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 pb-1">
        {CARDS.map((_, i) => (
          <span
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === step ? 26 : 8,
              background: i <= step ? "#EA580C" : "rgba(120,113,108,0.25)",
            }}
          />
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={handleNext}
          className={
            isLast
              ? "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-8 text-[15px] font-semibold text-white transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
              : "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-stone-200/90 bg-white/85 px-8 text-[15px] font-semibold text-stone-600 shadow-[0_1px_3px_rgba(28,25,23,0.06)] backdrop-blur-sm transition-colors duration-200 hover:bg-stone-50/95 active:scale-[0.99]"
          }
          style={
            isLast
              ? {
                  background: "linear-gradient(135deg, #FB923C 0%, #EA580C 100%)",
                  boxShadow: "0 10px 28px rgba(234,88,12,0.36)",
                }
              : undefined
          }
        >
          {isLast ? "Get Started" : "Next"}
          <ChevronRight className="h-[17px] w-[17px]" strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
