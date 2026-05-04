import type { CSSProperties } from "react";

type Axis = {
  label: string;
  you: number; // 0..1
  ideal: number; // 0..1
};

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function polygonPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first.x.toFixed(2)} ${first.y.toFixed(2)} ${rest
    .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ")} Z`;
}

export function InterviewQuestionRadar({
  axes,
  size = 156,
  showAxisLabels = false,
  youColor = "#EA580C",
  idealColor = "rgba(28,25,23,0.35)",
  gridColor = "rgba(28,25,23,0.08)",
  style,
  ariaLabel = "Competency comparison chart",
}: {
  axes: Axis[];
  size?: number;
  showAxisLabels?: boolean;
  youColor?: string;
  idealColor?: string;
  gridColor?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}) {
  const safeAxes = axes.slice(0, 8);
  const n = Math.max(3, safeAxes.length);
  const cx = size / 2;
  const cy = size / 2;
  const pad = showAxisLabels ? 30 : 18;
  const r = Math.max(22, cx - pad);

  const angles = Array.from({ length: n }, (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / n);
  const axisEnd = angles.map((a) => polarToCartesian(cx, cy, r, a));

  const youPoints = angles.map((a, i) => {
    const axis = safeAxes[i];
    const v = clamp01(axis?.you ?? 0);
    return polarToCartesian(cx, cy, r * v, a);
  });

  const idealPoints = angles.map((a, i) => {
    const axis = safeAxes[i];
    const v = clamp01(axis?.ideal ?? 0);
    return polarToCartesian(cx, cy, r * v, a);
  });

  const gridRings = [0.25, 0.5, 0.75, 1].map((t) =>
    angles.map((a) => polarToCartesian(cx, cy, r * t, a)),
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
      style={{ overflow: "visible", ...style }}
    >
      {/* Grid rings */}
      {gridRings.map((ring, idx) => (
        <path key={idx} d={polygonPath(ring)} fill="none" stroke={gridColor} strokeWidth={1} />
      ))}

      {/* Axis lines */}
      {axisEnd.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={gridColor} strokeWidth={1} />
      ))}

      {/* Ideal polygon */}
      <path d={polygonPath(idealPoints)} fill="rgba(28,25,23,0.04)" stroke={idealColor} strokeWidth={1.5} />

      {/* You polygon */}
      <path d={polygonPath(youPoints)} fill="rgba(234,88,12,0.16)" stroke={youColor} strokeWidth={2} />

      {/* Dots for You (subtle anchor points) */}
      {youPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={2.2} fill={youColor} opacity={0.9} />
      ))}

      {/* Labels */}
      {showAxisLabels &&
        axisEnd.map((p, i) => {
          const a = angles[i];
          const label = safeAxes[i]?.label ?? "";
          const outward = polarToCartesian(cx, cy, r + 12, a);
          const anchor =
            Math.abs(Math.cos(a)) < 0.25 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
          return (
            <text
              key={label || i}
              x={outward.x}
              y={outward.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              style={{
                fontSize: 10,
                fontWeight: 600,
                fill: "rgba(68,64,60,0.9)",
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </text>
          );
        })}
    </svg>
  );
}

