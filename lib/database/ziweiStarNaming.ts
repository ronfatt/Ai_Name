import type { ZiweiNameCrossCheckRuleRecord, ZiweiStarNamingDirectionRecord } from "@/lib/database/schema";

export const ziweiStarNamingDirections: ZiweiStarNamingDirectionRecord[] = [
  {
    stars: ["紫微"],
    archetype: "帝王领导型",
    naturalField: "尊贵、大局观强，具领导力与主导感，也需要被尊重和被信任。",
    nameDirection: "名字需要有重量感、包容性与格局感；字形宜稳重方正，字音宜浑厚响亮。",
    personalBrandDirection: "对外形象要让人感觉稳、能定局、能聚人，不宜过分单薄、漂浮或缺少主轴。",
    preferredMeaningTags: ["重量", "包容", "格局", "尊贵", "统御"],
    exampleChars: ["泰", "乾", "宇", "瀚", "容", "恩"],
    mismatchPain:
      "若紫微星遇到过于单薄、细碎、漂浮或阴柔的名字，容易形成格局感没有被承托的落差，现实中比较像有全局视野，却常要亲力亲为。",
    safePublicText:
      "紫微星重领导与承载。若现用名气场偏轻，初步看会让事业名运宫出现“有格局但不易聚人”的感觉，需要老师结合命宫和官禄宫进一步确认。",
    ctaAngle: "适合预约易玺师傅确认紫微格局是否被名字真正承托。"
  },
  {
    stars: ["七杀"],
    archetype: "开创突破型",
    naturalField: "敢拼敢闯、行动力强、果决直接，带有开创与突破的强磁场。",
    nameDirection: "七杀本身刚猛，名字不宜再火上加火；更适合以水性、柔和、知性、有涵养的字来形成刚柔并济。",
    personalBrandDirection: "对外形象要有行动感，也要有温度和边界，避免让人只感到强势或难靠近。",
    preferredMeaningTags: ["柔和", "涵养", "清润", "知性", "边界"],
    exampleChars: ["润", "涵", "谦", "渊", "柔", "清"],
    mismatchPain:
      "若七杀星再叠加锋利、急躁、兵器感或火性过强的名字，容易让锐气过满，人际合作和亲密沟通都需要特别复核。",
    safePublicText:
      "七杀星重开创，也重制衡。若名字过刚，初步看会让行动力变成沟通摩擦，事业合作、感情表达和财富流动都需要老师进一步确认。",
    ctaAngle: "适合预约老师细看七杀格局如何通过名字做到刚柔并济。"
  },
  {
    stars: ["天府"],
    archetype: "帝王领导型",
    naturalField: "尊贵、包容、有大局观，适合承担位置与资源整合。",
    nameDirection: "大气磅礴、稳重尊贵、有格局感，名字需要撑得起领导星的分量。",
    personalBrandDirection: "对外形象要让人感觉稳、可信、有主心骨，不宜过分轻浮或过小。",
    preferredMeaningTags: ["格局", "尊贵", "承载", "广阔", "权威"],
    exampleChars: ["瀚", "玺", "钧", "奕", "赫", "廷"],
    mismatchPain:
      "若现用名气场太弱，容易出现心里有抱负，但对外不够有分量，职场或客户面前难以完全服众的感受。",
    safePublicText:
      "帝王领导型主星最重名字的承载感。若名字字义太轻或过于柔弱，初步看会让内在格局和外在呈现之间有落差，需要老师进一步确认。",
    ctaAngle: "适合预约易玺师傅做领导格局与个人品牌磁场诊断。"
  },
  {
    stars: ["天机", "太阴", "天同", "天梁"],
    archetype: "智谋文雅型",
    naturalField: "聪慧、细腻、思虑周全，带有军师、学者或疗愈型气质。",
    nameDirection: "儒雅清隽、智慧内敛、灵动清新，名字要有文化底蕴和精神共鸣。",
    personalBrandDirection: "对外形象适合走专业、温和、可信任的路线，避免过度刚烈或俗气。",
    preferredMeaningTags: ["智慧", "清雅", "书卷", "涵养", "灵动"],
    exampleChars: ["睿", "哲", "彦", "修", "涵", "栩"],
    mismatchPain:
      "若名字磁场过刚或过俗，容易让本来细腻聪明的气质变成劳心、想太多、收成慢的感觉。",
    safePublicText:
      "智谋文雅型主星重精神气质。若名字缺少清雅和智慧感，初步看会让思考力变成内耗，事业表达也可能比较慢热。",
    ctaAngle: "适合预约老师细看智慧型主星如何通过名字放大专业度。"
  },
  {
    stars: ["武曲", "天相"],
    archetype: "刚毅财富型",
    naturalField: "务实、果决、重规则，执行力和财富敏锐度较强。",
    nameDirection: "干练果断、方正有威、现代知性，名字结构宜利落、有金石之坚。",
    personalBrandDirection: "对外形象适合清楚、可靠、有边界，避免含糊或过度柔散。",
    preferredMeaningTags: ["果断", "财富", "秩序", "坚毅", "规则"],
    exampleChars: ["铮", "楷", "航", "锋", "颂", "衡"],
    mismatchPain:
      "若名字过软或结构散，容易让财富星的执行力无法集中，现实里像有能力却不容易把成果稳定留下。",
    safePublicText:
      "刚毅财富型主星重执行与守成。若名字缺少利落感，初步看会影响事业定价、守财和个人边界，需要进一步确认。",
    ctaAngle: "适合预约老师细看事业、财富敏锐度与守财结构。"
  },
  {
    stars: ["破军", "廉贞", "贪狼"],
    archetype: "开创突破型",
    naturalField: "敢拼敢闯、特立独行，生命力强，适合变化、突破和开创新局。",
    nameDirection: "独特不俗、充满张力、具有爆发力，名字不能太平庸，也不能失控过烈。",
    personalBrandDirection: "对外形象要有辨识度和行动感，同时保留稳定边界，避免让人觉得难以掌握。",
    preferredMeaningTags: ["突破", "张力", "行动", "吸引力", "开创"],
    exampleChars: ["曜", "骁", "峥", "澈", "旸", "翊"],
    mismatchPain:
      "若名字太平、太弱，容易压住开创星的爆发力；若名字又过烈，则可能放大冲动和关系摩擦。",
    safePublicText:
      "开创突破型主星最怕名字没有辨识度，也怕能量过头。这个类型要看名字是否能把冲劲导向事业和个人品牌，而不是变成反复消耗。",
    ctaAngle: "适合预约老师细看开创格局、事业突破与个人品牌定位。"
  }
];

