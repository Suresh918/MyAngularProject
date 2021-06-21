import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'contextIdTransform'
})
export class ContextIdTransformPipe implements PipeTransform {

  constructor() {
  }

  transform(name: string): string {
    if (name.includes('MDG')) {
      const nameArray = name.split('-');
      nameArray[2] = parseInt(nameArray[2], 10).toString();
      return nameArray.join('-');
    } else {
      return name;
    }
  }

}
