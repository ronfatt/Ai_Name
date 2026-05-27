export type ScriptType = "simplified" | "traditional";
export type Gender = "男" | "女" | "不透露" | "";
export type Focus = "家庭" | "事业" | "爱情" | "财运" | "改名" | "整体" | "";

export interface NameAnalysisInput {
  name: string;
  scriptType: ScriptType;
  zodiac: string;
  gender?: Gender;
  focus?: Focus;
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

export interface OverallAnalysis {
  opening: string;
  strengths: string[];
  resistances: string[];
  confirmations: string[];
}

export type WhatsappSection = "家庭" | "事业" | "爱情" | "整体";

export interface AnalysisResult {
  userInput: NameAnalysisInput;
  score: number;
  patternName: string;
  overall: OverallAnalysis;
  characters: CharacterAnalysis[];
  family: SectionReport;
  career: SectionReport;
  love: SectionReport;
  pastTrace: string;
  summary: string;
  deeperQuestions: string[];
  whatsappMessages: Record<WhatsappSection, string>;
}
