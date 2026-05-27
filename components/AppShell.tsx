import type { ReactNode } from "react";
import { Header } from "@/components/Header";

interface AppShellProps {
  children: ReactNode;
  compact?: boolean;
  textured?: boolean;
  bottomInset?: boolean;
}

export function AppShell({ children, compact = false, textured = false, bottomInset = false }: AppShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-3 py-3 sm:px-4 sm:py-7">
      <div className={`astro-shell relative min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[34px] border border-white/10 bg-rice/90 shadow-app backdrop-blur ${textured ? "oriental-texture" : ""}`}>
        <div className="relative z-10 flex items-center justify-between px-6 pt-3 text-[11px] font-semibold text-white/70">
          <span>9:41</span>
          <span className="h-1.5 w-16 rounded-full bg-white/20" />
          <span>●●●</span>
        </div>
        <Header compact={compact} />
        <div className={`relative z-10 px-5 ${bottomInset ? "pb-32" : "pb-7"}`}>{children}</div>
      </div>
    </main>
  );
}
