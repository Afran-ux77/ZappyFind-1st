import type { ReactNode } from "react";
import {
  Briefcase,
  Home,
  Search,
  User,
  Bell,
} from "lucide-react";
import { DT } from "./desktop-tokens";

export type DesktopNavId = "home" | "jobs" | "profile";

type DesktopAppShellProps = {
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
};

export function DesktopAppShell({
  userName,
  active,
  onNavigate,
  children,
  hideSidebar = false,
  hideHeader = false,
  topBanner,
}: DesktopAppShellProps) {
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
