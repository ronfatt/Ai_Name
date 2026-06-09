"use client";

import { useEffect, useState } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { ViralUnlockOffer } from "@/types/analysis";

interface ShareUnlockCardProps {
  offer: ViralUnlockOffer;
}

export function ShareUnlockCard({ offer }: ShareUnlockCardProps) {
  const [hasShared, setHasShared] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHasShared(window.localStorage.getItem(offer.storageKey) === "shared");
  }, [offer.storageKey]);

  const officialFacebook = "https://www.facebook.com/Mastereasyfengshui";
  const officialInstagram = "https://www.instagram.com/enhancefengshui/";
  const officialIgHandle = "@enhancefengshui";
  const shareText = [
    offer.facebookShareText,
    "",
    `官方 Facebook：${officialFacebook}`,
    `Instagram：${officialIgHandle}`,
    offer.shareUrl
  ].join("\n");

  function markShared(eventType: "facebook_share_click" | "instagram_share_click" | "copy_share_text") {
    window.localStorage.setItem(offer.storageKey, "shared");
    setHasShared(true);
    void trackShareEvent(eventType, offer, eventType === "instagram_share_click" ? "instagram" : eventType === "facebook_share_click" ? "facebook" : "copy");
  }

  function handleFacebookShare() {
    markShared("facebook_share_click");
    const shareHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(offer.shareUrl)}`;
    window.open(shareHref, "_blank", "noopener,noreferrer,width=680,height=620");
  }

  async function handleInstagramShare() {
    markShared("instagram_share_click");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "我的姓名能量初诊",
          text: shareText,
          url: offer.shareUrl
        });
        return;
      } catch {
        // User may cancel the native share sheet. Keep the unlock prompt visible.
      }
    }

    await copyShareText();
    window.open(officialInstagram, "_blank", "noopener,noreferrer");
  }

  async function copyShareText() {
    markShared("copy_share_text");
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-app border border-[#FF67D8]/35 bg-[#6423D2]/18 p-5 shadow-[0_0_34px_rgba(255,103,216,0.16)] backdrop-blur">
      <p className="text-xs font-semibold text-gold">分享解锁 PDF</p>
      <h2 className="mt-2 text-xl font-semibold text-white">{offer.title}</h2>
      <p className="mt-3 text-sm leading-7 text-warmGray">{offer.subtitle}</p>

      <div className="mt-4 rounded-[28px] border border-[#FF67D8]/25 bg-[radial-gradient(circle_at_top_right,rgba(255,103,216,0.2),transparent_34%),rgba(255,255,255,0.08)] p-4">
        <p className="text-xs font-semibold text-gold">分享时请 tag 官方</p>
        <p className="mt-2 text-sm leading-7 text-white">Facebook：Mastereasyfengshui</p>
        <p className="text-sm leading-7 text-white">Instagram：{officialIgHandle}</p>
        <p className="mt-3 text-xs leading-6 text-warmGray">
          Instagram 无法保证网页自动 tag，建议复制文案后贴到 Story 或贴文，并手动 tag 官方帐号。
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {offer.lockedModules.map((module) => (
          <p key={module} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm leading-6 text-warmGray">
            锁定｜{module}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={handleFacebookShare}
        className="mt-4 min-h-12 w-full rounded-2xl bg-gradient-to-r from-[#2D8CFF] via-[#C83BFF] to-[#FF4FD8] px-4 py-3 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]"
      >
        分享到 Facebook
      </button>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleInstagramShare}
          className="min-h-12 rounded-2xl border border-[#FF67D8]/35 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]"
        >
          分享到 Instagram
        </button>
        <button
          type="button"
          onClick={copyShareText}
          className="min-h-12 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]"
        >
          {copied ? "已复制文案" : "复制分享文案"}
        </button>
      </div>

      {hasShared ? (
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/10 p-4">
          <p className="text-sm font-semibold text-white">已记录分享动作</p>
          <p className="mt-2 text-xs leading-6 text-warmGray">
            请将 Facebook 或 Instagram 分享截图发送至 WhatsApp，并发送暗号「{offer.unlockCode}」。助理会为你处理 PDF 领取。
          </p>
          <WhatsAppButton message={offer.whatsappMessage} variant="soft">
            WhatsApp 发送截图领取 PDF
          </WhatsAppButton>
        </div>
      ) : null}
    </section>
  );
}

async function trackShareEvent(
  eventType: "facebook_share_click" | "instagram_share_click" | "copy_share_text",
  offer: ViralUnlockOffer,
  platform: string
) {
  try {
    const raw = window.localStorage.getItem("ai-name-analysis:last-result");
    const result = raw
      ? JSON.parse(raw) as {
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
        }
      : {};

    await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        eventType,
        leadId: result.userInput?.trackingId,
        sessionId: result.userInput?.sessionId,
        name: result.userInput?.name,
        zodiac: result.userInput?.zodiac,
        gender: result.userInput?.gender,
        focus: result.userInput?.focus,
        reportTier: result.userInput?.reportTier,
        score: result.score,
        primaryPain: result.funnelAnalysis?.conversionTags?.primaryPain,
        source: "share_unlock_card",
        metadata: {
          platform,
          unlockCode: offer.unlockCode,
          shareUrl: offer.shareUrl
        }
      }),
      keepalive: true
    });
  } catch {
    // Sharing should not be blocked by tracking.
  }
}
