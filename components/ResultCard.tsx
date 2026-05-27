import type { ReactNode } from "react";

interface ResultCardProps {
  title?: string;
  children: ReactNode;
  subtle?: boolean;
}

export function ResultCard({ title, children, subtle = false }: ResultCardProps) {
  return (
    <section className={`rounded-app border p-5 shadow-soft backdrop-blur ${subtle ? "border-moss/25 bg-white/[0.07]" : "border-white/12 bg-white/10"}`}>
      {title ? <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2> : null}
      {children}
    </section>
  );
}
