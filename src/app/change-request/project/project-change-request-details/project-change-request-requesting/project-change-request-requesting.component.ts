import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ChangeRequestFormConfiguration, FormControlConfiguration} from '../../../../shared/models/mc-configuration.model';
import {HelpersService} from '../../../../core/utilities/helpers.service';

@Component({
  selector: 'mc-project-change-request-requesting',
  templateUrl: './project-change-request-requesting.component.html',
  styleUrls: ['./project-change-request-requesting.component.scss']
})

export class ProjectChangeRequestRequestingComponent {
  @Input()
  caseActions: string[];
  @Input()
  changeRequestFormGroup: FormGroup;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  openInMode: string;
  @Input()
  submitted: boolean;
  @Input()
  isExpanded: boolean;
  @Input()
  AIRItems: any[];
  @Input()
  PBSItem: any[];
  @Input()
  updateProjectPLFields: boolean;
  @Output()
  readonly updateChangeRequestView: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly setPriorityStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly getCrDetails: EventEmitter<any> = new EventEmitter<any>();
  wiComments: any[];
  priorityStatus: string;
  isSecureDisabled: boolean;
  isDisabled: boolean;
  ccbControlConfiguration: FormControlConfiguration;
  cbControlConfiguration: FormControlConfiguration;

  constructor() {

    this.caseActions = [];
    this.isSecureDisabled = true;
    this.isDisabled = true;
    /* Change control board form control configuration */
    this.ccbControlConfiguration = {
      'placeholder': 'Change Control Board',
      'help': 'Fill in CUG (closed user group) to ensure relevant project CCB members have write access to the Change Request.',
      'tag': 'CCB'
    };
    /* Change board form control configuration */
    this.cbControlConfiguration = {
      'placeholder': 'Change Board',
      'help': 'Fill in CUG (closed user group) to ensure relevant Change Board members have write access to the Change Request.',
      'tag': 'CB'
    };
  }

  get wiCommentsData() {
    return this.wiComments;
  }

  @Input()
  set wiCommentsData(commentsData: any[]) {
    this.wiComments = commentsData;
  }

  updateCRTemplate(event) {
    this.updateChangeRequestView.emit(event);
  }

  setChangeOwner(event) {
    this.changeRequestFormGroup.get('change_owner').patchValue(event.change_owner);
  }

  setPriorityInTitle(event) {
    if (event && event.id) {
      this.priorityStatus = event.analysis_priority;
      this.setPriorityStatus.emit(this.priorityStatus);
    }
  }

  getCrDetailsOnLinkingPbs() {
    this.getCrDetails.emit();
  }

}
