import {Pipe, PipeTransform} from '@angular/core';
import {User, UserType} from '../models/mc.model';

@Pipe({
  name: 'personName'
})
export class PersonNamePipe implements PipeTransform {

  transform(value: User | UserType): string {
    if (!value) {
      return '-';
    }
    let name = '';
    if (value['fullName'] || value['full_name']) {
      name += value['fullName'] || value['full_name'];
    }
    if (value.abbreviation) {
      if (!value['fullName'] && !value['full_name']) {
        name += value.abbreviation;
      } else {
        name += ' (' + value.abbreviation + ')';
      }
    } else if ((!value['fullName'] && value['userID']) || (!value['full_name'] && value['user_id'])) {
      name += value['userID'] || value['user_id'];
    }
    return name || '-';
  }

}
