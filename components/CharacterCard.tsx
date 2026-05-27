import type { CharacterAnalysis } from "@/types/analysis";
import { TagBadge } from "@/components/TagBadge";

export function CharacterCard({ character }: { character: CharacterAnalysis }) {
  return (
    <article className="rounded-[22px] border border-white/12 bg-white/10 p-4 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-moss to-mossSoft text-3xl font-semibold text-white shadow-soft">
            {character.char}
          </span>
          <div>
            <p className="font-semibold text-white">{character.position}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <TagBadge>五行 {character.element}</TagBadge>
              <TagBadge>{character.strokes} 画</TagBadge>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-3 text-sm leading-6 text-warmGray">
        <p><span className="font-medium text-gold">字义能量：</span>{character.meaning}</p>
        <p><span className="font-medium text-gold">性格影响：</span>{character.personalityImpact}</p>
        <p><span className="font-medium text-gold">阶段影响：</span>{character.lifeStageImpact}</p>
      </div>
    </article>
  );
}
