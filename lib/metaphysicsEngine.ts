import type { CharacterAnalysis, NameAnalysisInput } from "@/types/analysis";
import { normalizeBirthInput } from "@/lib/astro/timeCalibration";
import { convertSolarToLunar } from "@/lib/astro/lunarAdapter";
import { buildZiweiChart } from "@/lib/astro/ziweiChart";
import { calculateFiveGridByKangxi } from "@/lib/name/fiveGrid";
import { matchNameWithZiwei } from "@/lib/matching/starNameMatcher";

export function buildMetaphysicsProfile(input: NameAnalysisInput, characters: CharacterAnalysis[]) {
  const birthProfile = normalizeBirthInput(input);
  const lunarProfile = convertSolarToLunar(birthProfile.adjustedDateTime);
  const ziweiChart = buildZiweiChart(lunarProfile, input, birthProfile);
  const fiveGrid = calculateFiveGridByKangxi(characters);
  const ziweiNameMatch = matchNameWithZiwei({
    chart: ziweiChart,
    name: fiveGrid
  });

  return {
    birthProfile,
    lunarProfile,
    fiveGrid,
    ziweiChart,
    ziweiNameMatch
  };
}
