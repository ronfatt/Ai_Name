import { astro } from "iztro";
import type { Gender, NameAnalysisInput, ZiweiChart, ZiweiPalace } from "@/types/analysis";
import type { BirthProfile } from "@/lib/astro/timeCalibration";
import type { LunarProfile } from "@/lib/astro/lunarAdapter";
import { formatDateParts, pad, timeToIndex } from "@/lib/astro/timeCalibration";
import { inferPalaceElement, starElements, stemElements } from "@/lib/astro/starElementMap";

const palaceNameMap = {
  命宫: "命宫",
  迁移宫: "迁移",
  官禄宫: "官禄",
  财帛宫: "财帛"
} as const;

export function buildZiweiChart(lunarProfile: LunarProfile, input: NameAnalysisInput, birth: BirthProfile): ZiweiChart {
  const solarDate = formatDateParts(
    birth.adjustedDateTime.getUTCFullYear(),
    birth.adjustedDateTime.getUTCMonth() + 1,
    birth.adjustedDateTime.getUTCDate()
  );
  const timeIndex = timeToIndex(birth.adjustedDateTime.getUTCHours());

  try {
    const chart = astro.bySolar(solarDate, timeIndex, toIztroGender(input.gender), true, "zh-CN");
    const palaces = chart.palaces.map(toZiweiPalace);

    return {
      source: "iztro",
      solarDate,
      lunarDate: chart.lunarDate || lunarProfile.lunarDate,
      adjustedDateTime: `${solarDate} ${pad(birth.adjustedDateTime.getUTCHours())}:${pad(birth.adjustedDateTime.getUTCMinutes())}`,
      birthTimeIndex: timeIndex,
      trueSolarTime: {
        enabled: birth.useTrueSolarTime,
        longitude: birth.longitude,
        correctionMinutes: birth.correctionMinutes,
        note: birth.useTrueSolarTime
          ? `以东八区标准经度120度为基准，经度${birth.longitude}度，真太阳时校正 ${birth.correctionMinutes} 分钟。`
          : "未启用真太阳时校正，先以用户填写时间排盘。"
      },
      ganzhi: lunarProfile.ganzhi,
      soul: chart.soul,
      body: chart.body,
      fiveElementsClass: chart.fiveElementsClass,
      palaces,
      keyPalaces: pickKeyPalaces(palaces)
    };
  } catch {
    return buildFallbackChart(input, birth, solarDate, timeIndex, lunarProfile);
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

function buildFallbackChart(input: NameAnalysisInput, birth: BirthProfile, solarDate: string, timeIndex: number, lunarProfile: LunarProfile): ZiweiChart {
  const seed = stableHash(`${input.name}-${solarDate}-${timeIndex}`);
  const palaceNames = ["命宫", "兄弟", "夫妻", "子女", "财帛", "疾厄", "迁移", "交友", "官禄", "田宅", "福德", "父母"];
  const branches = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"];
  const stems = Object.keys(stemElements);
  const starNames = Object.keys(starElements);
  const palaces = palaceNames.map((name, index) => {
    const star = starNames[(seed + index * 3) % starNames.length];
    const stem = stems[(seed + index) % stems.length];
    return {
      name,
      heavenlyStem: stem,
      earthlyBranch: branches[index],
      majorStars: [star],
      minorStars: [],
      mutagens: [],
      element: inferPalaceElement(stem, branches[index], [star]),
      isBodyPalace: index === ((seed + 4) % 12),
      isOriginalPalace: name === "命宫"
    };
  });

  return {
    source: "fallback",
    solarDate,
    lunarDate: lunarProfile.lunarDate,
    adjustedDateTime: `${solarDate} ${pad(birth.adjustedDateTime.getUTCHours())}:${pad(birth.adjustedDateTime.getUTCMinutes())}`,
    birthTimeIndex: timeIndex,
    trueSolarTime: {
      enabled: birth.useTrueSolarTime,
      longitude: birth.longitude,
      correctionMinutes: birth.correctionMinutes,
      note: birth.useTrueSolarTime ? `真太阳时校正 ${birth.correctionMinutes} 分钟。` : "未启用真太阳时校正。"
    },
    ganzhi: lunarProfile.ganzhi,
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

function toIztroGender(gender?: Gender): "male" | "female" {
  return gender === "女" ? "female" : "male";
}

function stableHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}
