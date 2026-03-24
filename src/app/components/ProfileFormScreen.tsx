import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ParsedProfile } from "./WelcomeScreen";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#FDFBF8",
  primary: "#1C1917",
  brand: "#C2410C",
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSecondary: "#A8A29E",
  border: "rgba(28,25,23,0.09)",
  inputBg: "#FFFFFF",
  orbA: "rgba(194,65,12,0.06)",
  orbB: "rgba(146,64,14,0.04)",
};

const EXP_OPTIONS = ["0–1 yr", "1–3 yrs", "3–5 yrs", "5–10 yrs", "10+ yrs"];
const WORK_MODES  = ["Remote", "Hybrid", "On-site"];
const EMP_TYPES   = ["Full-time", "Part-time", "Contract", "Freelance"];

interface ProfileFormScreenProps {
  email: string;
  prefilled: ParsedProfile | null;
  onComplete: () => void;
  onBack: () => void;
}

// ── Small reusable input ──────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder, type = "text", index,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; index: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, delay: 0.08 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <label style={{
        display: "block", fontSize: "11px", fontWeight: 600,
        color: focused ? C.brand : C.textSecondary,
        letterSpacing: "0.06em", textTransform: "uppercase",
        marginBottom: "8px",
        transition: "color 0.2s",
      }}>
        {label}
      </label>
      <div style={{
        borderRadius: "14px",
        background: C.inputBg,
        border: focused
          ? "1.5px solid rgba(194,65,12,0.35)"
          : `1.5px solid ${C.border}`,
        boxShadow: focused
          ? "0 0 0 3px rgba(194,65,12,0.08), 0 1px 4px rgba(0,0,0,0.04)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}>
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "15px 16px",
            fontSize: "15px", fontWeight: 400,
            color: C.textPrimary,
            background: "transparent",
            border: "none", outline: "none",
            borderRadius: "14px",
            fontFamily: "Inter, sans-serif",
          }}
        />
      </div>
    </motion.div>
  );
}

