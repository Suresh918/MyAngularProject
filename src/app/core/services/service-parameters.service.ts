import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {StorageService} from './storage.service';
import {Value} from '../../shared/models/service-parameters.model';
import {HelpersService} from '../utilities/helpers.service';
import {McValidationsConfigurationService} from '../utilities/mc-validations-configuration.service';
import {AgendaCBRule, AgendaCBRuleSet} from '../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})
export class ServiceParametersService {

  constructor(private readonly http: HttpClient,
              private readonly storageService: StorageService,
              private readonly helpersService: HelpersService,
              private readonly mcValidationsConfigurationService: McValidationsConfigurationService) {
  }

  loadServiceParameters(): Promise<void> {
    const url = `${environment.rootURL}config${environment.version}/service-parameters`;
    return new Promise((resolve) => {
      this.http.get(url)
        .subscribe(res => {
          this.storageService.set('localConfiguration', res);
          resolve();
        });
    });
  }

  getServiceParameter(service: string, category?: string, parameter?: string): Value[] {
    let selectedParameter = [];
    const selectedServiceObj = this.storageService.get('localConfiguration') ? this.storageService.get('localConfiguration')['services']
      .filter((key) => key.name === service) || [] : [];
    const selectedCategoryObj = (selectedServiceObj && selectedServiceObj.length > 0)
      ? selectedServiceObj[0]['categories'].filter((key) => key.name === category) || [] : [];
    if (parameter) {
      selectedParameter = (selectedCategoryObj && selectedCategoryObj.length > 0)
        ? selectedCategoryObj[0]['parameters'].filter((key) => key.name === parameter) || [] : [];
      return (selectedParameter.length > 0) ? selectedParameter[0].values : [];
    } else {
      selectedParameter = (selectedCategoryObj && selectedCategoryObj.length > 0)
        ? selectedCategoryObj[0]['parameters'] || [] : [];
      return (selectedParameter.length > 0) ? selectedParameter : [];
    }
  }

  getServiceParameterPropertyValueByName(service: string, category?: string, parameter?: string, name?: string): string {
    const selectedValues = this.getServiceParameter(service, category, parameter);
    if (selectedValues) {
      const valueObj = selectedValues.find((obj) => obj.name === name);
      return valueObj ? valueObj.label : name;
    }
    return name;
  }

  getAllStatusByService(service: string, category?: string, parameter?: string, type?: string) {
    const statusObj = {};
    const selectedValues = this.getServiceParameter(service, category, parameter);
    if (selectedValues) {
      selectedValues.forEach((item) => {
        if (item.type === type) {
          statusObj[item.name] = item.label ? item.label : item.name;
        }
      });
      return statusObj;
    }
  }

  getCaseObjectMetaData(service: string, category: string) {
    const selectedServiceObj = this.storageService.get('localConfiguration') ?
      (this.storageService.get('localConfiguration')['services']
      .filter((key) => key.name === service) || []) : [];
    const selectedCategoryObj = (selectedServiceObj && selectedServiceObj.length > 0)
      ? selectedServiceObj[0]['categories'].filter((key) => key.name === category) || [] : [];
    const selectedFieldConfiguration = (selectedCategoryObj && selectedCategoryObj.length > 0)
      ? selectedCategoryObj[0]['parameters'] || [] : [];
    const metaDataFields = {};
    const caseObjectValidatorsConfiguration = this.helpersService.convertComplexObjToDotNotation(Object.assign(this.getCaseObjectValidatorsConfiguration(service)));
    selectedFieldConfiguration.forEach((formField: any) => {
      if (formField.values) {
        const obj = {};
        formField.values.forEach((type) => {
          /* if type of value is error then add it into error object */
          if (type['type'] && type['type'] === 'ERROR') {
            obj['error'] = obj['ERROR'] || {};
            obj['error'][type['name']] = type.label;
          }
          if (type['type'] && type['type'] === 'ENUMERATION') {
            obj['enumeration'] = obj['enumeration'] || [];
            obj['enumeration'].push({'name': type.name, 'label': type.label, 'sequence': type.sequence});
          } else if (type['type'] && ((type['type'] === 'EXPLANATION') ||
            (type['type'] === 'VALIDATOR-REGEX') ||
            (type['type'] === 'VALIDATOR-MAXLENGTH') ||
            (type['type'] === 'HINT') ||
            (type['type'] === 'GROUP') ||
            (type['type'] === 'FILTER-DQL') ||
            (type['type'] === 'VIEW-DQL'))) {

            obj[type['type'].toLowerCase()] = type.name;
          } else if (type['type']) {
            obj[type['type'].toLowerCase()] = type.label;
          }
        });
        if (caseObjectValidatorsConfiguration[formField.name]) {
          obj['validatorConfiguration'] = caseObjectValidatorsConfiguration[formField.name];
        }
        obj['ID'] = formField.name;
        metaDataFields[formField.name] = obj;
      }
    });
    this.expand(metaDataFields);
    return metaDataFields;
  }

