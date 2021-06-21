import {Injectable} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {McValidationsConfigurationService} from './mc-validations-configuration.service';
import {HelpersService} from './helpers.service';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {MCFormGroupService} from './mc-form-group.service';

@Injectable({
  'providedIn': 'root'
})
export class McFormGroupPresentationService {
  private questionsList;

  constructor(private readonly formBuilder: FormBuilder, private readonly mcValidationsConfigurationService: McValidationsConfigurationService,
              private readonly helpersService: HelpersService, private readonly mcFormGroupService: MCFormGroupService) {
    this.questionsList = [];
  }

  createMyTeamPermissionFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      id: [data.id || ''],
      user: this.mcFormGroupService.createUserFormGroup(data.user),
      roles: [data.roles || [], Validators.compose([Validators.maxLength(1024)])],
      preferredRoles: [(data.preferred_roles || data.preferredRoles) || []],
      otherRoles: [(data.other_roles || data.otherRoles) || []],
      groups: [data.groups || []],
      photoURL: [data.photoURL || ''],
      addedToMyMates: [coerceBooleanProperty((data.added_to_my_team || data.addedToMyMates))],
      isAdhocUser: [coerceBooleanProperty(data.isAdhocUser)],
      showAfterFilter: [coerceBooleanProperty(data.showAfterFilter)]
    });
  }

  createMyMatesListFormGroup(permissions) {
    permissions = permissions || [];
    return this.formBuilder.group({
      name: [''],
      permissions: this.formBuilder.array(permissions.map(res => this.createMyTeamPermissionFormGroup(res))),
    });
  }

  createAgendaListFormGroup() {
    return this.formBuilder.group({
      /*12096e5 represents fortnight milliseconds*/
      fromDate: [new Date(Date.now() - 12096e5)],
      toDate: [new Date(new Date().setFullYear(new Date().getFullYear() + 1))],
      title: [''],
      category: this.formBuilder.array([]),
      status: [''],
      createdBy: this.formBuilder.array([]),
    });

  }

  createActionFilterForm(data) {
    data = data || {};
    return this.formBuilder.group({
      fromDate: [data.fromDate || ''],
      toDate: [data.toDate || ''],
      category: [data.category || ''],
      createdBy: this.mcFormGroupService.createUserFormGroup(data.createdBy)
    });
  }


  createAnnouncementFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      ID: [data.ID || '', Validators.compose([Validators.maxLength(50), Validators.required])],
      title: [data.title || '', Validators.compose([Validators.maxLength(48), Validators.required])],
      message: [data.message || '', Validators.compose([Validators.maxLength(360), Validators.required])],
      effectiveEndDate: [data.effectiveEndDate || '', Validators.compose([Validators.required])],
      effectiveEndTime: [data.effectiveEndTime || ''],
      priority: [isNaN(data.priority) ? '' : data.priority, Validators.compose([Validators.required])],
      isActive: [(data.isActive === true || data.isActive === false) ? data.isActive : '', Validators.compose([])],
      label: [data.label || 'Read More (SharePoint)', Validators.compose([Validators.maxLength(24), Validators.required])],
      link: [data.link || '', Validators.compose([Validators.required])]
    });
  }


  createPortationFormGroupArray(data) {
    return  this.formBuilder.array(data.map(res => this.createPortationFormGroup(res)));
  }

  createPortationFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      description: [data.description || '', Validators.compose([])],
      initiator: [data.initiator || '', Validators.compose([])],
      number: [data.number || '', Validators.compose([])],
      owner: [data.owner || '', Validators.compose([])],
      priority: [data.priority || '', Validators.compose([])],
      projectID: [data.projectID || '', Validators.compose([])],
      shortDescription: [data.short_description || '', Validators.compose([])],
      solver: [data.solver || '', Validators.compose([])],
      type: [data.itemType || '', Validators.compose([])],
      ID: [data.ID || '', Validators.compose([])],
      deliverable: [data.deliverable || '', Validators.compose([])],
      isLinkableToChangeRequest: [data.isLinkableToChangeRequest || '', Validators.compose([])],
      status: [data.status || '', Validators.compose([])],
      action: [data.action || '', Validators.compose([Validators.required])],
      dataPortationDetail: [data.dataPortationDetail || '', Validators.compose([])],
      dataPortationStatus: [data.dataPortationStatus || '', Validators.compose([])],
      linkDetail: [data.linkDetail || '', Validators.compose([])],
      linkStatus: [data.linkStatus || '', Validators.compose([])]
    });
  }

  createAddAgendaFilterFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      group: [data.group || '', Validators.compose([])],
      changeSpecialist1: [data.changeSpecialist1 || '', Validators.compose([])],
      changeSpecialist2: [data.changeSpecialist2 || '', Validators.compose([])],
      status: [data.status || '', Validators.compose([])],
      keywords: [data.keywords || '', Validators.compose([])]
    });
  }

  createMyTeamManagementFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      replacedByUser: [data.replacedByUser || '', Validators.compose([])],
      replacedByUserRole: [data.replacedByUserRole || '', Validators.compose([])],
      addUser: [data.addUser || '', Validators.compose([])],
      addUserRole: [data.addUserRole || '', Validators.compose([])],
    });
  }
}

