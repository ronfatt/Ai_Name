import type { CalendarType, NameAnalysisInput } from "@/types/analysis";
import { lunarToSolarDate } from "@/lib/astro/lunarAdapter";

const standardLongitude = 120;

const cityLongitudes: Record<string, number> = {
  吉隆坡: 101.6869,
  槟城: 100.3327,
  新山: 103.7414,
  怡保: 101.0901,
  马六甲: 102.2501,
  新加坡: 103.8198,
  台北: 121.5654,
  香港: 114.1694,
  上海: 121.4737,
  北京: 116.4074,
  广州: 113.2644,
  深圳: 114.0579
};

export interface BirthProfile {
  sourceDate: string;
  solarDate: string;
  birthDateTime: Date;
  adjustedDateTime: Date;
  birthCity: string;
  longitude: number;
  calendarType: CalendarType;
  useTrueSolarTime: boolean;
  correctionMinutes: number;
}

export function normalizeBirthInput(input: NameAnalysisInput): BirthProfile {
  const now = new Date();
  const fallbackDate = `${now.getFullYear()}-01-01`;
  const sourceDate = isDateLike(input.birthDate) ? input.birthDate.trim() : fallbackDate;
  const parsedTime = parseTime(input.birthTime);
  const calendarType = input.calendarType || "solar";
  const longitude = resolveLongitude(input.birthCity, input.longitude);
  const solarDate = calendarType === "lunar" ? lunarToSolarDate(sourceDate, parsedTime.hour, parsedTime.minute) : sourceDate;
  const [year, month, day] = solarDate.split("-").map(Number);
  const birthDateTime = new Date(Date.UTC(year, month - 1, day, parsedTime.hour, parsedTime.minute, 0));
  const useTrueSolarTime = Boolean(input.useTrueSolarTime);
  const correctionMinutes = useTrueSolarTime ? Math.round((longitude - standardLongitude) * 4) : 0;
  const adjustedDateTime = calibrateTrueSolarTime(birthDateTime, longitude, useTrueSolarTime);

  return {
    sourceDate,
    solarDate,
    birthDateTime,
    adjustedDateTime,
    birthCity: input.birthCity?.trim() || "吉隆坡",
    longitude,
    calendarType,
    useTrueSolarTime,
    correctionMinutes
  };
}

export function calibrateTrueSolarTime(dateTime: Date, longitude: number, enabled: boolean): Date {
  if (!enabled) return dateTime;
  return new Date(dateTime.getTime() + Math.round((longitude - standardLongitude) * 4) * 60_000);
}

export function timeToIndex(hour: number): number {
  if (hour === 0) return 0;
  if (hour === 23) return 12;
  return Math.floor((hour + 1) / 2);
}

export function formatDateParts(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function parseTime(value?: string): { hour: number; minute: number } {
  const match = value?.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return { hour: 12, minute: 0 };
  const hour = Math.min(23, Math.max(0, Number(match[1])));
  const minute = Math.min(59, Math.max(0, Number(match[2])));
  return { hour, minute };
}

function resolveLongitude(city?: string, longitude?: number): number {
  if (typeof longitude === "number" && Number.isFinite(longitude)) return longitude;
  if (!city) return cityLongitudes.吉隆坡;
  const matchedCity = Object.keys(cityLongitudes).find((item) => city.includes(item));
  return matchedCity ? cityLongitudes[matchedCity] : cityLongitudes.吉隆坡;
}

function isDateLike(value?: string): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}
