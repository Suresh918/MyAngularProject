import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';

import {WorkBreakdownStructureService} from '../../../core/services/work-breakdown-structure.service';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {MyChangeState} from '../../models/mc-store.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {FieldElement, ListFieldElement, UpdateFieldRequest} from '../../models/field-element.model';

@Component({
  selector: 'mc-auto-complete-project-multiple',
  templateUrl: './mc-auto-complete-project-multiple.component.html',
  styleUrls: ['./mc-auto-complete-project-multiple.component.scss']
})
export class MCAutoCompleteProjectMultipleComponent extends MCFieldComponent implements OnInit, OnChanges, OnDestroy {
  dataSource: Observable<any>;
  projectLeadConfiguration: FormControlConfiguration;
  fetchError: Info;
  wbsElement: WorkBreakdownStructureService;
  @Input()
  projectLeadControl: FormControl;
  projectUpdated$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  projectUpdateSubscription$: Subscription;

  constructor(private readonly workBreakdownStructureService: WorkBreakdownStructureService,
              public readonly updateFieldService: UpdateFieldService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly helpersService: HelpersService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
    this.projectLeadConfiguration = {
      placeholder: 'Project Lead'
    } as FormControlConfiguration;
  }

  ngOnInit() {
    super.ngOnInit();
    this.dataSource = this.workBreakdownStructureService.getWorkBreakdownStructures$.bind(this.workBreakdownStructureService);
    this.projectUpdateSubscription$ = this.projectUpdated$.subscribe(value => {
      if (value !== undefined) {
        this.wbsElement = value;
      }
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges && simpleChanges.control && simpleChanges.control.currentValue) {
      if (simpleChanges.control.currentValue.value && simpleChanges.control.currentValue.value.length > 0) {
        this.isBusy = true;
        this.wbsElement = simpleChanges.control.currentValue.value.wbsElement || simpleChanges.control.currentValue.value;
        if (this.wbsElement && !Array.isArray(this.wbsElement)) {
          this.workBreakdownStructureService.getWorkBreakdownStructure$(this.wbsElement).subscribe(res => {
            this.isBusy = false;
            if (res && res.wbsElement) {
              this.control.setValue(res);
            }
          }, (err) => {
            this.isBusy = false;
            if (this.wbsElement) {
              this.control.setValue({
                'wbsElement': this.wbsElement,
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
    const updateFieldRequest = this.processProductRequest($event);
    this.saveFieldChanges(updateFieldRequest, $event.ID, this.projectUpdated$);
  }

  processProductRequest($event: AcceptedChange): UpdateFieldRequest {
    const listFieldElement: ListFieldElement[] = [];
    const fieldElement: FieldElement[] = [];
    fieldElement.push(new FieldElement($event.ID, ($event.oldValue && $event.oldValue.hasOwnProperty('wbsElement')) ? $event.oldValue.wbsElement : $event.oldValue, $event.value.wbsElement));
    return new UpdateFieldRequest(fieldElement, listFieldElement);
  }

  ngOnDestroy() {
    if (this.projectUpdateSubscription$) {
      this.projectUpdateSubscription$.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
