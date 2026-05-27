import type {
  AnalysisResult,
  CharacterAnalysis,
  ElementName,
  NameAnalysisInput,
  SectionReport,
  WhatsappSection
} from "@/types/analysis";

const elements: ElementName[] = ["木", "火", "土", "金", "水"];

const zodiacElementPreference: Record<string, ElementName[]> = {
  鼠: ["水", "金"],
  牛: ["土", "火"],
  虎: ["木", "水"],
  兔: ["木", "水"],
  龙: ["土", "水"],
  蛇: ["火", "木"],
  马: ["火", "木"],
  羊: ["土", "火"],
  猴: ["金", "水"],
  鸡: ["金", "土"],
  狗: ["土", "火"],
  猪: ["水", "木"]
};

const mockCharacterDb: Record<string, Omit<CharacterAnalysis, "position">> = {
  陈: {
    char: "陈",
    element: "火",
    strokes: 16,
    meaning: "带有承接家族、人脉与旧有基础的能量。",
    personalityImpact: "容易重情义，也比较在意稳定和被信任的感觉。",
    lifeStageImpact: "早年较容易受家庭环境影响，中后期会慢慢建立自己的位置。"
  },
  林: {
    char: "林",
    element: "木",
    strokes: 8,
    meaning: "有成长、扩展与贵人互动的气息。",
    personalityImpact: "思考细腻，适应力不弱，但有时会想太多。",
    lifeStageImpact: "人生阶段常见先累积、后开枝散叶的趋势。"
  },
  李: {
    char: "李",
    element: "木",
    strokes: 7,
    meaning: "木气带果，象征学习、成长和后期成果。",
    personalityImpact: "外柔内有主见，遇到压力时会先忍再行动。",
    lifeStageImpact: "适合在稳定环境中累积专业，越后期越看得见成果。"
  },
  王: {
    char: "王",
    element: "土",
    strokes: 4,
    meaning: "带有中心、秩序与承担位置的象。",
    personalityImpact: "责任感明显，容易把标准放在自己身上。",
    lifeStageImpact: "人生中常有被期待、被推到位置上承担的阶段。"
  },
  张: {
    char: "张",
    element: "火",
    strokes: 11,
    meaning: "带展开、表达与行动推动的能量。",
    personalityImpact: "反应快，有表现欲，也容易在压力下绷紧。",
    lifeStageImpact: "青年到中年阶段常有突破、转换和重新定位的机会。"
  },
  伟: {
    char: "伟",
    element: "土",
    strokes: 11,
    meaning: "有放大格局、建立成就与被看见的愿望。",
    personalityImpact: "对自己有要求，不太甘心只停留在普通状态。",
    lifeStageImpact: "事业阶段会比较重视成果与身份感，但需要时间发酵。"
  },
  强: {
    char: "强",
    element: "木",
    strokes: 12,
    meaning: "带韧性、竞争力与持续向上的能量。",
    personalityImpact: "不轻易认输，但内心有时会累积不说出口的压力。",
    lifeStageImpact: "遇到阻力后反而容易成长，只是过程不会太轻松。"
  },
  美: {
    char: "美",
    element: "土",
    strokes: 9,
    meaning: "重视和谐、形象与内在感受的能量。",
    personalityImpact: "对关系和氛围敏感，容易顾及别人的眼光。",
    lifeStageImpact: "感情与家庭阶段会成为人生中很重要的修炼点。"
  },
  慧: {
    char: "慧",
    element: "水",
    strokes: 15,
    meaning: "带智慧、觉察与心性细腻的气息。",
    personalityImpact: "想得深，感受力强，也容易把事情放在心里反复消化。",
    lifeStageImpact: "人生越经历越清醒，适合靠专业与洞察建立价值。"
  },
  欣: {
    char: "欣",
    element: "木",
    strokes: 8,
    meaning: "带舒展、喜悦与恢复力的能量。",
    personalityImpact: "外在亲和，内在仍需要被理解和被支持。",
    lifeStageImpact: "当环境给到空间时，运势会比被压着时更容易打开。"
  }
};

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pick<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

function getPosition(index: number): string {
  if (index === 0) return "姓氏";
  if (index === 1) return "名字第一字";
  if (index === 2) return "名字第二字";
  return "名字第三字";
}

function fallbackCharacter(char: string, seed: number): Omit<CharacterAnalysis, "position"> {
  const element = pick(elements, seed);
  const strokes = 8 + (seed % 11);
  const tone: Record<ElementName, string> = {
    木: "带有成长、学习与向外发展的气息。",
    火: "带有表达、行动与被看见的气息。",
    土: "带有稳定、责任与承接压力的气息。",
    金: "带有原则、判断与自我要求的气息。",
    水: "带有智慧、流动与情绪感受力的气息。"
  };

  return {
    char,
    element,
    strokes,
    meaning: tone[element],
    personalityImpact: "这个字显示你不是完全外放的人，很多判断会先在心里沉淀，再决定要不要表达。",
    lifeStageImpact: "它比较像一种慢慢累积后再打开的能量，需要结合完整姓名与生肖进一步确认。"
  };
}

