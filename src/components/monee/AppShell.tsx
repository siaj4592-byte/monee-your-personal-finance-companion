import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Home, Plus, Settings, Wallet } from "lucide-react";
import type { ReactNode } from "react";

import { useMonee } from "@/lib/monee/store";

const TABS = [
  { to: "/", icon: Home, key: "home" as const },
  { to: "/thong-ke", icon: BarChart3, key: "stats" as const },
  { to: "/tai-san", icon: Wallet, key: "assets" as const },
  { to: "/cai-dat", icon: Settings, key: "settings" as const },
];

export function AppShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: ReactNode;
}) {
  const { t } = useMonee();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col bg-background">
      {title ? (
        <header className="safe-top sticky top-0 z-20 bg-background/85 backdrop-blur-xl">
          <div className="px-5 pt-3 pb-2">{title}</div>
        </header>
      ) : null}

      <main className="flex-1 px-5 pt-2 pb-40">{children}</main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center">
        <div className="pointer-events-auto relative w-full max-w-[520px]">
          <Link
            to="/them"
            aria-label={t("addTransaction")}
            className="press absolute -top-7 left-1/2 grid h-15 w-15 -translate-x-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-float)]"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </Link>

          <nav className="safe-bottom border-t border-border bg-card/95 backdrop-blur-xl">
            <ul className="grid grid-cols-4 pt-2 pb-2">
              {TABS.map((tab, index) => {
                const active =
                  tab.to === "/" ? pathname === "/" : pathname.startsWith(tab.to);
                const Icon = tab.icon;
                return (
                  <li
                    key={tab.to}
                    className={index === 1 ? "pr-6" : index === 2 ? "pl-6" : undefined}
                  >
                    <Link
                      to={tab.to}
                      className={`press flex flex-col items-center gap-1 py-1 text-[11px] font-medium ${
                        active ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5.5 w-5.5" strokeWidth={active ? 2.4 : 1.8} />
                      {t(tab.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
