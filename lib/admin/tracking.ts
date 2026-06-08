import type { AnalysisResult, NameAnalysisInput, ReportTier } from "@/types/analysis";

export type AdminEventType =
  | "form_submit"
  | "report_generated"
  | "whatsapp_click"
  | "lead_capture"
  | "paid_preview_unlock"
  | "facebook_share_click";

export interface AdminTrackPayload {
  eventType: AdminEventType;
  leadId?: string;
  sessionId?: string;
  name?: string;
  phone?: string;
  zodiac?: string;
  gender?: string;
  focus?: string;
  reportTier?: ReportTier;
  score?: number;
  primaryPain?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface AiUsagePayload {
  leadId?: string;
  sessionId?: string;
  model: string;
  source: "openai" | "local";
  status: "success" | "fallback" | "error";
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  metadata?: Record<string, unknown>;
}

export interface AdminDashboardData {
  configured: boolean;
  summary: {
    totalReports: number;
    freeReports: number;
    paidIntentReports: number;
    whatsappClicks: number;
    capturedLeads: number;
    totalAiTokens: number;
    estimatedAiCostUsd: number;
    paidCustomers: number;
    estimatedRevenueMyr: number;
  };
  recentEvents: AdminTrackPayload[];
  recentUsage: AiUsagePayload[];
  warnings: string[];
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const OPENAI_PRICE_PER_1M_TOKENS = {
  input: Number(process.env.ADMIN_OPENAI_INPUT_USD_PER_1M || 0.15),
  output: Number(process.env.ADMIN_OPENAI_OUTPUT_USD_PER_1M || 0.6)
};

export function isAdminStorageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export function estimateOpenAiCost(inputTokens: number, outputTokens: number): number {
  const inputCost = (inputTokens / 1_000_000) * OPENAI_PRICE_PER_1M_TOKENS.input;
  const outputCost = (outputTokens / 1_000_000) * OPENAI_PRICE_PER_1M_TOKENS.output;
  return roundMoney(inputCost + outputCost);
}

export async function trackAdminEvent(payload: AdminTrackPayload): Promise<void> {
  if (!isAdminStorageConfigured()) return;

  await supabaseInsert("events", {
    event_type: payload.eventType,
    lead_id: payload.leadId,
    session_id: payload.sessionId,
    name: payload.name,
    phone: payload.phone,
    zodiac: payload.zodiac,
    gender: payload.gender,
    focus: payload.focus,
    report_tier: payload.reportTier,
    score: payload.score,
    primary_pain: payload.primaryPain,
    source: payload.source,
    metadata: payload.metadata ?? {}
  });

  if (payload.eventType === "lead_capture" || payload.eventType === "report_generated") {
    await upsertLeadSnapshot(payload);
  }
}

export async function trackReportGeneration(params: {
  analysis: AnalysisResult;
  source: "openai" | "local";
  status: "success" | "fallback" | "error";
  usage?: AiUsagePayload;
  errorMessage?: string;
}): Promise<void> {
  if (!isAdminStorageConfigured()) return;

  const input = params.analysis.userInput;
  const primaryPain = params.analysis.funnelAnalysis?.conversionTags?.primaryPain;

  await supabaseInsert("reports", {
    lead_id: input.trackingId,
    session_id: input.sessionId,
    name: input.name,
    zodiac: input.zodiac,
    gender: input.gender,
    focus: input.focus,
    report_tier: input.reportTier || "free",
    score: params.analysis.score,
    pattern_name: params.analysis.patternName,
    primary_pain: primaryPain,
    source: params.source,
    status: params.status,
    error_message: params.errorMessage,
    analysis_snapshot: shrinkAnalysis(params.analysis)
  });

  await trackAdminEvent({
    eventType: "report_generated",
    leadId: input.trackingId,
    sessionId: input.sessionId,
    name: input.name,
    zodiac: input.zodiac,
    gender: input.gender,
    focus: input.focus,
    reportTier: input.reportTier,
    score: params.analysis.score,
    primaryPain,
    source: params.source,
    metadata: {
      status: params.status,
      patternName: params.analysis.patternName,
      errorMessage: params.errorMessage
    }
  });

  if (params.usage) {
    await trackAiUsage(params.usage);
  }
}

export async function trackAiUsage(payload: AiUsagePayload): Promise<void> {
  if (!isAdminStorageConfigured()) return;

  await supabaseInsert("ai_usage", {
    lead_id: payload.leadId,
    session_id: payload.sessionId,
    model: payload.model,
    source: payload.source,
    status: payload.status,
    input_tokens: payload.inputTokens,
    output_tokens: payload.outputTokens,
    total_tokens: payload.totalTokens,
    estimated_cost_usd: payload.estimatedCostUsd,
    metadata: payload.metadata ?? {}
  });
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const warnings: string[] = [];

  if (!isAdminStorageConfigured()) {
    return {
      configured: false,
      summary: {
        totalReports: 0,
        freeReports: 0,
        paidIntentReports: 0,
        whatsappClicks: 0,
        capturedLeads: 0,
        totalAiTokens: 0,
        estimatedAiCostUsd: 0,
        paidCustomers: 0,
        estimatedRevenueMyr: 0
      },
      recentEvents: [],
      recentUsage: [],
      warnings: [
        "后台数据层尚未连接。请在 Vercel 设置 SUPABASE_URL 与 SUPABASE_SERVICE_ROLE_KEY 后，用户行为会自动写入 Supabase。"
      ]
    };
  }

  const [events, reports, usage, payments] = await Promise.all([
    supabaseSelect<Record<string, unknown>>("events", "select=*&order=created_at.desc&limit=120"),
    supabaseSelect<Record<string, unknown>>("reports", "select=*&order=created_at.desc&limit=300"),
    supabaseSelect<Record<string, unknown>>("ai_usage", "select=*&order=created_at.desc&limit=300"),
    supabaseSelect<Record<string, unknown>>("payments", "select=*&order=created_at.desc&limit=300")
  ]);

  const totalAiTokens = usage.reduce((sum, item) => sum + numberValue(item.total_tokens), 0);
  const estimatedAiCostUsd = roundMoney(usage.reduce((sum, item) => sum + numberValue(item.estimated_cost_usd), 0));
  const paidIntentReports = reports.filter((item) => item.report_tier === "paid").length;
  const paidPayments = payments.filter((item) => item.status === "paid" || item.status === "succeeded");

  return {
    configured: true,
    summary: {
      totalReports: reports.length,
      freeReports: reports.filter((item) => item.report_tier !== "paid").length,
      paidIntentReports,
      whatsappClicks: events.filter((item) => item.event_type === "whatsapp_click").length,
      capturedLeads: events.filter((item) => item.event_type === "lead_capture").length,
      totalAiTokens,
      estimatedAiCostUsd,
      paidCustomers: paidPayments.length,
      estimatedRevenueMyr: roundMoney(paidPayments.reduce((sum, item) => sum + numberValue(item.amount_myr), 0))
    },
    recentEvents: events.slice(0, 30).map(mapEventRow),
    recentUsage: usage.slice(0, 30).map(mapUsageRow),
    warnings
  };
}

export function buildTrackPayloadFromInput(input: NameAnalysisInput, eventType: AdminEventType): AdminTrackPayload {
  return {
    eventType,
    leadId: input.trackingId,
    sessionId: input.sessionId,
    name: input.name,
    zodiac: input.zodiac,
    gender: input.gender,
    focus: input.focus,
    reportTier: input.reportTier,
    source: "webapp"
  };
}

async function upsertLeadSnapshot(payload: AdminTrackPayload): Promise<void> {
  await supabaseUpsert("leads", {
    lead_id: payload.leadId || payload.sessionId || crypto.randomUUID(),
    session_id: payload.sessionId,
    name: payload.name,
    phone: payload.phone,
    zodiac: payload.zodiac,
    gender: payload.gender,
    focus: payload.focus,
    report_tier: payload.reportTier,
    score: payload.score,
    primary_pain: payload.primaryPain,
    latest_event: payload.eventType,
    metadata: payload.metadata ?? {}
  }, "lead_id");
}

async function supabaseInsert(table: string, row: Record<string, unknown>): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: supabaseHeaders(),
    body: JSON.stringify(stripUndefined(row))
  });

  if (!response.ok) {
    throw new Error(`Supabase insert ${table} failed: ${response.status}`);
  }
}

