import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusChecker'
})
export class StatusCheckerPipe implements PipeTransform {

  transform(value: any, selectedTabIndex?: any, tabIndex?: any): any {
    if (selectedTabIndex === tabIndex) {
      value = 'remove';
    } else if (selectedTabIndex > tabIndex) {
      value = 'check';
    } else if (selectedTabIndex < tabIndex){
      value = '';
    }
    return value;
  }

}
