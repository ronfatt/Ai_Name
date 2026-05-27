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
  nameAnalysis.ts
types/
  analysis.ts
```

## 后续扩展建议

- 将 `lib/nameAnalysis.ts` 的 mock 字库替换为真实姓名学数据库
- 增加 Supabase 保存 leads 与分析记录
- 使用 OpenAI API 生成更细腻的报告文案
- 在 WhatsApp CTA 前加入事件追踪与转化漏斗数据

## 语气原则

报告内容全部使用初步参考、温和提醒、需要进一步确认等表达，不做恐吓、不断言灾祸、不承诺改变命运，也不提供医疗、法律或投资建议。
