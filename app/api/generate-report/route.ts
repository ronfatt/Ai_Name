import { NextResponse } from "next/server";
import { generateAnalysis } from "@/lib/report/generateAnalysis";
import type { AnalysisResult, NameAnalysisInput, SectionReport, ZodiacNameAnalysis } from "@/types/analysis";

export const runtime = "nodejs";

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

const SYSTEM_PROMPT = `你是一位温和、专业、有经验的华人姓名学与紫微斗数老师。你的语气像真人老师在聊天，不要像机器报告。请根据规则引擎提供的紫微命盘结构、命宫、迁移宫、官禄宫、财帛宫、姓名五格、五行、笔画和生肖辅助关系，生成一份专业但有人情味的姓名命格初步分析。AI 只负责润色和组织报告，不负责创造新的命理规则，不能改变规则引擎给出的分数、宫位、主星、五格和五行。报告必须从家庭、事业、爱情三个方向展开。可以指出过去可能有压力、转折、失落、家庭责任、人际伤害、事业低谷或感情变化，但不能断言具体灾祸，不能恐吓，不能说“你一定”。不要给完整解决方案或改名方案，要自然引导用户通过 WhatsApp 进一步咨询。`;

interface GenerateReportBody {
  input?: NameAnalysisInput;
  localAnalysis?: AnalysisResult;
}

interface AiReportPatch {
  overall: AnalysisResult["overall"];
  zodiacName: ZodiacNameAnalysis;
  family: SectionReport;
  career: SectionReport;
  love: SectionReport;
  pastTrace: string;
  summary: string;
  deeperQuestions: string[];
}

const stringField = {
  type: "string"
};

const stringListField = {
  type: "array",
  items: {
    type: "string"
  }
};

const sectionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "overall", "past", "present", "future", "reminder"],
  properties: {
    title: { type: "string" },
    overall: stringField,
    past: stringField,
    present: stringField,
    future: stringField,
    reminder: stringField
  }
};

const zodiacNameSchema = {
  type: "object",
  additionalProperties: false,
  required: ["zodiacElement", "nameDominantElement", "relationLabel", "relationTone", "favorableRoots", "matchedRoots", "cautions", "summary"],
  properties: {
    zodiacElement: { type: "string" },
    nameDominantElement: { type: "string", enum: ["木", "火", "土", "金", "水"] },
    relationLabel: { type: "string" },
    relationTone: stringField,
    favorableRoots: stringListField,
    matchedRoots: stringListField,
    cautions: stringListField,
    summary: stringField
  }
};

const aiReportSchema = {
  type: "object",
  additionalProperties: false,
  required: ["overall", "zodiacName", "family", "career", "love", "pastTrace", "summary", "deeperQuestions"],
  properties: {
    overall: {
      type: "object",
      additionalProperties: false,
      required: ["opening", "strengths", "resistances", "confirmations"],
      properties: {
        opening: stringField,
        strengths: stringListField,
        resistances: stringListField,
        confirmations: stringListField
      }
    },
    zodiacName: zodiacNameSchema,
    family: sectionSchema,
    career: sectionSchema,
    love: sectionSchema,
    pastTrace: stringField,
    summary: stringField,
    deeperQuestions: stringListField
  }
};

export async function POST(request: Request) {
  let body: GenerateReportBody;

  try {
    body = (await request.json()) as GenerateReportBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const localAnalysis = getLocalAnalysis(body);
  if (!localAnalysis) {
    return NextResponse.json({ error: "Missing name analysis input" }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      source: "local",
      reason: "OPENAI_API_KEY is not configured",
      analysis: localAnalysis
    });
  }

  try {
    const aiPatch = await generateAiReport(localAnalysis);
    const analysis = mergeAiPatch(localAnalysis, aiPatch);

    return NextResponse.json({
      source: "openai",
      analysis
    });
  } catch (error) {
    console.error("OpenAI report generation failed:", error);

    return NextResponse.json({
      source: "local",
      reason: "OpenAI generation failed; local fallback used",
      analysis: localAnalysis
    });
  }
}

function getLocalAnalysis(body: GenerateReportBody): AnalysisResult | null {
  if (body.localAnalysis && isUsableLocalAnalysis(body.localAnalysis)) {
    return body.localAnalysis;
  }

  if (body.input?.name && body.input.zodiac) {
    return generateAnalysis({
      ...body.input,
      scriptType: body.input.scriptType || "traditional"
    });
  }

  return null;
}

async function generateAiReport(localAnalysis: AnalysisResult): Promise<AiReportPatch> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: buildUserPrompt(localAnalysis)
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "polished_name_analysis_report",
          strict: true,
          schema: aiReportSchema
        }
      },
      max_output_tokens: 5200
    })
  });
  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`OpenAI API returned ${response.status}`);
  }

  const data = await response.json();
  const text = extractOutputText(data);
  if (!text) {
    throw new Error("OpenAI response did not include output text");
  }

  const parsed = JSON.parse(text) as AiReportPatch;
  if (!isValidAiPatch(parsed)) {
    throw new Error("OpenAI JSON did not match expected report shape");
  }

  return parsed;
}

