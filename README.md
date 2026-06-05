# AI 姓名学初步分析

一个 mobile-first 的仿 App 网页程序，用于免费生成姓名学初步参考报告，并引导用户通过 WhatsApp 进一步咨询老师。

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- 本地 mock data 与规则引擎
- localStorage 保存最近一次分析结果

## 路由

- `/` 首页
- `/analysis` 输入资料与分析 loading
- `/result` 姓名学初步报告

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## WhatsApp 设置

可在 `.env.local` 设置号码：

```bash
NEXT_PUBLIC_WHATSAPP_NUMBER=60193153065
```

如果没有设置，系统会使用 placeholder `60123456789`。

## OpenAI 报告润色

可在 `.env.local` 设置 OpenAI API key：

```bash
OPENAI_API_KEY=replace_with_your_openai_key
```

系统会先用本地规则引擎生成姓名结构、五行、笔画、分数与报告基础内容，再调用 `/api/generate-report` 让 OpenAI 润色文案。AI 只负责把本地规则引擎输出写得更像真人老师，不会改变分数、格局、五行、笔画或姓名拆字结果。

如果没有 `OPENAI_API_KEY`，或 OpenAI 请求失败，系统会自动使用本地模板报告。

## 代码结构

```text
app/
  page.tsx
  analysis/page.tsx
  result/page.tsx
  api/generate-report/route.ts
components/
  AppShell.tsx
  InputForm.tsx
  LoadingAnalysis.tsx
  ResultCard.tsx
  CharacterCard.tsx
  SectionReportCard.tsx
  ScoreCard.tsx
  WhatsAppButton.tsx
lib/
  astro/
    lunarAdapter.ts
    timeCalibration.ts
    ziweiChart.ts
    starElementMap.ts
  database/
    schema.ts
    funnelDatabase.ts
  funnel/
    leadFunnelEngine.ts
  matching/
    knowledgeBase.ts
    starNameMatcher.ts
  name/
    fiveGrid.ts
    kangxiStrokes.ts
    nameElement.ts
  report/
    generateAnalysis.ts
  metaphysicsEngine.ts
  nameAnalysis.ts
types/
  analysis.ts
```

## 底层逻辑数据库

第一版先使用 typed local database，之后可以迁移到 Supabase：

- `lib/database/schema.ts` 定义姓名字典、生肖字根、紫微星曜、十神、冲突检测与商业漏斗资料表结构
- `lib/database/funnelDatabase.ts` 存放裂变、雷达图、流年提醒、案例证明、WhatsApp 标签与弃单挽回规则
- `lib/database/ziweiStarNaming.ts` 存放 14 主星的定名气质矩阵，用命宫看内在气质、迁移宫看个人品牌形象
- `lib/funnel/leadFunnelEngine.ts` 根据报告结果生成 `funnelAnalysis`，供结果页和 WhatsApp CTA 使用

这套结构的目标是让“命理判断”和“成交漏斗”都数据化。后续若接后台，可直接把这些 records 拆成 Supabase tables，例如 `funnel_features`、`energy_radar_rules`、`authority_cases`、`conversion_tag_rules`、`lead_recovery_rules`。

紫微姓名学规则目前拆成三层：

- `Blueprint`：主星磁场与命名方向，例如紫微/天府归为帝王领导型，七杀/破军归为开创突破型
- `Pain Point`：主星气质与现用名错位时的温和痛点提醒
- `Ruleset`：主星类型 × 姓名位置 × 五行/字义标签的交叉验证规则，用于形成双重扣分与 WhatsApp 咨询角度

出生时辰采用“准确优先、可降级初排”的漏斗策略：用户知道准确时间时可提升命宫和迁移宫判断；不知道时辰时系统以中午初排，并在报告里标记“需老师校时”，避免表单过硬导致潜在客户流失。

## 双端口报告漏斗

系统现在支持两个报告入口：

- 免费版基础检测：约 3-5 页，用于引流、指出最大痛点、制造半饱感
- 付费版深度报告：约 15 页，用于 WhatsApp 下单解锁，后续可接 Stripe、ToyyibPay、Billplz、SenangPay 或其他付款网关

第一版不直接处理线上付款，而是把付费意向、姓名、分数、最低痛点与系统标签带入 WhatsApp，方便人工收单和验证转化率。

## Facebook 分享解锁

第一版采用“丝滑分享 + WhatsApp 截图领取”的方式：

- 用户点击 Facebook 分享按钮
- 系统用 localStorage 记录已触发分享动作
- 页面显示 WhatsApp 领取 PDF 按钮
- 用户发送截图和暗号 `领取PDF`
- 助理或老师人工核验后交付 PDF

这个版本不调用 Facebook Graph API 验证真实发布，优先保证体验顺畅和私域沉淀。后续若需要严格防作弊，可接 Meta API、Supabase 记录分享事件，或改为 WhatsApp 截图人工审核。

## 后续扩展建议

- 将 `lib/nameAnalysis.ts` 的 mock 字库替换为真实姓名学数据库
- 增加 Supabase 保存 leads 与分析记录
- 使用 OpenAI API 生成更细腻的报告文案
- 在 WhatsApp CTA 前加入事件追踪与转化漏斗数据

## 语气原则

报告内容全部使用初步参考、温和提醒、需要进一步确认等表达，不做恐吓、不断言灾祸、不承诺改变命运，也不提供医疗、法律或投资建议。
