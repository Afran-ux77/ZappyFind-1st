/** Shared desktop chrome — aligned with mobile product warm neutrals + orange accent. */
export const DT = {
  pageBg: "#F5F2ED",
  surface: "#FFFFFF",
  surfaceMuted: "#FAF8F5",
  border: "rgba(28, 25, 23, 0.08)",
  borderStrong: "rgba(28, 25, 23, 0.12)",
  text: "#1C1917",
  textMuted: "#6B6560",
  textSubtle: "#9C9590",
  accent: "#EA580C",
  accentSoft: "rgba(234, 88, 12, 0.09)",
  accentGradient: "linear-gradient(135deg, #FF8F56 0%, #EA580C 100%)",
  sidebar: "#FDFBF8",
  sidebarActive: "rgba(234, 88, 12, 0.1)",
  shadow: "0 1px 2px rgba(28,25,23,0.04), 0 8px 24px rgba(28,25,23,0.06)",
  radiusLg: "14px",
  radiusMd: "10px",
  sans: "'Inter', system-ui, sans-serif",
  serif: "'DM Serif Display', Georgia, serif",
} as const;

/** Staggered enter for desktop hub main panes (Home / Jobs / Profile). */
export const desktopHubStagger = {
  container: {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] as const },
    },
  },
} as const;
