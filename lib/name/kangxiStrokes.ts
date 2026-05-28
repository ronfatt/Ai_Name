import type { CharacterAnalysis, ElementName } from "@/types/analysis";

const elements: ElementName[] = ["木", "火", "土", "金", "水"];

export const kangxiStrokeDb: Record<string, { strokes: number; element: ElementName; meaning: string }> = {
  陈: { strokes: 16, element: "火", meaning: "带有承接家族、人脉与旧有基础的能量。" },
  陳: { strokes: 16, element: "火", meaning: "带有承接家族、人脉与旧有基础的能量。" },
  林: { strokes: 8, element: "木", meaning: "有成长、扩展与贵人互动的气息。" },
  李: { strokes: 7, element: "木", meaning: "木气带果，象征学习、成长和后期成果。" },
  王: { strokes: 4, element: "土", meaning: "带有中心、秩序与承担位置的象。" },
  张: { strokes: 11, element: "火", meaning: "带展开、表达与行动推动的能量。" },
  張: { strokes: 11, element: "火", meaning: "带展开、表达与行动推动的能量。" },
  伟: { strokes: 11, element: "土", meaning: "有放大格局、建立成就与被看见的愿望。" },
  偉: { strokes: 11, element: "土", meaning: "有放大格局、建立成就与被看见的愿望。" },
  强: { strokes: 12, element: "木", meaning: "带韧性、竞争力与持续向上的能量。" },
  強: { strokes: 12, element: "木", meaning: "带韧性、竞争力与持续向上的能量。" },
  美: { strokes: 9, element: "土", meaning: "重视和谐、形象与内在感受的能量。" },
  慧: { strokes: 15, element: "水", meaning: "带智慧、觉察与心性细腻的气息。" },
  欣: { strokes: 8, element: "木", meaning: "带舒展、喜悦与恢复力的能量。" }
};

export function getKangxiStroke(char: string): { strokes: number; element: ElementName; meaning: string } {
  return kangxiStrokeDb[char] ?? fallbackStroke(char);
}

export function characterToAnalysis(char: string, position: string, seed: number): CharacterAnalysis {
  const kangxi = getKangxiStroke(char);
  return {
    char,
    position,
    element: kangxi.element,
    strokes: kangxi.strokes,
    meaning: kangxi.meaning,
    personalityImpact: `${char}字五行取${kangxi.element}，会影响一个人面对压力、关系和选择时的表达方式。`,
    lifeStageImpact: `${position}位置先看它在姓名结构里的作用，仍需结合完整姓名与命盘一起判断。`
  };
}

function fallbackStroke(char: string): { strokes: number; element: ElementName; meaning: string } {
  const seed = stableHash(char);
  return {
    strokes: 8 + (seed % 11),
    element: elements[seed % elements.length],
    meaning: "此字暂未收录在第一版康熙字库，先以稳定 fallback 笔画和五行做初步参考。"
  };
}

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}
