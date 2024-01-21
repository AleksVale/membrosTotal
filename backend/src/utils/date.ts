import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');

export class DateUtils {
  static isBefore(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).isBefore(dayjs(date2));
  }

  static isAfter(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).isAfter(dayjs(date2));
  }

  static isEqual(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).isSame(dayjs(date2));
  }

  static addDays(date: string | Date, days: number): string {
    return dayjs(date).add(days, 'day').format('YYYY-MM-DD');
  }

  static subtractDays(date: string | Date, days: number): string {
    return dayjs(date).subtract(days, 'day').format('YYYY-MM-DD');
  }

  static isEighteenOrOlder(birthDate: string | Date): boolean {
    const eighteenYearsAgo = dayjs().subtract(18, 'year');
    return dayjs(birthDate).isBefore(eighteenYearsAgo);
  }

  static stringToDate(dateString: string | Date): Date {
    return dayjs(dateString).toDate();
  }

  static startOfDay(date: string | Date): string {
    return dayjs(date).startOf('day').toISOString();
  }

  static endOfDay(date: string | Date): string {
    return dayjs(date).endOf('day').toISOString();
  }
}