export const ziweiNameCrossCheckRules: ZiweiNameCrossCheckRuleRecord[] = [
  {
    stars: ["紫微"],
    archetype: "帝王领导型",
    avoidElements: ["水"],
    avoidMeaningTags: ["单薄", "细碎", "漂泊", "孤弱", "阴柔", "萍", "絮", "枝", "微", "飘"],
    namePosition: "名字第一字",
    affectedArea: "事业",
    scoreDelta: -12,
    triggerLabel: "紫微星名一重量不足",
    safeWarning:
      "紫微星最重格局与承托。名一若显得过轻或漂浮，初步看会让事业名运宫出现格局未开、贵人不易聚拢的感觉。",
    ctaAngle: "适合让老师确认名一是否承得起紫微星的领导格局。"
  },
  {
    stars: ["七杀"],
    archetype: "开创突破型",
    avoidElements: ["金", "火"],
    avoidMeaningTags: ["兵器", "锋利", "急躁", "过烈", "猛", "刃", "烈", "锋"],
    namePosition: "任意",
    affectedArea: "感情",
    scoreDelta: -12,
    triggerLabel: "七杀星名字过刚易折",
    safeWarning:
      "七杀星本身行动力强，若名字再带过强金火或锋利之象，容易让人际合作与亲密沟通出现生硬感，需要进一步确认是否形成过刚易折。",
    ctaAngle: "适合让老师细看七杀格局、人际磁场与感情沟通。"
  },
  {
    archetype: "帝王领导型",
    avoidElements: ["水"],
    avoidMeaningTags: ["柔弱", "漂浮", "小气", "轻浮"],
    namePosition: "名字第一字",
    affectedArea: "事业",
    scoreDelta: -10,
    triggerLabel: "帝王星名一承载不足",
    safeWarning:
      "命宫或迁移宫带帝王领导型主星时，名字第一字若过轻或过散，容易让格局感不够外显，事业与客户信任度需要进一步确认。",
    ctaAngle: "适合让老师确认名字是否撑得起领导格局与事业位置。"
  },
  {
    archetype: "智谋文雅型",
    avoidElements: ["火", "金"],
    avoidMeaningTags: ["刚烈", "破局", "冲动", "俗气"],
    namePosition: "任意",
    affectedArea: "感情",
    scoreDelta: -8,
    triggerLabel: "智谋星与名字磁场过刚",
    safeWarning:
      "智谋文雅型主星重精神共鸣。若姓名磁场过刚或过急，比较像思考力被压力拉扯，感情沟通和事业表达都需要细看。",
    ctaAngle: "适合让老师确认名字是否放大内耗或沟通摩擦。"
  },
  {
    archetype: "刚毅财富型",
    avoidElements: ["水", "木"],
    avoidMeaningTags: ["柔散", "漂浮", "无根", "迟疑"],
    namePosition: "名字第二字",
    affectedArea: "财运",
    scoreDelta: -9,
    triggerLabel: "财富星名二守成不足",
    safeWarning:
      "刚毅财富型主星重执行与守成。若名二能量偏散，初步看会影响中后期成果沉淀、定价与守财节奏。",
    ctaAngle: "适合让老师细看总格、财帛宫和名二财库。"
  },
  {
    archetype: "开创突破型",
    avoidElements: ["土", "火"],
    avoidMeaningTags: ["过烈", "失控", "平庸", "压抑"],
    namePosition: "名字第一字",
    affectedArea: "个人品牌",
    scoreDelta: -9,
    triggerLabel: "开创星名一张力失衡",
    safeWarning:
      "开创突破型主星需要辨识度和边界。若名字太平会压住冲劲，若过烈又会放大摩擦，个人品牌和合作关系需要老师进一步确认。",
    ctaAngle: "适合让老师细看开创格局如何通过名字稳住张力。"
  }
];

