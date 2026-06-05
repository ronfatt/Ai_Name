import {
  annualLuckRules,
  authorityCases,
  conversionTagRules,
  energyRadarRules,
  funnelFeatures,
  leadRecoveryRules,
  reportProducts,
  sharePosterTemplates,
  viralUnlockRules
} from "@/lib/database/funnelDatabase";
import { getZiweiNameCrossCheckRules, getZiweiStarNamingDirection } from "@/lib/database/ziweiStarNaming";
import type { ZiweiNameCrossCheckRuleRecord, ZiweiStarNamingDirectionRecord } from "@/lib/database/schema";
import type { AnalysisResult, ConversionTags, ElementName, FunnelAnalysis, PainPointReport } from "@/types/analysis";

const elements: ElementName[] = ["金", "木", "水", "火", "土"];

export function buildLeadFunnelAnalysis(result: Omit<AnalysisResult, "funnelAnalysis">): FunnelAnalysis {
  const energyRadar = buildEnergyRadar(result);
  const conversionTags = buildConversionTags(result.painPoints);
  const authorityProof = matchAuthorityCase(conversionTags);
  const annualWarning = buildAnnualWarning(result, energyRadar.weakestElement);
  const sharePoster = buildSharePoster(result, conversionTags);
  const ziweiStarNaming = buildZiweiStarNaming(result);
  const reportOffers = buildReportOffers(result, conversionTags);
  const viralUnlock = buildViralUnlock(result, conversionTags);
  const leadRecovery = leadRecoveryRules[0];

  return {
    featureFlags: funnelFeatures.reduce((acc, feature) => {
      acc[feature.key] = feature.enabled;
      return acc;
    }, {} as FunnelAnalysis["featureFlags"]),
    energyRadar,
    annualWarning,
    authorityProof,
    sharePoster,
    ziweiStarNaming,
    conversionTags,
    reportOffers,
    viralUnlock,
    partnerCompatibility: {
      enabled: isFeatureEnabled("partnerTest"),
      title: "想看两个人的名字合不合？",
      text:
        "下一版可加入另一半、合伙人或家人的姓名，初步看两个人的五行是否互相扶持，还是容易在感情、合作或财务节奏上互相消耗。"
    },
    leadRecovery: {
      enabled: leadRecovery?.enabled ?? true,
      trigger: leadRecovery?.trigger ?? "partial_form",
      localStorageKey: leadRecovery?.storageKey ?? "ai-name-analysis:partial-lead",
      text:
        leadRecovery?.messageTemplate ??
        "如果你暂时还没看完报告，可以先留下 WhatsApp，老师稍后从你分数较低的方向帮你确认。"
    }
  };
}

function buildViralUnlock(
  result: Omit<AnalysisResult, "funnelAnalysis">,
  conversionTags: ConversionTags
): FunnelAnalysis["viralUnlock"] {
  const rule = viralUnlockRules[0];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-name-rust.vercel.app";
  const shareUrl = `${siteUrl}?ref=${encodeURIComponent(result.userInput.name)}&pain=${encodeURIComponent(conversionTags.primaryPain)}`;
  const shareText = rule.facebookTextTemplates[result.score % rule.facebookTextTemplates.length];
  const message = [
    "Master Easy 你好，我已经分享 Facebook 姓名检测贴文。",
    `姓名：${result.userInput.name}`,
    `系统评分：${result.score}/100`,
    `优先痛点：${conversionTags.primaryPain}`,
    `系统标签：${conversionTags.tags.join("、")}`,
    `暗号：${rule.unlockCode}`,
    rule.whatsappIntent
  ].join("\n");

  return {
    title: rule.title,
    subtitle: rule.subtitle,
    lockedModules: rule.lockedModules,
    facebookShareText: `${shareText}\n${shareUrl}`,
    shareUrl,
    unlockCode: rule.unlockCode,
    storageKey: `${rule.storageKey}:${result.userInput.name}`,
    whatsappMessage: message
  };
}

function buildReportOffers(
  result: Omit<AnalysisResult, "funnelAnalysis">,
  conversionTags: ConversionTags
): FunnelAnalysis["reportOffers"] {
  const free = reportProducts.find((product) => product.tier === "free") ?? reportProducts[0];
  const paid = reportProducts.find((product) => product.tier === "paid") ?? reportProducts[1];
  const baseLines = [
    "Master Easy 你好，我刚完成 AI 紫微姓名学初步检测。",
    `姓名：${result.userInput.name}`,
    `生肖：${result.userInput.zodiac}`,
    `系统评分：${result.score}/100`,
    `优先痛点：${conversionTags.primaryPain}`,
    `系统标签：${conversionTags.tags.join("、")}`
  ];

  return {
    selectedTier: result.userInput.reportTier ?? "free",
    free: {
      ...free,
      whatsappMessage: [...baseLines, free.whatsappIntent].join("\n")
    },
    paid: {
      ...paid,
      whatsappMessage: [...baseLines, paid.whatsappIntent, "暗号：15页完整报告"].join("\n")
    },
    upgradeReason:
      `免费版只会展示最明显的${conversionTags.primaryPain}卡点；完整 15 页报告会进一步拆解命宫、迁移宫、三才时间轴、生肖字根、字音字形与流年提醒。`
  };
}

