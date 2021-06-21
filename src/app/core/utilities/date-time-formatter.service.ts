import { Injectable } from '@angular/core';

@Injectable({
  'providedIn': 'root'
})
export class DateTimeFormatter {
  constructor() {
  }

  public setDateTime(date: any): Date {
    if (date) {
      if (typeof date !== 'string') {
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const dateString = ('0' + date.getDate()).slice(-2);
        const year = date.getFullYear();
        date = year + '-' + month + '-' + dateString + 'T';
      }
      date = date.split('T')[0] + 'T12:00:00Z';
    }
    const dateTime = date ? new Date(date) : null;
    return dateTime;
  }
}

