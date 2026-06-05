"use client";

import { useEffect, useState } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import type { ViralUnlockOffer } from "@/types/analysis";

interface ShareUnlockCardProps {
  offer: ViralUnlockOffer;
}

export function ShareUnlockCard({ offer }: ShareUnlockCardProps) {
  const [hasShared, setHasShared] = useState(false);

  useEffect(() => {
    setHasShared(window.localStorage.getItem(offer.storageKey) === "shared");
  }, [offer.storageKey]);

  function handleShare() {
    const shareHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(offer.shareUrl)}&quote=${encodeURIComponent(offer.facebookShareText)}`;
    window.localStorage.setItem(offer.storageKey, "shared");
    setHasShared(true);
    window.open(shareHref, "_blank", "noopener,noreferrer,width=680,height=620");
  }

  return (
    <section className="rounded-app border border-[#FF67D8]/35 bg-[#6423D2]/18 p-5 shadow-[0_0_34px_rgba(255,103,216,0.16)] backdrop-blur">
      <p className="text-xs font-semibold text-gold">Facebook 分享解锁</p>
      <h2 className="mt-2 text-xl font-semibold text-white">{offer.title}</h2>
      <p className="mt-3 text-sm leading-7 text-warmGray">{offer.subtitle}</p>

      <div className="mt-4 space-y-2">
        {offer.lockedModules.map((module) => (
          <p key={module} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm leading-6 text-warmGray">
            锁定｜{module}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="mt-4 min-h-12 w-full rounded-2xl bg-gradient-to-r from-[#2D8CFF] via-[#C83BFF] to-[#FF4FD8] px-4 py-3 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]"
      >
        分享到 Facebook 解锁免费 PDF
      </button>

      {hasShared ? (
        <div className="mt-4 rounded-2xl border border-white/12 bg-white/10 p-4">
          <p className="text-sm font-semibold text-white">已记录分享动作</p>
          <p className="mt-2 text-xs leading-6 text-warmGray">
            请将 Facebook 分享截图发送至 WhatsApp，并发送暗号「{offer.unlockCode}」。助理会为你处理 PDF 领取。
          </p>
          <WhatsAppButton message={offer.whatsappMessage} variant="soft">
            WhatsApp 发送截图领取 PDF
          </WhatsAppButton>
        </div>
      ) : null}
    </section>
  );
}
