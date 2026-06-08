"use client";

interface WhatsAppButtonProps {
  message: string;
  children: string;
  variant?: "primary" | "soft";
  className?: string;
  tracking?: {
    leadId?: string;
    sessionId?: string;
    name?: string;
    zodiac?: string;
    gender?: string;
    focus?: string;
    reportTier?: "free" | "paid";
    score?: number;
    primaryPain?: string;
    section?: string;
    source?: string;
  };
}

export function WhatsAppButton({ message, children, variant = "primary", className = "", tracking }: WhatsAppButtonProps) {
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
      onClick={() => trackWhatsAppClick(tracking)}
      className={`mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl px-4 py-3 text-center text-sm font-semibold shadow-soft transition active:scale-[0.98] ${variantClass} ${className}`}
    >
      {children}
    </a>
  );
}

function trackWhatsAppClick(tracking?: WhatsAppButtonProps["tracking"]) {
  const fallback = getFallbackTracking();
  const resolved = tracking || fallback;
  if (!resolved) return;

  const payload = JSON.stringify({
    eventType: "whatsapp_click",
    leadId: resolved.leadId,
    sessionId: resolved.sessionId,
    name: resolved.name,
    zodiac: resolved.zodiac,
    gender: resolved.gender,
    focus: resolved.focus,
    reportTier: resolved.reportTier,
    score: resolved.score,
    primaryPain: resolved.primaryPain,
    source: resolved.source || "whatsapp_button",
    metadata: {
      section: resolved.section
    }
  });

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
      return;
    }

    void fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload,
      keepalive: true
    });
  } catch {
    // The WhatsApp click must continue even if tracking fails.
  }
}

function getFallbackTracking(): WhatsAppButtonProps["tracking"] | undefined {
  try {
    const raw = window.localStorage.getItem("ai-name-analysis:last-result");
    if (!raw) return undefined;

    const result = JSON.parse(raw) as {
      userInput?: {
        trackingId?: string;
        sessionId?: string;
        name?: string;
        zodiac?: string;
        gender?: string;
        focus?: string;
        reportTier?: "free" | "paid";
      };
      score?: number;
      funnelAnalysis?: {
        conversionTags?: {
          primaryPain?: string;
        };
      };
    };

    return {
      leadId: result.userInput?.trackingId,
      sessionId: result.userInput?.sessionId,
      name: result.userInput?.name,
      zodiac: result.userInput?.zodiac,
      gender: result.userInput?.gender,
      focus: result.userInput?.focus,
      reportTier: result.userInput?.reportTier,
      score: result.score,
      primaryPain: result.funnelAnalysis?.conversionTags?.primaryPain,
      source: "whatsapp_button"
    };
  } catch {
    return undefined;
  }
}
