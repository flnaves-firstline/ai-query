import formatFn from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

import { Paths } from '@/core/types';

export class DateTime {
  public static init(dateTime: string | Date | null | undefined): Date {
    return typeof dateTime === 'string' ? parseISO(dateTime) : (dateTime as Date);
  }

  public static toUrlDate(date: Date | undefined | null): string | undefined {
    return date != null ? this.format(date, 'isodate') : undefined;
  }

  public static toUrlDateTime(date: Date | undefined | null): string | undefined {
    return date != null ? this.format(date, 'iso') : undefined;
  }

  public static format(
    date: Date | undefined | null,
    format:
      | 'day'
      | 'date'
      | 'datetime'
      | 'day and datetime'
      | 'month day year'
      | 'iso'
      | 'isodate'
      | 'time'
      | 'shortMonth'
      | 'shortDay' = 'datetime'
  ): string {
    if (date == null) return '';
    let useFormat: string;
    switch (format) {
      case 'shortMonth':
        useFormat = 'MMM';
        break;
      case 'day':
        useFormat = 'EEEE';
        break;
      case 'shortDay':
        useFormat = 'EEE';
        break;
      case 'date':
        useFormat = 'MM/dd/yyyy';
        break;
      case 'datetime':
        useFormat = 'MM/dd/yyyy hh:mm a';
        break;
      case 'day and datetime':
        useFormat = 'EEEE MM/dd/yyyy HH:mm:ss';
        break;
      case 'month day year':
        useFormat = 'MMMM dd, yyyy';
        break;
      case 'time':
        useFormat = 'pp';
        break;
      case 'iso':
        useFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx";
        break;
      case 'isodate':
        useFormat = 'yyyy-MM-dd';
        break;
    }
    return formatFn(date, useFormat);
  }

  public static deepLocalize<T>(obj: T, ...datePaths: Paths<T>[]) {
    const objs = Array.isArray(obj) ? obj : [obj];
    datePaths.forEach((path) => {
      const index = path.indexOf('.');
      if (index >= 0) {
        const key = path.substring(0, index);
        const restPath = path.substring(index + 1);
        objs.forEach((x) => this.deepLocalize(x[key], restPath));
      } else {
        objs.forEach((x) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          x[path] = x[path] && this.format(parseISO(x[path]));
        });
      }
    });
  }
}
