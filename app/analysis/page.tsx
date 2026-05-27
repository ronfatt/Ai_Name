import { AppShell } from "@/components/AppShell";
import { InputForm } from "@/components/InputForm";

export default function AnalysisPage() {
  return (
    <AppShell compact>
      <section className="pb-5 pt-2">
        <p className="text-sm font-medium text-gold">开始初步分析</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight text-ink">先让老师看见你的名字结构</h1>
        <p className="mt-3 text-sm leading-6 text-warmGray">
          资料只用于本次生成初步参考报告，第一版不会上传数据库。
        </p>
      </section>
      <InputForm />
    </AppShell>
  );
}
