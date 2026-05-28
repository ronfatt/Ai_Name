"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeName, validateChineseName } from "@/lib/nameAnalysis";
import type { Focus, Gender } from "@/types/analysis";
import { LoadingAnalysis } from "@/components/LoadingAnalysis";

const zodiacs = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
const analysisScriptType = "traditional" as const;

export function InputForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [zodiac, setZodiac] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [focus, setFocus] = useState<Focus>("整体");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nameError = validateChineseName(name);

    if (nameError) {
      setError(nameError);
      return;
    }

    if (!zodiac) {
      setError("请先选择生肖，系统才能比对姓名能量。");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    const localResult = analyzeName({
      name,
      scriptType: analysisScriptType,
      zodiac,
      gender,
      focus
    });

    const minimumLoading = new Promise((resolve) => window.setTimeout(resolve, 4300));

    try {
      const reportResponse = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: {
            name,
            scriptType: analysisScriptType,
            zodiac,
            gender,
            focus
          },
          localAnalysis: localResult
        })
      });

      const reportData = (await reportResponse.json()) as { analysis?: typeof localResult };
      const finalResult = reportResponse.ok && reportData.analysis ? reportData.analysis : localResult;

      await minimumLoading;
      window.localStorage.setItem("ai-name-analysis:last-result", JSON.stringify(finalResult));
      router.push("/result");
    } catch {
      await minimumLoading;
      window.localStorage.setItem("ai-name-analysis:last-result", JSON.stringify(localResult));
      router.push("/result");
    }
  }

  if (isAnalyzing) {
    return <LoadingAnalysis />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="overflow-hidden rounded-[22px] border border-[#7C3DFF]/45 bg-[#120A3A]/82 shadow-soft backdrop-blur">
        <div className="border-b border-[#7C3DFF]/35 px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white"><span className="text-[#A77BFF]">●</span>1 姓名资料</h2>
        </div>
        <label className="block border-b border-white/10 px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-warmGray">中文姓名</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="请输入你的常用中文姓名"
            className="h-11 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-[16px] text-white outline-none placeholder:text-warmGray/55 focus:border-[#FF67D8]/60"
          />
          <span className="mt-1 block text-xs leading-5 text-warmGray">系统会自动以繁体姓名笔画进行初步分析。</span>
        </label>
        <div className="grid border-b border-white/10 px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-warmGray">性别</span>
          <div className="mb-3 grid grid-cols-[1fr_auto] gap-3">
            <select
              value={gender}
              onChange={(event) => setGender(event.target.value as Gender)}
              className="h-11 rounded-2xl border border-white/12 bg-white/8 px-4 text-[16px] text-white outline-none focus:border-[#FF67D8]/60"
            >
              <option value="">请选择性别</option>
              <option value="男">男</option>
              <option value="女">女</option>
              <option value="不透露">不方便透露</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["男", "女", "不透露"] as Gender[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setGender(item)}
                className={`rounded-full border px-4 py-1 text-xs ${gender === item ? "border-[#FF67D8] bg-[#6320C8] text-white" : "border-white/10 bg-white/8 text-warmGray"}`}
              >
                {item === "不透露" ? "不方便透露" : item}
              </button>
            ))}
          </div>
        </div>
        <label className="block px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-warmGray">生肖</span>
          <select
            value={zodiac}
            onChange={(event) => setZodiac(event.target.value)}
            className="h-11 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-[16px] text-white outline-none focus:border-[#FF67D8]/60"
          >
            <option value="">请选择生肖</option>
            {zodiacs.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-[#7C3DFF]/45 bg-[#120A3A]/82 shadow-soft backdrop-blur">
        <div className="border-b border-[#7C3DFF]/35 px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white"><span className="text-[#A77BFF]">▣</span>2 出生资料 <span className="text-xs font-normal text-warmGray">｜用于提升分析准确度</span></h2>
        </div>
        <label className="block border-b border-white/10 px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-warmGray">出生日期</span>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              placeholder="请选择出生年月日"
              className="h-11 rounded-2xl border border-white/12 bg-white/8 px-4 text-[16px] text-white outline-none placeholder:text-warmGray/55 focus:border-[#FF67D8]/60"
            />
            <div className="flex rounded-2xl border border-white/12 bg-white/8 p-1">
              <button type="button" onClick={() => setCalendarType("solar")} className={`rounded-xl px-3 text-sm ${calendarType === "solar" ? "bg-[#6320C8] text-white" : "text-warmGray"}`}>阳历</button>
              <button type="button" onClick={() => setCalendarType("lunar")} className={`rounded-xl px-3 text-sm ${calendarType === "lunar" ? "bg-[#6320C8] text-white" : "text-warmGray"}`}>农历</button>
            </div>
          </div>
        </label>
        <label className="block border-b border-white/10 px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-warmGray">出生时间</span>
          <input
            value={birthTime}
            onChange={(event) => setBirthTime(event.target.value)}
            placeholder="请选择出生时间，不知道可填不确定"
            className="h-11 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-[16px] text-white outline-none placeholder:text-warmGray/55 focus:border-[#FF67D8]/60"
          />
          <span className="mt-1 block text-xs leading-5 text-warmGray">不知道准确时间，可选择“不确定出生时间”。</span>
        </label>
        <label className="block px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-warmGray">出生城市</span>
          <input
            value={birthCity}
            onChange={(event) => setBirthCity(event.target.value)}
            placeholder="请输入出生城市，例如：吉隆坡"
            className="h-11 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-[16px] text-white outline-none placeholder:text-warmGray/55 focus:border-[#FF67D8]/60"
          />
        </label>
      </div>

      <div className="overflow-hidden rounded-[22px] border border-[#7C3DFF]/45 bg-[#120A3A]/82 shadow-soft backdrop-blur">
        <div className="border-b border-[#7C3DFF]/35 px-4 py-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-white"><span className="text-[#A77BFF]">◎</span>3 本次分析重点</h2>
        </div>
        <label className="block px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-warmGray">请选择你最想先了解的方向</span>
          <select
            value={focus}
            onChange={(event) => setFocus(event.target.value as Focus)}
            className="h-11 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-[16px] text-white outline-none focus:border-[#FF67D8]/60"
          >
            {["整体", "事业", "爱情", "财运", "人际", "家庭", "改名"].map((item) => (
              <option key={item} value={item === "人际" ? "整体" : item}>{item === "改名" ? "是否需要改名" : item}</option>
            ))}
          </select>
          <div className="mt-3 flex flex-wrap gap-2">
            {["整体", "事业", "爱情", "财运", "人际", "家庭", "改名"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFocus((item === "人际" ? "整体" : item) as Focus)}
                className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-warmGray"
              >
                {item === "改名" ? "是否需要改名" : item}
              </button>
            ))}
          </div>
        </label>
      </div>

      {error ? (
        <p className="rounded-2xl border border-gold/25 bg-white/10 px-4 py-3 text-sm leading-6 text-white">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="h-16 w-full rounded-full bg-gradient-to-r from-[#FF4FD8] via-[#C83BFF] to-[#2D8CFF] px-4 text-xl font-semibold text-white shadow-[0_0_38px_rgba(255,79,216,0.62)] transition active:scale-[0.98]"
      >
        ✦ 立即生成姓名命格报告
      </button>
      <p className="text-center text-xs leading-6 text-warmGray">约 10 秒生成初步分析｜仅供姓名学与命理文化参考</p>

      <section className="rounded-[22px] border border-[#9E62FF]/35 bg-white/8 p-4 shadow-soft backdrop-blur">
        <div className="flex gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-2xl">♢</span>
          <p className="text-xs leading-6 text-warmGray">
            本系统为姓名学与民俗文化角度的 AI 初步分析，仅供参考，不代表绝对命运判断。若需完整改名、取名或命格判断，建议结合八字、紫微斗数、生肖喜忌与个人资料，由专业老师进一步分析。
          </p>
        </div>
      </section>
    </form>
  );
}
