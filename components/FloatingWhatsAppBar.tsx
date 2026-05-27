"use client";

import { WhatsAppButton } from "@/components/WhatsAppButton";

export function FloatingWhatsAppBar({ message }: { message: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] px-4 pb-4">
      <div className="rounded-[26px] border border-white/12 bg-rice/85 p-3 shadow-[0_-12px_40px_rgba(200,59,255,0.28)] backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">想让老师细看你的名字？</p>
            <p className="truncate text-[11px] text-warmGray">带着报告内容过去，老师会比较快抓到重点。</p>
          </div>
          <WhatsAppButton message={message} className="mt-0 min-h-11 w-auto shrink-0 rounded-xl px-4">
            WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  );
}
