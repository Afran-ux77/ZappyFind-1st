import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#FDFBF8",
  primary: "#1C1917",
  brand: "#C2410C",
  brandGradient: "linear-gradient(135deg, #92400E 0%, #C2410C 100%)",
  textPrimary: "#1C1917",
  textMuted: "#78716C",
  textSecondary: "#A8A29E",
  border: "rgba(28,25,23,0.09)",
  error: "#DC6D6D",
  errorBg: "rgba(220,109,109,0.08)",
  orbA: "rgba(194,65,12,0.07)",
  orbB: "rgba(146,64,14,0.05)",
};

interface OTPScreenProps {
  email: string;
  onBack: () => void;
  onVerified?: () => void;
}

export function OTPScreen({ email, onBack, onVerified }: OTPScreenProps) {
  const CORRECT_OTP = "1111";
  const OTP_LENGTH = 4;
  const ERROR_CLEAR_CODE_DELAY_MS = 320;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showError, setShowError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isPhone = email.trim().startsWith("+");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const lastAttemptedCodeRef = useRef("");
  const isComplete = otp.every((d) => d !== "");

  useEffect(() => {
    if (secondsLeft <= 0) { setCanResend(true); return; }
    const t = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 350);
  }, []);

  useEffect(() => {
    if (!isComplete || isVerifying || verified) return;
    const code = otp.join("");
    if (code === lastAttemptedCodeRef.current) return;
    const t = setTimeout(() => {
      handleVerify(code);
    }, 90);
    return () => clearTimeout(t);
  }, [otp, isComplete, isVerifying, verified]);

  const handleChange = (index: number, value: string) => {
    if (showError) setShowError(false);
    lastAttemptedCodeRef.current = "";
    // Paste / autofill: distribute all digits across boxes
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
      const next = [...otp];
      digits.forEach((d, i) => {
        if (index + i < OTP_LENGTH) next[index + i] = d;
      });
      setOtp(next);
      const nextFocus = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextFocus]?.focus();
      return;
    }
    // Single character entry — always take only the last typed digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp]; next[index] = ""; setOtp(next);
      } else if (index > 0) {
        const next = [...otp]; next[index - 1] = ""; setOtp(next);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false); setSecondsLeft(30);
    setShowError(false);
    lastAttemptedCodeRef.current = "";
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleVerify = async (code: string) => {
    if (isVerifying || verified || code.length !== OTP_LENGTH) return;
    lastAttemptedCodeRef.current = code;
    setIsVerifying(true);
    setShowError(false);
    await new Promise((r) => setTimeout(r, 620));
    if (code !== CORRECT_OTP) {
      setIsVerifying(false);
      setShowError(true);
      setTimeout(() => {
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }, ERROR_CLEAR_CODE_DELAY_MS);
      return;
    }
    setIsVerifying(false);
    setVerified(true);
    setTimeout(() => onVerified?.(), 900);
  };

  const maskedEmail = isPhone
    ? email.replace(/(\+\d{2})(\d{0,})(\d{4})$/, (_, a, b, c) => {
        const middle = String(b ?? "");
        return a + "·".repeat(Math.min(middle.length, 6)) + c;
      })
    : email.replace(
        /^(.{2})(.*)(@.*)$/,
        (_, a, b, c) => a + "·".repeat(Math.min(b.length, 5)) + c
      );

  return (
    <div
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: C.bg, fontFamily: "Inter, sans-serif" }}
    >
      {/* Ambient orbs */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{
        width: "240px", height: "240px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orbA} 0%, transparent 70%)`,
        transform: "translate(30%, -30%)",
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: "20%", left: "-8%",
        width: "180px", height: "180px", borderRadius: "50%",
        background: `radial-gradient(circle, ${C.orbB} 0%, transparent 70%)`,
      }} />

      <div className="flex flex-col flex-1 px-4 pt-12 pb-8 items-center text-center">

        {/* ── Back button ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-start mb-8"
        >
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "white",
              border: `1.5px solid ${C.border}`,
              borderRadius: "12px",
              padding: "8px 14px 8px 10px",
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
        </motion.div>

        {/* ── Email icon ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.05 }}
          className="flex items-center justify-center rounded-[22px] mb-6"
          style={{
            width: "64px", height: "64px",
            background: "rgba(194,65,12,0.07)",
            border: "1.5px solid rgba(194,65,12,0.14)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 7a1.5 1.5 0 011.5-1.5H22.5A1.5 1.5 0 0124 7v14a1.5 1.5 0 01-1.5 1.5H5.5A1.5 1.5 0 014 21V7z"
              stroke={C.brand} strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M4 7l10 8.5L24 7"
              stroke={C.brand} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        {/* ── Header text ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 w-full"
        >
          <h1
            style={{
              fontSize: "clamp(20px, 6.5vw, 26px)", fontWeight: 800,
              color: C.textPrimary, letterSpacing: "-0.04em",
              lineHeight: 1.2, marginBottom: "10px",
            }}
          >
            Verify your {isPhone ? "phone" : "email"}
          </h1>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: C.textMuted,
              lineHeight: 1.65,
              letterSpacing: "-0.01em",
            }}
          >
            {isPhone ? (
              <>
                We've sent a 4-digit code via WhatsApp to{" "}
                <span style={{ fontWeight: 600, color: C.textPrimary }}>{maskedEmail}</span>
              </>
            ) : (
              <>
                We've sent a 4-digit code to{" "}
                <span style={{ fontWeight: 600, color: C.textPrimary }}>{maskedEmail}</span>
              </>
            )}
          </p>
        </motion.div>

        {/* ── OTP Boxes ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mb-8"
        >
          <motion.div
            animate={showError ? { x: [0, -6, 6, -5, 5, -3, 3, 0] } : { x: 0 }}
            transition={{ duration: 0.38, ease: "easeOut" }}
            className="flex gap-2 justify-center"
          >
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={OTP_LENGTH}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => {
                  e.target.select();
                  setActiveIndex(i);
                }}
                animate={{
                  scale: digit ? [1, 1.04, 1] : 1,
                  y: activeIndex === i ? -1 : 0,
                }}
                whileFocus={{ scale: 1.06, y: -2 }}
                transition={{ type: "spring", stiffness: 420, damping: 26 }}
                style={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: "56px",
                  height: "clamp(50px, 14vw, 62px)",
                  textAlign: "center",
                  fontSize: "clamp(18px, 5.5vw, 22px)", fontWeight: 700,
                  color: showError ? C.error : C.textPrimary,
                  background: "white",
                  border: showError
                    ? `2px solid ${C.error}`
                    : digit
                      ? `2px solid ${C.brand}`
                      : `1.5px solid ${C.border}`,
                  borderRadius: "14px",
                  outline: "none",
                  boxShadow: showError
                    ? "0 0 0 3px rgba(220,109,109,0.12), 0 2px 10px rgba(0,0,0,0.05)"
                    : activeIndex === i
                      ? "0 0 0 3px rgba(194,65,12,0.08), 0 6px 16px rgba(0,0,0,0.07)"
                      : digit
                        ? "0 0 0 3px rgba(194,65,12,0.1), 0 2px 10px rgba(0,0,0,0.06)"
                        : "0 1px 4px rgba(0,0,0,0.05)",
                  transition: "all 0.18s ease",
                  fontFamily: "Inter, sans-serif",
                  caretColor: "transparent",
                  padding: 0,
                }}
              />
            ))}
          </motion.div>
          <AnimatePresence>
            {showError && (
              <motion.p
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.2 }}
                style={{
                  marginTop: "12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: C.error,
                  background: C.errorBg,
                  border: "1px solid rgba(220,109,109,0.2)",
                  borderRadius: "10px",
                  padding: "8px 10px",
                }}
              >
                That code looks incorrect. Please try again.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Resend ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="flex items-center justify-center mb-10"
        >
          <AnimatePresence mode="wait">
            {!canResend ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                {/* Circular progress */}
                <svg viewBox="0 0 22 22" width="22" height="22" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="11" cy="11" r="8.5" fill="none"
                    stroke="rgba(28,25,23,0.07)" strokeWidth="2" />
                  <circle cx="11" cy="11" r="8.5" fill="none"
                    stroke={C.brand} strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 8.5}`}
                    strokeDashoffset={`${2 * Math.PI * 8.5 * (1 - secondsLeft / 30)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s linear" }}
                  />
                </svg>
                <span style={{ fontSize: "13px", fontWeight: 500, color: C.textSecondary, letterSpacing: "-0.01em" }}>
                  Resend code in{" "}
                  <span style={{ fontWeight: 700, color: C.textMuted }}>{secondsLeft}s</span>
                </span>
              </motion.div>
            ) : (
              <motion.button
                key="resend"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                onClick={handleResend}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "white",
                  border: `1.5px solid ${C.border}`,
                  borderRadius: "12px",
                  padding: "8px 14px 8px 10px",
                  fontSize: "13px", fontWeight: 600,
                  color: C.textPrimary,
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "-0.01em",
                  display: "flex", alignItems: "center", gap: "6px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7a6 6 0 0010.9-3.4M13 7A6 6 0 002.1 10.4"
                    stroke={C.textPrimary} strokeWidth="1.4" strokeLinecap="round" />
                  <path d="M11.5 3V5.5H9"
                    stroke={C.textPrimary} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Resend Code
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* ── Auto verification status ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            {verified ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: "56px", height: "56px",
                    background: "linear-gradient(90deg, #FF8F56 0%, #FF6B35 100%)",
                    boxShadow: "0 4px 20px rgba(255,107,53,0.35)",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path d="M5 13l5.5 5.5L21 8"
                      stroke="white" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <span style={{ fontSize: "15px", fontWeight: 600, color: C.textPrimary, letterSpacing: "-0.01em" }}>
                  Verified! Just a moment…
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="verify-status"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  width: "100%",
                  minHeight: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.textSecondary,
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                {isVerifying ? (
                  <motion.div
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <span style={{
                      width: "15px", height: "15px",
                      border: "2px solid rgba(194,65,12,0.25)",
                      borderTopColor: C.brand,
                      borderRadius: "50%",
                      animation: "spin 0.65s linear infinite",
                      display: "inline-block",
                    }} />
                    Verifying code…
                  </motion.div>
                ) : (
                  "Enter the 4-digit code to continue"
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!verified && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center justify-center gap-1.5 mt-4"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1L2 2.3v3.2C2 7.8 3.6 9.5 5.5 10c1.9-.5 3.5-2.2 3.5-4.5V2.3L5.5 1z"
                  stroke={C.textSecondary} strokeWidth="1" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: "11px", fontWeight: 400, color: C.textSecondary, letterSpacing: "0.01em" }}>
                End-to-end encrypted
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}