function buildZiweiStarNaming(result: Omit<AnalysisResult, "funnelAnalysis">): FunnelAnalysis["ziweiStarNaming"] {
  const lifeStar = result.ziweiChart.keyPalaces.life.majorStars[0] ?? "空宫";
  const migrationStar = result.ziweiChart.keyPalaces.migration.majorStars[0] ?? "空宫";
  const lifeDirection = getZiweiStarNamingDirection(lifeStar);
  const migrationDirection = getZiweiStarNamingDirection(migrationStar);
  const nameElement = result.fiveGrid.corePersonalityElement;
  const palaceElement = result.ziweiChart.keyPalaces.life.element;
  const isElementAligned = nameElement === palaceElement || result.ziweiNameMatch.scoreDelta > 0;

  return {
    lifeStar,
    migrationStar,
    lifeArchetype: lifeDirection.archetype,
    migrationArchetype: migrationDirection.archetype,
    nameDirection: `命宫「${lifeStar}」偏${lifeDirection.archetype}，名字方向宜走「${lifeDirection.nameDirection}」`,
    personalBrandDirection: `迁移宫「${migrationStar}」代表对外形象，适合呈现「${migrationDirection.personalBrandDirection}」`,
    mismatchWarning: isElementAligned
      ? `${lifeDirection.safePublicText}目前姓名人格与命宫五行初步有可用之处，但是否真正放大主星，需要结合四化和出生时辰进一步确认。`
      : `${lifeDirection.mismatchPain} 你的姓名人格属${nameElement}，命宫主气偏${palaceElement}，两者若有摩擦，容易让名字和个人天命气质之间出现落差。`,
    exampleChars: Array.from(new Set([...lifeDirection.exampleChars, ...migrationDirection.exampleChars])).slice(0, 8),
    crossChecks: buildZiweiNameCrossChecks(result, [lifeDirection.archetype, migrationDirection.archetype], [lifeStar, migrationStar]),
    cta: migrationDirection.ctaAngle
  };
}

function buildZiweiNameCrossChecks(
  result: Omit<AnalysisResult, "funnelAnalysis">,
  archetypes: Array<ZiweiStarNamingDirectionRecord["archetype"]>,
  stars: string[]
): FunnelAnalysis["ziweiStarNaming"]["crossChecks"] {
  const rules = Array.from(new Set(archetypes)).flatMap((archetype) => getZiweiNameCrossCheckRules(archetype));
  const matched = rules.flatMap((rule) => matchCrossCheckRule(result, stars, rule));

  if (matched.length > 0) return matched.slice(0, 3);

  return [
    {
      triggerLabel: "主星与现用名未见明显错位",
      affectedArea: "整体",
      scoreDelta: 0,
      reason: "命宫与迁移宫的主星气质，暂时没有和姓名主要五行形成明显反向提醒。",
      safeWarning: "这不代表名字已经完整适配，只代表免费版没有看到最突出的错位点，仍需结合四化、八字喜用与完整姓名细看。",
      ctaAngle: "适合让老师进一步确认主星气质是否真正被名字放大。"
    }
  ];
}

function matchCrossCheckRule(
  result: Omit<AnalysisResult, "funnelAnalysis">,
  stars: string[],
  rule: ZiweiNameCrossCheckRuleRecord
): FunnelAnalysis["ziweiStarNaming"]["crossChecks"] {
  if (rule.stars && !rule.stars.some((star) => stars.includes(star))) return [];

  const candidates = result.characters.filter((character) => rule.namePosition === "任意" || character.position === rule.namePosition);
  const matchedCharacters = candidates.filter((character) => (
    rule.avoidElements.includes(character.element) ||
    rule.avoidMeaningTags.some((tag) => `${character.meaning}${character.personalityImpact}${character.lifeStageImpact}`.includes(tag))
  ));

  if (matchedCharacters.length === 0) return [];

  return [
    {
      triggerLabel: rule.triggerLabel,
      affectedArea: rule.affectedArea,
      scoreDelta: rule.scoreDelta,
      reason: `系统在${matchedCharacters.map((item) => `${item.position}「${item.char}」${item.element}气`).join("、")}看到与${rule.archetype}主星方向需要复核的讯号。`,
      safeWarning: rule.safeWarning,
      ctaAngle: rule.ctaAngle
    }
  ];
}

