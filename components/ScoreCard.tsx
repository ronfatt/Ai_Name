interface ScoreCardProps {
  score: number;
  patternName: string;
}

export function ScoreCard({ score, patternName }: ScoreCardProps) {
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div className="rounded-app border border-white/12 bg-gradient-to-br from-white/14 to-white/6 p-5 shadow-soft backdrop-blur">
      <div className="flex items-center gap-5">
        <div
          className="grid h-28 w-28 shrink-0 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#C83BFF ${percentage * 3.6}deg, rgba(255,255,255,0.12) 0deg)`
          }}
        >
          <div className="grid h-[88px] w-[88px] place-items-center rounded-full bg-rice/95 shadow-[inset_0_0_30px_rgba(200,59,255,0.2)]">
            <span className="text-3xl font-semibold text-white">{score}</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-warmGray">姓名整体格局</p>
          <h2 className="mt-1 text-2xl font-semibold text-ink">{patternName}</h2>
          <p className="mt-2 text-sm leading-6 text-warmGray">此分数为初步参考，用于判断名字能量是否需要进一步细看。</p>
        </div>
      </div>
    </div>
  );
}
