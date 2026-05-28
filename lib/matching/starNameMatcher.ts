import type { FiveGridAnalysis, MatchingRuleResult, ZiweiChart, ZiweiNameMatch } from "@/types/analysis";
import { elements, relationScore } from "@/lib/astro/starElementMap";
import { getKnowledgeText } from "@/lib/matching/knowledgeBase";

export function matchNameWithZiwei({ chart, name }: { chart: ZiweiChart; name: FiveGridAnalysis }): ZiweiNameMatch {
  const palaceElements = {
    命宫: chart.keyPalaces.life.element,
    迁移宫: chart.keyPalaces.migration.element,
    官禄宫: chart.keyPalaces.career.element,
    财帛宫: chart.keyPalaces.wealth.element
  };
  const counts = elements.reduce((acc, element) => {
    acc[element] = Object.values(palaceElements).filter((item) => item === element).length;
    return acc;
  }, {} as Record<(typeof elements)[number], number>);
  const missingElements = elements.filter((element) => counts[element] === 0);
  const rules = [
    compare("命宫", chart.keyPalaces.life, "人格", name.personalityElement),
    compare("迁移宫", chart.keyPalaces.migration, "外格", name.outerGridElement, 12),
    compare("官禄宫", chart.keyPalaces.career, "人格", name.personalityElement),
    compare("财帛宫", chart.keyPalaces.wealth, "总格", name.totalGridElement)
  ];
  const missingBonus = missingElements.includes(name.personalityElement) ? 20 : 0;
  const scoreDelta = rules.reduce((sum, rule) => sum + rule.scoreDelta, missingBonus);
  const missingRule: MatchingRuleResult[] = missingBonus
    ? [{
        key: `missing-${name.personalityElement}`,
        title: `姓名补入命盘少见的${name.personalityElement}气`,
        scoreDelta: missingBonus,
        text: `四个核心宫位里${name.personalityElement}气不明显，而姓名人格刚好属${name.personalityElement}，初步看有补位作用，但仍需结合全盘确认。`
      }]
    : [];

  return {
    primaryLogic: "命宫 / 迁移宫 / 官禄宫 / 财帛宫 × 五格五行",
    nameGridElement: name.personalityElement,
    missingElements,
    palaceElements,
    scoreDelta,
    rules: [...missingRule, ...rules],
    summary: `这一版主逻辑已改为紫微斗数核心宫位对照姓名五格。人格看命宫与官禄，外格看迁移和人际，地格看家庭感情基础，总格看后劲与财帛走势；生肖姓名学只保留为辅助参考。`
  };
}

function compare(
  palaceLabel: "命宫" | "迁移宫" | "官禄宫" | "财帛宫",
  palace: ZiweiChart["keyPalaces"]["life"],
  gridLabel: "人格" | "外格" | "总格",
  gridElement: FiveGridAnalysis["corePersonalityElement"],
  sameBonus = 15
): MatchingRuleResult {
  const mainStar = palace.majorStars[0] ?? "空宫";
  const relation = relationScore(gridElement, palace.element);
  const adjustedScore = relation.type === "same" ? sameBonus : relation.score;
  const key = `${palaceLabel}_${mainStar}_${gridLabel}${gridElement}`;
  const fallback = `${palaceLabel}主星参考「${palace.majorStars.join("、") || "空宫借对宫"}」，宫位五行取${palace.element}；姓名${gridLabel}属${gridElement}，${relation.text}`;

  return {
    key,
    title: `${palaceLabel} × ${gridLabel}${gridElement}`,
    scoreDelta: adjustedScore,
    text: getKnowledgeText(key, fallback)
  };
}
