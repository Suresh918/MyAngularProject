import {Pipe, PipeTransform} from '@angular/core';
import {ChangeRequestFormConfiguration} from '../models/mc-configuration.model';
import {ConfigurationService} from "../../core/services/configurations/configuration.service";

@Pipe({
  name: 'priorityTransform'
})
export class PriorityTransformPipe implements PipeTransform {
  changeRequestConfiguration: ChangeRequestFormConfiguration;

  constructor(private readonly configurationService: ConfigurationService) {
    this.changeRequestConfiguration = this.configurationService.getFormFieldParameters('ChangeRequest2.0') as ChangeRequestFormConfiguration;
  }

  transform(name: number | string): string {
    name = name + '';
    const priorityEnumeration = this.changeRequestConfiguration.implementation_priority.options;
    for (const priority of priorityEnumeration) {
      if (priority.value === name) {
        return priority.label;
      } else {
        if ((typeof name === 'number' && name === 99) || (typeof name === 'string' && name === '99')) {
          return 'NA';
        }
      }
    }
    return '';
  }

}
