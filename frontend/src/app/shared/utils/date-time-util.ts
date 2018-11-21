import {DateTime} from 'luxon';

export class DateTimeUtil {
  static toDate(datetime: string): any {
    return DateTime.fromMillis(+datetime * 1000).toLocaleString(DateTime.DATETIME_SHORT);
  }

}
