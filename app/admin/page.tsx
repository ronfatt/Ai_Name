import { getAdminDashboardData, type AdminDashboardData } from "@/lib/admin/tracking";
import type { ReactNode } from "react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AdminPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = (await searchParams) || {};
  const key = firstParam(params.key);
  const adminKey = process.env.ADMIN_ACCESS_KEY || "";

  if (!adminKey || key !== adminKey) {
    return <LockedAdmin configured={Boolean(adminKey)} />;
  }

  let data: AdminDashboardData;
  try {
    data = await getAdminDashboardData();
  } catch (error) {
    data = {
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
      warnings: [error instanceof Error ? error.message : "后台数据读取失败，请检查 Supabase 表结构与环境变量。"]
    };
  }

  return (
    <main className="min-h-screen bg-[#080018] px-4 py-6 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-[28px] border border-[#6F35D8]/55 bg-white/8 p-5 shadow-soft backdrop-blur">
          <p className="text-sm font-semibold text-gold">紫微易名 Admin</p>
          <h1 className="mt-2 text-3xl font-semibold">漏斗数据后台</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-warmGray">
            这里不会出现在前端导航。第一版用于查看免费/付费报告意向、WhatsApp 点击、留资、OpenAI token 与最近用户行为。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{data.configured ? "Supabase 已连接" : "Supabase 未连接"}</Badge>
            <Badge>只读后台</Badge>
            <Badge>实时读取</Badge>
          </div>
        </header>

        {data.warnings.length > 0 ? (
          <section className="rounded-[24px] border border-[#FFB84D]/35 bg-[#4C320D]/30 p-4">
            <h2 className="text-lg font-semibold text-gold">后台提醒</h2>
            <div className="mt-3 space-y-2">
              {data.warnings.map((warning) => (
                <p key={warning} className="text-sm leading-6 text-warmGray">{warning}</p>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-3 md:grid-cols-4">
          <Metric label="报告生成" value={data.summary.totalReports} detail={`免费 ${data.summary.freeReports}｜付费意向 ${data.summary.paidIntentReports}`} />
          <Metric label="WhatsApp 点击" value={data.summary.whatsappClicks} detail="所有 CTA 自动记录" />
          <Metric label="留资数量" value={data.summary.capturedLeads} detail="用户主动留下 WhatsApp" />
          <Metric label="付费顾客" value={data.summary.paidCustomers} detail={`收入 RM ${data.summary.estimatedRevenueMyr.toFixed(2)}｜AI USD ${data.summary.estimatedAiCostUsd.toFixed(5)}`} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-[#6F35D8]/55 bg-white/8 p-5 shadow-soft backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">最近用户行为</h2>
              <Badge>{data.recentEvents.length} 条</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs text-warmGray">
                  <tr className="border-b border-white/10">
                    <th className="py-3 pr-4">事件</th>
                    <th className="py-3 pr-4">姓名</th>
                    <th className="py-3 pr-4">报告端口</th>
                    <th className="py-3 pr-4">分数</th>
                    <th className="py-3 pr-4">痛点</th>
                    <th className="py-3 pr-4">电话</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-warmGray">还没有记录。连接 Supabase 后，真实用户行为会出现在这里。</td>
                    </tr>
                  ) : data.recentEvents.map((event, index) => (
                    <tr key={`${event.eventType}-${event.leadId || event.sessionId || index}`} className="border-b border-white/8">
                      <td className="py-3 pr-4 font-semibold text-white">{event.eventType}</td>
                      <td className="py-3 pr-4 text-warmGray">{event.name || "-"}</td>
                      <td className="py-3 pr-4 text-warmGray">{event.reportTier || "-"}</td>
                      <td className="py-3 pr-4 text-warmGray">{event.score || "-"}</td>
                      <td className="py-3 pr-4 text-warmGray">{event.primaryPain || "-"}</td>
                      <td className="py-3 pr-4 text-warmGray">{event.phone || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#6F35D8]/55 bg-white/8 p-5 shadow-soft backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">AI 成本</h2>
              <Badge>{data.recentUsage.length} 次</Badge>
            </div>
            <div className="space-y-3">
              {data.recentUsage.length === 0 ? (
                <p className="rounded-2xl border border-white/12 bg-white/10 p-4 text-sm leading-6 text-warmGray">
                  暂无 OpenAI 使用记录。没有 `OPENAI_API_KEY` 时会走本地模板 fallback。
                </p>
              ) : data.recentUsage.map((usage, index) => (
                <div key={`${usage.model}-${usage.leadId || index}`} className="rounded-2xl border border-white/12 bg-white/10 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{usage.model}</p>
                    <Badge>{usage.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-warmGray">
                    {usage.totalTokens} tokens｜输入 {usage.inputTokens}｜输出 {usage.outputTokens}
                  </p>
                  <p className="mt-1 text-xs text-gold">估算 USD {usage.estimatedCostUsd.toFixed(5)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-[#6F35D8]/55 bg-white/8 p-5 shadow-soft backdrop-blur">
          <h2 className="text-xl font-semibold">接下来可扩展</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["付款记录", "接 Stripe、Billplz 或手动标记 paid，用来算付费转化率。"],
              ["报告详情", "按姓名进入完整报告快照，看用户哪里被打动。"],
              ["投放归因", "加入 utm_source / campaign，判断哪组 Facebook 广告最会成交。"]
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/12 bg-white/10 p-4">
                <p className="font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm leading-6 text-warmGray">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function LockedAdmin({ configured }: { configured: boolean }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#080018] px-5 text-white">
      <section className="w-full max-w-md rounded-[28px] border border-[#6F35D8]/55 bg-white/8 p-6 text-center shadow-soft backdrop-blur">
        <p className="text-sm font-semibold text-gold">Admin Locked</p>
        <h1 className="mt-2 text-2xl font-semibold">后台入口已隐藏</h1>
        <p className="mt-3 text-sm leading-7 text-warmGray">
          请使用 `/admin?key=你的ADMIN_ACCESS_KEY` 进入。{configured ? "当前已设置后台密钥。" : "当前还没设置 ADMIN_ACCESS_KEY。"}
        </p>
      </section>
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div className="rounded-[24px] border border-[#6F35D8]/55 bg-white/8 p-5 shadow-soft backdrop-blur">
      <p className="text-sm text-warmGray">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-gold">{detail}</p>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-white/12 bg-white/10 px-3 py-1 text-xs font-semibold text-warmGray">
      {children}
    </span>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || "" : value || "";
}
