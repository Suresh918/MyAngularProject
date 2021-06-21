import {Injectable} from '@angular/core';
import {FilterOptions} from '../../models/mc-filters.model';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MCFormGroupService} from '../../../core/utilities/mc-form-group.service';

@Injectable()
export class FilterBarService {
  constructor(private readonly formBuilder: FormBuilder,
              private readonly mcFormGroupService: MCFormGroupService) {

  }

  createFilterPanelFormGroup(data: FilterOptions): FormGroup {
    data = data || {};
    return this.formBuilder.group({
      state: [data.state || []],
      status: [data.status || []],
      implementationPriority: [data.implementationPriority || []],
      analysisPriority: [data.analysisPriority || []],
      customerImpact: [data.customerImpact || []],
      PCCSTRAIMIDs: [data.PCCSTRAIMIDs || []],
      PBSIDs: [data.PBSIDs || []],
      type: [data.type || []],
      purpose: [data.purpose || []],
      productID: [data.productID || []],
      projectID: [data.projectID || []],
      people: this.formBuilder.array(data.people.map(res => this.createPeopleFormGroup(res))),
      attendee: [data.attendee || []],
      allUsers: [data.allUsers || []],
      plannedReleaseDate: [data.plannedReleaseDate || null],
      plannedEffectiveDate: [data.plannedEffectiveDate || null],
      dueDate: [data.dueDate || null],
      meetingDate: [data.meetingDate || null],
      myTeamAction: [data.myTeamAction || null],
      linkedItems: [data.linkedItems || null],
      solutionItem: [data.solutionItem || null],
      reviewItems: [data.reviewItems || []],
      classification: [data.classification || []],
      decision: [data.decision || []],
      keywords: [data.keywords || []],
      role: [data.role || []],
      group: [data.group || []],
      department: [data.department || []],
      activeDate: [data.activeDate || null],
      priority: [data.priority || []],
      effectiveEndDate: [data.effectiveEndDate],
      createdOn: [data.createdOn || null],
      isActive: [data.isActive || []],
      id: [data.id || []],
      actionType: [data.actionType || []],
      linkedChangeObject: [data.linkedChangeObject || ''],
      agendaCategory: [data.agendaCategory || ''],
      changeObject: [data.changeObject || ''],
      actionDates: [data.actionDates || []],
      actionStatus: [data.actionStatus || []],
      actionDisplayStatus: [data.actionDisplayStatus || []], // added for contained actions filter issue, Need to be removed later
      tags: [data.tags || []],
      review_tasks_status: [data.review_tasks_status || []],
      changeOwnerType: [data.changeOwnerType || '']
    });
  }

  createPeopleFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      user: this.mcFormGroupService.createUserFormControl(data.user),
      role: [data.role || ''],
      users: this.mcFormGroupService.createUsersFormControl(data.users)
    });
  }

  createUserFormGroup(data) {
    data = data || {};
    return this.formBuilder.group({
      userID: [data.userID || '', Validators.compose([Validators.maxLength(50)])],
      fullName: [data.fullName || '', Validators.compose([Validators.maxLength(128)])],
      email: [data.email || '', Validators.compose([Validators.maxLength(128)])],
      abbreviation: [data.abbreviation || '', Validators.compose([Validators.maxLength(50)])],
      departmentName: [data.departmentName || '', Validators.compose([Validators.maxLength(50)])],
    });
  }
}



