import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {
  FieldElement,
  ListFieldElement,
  UpdateFieldRequest,
  UpdateInstanceRequest
} from '../../models/field-element.model';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {WorkBreakdownStructureService} from '../../../core/services/work-breakdown-structure.service';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {FormControl} from '@angular/forms';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {FieldUpdateStates, RequestTypes} from '../../models/mc-enums';
import {WorkBreakdownStructure} from '../../models/work-breakdown-structure.model';

@Component({
  selector: 'mc-auto-complete-project-single',
  templateUrl: './mc-auto-complete-project-single.component.html',
  styleUrls: ['./mc-auto-complete-project-single.component.scss']
})
export class MCAutoCompleteProjectSingleComponent extends MCFieldComponent implements OnInit, OnChanges {

  dataSource: Observable<any>;
  projectLeadConfiguration: FormControlConfiguration;
  fetchError: Info;
  wbsElement: string;
  caseObjectID: number;
  @Input()
  projectLeadControl: FormControl;
  projectLeadUpdate$: BehaviorSubject<string> = new BehaviorSubject('');

  @Input()
  set caseObjectId(caseObjectID: number) {
    if (caseObjectID) {
      this.caseObjectID = caseObjectID;
      this.getWBSDetails();
    }
  }

  get caseObjectId() {
    return this.caseObjectID;
  }

  @Input()
  set updateProjectPLFields(val) {
    if (val) {
      this.getWBSDetails();
    }
  }

  @Input()
  type: string;
  projectID: string;
  @Output()
  readonly caseObjectDataUpdated: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly workBreakdownStructureService: WorkBreakdownStructureService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly helpersService: HelpersService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
    this.projectLeadConfiguration = {
      label: 'Project Lead'
    } as FormControlConfiguration;
  }

  ngOnInit() {
    super.ngOnInit();
    this.fieldSaveNotApplicable = true;
    this.dataSource = this.getProjectSearchResults.bind(this);
  }

  getProjectSearchResults(search: string): Observable<any> {
    if (this.requestType !== RequestTypes.Instance) {
      return this.workBreakdownStructureService.getWorkBreakdownStructures$(search);
    } else if (search) {
      return this.workBreakdownStructureService.getProjectsOnSearch(search, this.type);
    } else {
      return of([]);
    }
  }


  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges && simpleChanges.control && simpleChanges.control.currentValue) {
      if (simpleChanges.control.currentValue.value) {
        this.wbsElement = simpleChanges.control.currentValue.value.wbs_id ||
                          simpleChanges.control.currentValue.value.wbsElement ||
                          simpleChanges.control.currentValue.value;
      }
    }
  }

  getWBSDetails() {
    this.isBusy = true;
    let service: Observable<any> = of(null);
    if (this.requestType === RequestTypes.Instance) {
      service = this.workBreakdownStructureService.getProjectDetails(this.caseObjectId, this.type);
    } else {
      service = this.workBreakdownStructureService
        .getWorkBreakdownStructureFromCaseObject(this.caseObjectId, this.type);
    }
    service.subscribe(res => {
      this.isBusy = false;
      if (this.requestType === RequestTypes.Instance) {
        if (res && res.wbs_id) {
          this.control.setValue(res);
          this.projectLeadUpdate$.next(res.wbs_id);
        }
      } else if (res && res[0] && res[0].wbsElement) {
        this.control.setValue(res[0]);
        this.wbsElement = res[0].wbsElement;
        this.projectLeadUpdate$.next(this.wbsElement);
      }
    }, (err) => {
      this.isBusy = false;
      if (this.wbsElement) {
        if (this.requestType === RequestTypes.Instance) {
            this.control.setValue({
              'wbs_id': this.wbsElement,
              'description': ''
            });
          } else {
          this.control.setValue({
            'wbsElement': this.wbsElement,
            'description': ''
          });
          }
        }
      this.fetchError = new Info(this.helpersService.getErrorMessage(err), null, null, null, InfoLevels.WARN);
    });
  }


  onAcceptChange($event: AcceptedChange): void {
    if (this.type === 'ChangeRequest' || this.type === 'ReleasePackage') {
      const updateFieldRequest = this.processInstanceRequest($event);
      this.saveInstanceChanges(updateFieldRequest, $event.ID);
    } else {
      const updateFieldRequest = this.processProductRequest($event);
      this.handleBusy($event.ID, true);
      this.updateFieldState($event.ID, FieldUpdateStates.progress, null);
      this.workBreakdownStructureService.saveWBS(updateFieldRequest.FieldElement[0].newValue, this.caseObject).subscribe(res => {
        this.handleBusy($event.ID, false);
        if (res) {
          this.wbsElement = this.control.value.wbsElement;
          this.projectID = this.wbsElement;
          this.updateFieldState($event.ID, FieldUpdateStates.success, null);
          this.caseObjectDataUpdated.emit(res);
        } else {
          this.updateFieldState($event.ID, FieldUpdateStates.error, this.helpersService.getErrorMessage());
          this.serverError = new Info(this.helpersService.getErrorMessage(), null, null, null, InfoLevels.ERROR);
        }
      });
    }
  }

  processInstanceRequest($event: AcceptedChange): UpdateInstanceRequest {
    this.instancePath = this.helpersService.getPathByInstanceId($event.ID, this.caseObject.type);
    const oldInst = this.convertDotToObject($event.ID, ($event.oldValue && $event.oldValue.hasOwnProperty('wbs_id')) ?  $event.oldValue.wbs_id : null);
    const newInst = this.convertDotToObject($event.ID, ($event.value.wbsElement || $event.value.wbs_id));
    return new UpdateInstanceRequest(oldInst, newInst);
  }

  processProductRequest($event: AcceptedChange): UpdateFieldRequest {
    const listFieldElement: ListFieldElement[] = [];
    const fieldElement: FieldElement[] = [];
    fieldElement.push(new FieldElement($event.ID, ($event.oldValue && $event.oldValue.hasOwnProperty('wbsElement')) ? $event.oldValue.wbsElement : $event.oldValue, $event.value.wbsElement));
    return new UpdateFieldRequest(fieldElement, listFieldElement);
  }

}
