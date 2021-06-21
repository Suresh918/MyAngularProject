import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {CaseObject, User} from '../../models/mc.model';
import {ProjectManagerService} from '../../../core/services/project-manager.service';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {FormControl} from '@angular/forms';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {mcFieldUpdated} from '../../../store/actions/field-update.actions';
import {FieldUpdateData} from '../../models/mc-field-update.model';
import {FieldUpdateStates} from '../../models/mc-enums';
import {ProjectManager} from '../../models/project-manager.model';
import {ChangeRequestService} from '../../../change-request/change-request.service';
import {WorkBreakdownStructureService} from '../../../core/services/work-breakdown-structure.service';

@Component({
  selector: 'mc-auto-complete-project-lead',
  templateUrl: './mc-auto-complete-project-lead.component.html',
  styleUrls: ['./mc-auto-complete-project-lead.component.scss']
})
export class MCAutoCompleteProjectLeadComponent implements OnInit {
  @Input()
  caseObjectTab: number;
  isBusy: boolean;
  @Input()
  control: FormControl;
  @Input()
  controlConfiguration: FormControlConfiguration;
  @Input()
  caseObjectId: number;
  @Input()
  type: string;
  @Input()
  projectLeadUpdate$: BehaviorSubject<string>;
  @Input()
  instanceResponse$: BehaviorSubject<string>;
  @Input()
  set projectID(projectID: string) {
    if (projectID) {
      this.getProjectManager();
    }
  }
  serverError: Info;
  response: ProjectManager | any;
  caseObjectData: CaseObject;

  constructor(private readonly projectManagerService: ProjectManagerService,
              private readonly workBreakdownStructureService: WorkBreakdownStructureService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              private readonly helpersService: HelpersService) {
  }

  @Input()
  set caseObject(caseObject: CaseObject) {
    if (caseObject) {
      this.caseObjectData = caseObject;
      const fieldID = (caseObject.type === 'ChangeRequest' || caseObject.type === 'ReleasePackage') ? 'project_lead' : 'projectLead';
      this.updateFields(caseObject, fieldID);
    }
  }

  ngOnInit(): void {
    this.projectLeadUpdate$.subscribe((val) => {
      if (val) {
        this.getProjectManager();
      }
    });
    this.instanceResponse$.subscribe((res) => {
      if (res && res['id']) {
        this.getProjectManager();
      }
    });
  }

  getProjectManager() {
    this.isBusy = true;
    this.serverError = null;
    if (this.type === 'ChangeRequest' || this.type === 'ReleasePackage') {
      this.workBreakdownStructureService.getProjectLead(this.caseObjectId, this.type).subscribe((response: any) => {
        this.isBusy = false;
        if (response && response.hasOwnProperty('error')) {
          this.control.setValue('');
          this.serverError = new Info(this.helpersService.getErrorMessage(response.error), null, null, null, InfoLevels.WARN);
        } else {
          this.control.setValue(response ? new User(response) : new User());
        }
        if (response) {
          this.response = response;
          this.updateFields(this.caseObjectData, 'project_lead');
        }
      });
    } else {
      this.projectManagerService.getProjectManager$(this.caseObjectId, this.type).subscribe((response: any) => {
        this.isBusy = false;
        if (response && response.hasOwnProperty('error')) {
          this.serverError = new Info(this.helpersService.getErrorMessage(response.error), null, null, null, InfoLevels.WARN);
        } else {
          this.control.setValue(response ? new User(response) : new User());
        }
        if (response) {
          this.response = response;
          this.updateFields(this.caseObjectData, 'projectLead');
        }
      });
    }
  }

  updateFields(caseObject: CaseObject, fieldID) {
    if (caseObject && caseObject.ID && this.response) {
      this.appStore.dispatch(mcFieldUpdated(new FieldUpdateData({
        caseObject: caseObject,
        fieldId: fieldID,
        tab: 0,
        serviceStatus: this.response.error ? FieldUpdateStates.error : FieldUpdateStates.success,
        ...(this.response.error ? {errorInfo: this.response.error} : {})
      })));
    }
  }
}
