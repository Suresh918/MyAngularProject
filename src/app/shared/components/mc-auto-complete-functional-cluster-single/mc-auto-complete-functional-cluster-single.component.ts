import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Store} from '@ngrx/store';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {
  FieldElement,
  ListFieldElement,
  UpdateFieldRequest,
  UpdateInstanceRequest
} from '../../models/field-element.model';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {FunctionalClusterService} from '../../../core/services/functional-cluster.service';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {ChangeRequestService} from '../../../change-request/change-request.service';

@Component({
  selector: 'mc-auto-complete-functional-cluster-single',
  templateUrl: './mc-auto-complete-functional-cluster-single.component.html',
  styleUrls: ['./mc-auto-complete-functional-cluster-single.component.scss'],
  providers: [ChangeRequestService]
})
export class MCAutoCompleteFunctionalClusterSingleComponent extends MCFieldComponent implements OnInit, OnChanges {

  dataSource: Observable<any>;
  fetchError: Info;
  CRId: string;
  @Input()
  set changeRequestID(CRId: string) {
    if (CRId) {
      this.CRId = CRId;
      this.getFunctionalClusterOnCRID(this.CRId);
    }
  }
  get changeRequestID() {
    return this.CRId;
  }
  functionalClusterID: string;

  constructor(private readonly functionalClusterSearchService: FunctionalClusterService,
              public readonly updateFieldService: UpdateFieldService,
              private readonly changeRequestService: ChangeRequestService,
              public readonly helpersService: HelpersService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.getFunctionalClusters.bind(this);
  }

  getFunctionalClusters(search: string) {
    if (search) {
      return this.functionalClusterSearchService.getFunctionalClusters(search);
    } else {
      return of([]);
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges && simpleChanges.control && simpleChanges.control.currentValue) {
      if (simpleChanges.control.currentValue.value) {
        this.functionalClusterID = simpleChanges.control.currentValue.value.number || simpleChanges.control.currentValue.value;
      }
    }
  }

  onAcceptChange($event: AcceptedChange): void {
    const updateFieldRequest = this.processInstanceRequest($event);
    this.saveInstanceChanges(updateFieldRequest, $event.ID);
  }

  processInstanceRequest($event: AcceptedChange): UpdateInstanceRequest {
    this.instancePath = this.helpersService.getPathByInstanceId($event.ID, this.caseObject.type);
    const oldInst = this.convertDotToObject($event.ID, $event.oldValue === null ? null : $event.oldValue.number);
    const newInst = this.convertDotToObject($event.ID, $event.value.number);
    return new UpdateInstanceRequest(oldInst, newInst);
  }

  processProductRequest($event: AcceptedChange): UpdateFieldRequest {
    const listFieldElement: ListFieldElement[] = [];
    const fieldElement: FieldElement[] = [];
    fieldElement.push(new FieldElement($event.ID, ($event.oldValue && $event.oldValue.hasOwnProperty('number')) ? $event.oldValue.number : $event.oldValue, $event.value.number));
    return new UpdateFieldRequest(fieldElement, listFieldElement);
  }

  getFunctionalClusterOnCRID(changeRequestID: string) {
    this.changeRequestService.getFunctionalClusterOnCRID(changeRequestID).subscribe(res => {
      this.isBusy = false;
      if (res && res.number) {
        this.control.setValue(res);
        this.functionalClusterID = res.number;
      }
    }, (err) => {
      this.isBusy = false;
      if (err) {
        this.control.setValue({
          'number': this.functionalClusterID,
          'name': ''
        });
        this.fetchError = new Info(this.helpersService.getErrorMessage(err), null, null, null, InfoLevels.WARN);
      }
    });
  }
}