function buildUserPrompt(localAnalysis: AnalysisResult): string {
  return [
    "请只根据下面本地规则引擎输出润色报告，不要创造新的命理规则，不要改变分数、格局、紫微宫位、主星、五格、五行、笔画、姓名拆字结果、生肖五行关系。",
    "输出必须是 JSON，字段必须符合 schema。",
    "安全要求：不恐吓、不断言灾祸、不说具体死亡、疾病、车祸、破产、离婚等严重事件、不说“你一定”、不给完整改名方案。",
    "转化要求：每个家庭、事业、爱情板块结尾都自然提醒可通过 WhatsApp 让老师进一步确认，但语气要温和。",
    "长度要求：每个段落保持 1 到 3 句话，温和但不要冗长，必须输出完整可解析 JSON。",
    "",
    "用户输入：",
    JSON.stringify(localAnalysis.userInput, null, 2),
    "",
    "本地规则引擎输出：",
    JSON.stringify(
      {
        score: localAnalysis.score,
        patternName: localAnalysis.patternName,
        overall: localAnalysis.overall,
        characters: localAnalysis.characters,
        fiveGrid: localAnalysis.fiveGrid,
        ziweiChart: {
          source: localAnalysis.ziweiChart.source,
          solarDate: localAnalysis.ziweiChart.solarDate,
          lunarDate: localAnalysis.ziweiChart.lunarDate,
          adjustedDateTime: localAnalysis.ziweiChart.adjustedDateTime,
          trueSolarTime: localAnalysis.ziweiChart.trueSolarTime,
          ganzhi: localAnalysis.ziweiChart.ganzhi,
          soul: localAnalysis.ziweiChart.soul,
          body: localAnalysis.ziweiChart.body,
          fiveElementsClass: localAnalysis.ziweiChart.fiveElementsClass,
          keyPalaces: localAnalysis.ziweiChart.keyPalaces
        },
        ziweiNameMatch: localAnalysis.ziweiNameMatch,
        zodiacName: localAnalysis.zodiacName,
        family: localAnalysis.family,
        career: localAnalysis.career,
        love: localAnalysis.love,
        pastTrace: localAnalysis.pastTrace,
        summary: localAnalysis.summary,
        deeperQuestions: localAnalysis.deeperQuestions
      },
      null,
      2
    )
  ].join("\n");
}

function mergeAiPatch(localAnalysis: AnalysisResult, patch: AiReportPatch): AnalysisResult {
  return {
    ...localAnalysis,
    overall: patch.overall,
    zodiacName: {
      ...localAnalysis.zodiacName,
      ...patch.zodiacName,
      nameDominantElement: localAnalysis.zodiacName.nameDominantElement,
      relationLabel: localAnalysis.zodiacName.relationLabel
    },
    family: {
      ...patch.family,
      title: "家庭分析"
    },
    career: {
      ...patch.career,
      title: "事业分析"
    },
    love: {
      ...patch.love,
      title: "爱情分析"
    },
    pastTrace: patch.pastTrace,
    summary: patch.summary,
    deeperQuestions: patch.deeperQuestions,
    characters: localAnalysis.characters,
    score: localAnalysis.score,
    patternName: localAnalysis.patternName,
    whatsappMessages: localAnalysis.whatsappMessages
  };
}

function extractOutputText(data: unknown): string | null {
  if (isRecord(data) && typeof data.output_text === "string") {
    return data.output_text;
  }

  if (!isRecord(data) || !Array.isArray(data.output)) {
    return null;
  }

  const chunks: string[] = [];
  for (const item of data.output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (isRecord(content) && typeof content.text === "string") {
        chunks.push(content.text);
      }
    }
  }

  return chunks.length > 0 ? chunks.join("") : null;
}

function isUsableLocalAnalysis(value: AnalysisResult): boolean {
  return Boolean(
    value.userInput?.name &&
    value.userInput?.zodiac &&
    value.score &&
    value.patternName &&
    value.zodiacName &&
    value.family &&
    value.career &&
    value.love &&
    Array.isArray(value.characters)
  );
}

function isValidAiPatch(value: AiReportPatch): boolean {
  return Boolean(
    value &&
    isOverall(value.overall) &&
    isZodiacName(value.zodiacName) &&
    isSection(value.family) &&
    isSection(value.career) &&
    isSection(value.love) &&
    isLongText(value.pastTrace) &&
    isLongText(value.summary) &&
    isStringList(value.deeperQuestions)
  );
}

function isZodiacName(value: ZodiacNameAnalysis): boolean {
  return Boolean(
    value &&
    typeof value.zodiacElement === "string" &&
    typeof value.nameDominantElement === "string" &&
    typeof value.relationLabel === "string" &&
    isLongText(value.relationTone) &&
    Array.isArray(value.favorableRoots) &&
    Array.isArray(value.matchedRoots) &&
    isStringList(value.cautions) &&
    isLongText(value.summary)
  );
}

function isOverall(value: AnalysisResult["overall"]): boolean {
  return Boolean(
    value &&
    isLongText(value.opening) &&
    isStringList(value.strengths) &&
    isStringList(value.resistances) &&
    isStringList(value.confirmations)
  );
}

function isSection(value: SectionReport): boolean {
  return Boolean(
    value &&
    typeof value.title === "string" &&
    isLongText(value.overall) &&
    isLongText(value.past) &&
    isLongText(value.present) &&
    isLongText(value.future) &&
    isLongText(value.reminder)
  );
}

function isStringList(value: string[]): boolean {
  return Array.isArray(value) && value.length === 3 && value.every((item) => typeof item === "string" && item.length >= 6);
}

function isLongText(value: unknown): boolean {
  return typeof value === "string" && value.length >= 12;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
