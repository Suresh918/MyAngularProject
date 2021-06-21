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
import {ProjectService} from '../../../core/services/project.service';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {RequestTypes} from '../../models/mc-enums';

@Component({
  selector: 'mc-auto-complete-product-single',
  templateUrl: './mc-auto-complete-product-single.component.html',
  styleUrls: ['./mc-auto-complete-product-single.component.scss']
})
export class MCAutoCompleteProductSingleComponent extends MCFieldComponent implements OnInit, OnChanges {
  dataSource: Observable<any>;
  caseObjectID: number;
  fetchError: Info;

  @Input()
  set caseObjectId(caseObjectID: number) {
    if (caseObjectID) {
      this.caseObjectID = caseObjectID;
      this.getProjectDetails();
    }
  }

  get caseObjectId() {
    return this.caseObjectID;
  }

  @Input()
  set updateProjectPLFields(val) {
    if (val) {
      this.getProjectDetails();
    }
  }

  @Input()
  type: string;
  projectDefinition: string;

  constructor(private readonly projectService: ProjectService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly helpersService: HelpersService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.getProductSearchResults.bind(this);
  }

  getProductSearchResults(search: string): Observable<any> {
    if (this.requestType !== RequestTypes.Instance) {
      return this.projectService.getProjects$(search);
    } else if (search) {
      return this.projectService.getProductsOnSearch(search, this.type);
    } else {
      return of([]);
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges && simpleChanges.control && simpleChanges.control.currentValue) {
      if (simpleChanges.control.currentValue.value) {
        this.projectDefinition = simpleChanges.control.currentValue.value.projectDefinition || simpleChanges.control.currentValue.value.project_id || simpleChanges.control.currentValue.value;
      }
    }
  }

  getProjectDetails() {
    this.isBusy = true;
    let service: Observable<any> = of(null);
    if (this.requestType === RequestTypes.Instance) {
      service = this.projectService.getProductDetails(this.caseObjectId, this.type);
    } else {
      service = this.projectService.getProject$(this.caseObjectId, this.type);
    }
    service.subscribe(res => {
      this.isBusy = false;
      if (this.requestType === RequestTypes.Instance) {
        if (res && res.project_id) {
          this.control.setValue(res);
        } else {
          if (this.projectDefinition) {
            this.control.setValue({'project_id': this.projectDefinition, 'description': ''});
          }
        }
      } else if (res && res.projectDefinition) {
        this.control.setValue(res);
        this.projectDefinition = res.projectDefinition;
      }
    }, (err) => {
      this.isBusy = false;
      if (this.requestType === RequestTypes.Instance) {
        if (this.projectDefinition) {
          this.control.setValue({'project_id': this.projectDefinition, 'description': ''});
        }
      } else {
        this.control.setValue({
          'projectDefinition': this.projectDefinition,
          'description': ''
        });
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
      this.saveFieldChanges(updateFieldRequest, $event.ID);
    }
  }

  processInstanceRequest($event: AcceptedChange): UpdateInstanceRequest {
    this.instancePath = this.helpersService.getPathByInstanceId($event.ID, this.caseObject.type);
    const oldInst = this.convertDotToObject($event.ID, ($event.oldValue && $event.oldValue.hasOwnProperty('project_id')) ? $event.oldValue.project_id : null);
    const newInst = this.convertDotToObject($event.ID, $event.value.project_id || $event.value.projectDefinition);
    return new UpdateInstanceRequest(oldInst, newInst);
  }

  processProductRequest($event: AcceptedChange): UpdateFieldRequest {
    const listFieldElement: ListFieldElement[] = [];
    const fieldElement: FieldElement[] = [];
    fieldElement.push(new FieldElement($event.ID, ($event.oldValue && $event.oldValue.hasOwnProperty('projectDefinition')) ? $event.oldValue.projectDefinition : $event.oldValue, $event.value.projectDefinition));
    return new UpdateFieldRequest(fieldElement, listFieldElement);
  }

}