function buildEnergyRadar(result: Omit<AnalysisResult, "funnelAnalysis">): FunnelAnalysis["energyRadar"] {
  const charCounts = elements.reduce((acc, element) => {
    acc[element] = result.characters.filter((character) => character.element === element).length;
    return acc;
  }, {} as Record<ElementName, number>);

  const gridElements = result.fiveGrid.grids.map((grid) => grid.element);
  const palaceElements = Object.values(result.ziweiNameMatch.palaceElements);
  const scores = elements.reduce((acc, element) => {
    const characterScore = (charCounts[element] ?? 0) * 18;
    const gridScore = gridElements.filter((item) => item === element).length * 7;
    const palaceNeedScore = result.ziweiNameMatch.missingElements.includes(element) ? -8 : 4;
    const palaceScore = palaceElements.filter((item) => item === element).length * 5;
    acc[element] = clamp(34 + characterScore + gridScore + palaceScore + palaceNeedScore, 18, 92);
    return acc;
  }, {} as Record<ElementName, number>);

  const weakestElement = elements.reduce((weakest, element) => (scores[element] < scores[weakest] ? element : weakest), elements[0]);
  const strongestElement = elements.reduce((strongest, element) => (scores[element] > scores[strongest] ? element : strongest), elements[0]);
  const weakestRule = energyRadarRules.find((rule) => rule.element === weakestElement);
  const strongestRule = energyRadarRules.find((rule) => rule.element === strongestElement);

  return {
    points: energyRadarRules.map((rule) => ({
      element: rule.element,
      score: scores[rule.element],
      label: rule.businessLabel
    })),
    weakestElement,
    strongestElement,
    insight: `五行雷达里，${strongestElement}气较明显，${weakestElement}气相对不足。${strongestRule?.highText ?? ""}${weakestRule?.lowText ?? ""}这只是姓名与命盘的初步视觉化，不代表绝对结论。`
  };
}

function buildAnnualWarning(result: Omit<AnalysisResult, "funnelAnalysis">, weakestElement: ElementName): FunnelAnalysis["annualWarning"] {
  const currentYear = new Date().getFullYear();
  const rule = annualLuckRules.find((item) => item.year === currentYear) ?? annualLuckRules[0];
  const touchedByName = result.characters.some((character) =>
    rule.cautionRoots.some((root) => character.char.includes(root) || character.meaning.includes(root))
  );
  const elementTouched = weakestElement === rule.element || result.characters.some((character) => character.element === rule.element);
  const urgency: FunnelAnalysis["annualWarning"]["urgency"] = touchedByName && elementTouched ? "高" : touchedByName || elementTouched ? "中" : "低";

  return {
    year: rule.year,
    stemBranch: rule.stemBranch,
    zodiac: rule.zodiac,
    title: rule.title,
    urgency,
    text:
      urgency === "高"
        ? `${rule.textTemplate}你的名字里刚好有流年容易触动的五行或字根，所以今年的事业表达、财务流动和感情沟通更适合让老师复核。`
        : rule.textTemplate
  };
}

function buildConversionTags(painPoints: PainPointReport[]): ConversionTags {
  const lowest = [...painPoints].sort((a, b) => a.score - b.score)[0];
  const type = lowest ? painTitleToType(lowest.title) : "整体";
  const rule = conversionTagRules.find((item) => item.painType === type) ?? conversionTagRules.find((item) => item.painType === "整体")!;

  return {
    primaryPain: rule.painType,
    lowestPainScore: lowest?.score ?? 72,
    tags: rule.tags,
    whatsappIntent: rule.whatsappIntent
  };
}

function matchAuthorityCase(conversionTags: ConversionTags): FunnelAnalysis["authorityProof"] {
  const matched =
    authorityCases.find((item) => item.painType === conversionTags.primaryPain) ??
    authorityCases.find((item) => item.painType === "整体") ??
    authorityCases[0];

  return {
    caseId: matched.caseId,
    painType: matched.painType,
    title: matched.title,
    text: matched.anonymizedText,
    ctaAngle: matched.ctaAngle
  };
}

function buildSharePoster(result: Omit<AnalysisResult, "funnelAnalysis">, conversionTags: ConversionTags): FunnelAnalysis["sharePoster"] {
  const template = sharePosterTemplates[0];
  const quote = template.quoteTemplates[result.score % template.quoteTemplates.length];

  return {
    headline: template.headlineTemplate.replace("{name}", result.userInput.name),
    scoreLine: `${result.score}/100 · ${result.patternName}`,
    quote,
    qrPayload: `name=${encodeURIComponent(result.userInput.name)}&pain=${encodeURIComponent(conversionTags.primaryPain)}`,
    visualStyle: template.visualStyle
  };
}

function painTitleToType(title: PainPointReport["title"]): ConversionTags["primaryPain"] {
  if (title.startsWith("名")) return "事业";
  if (title.startsWith("情")) return "感情";
  if (title.startsWith("财")) return "财运";
  return "整体";
}

function isFeatureEnabled(key: keyof FunnelAnalysis["featureFlags"]): boolean {
  return Boolean(funnelFeatures.find((feature) => feature.key === key)?.enabled);
}

function clamp(value: number, min: number, max: number): number {
  return Math.round(Math.min(max, Math.max(min, value)));
}
