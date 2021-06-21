import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeUserRoleLabels'
})
export class ChangeUserRoleLabelsPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let modifiedText = value;
    if (value && value.toUpperCase().split('CHANGESPECIALIST') && value.toUpperCase().split('CHANGESPECIALIST').length > 1) {
      const roleId = value.toUpperCase().split('CHANGESPECIALIST')[1];
      modifiedText = 'Change Specialist ' + roleId;
    }
    return modifiedText;
  }
}
