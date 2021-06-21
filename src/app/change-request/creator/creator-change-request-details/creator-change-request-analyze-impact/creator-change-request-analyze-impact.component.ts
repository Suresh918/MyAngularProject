import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import {forkJoin, Observable} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';

import {environment} from '../../../../../environments/environment';
import {ChangeRequestFormConfiguration, FormControlConfiguration} from '../../../../shared/models/mc-configuration.model';
import {CaseObject, ChangeRequest, User, Document} from '../../../../shared/models/mc.model';
import {selectCaseAction} from '../../../../store';
import {MyChangeState} from '../../../../shared/models/mc-store.model';
import {StoreHelperService} from '../../../../core/utilities/store-helper.service';
import {ChangeRequestService} from '../../../change-request.service';
import {HelpersService} from '../../../../core/utilities/helpers.service';
import {MCFormGroupService} from '../../../../core/utilities/mc-form-group.service';


@Component({
  selector: 'mc-creator-change-request-analyze-impact',
  templateUrl: './creator-change-request-analyze-impact.component.html',
  styleUrls: ['./creator-change-request-analyze-impact.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})

export class CreatorChangeRequestAnalyzeImpactComponent implements OnInit {
  @Input()
  set changeRequestFormGroup(formGroup: FormGroup) {
    this.crFormGroup = formGroup;
    if (formGroup && formGroup.get('id') && formGroup.get('id').value) {
      this.checkForImplementationRanges();
      this.initSubscribers();
      this.changeRequestData = formGroup.getRawValue();
    }
  }

  get changeRequestFormGroup(): FormGroup {
    return this.crFormGroup;
  }

  @Input()
  selectedIndex: number;
  @Input()
  changeRequestConfiguration: ChangeRequestFormConfiguration;
  @Input()
  caseActions: string[];

  @Output()
  readonly implementationRangesUpdated: EventEmitter<any> = new EventEmitter<any>();
  crFormGroup: FormGroup;
  cbcDocumentsColumn: string[];
  sciaDocumentsColumn: string[];
  docUrl: string;
  impactOnFacilitiesShowDesForOptions: string[];
  impactOnFIRShowDesForOptions: string[];
  implementationRangesFCOSelected: boolean;
  isImpactAnalysisPanelExpanded: boolean;
  @Input()
  caseObject: CaseObject;
  @Input()
  isExpanded: boolean;
  @Input()
  showCustomerImpactAlert: boolean;
  @Input()
  showPartsQuestion: boolean;
  @Input()
  showOtherPartsQuestions: boolean;
  @Input()
  readOnlyFields: string[];
  @Input()
  mandatoryFields: string[];
  @Output()
  readonly changeRequestDataChanged: EventEmitter<ChangeRequest> = new EventEmitter();
  buttonAction$: Observable<boolean>;
  changeRequestData: ChangeRequest;
  implementationRangesUpdateError: Info;
  implementationRangesSaveInProgress: boolean;
  isCompleteBusinessCasePanelExpanded: boolean;
  isUpgradeExpanded: boolean;
  documentFormArray: FormArray;

  constructor(private readonly appStore: Store<MyChangeState>,
              private readonly storeHelperService: StoreHelperService,
              private readonly changeRequestService: ChangeRequestService,
              private readonly mcFormGroupService: MCFormGroupService,
              private readonly helpersService: HelpersService) {
    this.cbcDocumentsColumn = ['document', 'uploadedBy', 'uploadedOn', 'actions'];
    this.sciaDocumentsColumn = ['document', 'uploadedBy', 'uploadedOn', 'actions'];
    this.docUrl = `${environment.rootURL}mc${environment.version}/documents`;
    this.impactOnFacilitiesShowDesForOptions = ['YES'];
    this.impactOnFIRShowDesForOptions = ['YES'];
    this.isImpactAnalysisPanelExpanded = true;
    this.isCompleteBusinessCasePanelExpanded = true;
  }

  ngOnInit() {

  }

  initSubscribers(): void {
    this.buttonAction$ = this.appStore.pipe(select(selectCaseAction,
      this.storeHelperService.getButtonSelector('ChangeRequest', 'CREATE_DOCUMENT',
        this.changeRequestFormGroup.get('id').value, '')
    ));
  }

  hasValidator(control: FormControl): boolean {
    if (control && control.validator && control.validator({} as AbstractControl)) {
      return control.validator({} as AbstractControl).hasOwnProperty('required');
    } else {
      return false;
    }
  }

  checkForImplementationRanges() {
    const implementationRanges = this.changeRequestFormGroup.get('impact_analysis.implementation_ranges').value;
    this.implementationRangesFCOSelected = (implementationRanges && implementationRanges.includes('FCO'));
    this.isUpgradeExpanded = !(implementationRanges && (implementationRanges.includes('NA') || implementationRanges.includes('SUPPLY-CHAIN')
      || implementationRanges.includes('BSNL-OR-CUSTOMER-STOCKS')));
  }

  onUpdateImplementationRanges($event: any  /*AcceptedChange*/) {
    if (!$event.value) {
      return;
    }
    this.implementationRangesSaveInProgress = true;
    this.changeRequestService.updateImplementationRanges(JSON.stringify(this.changeRequestData.id), 'AA', $event.value).subscribe((data: ChangeRequest) => {
      this.implementationRangesSaveInProgress = false;
      if (data && data.id) {
        this.checkForImplementationRanges();
        this.implementationRangesUpdated.emit(data);
        this.implementationRangesUpdateError = null;
      } else {
        this.implementationRangesUpdateError = new Info(this.helpersService.getErrorMessage(), null, null, null, InfoLevels.ERROR);
      }
    });
  }

  onCheckFieldUpdate($event) {
    this.onFieldUpdate($event.event, $event.val);
  }
  onFieldUpdate(data, fieldID) {
    if (data.ChangeRequestElement && (data.FieldElement || data.ListFieldElement)) {
      const fieldElement = data.FieldElement ? data.FieldElement : data.ListFieldElement;
      const field = fieldElement.find(item => item.ID === fieldID);
      const fieldValue = field.value || field.values;
      this.changeRequestFormGroup.get(fieldID).setValue(fieldValue);
    }
  }
  changeRequestChanged(event) {
    this.changeRequestDataChanged.emit(event);
  }

  toNumber(data: string) {
    return +data;
  }
}

