import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ResultCard } from "@/components/ResultCard";

const sellingPoints = [
  "拆解姓名五行与字义能量",
  "分析家庭、事业、爱情三大方向",
  "找出名字中可能卡住你的关键点"
];

export default function HomePage() {
  return (
    <AppShell textured>
      <section className="pb-8 pt-5">
        <div className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-warmGray shadow-soft">
          专业姓名学初步问诊
        </div>
        <h1 className="text-[2.35rem] font-semibold leading-[1.13] tracking-normal text-ink">
          你的名字，藏着你的人生能量
        </h1>
        <p className="mt-5 text-[15px] leading-7 text-warmGray">
          输入中文姓名与生肖，免费生成一份专业姓名学初步分析，从家庭、事业、爱情三个方向看见你的过去、现在与未来。
        </p>
      </section>

      <section className="space-y-3">
        {sellingPoints.map((point, index) => (
          <div key={point} className="flex items-center gap-4 rounded-[22px] border border-white/12 bg-white/10 p-4 shadow-soft backdrop-blur">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-moss to-mossSoft text-sm font-semibold text-white">
              {index + 1}
            </span>
            <p className="text-sm font-medium leading-6 text-white">{point}</p>
          </div>
        ))}
      </section>

      <Link
        href="/analysis"
        className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-moss via-[#E944B7] to-mossSoft px-4 text-base font-semibold text-white shadow-soft transition active:scale-[0.98]"
      >
        免费开始分析
      </Link>

      <ResultCard subtle>
        <p className="text-xs leading-6 text-warmGray">
          本分析属于姓名学与民俗文化角度的初步参考，不代表绝对命运判断。完整判断需结合个人资料由老师进一步分析。
        </p>
      </ResultCard>
    </AppShell>
  );
}
