import Link from "next/link";

interface HeaderProps {
  compact?: boolean;
}

export function Header({ compact = false }: HeaderProps) {
  return (
    <header className="relative z-10 flex items-center justify-between px-5 pb-4 pt-5">
      <Link href="/" className="flex items-center gap-3" aria-label="返回首页">
        <span className="grid h-14 w-14 place-items-center rounded-[20px] border border-white/15 bg-gradient-to-br from-[#FF4FD8] via-[#8C4DFF] to-[#2BD9FF] text-3xl font-semibold text-white shadow-[0_0_28px_rgba(200,59,255,0.45)]">
          名
        </span>
        <span>
          <span className="block text-2xl font-semibold tracking-wide text-white">紫微易名</span>
          {!compact ? <span className="block text-sm text-warmGray">AI 姓名能量初步分析系统</span> : null}
        </span>
      </Link>
      <span className="rounded-full border border-[#FF67D8]/55 bg-[#39105A]/70 px-4 py-2 text-xs font-medium text-white shadow-[0_0_24px_rgba(255,79,216,0.45)]">
        ✦ 免费初步检测
      </span>
    </header>
  );
}
