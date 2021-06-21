import {Injectable} from '@angular/core';
import {MatSort, MatSortable, Sort} from '@angular/material/sort';
import {FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';
import {HttpErrorResponse} from '@angular/common/http';

import {AgendaFormConfiguration, FormControlValidators} from '../../shared/models/mc-configuration.model';
import {FilterOptions} from '../../shared/models/mc-filters.model';
import {
  Agenda,
  AgendaItem,
  ChangeNotice,
  ChangeRequest, MiraiUser,
  Note,
  NoteSummaryElement, Permission, ReleasePackage,
  User, UserType
} from '../../shared/models/mc.model';
import {CaseObjectType, MeetingStates} from '../../shared/models/mc-enums';
import {DateTimeFormatter} from './date-time-formatter.service';
import {StorageService} from '../services/storage.service';
import {Membership} from '../../shared/models/user-profile.model';
import {AgendaOverview} from '../../agenda/agenda.model';
import {Categories, LinkedSourceData, LinkedSourceStatus} from '../../shared/models/mc-presentation.model';

@Injectable({
  'providedIn': 'root'
})
export class HelpersService {
  complexObjectInDotNotation: any;
  prevValue: any;
  newKey: any;
  defaultErrorMessage = '<div>myChange did not work as expected. Create an <a href="https://example.com/selfservice/help.do" target="_blank">IT Call Ticket</a>.' +
    ' <a href="https://example1.aspx" target="_blank">Need help?</a></div>';

  constructor(private readonly matDialog: MatDialog,
              private readonly dateTimeFormatter: DateTimeFormatter,
              private readonly storageService: StorageService) {
  }

  static convertMonthToNumber(month: string): string {
    if (isNaN(parseInt(month, 10))) {
      const monthsMap = new Map([['JAN', '1'], ['FEB', '2'], ['MAR', '3'], ['APR', '4'], ['MAY', '5'], ['JUN', '6'], ['JUL', '7'],
        ['AUG', '8'], ['SEP', '9'], ['OCT', '10'], ['NOV', '11'], ['DEC', '12']]);
      return monthsMap.get(month.toUpperCase());
    } else {
      return month;
    }
  }

  static setSortConfiguration(sort: MatSort, sortConfiguration: Sort): void {
    if (sort) {
      // Manually triggering sort with the input configuration
      sort.sort({
        id: sortConfiguration.active,
        start: sortConfiguration.direction,
        disableClear: true
      } as MatSortable);
      // The below code is a hack to update the sort header so that the sort icons will be reloaded in the UI.
      const activeSortHeader = sort.sortables.get(sortConfiguration.active);
      if (activeSortHeader) {
        activeSortHeader['_setAnimationTransitionState']({
          fromState: sort.direction,
          toState: 'active',
        });
      }
    }
  }

  static getAgendaTypeFromTopic(topic: string): string {
    let type = '';
    if (!topic) {
      return '';
    }
    if (topic.indexOf('CR') === 0) {
      type = 'ChangeRequest';
    } else if (topic.indexOf('CN') === 0) {
      type = 'ChangeNotice';
    } else if (topic.indexOf('RP') === 0) {
      type = 'ReleasePackage';
    } else if (topic.indexOf('AG') === 0) {
      type = 'Agenda';
    } else if (topic.indexOf('AI') === 0) {
      type = 'AgendaItem';
    } else if (topic.indexOf('AIR/PBS') === 0) {
      type = 'AIRPBSItems';
    }
    return type;
  }

  static getIDFromTopic(topic: string): string {
    return topic ? topic.split(' ')[1] : '';
  }

  static getCaseObjectTypeFromServiceRootURL(urlRoot: string, toLowerCase?: boolean): string {
    let caseObjectType: string;
    switch (urlRoot) {
      case 'change-requests':
        caseObjectType = CaseObjectType.ChangeRequest;
        break;
      case 'change-notices':
        caseObjectType = CaseObjectType.ChangeNotice;
        break;
      case 'release-packages':
        caseObjectType = CaseObjectType.ReleasePackage;
        break;
      case 'agendas':
        caseObjectType = CaseObjectType.Agenda;
        break;
      case 'actions':
        caseObjectType = CaseObjectType.Action;
        break;
      case 'reviews':
        caseObjectType = CaseObjectType.Review;
        break;
    }
    return toLowerCase ? caseObjectType.toLowerCase() : caseObjectType;
  }

  static isPastDate(date): boolean {
    date = moment(date, 'YYYY-MM-DDThh:mm:ssTZD').format('YYYY-MM-DD');
    return moment(date) > moment();
  }

  static getDaysLeftFromNow(date): number {
    date = moment(date, 'YYYY-MM-DDThh:mm:ssTZD').format('YYYY-MM-DD');
    const startDate = moment().format('YYYY-MM-DD');
    const endDate = moment(date);
    if (endDate.diff(startDate, 'days') === 1) {
      return 1;
    } else {
      return endDate.diff(startDate, 'days');
    }
  }

  static isCaseObjectInFinalState(caseObject: string, status: string): boolean {
    caseObject = caseObject.toUpperCase();
    switch (caseObject) {
      case 'CHANGEREQUEST':
        return (status === 'REJECTED' || status === 'CLOSED' || status === 'OBSOLETED');
      case 'CHANGENOTICE':
        return (status === 'IMPLEMENTED' || status === 'OBSOLETED');
      case 'RELEASEPACKAGE':
        return (status === 'CLOSED' || status === 'OBSOLETED');
      default:
        return false;
    }
  }

  static getAgendaMeetingState(status: string): string {
    if (status.toLowerCase() === 'prepare-minutes') {
      return MeetingStates.during;
    } else if (status.toLowerCase() === 'completed') {
      return MeetingStates.after;
    }
    return MeetingStates.before;
  }

  static isOfflineAgendaItem(agendaItem: AgendaItem) {
    return agendaItem ? agendaItem.purpose && agendaItem.purpose === 'OFFLINE-DECISION' : false;
  }

  getErrorMessage(error?: HttpErrorResponse) {
    if (error && error.error && error.error instanceof ErrorEvent) {
      return this.defaultErrorMessage;
    } else if (error && error.error && error.error.Detail && error.error.Detail.Message) {
      const messageToReplace = error.error.TransactionID ? error.error.TransactionID : '';
      const message = error.error.Detail.Message.replace('@TxId@', messageToReplace);
      return message;
    }
    return this.defaultErrorMessage;
  }

  getErrorCode(error?: HttpErrorResponse) {
    if (error && error.error && error.error.Detail && error.error.Detail.Code) {
      return error.error.Detail.Code;
    }
  }

  getErrorLevel(error: HttpErrorResponse) {
    if (error && error.error && error.error instanceof ErrorEvent) {
      return InfoLevels.ERROR;
    } else if (error && error.error && error.error.Detail && error.error.Detail.Message) {
      const messageToReplace = error.error.TransactionID ? error.error.TransactionID : '';
      const severity = error.error.Detail.severity;
      return severity === -2 ? InfoLevels.WARN : InfoLevels.ERROR;
    }
    return InfoLevels.ERROR;
  }

  convertComplexObjToDotNotation(obj, current?) {
    if (!current) {
      this.complexObjectInDotNotation = {};
    }
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        /* These (minLength, maxLength, required, pattern) are the keys of the FormControlValidators interface
         and needs to be changed if FormControlValidators keys changed */
        if (['minLength', 'maxLength', 'min_length', 'max_length', 'required', 'pattern'].indexOf(key) === -1) {
          this.newKey = (current ? `${current}.${key}` : key);
          this.prevValue = obj[key];
          this.complexObjectInDotNotation[this.newKey] = {};
          this.convertComplexObjToDotNotation(value, this.newKey);
        } else {
          this.complexObjectInDotNotation[this.newKey] = (this.prevValue) as FormControlValidators;
        }
      }
    }
    if (Object.keys(obj).length === 0) {
      this.complexObjectInDotNotation[current] = {};
    }
    return this.complexObjectInDotNotation;
  }

  removeEmptyKeysFromObject(obj) {
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) === '[object Date]' && (obj[key].toString().length === 0 || obj[key].toString() === 'Invalid Date')) {
        delete obj[key];
      } else if (obj[key] && typeof obj[key] === 'object') {
        this.removeEmptyKeysFromObject(obj[key]);
      } else if (obj[key] == null || obj[key] === '') {
        delete obj[key];
      }

      if (obj[key]
        && typeof obj[key] === 'object'
        && Object.keys(obj[key]).length === 0
        && Object.prototype.toString.call(obj[key]) !== '[object Date]') {
        delete obj[key];
      }
    });
    return obj;
  }

  hasValidator(control: string, validator: string, formGroupRef: FormGroup): boolean {
    if (formGroupRef && formGroupRef.get(control) && formGroupRef.get(control).validator && formGroupRef.get(control).validator(formGroupRef.get(control))) {
      return !!formGroupRef.get(control).validator(formGroupRef.get(control)).hasOwnProperty(validator);
    } else {
      return false;
    }
  }

  getAgendaStatusHelpTextMap(agendaFormConfiguration: AgendaFormConfiguration): Map<string, string> {
    if (agendaFormConfiguration.generalInformation.status.help) {
      const helpTextMap = new Map<string, string>();
      const helpTextTempArray = agendaFormConfiguration.generalInformation.status.help['message'].split('.');
      helpTextTempArray.forEach(helpText => {
        if (helpText.indexOf(':') > -1) {
          const helpTextArray = helpText.split(':');
          helpTextMap.set(helpTextArray[0].trim(), helpTextArray[1].trim());
        }
      });
      return helpTextMap;
    }
    return null;
  }

  getDefaultNoteObject(user): Note {
    const noteObj = new Note();
    noteObj.createdBy = new User(user) || {};
    noteObj.createdOn = new Date();
    return noteObj;
  }

  getDefaultNoteSummaryObject(user: User): NoteSummaryElement {
    const noteSummaryObj = new NoteSummaryElement();
    noteSummaryObj.note = this.getDefaultNoteObject(user);
    noteSummaryObj.attachments = [];
    return noteSummaryObj;
  }

  getCaseObjectForms(caseObjectName: string) {
    const caseObject = caseObjectName ? JSON.parse(JSON.stringify(caseObjectName)).toLowerCase() : '';
    if (caseObject.indexOf('add-') > -1) {
      return {
        'filterCaseObject': caseObjectName,
        'caseObject': caseObjectName,
        'title': caseObjectName,
        'path': caseObjectName,
        'abbr': caseObjectName,
      };
    } else if (caseObject.toLowerCase().indexOf('request') > -1 || caseObject.indexOf('cr') > -1) {
      return {
        'filterCaseObject': 'changeRequest',
        'caseObject': 'ChangeRequest2.0',
        'title': 'Change Request',
        'path': 'change-requests',
        'caps': CaseObjectType.ChangeRequest,
        'abbr': 'CR',
        'iconPath': 'change-request'
      };
    } else if (caseObject.indexOf('notice') > -1 || caseObject.indexOf('cn') > -1) {
      return {
        'filterCaseObject': 'changeNotice',
        'caseObject': 'ChangeNotice',
        'title': 'Change Notice',
        'path': 'change-notices',
        'caps': CaseObjectType.ChangeNotice,
        'abbr': 'CN',
        'iconPath': 'change-notice'
      };
    } else if (caseObject.indexOf('package') > -1 || caseObject.indexOf('rp') > -1) {
      return {
        'filterCaseObject': 'releasePackage',
        'caseObject': 'ReleasePackage2.0',
        'title': 'Release Package',
        'path': 'release-packages',
        'caps': CaseObjectType.ReleasePackage,
        'abbr': 'RP',
        'iconPath': 'release-package'
      };
    } else if (caseObject.indexOf('dashboard') > -1) {
      return {
        'filterCaseObject': 'dashboard',
        'caseObject': 'Dashboard',
        'title': 'Dashboard',
        'path': 'dashboard',
        'caps': CaseObjectType.Dashboard,
        'abbr': 'Dashboard'
      };
    } else if (caseObject.indexOf('action') > -1) {
      return {
        'filterCaseObject': 'action',
        'caseObject': 'Action',
        'title': 'Action',
        'path': 'actions',
        'caps': CaseObjectType.Action,
        'abbr': 'Action'
      };
    } else if (caseObject.indexOf('agendaitem') > -1) {
      return {
        'filterCaseObject': 'agendaItem',
        'caseObject': 'AgendaItem',
        'title': 'Agenda Items',
        'path': 'agenda-items',
        'caps': CaseObjectType.AgendaItem,
        'abbr': 'AI'
      };
    } else if (caseObject.indexOf('agenda') > -1) {
      return {
        'filterCaseObject': 'agenda',
        'caseObject': 'Agenda',
        'title': 'Agenda',
        'path': 'agendas',
        'caps': CaseObjectType.Agenda,
        'abbr': 'Agenda'
      };
    } else if (caseObject.indexOf('reviewentry') > -1) { // checking review entry before review on purpose as index of is being used
      return {
        'filterCaseObject': 'reviewEntry',
        'caseObject': 'ReviewEntry2.0',
        'title': 'ReviewEntry',
        'path': 'review-entry',
        'caps': CaseObjectType.ReviewEntry,
        'abbr': 'ReviewEntry'
      };
    } else if (caseObject.indexOf('review') > -1) {
      return {
        'filterCaseObject': 'review',
        'caseObject': 'Review2.0',
        'title': 'Review',
        'path': 'reviews',
        'caps': CaseObjectType.Review,
        'abbr': 'Review'
      };
    } else if (caseObject.indexOf('trackerboard') > -1) {
      return {
        'filterCaseObject': 'trackerboard',
        'caseObject': 'Trackerboard',
        'title': 'Trackerboard',
        'path': 'trackerboard',
        'caps': CaseObjectType.Trackerboard,
        'abbr': 'Trackerboard'
      };
    } else if (caseObject.indexOf('decision') > -1) {
      return {
        'filterCaseObject': 'decisionLog',
        'caseObject': 'Decision',
        'title': 'Decision',
        'path': 'decisionLog',
        'caps': CaseObjectType.DecisionLog,
        'abbr': 'Decision'
      };
    } else if (caseObject.indexOf('myteammanagement') > -1) {
      return {
        'filterCaseObject': 'myTeamManagement',
        'caseObject': 'MyTeamManagement',
        'title': 'MyTeamManagement',
        'path': 'my-team-management',
        'caps': CaseObjectType.MyTeamManagement,
        'abbr': 'MyTeamManagement'
      };
    } else if (caseObject.indexOf('myteam') > -1) {
      return {
        'filterCaseObject': 'myTeam',
        'caseObject': 'MyTeam',
        'title': 'MyTeam',
        'path': 'my-team',
        'caps': CaseObjectType.MyTeam,
        'abbr': 'MyTeam'
      };
    } else if (caseObject.indexOf('announcement') > -1) {
      return {
        'filterCaseObject': 'announcement',
        'caseObject': 'Announcement',
        'title': 'Announcement',
        'path': 'announcements',
        'caps': CaseObjectType.MyTeam,
        'abbr': 'Announcement'
      };
    } else if (caseObject.indexOf('notification') > -1) {
      return {
        'filterCaseObject': 'notification',
        'caseObject': 'Notification',
        'title': 'Notification',
        'path': 'notifications',
        'caps': CaseObjectType.Notification,
        'abbr': 'Notification'
      };
    } else if (caseObject.indexOf('unreadNotification') > -1) {
      return {
        'filterCaseObject': 'unreadNotification',
        'caseObject': 'UnreadNotification',
        'title': 'Notification',
        'path': 'notifications',
        'caps': CaseObjectType.Notification,
        'abbr': 'Notification'
      };
    } else if (caseObject.indexOf('readNotification') > -1) {
      return {
        'filterCaseObject': 'readNotification',
        'caseObject': 'ReadNotification',
        'title': 'Notification',
        'path': 'notifications',
        'caps': CaseObjectType.Notification,
        'abbr': 'Notification'
      };
    } else if (caseObject.indexOf('dashboardNotificationWidget') > -1) {
      return {
        'filterCaseObject': 'dashboardNotificationWidget',
        'caseObject': 'DashboardNotificationWidget',
        'title': 'Notification',
        'path': 'notifications',
        'caps': CaseObjectType.Notification,
        'abbr': 'Notification'
      };
    } else if (caseObject.indexOf('upcomingmeetingswidget') > -1) {
      return {
        'filterCaseObject': 'Dashboard',
        'caseObject': 'Dashboard',
        'title': 'Upcoming Meetings Widget',
        'path': 'dashbaord',
        'caps': CaseObjectType.Dashboard,
        'abbr': 'Dashboard'
      };
    } else if (caseObject.indexOf('read only cia') > -1) {
      return {
        'caseObject': 'ReadOnlyCIA2.0',
        'title': 'Read Only CIA'
      };
    }
  }

  generateFilterQuery(filterName: string, filterOptions: FilterOptions, caseObject: String): string {
    return `${btoa(JSON.stringify({
      filterName: filterName,
      filterOptions: filterOptions,
      caseObject: caseObject
    }))}`;

  }

  getActionTypeAndTitleMapping() {
    return [
      {'title': 'Complete DIA-BOM ', 'type': 'DIA-BOM'},
      {'title': 'Complete Implementation Strategy ', 'type': 'IMPLEMENTATION-STRATEGY'},
      {'title': 'Check AIR Issue Status / TWL Line Item ', 'type': 'AIR'},
      {'title': 'Check / Complete CBC ', 'type': 'COMPLETE-BUSINESS-CASE'},
      {'title': 'Complete Customer Impact ', 'type': 'CUSTOMER-IMPACT'},
      {'title': 'Check Dependencies ', 'type': 'DEPENDENCY'},
      {'title': 'Complete Implementation Plan ', 'type': 'IMPLEMENTATION-PLAN'},
      {'title': 'Monitor State Of ', 'type': 'MONITORING'},
      {'title': '', 'type': 'OTHER'},
      {'title': 'Complete WIP-FAT Tool / Validation ', 'type': 'WIP-FAT'},
      {'title': 'Provide X-Sector Deliverables ', 'type': 'X-SECTOR-DELIVERABLES'},
      {'title': '', 'type': 'ENRICHMENT'}
    ];
  }

  getActionTitleFromType(type) {
    const mappingData = this.getActionTypeAndTitleMapping().filter(item => item.type === type)[0];
    return (mappingData && mappingData.title) ? mappingData.title : '';
  }

  checkForValidMemberships(members: Membership[]) {
    let isValidMemberships = false;
    members.forEach((member: Membership) => {
      if (member.category.toUpperCase() === 'CHANGESPECIALISTS' || member.category.toUpperCase() === 'OTHERS') {
        isValidMemberships = true;
      }
    });
    return isValidMemberships;
  }

  checkForValidRoles(roles: string[]) {
    let isValidRoles = false;
    roles.forEach((role: string) => {
      if (role.includes('change-specialist') || role.includes('administrator') || role.includes('user')) {
        isValidRoles = true;
      }
    });
    return isValidRoles;
  }

  isAuthorizedToChangeDocuments(page: string, status: string, roles: string[]): boolean {
    let isAuthorized = true;
    switch (page) {
      case 'ChangeRequest':
        if ((status === 'REJECTED' || status === 'CLOSED' || status === 'OBSOLETED') ||
          (status === 'APPROVED' && !(roles.indexOf('changeSpecialist2') > -1 || roles.indexOf('changeSpecialist1') > -1))) {
          isAuthorized = false;
        }
        return isAuthorized;
      case 'ChangeNotice':
        if (status === 'IMPLEMENTED' || status === 'OBSOLETED') {
          isAuthorized = false;
        }
        return isAuthorized;
      case 'ReleasePackage':
        if (status === 'CLOSED' || status === 'OBSOLETED') {
          isAuthorized = false;
        }
        return isAuthorized;
    }
  }

  getNextStatus(status: number): string {
    switch (status) {
      case 1: {
        return 'SUBMIT';
      }
      case 2: {
        return 'DEFINE_SOLUTION';
      }
      case 3: {
        return 'ANALYZE_IMPACT';
      }
      case 4: {
        return 'APPROVE';
      }
      case 5: {
        return 'CLOSE';
      }
      case 6: {
        return 'CLOSE';
      }
      case 7: {
        return 'REJECT';
      }
      default:
        break;
    }
    return null;
  }

  isAgendaItemsPurposeFilled(agendaOverview: AgendaOverview) {
    let purposeFilled = true;
    for (const key in agendaOverview) {
      if (agendaOverview.hasOwnProperty(key) && agendaOverview[key].agendaItemsOverview) {
        agendaOverview[key].agendaItemsOverview.every((section) => {
          if (section.agendaItemDetails) {
            section.agendaItemDetails.every(agendaItemDetail => {
              purposeFilled = !!agendaItemDetail.agendaItem.purpose;
              return purposeFilled;
            });
          }
          return purposeFilled;
        });
        if (!purposeFilled) {
          break;
        }
      }
    }
    return purposeFilled;
  }

  areAgendaItemsInFinalState(agendaOverview: AgendaOverview) {
    let agendaItemInFinalStatus = true, agendaItemStatus = '';
    for (const key in agendaOverview) {
      if (agendaOverview[key] && agendaOverview[key].agendaItemsOverview) {
        agendaItemInFinalStatus = agendaOverview[key].agendaItemsOverview.every(section => {
          if (section.agendaItemDetails) {
            agendaItemInFinalStatus = section.agendaItemDetails.every(agendaItem => {
              if (agendaItem.agendaItem.generalInformation.status) {
                agendaItemStatus = agendaItem.agendaItem.generalInformation.status.toLowerCase();
              }
              return (agendaItemStatus === 'postponed' || agendaItemStatus === 'approved' || agendaItemStatus === 'rejected' || agendaItemStatus === 'discussed');
            });
          }
          return agendaItemInFinalStatus;
        });
        if (!agendaItemInFinalStatus) {
          break;
        }
      }
    }
    return agendaItemInFinalStatus;
  }

  getDefaultHelpForCBRule() {
    return '<p>There is no help available for this Change Board rule. Please ask Change Specialist 1 or Administrator to add it.</p>';
  }

  getAgendaItemCardType(meetingState: string, category: string, isAOB: boolean, isOffline: boolean): string {
    let type = `${meetingState}-${category.toLowerCase()}`;
    type += isAOB ? '-aob' : '';
    type += isOffline ? '-offline' : '';
    return type;
  }

  getCardVerticalPosition(offSetPosition: number) {
    if (offSetPosition > (window.innerHeight * 0.5)) {
      return 'above';
    } else {
      return 'below';
    }
  }

  getNotificationIcon(type: string, caseType?: string) {
    switch (type.toUpperCase()) {
      case 'STATUSCHANGE':
        return caseType ? this.getNotificationIcon(caseType) : 'notifications';
      case 'ACTION':
        return 'assignment';
      case 'ANNOUNCEMENT':
        return 'notifications';
      case 'MYTEAM':
        return 'group';
      case 'CHANGEREQUEST':
        return 'change-request';
      case 'CHANGENOTICE':
        return 'change-notice';
      case 'RELEASEPACKAGE':
        return 'release-package';
      case 'REVIEW':
        return 'rate_review';
      case 'default':
        return 'notifications';
    }
  }

  getNotificationFilterQuery(filterOptions: FilterOptions) {
    let filterQuery = {};
    if (filterOptions) {
      if (filterOptions.people && filterOptions.people.length > 0) {
        const actor = filterOptions.people[0].users;
        if (actor && actor instanceof Array) {
          filterQuery['userIDs'] = actor.map(user => user.userID);
          filterQuery['userIDs'] = filterQuery['userIDs'].join(',');
        }
      }
      if (filterOptions.type) {
        filterQuery['type'] = filterOptions.type.map(type => type.value);
        filterQuery['type'] = filterQuery['type'].join(',');
      }
      filterQuery['linkedChangeObject'] = filterOptions.linkedChangeObject;
      if (filterOptions.createdOn && filterOptions.createdOn.begin) {
        filterQuery['createdOnBegin'] = (typeof filterOptions.createdOn.begin !== 'string') ? filterOptions.createdOn.begin.toISOString() : filterOptions.createdOn.begin;
      }
      if (filterOptions.createdOn && filterOptions.createdOn.end) {
        if (typeof filterOptions.createdOn.end !== 'string') {
          filterOptions.createdOn.end.setHours(23);
          filterOptions.createdOn.end.setMinutes(59);
          filterOptions.createdOn.end.setSeconds(59);
          filterQuery['createdOnFinish'] = filterOptions.createdOn.end.toISOString();
        } else {
          filterQuery['createdOnFinish'] = filterOptions.createdOn.end;
        }
      }
      if (filterOptions.keywords) {
        filterQuery['search'] = filterOptions.keywords;
      }
    }
    filterQuery = this.removeEmptyKeysFromObject(filterQuery);
    return filterQuery;
  }

  getUserTimeZone(date: string | Date) {
    if (date) {
      const timezoneOffset = new Date(date).getTimezoneOffset();
      const timeZone = (Math.abs(timezoneOffset / 60)).toString().split('.');
      const hours = ('0' + timeZone[0]).slice(-3);
      const minutes = timeZone[1] ? ('0' + (parseInt(timeZone[1], 10) * 6)).slice(-2) : '00';
      const time = hours + ':' + minutes;
      return timezoneOffset < 0 ? 'GMT+' + time : 'GMT-' + time;
    }
    return '';
  }


  mergeTasks(subList1: Categories, subList2: Categories) {
    const mergedList = {};
    mergedList['categories'] = [];
    mergedList['totalItems'] =
      (subList1['totalItems'] || subList1['total_items']) +
      (subList2['totalItems'] || subList2['total_items']);
    if (subList1 && subList1['categories']) {
      subList1['categories'].forEach((category1) => {
        const mergedCategory = {};
        if (subList2 && subList2['categories']) {
          subList2['categories'].forEach((category2) => {
            if (category1['name'] === category2['name']) {
              mergedCategory['name'] = JSON.parse(JSON.stringify(category1['name']));
              mergedCategory['totalItems'] =
                (category1['totalItems'] !== undefined ? category1['totalItems'] : category1['total_items']) +
                (category2['totalItems'] !== undefined ? category2['totalItems'] : category2['total_items']);
              if (
                (category1['subCategories'] && category1['subCategories'][0] && category1['subCategories'][0]['items']) ||
                (category1['sub_categories'] && category1['sub_categories'][0] && category1['sub_categories'][0]['items'])
                ||
                (category2['subCategories'] && category2['subCategories'][0] && category2['subCategories'][0]['items']) ||
                (category2['sub_categories'] && category2['sub_categories'][0] && category2['sub_categories'][0]['items'])
              ) {
                mergedCategory['subCategories'] = [{items: []}];
                mergedCategory['subCategories'][0]['items']
                  .push(...(
                    category1['subCategories'] && category1['subCategories'][0] && category1['subCategories'][0]['items'] ||
                    category1['sub_categories'] && category1['sub_categories'][0] && category1['sub_categories'][0]['items'] ||
                    [])
                  );
                mergedCategory['subCategories'][0]['items']
                  .push(...(
                    category2['subCategories'] && category2['subCategories'][0] && category2['subCategories'][0]['items'] ||
                    category2['sub_categories'] && category2['sub_categories'][0] && category2['sub_categories'][0]['items'] ||
                    [])
                  );
              }
              mergedList['categories'].push(mergedCategory);
            }
          });
        }
      });
    }
    return mergedList as Categories;
  }


  getCRStatusByStateLabel(state: string): string {
    switch (state) {
      case 'CREATE':
      case 'Create':
        return '1';
      case 'DEFINE_SOLUTION':
      case 'Define Solution':
      case 'Define-Solution':
        return '2';
      case 'ANALYZE_IMPACT':
      case 'Analyze Impact':
      case 'Analyze-Impact':
        return '3';
      case 'DECIDE':
      case 'Decide':
        return '4,5';
      case 'CLOSE':
      case 'Close':
        return '6,7';
    }
  }

  getRPStatusByStateLabel(state: string): string {
    switch (state) {
      case 'NEW':
      case 'New':
        return '1';
      case 'CREATED':
      case 'Created':
        return '2';
      case 'READY FOR RELEASE':
      case 'Ready For Release':
      case 'Ready-For-Release':
        return '3';
      case 'RELEASED':
      case 'Released':
        return '4';
      case 'CLOSED':
      case 'Closed':
        return '5';
      case 'OBSOLETED':
      case 'Obsoleted':
        return '6';
      case 'I WAS ADDED TO A RP':
        return '7';
      case 'I WAS REMOVED FROM A RP':
        return '8';
    }
  }

  getPathByInstanceId(fieldId: string, caseObjectType: string) {
    switch (caseObjectType) {
      case 'ChangeRequest':
        if (fieldId.split('.').length > 1) {
          return 'change-requests/' + fieldId.split('.')[fieldId.split('.').length - 2].split('_').join('-');
        } else {
          return 'change-requests';
        }
      case 'ReleasePackage':
        if (fieldId.split('.').length > 1) {
          return 'release-packages/' + fieldId.split('.')[0].split('_').join('-');
        } else {
          return 'release-packages';
        }
    }
  }

  getStateLabelByStatus(state: string): string {
    switch (state) {
      case '1':
        return 'CREATE';
      case '2':
        return 'DEFINE_SOLUTION';
      case '3':
        return 'ANALYZE_IMPACT';
      case '4':
      case '5':
        return 'DECIDE';
      case '6':
      case '7':
        return 'CLOSE';
    }
  }

  // Below two methods are used in add-agenda-item-dialog as the logic has different status for DRAFT and NEW status of the linked CR (DRAFT_CR, NEW_CR)
  getLinkedObjectStatusLabelFromStatus(status: number): string {
    switch (status) {
      case 1:
        return 'DRAFT_CR';
      case 2:
        return 'NEW_CR';
      case 3:
        return 'SOLUTION-DEFINED';
      case 4:
        return 'IMPACT-ANALYZED';
      case 5:
        return 'APPROVED';
      case 7:
        return 'REJECTED';
    }
  }

  getLinkedObjectStatusFromStatusLabel(statusLabel: string): number {
    switch (statusLabel) {
      case 'DRAFT_CR':
        return 1;
      case 'NEW_CR':
        return 2;
      case 'SOLUTION-DEFINED':
        return 3;
      case 'IMPACT-ANALYZED':
        return 4;
      case 'APPROVED':
        return 5;
      case 'CLOSED':
        return 6;
      case 'REJECTED':
        return 7;
      case 'OBSOLETED':
        return 8;
    }
  }

  getCRStatusLabelFromStatus(status: number): string {
    switch (status) {
      case 1:
        return 'DRAFT';
      case 2:
        return 'NEW';
      case 3:
        return 'SOLUTION-DEFINED';
      case 4:
        return 'IMPACT-ANALYZED';
      case 5:
        return 'APPROVED';
      case 6:
        return 'CLOSED';
      case 7:
        return 'REJECTED';
      case 8:
        return 'OBSOLETED';
    }
  }

  getCRStatusFromStatusLabel(statusLabel: string): number {
    switch (statusLabel) {
      case 'DRAFT':
        return 1;
      case 'NEW':
        return 2;
      case 'SOLUTION-DEFINED':
      case 'SOLUTION DEFINED':
        return 3;
      case 'IMPACT-ANALYZED':
      case 'IMPACT ANALYZED':
        return 4;
      case 'APPROVED':
        return 5;
      case 'CLOSED':
        return 6;
      case 'REJECTED':
        return 7;
      case 'OBSOLETED':
        return 8;
      case 'I WAS ADDED TO A CR':
        return 9;
      case 'I WAS REMOVED FROM A CR':
        return 10;
    }
  }

  getReviewStatusFromStatusLabel(statusLabel: string): number {
    switch (statusLabel) {
      case 'REVIEW TASK COMPLETED':
        return 1;
      case 'REVIEW IS CREATED':
        return 2;
      case 'REVIEW IS COMPLETED':
        return 3;
      case 'REVIEW VALIDATION HAS STARTED':
        return 4;
    }
  }

  getPriorityFromAnalysisPriority(prio: string): string {
    switch (prio) {
      case '1':
        return '1 - Critical';
      case '2':
        return '2 - High';
      case '3':
        return '3 - Medium';
      case '4':
        return '4 - Low';
      default:
        return 'None';
    }
  }

  getAnalysisPriorityFromPriority(prio: string): number {
    switch (prio) {
      case '1 - Critical':
        return 1;
      case '2 - High':
        return 2;
      case '3 - Medium':
        return 3;
      case '4 - Low':
        return 4;
      default:
        return 0;
    }
  }

  isCamelCase(str: string): boolean {
    return /^([a-z]+)(([A-Z]([a-z]+))+)$/.test(str);
  }

  convertToSentenceCase(text: string): string {
    if (this.isCamelCase(text)) {
      const result = text.replace(/([A-Z])/g, ' $1');
      const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
      return finalResult;
    } else {
      return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    }
  }

  // This function is used to download an attachment or document by passing the document related data and the response of the getDocumentContent service call
  downloadAttachmentOnClick(documentData, responseData) {
    const dataType = documentData.type;
    const binaryData = [];
    binaryData.push(responseData);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    if (documentData.name) {
      downloadLink.setAttribute('download', documentData.name);
    }
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.parentNode.removeChild(downloadLink);
  }

  getCommentStatusLabelFromStatusID(id: number) {
    switch (id) {
      case 1:
        return 'DRAFT';
      case 2:
        return 'PUBLISHED';
      case 3:
        return 'REMOVED';
    }
  }

  getCRAnalysisPriority(id: number): string {
    switch (id) {
      case 1:
        return '1 - Critical';
      case 2:
        return '2 - High';
      case 3:
        return '3 - Medium';
      case 4:
        return '4 - Low';
      default:
        return null;
    }
  }

  getPayloadForRPCreation(changeNoticeElement, changeRequestElement: ChangeRequest, myTeam: Permission[]) {
    const payload = {
      'release_package': {
        'contexts': [
          {
            'type': 'CHANGENOTICE',
            'context_id': changeNoticeElement ? changeNoticeElement.ID : '',
            'status': changeNoticeElement ? changeNoticeElement.generalInformation.status : '',
            'name': changeNoticeElement ? changeNoticeElement.generalInformation.title : ''
          },
          {
            'type': 'CHANGEREQUEST',
            'context_id': changeRequestElement ? changeRequestElement.id : '',
            'status': changeRequestElement ? changeRequestElement.status : '',
            'name': changeRequestElement ? changeRequestElement.title : ''
          }
        ],
        'title': changeNoticeElement.generalInformation.title,
        'product_id': (changeNoticeElement.productID && changeNoticeElement.productID['projectDefinition']) || changeNoticeElement.productID,
        'project_id': (changeNoticeElement.projectID && changeNoticeElement.projectID['wbsElement']) || changeNoticeElement.projectID,
        'planned_release_date': '',
        'planned_effective_date': '',
        'change_control_boards': changeNoticeElement.changeControlBoard.map((res) => {
          return res.role === 'CCB' ? res.group : '';
        }),
        'tags': changeNoticeElement.tags,
        'is_secure': changeNoticeElement.secure,
        'change_owner': changeNoticeElement.changeOwner ? new MiraiUser(changeNoticeElement.changeOwner) : null,
        'change_owner_type': changeNoticeElement.changeOwnerType ? changeNoticeElement.changeOwnerType : null,
        'types': ['HW']
      },
      'my_team_details': this.getMyTeamPayloadForImpactedItem(myTeam, 'ChangeNotice')
    };
    if (!payload.release_package.product_id) {
      delete payload.release_package.product_id;
    }
    if (!payload.release_package.project_id) {
      delete payload.release_package.product_id;
    }
    return payload;
  }

  getPayLoadForCloneAgenda(crArrayList) {
    const payload = [];
    crArrayList.forEach((item) => {
      const object = {};
      object['ID'] = item.id;
      object['revision'] = 'AA';
      object['type'] = item.type;
      object['title'] = item.title;
      object['status'] = item.status;
      object['priority'] = item.analysis_priority;
      object['totalOpenActions'] = item.open_actions;
      object['totalDueSoonActions'] = 0;
      object['totalOverdueActions'] = 0;
      object['project'] = {
        definition: item && item.pmo_details && item.pmo_details.project_id,
        description: item && item.pmo_details && item.pmo_details.description
      };
      object['product'] = {
        definition: item && item.pmo_details && item.pmo_details.product_id,
        description: item && item.pmo_details && item.pmo_details.description
      };
      object['implementationPriority'] = item.implementation_priority;
      object['requirementsForImpPlan'] = item.requirements_for_implementation_plan;
      object['changeSpecialist2'] = new User(item.change_specialist2);
      object['group'] = [];
      object['CBGroups'] = item.change_boards ? item.change_boards.slice(1, item.change_boards.length - 1).split(',') : [];
      object['CCBGroups'] = item.change_control_boards ? item.change_control_boards.slice(1, item.change_control_boards.length - 1).split(',') : [];
      payload.push(object);
    });
    return payload;
  }

  getItemContainerPayload(caseObjectType: string, caseObjectData) {
    const payload: any = {
      'change_object': {
        'change_object_type': caseObjectType.toUpperCase(),
        'change_object_number': caseObjectType.toUpperCase() === 'RELEASEPACKAGE' ? caseObjectData.release_package.release_package_number : caseObjectData.id,
        'change_object_title': caseObjectType.toUpperCase() === 'RELEASEPACKAGE' ? caseObjectData.release_package.title : caseObjectData.title,
        'change_object_status': caseObjectType.toUpperCase() === 'RELEASEPACKAGE' ? caseObjectData.release_package.status : caseObjectData.status,
        'is_secure': caseObjectType.toUpperCase() === 'RELEASEPACKAGE' ? caseObjectData.release_package.is_secure : caseObjectData.is_secure
      },
      'my_team_details': (caseObjectType.toUpperCase() === 'RELEASEPACKAGE') ?
        (this.getMyTeamPayloadForImpactedItem(caseObjectData.my_team_details, caseObjectType)) :
        (this.getMyTeamPayloadForImpactedItem(caseObjectData.my_team, caseObjectType))
    };
    if (caseObjectType && caseObjectType.toUpperCase() === 'RELEASEPACKAGE') {
      payload.change_object.contexts = caseObjectData.release_package.contexts.filter(context => context.type === 'ECN');
      payload.change_object.sub_types = caseObjectData.release_package.types;
    }
    return payload;
  }

  getMyTeamPayloadForImpactedItem(data: any, caseObjectType: string) {
    if (caseObjectType !== 'ChangeNotice') {
      const my_team = JSON.parse(JSON.stringify(data));
      delete my_team.id;
      if (my_team.members && my_team.members.length > 0) {
        my_team.members.forEach(member => {
          delete member.member.id;
          delete member.member.status;
        });
      }
      if (my_team.my_team) {
        delete my_team.my_team;
      }
      return my_team;
    } else {
      const permissions = JSON.parse(JSON.stringify(data));
      const members: any = [];
      permissions.forEach(permission => {
        if (permission.userID && permission.roles) {
          if (permission.roles.includes('submitterRequestor')) {
            if (permission.roles.length > 1) {
              permission.roles = permission.roles.filter(role => role !== 'submitterRequestor');
              members.push({'member': {'user': new MiraiUser(permission), 'roles': permission.roles}});
            }
          } else {
            members.push({'member': {'user': new MiraiUser(permission), 'roles': permission.roles}});
          }
        }
      });
      return {
        members: members
      };
    }
  }

  getLinkedSourceData(backgroundTasksData: Categories, rpData: ReleasePackage) {
    const linkedSourceData = new LinkedSourceData();
    const linkedSources = [];
    if (backgroundTasksData && backgroundTasksData.categories) {
      backgroundTasksData.categories.forEach((category) => {
        linkedSources[category.name] = [];
        if (category && category.subCategories) {
          category.subCategories[0].items.forEach((item) => {
            // if current RP id matched the RP item in the job list
            if (item.job && item.job.type === 'RELEASEPACKAGE' &&
              item.job.id === JSON.stringify(rpData.id)
            ) {
              this.setLinkedSourceStatusMessage(item.job, category.name, linkedSourceData);
              if (category.name === 'Failed' && item.job['error']) {
                this.setLinkedSourceErrorMessage(item.job, linkedSourceData);
              } else if (category.name === 'Completed') {
                this.setLinkedSourceContext(item.job, linkedSourceData);
              }
              linkedSources[category.name].push(item);
            }
          });
        }
      });
      // If there are no jobs in Processing they can either be in Failed or Completed
      if (linkedSources['Processing'].length === 0) {
        // If there is a job in failed, it means we need to retry
        if (linkedSources['Failed'].length > 0) {
          linkedSourceData.retryCaseAction = true;
        } else {
          // If there are no jobs in Failed it means jobs were successful
          linkedSourceData.completed = true;
        }
      }
    }
    return linkedSourceData;
  }

  setLinkedSourceContext(job, linkedSourceData) {
    switch (job.action) {
      case 'CREATE-ECN':
      case 'OBSOLETE-ECN':
      case 'RELEASE-ECN':
        linkedSourceData.tc_data.context = job.context;
        break;
      case 'CREATE-MDGCR':
      case 'RELEASE-MDG-CR':
      case 'OBSOLETE-MDG-CR':
        linkedSourceData.mdg_data.context = job.context;
        break;
      case 'CREATE-ER':
        linkedSourceData.se_data.context = job.context;
        break;
      default:
        return true;
    }
  }

  setLinkedSourceErrorMessage(job, linkedSourceData) {
    switch (job.action) {
      case 'CREATE-ECN':
      case 'OBSOLETE-ECN':
      case 'RELEASE-ECN':
        linkedSourceData.tc_data.error = job['error']['code'];
        break;
      case 'CREATE-MDGCR':
      case 'RELEASE-MDG-CR':
      case 'OBSOLETE-MDG-CR':
        linkedSourceData.mdg_data.error = job['error']['code'];
        break;
      case 'CREATE-ER':
        linkedSourceData.se_data.error = job['error']['code'];
        break;
      default:
        return true;
    }
  }

  setLinkedSourceStatusMessage(job, name, linkedSourceData) {
    switch (job.action) {
      case 'CREATE-ECN':
      case 'OBSOLETE-ECN':
      case 'RELEASE-ECN':
        linkedSourceData.tc_data.status = name;
        break;
      case 'CREATE-MDGCR':
      case 'RELEASE-MDG-CR':
      case 'OBSOLETE-MDG-CR':
        linkedSourceData.mdg_data.status = name;
        break;
      case 'CREATE-ER':
        linkedSourceData.se_data.status = name;
        break;
      default:
        return true;
    }
  }

  transformUserName(value: User | UserType): string {
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


  getLinkedSourcesToBeShown(rpData: ReleasePackage) {
    const linkedSourcesToBeShown = new LinkedSourceStatus();
    switch (true) {
      // HW + PR/OP + WI
      case (rpData.type.indexOf('HW') !== -1 && rpData.type.indexOf('PR/OP') !== -1 && rpData.type.indexOf('WI') !== -1):
        linkedSourcesToBeShown.showECN = true;
        linkedSourcesToBeShown.showSDL = true;
        if (rpData.sap_change_control) {
          linkedSourcesToBeShown.showMDG = true;
        }
        break;
      // PR/OP + WI
      case (rpData.type.indexOf('PR/OP') !== -1 && rpData.type.indexOf('WI') !== -1):
        linkedSourcesToBeShown.showECN = true;
        linkedSourcesToBeShown.showSDL = true;
        break;
      // HW
      case (rpData.type.indexOf('HW') !== -1):
        linkedSourcesToBeShown.showECN = true;
        if (rpData.sap_change_control) {
          linkedSourcesToBeShown.showMDG = true;
        }
        break;
      // WI
      case (rpData.type.indexOf('WI') !== -1):
        linkedSourcesToBeShown.showSDL = true;
        break;
      // PR/OP
      case (rpData.type.indexOf('PR/OP') !== -1):
        linkedSourcesToBeShown.showECN = true;
        break;
        return linkedSourcesToBeShown;
    }
  }

  isSpecialFilterApplicable(caseObject, filterKey, selectedCaseObject) {
    return ((caseObject.toUpperCase() === 'CHANGEREQUEST') && (filterKey === 'group' || filterKey === 'PCCSTRAIMIDs' || filterKey === 'actionStatus')) ||
      ((caseObject.toUpperCase() === 'RELEASEPACKAGE') && (filterKey === 'group' || filterKey === 'tags')) ||
      ((caseObject.toUpperCase() === 'MYTEAMMANAGEMENT') && (filterKey === 'group' && (selectedCaseObject.toUpperCase() === 'CHANGEREQUEST' || selectedCaseObject.toUpperCase() === 'RELEASEPACKAGE')));
  }
}

