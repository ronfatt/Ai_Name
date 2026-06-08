import type { ElementName, Gender, ReportTier } from "@/types/analysis";

export type LuckTag = "吉" | "中" | "凶";

export interface CharacterDictionaryRecord {
  char: string;
  traditional?: string;
  radical: string;
  strokeCount: number;
  wuXing: ElementName;
  phoneticWuXing: ElementName;
  pinyinInitial: string;
  meaningTags: string[];
  luckTag: LuckTag;
  yinYang: "阳" | "阴" | "中";
  genderCautions?: Partial<Record<Exclude<Gender, "" | "不透露">, string>>;
  notes: string;
}

export interface ZodiacRadicalCompatibilityRecord {
  zodiac: string;
  branch: string;
  element: ElementName;
  favorableRoots: string[];
  unfavorableRoots: string[];
  clashRoots: string[];
  meaning: string;
}

export interface ZiweiStarPreferenceRecord {
  star: string;
  pattern?: "紫微系" | "机月同梁" | "杀破狼" | "府相" | "其他";
  preferredElements: ElementName[];
  avoidElements?: ElementName[];
  preferredMeaningTags: string[];
  avoidMeaningTags?: string[];
  exampleChars: string[];
  textKeyPrefix: string;
  notes: string;
}

export interface ZiweiStarNamingDirectionRecord {
  stars: string[];
  archetype: "帝王领导型" | "智谋文雅型" | "刚毅财富型" | "开创突破型";
  naturalField: string;
  nameDirection: string;
  personalBrandDirection: string;
  preferredMeaningTags: string[];
  exampleChars: string[];
  mismatchPain: string;
  safePublicText: string;
  ctaAngle: string;
}

export interface ZiweiNameCrossCheckRuleRecord {
  stars?: string[];
  archetype: ZiweiStarNamingDirectionRecord["archetype"];
  avoidElements: ElementName[];
  avoidMeaningTags: string[];
  namePosition: "姓氏" | "名字第一字" | "名字第二字" | "名字第三字" | "任意";
  affectedArea: "事业" | "感情" | "财运" | "个人品牌" | "整体";
  scoreDelta: number;
  triggerLabel: string;
  safeWarning: string;
  ctaAngle: string;
}

export interface TenGodRuleRecord {
  dayMasterElement: ElementName;
  nameElement: ElementName;
  tenGod: "正官" | "七杀" | "正印" | "偏印" | "食神" | "伤官" | "正财" | "偏财" | "比肩" | "劫财";
  tone: string;
}

export interface ConflictRuleRecord {
  key: string;
  title: string;
  severity: "low" | "medium" | "high";
  text: string;
}

export interface FunnelFeatureRecord {
  key: "partnerTest" | "sharePoster" | "energyRadar" | "annualWarning" | "authorityProof" | "leadTagging" | "leadRecovery";
  enabled: boolean;
  stage: "裂变" | "视觉" | "成交" | "挽回";
  title: string;
  purpose: string;
}

export interface EnergyRadarRuleRecord {
  element: ElementName;
  businessLabel: string;
  lowText: string;
  highText: string;
}

export interface AnnualLuckRuleRecord {
  year: number;
  stemBranch: string;
  zodiac: string;
  element: ElementName;
  cautionRoots: string[];
  title: string;
  textTemplate: string;
}

export interface AuthorityCaseRecord {
  caseId: string;
  painType: "事业" | "感情" | "财运" | "整体";
  matchTags: string[];
  title: string;
  anonymizedText: string;
  ctaAngle: string;
}

export interface ConversionTagRuleRecord {
  key: string;
  painType: "事业" | "感情" | "财运" | "整体";
  when: string;
  tags: string[];
  whatsappIntent: string;
}

export interface SharePosterTemplateRecord {
  key: string;
  visualStyle: string;
  headlineTemplate: string;
  quoteTemplates: string[];
}

export interface LeadRecoveryRuleRecord {
  key: string;
  enabled: boolean;
  trigger: "partial_form" | "result_view" | "whatsapp_click";
  delayMinutes: number;
  storageKey: string;
  messageTemplate: string;
}

export interface ReportProductRecord {
  tier: ReportTier;
  title: string;
  pageCount: string;
  priceLabel: string;
  goal: string;
  includes: string[];
  lockedTeasers: string[];
  cta: string;
  whatsappIntent: string;
}

export interface ViralUnlockRuleRecord {
  key: string;
  title: string;
  subtitle: string;
  lockedModules: string[];
  unlockCode: string;
  storageKey: string;
  facebookTextTemplates: string[];
  whatsappIntent: string;
}

export type BaguaNameKey = "坎" | "坤" | "震" | "巽" | "中" | "乾" | "兑" | "艮" | "离";

export interface BaguaNameRecord {
  gua: BaguaNameKey;
  image: string;
  element: ElementName;
  yinYang: "阳" | "阴" | "中";
  xiantianNumber?: number;
  houtianNumber: number;
  direction: string;
  season?: string;
  coreNature: string;
  personalityKeywords: string[];
  formKeywords: string[];
  placeKeywords: string[];
  peopleKeywords: string[];
  objectKeywords: string[];
  colorKeywords: string[];
  positiveTags: string[];
  cautionTags: string[];
  careerImage: string;
  relationshipImage: string;
  wealthImage: string;
  lifeStageTone: string;
  safePublicTone: string;
  internalNotes: string;
}
