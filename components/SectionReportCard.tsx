import type { SectionReport, WhatsappSection } from "@/types/analysis";
import { ResultCard } from "@/components/ResultCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface SectionReportCardProps {
  report: SectionReport;
  section: WhatsappSection;
  message: string;
  cta: string;
}

export function SectionReportCard({ report, message, cta }: SectionReportCardProps) {
  return (
    <ResultCard title={report.title}>
      <div className="space-y-4 text-sm leading-7 text-warmGray">
        <p><span className="font-semibold text-gold">整体能量：</span>{report.overall}</p>
        <p><span className="font-semibold text-gold">过去：</span>{report.past}</p>
        <p><span className="font-semibold text-gold">现在：</span>{report.present}</p>
        <p><span className="font-semibold text-gold">未来：</span>{report.future}</p>
        <p className="rounded-2xl border border-white/12 bg-white/10 p-4 text-white">{report.reminder}</p>
      </div>
      <WhatsAppButton message={message}>{cta}</WhatsAppButton>
    </ResultCard>
  );
}
