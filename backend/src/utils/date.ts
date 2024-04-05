import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import * as utc from 'dayjs/plugin/utc';

dayjs.locale('pt-br');
dayjs.extend(utc);

export class DateUtils {
  static isBefore(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).utc(false).isBefore(dayjs(date2).utc(false));
  }

  static isAfter(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).utc(false).isAfter(dayjs(date2).utc(false));
  }

  static isEqual(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).utc(false).isSame(dayjs(date2).utc(false));
  }

  static addDays(date: string | Date, days: number): string {
    return dayjs(date).utc(false).add(days, 'day').format('YYYY-MM-DD');
  }

  static subtractDays(date: string | Date, days: number): string {
    return dayjs(date).utc(false).subtract(days, 'day').format('YYYY-MM-DD');
  }

  static isEighteenOrOlder(birthDate: string | Date): boolean {
    const eighteenYearsAgo = dayjs().subtract(18, 'year');
    return dayjs(birthDate).utc(false).isBefore(eighteenYearsAgo);
  }

  static stringToDate(dateString: string | Date): Date {
    return dayjs(dateString).utc(false).toDate();
  }

  static startOfDay(date: string | Date): string {
    return dayjs(date).utc(false).startOf('day').toISOString();
  }

  static endOfDay(date: string | Date): string {
    return dayjs(date).utc(false).endOf('day').toISOString();
  }
}
