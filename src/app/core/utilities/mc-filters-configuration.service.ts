import {Injectable} from '@angular/core';
import {CaseObjectFilterConfiguration} from '../../shared/models/mc-filters.model';
import {FormControlConfiguration} from '../../shared/models/mc-configuration.model';
import {HelpersService} from './helpers.service';
import {ConfigurationService} from "../services/configurations/configuration.service";

@Injectable({
  providedIn: 'root'
})
export class McFiltersConfigurationService {
  filterFormConfiguration: { [key: string]: FormControlConfiguration };
  caseObjectFilterConfiguration: {};

  constructor(private readonly helpersService: HelpersService,
              private readonly configurationService: ConfigurationService) {
  }

  getCaseObjectFiltersConfiguration(caseObjectType): CaseObjectFilterConfiguration {
    if (caseObjectType) {

      this.filterFormConfiguration =
        this.configurationService.getFormFilterParameters(this.helpersService.getCaseObjectForms(caseObjectType).caseObject);
      this.caseObjectFilterConfiguration = {};
      this.assignFilterConfig(this.filterFormConfiguration);
      return this.caseObjectFilterConfiguration;
    }
  }

  assignFilterConfig(filterConfig) {
    Object.keys(filterConfig).forEach((key) => {
      if (Object.keys(filterConfig[key]).includes('ID')) {
        this.caseObjectFilterConfiguration[key] = true;
      } else {
        this.assignFilterConfig(filterConfig[key]);
      }
    });
  }
}
