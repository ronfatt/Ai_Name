"use client";

interface WhatsAppButtonProps {
  message: string;
  children: string;
  variant?: "primary" | "soft";
  className?: string;
}

export function WhatsAppButton({ message, children, variant = "primary", className = "" }: WhatsAppButtonProps) {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "60123456789";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const variantClass = variant === "soft"
    ? "border border-white/15 bg-white/10 text-white"
    : "bg-gradient-to-r from-moss via-[#E944B7] to-mossSoft text-white";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-4 py-3 text-center text-sm font-semibold shadow-soft transition active:scale-[0.98] ${variantClass} ${className}`}
    >
      {children}
    </a>
  );
}
