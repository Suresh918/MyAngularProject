import {Injectable} from '@angular/core';

@Injectable({
  'providedIn': 'root'
})
export class SharedService {

  constructor() {
  }

  convertDurationToDate(duration: string) {
    const empty = {
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    };
    if (!duration) {
      return empty;
    }
    const matches: string[] = duration.match(/^P([0-9]+Y|)?([0-9]+M|)?([0-9]+D|)?T?([0-9]+H|)?([0-9]+M|)?([0-9]+S|)?$/);
    const result: any = {};

    if (matches) {
      result.year = parseInt(matches[1], 10);
      result.month = parseInt(matches[2], 10);
      result.day = parseInt(matches[3], 10);
      result.hour = parseInt(matches[4], 10);
      result.minute = parseInt(matches[5], 10);
      result.second = parseInt(matches[6], 10);

      return result;
    } else {
      return empty;
    }
  }
}