// ── Toggle chip ───────────────────────────────────────────────────────────────
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      style={{
        padding: "8px 16px",
        borderRadius: "100px",
        border: active ? "1.5px solid transparent" : `1.5px solid ${C.border}`,
        background: active ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)" : "white",
        color: active ? "white" : C.textMuted,
        fontSize: "13px", fontWeight: active ? 600 : 500,
        cursor: "pointer",
        letterSpacing: "-0.01em",
        fontFamily: "Inter, sans-serif",
        boxShadow: active
          ? "0 2px 10px rgba(255,107,53,0.3)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "background 0.18s, color 0.18s, box-shadow 0.18s, border-color 0.18s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ProfileFormScreen({
  email, prefilled, onComplete, onBack,
}: ProfileFormScreenProps) {
  const [name,       setName]       = useState(prefilled?.name     ?? "");
  const [title,      setTitle]      = useState(prefilled?.title    ?? "");
  const [experience, setExperience] = useState("");
  const [skills,     setSkills]     = useState<string[]>(prefilled?.skills ?? []);
  const [location,   setLocation]   = useState(prefilled?.location ?? "");
  const [workModes,  setWorkModes]  = useState<string[]>([]);
  const [empTypes,   setEmpTypes]   = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const skillRef = useRef<HTMLInputElement>(null);

  const addSkill = (raw: string) => {
    const trimmed = raw.replace(/,$/, "").trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((s) => [...s, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => setSkills((s) => s.filter((x) => x !== skill));

  const toggleWorkMode = (m: string) =>
    setWorkModes((s) => s.includes(m) ? s.filter((x) => x !== m) : [...s, m]);

  const toggleEmpType = (t: string) =>
    setEmpTypes((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t]);

  const canSubmit = name.trim().length > 0 && title.trim().length > 0 && skills.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || submitted) return;
    setSubmitted(true);
    await new Promise((r) => setTimeout(r, 900));
    onComplete();
  };

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: C.bg, fontFamily: "Inter, sans-serif" }}
    >
      {/* Ambient orbs */}
      <div className="absolute top-0 left-0 pointer-events-none" style={{
        width: "260px", height: "260px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orbA} 0%, transparent 70%)`,
        transform: "translate(-40%, -40%)",
      }} />
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{
        width: "200px", height: "200px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orbB} 0%, transparent 70%)`,
        transform: "translate(30%, 30%)",
      }} />

      {/* ── Sticky header ──────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-10 px-4 pt-10 pb-4"
        style={{
          background: "rgba(253,251,248,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Back + step indicator */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-4"
        >
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "white",
              border: `1.5px solid ${C.border}`,
              borderRadius: "12px",
              padding: "7px 13px 7px 9px",
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M9 11.5L5 7.5l4-4"
                stroke={C.textPrimary} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: "13px", fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
              Back
            </span>
          </button>

          {/* Step dots */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  width: i === 1 ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "100px",
                  background: i === 1 ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)" : "rgba(28,25,23,0.15)",
                }}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {prefilled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 360, damping: 22, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 mb-3"
              style={{
                background: "rgba(194,65,12,0.07)",
                border: "1px solid rgba(194,65,12,0.18)",
                borderRadius: "100px",
                padding: "4px 12px",
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-5"
                  stroke={C.brand} strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 600, color: C.brand, letterSpacing: "-0.01em" }}>
                Profile built from your resume
              </span>
            </motion.div>
          )}

          <h1 style={{
            fontSize: "clamp(22px, 6vw, 26px)", fontWeight: 800,
            color: C.textPrimary, letterSpacing: "-0.04em",
            lineHeight: 1.2, marginBottom: "4px",
          }}>
            Your Profile
          </h1>
          <p style={{ fontSize: "13px", color: C.textMuted, letterSpacing: "-0.01em" }}>
            {prefilled ? "Review and complete your details" : "Tell us about yourself to get started"}
          </p>
        </motion.div>
      </div>

      {/* ── Scrollable form body ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-36 gap-6 overflow-y-auto">

        {/* Full Name */}
        <Field
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="Alex Johnson"
          index={0}
        />

        {/* Current Role */}
        <Field
          label="Current Role / Title"
          value={title}
          onChange={setTitle}
          placeholder="e.g. Product Designer"
          index={1}
        />

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          <label style={{
            display: "block", fontSize: "11px", fontWeight: 600,
            color: C.textSecondary, letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            Experience
          </label>
          <div className="flex flex-wrap gap-2">
            {EXP_OPTIONS.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                active={experience === opt}
                onClick={() => setExperience(experience === opt ? "" : opt)}
              />
            ))}
          </div>
        </motion.div>

        {/* Location */}
        <Field
          label="Current Location"
          value={location}
          onChange={setLocation}
          placeholder="e.g. Bangalore, India"
          index={3}
        />

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
        >
          <label style={{
            display: "block", fontSize: "11px", fontWeight: 600,
            color: C.textSecondary, letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            Skills <span style={{ color: C.brand }}>*</span>
          </label>

          {/* Tag cloud */}
          <div className="flex flex-wrap gap-2 mb-3">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 500, damping: 26 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "100px",
                    background: "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)",
                    color: "white",
                    fontSize: "13px", fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      border: "none",
                      borderRadius: "50%",
                      width: "16px", height: "16px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                      padding: 0,
                      color: "white",
                      fontSize: "10px",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1 1l6 6M7 1L1 7"
                        stroke="white" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Skill input */}
          <div style={{
            borderRadius: "14px",
            background: C.inputBg,
            border: `1.5px solid ${C.border}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            display: "flex", alignItems: "center",
            paddingRight: "6px",
          }}>
            <input
              ref={skillRef}
              type="text"
              value={skillInput}
              placeholder="Add a skill and press Enter"
              onChange={(e) => {
                const v = e.target.value;
                if (v.endsWith(",")) { addSkill(v); return; }
                setSkillInput(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput); }
                if (e.key === "Backspace" && !skillInput && skills.length)
                  removeSkill(skills[skills.length - 1]);
              }}
              onFocus={(e) => {
                e.target.parentElement!.style.border = "1.5px solid rgba(194,65,12,0.35)";
                e.target.parentElement!.style.boxShadow = "0 0 0 3px rgba(194,65,12,0.08)";
              }}
              onBlur={(e) => {
                if (skillInput) addSkill(skillInput);
                e.target.parentElement!.style.border = `1.5px solid ${C.border}`;
                e.target.parentElement!.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
              }}
              style={{
                flex: 1,
                padding: "14px 16px",
                fontSize: "15px", fontWeight: 400,
                color: C.textPrimary,
                background: "transparent",
                border: "none", outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />
            {skillInput && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => addSkill(skillInput)}
                style={{
                  width: "32px", height: "32px",
                  borderRadius: "10px",
                  background: "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10"
                    stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Work Preference */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          <label style={{
            display: "block", fontSize: "11px", fontWeight: 600,
            color: C.textSecondary, letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            Work Preference
          </label>
          <div className="flex flex-wrap gap-2">
            {WORK_MODES.map((m) => (
              <Chip key={m} label={m} active={workModes.includes(m)} onClick={() => toggleWorkMode(m)} />
            ))}
          </div>
        </motion.div>

        {/* Employment Type */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <label style={{
            display: "block", fontSize: "11px", fontWeight: 600,
            color: C.textSecondary, letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: "10px",
          }}>
            Employment Type
          </label>
          <div className="flex flex-wrap gap-2">
            {EMP_TYPES.map((t) => (
              <Chip key={t} label={t} active={empTypes.includes(t)} onClick={() => toggleEmpType(t)} />
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Sticky CTA ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 left-1/2"
        style={{
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "390px",
          padding: "16px 16px 28px",
          background: "linear-gradient(to top, rgba(253,251,248,1) 70%, rgba(253,251,248,0) 100%)",
          zIndex: 20,
        }}
      >
        {!canSubmit && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: "11px", color: C.textSecondary,
              textAlign: "center", marginBottom: "10px",
              letterSpacing: "0.01em",
            }}
          >
            Fill in your name, role, and at least one skill to continue
          </motion.p>
        )}

        <motion.button
          onClick={handleSubmit}
          disabled={!canSubmit || submitted}
          whileTap={canSubmit && !submitted ? { scale: 0.975 } : {}}
          style={{
            width: "100%",
            padding: "18px",
            borderRadius: "16px",
            border: "none",
            background: canSubmit ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)" : "#EAE6E1",
            color: canSubmit ? "white" : "#B8AFA6",
            fontSize: "15px", fontWeight: 600,
            letterSpacing: "-0.01em",
            cursor: canSubmit && !submitted ? "pointer" : "not-allowed",
            boxShadow: canSubmit
              ? "0 4px 20px rgba(255,107,53,0.35), 0 1px 4px rgba(255,107,53,0.2)"
              : "none",
            transition: "background 0.22s, color 0.22s, box-shadow 0.22s",
            fontFamily: "Inter, sans-serif",
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: "10px",
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <span style={{
                  width: "17px", height: "17px",
                  border: "2px solid rgba(255,255,255,0.25)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.65s linear infinite",
                  display: "inline-block",
                }} />
                Setting up your profile…
              </motion.span>
            ) : (
              <motion.span
                key="cta"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5"
              >
                Complete Setup
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8H13M9 4l4 4-4 4"
                    stroke={canSubmit ? "white" : "#B8AFA6"}
                    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
