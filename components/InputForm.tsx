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
      <div className="overflow-hidden rounded-[26px] border border-white/12 bg-white/10 shadow-soft backdrop-blur">
      <label className="block border-b border-white/10 px-4 py-3">
        <span className="mb-2 block text-xs font-semibold text-gold">中文姓名</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="例如：陈伟强"
          className="h-10 w-full bg-transparent text-[17px] text-white outline-none placeholder:text-warmGray/55"
        />
        <span className="mt-1 block text-xs leading-5 text-warmGray">系统会自动以繁体姓名笔画进行初步分析。</span>
      </label>

      <div className="grid">
        <label className="block border-b border-white/10 px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-gold">生肖</span>
          <select
            value={zodiac}
            onChange={(event) => setZodiac(event.target.value)}
            className="h-10 w-full bg-transparent text-[17px] text-white outline-none"
          >
            <option value="">请选择生肖</option>
            {zodiacs.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="block border-b border-white/10 px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-gold">性别</span>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value as Gender)}
            className="h-10 w-full bg-transparent text-[17px] text-white outline-none"
          >
            <option value="">不透露</option>
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="不透露">不透露</option>
          </select>
        </label>

        <label className="block px-4 py-3">
          <span className="mb-2 block text-xs font-semibold text-gold">目前最想了解</span>
          <select
            value={focus}
            onChange={(event) => setFocus(event.target.value as Focus)}
            className="h-10 w-full bg-transparent text-[17px] text-white outline-none"
          >
            {["家庭", "事业", "爱情", "财运", "改名", "整体"].map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-gold/25 bg-white/10 px-4 py-3 text-sm leading-6 text-white">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="h-14 w-full rounded-2xl bg-gradient-to-r from-moss via-[#E944B7] to-mossSoft px-4 text-base font-semibold text-white shadow-soft transition active:scale-[0.98]"
      >
        开始分析我的名字
      </button>
    </form>
  );
}
