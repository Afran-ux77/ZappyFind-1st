import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Briefcase,
  ChevronDown,
  Home,
  Search,
  User,
  Bell,
} from "lucide-react";
import { DT } from "./desktop-tokens";

export type DesktopNavId = "home" | "jobs" | "profile";

export type DesktopCaseOption<K extends string = string> = {
  key: K;
  label: string;
  description?: string;
};

type DesktopAppShellProps<K extends string = string> = {
  userName: string;
  active: DesktopNavId;
  onNavigate: (id: DesktopNavId) => void;
  children: ReactNode;
  /** Optional: hide sidebar (e.g. immersive voice) */
  hideSidebar?: boolean;
  /** Optional: hide top search/header bar (voice call focuses on main + optional aside) */
  hideHeader?: boolean;
  /** Optional top note */
  topBanner?: ReactNode;
  /** Optional demo-case switcher (renders a pill in the header). */
  caseOptions?: DesktopCaseOption<K>[];
  activeCaseKey?: K;
  onCaseChange?: (key: K) => void;
};

export function DesktopAppShell<K extends string = string>({
  userName,
  active,
  onNavigate,
  children,
  hideSidebar = false,
  hideHeader = false,
  topBanner,
  caseOptions,
  activeCaseKey,
  onCaseChange,
}: DesktopAppShellProps<K>) {
  const nav = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "jobs" as const, label: "Jobs", icon: Briefcase },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <div
      className="flex h-dvh max-h-dvh min-h-0 w-full"
      style={{ background: DT.pageBg, fontFamily: DT.sans, color: DT.text }}
    >
      {!hideSidebar && (
        <aside
          className="flex shrink-0 flex-col border-r"
          style={{
            width: 240,
            background: DT.sidebar,
            borderColor: DT.border,
          }}
        >
          <div className="flex h-14 items-center gap-2 border-b px-5" style={{ borderColor: DT.border }}>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-extrabold text-white"
              style={{ background: DT.accentGradient }}
            >
              Z
            </div>
            <div>
              <div className="text-[13px] font-semibold tracking-tight">ZappyFind</div>
              <div className="text-[11px]" style={{ color: DT.textSubtle }}>
                For job seekers
              </div>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 p-3">
            {nav.map(({ id, label, icon: Icon }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors"
                  style={{
                    background: isActive ? DT.sidebarActive : "transparent",
                    color: isActive ? DT.accent : DT.textMuted,
                  }}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" strokeWidth={1.75} />
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="border-t p-4" style={{ borderColor: DT.border }}>
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ background: DT.accentGradient }}
              >
                {userName.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-medium">{userName}</div>
                <div className="text-[11px]" style={{ color: DT.textSubtle }}>
                  Active search
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {!hideHeader && (
          <header
            className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-6"
            style={{
              background: DT.surface,
              borderColor: DT.border,
            }}
          >
            <div
              className="flex max-w-md flex-1 items-center gap-2 rounded-lg border px-3 py-2"
              style={{ borderColor: DT.border, background: DT.surfaceMuted }}
            >
              <Search className="h-4 w-4 shrink-0" style={{ color: DT.textSubtle }} strokeWidth={1.75} />
              <input
                type="search"
                placeholder="Search roles, companies, skills…"
                className="min-w-0 flex-1 border-0 bg-transparent text-[13px] outline-none placeholder:text-stone-400"
              />
            </div>
            <div className="flex items-center gap-2">
              {caseOptions && onCaseChange ? (
                <DesktopCaseSwitcher
                  options={caseOptions}
                  activeKey={activeCaseKey}
                  onChange={onCaseChange}
                />
              ) : null}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-stone-50"
                style={{ borderColor: DT.border }}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" style={{ color: DT.textMuted }} strokeWidth={1.75} />
              </button>
            </div>
          </header>
        )}

        {topBanner}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto [&>*]:min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}

function DesktopCaseSwitcher<K extends string>({
  options,
  activeKey,
  onChange,
}: {
  options: DesktopCaseOption<K>[];
  activeKey?: K;
  onChange: (key: K) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const active = options.find((o) => o.key === activeKey) ?? options[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[12.5px] font-semibold transition-colors hover:bg-stone-50"
        style={{
          borderColor: DT.border,
          color: DT.text,
          letterSpacing: "-0.01em",
          background: DT.surface,
        }}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full text-[10.5px] font-bold"
          style={{ background: DT.accentSoft, color: DT.accent }}
        >
          {active.label.replace(/\D/g, "") || "·"}
        </span>
        <span className="hidden sm:inline">Demo · {active.label}</span>
        <span className="sm:hidden">{active.label}</span>
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform"
          strokeWidth={2}
          style={{
            color: DT.textSubtle,
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[240px] overflow-hidden rounded-[14px] border p-1.5 shadow-lg"
          style={{
            borderColor: DT.border,
            background: DT.surface,
            boxShadow:
              "0 12px 32px rgba(28,25,23,0.12), 0 2px 6px rgba(28,25,23,0.06)",
          }}
        >
          <div
            className="mb-1 px-2.5 pb-1 pt-2 text-[10.5px] font-bold uppercase"
            style={{ color: DT.textSubtle, letterSpacing: "0.12em" }}
          >
            Demo dashboards
          </div>
          {options.map((opt) => {
            const isActive = opt.key === active.key;
            return (
              <button
                key={opt.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className="flex w-full items-start gap-2 rounded-[10px] px-2.5 py-2 text-left transition-colors hover:bg-stone-50"
                style={{
                  background: isActive ? DT.sidebarActive : "transparent",
                }}
              >
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold"
                  style={{
                    background: isActive ? DT.accent : DT.accentSoft,
                    color: isActive ? "#FFFFFF" : DT.accent,
                  }}
                >
                  {opt.label.replace(/\D/g, "") || "·"}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span
                    className="text-[13px] font-semibold"
                    style={{
                      color: isActive ? DT.accent : DT.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {opt.label}
                  </span>
                  {opt.description ? (
                    <span
                      className="mt-0.5 text-[11.5px] leading-snug"
                      style={{ color: DT.textMuted, letterSpacing: "-0.01em" }}
                    >
                      {opt.description}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
