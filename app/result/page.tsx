"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { CharacterCard } from "@/components/CharacterCard";
import { FloatingWhatsAppBar } from "@/components/FloatingWhatsAppBar";
import { LeadCapture } from "@/components/LeadCapture";
import { ResultCard } from "@/components/ResultCard";
import { SectionReportCard } from "@/components/SectionReportCard";
import { ShareUnlockCard } from "@/components/ShareUnlockCard";
import { TagBadge } from "@/components/TagBadge";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { generateAnalysis } from "@/lib/report/generateAnalysis";
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
      if (
        (!parsed.zodiacName ||
          !parsed.zodiacName.characterMatches ||
          !parsed.zodiacName.harmonyNotes ||
          !parsed.fiveGrid ||
          !parsed.ziweiChart ||
          !parsed.ziweiNameMatch ||
          !parsed.teacherConclusion ||
          !parsed.dataConfidence ||
          !parsed.funnelAnalysis ||
          !parsed.funnelAnalysis.reportOffers ||
          !parsed.funnelAnalysis.viralUnlock ||
          !parsed.scoreHook ||
          !parsed.timeline ||
          !parsed.painPoints ||
          !parsed.baguaName ||
          !parsed.professionalReview) &&
        parsed.userInput?.name &&
        parsed.userInput?.zodiac
      ) {
        const latest = generateAnalysis({
          ...parsed.userInput,
          scriptType: parsed.userInput.scriptType || "traditional"
        });
        const repaired = {
          ...parsed,
          fiveGrid: parsed.fiveGrid ?? latest.fiveGrid,
          ziweiChart: parsed.ziweiChart ?? latest.ziweiChart,
          ziweiNameMatch: parsed.ziweiNameMatch ?? latest.ziweiNameMatch,
          teacherConclusion: parsed.teacherConclusion ?? latest.teacherConclusion,
          dataConfidence: parsed.dataConfidence ?? latest.dataConfidence,
          funnelAnalysis: {
            ...latest.funnelAnalysis,
            ...parsed.funnelAnalysis,
            reportOffers: parsed.funnelAnalysis?.reportOffers ?? latest.funnelAnalysis.reportOffers,
            viralUnlock: parsed.funnelAnalysis?.viralUnlock ?? latest.funnelAnalysis.viralUnlock
          },
          scoreHook: parsed.scoreHook ?? latest.scoreHook,
          timeline: parsed.timeline ?? latest.timeline,
          painPoints: parsed.painPoints ?? latest.painPoints,
          baguaName: parsed.baguaName ?? latest.baguaName,
          professionalReview: parsed.professionalReview ?? latest.professionalReview,
          zodiacName: {
            ...latest.zodiacName,
            ...parsed.zodiacName,
            characterMatches: parsed.zodiacName?.characterMatches ?? latest.zodiacName.characterMatches,
            harmonyNotes: parsed.zodiacName?.harmonyNotes ?? latest.zodiacName.harmonyNotes
          }
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

  function unlockPaidPreview() {
    if (!result) return;
    const paidPreview = generateAnalysis({
      ...result.userInput,
      reportTier: "paid",
      scriptType: result.userInput.scriptType || "traditional"
    });
    window.localStorage.setItem(storageKey, JSON.stringify(paidPreview));
    setResult(paidPreview);
  }

  const primaryPain = getPrimaryPain(result);
  const primaryTimeline = getPrimaryTimeline(result, primaryPain);
  const topEvidence = buildTopEvidence(result, primaryPain);

  return (
    <AppShell compact bottomInset>
      <div className="space-y-7 pb-4">
        <section className="pt-2">
          <p className="text-sm font-medium text-gold">姓名学初步报告</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink">{result.userInput.name} 的名字能量</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <TagBadge>生肖 {result.userInput.zodiac}</TagBadge>
            <TagBadge>关注 {result.userInput.focus || "整体"}</TagBadge>
            {result.userInput.birthDate ? <TagBadge>{result.userInput.birthDate}</TagBadge> : null}
          </div>
        </section>

        <ResultCard title="先看结论">
          <div className="space-y-4">
            <div className="rounded-3xl border border-[#FF67D8]/35 bg-[#6423D2]/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-gold">综合分数</p>
                  <p className="mt-1 text-4xl font-semibold text-white">{result.score}<span className="text-base text-warmGray"> / 100</span></p>
                </div>
                <TagBadge>{trafficLight(primaryPain.riskLevel).dot} {primaryPain.score}分</TagBadge>
              </div>
              <h2 className="mt-4 text-2xl font-semibold leading-snug text-white">
                你的名字不是没运，而是「{formatPainTitle(primaryPain.title).split("｜")[1]}」比较需要细看。
              </h2>
              <p className="mt-3 text-sm leading-7 text-warmGray">
                目前最明显的卡点落在 {primaryTimeline.title}（{primaryTimeline.ageRange}）。免费版先帮你看见问题，不会一次把完整判断和调整方向全部摊开。
              </p>
            </div>

            <div className="grid gap-3">
              {topEvidence.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/12 bg-white/10 p-4">
                  <p className="text-sm font-semibold text-gold">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-warmGray">{item.text}</p>
                </div>
              ))}
            </div>

            <WhatsAppButton message={result.funnelAnalysis.reportOffers.paid.whatsappMessage} variant="soft">
              我想直接看完整 15 页深度报告
            </WhatsAppButton>
          </div>
        </ResultCard>

        <ResultCard title="你的红灯区域">
          <div className="space-y-3">
            {[primaryPain, ...result.painPoints.filter((item) => item.title !== primaryPain.title)].map((item, index) => (
              <div key={item.title} className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{formatPainTitle(item.title)}</p>
                    <p className="mt-1 text-xs text-gold">{trafficLight(item.riskLevel).label}</p>
                  </div>
                  <TagBadge>{trafficLight(item.riskLevel).dot} {item.score}分</TagBadge>
                </div>
                {index === 0 ? (
                  <p className="mt-3 text-sm leading-7 text-warmGray">{item.text}</p>
                ) : (
                  <p className="mt-3 text-sm leading-7 text-warmGray">
                    这块先保留为辅助参考。免费版重点先看最明显的红灯区域，完整报告才会逐层拆开。
                  </p>
                )}
                {item.title === "财：财富与守财" && result.funnelAnalysis.reportOffers.selectedTier === "free" ? (
                  <div className="relative mt-3 overflow-hidden rounded-2xl border border-[#FF67D8]/25 bg-[#6423D2]/15 px-4 py-4">
                    <p className="text-xs leading-6 text-white">
                      系统检测到 41 岁后财库守卫仍有一处需要深拆的节点…
                    </p>
                    <div className="mt-3 select-none space-y-2 blur-[3px]">
                      <p className="h-3 rounded-full bg-white/35" />
                      <p className="h-3 w-5/6 rounded-full bg-white/25" />
                      <p className="h-3 w-2/3 rounded-full bg-white/20" />
                    </div>
                    <p className="mt-4 text-xs font-semibold text-gold">完整财库拆解已锁定在 15 页深度报告</p>
                  </div>
                ) : (
                  <p className="mt-3 rounded-2xl border border-[#FF67D8]/25 bg-[#6423D2]/15 px-4 py-3 text-xs leading-6 text-white">{item.withheldHint}</p>
                )}
              </div>
            ))}
          </div>
        </ResultCard>

        <ResultCard title="解锁完整报告">
          <div className="space-y-4 text-sm leading-7 text-warmGray">
            <div className="rounded-3xl border border-[#FF67D8]/45 bg-[#6423D2]/20 p-5 shadow-[0_0_30px_rgba(255,103,216,0.16)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">15页紫微姓名学深度诊断书</p>
                  <p className="mt-1 text-xs font-semibold text-gold">完整拆解命宫、名一、名二、财库与流年</p>
                </div>
                <TagBadge>{result.funnelAnalysis.reportOffers.selectedTier === "paid" ? "已解锁" : "锁定"}</TagBadge>
              </div>
              <p className="mt-3 text-sm leading-7 text-warmGray">
                免费版只先指出「{formatPainTitle(primaryPain.title).split("｜")[1]}」这个最大卡点；完整报告会把背后的紫微主星、三才时间轴、生肖字根和字形音义一次看清楚。
              </p>
              <div className="mt-4 grid gap-2">
                {result.funnelAnalysis.reportOffers.paid.lockedTeasers.slice(0, 3).map((item) => (
                  <p key={item} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-xs leading-6 text-warmGray">
                    {result.funnelAnalysis.reportOffers.selectedTier === "paid" ? "已开放" : "锁定"}｜{item}
                  </p>
                ))}
              </div>
              {result.funnelAnalysis.reportOffers.selectedTier !== "paid" ? (
                <button
                  type="button"
                  onClick={unlockPaidPreview}
                  className="mt-4 min-h-12 w-full rounded-2xl border border-[#FF67D8]/45 bg-white/10 px-4 py-3 text-sm font-semibold text-white shadow-soft transition active:scale-[0.98]"
                >
                  先免费预览完整报告
                </button>
              ) : null}
              <WhatsAppButton message={result.funnelAnalysis.reportOffers.paid.whatsappMessage}>
                WhatsApp 领取 15 页报告
              </WhatsAppButton>
            </div>
          </div>
        </ResultCard>

        <ShareUnlockCard offer={result.funnelAnalysis.viralUnlock} />

        <ResultCard title="五行能量雷达图">
          <div className="space-y-4">
            <div className="grid gap-3">
              {result.funnelAnalysis.energyRadar.points.map((point) => (
                <div key={point.element} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{point.element}｜{point.label}</p>
                    <span className="text-xs font-semibold text-gold">{point.score}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FF67D8] via-[#C83BFF] to-[#29B6FF]"
                      style={{ width: `${point.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm leading-7 text-warmGray">{result.funnelAnalysis.energyRadar.insight}</p>
          </div>
        </ResultCard>

        <ResultCard title={result.funnelAnalysis.annualWarning.title} subtle>
          <div className="space-y-3 text-sm leading-7 text-warmGray">
            <div className="flex flex-wrap gap-2">
              <TagBadge>{result.funnelAnalysis.annualWarning.stemBranch}年</TagBadge>
              <TagBadge>太岁 {result.funnelAnalysis.annualWarning.zodiac}</TagBadge>
              <TagBadge>提醒强度 {result.funnelAnalysis.annualWarning.urgency}</TagBadge>
            </div>
            <p>{result.funnelAnalysis.annualWarning.text}</p>
          </div>
        </ResultCard>

        <ResultCard title="专属姓名诊断海报">
          <div className="space-y-4">
            <div className="rounded-[28px] border border-[#FF67D8]/30 bg-[radial-gradient(circle_at_top_right,rgba(255,103,216,0.25),transparent_36%),linear-gradient(135deg,rgba(24,9,61,0.9),rgba(86,18,139,0.55))] p-5 shadow-[0_0_34px_rgba(200,59,255,0.22)]">
              <p className="text-xs text-gold">可分享预览</p>
              <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{result.funnelAnalysis.sharePoster.headline}</h3>
              <p className="mt-2 text-sm text-warmGray">{result.funnelAnalysis.sharePoster.scoreLine}</p>
              <p className="mt-5 text-lg font-semibold leading-8 text-white">“{result.funnelAnalysis.sharePoster.quote}”</p>
              <div className="mt-5 rounded-2xl border border-white/12 bg-white/10 p-3 text-xs leading-5 text-warmGray">
                扫码可回到这份姓名初诊报告
              </div>
            </div>
            <p className="text-xs leading-6 text-warmGray">{result.funnelAnalysis.sharePoster.visualStyle}</p>
          </div>
        </ResultCard>

        <ResultCard title={result.funnelAnalysis.partnerCompatibility.title} subtle>
          <p className="text-sm leading-7 text-warmGray">{result.funnelAnalysis.partnerCompatibility.text}</p>
        </ResultCard>

        <ResultCard title="姓名专业点评">
          <div className="space-y-3 text-sm leading-7 text-warmGray">
            <p><span className="font-semibold text-gold">生僻字：</span>{result.professionalReview.rareCharacter}</p>
            <p><span className="font-semibold text-gold">字音：</span>{result.professionalReview.pronunciation}</p>
            <p><span className="font-semibold text-gold">字义：</span>{result.professionalReview.meaning}</p>
            <p><span className="font-semibold text-gold">字形：</span>{result.professionalReview.shape}</p>
            <p className="rounded-2xl border border-white/12 bg-white/10 p-4 text-white">{result.professionalReview.authorityNote}</p>
          </div>
        </ResultCard>

        <ResultCard title="紫微命盘与姓名五格">
          <div className="space-y-4 text-sm leading-7 text-warmGray">
            <div className="flex flex-wrap gap-2">
              <TagBadge>{result.ziweiChart.source === "iztro" ? "紫微排盘" : "本地初排"}</TagBadge>
              <TagBadge>命宫 {result.ziweiChart.keyPalaces.life.majorStars.join("、") || "空宫"}</TagBadge>
              <TagBadge>人格 {result.ziweiNameMatch.nameGridElement}</TagBadge>
            </div>
            <p>{result.ziweiNameMatch.summary}</p>
            <p><span className="font-semibold text-gold">真太阳时：</span>{result.ziweiChart.trueSolarTime.note}</p>
            <div className="rounded-2xl border border-white/12 bg-white/10 p-4 text-xs leading-6">
              <p><span className="font-semibold text-white">命宫：</span>你的底层性格与人生主轴。</p>
              <p><span className="font-semibold text-white">迁移宫：</span>外在人际、出门发展和贵人缘。</p>
              <p><span className="font-semibold text-white">官禄宫：</span>事业定位、工作方式和职业压力。</p>
              <p><span className="font-semibold text-white">财帛宫：</span>赚钱模式与资源累积。</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["命宫", result.ziweiChart.keyPalaces.life],
                ["迁移宫", result.ziweiChart.keyPalaces.migration],
                ["官禄宫", result.ziweiChart.keyPalaces.career],
                ["财帛宫", result.ziweiChart.keyPalaces.wealth]
              ].map(([label, palace]) => (
                <div key={label as string} className="rounded-2xl border border-white/12 bg-white/10 px-3 py-3">
                  <p className="font-semibold text-white">{label as string}</p>
                  <p className="mt-1 text-xs leading-5">{(palace as typeof result.ziweiChart.keyPalaces.life).majorStars.join("、") || "空宫"}｜五行 {(palace as typeof result.ziweiChart.keyPalaces.life).element}</p>
                </div>
              ))}
            </div>
            <ListBlock title="命名互证规则" items={result.ziweiNameMatch.rules.slice(0, 3).map((rule) => `${rule.title}：${rule.text}`)} />
          </div>
        </ResultCard>

        <ResultCard title="天命星曜与现用名契合度">
          <div className="space-y-4 text-sm leading-7 text-warmGray">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-xs font-semibold text-gold">命宫主星</p>
                <p className="mt-1 text-xl font-semibold text-white">{result.funnelAnalysis.ziweiStarNaming.lifeStar}</p>
                <p className="mt-1 text-xs">{result.funnelAnalysis.ziweiStarNaming.lifeArchetype}</p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="text-xs font-semibold text-gold">迁移宫主星</p>
                <p className="mt-1 text-xl font-semibold text-white">{result.funnelAnalysis.ziweiStarNaming.migrationStar}</p>
                <p className="mt-1 text-xs">{result.funnelAnalysis.ziweiStarNaming.migrationArchetype}</p>
              </div>
            </div>
            <p>{result.funnelAnalysis.ziweiStarNaming.nameDirection}</p>
            <p>{result.funnelAnalysis.ziweiStarNaming.personalBrandDirection}</p>
            <p className="rounded-2xl border border-[#FF67D8]/25 bg-[#6423D2]/15 p-4 text-white">
              {result.funnelAnalysis.ziweiStarNaming.mismatchWarning}
            </p>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gold">主星 × 姓名交叉验证</h3>
              {result.funnelAnalysis.ziweiStarNaming.crossChecks.map((item) => (
                <div key={`${item.triggerLabel}-${item.affectedArea}`} className="rounded-2xl border border-white/12 bg-white/10 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <TagBadge>{item.triggerLabel}</TagBadge>
                    <TagBadge>{item.affectedArea}</TagBadge>
                    <TagBadge>{item.scoreDelta > 0 ? "+" : ""}{item.scoreDelta}</TagBadge>
                  </div>
                  <p>{item.reason}</p>
                  <p className="mt-2 text-white">{item.safeWarning}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {result.funnelAnalysis.ziweiStarNaming.exampleChars.map((char) => (
                <TagBadge key={char}>{char}</TagBadge>
              ))}
            </div>
            <p className="text-xs leading-6 text-warmGray">{result.funnelAnalysis.ziweiStarNaming.cta}</p>
          </div>
        </ResultCard>

        <ResultCard title="五格笔画与人格五行">
          <div className="space-y-4 text-sm leading-7 text-warmGray">
            <p>{result.fiveGrid.summary}</p>
            <div className="grid grid-cols-2 gap-2">
              {result.fiveGrid.grids.map((grid) => (
                <div key={grid.name} className="rounded-2xl border border-white/12 bg-white/10 px-3 py-3">
                  <p className="font-semibold text-white">{grid.name}</p>
                  <p className="mt-1 text-xs leading-5">{grid.number} 画｜五行 {grid.element}</p>
                </div>
              ))}
            </div>
          </div>
        </ResultCard>

        <ResultCard title="姓名卦象辅助分析">
          <div className="space-y-4 text-sm leading-7 text-warmGray">
            <div className="flex flex-wrap gap-2">
              <TagBadge>主象 {result.baguaName.dominantGua}</TagBadge>
              <TagBadge>主气 {result.baguaName.dominantElement}</TagBadge>
              <TagBadge>{result.baguaName.sequence}</TagBadge>
            </div>
            <p>{result.baguaName.summary}</p>
            <p className="rounded-2xl border border-white/12 bg-white/10 p-4 text-xs leading-6">{result.baguaName.method}</p>
            <div className="space-y-3">
              {result.baguaName.characterReadings.map((item) => (
                <div key={`${item.char}-${item.position}-bagua`} className="rounded-2xl border border-white/12 bg-white/10 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <TagBadge>{item.position} {item.char}</TagBadge>
                    <TagBadge>{item.strokes}画｜{item.image}</TagBadge>
                    <TagBadge>数气 {item.numberQi}</TagBadge>
                  </div>
                  <p className="text-white">{item.safeSummary}</p>
                  <p className="mt-2"><span className="font-semibold text-gold">事业：</span>{item.careerHint}</p>
                  <p className="mt-2"><span className="font-semibold text-gold">关系：</span>{item.relationshipHint}</p>
                  <p className="mt-2"><span className="font-semibold text-gold">财库：</span>{item.wealthHint}</p>
                  <p className="mt-2 text-xs leading-5">提醒：{item.cautions.slice(0, 2).join("、")}。这只是卦象辅助，不单独断定好坏。</p>
                </div>
              ))}
            </div>
            <ListBlock title="卦象还需要确认" items={result.baguaName.confirmations} />
          </div>
        </ResultCard>

        <ResultCard title="生肖与名字的配合（辅助参考）">
          <div className="space-y-4 text-sm leading-7 text-warmGray">
            <div className="flex flex-wrap gap-2">
              <TagBadge>{result.zodiacName.zodiacElement}</TagBadge>
              <TagBadge>姓名主气 {result.zodiacName.nameDominantElement}</TagBadge>
              <TagBadge>{result.zodiacName.relationLabel}</TagBadge>
            </div>
            <p>{result.zodiacName.summary}</p>
            <p><span className="font-semibold text-gold">关系提醒：</span>{result.zodiacName.relationTone}</p>
            <ListBlock title="六合三合与冲害提醒" items={result.zodiacName.harmonyNotes} />
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gold">逐字生肖配合</h3>
              {result.zodiacName.characterMatches.map((item) => (
                <div key={`${item.char}-${item.position}`} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <TagBadge>{item.position} {item.char}</TagBadge>
                    <TagBadge>康熙参考 {item.kangxiStrokes} 画</TagBadge>
                    <TagBadge>{item.fitLevel}</TagBadge>
                  </div>
                  <p><span className="font-semibold text-gold">为什么这样看：</span>{item.reason}</p>
                  <p className="mt-2"><span className="font-semibold text-gold">会合冲刑：</span>{item.relationshipNote}</p>
                  <p className="mt-2 text-xs leading-5 text-warmGray">字根参考：{item.detectedRoots.join("、")}；对应生肖：{item.relatedZodiacs.join("、")}</p>
                </div>
              ))}
            </div>
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
            如果你看到这里，已经能感觉名字里有些地方和自己很像，可以先把这份报告发给老师。老师会先帮你确认出生时辰、命宫主星和姓名人格五行有没有真正配合。
          </p>
          <WhatsAppButton message={result.whatsappMessages["整体"]} variant="soft">
            把我的命盘姓名报告发给老师
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

        <ResultCard title="你的名字还有更深一层没有被打开">
          <p className="text-sm leading-7 text-warmGray">
            想要了解如何缝合财库漏口、稳住情缘宫位或放大事业品牌磁场，免费版只能先指出表层卡点。完整 15 页深度解析会进一步拆解你的命宫、迁移宫、三才时间轴、生肖字根与流年提醒，再由 Master Easy / 易玺师傅做一对一确认。
          </p>
          <div className="my-4 rounded-2xl border border-white/12 bg-white/10 p-4 text-xs leading-6 text-warmGray">
            <p><span className="font-semibold text-gold">系统判定优先切入：</span>{result.funnelAnalysis.conversionTags.primaryPain}</p>
            <p><span className="font-semibold text-gold">自动标签：</span>{result.funnelAnalysis.conversionTags.tags.join("、")}</p>
            <p className="mt-2 text-white">{result.funnelAnalysis.conversionTags.whatsappIntent}</p>
          </div>
          <WhatsAppButton message={result.funnelAnalysis.reportOffers.paid.whatsappMessage}>获取专属 15 页深度解析，并预约 Master Easy 一对一测名</WhatsAppButton>
          <LeadCapture result={result} />
        </ResultCard>

        <ResultCard title="稍后让老师联系你" subtle>
          <div className="space-y-2 text-xs leading-6 text-warmGray">
            <p>{result.funnelAnalysis.leadRecovery.text}</p>
          </div>
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

function formatPainTitle(title: AnalysisResult["painPoints"][number]["title"]): string {
  if (title.startsWith("名")) return "名｜事业品牌与社会声望";
  if (title.startsWith("情")) return "情｜亲密关系与高价值人际网";
  return "财｜正偏财流转与财库守卫";
}

function trafficLight(riskLevel: AnalysisResult["painPoints"][number]["riskLevel"]): { dot: string; label: string } {
  if (riskLevel === "需老师确认") return { dot: "红灯", label: "高敏感区域｜建议老师细看" };
  if (riskLevel === "需留意") return { dot: "黄灯", label: "中度提醒｜需要进一步确认" };
  return { dot: "绿灯", label: "初步平稳｜仍需看完整命盘" };
}

function getPrimaryPain(result: AnalysisResult): AnalysisResult["painPoints"][number] {
  return [...result.painPoints].sort((a, b) => {
    const severityA = a.riskLevel === "需老师确认" ? 0 : a.riskLevel === "需留意" ? 1 : 2;
    const severityB = b.riskLevel === "需老师确认" ? 0 : b.riskLevel === "需留意" ? 1 : 2;
    if (severityA !== severityB) return severityA - severityB;
    return a.score - b.score;
  })[0] ?? result.painPoints[0];
}

function getPrimaryTimeline(result: AnalysisResult, pain: AnalysisResult["painPoints"][number]): AnalysisResult["timeline"][number] {
  if (pain.title.startsWith("财")) return result.timeline[2] ?? result.timeline[0];
  if (pain.title.startsWith("名") || pain.title.startsWith("情")) return result.timeline[1] ?? result.timeline[0];
  return result.timeline[0];
}

function buildTopEvidence(result: AnalysisResult, pain: AnalysisResult["painPoints"][number]): Array<{ title: string; text: string }> {
  const crossCheck = result.funnelAnalysis.ziweiStarNaming.crossChecks[0];
  const timeline = getPrimaryTimeline(result, pain);
  return [
    {
      title: "证据 1｜三才时间轴",
      text: `${timeline.title} 对应 ${timeline.ageRange}，系统把这一段视为你目前最需要确认的人生角色。${timeline.text}`
    },
    {
      title: "证据 2｜紫微主星与现用名",
      text: crossCheck
        ? `${crossCheck.triggerLabel}：${crossCheck.safeWarning}`
        : result.funnelAnalysis.ziweiStarNaming.mismatchWarning
    },
    {
      title: "证据 3｜名情财红绿灯",
      text: `${formatPainTitle(pain.title)} 目前是 ${trafficLight(pain.riskLevel).label}，系统评分 ${pain.score}/100。${pain.withheldHint}`
    }
  ];
}
