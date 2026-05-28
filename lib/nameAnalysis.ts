import type {
  AnalysisResult,
  CharacterAnalysis,
  ElementName,
  NameAnalysisInput,
  SectionReport,
  WhatsappSection,
  ZodiacCharacterMatch,
  ZodiacNameAnalysis
} from "@/types/analysis";
import { buildMetaphysicsProfile } from "@/lib/metaphysicsEngine";

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

const zodiacMeta: Record<string, { branch: string; element: ElementName; nature: string; favorableRoots: string[] }> = {
  鼠: { branch: "子", element: "水", nature: "机敏、观察力强，重视安全感和流动空间", favorableRoots: ["子", "水", "氵", "冫", "北", "冬", "一", "口", "宀", "金"] },
  牛: { branch: "丑", element: "土", nature: "稳重、耐力强，适合踏实累积与被信任的位置", favorableRoots: ["丑", "牜", "生", "力", "工", "田", "禾", "米", "宀", "艹"] },
  虎: { branch: "寅", element: "木", nature: "有胆识与开创感，适合山林舒展和被尊重的空间", favorableRoots: ["寅", "虍", "山", "丘", "林", "木", "心", "月", "王", "衣"] },
  兔: { branch: "卯", element: "木", nature: "细腻、重情感与安全感，适合温和成长的环境", favorableRoots: ["卯", "木", "林", "青", "东", "春", "月", "口", "田", "艹"] },
  龙: { branch: "辰", element: "土", nature: "格局感强，重视舞台、气势与被看见的位置", favorableRoots: ["辰", "雨", "云", "日", "月", "星", "王", "玉", "言", "贝"] },
  蛇: { branch: "巳", element: "火", nature: "直觉敏锐，适合安静布局、慢慢积蓄能量", favorableRoots: ["巳", "虫", "弓", "之", "辶", "口", "宀", "艹", "木", "火"] },
  马: { branch: "午", element: "火", nature: "行动力强，适合开阔、速度感和被鼓励的空间", favorableRoots: ["午", "火", "灬", "竹", "南", "红", "艹", "木", "王", "日"] },
  羊: { branch: "未", element: "土", nature: "温和、有审美与照顾心，适合稳定和被善待的环境", favorableRoots: ["未", "羊", "美", "朱", "幸", "孝", "艹", "田", "禾", "米"] },
  猴: { branch: "申", element: "金", nature: "灵活、反应快，适合变化中找机会和贵人互动", favorableRoots: ["申", "侯", "示", "礻", "福", "礼", "九", "口", "宀", "水"] },
  鸡: { branch: "酉", element: "金", nature: "重秩序、表达与被认可，适合有规矩也有舞台的位置", favorableRoots: ["酉", "金", "西", "白", "羽", "鸟", "飞", "口", "田", "米"] },
  狗: { branch: "戌", element: "土", nature: "忠诚、有守护感，适合责任清楚和被信任的关系", favorableRoots: ["戌", "犬", "犭", "忠", "心", "月", "宀", "人", "艹", "日"] },
  猪: { branch: "亥", element: "水", nature: "重感受、福气与包容，适合安稳、被接纳的生活节奏", favorableRoots: ["亥", "豕", "象", "众", "水", "氵", "冫", "木", "口", "田"] }
};

const generates: Record<ElementName, ElementName> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木"
};

const controls: Record<ElementName, ElementName> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木"
};

const sanHeGroups = [
  ["猴", "鼠", "龙"],
  ["虎", "马", "狗"],
  ["猪", "兔", "羊"],
  ["蛇", "鸡", "牛"]
];

const liuHePairs = [
  ["鼠", "牛"],
  ["虎", "猪"],
  ["兔", "狗"],
  ["龙", "鸡"],
  ["蛇", "猴"],
  ["马", "羊"]
];

const clashPairs = [
  ["鼠", "马"],
  ["牛", "羊"],
  ["虎", "猴"],
  ["兔", "鸡"],
  ["龙", "狗"],
  ["蛇", "猪"]
];

const harmPairs = [
  ["鼠", "羊"],
  ["牛", "马"],
  ["虎", "蛇"],
  ["兔", "龙"],
  ["猴", "猪"],
  ["鸡", "狗"]
];

