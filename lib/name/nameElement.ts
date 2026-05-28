import type { ElementName } from "@/types/analysis";

export function numberToElement(number: number): ElementName {
  const remainder = number % 10;
  if ([1, 2].includes(remainder)) return "木";
  if ([3, 4].includes(remainder)) return "火";
  if ([5, 6].includes(remainder)) return "土";
  if ([7, 8].includes(remainder)) return "金";
  return "水";
}
