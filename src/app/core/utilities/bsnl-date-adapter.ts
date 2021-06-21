import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';

@Injectable({
  'providedIn': 'root'
})
export class BsnlDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    return value.toISOString();
  }

  format(date: Date, displayFormat: Object): string {
    if (date) {
      const weekNo = this.getWeekNumber(new Date(date));
      const weekDay = this.getWeekDay(new Date(date));
      const formattedDate = new DatePipe('en-US').transform(date, 'MMM-d-y');
      return `${formattedDate} wk${weekNo}.${weekDay}`;
    } else {
      return '';
    }

  }

  private getWeekDay(d: Date): number {
    return d.getDay() === 0 ? 7 : d.getDay();
  }

  private getWeekNumber(d: Date): number {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0, 0, 0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    // Get first day of year
    const yearStart = new Date(d.getFullYear(), 0, 1);
    // Calculate full weeks to nearest Thursday
    // Return array of year and week number
    return Math.ceil((((d.valueOf() - yearStart.valueOf()) / 86400000) + 1) / 7);
  }
}
