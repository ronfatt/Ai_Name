"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CharacterCard } from "@/components/CharacterCard";
import { FloatingWhatsAppBar } from "@/components/FloatingWhatsAppBar";
import { LeadCapture } from "@/components/LeadCapture";
import { ResultCard } from "@/components/ResultCard";
import { ScoreCard } from "@/components/ScoreCard";
import { SectionReportCard } from "@/components/SectionReportCard";
import { TagBadge } from "@/components/TagBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { analyzeName } from "@/lib/nameAnalysis";
import type { AnalysisResult } from "@/types/analysis";

const storageKey = "ai-name-analysis:last-result";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      router.replace("/analysis");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AnalysisResult;
      if (!parsed.zodiacName && parsed.userInput?.name && parsed.userInput?.zodiac) {
        const repaired = {
          ...parsed,
          zodiacName: analyzeName({
            ...parsed.userInput,
            scriptType: parsed.userInput.scriptType || "traditional"
          }).zodiacName
        };
        window.localStorage.setItem(storageKey, JSON.stringify(repaired));
        setResult(repaired);
        return;
      }
      setResult(parsed);
    } catch {
      window.localStorage.removeItem(storageKey);
      router.replace("/analysis");
    }
  }, [router]);

  if (!result) {
    return (
      <AppShell compact bottomInset>
        <div className="min-h-[520px] pt-10 text-center text-sm text-warmGray">正在打开报告…</div>
      </AppShell>
    );
  }

  return (
    <AppShell compact bottomInset>
      <div className="space-y-7 pb-4">
        <section className="pt-2">
          <p className="text-sm font-medium text-gold">姓名学初步报告</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink">{result.userInput.name} 的名字能量</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <TagBadge>生肖 {result.userInput.zodiac}</TagBadge>
            <TagBadge>关注 {result.userInput.focus || "整体"}</TagBadge>
          </div>
        </section>

        <ResultCard title="老师先温和地跟你说">
          <p className="text-sm leading-7 text-warmGray">{result.overall.opening}</p>
        </ResultCard>

        <ScoreCard score={result.score} patternName={result.patternName} />

        <ResultCard title="生肖与名字的配合">
          <div className="space-y-4 text-sm leading-7 text-warmGray">
            <div className="flex flex-wrap gap-2">
              <TagBadge>{result.zodiacName.zodiacElement}</TagBadge>
              <TagBadge>姓名主气 {result.zodiacName.nameDominantElement}</TagBadge>
              <TagBadge>{result.zodiacName.relationLabel}</TagBadge>
            </div>
            <p>{result.zodiacName.summary}</p>
            <p><span className="font-semibold text-gold">关系提醒：</span>{result.zodiacName.relationTone}</p>
            <ListBlock title="可参考的生肖喜用字根" items={result.zodiacName.favorableRoots.slice(0, 3)} />
            <ListBlock title="本名初步看到的配合点" items={result.zodiacName.matchedRoots.slice(0, 3)} />
            <ListBlock title="老师温和提醒" items={result.zodiacName.cautions} />
          </div>
        </ResultCard>

        <ResultCard title="姓名整体气场">
          <div className="space-y-5">
            <ListBlock title="主要优势" items={result.overall.strengths} />
            <ListBlock title="主要阻力" items={result.overall.resistances} />
            <ListBlock title="需要进一步确认" items={result.overall.confirmations} />
          </div>
        </ResultCard>

        <ResultCard title="先把重点给老师看" subtle>
          <p className="text-sm leading-7 text-warmGray">
            如果你看到这里，已经能感觉名字里有些地方和自己很像，可以先带着这份初步报告问老师。老师会从姓名结构、生肖喜忌和你目前最在意的方向一起看。
          </p>
          <WhatsAppButton message={result.whatsappMessages["整体"]} variant="soft">
            WhatsApp 老师先看整体重点
          </WhatsAppButton>
        </ResultCard>

        <section className="space-y-3">
          <h2 className="px-1 text-lg font-semibold text-white">单字能量分析</h2>
          {result.characters.map((character, index) => (
            <CharacterCard key={`${character.char}-${index}`} character={character} />
          ))}
        </section>

        <SectionReportCard
          report={result.family}
          section="家庭"
          message={result.whatsappMessages["家庭"]}
          cta="WhatsApp 老师看我的家庭能量"
        />
        <SectionReportCard
          report={result.career}
          section="事业"
          message={result.whatsappMessages["事业"]}
          cta="WhatsApp 老师看我的事业与财运"
        />

        <ResultCard title="事业和财运可以再细一点看" subtle>
          <p className="text-sm leading-7 text-warmGray">
            有些名字不是没有能力，而是机会来得慢、方向容易反复，或贵人缘需要被引动。若你现在正卡在事业、钱财或选择上，可以把这一段直接发给老师。
          </p>
          <WhatsAppButton message={result.whatsappMessages["事业"]}>
            WhatsApp 老师细看事业财运
          </WhatsAppButton>
        </ResultCard>

        <SectionReportCard
          report={result.love}
          section="爱情"
          message={result.whatsappMessages["爱情"]}
          cta="WhatsApp 老师看我的爱情与婚姻"
        />

        <ResultCard title="过去能量痕迹" subtle>
          <p className="text-sm leading-7 text-warmGray">{result.pastTrace}</p>
        </ResultCard>

        <ResultCard title="三方面综合总结">
          <p className="text-sm leading-7 text-warmGray">{result.summary}</p>
        </ResultCard>

        <ResultCard title="需要进一步确认的重点">
          <ListBlock title="" items={result.deeperQuestions} />
        </ResultCard>

        <ResultCard title="你的名字还有更深一层没有被打开">
          <p className="text-sm leading-7 text-warmGray">
            这份分析只是先把名字表面的能量拆给你看。真正要判断这个名字是否适合继续使用、是否需要调整，还是要结合你的出生资料、现实处境、目前最卡的事情一起看。你不需要马上做决定，可以先让老师帮你确认：这个名字是在帮你，还是有些地方正在消耗你。
          </p>
          <WhatsAppButton message={result.whatsappMessages["整体"]}>WhatsApp 老师完整确认我的名字</WhatsAppButton>
          <LeadCapture />
        </ResultCard>

        <ResultCard title="免责声明" subtle>
          <p className="text-xs leading-6 text-warmGray">
            本分析属于姓名学与民俗文化角度的初步参考，不代表绝对命运判断。若需完整判断，建议结合个人出生资料、实际情况与老师咨询。
          </p>
        </ResultCard>
      </div>
      <FloatingWhatsAppBar message={result.whatsappMessages["整体"]} />
    </AppShell>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      {title ? <h3 className="mb-2 text-sm font-semibold text-gold">{title}</h3> : null}
      <div className="space-y-2">
        {items.map((item) => (
          <p key={item} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm leading-6 text-warmGray">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