async function supabaseUpsert(table: string, row: Record<string, unknown>, conflictColumn: string): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${conflictColumn}`, {
    method: "POST",
    headers: {
      ...supabaseHeaders(),
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify(stripUndefined(row))
  });

  if (!response.ok) {
    throw new Error(`Supabase upsert ${table} failed: ${response.status}`);
  }
}

async function supabaseSelect<T>(table: string, query: string): Promise<T[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method: "GET",
    headers: supabaseHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Supabase select ${table} failed: ${response.status}`);
  }

  return (await response.json()) as T[];
}

function supabaseHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal"
  };
}

function stripUndefined(row: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== undefined));
}

function shrinkAnalysis(analysis: AnalysisResult): Record<string, unknown> {
  return {
    score: analysis.score,
    patternName: analysis.patternName,
    userInput: analysis.userInput,
    primaryPain: analysis.funnelAnalysis?.conversionTags?.primaryPain,
    conversionTags: analysis.funnelAnalysis?.conversionTags,
    teacherConclusion: analysis.teacherConclusion,
    scoreHook: analysis.scoreHook,
    timeline: analysis.timeline,
    painPoints: analysis.painPoints,
    ziweiKeyPalaces: analysis.ziweiChart?.keyPalaces,
    fiveGrid: analysis.fiveGrid
  };
}

function mapEventRow(row: Record<string, unknown>): AdminTrackPayload {
  return {
    eventType: String(row.event_type || "form_submit") as AdminEventType,
    leadId: stringValue(row.lead_id),
    sessionId: stringValue(row.session_id),
    name: stringValue(row.name),
    phone: stringValue(row.phone),
    zodiac: stringValue(row.zodiac),
    gender: stringValue(row.gender),
    focus: stringValue(row.focus),
    reportTier: (row.report_tier === "paid" ? "paid" : "free") as ReportTier,
    score: numberValue(row.score),
    primaryPain: stringValue(row.primary_pain),
    source: stringValue(row.source),
    metadata: row.metadata && typeof row.metadata === "object" ? row.metadata as Record<string, unknown> : {}
  };
}

function mapUsageRow(row: Record<string, unknown>): AiUsagePayload {
  return {
    leadId: stringValue(row.lead_id),
    sessionId: stringValue(row.session_id),
    model: stringValue(row.model) || "unknown",
    source: row.source === "openai" ? "openai" : "local",
    status: row.status === "success" ? "success" : row.status === "error" ? "error" : "fallback",
    inputTokens: numberValue(row.input_tokens),
    outputTokens: numberValue(row.output_tokens),
    totalTokens: numberValue(row.total_tokens),
    estimatedCostUsd: numberValue(row.estimated_cost_usd),
    metadata: row.metadata && typeof row.metadata === "object" ? row.metadata as Record<string, unknown> : {}
  };
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function roundMoney(value: number): number {
  return Math.round(value * 100_000) / 100_000;
}
