import Link from "next/link";

interface HeaderProps {
  compact?: boolean;
}

export function Header({ compact = false }: HeaderProps) {
  return (
    <header className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 pb-4 pt-4">
      <Link href="/" className="flex items-center gap-3" aria-label="返回首页">
        <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-gradient-to-br from-moss to-mossSoft text-lg font-semibold text-white shadow-soft">
          名
        </span>
        <span>
          <span className="block text-sm font-semibold tracking-wide text-white">AI 姓名学</span>
          {!compact ? <span className="block text-xs text-warmGray">初步分析系统</span> : null}
        </span>
      </Link>
      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-warmGray shadow-[0_6px_20px_rgba(200,59,255,0.16)]">
        免费初步参考
      </span>
    </header>
  );
}
