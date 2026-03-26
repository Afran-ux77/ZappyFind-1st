import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Ticker } from "./Ticker";
import { FloatingLabelInput } from "./ui/FloatingLabelInput";

const C = {
  bg: "#FDFBF8",
  primary: "#1C1917",
  brand: "#C2410C",
  brandGradient: "linear-gradient(135deg, #92400E 0%, #C2410C 100%)",
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSecondary: "#A8A29E",
  border: "rgba(28,25,23,0.09)",
  toggleBg: "#EDE9E3",
  inputBg: "#FFFFFF",
  orbA: "rgba(194,65,12,0.08)",
  orbB: "rgba(146,64,14,0.05)",
};

interface LoginScreenProps {
  mode: "signup" | "signin";
  setMode: (mode: "signup" | "signin") => void;
  email: string;
  setEmail: (email: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  onContinue: () => void;
}

export function LoginScreen({
  mode,
  setMode,
  email,
  setEmail,
  fullName,
  setFullName,
  onContinue,
}: LoginScreenProps) {
  const [contact, setContact] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCountryPicker) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowCountryPicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCountryPicker]);

  const COUNTRY_CODES = [
    { code: "+91", label: "India", flag: "🇮🇳" },
    { code: "+1",  label: "US / Canada", flag: "🇺🇸" },
    { code: "+44", label: "UK", flag: "🇬🇧" },
    { code: "+971",label: "UAE", flag: "🇦🇪" },
    { code: "+65", label: "Singapore", flag: "🇸🇬" },
    { code: "+61", label: "Australia", flag: "🇦🇺" },
    { code: "+49", label: "Germany", flag: "🇩🇪" },
    { code: "+81", label: "Japan", flag: "🇯🇵" },
  ];

  const isPhone = /^\+?\d/.test(contact.trim());
  const digitsOnly = contact.replace(/\D/g, "");
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const isValidPhone = digitsOnly.length === 10;

  const showFullName = mode === "signup";
  const isValidFullName = !showFullName || fullName.trim().length > 0;

  const contactValid = isPhone
    ? isValidPhone
    : contact.trim().length > 0;

  const canContinue = isValidFullName && contactValid;

  const handleContinue = () => {
    if (!canContinue) return;
    if (isPhone) {
      setEmail(`${countryCode}${digitsOnly}`);
    } else {
      setEmail(contact.trim());
    }
    onContinue();
  };

  const handleContactChange = (value: string) => {
    if (isPhone || /^\+?\d/.test(value.trim())) {
      setContact(value.replace(/[^\d]/g, "").slice(0, 10));
    } else {
      setContact(value);
    }
  };

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: C.bg, fontFamily: "Inter, sans-serif" }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: "300px", height: "300px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.orbA} 0%, transparent 70%)`,
          transform: "translate(35%, -35%)",
        }}
      />
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: "200px", height: "200px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.orbB} 0%, transparent 70%)`,
          transform: "translate(-35%, -25%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "18%", right: "-8%",
          width: "200px", height: "200px", borderRadius: "50%",
          background: `radial-gradient(circle, ${C.orbB} 0%, transparent 70%)`,
        }}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 px-4 pt-12 pb-8 items-center text-center">

        {/* ── Logo ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-0 mb-8"
        >
          <div className="flex items-center gap-2.5">
            <span
              style={{
                fontSize: "26px",
                fontWeight: 800,
                letterSpacing: "-0.045em",
                backgroundImage: "linear-gradient(135deg, #FF6B35 0%, #E65122 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ZappyFind
            </span>
          </div>
        </motion.div>

        {/* ── Hero Text ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 w-full"
        >
          <h1
            style={{
              fontFamily: "'DM Serif Display', 'Times New Roman', serif",
              fontSize: "clamp(29px, 8.3vw, 40px)",
              fontWeight: 400,
              color: "#111827",
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
              marginBottom: "16px",
              textAlign: "center",
              maxWidth: "340px",
              marginInline: "auto",
            }}
          >
            {mode === "signup" ? (
              <>
                <span style={{ display: "block" }}>Stop applying.</span>
                <span
                  style={{
                    display: "block",
                    backgroundImage: "linear-gradient(90deg, #F97316 0%, #EA580C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Start getting discovered.
                </span>
              </>
            ) : (
              <>
                <span style={{ display: "block" }}>Welcome back.</span>
                <span
                  style={{
                    display: "block",
                    backgroundImage: "linear-gradient(90deg, #F97316 0%, #EA580C 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Sign in to continue.
                </span>
              </>
            )}
          </h1>
        </motion.div>

        {/* ── Ticker (full bleed) ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.26 }}
          className="mb-6"
          style={{ width: "calc(100% + 32px)", marginLeft: "-16px" }}
        >
          <Ticker />
        </motion.div>

        {/* ── Form fields ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mb-7"
        >
          {/* Full name — sign up only */}
          {showFullName && (
            <>
              <FloatingLabelInput
                label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && canContinue && handleContinue()}
                autoComplete="name"
                fieldStyle={{
                  ["--zf-bg" as any]: C.inputBg,
                  ["--zf-fg" as any]: C.textPrimary,
                  ["--zf-muted" as any]: C.textMuted,
                  ["--zf-border" as any]: C.border,
                  ["--zf-border-focus" as any]: "rgba(194,65,12,0.35)",
                  ["--zf-ring-focus" as any]: "rgba(194,65,12,0.14)",
                }}
              />

              <div style={{ height: 12 }} />
            </>
          )}

          {/* Email or phone — single smart input */}
          <FloatingLabelInput
            ref={inputRef}
            label="Email or phone"
            type={isPhone ? "tel" : "text"}
            inputMode={isPhone ? "numeric" : "email"}
            autoComplete={isPhone ? "tel" : "email"}
            value={contact}
            onChange={(e) => handleContactChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canContinue && handleContinue()}
            leftAdornment={
              isPhone ? (
                <div ref={pickerRef} style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => setShowCountryPicker((v) => !v)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "0 10px 0 14px",
                      height: "100%",
                      border: "none",
                      borderRight: `1px solid ${C.border}`,
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: C.textPrimary,
                      fontFamily: "Inter, sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>
                      {COUNTRY_CODES.find((c) => c.code === countryCode)?.flag ?? "🌐"}
                    </span>
                    <span>{countryCode}</span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.45 }}>
                      <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {showCountryPicker && (
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        zIndex: 50,
                        background: "white",
                        borderRadius: 12,
                        border: `1px solid ${C.border}`,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)",
                        padding: "4px 0",
                        minWidth: 180,
                        maxHeight: 220,
                        overflowY: "auto",
                      }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            setCountryCode(c.code);
                            setShowCountryPicker(false);
                            inputRef.current?.focus();
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            width: "100%",
                            padding: "10px 14px",
                            border: "none",
                            background: c.code === countryCode ? "rgba(194,65,12,0.06)" : "transparent",
                            cursor: "pointer",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "13px",
                            fontWeight: c.code === countryCode ? 600 : 400,
                            color: C.textPrimary,
                            textAlign: "left",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>{c.flag}</span>
                          <span style={{ flex: 1 }}>{c.label}</span>
                          <span style={{ color: C.textSecondary, fontSize: "12px" }}>{c.code}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : undefined
            }
            leftAdornmentWidth={92}
            fieldStyle={{
              ["--zf-bg" as any]: C.inputBg,
              ["--zf-fg" as any]: C.textPrimary,
              ["--zf-muted" as any]: C.textMuted,
              ["--zf-border" as any]: C.border,
              ["--zf-border-focus" as any]: "rgba(194,65,12,0.35)",
              ["--zf-ring-focus" as any]: "rgba(194,65,12,0.14)",
            }}
          />

        </motion.div>

        {/* ── Continue Button ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mb-4"
        >
          <motion.button
            onClick={handleContinue}
            disabled={!canContinue}
            whileTap={canContinue ? { scale: 0.975 } : {}}
            style={{
              width: "100%",
              height: "52px",
              padding: "18px",
              borderRadius: "16px",
              border: "none",
              background: canContinue
                ? "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)"
                : "#EAE6E1",
              color: canContinue ? "white" : "#B8AFA6",
              fontSize: "15px", fontWeight: 600,
              letterSpacing: "-0.01em",
              cursor: canContinue ? "pointer" : "not-allowed",
              opacity: 1,
              boxShadow: canContinue
                ? "0 4px 20px rgba(255,107,53,0.35), 0 1px 4px rgba(255,107,53,0.2)"
                : "none",
              transition: "background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease",
              fontFamily: "Inter, sans-serif",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px",
            }}
          >
            {mode === "signup" ? "Create account" : "Sign in"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4l4 4-4 4"
                stroke={canContinue ? "white" : "#B8AFA6"} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>

        {/* ── Privacy note ──────────────────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          style={{
            fontSize: "11px", fontWeight: 400,
            color: C.textSecondary, letterSpacing: "0.01em",
            lineHeight: 1.5, textAlign: "center",
            marginBottom: "8px",
          }}
        >
          By continuing, you agree to our{" "}
          <span style={{ color: C.textMuted, fontWeight: 500 }}>Terms</span>{" "}
          &amp;{" "}
          <span style={{ color: C.textMuted, fontWeight: 500 }}>Privacy Policy</span>
        </motion.p>

        {/* ── Mode hint (fast switch) ─────────────────────────────── */}
        <div
          className="w-full mb-4"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {mode === "signup" ? (
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setFullName("");
                setIsFullNameFocused(false);
              }}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                letterSpacing: "-0.01em",
                color: C.textSecondary,
                fontWeight: 500,
              }}
            >
              Already have an account?{" "}
              <span style={{ color: "rgba(234, 88, 12, 1)", fontWeight: 600 }}>
                Sign in
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("signup")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                letterSpacing: "-0.01em",
                color: C.textSecondary,
                fontWeight: 500,
              }}
            >
              New here?{" "}
              <span style={{ color: C.brand, fontWeight: 700 }}>
                Create an account
              </span>
            </button>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: "24px" }} />

        {/* ── Hiring link ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center pt-5"
          style={{ borderTop: `1px solid ${C.border}`, width: "100%" }}
        >
          <button
            style={{
              background: "none", border: "none",
              cursor: "pointer",
              fontSize: "13px", fontWeight: 500,
              color: C.textSecondary,
              fontFamily: "Inter, sans-serif",
              letterSpacing: "-0.01em",
            }}
          >
            Hiring?{" "}
            <span style={{ color: "#EA580C", fontWeight: 600 }}>
              Continue as Employer →
            </span>
          </button>
        </motion.div>

      </div>
    </div>
  );
}
