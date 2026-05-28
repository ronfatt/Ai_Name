import Link from "next/link";
import { AppShell } from "@/components/AppShell";

const sellingPoints = [
  ["▤", "拆解姓名五行与字义能量"],
  ["☯", "对照生肖喜忌与命格方向"],
  ["字", "找出名字中可能卡运的关键字"]
];

export default function HomePage() {
  return (
    <AppShell textured>
      <section className="relative pb-7 pt-5">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-warmGray shadow-soft">
          ✦ 专业姓名学初步问诊
        </div>
        <div className="absolute right-0 top-0 hidden min-[390px]:block">
          <div className="five-wheel scale-75">
            <span className="five-node left-[67px] top-[-2px]">火</span>
            <span className="five-node left-[-4px] top-[58px]">木</span>
            <span className="five-node right-[-4px] top-[58px]">土</span>
            <span className="five-node bottom-[12px] right-[20px]">金</span>
            <span className="five-node bottom-[12px] left-[20px]">水</span>
            <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-[#5B20B8]/80 text-3xl font-semibold text-white shadow-soft">名</span>
          </div>
        </div>
        <h1 className="relative max-w-[300px] text-[3.1rem] font-semibold leading-[1.12] tracking-normal text-white">
          你的名字，<br />是助力，还是阻力？
        </h1>
        <p className="mt-5 text-[17px] leading-8 text-warmGray">
          不只看笔画吉凶，而是从姓名五行、字义能量、生肖喜忌与紫微命格方向，初步分析你的事业、人际、感情与性格课题。
        </p>
      </section>

      <section className="space-y-3">
        {sellingPoints.map(([icon, point], index) => (
          <div key={point} className="flex items-center gap-4 rounded-[22px] border border-[#9E62FF]/45 bg-[#120A3A]/80 p-4 shadow-[0_0_30px_rgba(140,77,255,0.18)] backdrop-blur">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#FF4FD8] to-[#3C7CFF] text-xl font-semibold text-white shadow-soft">
              {index + 1}
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-xl text-white">{icon}</span>
            <p className="min-w-0 flex-1 text-[15px] font-semibold leading-6 text-white">{point}</p>
            <span className="text-3xl leading-none text-[#FF9DFF]">›</span>
          </div>
        ))}
      </section>

      <Link
        href="/analysis"
        className="mt-7 flex h-16 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#FF4FD8] via-[#C83BFF] to-[#2D8CFF] px-4 text-xl font-semibold tracking-wide text-white shadow-[0_0_38px_rgba(255,79,216,0.62)] transition active:scale-[0.98]"
      >
        立即免费检测名字
      </Link>

      <section className="mt-7 rounded-[22px] border border-[#9E62FF]/35 bg-white/8 p-4 shadow-soft backdrop-blur">
        <div className="flex gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-3xl">♢</span>
          <p className="text-sm leading-7 text-warmGray">
          本分析属于姓名学与民俗文化角度的初步参考，不代表绝对命运判断。完整判断需结合个人资料由老师进一步分析。
          </p>
        </div>
      </section>
    </AppShell>
  );
}
