import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {ProjectService} from '../../../core/services/project.service';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {MyChangeState} from '../../models/mc-store.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CaseActionService} from '../../../core/services/case-action-service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {FieldElement, ListFieldElement, UpdateFieldRequest} from '../../models/field-element.model';

@Component({
  selector: 'mc-auto-complete-product-multiple',
  templateUrl: './mc-auto-complete-product-multiple.component.html',
  styleUrls: ['./mc-auto-complete-product-multiple.component.scss']
})
export class MCAutoCompleteProductMultipleComponent extends MCFieldComponent implements OnInit, OnChanges {

  dataSource: Observable<any>;
  fetchError: Info;

  constructor(private readonly projectService: ProjectService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly appStore: Store<MyChangeState>,
              public readonly helpersService: HelpersService,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.projectService.getProjects$.bind(this.projectService);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    let projectDefinition = '';
    if (simpleChanges && simpleChanges.control && simpleChanges.control.currentValue) {
      if (simpleChanges.control.currentValue.value) {
        if ( Array.isArray(simpleChanges.control.currentValue.value) && simpleChanges.control.currentValue.value.length > 0
          && !this.containsObject(simpleChanges.control.currentValue.value)) {
          projectDefinition = simpleChanges.control.currentValue.value;
        }
        if (projectDefinition.length > 0) {
          this.isBusy = true;
          this.projectService.getProjects$(projectDefinition).subscribe(res => {
            this.isBusy = false;
            if (res) {
              this.control.setValue(res);
            }
          }, (err) => {
            this.isBusy = false;
            if (projectDefinition) {
              this.control.setValue({
                'projectDefinition': projectDefinition,
                'description': ''
              });
            }
            this.fetchError = new Info(this.helpersService.getErrorMessage(err), null, null, null, InfoLevels.WARN);
          });
        }
      }
    }
  }

  onAcceptChange($event: AcceptedChange): void {
    if (!this.fieldSaveNotApplicable) {
      const updateFieldRequest = this.processProductRequest($event);
      this.saveFieldChanges(updateFieldRequest, $event.ID);
    }
  }

  processProductRequest($event: AcceptedChange): UpdateFieldRequest {
    const listFieldElement: ListFieldElement[] = [];
    const fieldElement: FieldElement[] = [];
    fieldElement.push(new FieldElement($event.ID, ($event.oldValue && $event.oldValue.hasOwnProperty('projectDefinition')) ? $event.oldValue.projectDefinition : $event.oldValue, $event.value.projectDefinition));
    return new UpdateFieldRequest(fieldElement, listFieldElement);
  }

  containsObject(list) {
    let i;
    for (i = 0; i < list.length; i++) {
      if ( typeof list[i] === 'object') {
        return true;
      }
    }
    return false;
  }
}
