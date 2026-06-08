"use client";

import { FormEvent, useState } from "react";
import type { AnalysisResult } from "@/types/analysis";

const leadStorageKey = "ai-name-analysis:lead-whatsapp";

export function LeadCapture({ result }: { result?: AnalysisResult }) {
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;

    window.localStorage.setItem(leadStorageKey, trimmed);
    await syncLead(trimmed, result);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-[22px] border border-white/12 bg-white/10 p-4">
      <label className="block">
        <span className="block text-sm font-semibold text-white">如果你希望老师稍后联系你，可以留下 WhatsApp。</span>
        <input
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            setSaved(false);
          }}
          placeholder="例如：60123456789"
          inputMode="tel"
          className="mt-3 h-12 w-full rounded-2xl border border-white/12 bg-black/20 px-4 text-base text-white outline-none placeholder:text-warmGray/55 focus:border-moss focus:ring-4 focus:ring-moss/10"
        />
      </label>
      <button
        type="submit"
        className="mt-3 h-12 w-full rounded-2xl bg-white/10 px-4 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]"
      >
        保存我的 WhatsApp
      </button>
      {saved ? <p className="mt-3 text-xs leading-5 text-warmGray">已记录。若后台已连接 Supabase，老师后台会看到这条 WhatsApp 留资。</p> : null}
    </form>
  );
}

async function syncLead(phone: string, result?: AnalysisResult): Promise<void> {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        eventType: "lead_capture",
        leadId: result?.userInput.trackingId,
        sessionId: result?.userInput.sessionId,
        name: result?.userInput.name,
        phone,
        zodiac: result?.userInput.zodiac,
        gender: result?.userInput.gender,
        focus: result?.userInput.focus,
        reportTier: result?.userInput.reportTier,
        score: result?.score,
        primaryPain: result?.funnelAnalysis.conversionTags.primaryPain,
        source: "lead_capture_form",
        metadata: {
          tags: result?.funnelAnalysis.conversionTags.tags
        }
      }),
      keepalive: true
    });
  } catch {
    // Local save is enough as fallback.
  }
}