function analyzeCharacters(name: string): CharacterAnalysis[] {
  return Array.from(name).map((char, index) => {
    const seed = stableHash(`${char}-${index}`);
    const base = mockCharacterDb[char] ?? fallbackCharacter(char, seed);
    return {
      ...base,
      position: getPosition(index)
    };
  });
}

function getElementCounts(chars: CharacterAnalysis[]): Record<ElementName, number> {
  return elements.reduce((acc, element) => {
    acc[element] = chars.filter((char) => char.element === element).length;
    return acc;
  }, {} as Record<ElementName, number>);
}

function buildScore(input: NameAnalysisInput, chars: CharacterAnalysis[]): number {
  const seed = stableHash(`${input.name}-${input.zodiac}-${input.focus}-${input.scriptType}`);
  const preferences = zodiacElementPreference[input.zodiac] ?? [];
  const matchBonus = chars.filter((char) => preferences.includes(char.element)).length * 3;
  const balanceBonus = new Set(chars.map((char) => char.element)).size * 2;
  return Math.min(88, Math.max(72, 72 + (seed % 11) + matchBonus + balanceBonus));
}

function getPatternName(chars: CharacterAnalysis[], score: number): string {
  const counts = getElementCounts(chars);
  const dominant = elements.reduce((top, element) => (counts[element] > counts[top] ? element : top), "木");

  if (score >= 84) return "稳中开运型";
  if (dominant === "土") return "责任成长型";
  if (dominant === "水") return "情感敏锐型";
  if (dominant === "火") return "稳中带冲型";
  if (dominant === "金") return "原则突破型";
  return "后期累积型";
}

function elementTone(element: ElementName): string {
  const tones: Record<ElementName, string> = {
    木: "成长感明显，适合靠学习、人脉与长期经营打开局面",
    火: "行动力和表达欲较强，但需要避免一时急切影响判断",
    土: "责任感重，能承接事情，但也容易把压力往自己身上放",
    金: "标准清楚，判断力强，只是关系里有时显得不容易示弱",
    水: "感受力和洞察力细腻，适合在变化中找到自己的节奏"
  };
  return tones[element];
}

function makeSectionReport(kind: "家庭" | "事业" | "爱情", dominant: ElementName, input: NameAnalysisInput): SectionReport {
  const focusHint = input.focus === kind || (kind === "事业" && input.focus === "财运")
    ? "你既然特别想看这一块，老师会建议把家人关系、目前处境和心里真正担心的点一起看，判断会更贴近你本人。"
    : "这里先给你一个方向，不急着下结论，真正细看时还要结合你的个人资料和现实处境。";

  if (kind === "家庭") {
    return {
      title: "家庭分析",
      overall: `家庭这边，名字里有${elementTone(dominant)}的底色。它不像很轻飘的名字，反而比较像心里会装事、也会替家里想的人。`,
      past: "过去的家庭能量比较像早熟与观察并存。你可能很早就懂得看气氛，知道什么时候该说、什么时候先忍着，所以有些委屈不一定会被家人马上看见。",
      present: "现在的你在家人面前，常常像一个稳定的人，可是稳定不代表不累。你会在意家人是否理解你，也会希望有些话不用讲得太明，别人就能懂。",
      future: "往后家庭关系不是没有转暖的空间，只是需要慢慢把边界讲清楚。你不需要一直用承担来证明自己，也可以学习把真正的感受说得柔和一点。",
      reminder: `老师温和提醒：这个名字的家庭信息有承担，也有需要被照顾的地方。${focusHint}如果你愿意，也可以把家庭这块发给老师，让老师帮你看哪一段能量比较重。`
    };
  }

  if (kind === "事业") {
    return {
      title: "事业分析",
      overall: `事业这边，这个名字带着${elementTone(dominant)}的趋势。它不是完全没有冲劲的名字，而是比较需要方向清楚，运势才不容易被分散。`,
      past: "过去事业或学习阶段，可能有过努力很多、但回报来得比较慢的感觉。你不是没能力，而是有时候机会、贵人或方向没有同时到位。",
      present: "现在比较适合先整理自己的专长和位置。与其什么都接、什么都试，不如看清楚哪一条路最能让你长期累积，也比较容易遇到真正帮得上忙的人。",
      future: "未来事业有慢慢被看见的机会，尤其当你愿意稳定在一个方向，把能力磨深，名字里的后期累积感会比较容易打开。",
      reminder: `老师温和提醒：事业和财运不是只看努力，也要看名字结构有没有让机会来得慢、贵人不稳或方向反复。${focusHint}这部分很适合进一步让老师细看。`
    };
  }

  return {
    title: "爱情分析",
    overall: `感情这边，你的名字呈现${elementTone(dominant)}的情绪模式。你不是那种完全随便投入的人，一旦认真，心会放得比较深。`,
    past: "过去感情里，可能有一段让你不容易完全放下的经验。也可能不是某一个人，而是一种期待落空、信任被消耗、心里很难再轻易打开的感觉。",
    present: "现在的你会观察对方是否稳定、是否真诚，也会在心里衡量这段关系值不值得继续投入。你看起来冷静，其实不是没有感觉，而是怕自己又放太深。",
    future: "未来感情要走得顺，重点不是急着遇到谁，而是先看懂自己真正需要的安全感。能让你安心的人，应该让你变柔软，而不是让你一直紧绷。",
    reminder: `老师温和提醒：感情不是只看桃花旺不旺，也要看名字里有没有压抑、反复或不容易表达的能量。${focusHint}如果这段话有说中一点点，可以让老师帮你看感情能量卡在哪里。`
  };
}

