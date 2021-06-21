import {Injectable} from '@angular/core';

import {HelpersService} from './helpers.service';
import {DateTimeFormatter} from './date-time-formatter.service';
import {FormControlConfiguration} from '../../shared/models/mc-configuration.model';
import {CaseObjectFilterConfiguration, FilterOptions, People} from '../../shared/models/mc-filters.model';
import {User} from '../../shared/models/mc.model';
import {ConfigurationService} from '../services/configurations/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  filterFormConfiguration: { [key: string]: FormControlConfiguration };
  filterKey = 'filter_dql';
  caseObjectType: string;
  selectedCaseObjectType: string;
  isActionFilter: boolean;

  constructor(private readonly dateTimeFormatter: DateTimeFormatter,
              private readonly helpersService: HelpersService,
              private readonly configurationService: ConfigurationService) {
  }

  getFilterConfigurations(caseObject) {
    return this.configurationService.getFormFilterParameters(this.helpersService.getCaseObjectForms(caseObject).caseObject);
  }

  getFilterQueryForFilterOptions(
    filterOptions: FilterOptions,
    caseObject: string,
    caseObjectFilterConfiguration: CaseObjectFilterConfiguration,
    selectedCaseObject?: string,
    filterKey?: string,
    isActionFilter?: boolean
  ): string {
    const filterQueryArray = [];
    let filterQuery = '';
    this.isActionFilter = isActionFilter;
    this.filterKey = filterKey ? filterKey : 'filter_dql';
    this.filterFormConfiguration = this.getFilterConfigurations(caseObject);
    this.caseObjectType = caseObject;
    this.selectedCaseObjectType = selectedCaseObject;
    filterOptions = this.helpersService.removeEmptyKeysFromObject(JSON.parse(JSON.stringify(filterOptions)));
    Object.keys(filterOptions).forEach((key) => {
      if (key === 'people' && filterOptions[key].length > 0) {
        const peopleQuery = this.createPeopleQuery(filterOptions.people, selectedCaseObject || filterOptions.fromCaseObject, caseObjectFilterConfiguration, caseObject, isActionFilter);
        if (peopleQuery) {
          filterQueryArray.push(peopleQuery);
        }
      } else if ((key !== 'fromCaseObject') &&
        filterOptions[key] && this.filterFormConfiguration[key] &&
        (this.filterFormConfiguration[key][this.filterKey] || (selectedCaseObject &&
          this.filterFormConfiguration[this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key] &&
          this.filterFormConfiguration[this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key][this.filterKey]
        ))) {
        // if its a date filter query
        if (this.filterFormConfiguration[key] &&
          this.filterFormConfiguration[key][this.filterKey] &&
          this.filterFormConfiguration[key][this.filterKey].indexOf('${beginDate}' || '${endDate}') > -1) {
          // if control value has both begin and end dates in the response
          if (Array.isArray(filterOptions[key])) {
            filterOptions[key].forEach((option) => {
              // if any case object selected
              if (selectedCaseObject) {
                filterQueryArray.push(
                  this.replaceDatePlaceholder(
                    this.filterFormConfiguration[
                      this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key][this.filterKey], option
                  )
                );
              } else {
                filterQueryArray.push(this.replaceDatePlaceholder(this.filterFormConfiguration[key][this.filterKey], option));
              }
            });
          } else if (filterOptions[key]['begin'] && filterOptions[key]['end']) {
            // if any case object selected
            if (selectedCaseObject && this.filterFormConfiguration &&
              this.filterFormConfiguration[this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key]) {
              filterQueryArray.push(
                this.replaceDatePlaceholder(
                  this.filterFormConfiguration[
                    this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key][this.filterKey], filterOptions[key]
                )
              );
            } else {
              filterQueryArray.push(this.replaceDatePlaceholder(this.filterFormConfiguration[key][this.filterKey], filterOptions[key], caseObject));
            }
          }
        } else if (this.helpersService.isSpecialFilterApplicable(caseObject, key, selectedCaseObject)) {
            if (selectedCaseObject &&
              this.filterFormConfiguration[this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key]
            ) {
              filterQueryArray.push(
                this.replaceSpecialFilterPlaceholder(
                  (this.filterFormConfiguration[this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key][this.filterKey]),
                  this.createFilterQueryForList(filterOptions[key], key, caseObject)
                )
              );
            } else {
              filterQueryArray.push(
                this.replaceSpecialFilterPlaceholder(
                  this.filterFormConfiguration[key][this.filterKey],
                  this.createFilterQueryForList(filterOptions[key], key, caseObject)
                )
              );
            }
        } else { // if it has general filter placeholders
          if (selectedCaseObject &&
            this.filterFormConfiguration[this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key]
          ) {
            filterQueryArray.push(
              this.replaceFilterPlaceholder(
                (this.filterFormConfiguration[this.helpersService.getCaseObjectForms(selectedCaseObject).filterCaseObject][key][this.filterKey]),
                this.createFilterQueryForList(filterOptions[key], key, caseObject)
              )
            );
          } else {
            filterQueryArray.push(
              this.replaceFilterPlaceholder(
                this.filterFormConfiguration[key][this.filterKey],
                this.createFilterQueryForList(filterOptions[key], key, caseObject)
              )
            );
          }
        }
      }
    });
    if (filterQueryArray && Array.isArray(filterQueryArray) && filterQueryArray.length > 0) {
      filterQuery = filterQueryArray.join(' and ');
    }
    return filterQuery;
  }

  replaceSpecialFilterPlaceholder(filterString, filterValue, key?: string) {
    let filterQueryList;
    if (filterValue && filterValue.split(',').length > 1) {
      filterQueryList = [];
      filterValue.split(',').forEach((value) => {
        filterQueryList.push(
          filterString.split('$filter-value-placeholder-uppercase')
          .join((value && value.toUpperCase()) || '').split('$filter-value-placeholder')
          .join(value || '')
        );
      });
      return filterQueryList ? '(' + filterQueryList.join(' or ') + ')' : '';
    } else {
      filterQueryList = filterString.split('$filter-value-placeholder-uppercase')
        .join((filterValue && filterValue.toUpperCase()) || '').split('$filter-value-placeholder')
        .join(filterValue || '');
    }
    return filterQueryList;
  }

  replaceFilterPlaceholder(filterString, filterValue, key?: string) {
    if (filterString) {
      if (filterString && (filterString.indexOf('$roleName') > -1) && key) {
        return filterString.split('$roleName').join(
          (filterString.indexOf('generalInformation') > -1) ? `'${encodeURIComponent(key)}'` : `${encodeURIComponent(key)}`
        ).split('$filter-value-placeholder').join(filterValue);
      }
      if ((filterString.includes('analysisPriority') || filterString.includes('implementationPriority')) &&
        filterValue === 'null') {
        return filterString.split('in').join(`{equal}`).split(/[()]+/).join('').split('$filter-value-placeholder').join(filterValue);
      } else {
        return filterString.split('$filter-value-placeholder-uppercase')
          .join((filterValue && filterValue.toUpperCase()) || '').split('$filter-value-placeholder')
          .join(filterValue || '');
      }
    }
  }

  replaceDatePlaceholder(filterString, filterValue, caseObject?) {
    let dateFilter;
    if (filterValue && filterValue.length > 0) {
      dateFilter = [];
      filterValue.forEach((value) => {
        dateFilter.push(`(${this.dateFilterString(filterString, value)})`);
      });
      return dateFilter.join(' or ');
    } else {
      dateFilter = this.dateFilterString(filterString, filterValue, caseObject);
    }
    return dateFilter;
  }

  dateFilterString(filterString, value, caseObject?) {
    const format = (caseObject === 'review' || caseObject === 'ReleasePackage') ? 'Z' : 'T';
    const beginDate = this.dateTimeFormatter.setDateTime(value.begin).toISOString().split(format)[0];
    const endDate = this.dateTimeFormatter.setDateTime(value.end).toISOString().split(format)[0];
    const replaceBeginDate = filterString.split('${beginDate}').join(beginDate);
    return replaceBeginDate.split('${endDate}').join(endDate);
  }

  createAllUsersQuery(allUsers: User[], caseObjectFilterConfiguration: CaseObjectFilterConfiguration, caseObject: string, fromCaseObject: string): string {
    const allUsersQueryArray = [];
    let allUsersQuery = '';
    allUsersQueryArray.push(this.getUserQueryString('myTeam', allUsers, caseObject, fromCaseObject));
    if (caseObjectFilterConfiguration.ecnExecutor) {
      allUsersQueryArray.push(this.getUserQueryString('ecnExecutor', allUsers, caseObject, fromCaseObject));
    }
    if (caseObjectFilterConfiguration.productDevelopmentManager) {
      allUsersQueryArray.push(this.getUserQueryString('productDevelopmentManager', allUsers, caseObject, fromCaseObject));
    }
    if (caseObjectFilterConfiguration.productManager) {
      allUsersQueryArray.push(this.getUserQueryString('productManager', allUsers, caseObject, fromCaseObject));
    }
    if (caseObjectFilterConfiguration.productClusterManager) {
      allUsersQueryArray.push(this.getUserQueryString('productClusterManager', allUsers, caseObject, fromCaseObject));
    }
    if (caseObjectFilterConfiguration.attendee) {
      allUsersQueryArray.push(this.getUserQueryString('attendee', allUsers, caseObject, fromCaseObject));
    }
    if (allUsersQueryArray.length > 0) {
      allUsersQuery = allUsersQueryArray.join(' or ');
    }
    return allUsersQuery;
  }

  getUserQueryString(userRole, allUsers, caseObject, selectedCaseObject) {
    if (selectedCaseObject) {
      return this.replaceFilterPlaceholder(
        this.filterFormConfiguration[selectedCaseObject][userRole][this.filterKey],
        this.createFilterQueryForList(allUsers, 'people', caseObject));
    } else {
      return this.replaceFilterPlaceholder(
        this.filterFormConfiguration[userRole][this.filterKey],
        this.createFilterQueryForList(allUsers, 'people', caseObject));
    }
  }

  createPeopleQuery(peopleList: People[], referenceCaseObject: string, caseObjectFilterConfiguration: CaseObjectFilterConfiguration, caseObject: string, isDashboardActionFilter?: boolean): string {
    const peopleListQueryArray = [];
    let peopleQuery = '';
    peopleList.forEach(peopleTemp => {
      const peopleQueryArray = [];
      const roleTemp = peopleTemp.role;
      if (peopleTemp.user && (peopleTemp.user.userID || peopleTemp.user['user_id']) && roleTemp) {
        if (roleTemp.value === 'allUsers' || roleTemp.value === 'myTeam' || roleTemp.name === 'allUsers' || roleTemp.name === 'myTeam') {
          if (referenceCaseObject) {
            peopleQueryArray.push(this.createAllUsersQuery(
              [peopleTemp.user],
              caseObjectFilterConfiguration,
              caseObject,
              this.helpersService.getCaseObjectForms(referenceCaseObject).filterCaseObject)
            );
          } else {
            peopleQueryArray.push(
              this.createAllUsersQuery([peopleTemp.user], caseObjectFilterConfiguration, caseObject, ''));
          }
        } else if (
          roleTemp.value === 'createdBy' || roleTemp.name === 'createdBy' ||
          roleTemp.value === 'assignee' || roleTemp.name === 'assignee' ||
          roleTemp.value === 'attendee' || roleTemp.name === 'attendee' ||
          roleTemp.value === 'reviewedBy' || roleTemp.name === 'reviewedBy' ||
          roleTemp.value === 'reviewer' || roleTemp.name === 'reviewer' ||
          this.isRoleInCaseObject(roleTemp.value || roleTemp.name as string, caseObjectFilterConfiguration)) {
          if (referenceCaseObject && this.filterFormConfiguration[this.helpersService.getCaseObjectForms(referenceCaseObject).filterCaseObject][roleTemp.value || roleTemp.name]) {
            peopleQueryArray.push(
              this.replaceFilterPlaceholder(
                this.filterFormConfiguration[this.helpersService.getCaseObjectForms(referenceCaseObject).filterCaseObject][roleTemp.value || roleTemp.name][this.filterKey],
                this.createFilterQueryForList([peopleTemp.user], 'people', caseObject)
              ));
          } else if (this.filterFormConfiguration[roleTemp.value || roleTemp.name] && this.filterFormConfiguration[roleTemp.value || roleTemp.name][this.filterKey]) {
            peopleQueryArray.push(
              this.replaceFilterPlaceholder(
                this.filterFormConfiguration[roleTemp.value || roleTemp.name][this.filterKey],
                this.createFilterQueryForList([peopleTemp.user],
                  'people', caseObject)));
          } else if (isDashboardActionFilter && this.filterFormConfiguration.action && this.filterFormConfiguration.action[roleTemp.value || roleTemp.name] && this.filterFormConfiguration.action[roleTemp.value || roleTemp.name][this.filterKey]) {
            peopleQueryArray.push(
              this.replaceFilterPlaceholder(
                this.filterFormConfiguration.action[roleTemp.value || roleTemp.name][this.filterKey],
                this.createFilterQueryForList([peopleTemp.user],
                  'people', caseObject)));
          }
        } else {
          if (referenceCaseObject && this.filterFormConfiguration[this.helpersService.getCaseObjectForms(referenceCaseObject).filterCaseObject]['otherRoles']) {
            peopleQueryArray.push(
              this.replaceFilterPlaceholder(
                this.filterFormConfiguration[this.helpersService.getCaseObjectForms(referenceCaseObject).filterCaseObject]['otherRoles'][this.filterKey],
                this.createFilterQueryForList([peopleTemp.user],
                  'otherRoles', caseObject), roleTemp.value || roleTemp.name as string));
          } else if (this.filterFormConfiguration['otherRoles']) {
            peopleQueryArray.push(
              this.replaceFilterPlaceholder(
                this.filterFormConfiguration['otherRoles'][this.filterKey],
                this.createFilterQueryForList([peopleTemp.user],
                  'otherRoles', caseObject), roleTemp.value || roleTemp.name as string));
          }
        }
      } else if (caseObject === 'myTeamManagement' && roleTemp && !peopleTemp.user) {
        if (referenceCaseObject) {
          if (this.filterFormConfiguration[this.helpersService.getCaseObjectForms(referenceCaseObject).filterCaseObject][roleTemp.value || roleTemp.name]) {
            peopleQueryArray.push(
              this.replaceFilterPlaceholder(
                this.filterFormConfiguration[
                  this.helpersService.getCaseObjectForms(referenceCaseObject).filterCaseObject][roleTemp.value || roleTemp.name][this.filterKey],
                null, roleTemp.value || roleTemp.name as string));
          } else {
            peopleQueryArray.push(
              this.replaceFilterPlaceholder(
                this.filterFormConfiguration[
                  this.helpersService.getCaseObjectForms(referenceCaseObject).filterCaseObject]['otherRoles'][this.filterKey],
                null, roleTemp.value || roleTemp.name as string));
          }
        } else {
          this.replaceFilterPlaceholder(this.filterFormConfiguration[roleTemp.value || roleTemp.name][this.filterKey],
            null, roleTemp.value || roleTemp.name as string);
        }
      }
      if (peopleQueryArray.length) {
        peopleListQueryArray.push(peopleQueryArray.join(' or '));
      }
    });
    peopleQuery = peopleListQueryArray.length > 1 ? peopleListQueryArray.join(' or ') : peopleListQueryArray.join('');
    return peopleQuery ? '(' + peopleQuery + ')' : '';
  }

  createFilterQueryForList(filterItems: any[], type?: string, caseObject?: string): string {
    let queryString = '';
    if (Array.isArray(filterItems)) {
      filterItems.forEach((res, index, arr) => {
        if (arr.length - 1 === index) {
          if (caseObject === 'myTeamManagement' || caseObject === 'Trackerboard' || caseObject === 'Dashboard') {
            const oldMiraiFilter = (this.selectedCaseObjectType.toUpperCase() === 'CHANGENOTICE' || this.isActionFilter);
            queryString += (this.getValueToAppendByType(res, type, caseObject) !== null ?
                (oldMiraiFilter ? `"${this.getValueToAppendByType(res, type, caseObject)}"` : `${this.getValueToAppendByType(res, type, caseObject)}`) : null
            );
          } else {
            queryString += (this.getValueToAppendByType(res, type, caseObject) !== null ?
                (caseObject !== 'reviewEntry' && caseObject !== 'review' && caseObject !== 'ChangeRequest' && caseObject !== 'ReleasePackage' ?
                  `"${this.getValueToAppendByType(res, type, caseObject)}"` :
                  `${this.getValueToAppendByType(res, type, caseObject)}`) : null
            );
          }
        } else {
          const oldMiraiFilter = (caseObject === 'ChangeRequest' || caseObject === 'ReleasePackage') ? false : (caseObject === 'myTeamManagement' && this.selectedCaseObjectType.toUpperCase() !== 'CHANGENOTICE') ? false : true;
          queryString += (caseObject !== 'reviewEntry' && caseObject !== 'ChangeRequest' && caseObject !== 'ReleasePackage' && oldMiraiFilter) ?
            (`"${this.getValueToAppendByType(res, type, caseObject)}",`) :
            (`${this.getValueToAppendByType(res, type, caseObject)},`);
        }
      });
    } else {
      queryString += `${this.getValueToAppendByType(filterItems, type, caseObject)}`;
    }
    return queryString;
  }

  getValueToAppendByType(value: any, type?: string, caseObject?: string): string {
    if (type === 'people' || type === 'otherRoles') {
      return value.userID || value.user_id;
    } else if (type === 'projectID') {
      return value.wbsElement;
    } else if (type === 'productID') {
      return value.projectDefinition;
    } else if (type === 'reviewItems') {
      return value.ID;
    } else if (type === 'PCCSTRAIMIDs' || type === 'PBSIDs') {
      return value.number || value.ID;
    } else if (type === 'agendaCategory') {
      return `'${value}'`;
    } else if (type === 'linkedItems' && caseObject !== 'review' && caseObject !== 'action') {
      return '\'%' + value + '%\'';
    } else if (type === 'linkedItems' && caseObject === 'action') {
      return `'${value}'`;
    } else if (type === 'linkedItems' && caseObject === 'review') {
      return '*' + value + '*';
    } else if (type === 'keywords') {
      return (caseObject !== 'review' && caseObject !== 'reviewEntry' && caseObject !== 'ChangeRequest' && caseObject !== 'ReleasePackage') ? ('%' + value + '%') : (value);
    } else if (value.label === '-2') {
      return null;
    } else if (value.label === -2) {
      return `99`;
    } else if (type === 'decision') {
      return value === 'Reject' ? 'REJECTED' : '';
    } else if (type === 'group') {
      const valueToEncode = value.name ? value.name : value.group_id ? value.group_id : value;
      return encodeURIComponent(valueToEncode);
    } else if (type === 'changeOwnerType' && caseObject === 'changeNotice') {
      return `"${value}"`;
    } else {
      return value.value || value.name || value;
    }
  }

  isRoleInCaseObject(role: string, caseObjectFilterConfiguration: CaseObjectFilterConfiguration): boolean | string {
    if (Object.keys(caseObjectFilterConfiguration).indexOf(role) > -1) {
      if (caseObjectFilterConfiguration[role] && typeof caseObjectFilterConfiguration[role] === 'string') {
        return caseObjectFilterConfiguration[role];
      } else {
        return true;
      }
    }
    return false;
  }
}
