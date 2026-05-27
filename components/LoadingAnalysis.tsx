"use client";

import { useEffect, useState } from "react";

const loadingTexts = [
  "正在拆解姓名结构…",
  "正在分析字义与五行能量…",
  "正在比对生肖喜忌…",
  "正在生成家庭、事业、爱情趋势…",
  "老师正在整理初步提醒…"
];

export function LoadingAnalysis() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(current + 1, loadingTexts.length - 1));
    }, 850);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-[560px] flex-col items-center justify-center text-center">
      <div className="relative grid h-36 w-36 place-items-center rounded-full border border-white/15 bg-white/10 shadow-soft backdrop-blur">
        <div className="absolute inset-3 rounded-full border border-dashed border-gold/45" />
        <span className="text-4xl font-semibold text-white">名</span>
      </div>
      <div className="mt-8 flex h-8 items-end gap-2">
        <span className="loading-dot h-3 w-3 rounded-full bg-gold" />
        <span className="loading-dot h-3 w-3 rounded-full bg-mossSoft" />
        <span className="loading-dot h-3 w-3 rounded-full bg-gold" />
      </div>
      <p className="mt-5 min-h-7 text-base font-semibold text-white">{loadingTexts[step]}</p>
      <p className="mt-3 max-w-[280px] text-sm leading-6 text-warmGray">
        系统正在生成初步参考报告，完整判断仍建议由老师结合个人资料进一步分析。
      </p>
    </div>
  );
}
