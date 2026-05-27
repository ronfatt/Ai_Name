import type {
  AnalysisResult,
  CharacterAnalysis,
  ElementName,
  NameAnalysisInput,
  SectionReport,
  WhatsappSection,
  ZodiacNameAnalysis
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

function getPatternName(chars: CharacterAnalysis[], score: number): string {
  const dominant = getDominantElement(chars);

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

  return {
    zodiacElement: `${input.zodiac}属${meta.branch}，主气为${meta.element}`,
    nameDominantElement: dominant,
    relationLabel: relation.label,
    relationTone: relation.tone,
    favorableRoots: meta.favorableRoots.slice(0, 8),
    matchedRoots: matched.length > 0 ? matched : ["暂未见明显生肖喜用字根"],
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
  const dominant = getDominantElement(characters);
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
    zodiacName: analyzeZodiacName(normalizedInput, characters, dominant),
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
