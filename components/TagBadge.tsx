import type { ReactNode } from "react";

export function TagBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white shadow-[0_0_18px_rgba(200,59,255,0.14)]">
      {children}
    </span>
  );
}
