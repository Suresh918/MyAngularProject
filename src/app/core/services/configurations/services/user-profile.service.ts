// import angular specif components here
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';


// import app specific components here
import {environment} from '../../../../../environments/environment';
import {ErrorResponseModel, ErrorState} from '../../../../shared/models/mc-store.model';
import {StorageService} from '../../storage.service';
import {HelpersService} from '../../../utilities/helpers.service';
import {UserObject, UserProfile} from '../../../../shared/models/user-profile.model';
import {McStatesModel} from '../../../../shared/models/mc-states-model';
import {highSeverityStackFromService} from '../../../../shared/store';
import {Observable, Subject} from 'rxjs';

export type UserRole = 'administrator' | 'changeSpecialist1' | 'changeSpecialist2' | 'changeSpecialist3';

@Injectable({
  'providedIn': 'root'
})
export class UserProfileService {
  private readonly userProfileUrl: string;
  userProfileData: any;
  stateData: McStatesModel;
  constructor(private readonly http: HttpClient,
              private readonly helpersService: HelpersService,
              private readonly storageService: StorageService,
              private readonly errorStore: Store<ErrorState>) {
    this.userProfileUrl = `${environment.rootURL}user-service`;
  }

  getUserProfile() {
    return this.http.get(`${this.userProfileUrl}/profiles`).pipe(map(res => {
      this.userProfileData = res ? this.processRoles(res) : {};
      this.getUserAuthorization(this.userProfileData);
      return ((res) ? res : {});
    }));
  }

  getUserProfileData() {
    return this.userProfileData;
  }

  getUserAuthorization(userProfileData: any) {
    if (!(userProfileData['roles'] && userProfileData['roles'].length > 0
      && this.helpersService.checkForValidRoles(userProfileData['roles']))) {
      this.errorStore.dispatch(highSeverityStackFromService({
          'errorMessage': 'Sorry, you do not have access to myChange.',
          'linkUrl': 'https://example.aspx',
          'disableOverlay': true
        } as ErrorResponseModel
      ));
    }
  }

  processRoles(res: any) {
    if (res && res.roles && res.roles.length > 0) {
      res.roles.forEach((role, index) => {
        /*if (role.includes('change-specialist-1')) {
          res.roles[index] = 'changeSpecialist1';
        }
        if (role.includes('change-specialist-2')) {
          res.roles[index] = 'changeSpecialist2';
        }
        if (role.includes('change-specialist-3')) {
          res.roles[index] = 'changeSpecialist3';
        }*/
        if (role.includes('authorized-user')) {
          res.roles[index] = 'user';
        }
        if (role.includes('administrator')) {
          res.roles[index] = 'administrator';
        }
      });
    }
    return res;
  }

  hasUserSpecifiedRole(role: UserRole): boolean {
    switch (role) {
      case 'administrator':
        return this.userProfileData && this.userProfileData.roles && this.hasRole(this.userProfileData.roles, 'administrator');
      case 'changeSpecialist1':
        return this.userProfileData && this.userProfileData.roles && this.hasRole(this.userProfileData.roles, 'change-specialist-1');
      case 'changeSpecialist2':
        return this.userProfileData && this.userProfileData.roles && this.hasRole(this.userProfileData.roles, 'change-specialist-2');
      case 'changeSpecialist3':
        return this.userProfileData && this.userProfileData.roles && this.hasRole(this.userProfileData.roles, 'change-specialist-3');
    }
  }

  hasRole(roles: string[], userRole: string): boolean {
    // roles.forEach(role => {
      if (roles.includes(userRole)) {
        return true;
      } else {
        return false;
      }
    // });
    // return false;
  }

  setUserProfile(res: UserProfile) {
    return this.userProfileData = res;
  }

  logoutUser(): any {
    return this.http.post(`/logout`, '', {observe: 'response', responseType: 'text'}).pipe(map(res => {
      return res;
    }));
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
    return this.http.post(`${this.userProfileUrl}/states`, payLoad).pipe(map(res => {
        this.saveStateData(res ? res : {});
        return ((res) ? res : {});
      })
    );
  }

  updateState(state: McStatesModel) {
    this.stateData = state ? state : new McStatesModel();
  }

  getStates(): Observable<any> {
    return this.http.get(`${this.userProfileUrl}/states`).pipe(map(res => {
        return ((res) ? res : {});
      })
    );
  }

  saveStateData(stateData) {
    this.stateData = stateData && stateData.state ? new McStatesModel(JSON.parse(stateData.state)) : new McStatesModel();
  }

  getStatesData() {
    return this.stateData;
  }
}
