import {Pipe, PipeTransform} from '@angular/core';
import {ChangeRequestFormConfiguration} from '../models/mc-configuration.model';
import {HelpersService} from '../../core/utilities/helpers.service';
import {ConfigurationService} from '../../core/services/configurations/configuration.service';

@Pipe({
  name: 'caseObjectLabel'
})
export class CaseObjectLabelPipe implements PipeTransform {

  caseObjectFormConfiguration: any;

  constructor(private readonly helpersService: HelpersService,
              private readonly configurationService: ConfigurationService) {
  }

  transform(value, caseObject) {
    this.caseObjectFormConfiguration = this.configurationService.getFormFieldParameters(this.helpersService.getCaseObjectForms(caseObject).caseObject) as ChangeRequestFormConfiguration;
    if (this.caseObjectFormConfiguration && Object.keys(this.caseObjectFormConfiguration).length > 0) {
      const enumerationList = this.caseObjectFormConfiguration.generalInformation.status.options.concat(this.caseObjectFormConfiguration.generalInformation.state.options);
      for (const statusItem of enumerationList) {
        if (statusItem && statusItem['value'] === value) {
          return statusItem['label'];
        }
      }
    }
    return value || '';

  }

}
