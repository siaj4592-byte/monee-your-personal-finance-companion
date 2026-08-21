import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function SubPage({
  title,
  backTo = "/cai-dat",
  action,
  children,
}: {
  title: string;
  backTo?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col bg-background">
      <header className="safe-top sticky top-0 z-20 bg-background/90 backdrop-blur-xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-3">
          <Link to={backTo} className="press grid h-9 w-9 place-items-center rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="truncate text-center text-base font-semibold">{title}</h1>
          <div className="flex h-9 min-w-9 items-center justify-end">{action}</div>
        </div>
      </header>
      <main className="flex-1 px-5 pb-16">{children}</main>
    </div>
  );
}
