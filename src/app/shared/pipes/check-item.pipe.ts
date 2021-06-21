import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkItem'
})
export class CheckItemPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (typeof value === 'object' && !value.length) {
      return [value];
    } else if (typeof value === 'undefined') {
      return [];
    } else if (typeof value === 'string' && value.length > 0) {
      return [value];
    } else {
      return value;
    }
  }

}
