export type ScriptType = "simplified" | "traditional";
export type Gender = "男" | "女" | "不透露" | "";
export type Focus = "家庭" | "事业" | "爱情" | "财运" | "改名" | "整体" | "";
export type CalendarType = "solar" | "lunar";
export type BirthTimeStatus = "exact" | "approximate" | "unknown";
export type ReportTier = "free" | "paid";

export interface NameAnalysisInput {
  trackingId?: string;
  sessionId?: string;
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
  birthTimeStatus?: BirthTimeStatus;
  approximateBirthTime?: "早上" | "下午" | "晚上" | "";
  reportTier?: ReportTier;
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

export interface TeacherConclusion {
  verdict: "适合继续使用" | "需要细看" | "有调整空间";
  biggestSupport: string;
  biggestBlock: string;
  mustConfirm: string;
  shortAdvice: string;
}

export interface DataConfidence {
  level: "高" | "中" | "需校正";
  items: string[];
  needsTimeCalibration: boolean;
  note: string;
}

export interface ScoreHook {
  score: number;
  text: string;
}

export interface NameTimelineItem {
  title: string;
  ageRange: string;
  char: string;
  focus: string;
  text: string;
}

export interface PainPointReport {
  title: "名：事业与贵人" | "情：感情与婚姻" | "财：财富与守财";
  score: number;
  riskLevel: "平稳" | "需留意" | "需老师确认";
  text: string;
  withheldHint: string;
}

export interface ProfessionalReview {
  rareCharacter: string;
  pronunciation: string;
  meaning: string;
  shape: string;
  authorityNote: string;
}

export interface BaguaCharacterReading {
  char: string;
  position: string;
  strokes: number;
  numberQi: number;
  gua: string;
  image: string;
  element: ElementName;
  lifeStageTone: string;
  strengths: string[];
  cautions: string[];
  careerHint: string;
  relationshipHint: string;
  wealthHint: string;
  safeSummary: string;
}

export interface BaguaNameAnalysis {
  method: string;
  dominantGua: string;
  dominantElement: ElementName;
  dominantTone: string;
  sequence: string;
  summary: string;
  characterReadings: BaguaCharacterReading[];
  confirmations: string[];
}

export interface EnergyRadarPoint {
  element: ElementName;
  score: number;
  label: string;
}

export interface AnnualWarning {
  year: number;
  stemBranch: string;
  zodiac: string;
  title: string;
  text: string;
  urgency: "低" | "中" | "高";
}

export interface AuthorityCaseProof {
  caseId: string;
  painType: "事业" | "感情" | "财运" | "整体";
  title: string;
  text: string;
  ctaAngle: string;
}

export interface SharePosterInsight {
  headline: string;
  scoreLine: string;
  quote: string;
  qrPayload: string;
  visualStyle: string;
}

export interface ConversionTags {
  primaryPain: "事业" | "感情" | "财运" | "整体";
  lowestPainScore: number;
  tags: string[];
  whatsappIntent: string;
}

export interface PartnerCompatibilityTeaser {
  enabled: boolean;
  title: string;
  text: string;
}

export interface LeadRecoveryPlan {
  enabled: boolean;
  trigger: "partial_form" | "result_view" | "whatsapp_click";
  localStorageKey: string;
  text: string;
}

export interface ReportProductOffer {
  tier: ReportTier;
  title: string;
  pageCount: string;
  priceLabel: string;
  goal: string;
  includes: string[];
  lockedTeasers: string[];
  cta: string;
  whatsappMessage: string;
}

export interface ViralUnlockOffer {
  title: string;
  subtitle: string;
  lockedModules: string[];
  facebookShareText: string;
  shareUrl: string;
  unlockCode: string;
  storageKey: string;
  whatsappMessage: string;
}

export interface ZiweiStarNamingInsight {
  lifeStar: string;
  migrationStar: string;
  lifeArchetype: string;
  migrationArchetype: string;
  nameDirection: string;
  personalBrandDirection: string;
  mismatchWarning: string;
  exampleChars: string[];
  crossChecks: Array<{
    triggerLabel: string;
    affectedArea: "事业" | "感情" | "财运" | "个人品牌" | "整体";
    scoreDelta: number;
    reason: string;
    safeWarning: string;
    ctaAngle: string;
  }>;
  cta: string;
}

export interface FunnelAnalysis {
  featureFlags: Record<
    "partnerTest" | "sharePoster" | "energyRadar" | "annualWarning" | "authorityProof" | "leadTagging" | "leadRecovery",
    boolean
  >;
  energyRadar: {
    points: EnergyRadarPoint[];
    weakestElement: ElementName;
    strongestElement: ElementName;
    insight: string;
  };
  annualWarning: AnnualWarning;
  authorityProof: AuthorityCaseProof;
  sharePoster: SharePosterInsight;
  ziweiStarNaming: ZiweiStarNamingInsight;
  conversionTags: ConversionTags;
  reportOffers: {
    selectedTier: ReportTier;
    free: ReportProductOffer;
    paid: ReportProductOffer;
    upgradeReason: string;
  };
  viralUnlock: ViralUnlockOffer;
  partnerCompatibility: PartnerCompatibilityTeaser;
  leadRecovery: LeadRecoveryPlan;
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
  personalityElement: ElementName;
  outerGridElement: ElementName;
  groundGridElement: ElementName;
  totalGridElement: ElementName;
  skyGridElement: ElementName;
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
  scoreHook: ScoreHook;
  teacherConclusion: TeacherConclusion;
  dataConfidence: DataConfidence;
  funnelAnalysis: FunnelAnalysis;
  timeline: NameTimelineItem[];
  painPoints: PainPointReport[];
  professionalReview: ProfessionalReview;
  baguaName: BaguaNameAnalysis;
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