function buildWhatsappMessages(input: NameAnalysisInput, score: number): Record<WhatsappSection, string> {
  const sections: WhatsappSection[] = ["家庭", "事业", "爱情", "整体"];
  const sectionText: Record<WhatsappSection, string> = {
    家庭: "我想进一步了解家庭关系和名字里承担感比较重的地方。",
    事业: "我想进一步了解事业、财运和机会是不是被姓名结构影响。",
    爱情: "我想进一步了解感情模式、婚姻能量和名字里不容易放下的部分。",
    整体: "我想请老师整体看这个名字是否适合我继续使用。"
  };

  return sections.reduce((acc, section) => {
    acc[section] = [
      "老师你好，我刚刚做了姓名学初步分析。",
      `姓名：${input.name}`,
      `生肖：${input.zodiac}`,
      `系统评分：${score}/100`,
      `我想进一步了解：${section === "整体" ? input.focus || "整体" : section}`,
      sectionText[section],
      "系统提到我的名字可能有一些需要进一步确认的能量，我想知道这个名字是否适合我继续使用，以及有没有需要调整的地方。"
    ].join("\n");
    return acc;
  }, {} as Record<WhatsappSection, string>);
}

export function analyzeName(input: NameAnalysisInput): AnalysisResult {
  const normalizedInput = {
    ...input,
    name: input.name.trim(),
    focus: input.focus || "整体",
    gender: input.gender || "不透露"
  };
  const characters = analyzeCharacters(normalizedInput.name);
  const counts = getElementCounts(characters);
  const dominant = elements.reduce((top, element) => (counts[element] > counts[top] ? element : top), "木");
  const score = buildScore(normalizedInput, characters);
  const patternName = getPatternName(characters, score);

  const strengths = [
    dominant === "水" ? "感受力细腻，能察觉别人没说出口的情绪" : "责任感较强，遇到事情愿意先想办法承担",
    dominant === "火" ? "行动与表达能量明显，适合主动争取机会" : "有慢慢累积后被看见的潜力",
    "对关系、承诺与长期稳定有一定重视"
  ];

  const resistances = [
    "容易把压力放在心里，表面不一定让人看出来",
    dominant === "金" ? "有时标准太高，容易让自己或关系变紧" : "方向不清楚时，容易感觉努力被消耗",
    "名字里仍有部分能量需要结合生肖喜忌进一步确认"
  ];

  const confirmations = [
    "名字中的五行是否真的配合你的生肖",
    "事业与财运是否被姓名结构卡住",
    "感情或家庭模式是否需要通过名字能量调整"
  ];

  return {
    userInput: normalizedInput,
    score,
    patternName,
    overall: {
      opening:
        "我先温和地跟你说，名字不是简单分成好或不好。一个名字里面，会带着一个人的家庭根基、做事方式、感情模式，也会留下某些压力和转折的痕迹。下面这份是根据姓名结构与生肖做出的初步参考，你可以先当成老师陪你把名字慢慢拆开来看。",
      strengths,
      resistances,
      confirmations
    },
    characters,
    family: makeSectionReport("家庭", dominant, normalizedInput),
    career: makeSectionReport("事业", dominant, normalizedInput),
    love: makeSectionReport("爱情", dominant, normalizedInput),
    pastTrace:
      "从你的姓名结构来看，过去的路可能不是完全轻松的。这个名字里面有一种早熟、承担、先压住自己再慢慢突破的气场。某个阶段，你可能经历过比较明显的失落、分离感、家庭压力、人际伤害、事业低谷，或一些心里很难对别人说出口的事情。这里不能直接断定具体事件，但如果你读到这里有一点被说中的感觉，这部分能量就很值得进一步确认。",
    summary:
      "综合来看，你的名字里面最明显的不是没运，而是压力感比较重。家庭方面容易承担，事业方面想突破，感情方面又不太容易真正放下。这三件事有一个共同点：你常常不是没有路，而是心里背着太多东西。名字如果能被更细地看见，也许你会更清楚自己到底卡在哪里。",
    deeperQuestions: confirmations,
    whatsappMessages: buildWhatsappMessages(normalizedInput, score)
  };
}

export function validateChineseName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "请先输入你的中文姓名。";
  if (!/^[\u3400-\u9FFF]+$/.test(trimmed)) return "请先输入中文姓名，系统才能准确拆字分析。";
  if (Array.from(trimmed).length < 2) return "姓名至少需要 2 个中文字，老师才能看出完整结构。";
  if (Array.from(trimmed).length > 4) return "第一版系统先支持 2 至 4 个中文字的姓名分析。";
  return null;
}
