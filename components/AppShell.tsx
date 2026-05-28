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
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-2.5 py-2.5 sm:px-4 sm:py-6">
      <div className={`astro-shell relative min-h-[calc(100vh-1.25rem)] overflow-hidden rounded-[32px] border border-[#7C3DFF]/45 bg-[#070021]/92 shadow-app backdrop-blur ${textured ? "oriental-texture" : ""}`}>
        <Header compact={compact} />
        <div className={`relative z-10 px-5 ${bottomInset ? "pb-32" : "pb-7"}`}>{children}</div>
      </div>
    </main>
  );
}
