import type {
  AnnualLuckRuleRecord,
  AuthorityCaseRecord,
  ConversionTagRuleRecord,
  EnergyRadarRuleRecord,
  FunnelFeatureRecord,
  LeadRecoveryRuleRecord,
  ReportProductRecord,
  SharePosterTemplateRecord,
  ViralUnlockRuleRecord
} from "@/lib/database/schema";

export const funnelFeatures: FunnelFeatureRecord[] = [
  {
    key: "partnerTest",
    enabled: true,
    stage: "裂变",
    title: "双人姓名契合度",
    purpose: "让用户自然转发给伴侣、合作伙伴或家人，形成二次传播。"
  },
  {
    key: "sharePoster",
    enabled: true,
    stage: "裂变",
    title: "专属姓名诊断海报",
    purpose: "用分数和一句高记忆点评语生成可分享素材。"
  },
  {
    key: "energyRadar",
    enabled: true,
    stage: "视觉",
    title: "五行能量雷达图",
    purpose: "把姓名五行缺口可视化，让用户更快理解为什么需要细看。"
  },
  {
    key: "annualWarning",
    enabled: true,
    stage: "视觉",
    title: "流年趋势提醒",
    purpose: "结合当前年份做温和时效提醒，提高立即咨询动机。"
  },
  {
    key: "authorityProof",
    enabled: true,
    stage: "成交",
    title: "同频案例证明",
    purpose: "用脱敏案例建立 Master Easy 的经验可信度。"
  },
  {
    key: "leadTagging",
    enabled: true,
    stage: "成交",
    title: "自动化标签系统",
    purpose: "WhatsApp 预设文字带出用户最低分痛点，方便老师快速切入。"
  },
  {
    key: "leadRecovery",
    enabled: true,
    stage: "挽回",
    title: "未完成表单挽回",
    purpose: "先用 localStorage 记录，未来可接 Supabase、n8n 或 WhatsApp API。"
  }
];

export const energyRadarRules: EnergyRadarRuleRecord[] = [
  {
    element: "金",
    businessLabel: "判断力 / 贵人边界",
    lowText: "金气偏弱时，做选择容易犹豫，贵人和边界感需要进一步确认。",
    highText: "金气明显，标准与判断力强，但关系里要避免过度紧绷。"
  },
  {
    element: "木",
    businessLabel: "成长力 / 人际舒展",
    lowText: "木气偏弱时，成长空间和人际舒展感可能不足，容易觉得被环境压住。",
    highText: "木气明显，学习力和扩展力较强，但方向太多时会分散。"
  },
  {
    element: "水",
    businessLabel: "流动财 / 情绪感受",
    lowText: "水气偏弱时，财运流动、情绪表达和弹性沟通需要老师进一步细看。",
    highText: "水气明显，感受力与洞察力强，但容易想太多、心里耗。"
  },
  {
    element: "火",
    businessLabel: "曝光度 / 行动力",
    lowText: "火气偏弱时，行动、表达和被看见的能量较慢，机会可能来得不够快。",
    highText: "火气明显，表达和行动力强，但要留意急切导致判断失衡。"
  },
  {
    element: "土",
    businessLabel: "稳定度 / 承担力",
    lowText: "土气偏弱时，稳定感、承接力和长期累积需要进一步确认。",
    highText: "土气明显，责任感和承接力强，但容易把压力都放在自己身上。"
  }
];

export const annualLuckRules: AnnualLuckRuleRecord[] = [
  {
    year: 2026,
    stemBranch: "丙午",
    zodiac: "马",
    element: "火",
    cautionRoots: ["子", "鼠", "水", "氵", "马", "午"],
    title: "2026 丙午流年趋势提醒",
    textTemplate:
      "2026 年丙午火气较明显，若名字里水火拉扯较重，事业表达、财务流动或感情沟通可能更容易被触动。这里不作绝对判断，只建议把今年的节奏交给老师进一步确认。"
  }
];

export const authorityCases: AuthorityCaseRecord[] = [
  {
    caseId: "case-career-001",
    painType: "事业",
    matchTags: ["事业需确认", "贵人不稳", "官禄宫"],
    title: "同频案例：事业方向反复",
    anonymizedText:
      "在过往咨询中，有客户的姓名人格与官禄宫呈现拉扯，现实上表现为努力不少，但方向经常被外界影响。老师后续会先确认命盘主轴，再判断名字是否需要调整。",
    ctaAngle: "适合预约老师细看事业、贵人和财帛宫。"
  },
  {
    caseId: "case-love-001",
    painType: "感情",
    matchTags: ["感情需确认", "迁移宫", "情绪消耗"],
    title: "同频案例：感情沟通卡住",
    anonymizedText:
      "有些名字不是没有桃花，而是迁移宫与姓名外格之间有消耗感，现实里容易出现想很多、讲不出口或关系里反复确认安全感的情况。",
    ctaAngle: "适合预约老师细看感情模式与婚姻能量。"
  },
  {
    caseId: "case-money-001",
    painType: "财运",
    matchTags: ["财运需确认", "财帛宫", "守财"],
    title: "同频案例：有收入但难累积",
    anonymizedText:
      "部分客户名字里有赚钱机会，却在总格、财帛宫或生肖字根上出现暗耗，现实上比较像钱会进来，但留住和规划需要更细的结构判断。",
    ctaAngle: "适合预约老师细看财帛宫、总格和守财模式。"
  },
  {
    caseId: "case-overall-001",
    painType: "整体",
    matchTags: ["整体", "需要细看", "紫微易名"],
    title: "同频案例：名字不是坏，而是用错力",
    anonymizedText:
      "很多名字并不是单纯不好，而是没有补到命盘真正需要的位置。初步报告只能看表层，完整咨询会把命宫、迁移、官禄、财帛和姓名五格一起核对。",
    ctaAngle: "适合预约老师做完整紫微易名判断。"
  }
];

