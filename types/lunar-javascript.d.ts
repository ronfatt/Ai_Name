declare module "lunar-javascript" {
  export const Solar: {
    fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): SolarInstance;
  };

  export const Lunar: {
    fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): LunarInstance;
  };

  export interface SolarInstance {
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getHour(): number;
    getMinute(): number;
    getSecond(): number;
    getLunar(): LunarInstance;
    toString(): string;
  }

  export interface LunarInstance {
    getSolar(): SolarInstance;
    getYearInGanZhiExact(): string;
    getMonthInGanZhiExact(): string;
    getDayInGanZhiExact2(): string;
    getTimeInGanZhi(): string;
    getYearShengXiaoExact(): string;
    toString(): string;
  }
}