const breakPairs = [
  ["鼠", "鸡"],
  ["牛", "龙"],
  ["虎", "猪"],
  ["兔", "马"],
  ["蛇", "猴"],
  ["羊", "狗"]
];

const punishGroups = [
  ["鼠", "兔"],
  ["牛", "羊", "狗"],
  ["虎", "蛇", "猴"],
  ["龙"],
  ["马"],
  ["鸡"],
  ["猪"]
];

const commonCharacterRoots: Record<string, string[]> = {
  冯: ["冫", "马"],
  馮: ["馬", "冫"],
  新: ["斤", "木", "亲"],
  發: ["弓", "癶"],
  发: ["弓"],
  陈: ["阝", "东"],
  陳: ["阝", "東"],
  伟: ["人", "韦"],
  偉: ["人", "韋"],
  强: ["弓", "虫"],
  強: ["弓", "虫"],
  林: ["木"],
  李: ["木", "子"],
  王: ["王"],
  张: ["弓", "长"],
  張: ["弓", "長"],
  美: ["羊"],
  慧: ["心"],
  欣: ["欠", "斤"]
};

const rootZodiacMap: Record<string, string> = {
  子: "鼠",
  鼠: "鼠",
  丑: "牛",
  牛: "牛",
  牜: "牛",
  寅: "虎",
  虎: "虎",
  虍: "虎",
  卯: "兔",
  兔: "兔",
  辰: "龙",
  龙: "龙",
  龍: "龙",
  巳: "蛇",
  蛇: "蛇",
  虫: "蛇",
  午: "马",
  马: "马",
  馬: "马",
  未: "羊",
  羊: "羊",
  申: "猴",
  猴: "猴",
  侯: "猴",
  酉: "鸡",
  鸡: "鸡",
  鳥: "鸡",
  鸟: "鸡",
  羽: "鸡",
  戌: "狗",
  狗: "狗",
  犬: "狗",
  犭: "狗",
  亥: "猪",
  猪: "猪",
  豬: "猪",
  豕: "猪"
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

function fallbackCharacter(char: string, seed: number, position: string): Omit<CharacterAnalysis, "position"> {
  const element = pick(elements, seed);
  const strokes = 8 + (seed % 11);
  const tone: Record<ElementName, string> = {
    木: "带有成长、学习与向外发展的气息。",
    火: "带有表达、行动与被看见的气息。",
    土: "带有稳定、责任与承接压力的气息。",
    金: "带有原则、判断与自我要求的气息。",
    水: "带有智慧、流动与情绪感受力的气息。"
  };
  const personalityByElement: Record<ElementName, string[]> = {
    木: [
      "这个字让性格里多了一份想成长、想突破的劲，遇到问题时不太愿意一直停在原地。",
      "它会让人比较重视学习和方向感，心里有目标时，行动会比别人想象中更坚持。",
      "这个字的木气带一点向外舒展的力量，适合靠经验、人脉和长期经营慢慢打开局面。"
    ],
    火: [
      "这个字会加强表达和行动的欲望，心里一旦有想法，就不太喜欢被拖太久。",
      "它让性格里多了一点被看见的需要，适合在合适的舞台上发挥，但急的时候要留意语气。",
      "这个字的火气比较像推动力，能带来热情，也会让情绪反应比表面看起来更快。"
    ],
    土: [
      "这个字让你比较重视稳定和承诺，很多时候会先考虑责任，再考虑自己的轻松。",
      "它带有承接压力的气场，容易让人觉得你可靠，但也可能让你习惯把事情扛下来。",
      "这个字的土气偏稳，做事不一定快，却比较在意结果是否扎实、关系是否长久。"
    ],
    金: [
      "这个字让判断力和原则感比较明显，不喜欢太含糊的关系和没有标准的安排。",
      "它会让性格里多一点自我要求，遇到不合理的事情，心里其实很难完全放下。",
      "这个字的金气偏收敛，表面可以冷静，但内在对对错、承诺和边界会看得比较清楚。"
    ],
    水: [
      "这个字让感受力更细，很多事你不是没看见，而是会先放在心里慢慢消化。",
      "它会让人比较会观察情绪和气氛，适合靠智慧、沟通和弹性去处理复杂关系。",
      "这个字的水气带流动感，想法不死板，但心里也容易因为想太多而迟迟不说。"
    ]
  };
  const stageByPosition: Record<string, string[]> = {
    姓氏: [
      "放在姓氏位置时，它比较像家庭根基和早年环境的底色，会影响你怎么看待安全感与归属感。",
      "作为姓氏，它先代表原生家庭给你的气场，容易反映早年被期待、被影响或被牵动的部分。",
      "在姓氏位置，这个字更多看根基，不是单看个人选择，而是看你从家庭系统里带出来的习惯。"
    ],
    名字第一字: [
      "放在名字第一字时，它会影响你对外做事的方式，尤其是事业方向、行动节奏和别人对你的第一印象。",
      "作为名字第一字，它比较像你走出去面对世界时的能量，关系到表现力、目标感和贵人互动。",
      "在名字第一字的位置，它会先影响青年到中年前期的推进方式，看你如何争取机会和建立位置。"
    ],
    名字第二字: [
      "放在名字第二字时，它更靠近内在心性和后期运势，常常反映你真正放不下、也真正想完成的部分。",
      "作为名字第二字，它会影响关系里的细腻度与中后期累积，越到后面越能看出这个字的力量。",
      "在名字第二字的位置，它比较像人生后劲，提醒你不要只看眼前顺不顺，也要看长期是否能沉淀成果。"
    ],
    名字第三字: [
      "放在名字第三字时，它会加强后期延伸的能量，比较看晚些阶段的选择、关系和心境变化。",
      "作为名字第三字，它常常代表尾劲和收成，提醒你留意长期关系与后期方向是否稳定。",
      "在名字第三字的位置，它比较像人生后段的回响，需要结合前面两个字一起看整体节奏。"
    ]
  };
  const strokeTone =
    strokes <= 10
      ? "笔画偏轻，能量来得较快，优点是反应灵活，提醒是不要太快下判断。"
      : strokes <= 14
        ? "笔画中等，能量较容易平衡，适合靠稳定选择慢慢累积。"
        : "笔画偏重，能量承载感较强，往往代表责任、压力或后期成果都比较明显。";
  const positionSeed = stableHash(`${char}-${position}-${strokes}`);

  return {
    char,
    element,
    strokes,
    meaning: `${tone[element]}${strokeTone}`,
    personalityImpact: pick(personalityByElement[element], positionSeed),
    lifeStageImpact: pick(stageByPosition[position] ?? stageByPosition.名字第二字, positionSeed + seed)
  };
}

function analyzeCharacters(name: string): CharacterAnalysis[] {
  return Array.from(name).map((char, index) => {
    const seed = stableHash(`${char}-${index}`);
    const position = getPosition(index);
    const base = mockCharacterDb[char] ?? fallbackCharacter(char, seed, position);
    return {
      ...base,
      position
    };
  });
}

function getElementCounts(chars: CharacterAnalysis[]): Record<ElementName, number> {
  return elements.reduce((acc, element) => {
    acc[element] = chars.filter((char) => char.element === element).length;
    return acc;
  }, {} as Record<ElementName, number>);
}

function getDominantElement(chars: CharacterAnalysis[]): ElementName {
  const counts = getElementCounts(chars);
  return elements.reduce((top, element) => (counts[element] > counts[top] ? element : top), "木");
}

function relationBetweenNameAndZodiac(nameElement: ElementName, zodiacElement: ElementName): { label: string; tone: string; bonus: number } {
  if (generates[nameElement] === zodiacElement) {
    return {
      label: "姓名生生肖",
      tone: "名字主气有扶生肖的意思，比较像外在名字能量在支持本人气场，做事容易有顺势累积的空间。",
      bonus: 5
    };
  }

  if (controls[zodiacElement] === nameElement) {
    return {
      label: "生肖克姓名",
      tone: "生肖能量能驾驭名字主气，比较像本人愿意付出与承担，但也要留意别把责任都压在自己身上。",
      bonus: 2
    };
  }

  if (generates[zodiacElement] === nameElement) {
    return {
      label: "生肖生姓名",
      tone: "生肖去生名字，代表本人容易把力气投注在外在表现、责任或关系里，有韧性，但有时会比较耗心力。",
      bonus: 0
    };
  }

  if (controls[nameElement] === zodiacElement) {
    return {
      label: "姓名克生肖",
      tone: "名字主气对生肖有牵制感，比较像心里有方向，却容易遇到节奏被卡、表达不顺或机会来得慢的感觉，需要进一步确认。",
      bonus: -4
    };
  }

  return {
    label: "同气相扶",
    tone: "名字主气与生肖同类，优点是个性和方向比较集中，提醒是不要过度固执在同一种做法里。",
    bonus: 1
  };
}

function findGroup(zodiac: string, groups: string[][]): string[] {
  return groups.find((group) => group.includes(zodiac)) ?? [zodiac];
}

function pairMate(zodiac: string, pairs: string[][]): string | null {
  const pair = pairs.find((items) => items.includes(zodiac));
  if (!pair) return null;
  return pair.find((item) => item !== zodiac) ?? null;
}

function relationshipBetweenZodiacs(userZodiac: string, relatedZodiac: string): { label: string; tone: string; score: number } {
  if (relatedZodiac === userZodiac) {
    return { label: "本生肖字根", tone: "这个字根和本生肖同气，代表名字里有直接呼应自己的部分。", score: 2 };
  }

  if (findGroup(userZodiac, sanHeGroups).includes(relatedZodiac)) {
    return { label: "三合", tone: "这个字根落在三合关系里，象征互助、补位和贵人缘的可能。", score: 3 };
  }

  if (pairMate(userZodiac, liuHePairs) === relatedZodiac) {
    return { label: "六合", tone: "这个字根落在六合关系里，比较像暗中相合、关系协调的助力。", score: 3 };
  }

  if (pairMate(userZodiac, clashPairs) === relatedZodiac) {
    return { label: "相冲", tone: "这个字根和本生肖有冲动感，容易形成方向拉扯，不能直接说坏，但需要细看。", score: -3 };
  }

  if (pairMate(userZodiac, harmPairs) === relatedZodiac) {
    return { label: "相害", tone: "这个字根和本生肖有暗耗感，比较像心里别扭、人际误会或情绪消耗，需要进一步确认。", score: -2 };
  }

  if (pairMate(userZodiac, breakPairs) === relatedZodiac) {
    return { label: "相破", tone: "这个字根和本生肖有破局感，常见为想法不一致或内部拉扯，适合让老师再细看位置。", score: -2 };
  }

  if (findGroup(userZodiac, punishGroups).includes(relatedZodiac)) {
    return { label: "相刑", tone: "这个字根和本生肖有刑的味道，偏向自我压力、规则冲突或相处磨合，不宜下绝对判断。", score: -2 };
  }

  return { label: "无明显会合冲刑", tone: "这个字根和本生肖没有明显六合三合或冲害破刑，先看五行与位置。", score: 0 };
}

function zodiacsForRoots(roots: string[]): string[] {
  const direct = roots.map((root) => rootZodiacMap[root]).filter(Boolean);
  const inferred = Object.entries(zodiacMeta)
    .filter(([, meta]) => roots.some((root) => meta.favorableRoots.includes(root)))
    .map(([zodiac]) => zodiac);
  return Array.from(new Set([...direct, ...inferred]));
}

function detectCharacterRoots(char: string): string[] {
  const direct = commonCharacterRoots[char] ?? [];
  const inferred = Object.values(zodiacMeta)
    .flatMap((meta) => meta.favorableRoots)
    .filter((root) => char === root || char.includes(root));
  return Array.from(new Set([...direct, ...inferred]));
}

function analyzeZodiacCharacter(input: NameAnalysisInput, character: CharacterAnalysis): ZodiacCharacterMatch {
  const roots = detectCharacterRoots(character.char);
  const relatedZodiacs = zodiacsForRoots(roots);
  const rootRelations = relatedZodiacs.map((zodiac) => relationshipBetweenZodiacs(input.zodiac, zodiac));
  const strongestRoot = rootRelations.sort((a, b) => b.score - a.score)[0];
  const elementRelation = relationBetweenNameAndZodiac(character.element, zodiacMeta[input.zodiac]?.element ?? "土");
  const rootScore = strongestRoot?.score ?? 0;
  const totalScore = rootScore + Math.sign(elementRelation.bonus);
  const fitLevel: ZodiacCharacterMatch["fitLevel"] = totalScore >= 2 ? "较合" : totalScore <= -2 ? "需确认" : "平稳";
  const rootText = roots.length > 0 ? `字形上可参考「${roots.slice(0, 3).join("、")}」等字根` : "暂时没有看到很明显的生肖字根";
  const relationText = strongestRoot
    ? `${strongestRoot.label}：${strongestRoot.tone}`
    : `${elementRelation.label}：${elementRelation.tone}`;

  return {
    char: character.char,
    position: character.position,
    kangxiStrokes: character.strokes,
    detectedRoots: roots.length > 0 ? roots : ["未见明显字根"],
    relatedZodiacs: relatedZodiacs.length > 0 ? relatedZodiacs : ["无明显对应生肖"],
    fitLevel,
    reason: `${character.position}「${character.char}」以康熙笔画参考为 ${character.strokes} 画，五行取${character.element}。${rootText}，所以对${input.zodiac}生肖不是只看好坏，而要看它落在姓氏或名字的位置。`,
    relationshipNote: relationText
  };
}

function buildScore(input: NameAnalysisInput, chars: CharacterAnalysis[]): number {
  const seed = stableHash(`${input.name}-${input.zodiac}-${input.focus}-${input.scriptType}`);
  const preferences = zodiacElementPreference[input.zodiac] ?? [];
  const matchBonus = chars.filter((char) => preferences.includes(char.element)).length * 3;
  const balanceBonus = new Set(chars.map((char) => char.element)).size * 2;
  const dominant = getDominantElement(chars);
  const zodiacElement = zodiacMeta[input.zodiac]?.element ?? "土";
  const relationBonus = relationBetweenNameAndZodiac(dominant, zodiacElement).bonus;
  return Math.min(88, Math.max(72, 72 + (seed % 11) + matchBonus + balanceBonus + relationBonus));
}

function applyZiweiScore(baseScore: number, scoreDelta: number): number {
  return Math.min(92, Math.max(68, baseScore + Math.round(scoreDelta / 8)));
}

function getPatternName(chars: CharacterAnalysis[], score: number, ziweiDelta = 0): string {
  const dominant = getDominantElement(chars);

  if (ziweiDelta >= 20) return "命名互补型";
  if (ziweiDelta <= -18) return "宫名需调型";
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

function analyzeZodiacName(input: NameAnalysisInput, characters: CharacterAnalysis[], dominant: ElementName): ZodiacNameAnalysis {
  const meta = zodiacMeta[input.zodiac] ?? zodiacMeta.龙;
  const relation = relationBetweenNameAndZodiac(dominant, meta.element);
  const nameChars = Array.from(input.name);
  const matchedRoots = meta.favorableRoots.filter((root) => nameChars.some((char) => char === root || char.includes(root)));
  const elementMatches = characters
    .filter((char) => zodiacElementPreference[input.zodiac]?.includes(char.element))
    .map((char) => `${char.char}字五行${char.element}`);
  const matched = Array.from(new Set([...matchedRoots, ...elementMatches])).slice(0, 4);
  const sanHe = findGroup(input.zodiac, sanHeGroups).filter((item) => item !== input.zodiac);
  const liuHe = pairMate(input.zodiac, liuHePairs);
  const clash = pairMate(input.zodiac, clashPairs);
  const harm = pairMate(input.zodiac, harmPairs);
  const characterMatches = characters.map((character) => analyzeZodiacCharacter(input, character));

  return {
    zodiacElement: `${input.zodiac}属${meta.branch}，主气为${meta.element}`,
    nameDominantElement: dominant,
    relationLabel: relation.label,
    relationTone: relation.tone,
    favorableRoots: meta.favorableRoots.slice(0, 8),
    matchedRoots: matched.length > 0 ? matched : ["暂未见明显生肖喜用字根"],
    harmonyNotes: [
      `${input.zodiac}的三合可参考：${sanHe.join("、")}，名字若带到相关字根，会有互助、补位的味道。`,
      `${input.zodiac}的六合可参考：${liuHe ?? "暂无"}，名字若带到相关字根，常被视为暗合或协调的助力。`,
      `${input.zodiac}需温和留意：冲为${clash ?? "暂无"}、害为${harm ?? "暂无"}。名字若带到这些字根，不代表一定不好，只是需要看位置与整体结构。`
    ],
    characterMatches,
    cautions: [
      "生肖姓名学只看年支与姓名结构，不能单凭这一项判断完整命运。",
      relation.bonus < 0 ? "名字主气与生肖之间有牵制感，适合进一步确认是否影响事业节奏或内在压力。" : "即使关系偏顺，也要看名字每个字的位置、笔画与个人现实处境。",
      "若要判断是否适合继续使用，还需要结合出生资料与老师进一步细看。"
    ],
    summary: `以生肖姓名学角度看，${input.zodiac}的气质偏向${meta.nature}。你的姓名主气偏${dominant}，与生肖形成「${relation.label}」的关系。这里先当作初步参考：它可以帮助我们看名字和生肖之间是否顺气，也能提醒哪些地方需要老师进一步确认。`
  };
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

function makeZiweiSectionReport(
  kind: "家庭" | "事业" | "爱情",
  dominant: ElementName,
  input: NameAnalysisInput,
  metaphysics: ReturnType<typeof buildMetaphysicsProfile>
): SectionReport {
  const life = metaphysics.ziweiChart.keyPalaces.life;
  const migration = metaphysics.ziweiChart.keyPalaces.migration;
  const career = metaphysics.ziweiChart.keyPalaces.career;
  const wealth = metaphysics.ziweiChart.keyPalaces.wealth;
  const nameElement = metaphysics.fiveGrid.corePersonalityElement;
  const focusHint = input.focus === kind || (kind === "事业" && input.focus === "财运")
    ? "你特别想看这一块时，建议进一步让老师把出生资料、现实处境和姓名五格一起看，判断会更贴近本人。"
    : "这里先给你一个方向，不急着下结论，完整判断仍要结合出生资料和现实处境。";

  if (kind === "家庭") {
    return {
      title: "家庭分析",
      overall: `家庭这边先看命宫与姓名人格。命宫主星参考「${life.majorStars.join("、") || "空宫"}」，宫位五行偏${life.element}；姓名人格属${nameElement}，所以家庭底色不是只看姓氏，而是看你如何承接早年环境与内在安全感。`,
      past: `过去比较像有一段需要自己消化压力的阶段。名字里有${elementTone(dominant)}的气息，再碰到命宫${life.element}气，会让你对家庭气氛、长辈期待或责任分配比较敏感。`,
      present: "现在的你在家人面前可能习惯表现得稳定，但稳定不代表完全轻松。若名字五格和命宫之间有克制或消耗，就容易出现心里想讲、但又怕讲了影响关系的状态。",
      future: "往后家庭关系仍有慢慢调整的空间，关键不在强行改变谁，而是看清楚哪些责任属于你，哪些只是长期习惯背在身上。",
      reminder: `老师温和提醒：家庭不能只用生肖字根判断，最好把命宫、父母家庭感受和姓名人格一起看。${focusHint}如果你愿意，可以把家庭这段发给老师，让老师帮你看是哪一层能量比较重。`
    };
  }

  if (kind === "事业") {
    return {
      title: "事业分析",
      overall: `事业这边主看官禄宫与财帛宫。官禄宫主星参考「${career.majorStars.join("、") || "空宫"}」，财帛宫主星参考「${wealth.majorStars.join("、") || "空宫"}」，再对照姓名人格${nameElement}气，判断名字是帮你推进，还是让机会来得比较慢。`,
      past: "过去事业或学习阶段，可能比较像有能力但节奏不一定顺。有时不是你不努力，而是官禄宫、财帛宫和姓名五行之间若有拉扯，就会出现方向反复、贵人不稳或回报较慢的感觉。",
      present: `现在适合先看官禄宫${career.element}气和姓名人格${nameElement}是否相生。若相生，名字比较像能帮你把能力推出去；若相克，就要确认目前事业是否有卡在定位、表达或选择上。`,
      future: "未来事业仍有打开空间，尤其当你把能力集中在适合自己的方向，而不是一直被外界节奏带着走，名字里后期累积的力量会比较容易显出来。",
      reminder: `老师温和提醒：事业与财运要重点看官禄、财帛，再看五格人格是否补位。${focusHint}这一块很适合通过 WhatsApp 让老师进一步对照完整命盘。`
    };
  }

  return {
    title: "爱情分析",
    overall: `感情这边先看命宫的内在模式，再看迁移宫如何影响你面对外界和亲密关系。迁移宫主星参考「${migration.majorStars.join("、") || "空宫"}」，宫位五行偏${migration.element}，会影响你在关系里如何靠近、退开和保护自己。`,
    past: "过去感情里，可能有过不容易完全说出口的失落或期待落差。若姓名人格和命宫、迁移宫之间有消耗感，就比较像心里放得深，但表面未必愿意让对方看见。",
    present: `现在你会更在意关系是否让自己安心。姓名人格属${nameElement}，如果它能生扶迁移宫，感情里比较容易沟通；如果有克制，就要留意自己是否容易想很多、忍很多。`,
    future: "未来感情不是只看桃花，而是看你能不能遇到让你放松的人，也看你是否愿意把边界与需要讲得更清楚。",
    reminder: `老师温和提醒：爱情与婚姻不能只看一个名字好不好听，要看命宫、迁移宫和姓名人格之间有没有互相支持。${focusHint}如果这段让你有感觉，可以让老师帮你看感情模式卡在哪里。`
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
      input.birthDate ? `出生日期：${input.birthDate}` : "出生日期：未填写",
      input.birthTime ? `出生时间：${input.birthTime}` : "出生时间：未填写",
      input.birthCity ? `出生城市：${input.birthCity}` : "出生城市：未填写",
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
    gender: input.gender || "不透露",
    birthDate: input.birthDate?.trim() || "",
    birthTime: input.birthTime?.trim() || "",
    birthCity: input.birthCity?.trim() || "",
    calendarType: input.calendarType || "solar",
    useTrueSolarTime: Boolean(input.useTrueSolarTime)
  };
  const characters = analyzeCharacters(normalizedInput.name);
  const dominant = getDominantElement(characters);
  const metaphysics = buildMetaphysicsProfile(normalizedInput, characters);
  const baseScore = buildScore(normalizedInput, characters);
  const score = applyZiweiScore(baseScore, metaphysics.ziweiNameMatch.scoreDelta);
  const patternName = getPatternName(characters, score, metaphysics.ziweiNameMatch.scoreDelta);

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
    "人格五行是否真正补到命宫与迁移宫需要的能量",
    "官禄宫、财帛宫主星是否被姓名五格生扶或克制",
    "生肖姓名学看到的字根关系，是否和紫微核心宫位互相印证"
  ];

  return {
    userInput: normalizedInput,
    score,
    patternName,
    overall: {
      opening:
        "我先温和地跟你说，名字不是简单分成好或不好。新版会先以紫微斗数的命宫、迁移宫、官禄宫、财帛宫作为主轴，再用姓名五格去看名字是否补到你的命盘需要。生肖姓名学仍会保留，但它现在是辅助参考，不会单独决定结论。",
      strengths,
      resistances,
      confirmations
    },
    characters,
    fiveGrid: metaphysics.fiveGrid,
    ziweiChart: metaphysics.ziweiChart,
    ziweiNameMatch: metaphysics.ziweiNameMatch,
    zodiacName: analyzeZodiacName(normalizedInput, characters, dominant),
    family: makeZiweiSectionReport("家庭", dominant, normalizedInput, metaphysics),
    career: makeZiweiSectionReport("事业", dominant, normalizedInput, metaphysics),
    love: makeZiweiSectionReport("爱情", dominant, normalizedInput, metaphysics),
    pastTrace:
      `从紫微核心宫位和姓名人格五行来看，你过去的路可能不是完全轻松的。${metaphysics.ziweiNameMatch.rules[0]?.text ?? "名字和命盘之间有一些需要细看的地方。"}这不代表一定发生过什么严重事件，只是比较像某个阶段有压力、转折、失落、家庭责任、人际伤害、事业低谷或感情变化，需要老师结合完整出生资料再确认。`,
    summary:
      `综合来看，这份报告的主轴已经从单纯生肖姓名学，改成「${metaphysics.ziweiNameMatch.primaryLogic}」。你的姓名人格属${metaphysics.fiveGrid.corePersonalityElement}，命宫主星参考${metaphysics.ziweiChart.keyPalaces.life.majorStars.join("、") || "空宫"}，官禄宫参考${metaphysics.ziweiChart.keyPalaces.career.majorStars.join("、") || "空宫"}。名字不是只看笔画吉凶，而是看它有没有帮你承接命盘里真正需要被补、被稳住或被引动的地方。`,
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
