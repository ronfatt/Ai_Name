import { AppShell } from "@/components/AppShell";
import { InputForm } from "@/components/InputForm";

export default function AnalysisPage() {
  return (
    <AppShell compact>
      <section className="relative pb-5 pt-2">
        <div className="inline-flex rounded-full border border-[#FF67D8]/35 bg-[#35105A]/70 px-4 py-1.5 text-sm font-medium text-[#FFD8FF] shadow-soft">
          第 1 步｜填写基本资料 ✦
        </div>
        <div className="absolute right-0 top-5 hidden min-[390px]:block">
          <div className="ziwei-orb scale-75">
            <span className="ziwei-gem" />
          </div>
        </div>
        <h1 className="mt-5 max-w-[300px] text-[2rem] font-semibold leading-snug text-white">
          填写基本资料，生成你的姓名命格初步报告
        </h1>
        <p className="mt-3 max-w-[320px] text-sm leading-7 text-warmGray">
          资料仅用于生成本次初步分析参考，不会对外公开。出生资料可帮助系统结合姓名、生肖、八字与紫微方向进行初步判断。
        </p>
        <div className="mt-5">
          <p className="mb-3 text-sm font-semibold text-gold">填写后你将获得：</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["♧", "姓名五行与字义初步解析"],
              ["♥", "事业、感情、人际方向参考"],
              ["✦", "名字中可能影响运势的关键点"]
            ].map(([icon, text]) => (
              <div key={text} className="rounded-2xl border border-white/12 bg-white/10 p-3 text-center shadow-soft">
                <div className="mx-auto mb-2 grid h-8 w-8 place-items-center rounded-full bg-[#5B20B8]/80 text-white">{icon}</div>
                <p className="text-xs leading-5 text-warmGray">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <InputForm />
    </AppShell>
  );
}
