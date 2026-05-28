export type ScriptType = "simplified" | "traditional";
export type Gender = "男" | "女" | "不透露" | "";
export type Focus = "家庭" | "事业" | "爱情" | "财运" | "改名" | "整体" | "";
export type CalendarType = "solar" | "lunar";

export interface NameAnalysisInput {
  name: string;
  scriptType: ScriptType;
  zodiac: string;
  gender?: Gender;
  focus?: Focus;
  birthDate?: string;
  birthTime?: string;
  birthCity?: string;
  longitude?: number;
  calendarType?: CalendarType;
  useTrueSolarTime?: boolean;
}

export interface CharacterAnalysis {
  char: string;
  position: string;
  element: ElementName;
  strokes: number;
  meaning: string;
  personalityImpact: string;
  lifeStageImpact: string;
}

export type ElementName = "木" | "火" | "土" | "金" | "水";

export interface SectionReport {
  title: string;
  overall: string;
  past: string;
  present: string;
  future: string;
  reminder: string;
}

export interface ZodiacNameAnalysis {
  zodiacElement: string;
  nameDominantElement: ElementName;
  relationLabel: string;
  relationTone: string;
  favorableRoots: string[];
  matchedRoots: string[];
  harmonyNotes: string[];
  characterMatches: ZodiacCharacterMatch[];
  cautions: string[];
  summary: string;
}

export interface ZodiacCharacterMatch {
  char: string;
  position: string;
  kangxiStrokes: number;
  detectedRoots: string[];
  relatedZodiacs: string[];
  fitLevel: "较合" | "平稳" | "需确认";
  reason: string;
  relationshipNote: string;
}

export interface OverallAnalysis {
  opening: string;
  strengths: string[];
  resistances: string[];
  confirmations: string[];
}

export type WhatsappSection = "家庭" | "事业" | "爱情" | "整体";

export interface FiveGridItem {
  name: "天格" | "人格" | "地格" | "外格" | "总格";
  number: number;
  element: ElementName;
  note: string;
}

export interface FiveGridAnalysis {
  surnameStrokes: number;
  givenNameStrokes: number[];
  grids: FiveGridItem[];
  corePersonalityElement: ElementName;
  summary: string;
}

export interface ZiweiPalace {
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: string[];
  minorStars: string[];
  mutagens: string[];
  element: ElementName;
  isBodyPalace: boolean;
  isOriginalPalace: boolean;
}

export interface ZiweiChart {
  source: "iztro" | "fallback";
  solarDate: string;
  lunarDate: string;
  adjustedDateTime: string;
  birthTimeIndex: number;
  trueSolarTime: {
    enabled: boolean;
    longitude: number;
    correctionMinutes: number;
    note: string;
  };
  ganzhi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  soul: string;
  body: string;
  fiveElementsClass: string;
  palaces: ZiweiPalace[];
  keyPalaces: {
    life: ZiweiPalace;
    migration: ZiweiPalace;
    career: ZiweiPalace;
    wealth: ZiweiPalace;
  };
}

export interface MatchingRuleResult {
  key: string;
  title: string;
  scoreDelta: number;
  text: string;
}

export interface ZiweiNameMatch {
  primaryLogic: string;
  nameGridElement: ElementName;
  missingElements: ElementName[];
  palaceElements: Record<"命宫" | "迁移宫" | "官禄宫" | "财帛宫", ElementName>;
  scoreDelta: number;
  rules: MatchingRuleResult[];
  summary: string;
}

export interface AnalysisResult {
  userInput: NameAnalysisInput;
  score: number;
  patternName: string;
  overall: OverallAnalysis;
  characters: CharacterAnalysis[];
  fiveGrid: FiveGridAnalysis;
  ziweiChart: ZiweiChart;
  ziweiNameMatch: ZiweiNameMatch;
  zodiacName: ZodiacNameAnalysis;
  family: SectionReport;
  career: SectionReport;
  love: SectionReport;
  pastTrace: string;
  summary: string;
  deeperQuestions: string[];
  whatsappMessages: Record<WhatsappSection, string>;
}
