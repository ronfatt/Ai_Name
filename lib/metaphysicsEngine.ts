import { Solar, Lunar } from "lunar-javascript";
import { astro } from "iztro";
import type {
  CharacterAnalysis,
  ElementName,
  FiveGridAnalysis,
  FiveGridItem,
  NameAnalysisInput,
  ZiweiChart,
  ZiweiNameMatch,
  ZiweiPalace
} from "@/types/analysis";

const elements: ElementName[] = ["木", "火", "土", "金", "水"];
const standardLongitude = 120;

const cityLongitudes: Record<string, number> = {
  吉隆坡: 101.6869,
  槟城: 100.3327,
  新山: 103.7414,
  怡保: 101.0901,
  马六甲: 102.2501,
  新加坡: 103.8198,
  台北: 121.5654,
  香港: 114.1694,
  上海: 121.4737,
  北京: 116.4074,
  广州: 113.2644,
  深圳: 114.0579
};

const palaceNameMap = {
  命宫: "命宫",
  迁移宫: "迁移",
  官禄宫: "官禄",
  财帛宫: "财帛"
} as const;

const stemElements: Record<string, ElementName> = {
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

const branchElements: Record<string, ElementName> = {
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

const starElements: Record<string, ElementName[]> = {
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

export function buildMetaphysicsProfile(input: NameAnalysisInput, characters: CharacterAnalysis[]) {
  const birth = normalizeBirth(input);
  const fiveGrid = calculateFiveGrid(characters);
  const ziweiChart = buildZiweiChart(input, birth);
  const ziweiNameMatch = matchZiweiWithName(ziweiChart, fiveGrid);

  return {
    fiveGrid,
    ziweiChart,
    ziweiNameMatch
  };
}

function normalizeBirth(input: NameAnalysisInput) {
  const now = new Date();
  const fallbackDate = `${now.getFullYear()}-01-01`;
  const birthDate = isDateLike(input.birthDate) ? input.birthDate.trim() : fallbackDate;
  const parsedTime = parseTime(input.birthTime);
  const longitude = resolveLongitude(input.birthCity, input.longitude);
  const calendarType = input.calendarType || "solar";
  const useTrueSolarTime = Boolean(input.useTrueSolarTime);
  const correctionMinutes = useTrueSolarTime ? Math.round((longitude - standardLongitude) * 4) : 0;
  const [year, month, day] = birthDate.split("-").map(Number);

  let baseDate = new Date(Date.UTC(year, month - 1, day, parsedTime.hour, parsedTime.minute, 0));
  let sourceSolarDate = birthDate;

  if (calendarType === "lunar") {
    const solar = Lunar.fromYmdHms(year, month, day, parsedTime.hour, parsedTime.minute, 0).getSolar();
    sourceSolarDate = formatDateParts(solar.getYear(), solar.getMonth(), solar.getDay());
    baseDate = new Date(Date.UTC(solar.getYear(), solar.getMonth() - 1, solar.getDay(), parsedTime.hour, parsedTime.minute, 0));
  }

  const adjusted = new Date(baseDate.getTime() + correctionMinutes * 60_000);

  return {
    sourceSolarDate,
    adjusted,
    parsedTime,
    longitude,
    calendarType,
    useTrueSolarTime,
    correctionMinutes
  };
}

function buildZiweiChart(input: NameAnalysisInput, birth: ReturnType<typeof normalizeBirth>): ZiweiChart {
  const solarDate = formatDateParts(birth.adjusted.getUTCFullYear(), birth.adjusted.getUTCMonth() + 1, birth.adjusted.getUTCDate());
  const timeIndex = timeToIndex(birth.adjusted.getUTCHours());
  const gender = input.gender === "女" ? "female" : "male";
  const lunar = Solar
    .fromYmdHms(
      birth.adjusted.getUTCFullYear(),
      birth.adjusted.getUTCMonth() + 1,
      birth.adjusted.getUTCDate(),
      birth.adjusted.getUTCHours(),
      birth.adjusted.getUTCMinutes(),
      0
    )
    .getLunar();

  try {
    const chart = astro.bySolar(solarDate, timeIndex, gender, true, "zh-CN");
    const palaces = chart.palaces.map(toZiweiPalace);

    return {
      source: "iztro",
      solarDate,
      lunarDate: chart.lunarDate || lunar.toString(),
      adjustedDateTime: `${solarDate} ${pad(birth.adjusted.getUTCHours())}:${pad(birth.adjusted.getUTCMinutes())}`,
      birthTimeIndex: timeIndex,
      trueSolarTime: buildTrueSolarTime(input, birth),
      ganzhi: buildGanzhi(lunar),
      soul: chart.soul,
      body: chart.body,
      fiveElementsClass: chart.fiveElementsClass,
      palaces,
      keyPalaces: pickKeyPalaces(palaces)
    };
  } catch {
    return buildFallbackChart(input, birth, solarDate, timeIndex, lunar);
  }
}

function toZiweiPalace(palace: {
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: Array<{ name: string; mutagen?: string }>;
  minorStars: Array<{ name: string; mutagen?: string }>;
  isBodyPalace: boolean;
  isOriginalPalace: boolean;
}): ZiweiPalace {
  const majorStars = palace.majorStars.map((star) => star.name);
  const minorStars = palace.minorStars.map((star) => star.name).slice(0, 6);
  const mutagens = [...palace.majorStars, ...palace.minorStars]
    .map((star) => star.mutagen)
    .filter((item): item is string => Boolean(item));

  return {
    name: palace.name,
    heavenlyStem: palace.heavenlyStem,
    earthlyBranch: palace.earthlyBranch,
    majorStars,
    minorStars,
    mutagens,
    element: inferPalaceElement(palace.heavenlyStem, palace.earthlyBranch, majorStars),
    isBodyPalace: palace.isBodyPalace,
    isOriginalPalace: palace.isOriginalPalace
  };
}

function calculateFiveGrid(characters: CharacterAnalysis[]): FiveGridAnalysis {
  const strokes = characters.map((character) => character.strokes);
  const surname = strokes[0] ?? 1;
  const given = strokes.slice(1);
  const firstGiven = given[0] ?? 1;
  const lastGiven = given[given.length - 1] ?? firstGiven;
  const total = strokes.reduce((sum, stroke) => sum + stroke, 0);
  const items: FiveGridItem[] = [
    makeGrid("天格", surname + 1),
    makeGrid("人格", surname + firstGiven),
    makeGrid("地格", given.reduce((sum, stroke) => sum + stroke, 0) + (given.length === 1 ? 1 : 0)),
    makeGrid("外格", total - (surname + firstGiven) + 1 || lastGiven + 1),
    makeGrid("总格", total)
  ];
  const corePersonalityElement = items.find((item) => item.name === "人格")?.element ?? "土";

  return {
    surnameStrokes: surname,
    givenNameStrokes: given,
    grids: items,
    corePersonalityElement,
    summary: `五格以康熙笔画参考，人格取${surname + firstGiven}，五行属${corePersonalityElement}。这一格先看一个人做事、承压和面对外界的主要方式。`
  };
}

function matchZiweiWithName(chart: ZiweiChart, fiveGrid: FiveGridAnalysis): ZiweiNameMatch {
  const palaceElements = {
    命宫: chart.keyPalaces.life.element,
    迁移宫: chart.keyPalaces.migration.element,
    官禄宫: chart.keyPalaces.career.element,
    财帛宫: chart.keyPalaces.wealth.element
  };
  const counts = elements.reduce((acc, element) => {
    acc[element] = Object.values(palaceElements).filter((item) => item === element).length;
    return acc;
  }, {} as Record<ElementName, number>);
  const missingElements = elements.filter((element) => counts[element] === 0);
  const nameElement = fiveGrid.corePersonalityElement;
  const targetPalaces = [
    ["命宫", chart.keyPalaces.life],
    ["迁移宫", chart.keyPalaces.migration],
    ["官禄宫", chart.keyPalaces.career],
    ["财帛宫", chart.keyPalaces.wealth]
  ] as const;
  const rules = targetPalaces.map(([palaceName, palace]) => {
    const relation = elementRelation(nameElement, palace.element);
    return {
      key: `${palaceName}-${nameElement}-${palace.element}`,
      title: `${palaceName} × 人格${nameElement}`,
      scoreDelta: relation.score,
      text: `${palaceName}主星参考「${palace.majorStars.join("、") || "空宫借对宫"}」，宫位五行取${palace.element}；姓名人格属${nameElement}，${relation.text}`
    };
  });
  const missingBonus = missingElements.includes(nameElement) ? 20 : 0;
  const scoreDelta = rules.reduce((sum, rule) => sum + rule.scoreDelta, missingBonus);

  return {
    primaryLogic: "命宫 / 迁移宫 / 官禄宫 / 财帛宫 × 五格人格五行",
    nameGridElement: nameElement,
    missingElements,
    palaceElements,
    scoreDelta,
    rules: [
      ...(missingBonus
        ? [{
            key: `missing-${nameElement}`,
            title: `姓名补入命盘少见的${nameElement}气`,
            scoreDelta: missingBonus,
            text: `四个核心宫位里${nameElement}气不明显，而姓名人格刚好属${nameElement}，初步看有补位作用，但仍需结合全盘确认。`
          }]
        : []),
      ...rules
    ],
    summary: `这一版主逻辑已改为紫微斗数核心宫位对照姓名五格。姓名人格属${nameElement}，会先看它是否补到命宫、迁移、官禄、财帛的需要，再把生肖姓名学作为辅助参考。`
  };
}

function buildFallbackChart(input: NameAnalysisInput, birth: ReturnType<typeof normalizeBirth>, solarDate: string, timeIndex: number, lunar: { toString(): string }): ZiweiChart {
  const seed = stableHash(`${input.name}-${solarDate}-${timeIndex}`);
  const palaceNames = ["命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "交友", "官禄", "田宅", "福德", "父母"];
  const branches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
  const starNames = Object.keys(starElements);
  const palaces = palaceNames.map((name, index) => {
    const star = starNames[(seed + index * 3) % starNames.length];
    return {
      name,
      heavenlyStem: Object.keys(stemElements)[(seed + index) % 10],
      earthlyBranch: branches[index],
      majorStars: [star],
      minorStars: [],
      mutagens: [],
      element: inferPalaceElement(Object.keys(stemElements)[(seed + index) % 10], branches[index], [star]),
      isBodyPalace: index === ((seed + 4) % 12),
      isOriginalPalace: name === "命宫"
    };
  });

  return {
    source: "fallback",
    solarDate,
    lunarDate: lunar.toString(),
    adjustedDateTime: `${solarDate} ${pad(birth.adjusted.getUTCHours())}:${pad(birth.adjusted.getUTCMinutes())}`,
    birthTimeIndex: timeIndex,
    trueSolarTime: buildTrueSolarTime(input, birth),
    ganzhi: { year: "待校准", month: "待校准", day: "待校准", hour: "待校准" },
    soul: palaces[0].majorStars[0],
    body: palaces.find((palace) => palace.isBodyPalace)?.majorStars[0] ?? palaces[0].majorStars[0],
    fiveElementsClass: "本地初排",
    palaces,
    keyPalaces: pickKeyPalaces(palaces)
  };
}

function pickKeyPalaces(palaces: ZiweiPalace[]): ZiweiChart["keyPalaces"] {
  const byName = (target: keyof typeof palaceNameMap) =>
    palaces.find((palace) => palace.name === palaceNameMap[target] || palace.name === target) ?? palaces[0];

  return {
    life: byName("命宫"),
    migration: byName("迁移宫"),
    career: byName("官禄宫"),
    wealth: byName("财帛宫")
  };
}

function makeGrid(name: FiveGridItem["name"], number: number): FiveGridItem {
  const element = numberToElement(number);
  return {
    name,
    number,
    element,
    note: `${name}${number}画，数理五行取${element}，作为第一版五格对照参考。`
  };
}

function numberToElement(number: number): ElementName {
  const remainder = number % 10;
  if ([1, 2].includes(remainder)) return "木";
  if ([3, 4].includes(remainder)) return "火";
  if ([5, 6].includes(remainder)) return "土";
  if ([7, 8].includes(remainder)) return "金";
  return "水";
}

function inferPalaceElement(stem: string, branch: string, stars: string[]): ElementName {
  const starVotes = stars.flatMap((star) => starElements[star] ?? []);
  if (starVotes.length > 0) return mostCommon(starVotes);
  return branchElements[branch] ?? stemElements[stem] ?? "土";
}

function elementRelation(nameElement: ElementName, palaceElement: ElementName): { score: number; text: string } {
  const generates: Record<ElementName, ElementName> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
  const controls: Record<ElementName, ElementName> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

  if (nameElement === palaceElement) return { score: 8, text: "两边同气，代表名字能量和该宫位方向比较容易集中。" };
  if (generates[nameElement] === palaceElement) return { score: 10, text: "姓名五行有生扶宫位主气的意思，初步看是加分的配合。" };
  if (generates[palaceElement] === nameElement) return { score: 4, text: "宫位主气去生姓名人格，表示本人容易把力气投入这个方向，需要留意消耗感。" };
  if (controls[nameElement] === palaceElement) return { score: -20, text: "姓名五行对该宫位有克制感，不代表一定不好，但要提醒老师进一步确认是否形成卡点。" };
  if (controls[palaceElement] === nameElement) return { score: -8, text: "宫位主气压住姓名人格，比较像外界要求较重，需要看现实处境是否呼应。" };
  return { score: 0, text: "五行关系较平，先看主星组合与四化。"};
}

function buildTrueSolarTime(input: NameAnalysisInput, birth: ReturnType<typeof normalizeBirth>): ZiweiChart["trueSolarTime"] {
  return {
    enabled: birth.useTrueSolarTime,
    longitude: birth.longitude,
    correctionMinutes: birth.correctionMinutes,
    note: birth.useTrueSolarTime
      ? `以东八区标准经度120度为基准，经度${birth.longitude}度，真太阳时校正 ${birth.correctionMinutes} 分钟。`
      : "未启用真太阳时校正，先以用户填写时间排盘。"
  };
}

function buildGanzhi(lunar: {
  getYearInGanZhiExact(): string;
  getMonthInGanZhiExact(): string;
  getDayInGanZhiExact2(): string;
  getTimeInGanZhi(): string;
}) {
  return {
    year: lunar.getYearInGanZhiExact(),
    month: lunar.getMonthInGanZhiExact(),
    day: lunar.getDayInGanZhiExact2(),
    hour: lunar.getTimeInGanZhi()
  };
}

function parseTime(value?: string): { hour: number; minute: number } {
  const match = value?.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { hour: 12, minute: 0 };
  const hour = Math.min(23, Math.max(0, Number(match[1])));
  const minute = Math.min(59, Math.max(0, Number(match[2])));
  return { hour, minute };
}

function resolveLongitude(city?: string, longitude?: number): number {
  if (typeof longitude === "number" && Number.isFinite(longitude)) return longitude;
  if (!city) return cityLongitudes.吉隆坡;
  const matchedCity = Object.keys(cityLongitudes).find((item) => city.includes(item));
  return matchedCity ? cityLongitudes[matchedCity] : cityLongitudes.吉隆坡;
}

function isDateLike(value?: string): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function timeToIndex(hour: number): number {
  if (hour === 0) return 0;
  if (hour === 23) return 12;
  return Math.floor((hour + 1) / 2);
}

function formatDateParts(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function mostCommon(values: ElementName[]): ElementName {
  return elements.reduce((top, element) => (
    values.filter((value) => value === element).length > values.filter((value) => value === top).length ? element : top
  ), values[0] ?? "土");
}

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}
