// import angular specif components here
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {Observable, of, Subject} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Sort} from '@angular/material/sort';

import {environment} from '../../../environments/environment';
import {StorageService} from './storage.service';
import {Group, Membership, UserObject, UserProfile} from '../../shared/models/user-profile.model';
import {HelpersService} from '../utilities/helpers.service';
import {McFiltersModel} from '../../shared/models/mc-filters.model';
import {highSeverityStackFromService} from '../../shared/store';
import {ErrorResponseModel, ErrorState} from '../../shared/models/mc-store.model';
import {DashboardWidgetConfigurationState} from '../../dashboard/dashboard.model';
import {CaseObjectState, McStatesModel} from '../../shared/models/mc-states-model';
import {NotificationConfiguration} from '../../settings/notification-settings/notification-settings.model';
import {User} from '../../shared/models/mc.model';
import {CaseObjectServicePath} from '../../shared/components/case-object-list/case-object.enum';

// import app specific components here

export type UserRole = 'administrator' | 'changeSpecialist1' | 'changeSpecialist2' | 'changeSpecialist3';

@Injectable({
  'providedIn': 'root'
})
export class UserProfileService {
  stateData: McStatesModel;
  userServiceUrl: string;

  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService,
              private readonly storageService: StorageService,
              private readonly errorStore: Store<ErrorState>) {
    this.userServiceUrl = `${environment.rootURL}user-service`;
  }

  public loadUserProfile(): Promise<void> {
    const url = `${environment.rootURL}mc${environment.version}/user-settings`;
    return new Promise((resolve) => {
      this.http.get(url)
        .subscribe((res) => {
          const userDetails = res['userDetails'][0];
          userDetails['user'] = new UserObject(userDetails['user']);
          if (userDetails['user'] && userDetails['user']['memberships'] && userDetails['user']['memberships'].length > 0
            && this.helpersService.checkForValidMemberships(userDetails['user']['memberships'])) {
            this.storageService.set('userProfile', userDetails);
            // setting global variable for dynatrace
            window['user'] = new User(userDetails.user);
          } else {
            this.errorStore.dispatch(highSeverityStackFromService({
                'errorMessage': 'Sorry, you do not have access to myChange.',
                'linkUrl': 'https://example.aspx',
                'disableOverlay': true
              } as ErrorResponseModel
            ));
          }
          resolve();
        });
    });
  }

  updateUserProfileStates(value: McStatesModel, $updateDone?: Subject<void>) {
    this.updateUserState(value).subscribe(() => {
      if ($updateDone) {
        $updateDone.next();
      }
    });
  }

  updateUserState(state: McStatesModel) {
    const payLoad = {
      state: JSON.stringify(state)
    };
    return this.http.post(`${this.userServiceUrl}/states`, payLoad).pipe(map(res => {
        this.saveStateData(res ? res : {});
        return ((res) ? res : {});
      })
    );
  }

  updateState(state: McStatesModel) {
    /*const res = this.getUserProfile();
    res.user.state = JSON.stringify(state);
    this.storageService.set('userProfile', res);*/
    this.stateData = state ? state : new McStatesModel();
  }
  /*not required now*/
  updateUserProfile(payload: UserProfile) {
    const url = `${environment.rootURL}mc${environment.version}/user-settings`;
    return this.http.post(url, payload).pipe(map(res => {
      res['user'] = new UserObject(res['user']);
      this.storageService.set('userProfile', res);
      return res as UserProfile;
    }));
  }

  updateUserPermissions(adhocUsers: string) {
    const qParams = {
      'userIDs': adhocUsers
    };
    const url = `${environment.rootURL}mc${environment.version}/permissions/view/adhoc-users`;
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res;
    }));
  }

  getUserRoleDetails(adhocUsers: string, caseObject: string): Observable<any[]> {
    const qParams = {
      'ids': adhocUsers
    };
    const url = `${environment.rootURL}` + CaseObjectServicePath[caseObject] + `/my-team/users`;
    return this.http.get(url, {params: qParams}).pipe(map(res => {
      return res as any[];
    }));
  }

  getState() {
    return this.getUserProfile() ? new McStatesModel(JSON.parse(this.getUserProfile().user.state)) : new McStatesModel();
  }

  getStates(): Observable<any> {
    return this.http.get(`${this.userServiceUrl}/states`).pipe(map(res => {
        return ((res) ? res : {});
      }),
      catchError(() => {
        return of({});
      })
    );
  }

  saveStateData(stateData) {
    this.stateData = stateData && stateData.state ? new McStatesModel(JSON.parse(stateData.state)) : new McStatesModel();
  }

  getStatesData() {
    return JSON.parse(JSON.stringify(this.stateData));
  }

  getUserProfile() {
    return this.storageService.get('userProfile');
  }

  getDashboardWidgetsConfiguration(): DashboardWidgetConfigurationState {
    const userProfile = this.getUserProfile();
    let widgetConfiguration;
    if (userProfile && userProfile.user && userProfile.user.widget) {
      try {
        widgetConfiguration = JSON.parse(userProfile.user.widget);
      } catch (err) {
        widgetConfiguration = {};
      }
    }
    return widgetConfiguration || {};
  }

  updateDashboardWidgetsConfiguration(widgetsConfiguration: DashboardWidgetConfigurationState) {
    const userProfile = this.getUserProfile();
    if (userProfile) {
      userProfile.user.widget = JSON.stringify(widgetsConfiguration);
      this.updateUserProfile(userProfile).subscribe();
    }
  }

  setUserProfile(res: UserProfile) {
    return this.storageService.set('userProfile', res);
  }

  hasUserSpecifiedRole(role: UserRole): boolean {
    const userProfile = this.getUserProfile();
    switch (role) {
      case 'administrator':
        return userProfile && userProfile.user && this.hasGroupOfCategoryInMemberships(userProfile.user.memberships, 'Others', 'Administrators');
      case 'changeSpecialist1':
        return userProfile && userProfile.user && this.hasGroupOfCategoryInMemberships(userProfile.user.memberships, 'ChangeSpecialists', 'ChangeSpecialist1');
      case 'changeSpecialist2':
        return userProfile && userProfile.user && this.hasGroupOfCategoryInMemberships(userProfile.user.memberships, 'ChangeSpecialists', 'ChangeSpecialist2');
      case 'changeSpecialist3':
        return userProfile && userProfile.user && this.hasGroupOfCategoryInMemberships(userProfile.user.memberships, 'ChangeSpecialists', 'ChangeSpecialist3');
    }
  }

  hasGroupOfCategoryInMemberships(memberships: Membership[], category: string, groupName: string): boolean {
    let hasGroup = false;
    const groups = this.getGroupsByCategoryInMemberships(memberships, category);
    if (groups && groups.length > 0) {
      for (const group of groups) {
        if (group.name && group.name === groupName) {
          hasGroup = true;
          break;
        }
      }
    }
    return hasGroup;
  }

  getGroupsByCategoryInMemberships(memberships: Membership[], category: string): Group[] {
    if (memberships && memberships.length > 0) {
      for (const membership of memberships) {
        if (membership.category && membership.category === category) {
          return membership.groups;
        }
      }
    }
    return [];
  }

  getCaseObjectSortFromState(caseObjectType: string, isOverview?: boolean): Sort {
    const userProfileState = JSON.parse(JSON.stringify(this.stateData)) as McStatesModel;
    return isOverview ? userProfileState[this.getStateKeyByCaseObject(caseObjectType)].commonCaseObjectState.listOverviewSortConfiguration :
      userProfileState[this.getStateKeyByCaseObject(caseObjectType)].commonCaseObjectState.listSortConfiguration;
  }

  updateCaseObjectSortInState(sort: Sort, caseObjectType: string, isOverview?: boolean): void {
    const userProfileState = this.stateData as McStatesModel;
    isOverview ? userProfileState[this.getStateKeyByCaseObject(caseObjectType)].commonCaseObjectState.listOverviewSortConfiguration = sort :
      userProfileState[this.getStateKeyByCaseObject(caseObjectType)].commonCaseObjectState.listSortConfiguration = sort;
    this.updateUserProfileStates(userProfileState);
  }

  getCaseObjectState(caseObjectType: string): CaseObjectState {
    const userProfileState = JSON.parse(JSON.stringify(this.stateData)) as McStatesModel;
    return userProfileState[this.getStateKeyByCaseObject(caseObjectType)];
  }

  updateCaseObjectState(caseObjectState: CaseObjectState, caseObjectType: string, $updateDone?: Subject<void>): void {
    const userProfileState = new McStatesModel(this.stateData) as McStatesModel;
    userProfileState[this.getStateKeyByCaseObject(caseObjectType)] = caseObjectState;
    this.updateUserProfileStates(userProfileState, $updateDone);
  }

  getCaseObjectStateFilters(caseObjectType: string): McFiltersModel {
    const caseObjectState = this.getCaseObjectState(caseObjectType) as CaseObjectState;
    return caseObjectState && caseObjectState['commonCaseObjectState'] ? new McFiltersModel(caseObjectState['commonCaseObjectState'].filters) : {};
  }

  updateCaseObjectStateFilters(caseObjectType: string, filtersModel: McFiltersModel, $updateDone?: Subject<void>): void {
    const caseObjectState = this.getCaseObjectState(caseObjectType) as CaseObjectState;
    caseObjectState['commonCaseObjectState'].filters = filtersModel;
    this.updateCaseObjectState(caseObjectState, caseObjectType, $updateDone);
  }

  updateCaseObjectStateWithFiltersModel(filtersModel: McFiltersModel, caseObjectType: string, $updateDone?: Subject<void>): void {
    const userProfileState = this.stateData as McStatesModel;
    userProfileState[this.getStateKeyByCaseObject(caseObjectType)].commonCaseObjectState.filters = filtersModel;
    this.updateUserProfileStates(userProfileState, $updateDone);
  }

  getNotificationConfiguration(): NotificationConfiguration {
    return new NotificationConfiguration(this.getUserProfile().user.notificationConfiguration);
  }

  updateNotificationConfiguration(notificationConfiguration: NotificationConfiguration): Observable<UserProfile> {
    const userProfile = this.getUserProfile();
    userProfile.user.notificationConfiguration = notificationConfiguration;
    return this.updateUserProfile(userProfile);
  }

  logoutUser(): any {
    return this.http.post(`/logout`, '', {observe: 'response', responseType: 'text'}).pipe(map(res => {
      return res;
    }));
  }


  getStateKeyByCaseObject(caseObjectType: string): string {
    switch (caseObjectType) {
      case 'changeRequest':
        return 'changeRequestState';
      case 'changeNotice':
        return 'changeNoticeState';
      case 'releasePackage':
        return 'releasePackageState';
      case 'agenda':
        return 'agendaState';
      case 'agendaItem':
        return 'agendaState';
      case 'review':
        return 'reviewState';
      case 'reviewEntry':
        return 'reviewEntryState';
      case 'action':
        return 'actionState';
      case 'trackerBoard':
        return 'trackerBoardState';
      case 'decisionLog':
        return 'decisionLogState';
      case 'myTeam':
        return 'myTeamState';
      case 'myTeamManagement':
        return 'myTeamManagementState';
      case 'dashboardWidget':
        return 'dashboardWidgetState';
      case 'dashboardActionWidget':
        return 'dashboardActionWidgetState';
      case 'common':
        return 'commonState';
      case 'announcement':
        return 'announcementState';
      case 'notification':
        return 'notificationState';
      case 'readNotification':
        return 'readNotificationState';
      case 'unreadNotification':
        return 'unreadNotificationState';
      case 'dashboardNotificationWidget':
        return 'dashboardNotificationWidgetState';
      case 'upcomingMeetingsWidget':
        return 'upcomingMeetingsWidgetState';
    }
  }

}
