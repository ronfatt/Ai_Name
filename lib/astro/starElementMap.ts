import type { ElementName } from "@/types/analysis";

export const elements: ElementName[] = ["木", "火", "土", "金", "水"];

export const stemElements: Record<string, ElementName> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水"
};

export const branchElements: Record<string, ElementName> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水"
};

export const starElements: Record<string, ElementName[]> = {
  紫微: ["土"],
  天机: ["木"],
  太阳: ["火"],
  武曲: ["金"],
  天同: ["水"],
  廉贞: ["火"],
  天府: ["土"],
  太阴: ["水"],
  贪狼: ["水", "木"],
  巨门: ["水"],
  天相: ["水"],
  天梁: ["土"],
  七杀: ["金"],
  破军: ["水"]
};

export function inferPalaceElement(stem: string, branch: string, stars: string[]): ElementName {
  const starVotes = stars.flatMap((star) => starElements[star] ?? []);
  if (starVotes.length > 0) return mostCommonElement(starVotes);
  return branchElements[branch] ?? stemElements[stem] ?? "土";
}

export function mostCommonElement(values: ElementName[]): ElementName {
  return elements.reduce((top, element) => (
    values.filter((value) => value === element).length > values.filter((value) => value === top).length ? element : top
  ), values[0] ?? "土");
}

export function relationScore(source: ElementName, target: ElementName): { score: number; text: string; type: "same" | "generate" | "be-generated" | "control" | "be-controlled" | "neutral" } {
  const generates: Record<ElementName, ElementName> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  const controls: Record<ElementName, ElementName> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

  if (source === target) return { score: 15, type: "same", text: "两边同气，代表名字能量和该宫位方向比较容易集中。" };
  if (generates[source] === target) return { score: 10, type: "generate", text: "姓名五行有生扶宫位主气的意思，初步看是加分的配合。" };
  if (generates[target] === source) return { score: 4, type: "be-generated", text: "宫位主气去生姓名五行，表示本人容易把力气投入这个方向，需要留意消耗感。" };
  if (controls[source] === target) return { score: -20, type: "control", text: "姓名五行对该宫位有克制感，不代表一定不好，但要提醒老师进一步确认是否形成卡点。" };
  if (controls[target] === source) return { score: -8, type: "be-controlled", text: "宫位主气压住姓名五行，比较像外界要求较重，需要看现实处境是否呼应。" };
  return { score: 0, type: "neutral", text: "五行关系较平，先看主星组合与四化。" };
}
