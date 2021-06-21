import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';

import {CaseObjectRouterPath, CaseObjectServicePath} from '../case-object-list/case-object.enum';
import {UserAuthorizationService} from '../../../core/services/user-authorization.service';
import {UserPermissionService} from '../../../core/services/user-permission.service';
import {CaseObjectType, FieldUpdateStates} from '../../models/mc-enums';
import {CaseObjectData, Member, MiraiUser, MyTeam, User} from '../../models/mc.model';
import {selectCaseObjectState, selectField} from '../../../store';
import {ChangeNoticeListState, ChangeRequestListState, MyChangeState} from '../../models/mc-store.model';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {ConfigurationService} from '../../../core/services/configurations/configuration.service';
import {selectMyTeamListValue} from '../../../change-request/store';
import {selectCNMyTeamListValue} from '../../../change-notice/store';

@Component({
  selector: 'mc-my-team-quick-card',
  templateUrl: './mc-my-team-quick-card.component.html',
  styleUrls: ['./mc-my-team-quick-card.component.scss']
})
export class MCMyTeamQuickCardComponent implements OnInit, AfterViewInit, OnDestroy {
  dataFormGroup: FormGroup;
  caseObjectDetails: CaseObjectData;
  caseObjectDetailsSubscription$: Subscription;
  @ViewChild('myTemCard') myTemCard;
  totalHelpText: string;
  helpText: any;