  getCaseObjectValidatorsConfiguration(service: string) {
    switch (service) {
      case 'Action': {
        return this.mcValidationsConfigurationService.getActionValidatorsConfiguration();
      }
      case 'Agenda': {
        return this.mcValidationsConfigurationService.getAgendaValidatorsConfiguration();
      }
      case 'AgendaItem': {
        return this.mcValidationsConfigurationService.getAgendaItemValidatorsConfiguration();
      }
      case 'ChangeNotice': {
        return this.mcValidationsConfigurationService.getChangeNoticeValidatorsConfiguration();
      }
      case 'ChangeRequest': {
        return this.mcValidationsConfigurationService.getChangeRequestValidatorsConfiguration();
      }
      case 'ReleasePackage': {
        return this.mcValidationsConfigurationService.getReleasePackageValidatorsConfiguration();
      }
      case 'Notes': {
        return this.mcValidationsConfigurationService.getNoteValidatorsConfiguration();
      }
      case 'Decision': {
        return this.mcValidationsConfigurationService.getDecisionValidatorsConfiguration();
      }
      case 'Review2.0': {
        return this.mcValidationsConfigurationService.getReviewValidatorsConfiguration();
      }
      case 'ReviewEntry2.0': {
        return this.mcValidationsConfigurationService.getReviewEntryValidatorsConfiguration();
      }
    }
    return {};
  }

  getQuestionsList(service: string, category: string) {
    const completeQuestionList = [];
    const selectedServiceObj = this.storageService.get('localConfiguration')['services']
      .filter((key) => key.name === service) || [];
    const selectedCategoryObj = (selectedServiceObj && selectedServiceObj.length > 0)
      ? selectedServiceObj[0]['categories'].filter((key) => key.name === category) || [] : [];
    const selectedFieldConfiguration = (selectedCategoryObj && selectedCategoryObj.length > 0)
      ? selectedCategoryObj[0]['parameters'] || [] : [];
    selectedFieldConfiguration.forEach((selectedConfiguration) => {
      const questionsList = [];
      const assessmentCriterias = selectedConfiguration.values;
      assessmentCriterias.forEach(function (itm, idx) {
        for (let i = 0; i < assessmentCriterias.length; i++) {
          if (itm.sequence === assessmentCriterias[i].sequence && idx !== i && itm.type !== assessmentCriterias[i].type) {
            itm.tooltip = assessmentCriterias[i].name;
            itm.question = itm.name;
            questionsList.splice(Number(itm.sequence), 0, itm);
          }
        }
      });
      const qList = questionsList.filter(function (el) {
        return el.type === 'QUESTION';
      });
      qList.sort(function (a, b) {
        return Number(a.sequence) - Number(b.sequence);
      });
      completeQuestionList.push(qList);
    });
    return completeQuestionList;
  }