export function getZiweiStarNamingDirection(star?: string): ZiweiStarNamingDirectionRecord {
  return ziweiStarNamingDirections.find((direction) => direction.stars.includes(star ?? "")) ?? {
    stars: [star ?? "空宫"],
    archetype: "智谋文雅型",
    naturalField: "此宫位主星需要结合对宫和四化进一步确认，第一版先以温和专业型处理。",
    nameDirection: "名字宜平衡、耐看、有涵养，避免过轻或过烈。",
    personalBrandDirection: "对外形象先看稳定和可信任，再由老师结合完整命盘细分。",
    preferredMeaningTags: ["平衡", "涵养", "稳定"],
    exampleChars: ["安", "修", "涵", "廷"],
    mismatchPain: "主星资料不足时，不适合直接下重判断，需要进一步确认出生时辰与完整命盘。",
    safePublicText: "此处先做初步参考，完整判断需要结合对宫、四化和全盘结构。",
    ctaAngle: "适合预约老师校时并细看完整命盘。"
  };
}

export function getZiweiNameCrossCheckRules(archetype: ZiweiStarNamingDirectionRecord["archetype"]): ZiweiNameCrossCheckRuleRecord[] {
  return ziweiNameCrossCheckRules.filter((rule) => rule.archetype === archetype);
}
