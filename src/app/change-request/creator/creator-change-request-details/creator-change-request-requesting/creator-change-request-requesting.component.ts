import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {
  ChangeRequestFormConfiguration,
  FormControlConfiguration,
  ImpactedItemFormConfiguration
} from '../../../../shared/models/mc-configuration.model';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {ImpactedItem} from '../../../../shared/models/mc.model';
import {ImpactedItemDialogComponent} from '../../../../shared/components/impacted-item-dialog/impacted-item-dialog.component';
import {Subject} from 'rxjs';
import {ImpactedItemService} from '../../../../core/services/impacted-item.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfigurationService} from '../../../../core/services/configurations/configuration.service';
import {ChangeRequestService} from '../../../change-request.service';
import {Store} from '@ngrx/store';
import {ChangeRequestListState} from '../../../../shared/models/mc-store.model';
import {myTeamListValue} from '../../../store';


@Component({
  selector: 'mc-creator-change-request-requesting',
  templateUrl: './creator-change-request-requesting.component.html',
  styleUrls: ['./creator-change-request-requesting.component.scss']
})

export class CreatorChangeRequestRequestingComponent implements OnInit {
  wiComments: any[];
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
  selectedProblemItem: string;
  @Input()
  problemItemsData: ImpactedItem[];
  @Input()
  updateProjectPLFields: boolean;
  @Output()
  readonly updateChangeRequestView: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly setPriorityStatus: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly getCrDetails: EventEmitter<any> = new EventEmitter<any>();
  priorityStatus: string;
  isSecureDisabled: boolean;
  isDisabled: boolean;
  ccbControlConfiguration: FormControlConfiguration;
  cbControlConfiguration: FormControlConfiguration;
  updatedIndex: number;
  impactedItemDialogUpdate$: Subject<any> = new Subject<any>();
  impactedItemFormConfiguration: ImpactedItemFormConfiguration;

  constructor(private readonly helpersService: HelpersService,
              private readonly changeRequestService: ChangeRequestService,
              public readonly configurationService: ConfigurationService,
              private readonly impactedItemService: ImpactedItemService) {
    this.impactedItemFormConfiguration = this.configurationService.getFormFieldParameters('ImpactedItem') as ImpactedItemFormConfiguration;
    this.caseActions = [];
    this.isSecureDisabled = true;
    this.isDisabled = true;
    this.selectedProblemItem = '';
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
    this.problemItemsData = [];
    this.updatedIndex = 0;
  }

  get wiCommentsData() {
    return this.wiComments;
  }

  @Input()
  set wiCommentsData(commentsData: any[]) {
    this.wiComments = commentsData;
  }

  ngOnInit(): void {

  }

  updateCRTemplate(event) {
    this.updateChangeRequestView.emit(event);
    if (event && event.id) {
      // this.getLinkedProblemItems(event.id);
    }
  }

  getLinkedProblemItems(id: string) {
    this.impactedItemService.getImpactedItems(id, 'problem-items',  'ChangeRequest').subscribe((res) => {
      this.problemItemsData = res ;
    });
  }

  updateChangeOwnerField(event) {
    if (event && event.creators[0]) {
      this.changeRequestFormGroup.get('change_owner').setValue(event.creators[0]);
      this.selectedProblemItem = event.name ? event.name : '';
    }
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