  getAgendaItemsRuleset(service: string, category: string) {
    const rulesList = [];
    const selectedServiceObj = this.storageService.get('localConfiguration')['services']
      .filter((key) => key.name === service) || [];
    const selectedCategoryObj = (selectedServiceObj && selectedServiceObj.length > 0)
      ? selectedServiceObj[0]['categories'].filter((key) => key.name === category) || [] : [];
    const selectedFieldConfiguration = (selectedCategoryObj && selectedCategoryObj.length > 0)
      ? selectedCategoryObj[0]['parameters'] || [] : [];
    selectedFieldConfiguration.forEach(element => {
      rulesList.push(element);
    });
    return rulesList;
  }

  getAgendaItemsRuleObj(ruleLabel: string): AgendaCBRule {
    const ruleSets = this.getAgendaItemsRuleset('AgendaItem', 'QUESTIONAIRE');
    let matchedRules = [];
    const isRuleNotAvailable = ruleSets.every((ruleSet) => {
      matchedRules = ruleSet.values.filter((rule) => rule.label === ruleLabel);
      return matchedRules.length === 0;
    });
    if (matchedRules[0] && !matchedRules[0].help) {
      matchedRules[0].help = this.helpersService.getDefaultHelpForCBRule();
    }
    return isRuleNotAvailable ? {'label': ruleLabel, 'help': this.helpersService.getDefaultHelpForCBRule()} as AgendaCBRule : matchedRules[0];
  }

  getAgendaItemsQuestionaire(service: string, category: string, name: string): AgendaCBRuleSet {
    let rulesList = [];
    let rulesetHelp = '';
    const selectedServiceObj = this.storageService.get('localConfiguration')['services']
      .filter((key) => key.name === service) || [];
    const selectedCategoryObj = (selectedServiceObj && selectedServiceObj.length > 0)
      ? selectedServiceObj[0]['categories'].filter((key) => key.name === category) || [] : [];
    const selectedFieldConfiguration = (selectedCategoryObj && selectedCategoryObj.length > 0)
      ? selectedCategoryObj[0]['parameters'] || [] : [];
    selectedFieldConfiguration.filter(res => {
      if (res.name.trim() === name.trim()) {
        res.values.forEach(value => {
          if (value.type === 'HELP') {
            rulesetHelp = value.label || value.name;
          } else {
            value.name = value.name || value.label;
            value.help = value.help || this.helpersService.getDefaultHelpForCBRule();
          }
        });
        rulesList = res.values;
      }
    });
    return {'help': rulesetHelp, 'rule': rulesList} as AgendaCBRuleSet;
  }

  parseDotNotation(str, val, obj) {
    let currentObj = obj;
    let i;
    let key;
    const keys = str.split('.');
    const l = Math.max(1, keys.length - 1);

    for (i = 0; i < l; ++i) {
      key = keys[i];
      currentObj[key] = currentObj[key] || {};
      currentObj = currentObj[key];
    }

    currentObj[keys[i]] = currentObj[keys[i]] ? {...currentObj[keys[i]], ...val} : val;
    delete obj[str];
  }

  expand(obj) {
    for (const key in obj) {
      if (key.indexOf('.') !== -1) {
        this.parseDotNotation(key, obj[key], obj);
      }
    }
    return obj;
  }

  getServiceLabel(service: string): string {
    const selectedServiceObj = this.storageService.get('localConfiguration')['services']
      .filter(key => key.name === service) || [];
    return (selectedServiceObj.length > 0) ? selectedServiceObj[0].label : '';
  }

  getServiceParameterPropertyValueByType(service: string, category: string, parameter: string, type: string): string {
    const selectedValues = this.getServiceParameter(service, category, parameter);
    if (selectedValues) {
      const valueObj = selectedValues.find((obj) => obj.type === type);
      return valueObj ? valueObj.label : name;
    }
    return name;
  }
}
