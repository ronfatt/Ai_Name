import { Lunar, Solar } from "lunar-javascript";

export interface LunarProfile {
  lunarDate: string;
  ganzhi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  zodiac: string;
}

function formatDateParts(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function lunarToSolarDate(lunarDate: string, hour = 12, minute = 0): string {
  const [year, month, day] = lunarDate.split("-").map(Number);
  const solar = Lunar.fromYmdHms(year, month, day, hour, minute, 0).getSolar();
  return formatDateParts(solar.getYear(), solar.getMonth(), solar.getDay());
}

export function convertSolarToLunar(dateTime: Date): LunarProfile {
  const lunar = Solar
    .fromYmdHms(
      dateTime.getUTCFullYear(),
      dateTime.getUTCMonth() + 1,
      dateTime.getUTCDate(),
      dateTime.getUTCHours(),
      dateTime.getUTCMinutes(),
      0
    )
    .getLunar();

  return {
    lunarDate: lunar.toString(),
    ganzhi: {
      year: lunar.getYearInGanZhiExact(),
      month: lunar.getMonthInGanZhiExact(),
      day: lunar.getDayInGanZhiExact2(),
      hour: lunar.getTimeInGanZhi()
    },
    zodiac: lunar.getYearShengXiaoExact()
  };
}
