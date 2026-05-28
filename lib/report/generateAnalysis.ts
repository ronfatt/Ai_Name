import type { AnalysisResult, NameAnalysisInput } from "@/types/analysis";
import { analyzeName } from "@/lib/nameAnalysis";

export function generateAnalysis(input: NameAnalysisInput): AnalysisResult {
  return analyzeName(input);
}