export const conversionTagRules: ConversionTagRuleRecord[] = [
  {
    key: "career-low",
    painType: "事业",
    when: "事业分数最低或官禄宫规则为负",
    tags: ["事业需确认", "贵人不稳", "官禄宫"],
    whatsappIntent: "我的测试结果显示事业与贵人能量需要确认，想预约 Master Easy 做深度解析。"
  },
  {
    key: "love-low",
    painType: "感情",
    when: "感情分数最低或迁移宫规则为负",
    tags: ["感情需确认", "婚姻沟通", "迁移宫"],
    whatsappIntent: "我的测试结果显示感情与婚姻能量需要确认，想预约 Master Easy 做深度解析。"
  },
  {
    key: "money-low",
    painType: "财运",
    when: "财运分数最低或财帛宫规则为负",
    tags: ["财运需确认", "守财", "财帛宫"],
    whatsappIntent: "我的测试结果显示财运与守财能量需要确认，想预约 Master Easy 做深度解析。"
  },
  {
    key: "overall-review",
    painType: "整体",
    when: "没有明显单一低分",
    tags: ["整体复核", "紫微易名", "适合细看"],
    whatsappIntent: "我想确认这个名字是否适合继续使用，并预约 Master Easy 做完整姓名命格分析。"
  }
];

export const sharePosterTemplates: SharePosterTemplateRecord[] = [
  {
    key: "neo-chinese-minimal",
    visualStyle: "新中式极简深紫星盘风，保留姓名、分数、一句评语和二维码。",
    headlineTemplate: "{name} 的姓名能量初诊",
    quoteTemplates: [
      "你的名字不是没能量，而是有一处需要被看懂。",
      "这个名字有助力，也藏着需要老师进一步确认的卡点。",
      "名字是命局的外衣，合不合身，要看它补到哪里。"
    ]
  }
];

export const leadRecoveryRules: LeadRecoveryRuleRecord[] = [
  {
    key: "partial-form-local",
    enabled: true,
    trigger: "partial_form",
    delayMinutes: 30,
    storageKey: "ai-name-analysis:partial-lead",
    messageTemplate:
      "您的姓名初步报告资料已保存。如果你希望老师稍后联系你，可以留下 WhatsApp，老师会先从分数较低的方向帮你看。"
  }
];

export const reportProducts: ReportProductRecord[] = [
  {
    tier: "free",
    title: "免费版基础检测",
    pageCount: "约 3-5 页",
    priceLabel: "免费",
    goal: "制造半饱感，指出最需要确认的痛点。",
    includes: [
      "姓名整体分数与三大宫位最低项",
      "最明显的名、情、财痛点截取",
      "命宫/迁移宫与现用名的初步错位提醒",
      "WhatsApp 老师进一步确认入口"
    ],
    lockedTeasers: [
      "名运宫：是否有小人、人际或事业瓶颈？",
      "情缘宫：是否存在沟通摩擦或男女忌用字？",
      "财帛宫：财富流动与守财位置是否被名字影响？"
    ],
    cta: "继续查看免费基础检测",
    whatsappIntent: "我想先领取免费版姓名基础检测，并确认是否需要升级 15 页完整报告。"
  },
  {
    tier: "paid",
    title: "15页紫微姓名学深度诊断书",
    pageCount: "约 15 页",
    priceLabel: "早鸟价 RM XX",
    goal: "用完整报告建立权威，并导向一对一真人咨询。",
    includes: [
      "紫微命宫/迁移宫主星定名诊断",
      "三才五格与 1-20 / 21-40 / 41+ 时间轴拆解",
      "生肖、字形、字音、字义、男女忌用字扫描",
      "2026 流年趋势提醒与关键月份提示",
      "付费报告可作为后续一对一咨询抵扣参考"
    ],
    lockedTeasers: [
      "完整查看你的主星气质是否被现用名拖低",
      "完整查看名一对 21-40 岁事业与感情的影响",
      "完整查看名二对财富累积和后劲的影响"
    ],
    cta: "WhatsApp 下单解锁 15 页完整报告",
    whatsappIntent: "我想购买 15 页紫微姓名学深度诊断书，请告诉我付款方式和领取流程。"
  }
];

export const viralUnlockRules: ViralUnlockRuleRecord[] = [
  {
    key: "facebook-pdf-unlock",
    title: "分享解锁免费 PDF 报告",
    subtitle: "分享你的姓名能量卡至 Facebook 或 Instagram，并 tag 官方帐号，截图发送 WhatsApp，即可领取免费 PDF 初步报告。",
    lockedModules: [
      "名运宫：事业品牌与社会声望细节",
      "情缘宫：亲密关系与高价值人际网",
      "财帛宫：财库守卫与流年提醒"
    ],
    unlockCode: "领取PDF",
    storageKey: "ai-name-analysis:facebook-unlock",
    facebookTextTemplates: [
      "我刚做了 AI 紫微姓名学初步检测，系统说我的名字里有一个需要进一步确认的能量卡点。你也可以测看看自己的名字有没有在拖后腿。",
      "测了一下我的名字能量，分数和名、情、财分析有点准。想知道你的名字是助力还是阻力，可以试试看这个免费检测。",
      "名字是命局的外衣。刚用 AI 测了我的姓名能量，发现有一处需要老师细看。"
    ],
    whatsappIntent: "我已经分享 Facebook / Instagram 姓名检测贴文，并 tag 官方帐号，想凭截图领取免费 PDF 初步报告。"
  }
];
