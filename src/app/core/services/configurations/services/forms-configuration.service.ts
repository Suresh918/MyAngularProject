import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  'providedIn': 'root'
})
export class FormsConfigurationService {
  formData: any;
  formsConfigurationServiceUrl: string;
  groupsNamesArray: string[];
  groupsArray: any[];
  caseObjectHelpTextArray: any[];
  caseObjectType: string;

  constructor(private readonly http: HttpClient) {
    this.formsConfigurationServiceUrl = `${environment.rootURL}configuration-service/forms`;
    this.groupsNamesArray = [];
    this.groupsArray = [];
    this.caseObjectHelpTextArray = [];
  }

  getForms(): Observable<any> {
    return this.http.get(this.formsConfigurationServiceUrl).pipe(map(res => {
        return ((res) ? res : []);
      }),
      catchError(() => {
        return of([]);
      })
    );
  }

  saveFormData(formData) {
    this.formData = formData;
  }

  getFromDataParam(name: string) {
    let fieldsData = [];
    this.formData.forEach((data) => {
      if (data.name === name) {
          if (data.fields.length > 0) {
            fieldsData = data.fields;
          }
      }
    });
    return fieldsData;
  }

  getFormParameters(caseObject?: string, subObject1?: string, subObject2?: string) {
    const formData = {};
    const initialFormData = JSON.parse(JSON.stringify(this.formData));
    [...initialFormData].forEach((caseObjectFormData) => {
      const caseObjectName = caseObjectFormData['name'];
      formData[caseObjectName] = {};
      if (caseObjectFormData[subObject1] && caseObjectFormData[subObject1].length > 0) {
        caseObjectFormData[subObject1].forEach((field) => {
          formData[caseObjectName][field.name] = {};
          formData[caseObjectName][field.name]['ID'] = field.name;
          Object.keys(field).forEach((fieldKey) => {
            if (fieldKey === 'properties' && field[fieldKey]) {
              Object.keys(field[fieldKey])
                .forEach((fieldPropertyKey) => {
                  formData[caseObjectName][field.name][fieldPropertyKey] = field[fieldKey][fieldPropertyKey];
                });
              delete field[fieldKey];
            } else if (fieldKey === 'data_type' && field[fieldKey]) {
              formData[caseObjectName][field.name]['type'] = field[fieldKey];
            } else {
              formData[caseObjectName][field.name][fieldKey] = field[fieldKey];
            }
          });
          delete formData[caseObjectName][field.name]['name'];
        });
      }
      this.expand(formData[caseObjectName]);
    });
    if (caseObject && subObject1 && subObject2 && formData[caseObject]) {
      return formData[caseObject][subObject2] || {};
    } else if (caseObject && subObject1) {
      return formData[caseObject] || {};
    } else {
      return formData || {};
    }
  }

  getFormParameterLabelByValue(service: string, category?: string, parameter?: string, subParameter?: string, subParameterProperty?: string) {
    const initialFormData = JSON.parse(JSON.stringify(this.formData));
    const selectedCaseObjectFields = initialFormData.filter((field) => field.name === service)[0];
    const selectedValues = selectedCaseObjectFields[category].filter((field) => field.name === parameter)[0];
    if (selectedValues && subParameter === 'options') {
      return selectedValues.options;
    } else if (selectedValues && subParameter === 'label') {
      return selectedValues.properties.label;
    } else if (selectedValues && subParameter !== 'options') {
      let valueObj: any = {};
      if (selectedValues && selectedValues.options) {
        valueObj = selectedValues.options.find((obj) => obj.value === subParameter);
        return (valueObj && subParameterProperty && valueObj[subParameterProperty]) ? valueObj[subParameterProperty] : valueObj;
      } else if (selectedValues && selectedValues.application_exceptions) {
        valueObj = selectedValues.application_exceptions.find((obj) => obj.error_code === subParameter);
        return (valueObj && subParameterProperty && valueObj[subParameterProperty]) ? valueObj[subParameterProperty] : valueObj;
      }
      return JSON.stringify(subParameter);
    }
    return subParameter;
  }


  getHelpGroupsForCaseObjects() {
    const groupsObject = {};
    [...this.formData].forEach(form => {
      this.caseObjectType = form.name;
      if (form.name === 'ChangeRequest2.0') {
        this.groupsNamesArray = [];
        this.groupsArray = [];
        form.fields.forEach(field => {
          if (field && field.properties.group && !this.groupsNamesArray.includes(field.properties.group)) {
            this.groupsNamesArray.push(field.properties.group);
          }
          this.groupsArray.push({
            group: field.properties.group,
            name: field.name,
            label: field.properties.label,
            placeholder: field.properties.placeholder,
            help: field.properties.help
          });
        });
        this.formatGroups(this.groupsArray, this.caseObjectType);
      }
      if (form.name === 'ChangeNotice') {
        this.groupsNamesArray = [];
        this.groupsArray = [];
        form.fields.forEach(field => {
          if (field && field.properties.group && !this.groupsNamesArray.includes(field.properties.group)) {
            this.groupsNamesArray.push(field.properties.group);
          }
          this.groupsArray.push({
            group: field.properties.group,
            name: field.name,
            label: field.properties.label,
            placeholder: field.properties.placeholder,
            help: field.properties.help
          });
        });
        this.formatGroups(this.groupsArray, this.caseObjectType);
      }
      if (form.name === 'ReleasePackage2.0') {
        this.groupsNamesArray = [];
        this.groupsArray = [];
        form.fields.forEach(field => {
          if (field && field.properties.group && !this.groupsNamesArray.includes(field.properties.group)) {
            this.groupsNamesArray.push(field.properties.group);
          }
          this.groupsArray.push({
            group: field.properties.group,
            name: field.name,
            label: field.properties.label,
            placeholder: field.properties.placeholder,
            help: field.properties.help
          });
        });
        this.formatGroups(this.groupsArray, this.caseObjectType);
      }
      if (form.name === 'ReadOnlyCIA2.0') {
        this.groupsNamesArray = [];
        this.groupsArray = [];
        form.fields.forEach(field => {
          if (field && field.properties.group && !this.groupsNamesArray.includes(field.properties.group)) {
            this.groupsNamesArray.push(field.properties.group);
          }
          this.groupsArray.push({
            group: field.properties.group,
            name: field.name,
            label: field.properties.label,
            placeholder: field.properties.placeholder,
            help: field.properties.help
          });
        });
        this.formatGroups(this.groupsArray, this.caseObjectType);
      }
    });
    return this.caseObjectHelpTextArray;
  }

  formatGroups(groups, caseObjectType) {
    let object = {};
    let fieldsArray = [];
    const formattedGroupArray = [];
    this.groupsNamesArray.forEach(groupName => {
      fieldsArray = [];
      groups.forEach(item => {
        if (groupName === item.group) {
          fieldsArray.push({name: item.name, help: item.help, label: item.label, placeholder: item.placeholder});
          object = {
            label: item.group,
            name: this.camelSentence(item.group),
            parameter: fieldsArray
          };
        }
      });
      formattedGroupArray.push(object);
    });
    this.caseObjectHelpTextArray.push({name: caseObjectType, group: formattedGroupArray});
  }

  camelSentence(text) {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
    return text.substr(0, 1).toLowerCase() + text.substr(1);
  }

  saveHelpText(helpText, caseObjectType, fieldName) {
    return this.http.put(`${this.formsConfigurationServiceUrl}/${caseObjectType}/fields/${fieldName}`, helpText).pipe(map(res => {
      return res ? res : {};
    }));
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

}