  @Input()
  set formGroup(data: FormGroup) {
    this.dataFormGroup = data;
    if ((data && data.get('ID') && data.get('ID').value !== '') ||
      (data && data.get('id') && data.get('id').value !== '') ||
      (data && data.get('release_package_number') && data.get('release_package_number').value !== '')) {
      this.caseObjectID = this.caseObjectType === 'ReleasePackage' ? data.get('release_package_number').value : data.get('ID') && data.get('ID').value || data.get('id') && data.get('id').value;
      this.subscribeToCaseObjectDetails();
      this.checkForGroup();
      this.subscribeToTeamChange();
      if (!this.isListView && (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage')) {
        this.permissionsFetched = true;
        this.usersList = this.formGroup && this.formGroup.get('my_team') ? this.formGroup.get('my_team').value.members : [];
        this.usersList.sort((a, b) => a.member.user.full_name.localeCompare(b.member.user.full_name));
        this.myTeamUsersList.emit(this.usersList);
      }
    }
  }

  get formGroup() {
    return this.dataFormGroup;
  }

  @Input()
  caseObjectType: string;

  @Input()
  isListView: boolean;

  @Input()
  caseObjectID: string;

  @Input()
  badgeCount: number;

  yPosition: string;
  caseObjectRouterPath: string;
  usersList: any[];
  isGroupExist: boolean;
  help: Info;
  @Output() readonly myTeamUsersList: EventEmitter<User[]> = new EventEmitter();


  set cbGroupExist(cbGroupExist: boolean) {
    if (this.formGroup.get('changeControlBoard')) {
      this.isGroupExist = this.formGroup.get('changeControlBoard').value.length > 0 || cbGroupExist;
    } else {
      this.isGroupExist = cbGroupExist;
    }
  }

  set ccbGroupExist(ccbGroupExist: boolean) {
    if (this.formGroup.get('changeBoard')) {
      this.isGroupExist = this.formGroup.get('changeBoard').value.length > 0 || ccbGroupExist;
    } else {
      this.isGroupExist = ccbGroupExist;
    }
  }

  progressBar = false;
  photoURL: string;
  permissionsFetched: boolean;
  cs1ValueChangeSubscription$: Subscription;
  cs2ValueChangeSubscription$: Subscription;
  cs3ValueChangeSubscription$: Subscription;
  executorValueChangeSubscription$: Subscription;
  projectLeadValueChangeSubscription$: Subscription;
  cbValueChangeSubscription$: Subscription;
  ccbValueChangeSubscription$: Subscription;
  myTeamUserListChangeSubscription$: Subscription;
  projectLeadInitialFetch: boolean; // added this flag to avoid duplicate service call on setting project lead initially
  plmCoordinatorValueChangeSubscription$: Subscription;
  plmCoordinatorExist: boolean;
  projectIdValueChangeSubscription$: Subscription;
  projectIdInitialFetch: boolean;
  constructor(private readonly router: Router,
              private readonly helpersService: HelpersService,
              private readonly userAuthorizationService: UserAuthorizationService,
              private readonly userPermissionService: UserPermissionService,
              private readonly storeHelperService: StoreHelperService,
              private readonly configurationService: ConfigurationService,
              private readonly appStore: Store<MyChangeState>,
              private readonly changeRequestListStore: Store<ChangeRequestListState>,
              private readonly changeNoticeListStore: Store<ChangeNoticeListState>) {
  }

  ngOnInit() {
    this.caseObjectRouterPath = CaseObjectRouterPath[this.caseObjectType];
    this.usersList = [];
    this.helpText = this.configurationService.getFormFieldParameters('MCCommon')['myTeam'].overlayCard.help.help;
    this.permissionsFetched = false;
    this.projectLeadInitialFetch = true;
    this.projectIdInitialFetch = true;
    this.getPhotoURL();
    if (!this.isListView && this.caseObjectType !== 'ChangeRequest' && this.caseObjectType !== 'ReleasePackage') {
      this.getMyTeamData();
    }
    /*if (this.caseObjectType === 'ChangeRequest') {
      this.myTeamUserListChangeSubscription$ = this.changeRequestListStore.pipe(select(selectMyTeamListValue)).subscribe(data => {
        this.usersList = data;
        this.myTeamUsersList.emit(this.usersList);
      });
    } else if (this.caseObjectType === 'ChangeNotice') {
      this.myTeamUserListChangeSubscription$ = this.changeNoticeListStore.pipe(select(selectCNMyTeamListValue)).subscribe(data => {
        this.usersList = data;
        this.myTeamUsersList.emit(this.usersList);
      });
    }*/
  }

  ngAfterViewInit() {
    this.yPosition = this.helpersService.getCardVerticalPosition(this.myTemCard.nativeElement.offsetTop);
  }

  subscribeToCaseObjectDetails() {
    if (this.caseObjectDetailsSubscription$) {
        this.caseObjectDetailsSubscription$.unsubscribe();
  }
    this.caseObjectDetailsSubscription$ = this.appStore.pipe(select(selectCaseObjectState)).subscribe(data => {
      this.caseObjectDetails = data;
      this.caseObjectType = this.caseObjectType || data.caseObjectType;
    });
  }

  getMyTeamData() {
    if (!this.permissionsFetched && this.caseObjectID && this.caseObjectType !== 'ChangeRequest' && this.caseObjectType !== 'ReleasePackage') {
      this.getPermissionList();
      this.permissionsFetched = true;
    } else if (!this.permissionsFetched && this.caseObjectID && (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage')) {
      this.getMyTeamMembersList();
      this.permissionsFetched = true;
    }
  }

  getPermissionList() {
    this.progressBar = true;
    this.usersList = [];
    const usersList = [];
    this.userPermissionService.getPermissionListByCaseObject$(this.caseObjectID, CaseObjectType[this.caseObjectType], 'COMPACT').subscribe(permissionList => {
      this.progressBar = false;
      if (permissionList && permissionList.length > 0) {
        permissionList.forEach(permission => {
          if (permission['user'] && permission['user']['userID'] && permission['addedToMyMates']) {
            permission['user']['roles'] = permission['roles'] ? permission['roles'] : [];
            usersList.push(permission['user']);
          }
        });
        this.usersList = usersList;
        this.usersList.sort((a, b) => a.fullName.localeCompare(b.fullName));
        this.myTeamUsersList.emit(this.usersList);
      }
    });
  }

  getMyTeamMembersList() {
    this.progressBar = true;
    this.usersList = [];
    const usersList = [];
    this.userPermissionService.getMyTeamMembersByCaseObject$(this.caseObjectID, CaseObjectServicePath[this.caseObjectType])
      .subscribe(myTeamList => {
      this.progressBar = false;
      if (myTeamList && myTeamList.length > 0) {
        myTeamList.forEach(listItem => {
          if (listItem['user'] && listItem['user']['user_id']) {
            listItem['user']['roles'] = listItem['roles'] ? listItem['roles'] : [];
            usersList.push({'member': listItem});
          }
        });
        this.usersList = usersList;
        this.usersList.sort((a, b) => a.member.user.full_name.localeCompare(b.member.user.full_name));
        this.myTeamUsersList.emit(this.usersList);
      }
    });
  }

  updateUserInTeam(key: string, value: User | Member, roleRemove?: string ) {
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      const updatedUserList = [];
      this.usersList.forEach((userData, index) => {
        const roles = [];
        if (userData.member.roles.length > 1) {
            userData.member.roles.forEach((data) => {
              if (roleRemove) {
                if (data !== roleRemove) {
                  roles.push(data);
                }
              } else {
                if (data !== value['member']['roles'][0]) {
                  roles.push(data);
                }
              }
            });
          userData.member.roles = roles;
          updatedUserList.push(userData);
        } else {
          if (roleRemove) {
            if (userData.member.roles.length > 0 && userData.member.roles[0] !== roleRemove) {
              updatedUserList.push(userData);
            }
          } else {
            if (userData.member.roles.length > 0 && userData.member.roles[0] !== value['member']['roles'][0]) {
              updatedUserList.push(userData);
            }
          }
        }
      });
      if (updatedUserList && !roleRemove) {
        let tempUpdatedUserList = false;
        updatedUserList.forEach((updatedData) => {
          if (updatedData.member.user.user_id === value['member']['user']['user_id']) {
            tempUpdatedUserList = true;
            updatedData.member.roles.push(value['member']['roles'][0]);
          }
        });
        if (!tempUpdatedUserList) {
          updatedUserList.push(value);
        }
      }
      this.usersList = updatedUserList;
    } else {
      const updatedUserList = [];
      this.usersList.forEach((userData) => {
        const roles = [];
        if (userData.roles.length > 1) {
          userData.roles.forEach((data) => {
            if (data !== value['roles'][0]) {
              roles.push(data);
            }
          });
          userData.roles = roles;
          updatedUserList.push(userData);
        } else {
          if (userData.roles.length > 0 && userData.roles[0] !== value['roles'][0]) {
            updatedUserList.push(userData);
          }
        }
      });
      if (updatedUserList) {
        let tempUpdatedUserList = false;
        updatedUserList.forEach((updatedData) => {
          if (updatedData.userID === value['userID']) {
            tempUpdatedUserList = true;
            updatedData.roles.push(value['roles'][0]);
          }
        });
        if (!tempUpdatedUserList) {
          updatedUserList.push(value);
        }
      }
      this.usersList = updatedUserList;


      const changedUserDetails = JSON.parse(JSON.stringify(value));
      let isUserMatch = false, roleMatch = false;
      // if role single delete user
      const getRoleMatchUserIndex = this.usersList.findIndex((item) => item.roles.length === 1 && item.roles.includes(value['roles'][0]));
      if (getRoleMatchUserIndex > -1) {
        this.usersList.splice(getRoleMatchUserIndex, 1);
      }
      this.usersList.forEach((userData) => {
        if (value || (value['user'] && value['user']['userID'])) {
          // if role is Match user id already exist
          if (userData.userID === value['userID'] && userData.roles && userData.roles.length > 0) {
            isUserMatch = true;
            userData.roles.forEach((role) => {
              changedUserDetails.roles.push(role);
            });
            userData = changedUserDetails;
          } else {
            const updatedRoles = [];
            if (userData.roles.length > 1) {
              userData.roles.filter((role) => {
                if (role.toUpperCase() === value['roles'][0].toUpperCase()) {
                  roleMatch = true;
                  updatedRoles.push(role);
                }
              });
              userData.roles = updatedRoles;
            }
          }
        }
      });
      if (isUserMatch) {
        const indexMatchUser = this.usersList.findIndex((item) => item.userID === value['userID'] );
        this.usersList[indexMatchUser] = changedUserDetails;
      } else {
        this.usersList.push(changedUserDetails);
      }
    }
    if (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage') {
      this.usersList.sort((a, b) => a.member.user.full_name.localeCompare(b.member.user.full_name));
    } else {
      this.usersList.sort((a, b) => a.fullName.localeCompare(b.fullName));
    }
    this.myTeamUsersList.emit(this.usersList);
  }

  checkForGroup() {
    this.cbGroupExist = this.formGroup.get('changeBoard') ? (this.formGroup.get('changeBoard').value.length > 0) : false;
    this.ccbGroupExist = this.formGroup.get('changeControlBoard') ? (this.formGroup.get('changeControlBoard').value.length > 0) : false;
  }

  subscribeToTeamChange() {
    this.usersList = this.usersList || [];
      const caseObjectType = this.caseObjectDetails.caseObjectType;
      const caseObjectId = this.caseObjectDetails.caseObject['ID'] || this.caseObjectDetails.caseObject['id'];
      const caseObjectRevision = this.caseObjectDetails.caseObject['revision'] || '';
      this.cs1ValueChangeSubscription$ = this.appStore.pipe(select(selectField,
        this.storeHelperService.getFieldSelector((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'change_specialist1' : 'changeSpecialist1', caseObjectType, caseObjectId, caseObjectRevision)
      )).subscribe(data => {
        if (data && data.serviceStatus === FieldUpdateStates.success && ((this.formGroup.get('id') && this.formGroup.get('id').value) || (this.formGroup.get('ID') && this.formGroup.get('ID').value))) {
          if (this.formGroup.get('changeSpecialist1') && this.formGroup.get('changeSpecialist1').value) {
            this.formGroup.get('changeSpecialist1').value['roles'] = ['changeSpecialist1'];
          } else if (this.formGroup.get('change_specialist1') && this.formGroup.get('change_specialist1').value) {
            this.formGroup.get('change_specialist1').value['roles'] = ['changeSpecialist1'];
          }
          if (this.formGroup.get((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'change_specialist1' : 'changeSpecialist1').value) {
            this.updateUserInTeam('changeSpecialist1', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('change_specialist1').value) : this.formGroup.get('changeSpecialist1').value);
          } else {
            this.updateUserInTeam('changeSpecialist1', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('change_specialist1').value) : this.formGroup.get('changeSpecialist1').value, 'changeSpecialist1');
          }
        }
      });
      this.cs2ValueChangeSubscription$ = this.appStore.pipe(select(selectField,
        this.storeHelperService.getFieldSelector((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'change_specialist2' : 'changeSpecialist2', caseObjectType, caseObjectId, caseObjectRevision)
      )).subscribe(data => {
        if (data && data.serviceStatus === FieldUpdateStates.success && ((this.formGroup.get('id') && this.formGroup.get('id').value) || (this.formGroup.get('ID') && this.formGroup.get('ID').value))) {
          if (this.formGroup.get('changeSpecialist2') && this.formGroup.get('changeSpecialist2').value) {
            this.formGroup.get('changeSpecialist2').value['roles'] = ['changeSpecialist2'];
          } else if (this.formGroup.get('change_specialist2') && this.formGroup.get('change_specialist2').value) {
            this.formGroup.get('change_specialist2').value['roles'] = ['changeSpecialist2'];
          }
          if (this.formGroup.get((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'change_specialist2' : 'changeSpecialist2').value) {
            this.updateUserInTeam('changeSpecialist2', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('change_specialist2').value) : this.formGroup.get('changeSpecialist2').value);
          } else {
            this.updateUserInTeam('changeSpecialist2', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('change_specialist2').value) : this.formGroup.get('changeSpecialist2').value, 'changeSpecialist2');
          }
        }
      });
      this.cs3ValueChangeSubscription$ = this.appStore.pipe(select(selectField,
        this.storeHelperService.getFieldSelector((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'change_specialist3' : 'changeSpecialist3', caseObjectType, caseObjectId, caseObjectRevision)
      )).subscribe(data => {
        if (data && data.serviceStatus === FieldUpdateStates.success && ((this.formGroup.get('id') && this.formGroup.get('id').value) || (this.formGroup.get('ID') && this.formGroup.get('ID').value))) {
          if (this.formGroup.get('changeSpecialist3') && this.formGroup.get('changeSpecialist3').value) {
            this.formGroup.get('changeSpecialist3').value['roles'] = ['changeSpecialist3'];
          } else if (this.formGroup.get('change_specialist3') && this.formGroup.get('change_specialist3').value) {
            this.formGroup.get('change_specialist3').value['roles'] = ['changeSpecialist3'];
          }
          if (this.formGroup.get((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'change_specialist3' : 'changeSpecialist3').value) {
            this.updateUserInTeam('changeSpecialist3', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('change_specialist3').value) : this.formGroup.get('changeSpecialist3').value);
          } else {
            this.updateUserInTeam('changeSpecialist3', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('change_specialist3').value) : this.formGroup.get('changeSpecialist3').value, 'changeSpecialist3');
          }
        }
      });
      this.executorValueChangeSubscription$ = this.appStore.pipe(select(selectField,
        this.storeHelperService.getFieldSelector('executor', caseObjectType, caseObjectId, caseObjectRevision)
      )).subscribe(data => {
        if (data && data.serviceStatus === FieldUpdateStates.success && ((this.formGroup.get('id') && this.formGroup.get('id').value) || (this.formGroup.get('ID') && this.formGroup.get('ID').value))) {
          if (this.formGroup.get('executor').value) {
            this.formGroup.get('executor').value['roles'] = ['ecnExecutor'];
            this.updateUserInTeam('executor', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('executor').value) : this.formGroup.get('executor').value);
          } else {
            this.updateUserInTeam('executor', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('executor').value) : this.formGroup.get('executor').value, 'ecnExecutor');
          }
        }
      });
      this.cbValueChangeSubscription$ = this.appStore.pipe(select(selectField,
        this.storeHelperService.getFieldSelector((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'change_board' : 'changeBoard', caseObjectType, caseObjectId, caseObjectRevision)
      )).subscribe(data => {
        if (data && data.serviceStatus === FieldUpdateStates.success && ((this.formGroup.get('id') && this.formGroup.get('id').value) || (this.formGroup.get('ID') && this.formGroup.get('ID').value))) {
          if (this.formGroup.get('changeBoard') && this.formGroup.get('changeBoard').value) {
            this.cbGroupExist = this.formGroup.get('changeBoard').value.length > 0;
          } else if (this.formGroup.get('change_boards') && this.formGroup.get('change_boards').value) {
            this.cbGroupExist = this.formGroup.get('change_boards').value.length > 0;
          }
        }
      });
      this.ccbValueChangeSubscription$ = this.appStore.pipe(select(selectField,
        this.storeHelperService.getFieldSelector((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'change_control_board' : 'changeControlBoard', caseObjectType, caseObjectId, caseObjectRevision)
      )).subscribe(data => {
        if (data && data.serviceStatus === FieldUpdateStates.success && ((this.formGroup.get('id') && this.formGroup.get('id').value) || (this.formGroup.get('ID') && this.formGroup.get('ID').value))) {
          if (this.formGroup.get('changeControlBoard') && this.formGroup.get('changeControlBoard').value) {
            this.cbGroupExist = this.formGroup.get('changeControlBoard').value.length > 0;
          } else if (this.formGroup.get('change_control_boards') && this.formGroup.get('change_control_boards').value) {
            this.cbGroupExist = this.formGroup.get('change_control_boards').value.length > 0;
          }
        }
      });
    if (this.projectLeadValueChangeSubscription$) {
      this.projectLeadValueChangeSubscription$.unsubscribe();
    }
      this.projectLeadValueChangeSubscription$ = this.appStore.pipe(select(selectField,
        this.storeHelperService.getFieldSelector((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'project_lead' : 'projectLead', caseObjectType, caseObjectId, caseObjectRevision)
      )).subscribe(data => {
        if (data && data.serviceStatus === FieldUpdateStates.success && ((this.formGroup.get('id') && this.formGroup.get('id').value) || (this.formGroup.get('ID') && this.formGroup.get('ID').value))) {
          if (this.formGroup.get('projectLead')) {
            const projectLead = JSON.parse(JSON.stringify(this.formGroup.get('projectLead').value || {}));
            if (projectLead && projectLead.userID && !this.projectLeadInitialFetch) {
              this.getPermissionList();
            }
            this.projectLeadInitialFetch = false;
          } else if (this.formGroup.get('project_lead')) {
            const projectLead = JSON.parse(JSON.stringify(this.formGroup.get('project_lead').value || {}));
            if (projectLead && (projectLead.userID || projectLead.user_id) && !this.projectLeadInitialFetch) {
              this.getMyTeamMembersList();
            }
            this.projectLeadInitialFetch = false;
          }
        }
      });

    this.plmCoordinatorValueChangeSubscription$ = this.appStore.pipe(select(selectField,
      this.storeHelperService.getFieldSelector((caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? 'plm_coordinator' : 'plm_coordinator', caseObjectType, caseObjectId, caseObjectRevision)
    )).subscribe(data => {
      if (data && data.serviceStatus === FieldUpdateStates.success && ((this.formGroup.get('id') && this.formGroup.get('id').value) || (this.formGroup.get('ID') && this.formGroup.get('ID').value))) {
        if (this.formGroup.get('plm_coordinator') && this.formGroup.get('plm_coordinator').value) {
            this.formGroup.get('plm_coordinator').value['roles'] = ['coordinatorSCMPLM'];
            this.updateUserInTeam('plm_coordinator', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('plm_coordinator').value) : this.formGroup.get('plm_coordinator').value);
        } else {
            this.updateUserInTeam('plm_coordinator', (caseObjectType === 'ChangeRequest' || caseObjectType === 'ReleasePackage') ? this.convertUserElement(this.formGroup.get('plm_coordinator').value) : this.formGroup.get('plm_coordinator').value, 'coordinatorSCMPLM');
        }
      }
    });
  }

  navigateToMyMateView(): void {
    this.router.navigate(['my-team/' + this.caseObjectRouterPath + '/' + this.caseObjectID]);
  }

  getPhotoURL(): void {
    this.photoURL = this.configurationService.getLinkUrl('PhotoURL');
  }

  getBadgeData() {
    if (this.badgeCount > 0 || (this.usersList && this.usersList.length > 0)) {
      const myTeamCount = ((this.isListView && this.badgeCount) ? this.badgeCount : this.usersList.length).toString();
      this.totalHelpText = this.helpText.message.split('$MYTEAM-COUNT').join(myTeamCount);
      this.help = new Info('', this.totalHelpText, '', '', null);
      return (this.isListView && this.badgeCount) ? this.badgeCount : this.usersList.length;
    } else {
      return '';
    }
  }

  convertUserElement(formGroupData) {
    const data = JSON.parse(JSON.stringify(formGroupData));
    const payload: Member = {};
    payload.user = new MiraiUser(data);
    payload.user['photoURL'] = (data && data.photoURL) ? data.photoURL : '';
    payload.roles = data && data.roles;
    return {'member': payload};
  }

  ngOnDestroy(): void {
    if (this.cs1ValueChangeSubscription$) {
      this.cs1ValueChangeSubscription$.unsubscribe();
    }
    if (this.cs2ValueChangeSubscription$) {
      this.cs2ValueChangeSubscription$.unsubscribe();
    }
    if (this.cs3ValueChangeSubscription$) {
      this.cs3ValueChangeSubscription$.unsubscribe();
    }
    if (this.executorValueChangeSubscription$) {
      this.executorValueChangeSubscription$.unsubscribe();
    }
    if (this.projectLeadValueChangeSubscription$) {
      this.projectLeadValueChangeSubscription$.unsubscribe();
    }
    if (this.caseObjectType === 'ChangeRequest' && this.myTeamUserListChangeSubscription$) {
      this.myTeamUserListChangeSubscription$.unsubscribe();
    }
    if (this.plmCoordinatorValueChangeSubscription$) {
      this.plmCoordinatorValueChangeSubscription$.unsubscribe();
    }
  }
}

