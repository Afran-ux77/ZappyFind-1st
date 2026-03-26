const TICKER_ITEMS = [
  { icon: "✦", text: "Direct recruiter access" },
  { icon: "◈", text: "Exclusive roles on ZappyFind" },
  { icon: "✦", text: "Get discovered 3x faster" },
  { icon: "◈", text: "Instant market clarity" },
  { icon: "✦", text: "Curated matches in minutes" },
  { icon: "◈", text: "AI helps you apply faster" },
  { icon: "✦", text: "Daily match updates" },
  { icon: "◈", text: "Talk to an AI job agent" },
];

export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative overflow-hidden py-3">
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 h-full w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #FDFBF8, transparent)" }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 h-full w-12 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #FDFBF8, transparent)" }}
      />

      <div className="ticker-track flex items-center gap-2.5 whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 flex-shrink-0"
            style={{
              padding: "6px 14px",
              borderRadius: "100px",
              background: "rgba(28,25,23,0.055)",
              fontFamily: "Inter, sans-serif",
              fontSize: "12px",
              fontWeight: 500,
              color: "#57534E",
              letterSpacing: "-0.01em",
              userSelect: "none",
            }}
          >
            <span style={{ fontSize: "9px", color: "#EA580C", lineHeight: 1 }}>
              {item.icon}
            </span>
            {item.text}
          </span>
        ))}
      </div>

      <style>{`
        .ticker-track {
          display: inline-flex;
          animation: ticker-scroll 36s linear infinite;
          will-change: transform;
        }
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
