import { Pipe, PipeTransform } from '@angular/core';
import {ConfigurationService} from "../../core/services/configurations/configuration.service";

@Pipe({
  name: 'userImage'
})
export class UserImagePipe implements PipeTransform {
  baseUrl: string;

  constructor(public readonly configurationService: ConfigurationService) {
    this.baseUrl = this.configurationService.getLinkUrl('PhotoURL');
  }

  transform(value) {
    return this.baseUrl.replace('{USER-ID}', value);
  }
}
