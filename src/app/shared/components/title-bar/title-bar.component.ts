import {AfterViewChecked, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {
  ActionFormConfiguration,
  ChangeNoticeFormConfiguration,
  ChangeRequestFormConfiguration,
  FormControlConfiguration,
  FormControlEnumeration,
  ReleasePackageFormConfiguration
} from '../../models/mc-configuration.model';
import {MatDialog} from '@angular/material/dialog';
import {ServiceParametersService} from '../../../core/services/service-parameters.service';
import {Link} from '../../models/mc-presentation.model';
import {select, Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {Subscription} from 'rxjs';
import {FieldUpdateData} from '../../models/mc-field-update.model';
import {selectAllFieldUpdates} from '../../../store';
import {MatDialogChangeTitleComponent} from '../mat-dialog-change-title/mat-dialog-change-title.component';
import {MatDialogChangeActionTitleComponent} from '../mat-dialog-change-action-title/mat-dialog-change-action-title.component';
import {ChangeNotice, ChangeRequest, ReleasePackage} from '../../models/mc.model';
import {ConfigurationService} from "../../../core/services/configurations/configuration.service";

@Component({
  selector: 'mc-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})

export class TitleBarComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  ecnNumber: string;
  @Input()
  formGroup: FormGroup;
  @Input()
  formConfiguration: ChangeRequestFormConfiguration | ChangeNoticeFormConfiguration | ReleasePackageFormConfiguration |
    ActionFormConfiguration;
  @Input()
  service: string;
  @Input()
  link: Link;
  @Input()
  hideEditOptions?: boolean;
  @Input()
  currentStatusLabel: string;
  @Input()
  currentPriorityStatus: string;
  @Input()
  set ecnId(id: string) {
    this.ecnNumber = id;
  }
  get ecnId() {
    return this.ecnNumber;
  }
  @Output()
  readonly caseAction: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  readonly titleDataChanged: EventEmitter<ChangeRequest | ChangeNotice | ReleasePackage> = new EventEmitter<ChangeRequest | ChangeNotice | ReleasePackage>();
  instanceStatusFormGroup: FormGroup;
  serviceLabel: string;
  previousStatusList: [string];
  priorityTitle: string;
  fieldUpdateSubscriptions$: Subscription;
  progressFields: FieldUpdateData[];
  currentStatus: string;
  lastChipIndexToShow: number;
  tags: string[];
  @ViewChild('tagContainer') tagContainer;

  constructor(private readonly helpersService: HelpersService, private readonly matDialog: MatDialog,
              private readonly serviceParametersService: ServiceParametersService,
              private readonly configurationService: ConfigurationService,
              public readonly appStore: Store<MyChangeState>) {
    this.tags = [];
    this.instanceStatusFormGroup = new FormGroup({
      status: new FormControl('')
    });
  }

  ngOnInit() {
    this.subscribeToFieldUpdateStore();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.formGroup && simpleChanges.formGroup.currentValue &&
      (this.formGroup.get('generalInformation.status') && this.formGroup.get('generalInformation.status').value) || this.formGroup.get('status') && this.formGroup.get('status').value) {
      const service = (this.service === 'ImplementationStrategy') ? 'ChangeRequest' : this.service;
      this.previousStatusList = this.getPreviousStatusList();
      this.currentPriorityStatus = this.getPriorityStatus();
      if (this.service === 'ChangeRequest' || this.service === 'ImplementationStrategy' || this.service === 'CustomerImpactAssessment' || this.service === 'ReleasePackage') {
        this.currentStatus = this.currentStatusLabel;
      } else {
        this.currentStatus = this.configurationService.getFormFieldOptionDataByValue(service,
          'generalInformation.status', (simpleChanges.formGroup.currentValue.get('generalInformation.status').value || simpleChanges.formGroup.currentValue.get('status').value), 'label');
      }
      if ( this.service === 'ReleasePackage' && simpleChanges.formGroup && simpleChanges.formGroup.currentValue.get('tags')) {
        this.tags = simpleChanges.formGroup.currentValue.get('tags').value;
      }
    }
    if (simpleChanges.currentPriorityStatus && simpleChanges.currentPriorityStatus.currentValue) {
      this.currentPriorityStatus = this.getPriorityStatus();
    }
  }

  ngAfterViewChecked(): void {
    if (this.tagContainer && this.tagContainer.nativeElement && !this.lastChipIndexToShow) {
      const containerWidth = this.tagContainer.nativeElement.offsetWidth;
      const chips = this.tagContainer.nativeElement.children;
      let chipsWidth = 0;
      this.lastChipIndexToShow = 0;
      for (let chipCount = 0; chipCount < chips.length; chipCount++) {
        chipsWidth = chipsWidth + chips[chipCount].offsetWidth;
        if (chipsWidth > containerWidth && !this.lastChipIndexToShow) {
          this.lastChipIndexToShow = chipCount - 1;
        }
      }
    }
  }

  openChangeTitle() {

    this.changeTitle(this.formGroup,
      (this.formConfiguration['generalInformation'] && this.formConfiguration['generalInformation']['title']) || this.formConfiguration['title'] ,
      (this.formConfiguration['generalInformation'] && this.formConfiguration['generalInformation']['status']) || this.formConfiguration['status'],
      this.service,
      this.formConfiguration['tags']);
  }


  openActionChangeTitle() {
    this.changeActionTitle(this.formGroup.get('generalInformation.title') as FormControl,
      this.formConfiguration['generalInformation'].title || this.formConfiguration['title']);
  }


  changeTitle(control: FormGroup, titleControlConfiguration: FormControlConfiguration, statusControlConfiguration: FormControlConfiguration, service: string, tagConfiguration?: FormControlConfiguration) {
    if (this.service === 'ChangeRequest' || this.service === 'ReleasePackage') {
      const status_label = statusControlConfiguration.options.filter(enumeration => (enumeration.value === control.get('status').value.toString() || enumeration.label === control.get('status').value))[0].label;
      this.instanceStatusFormGroup.get('status').setValue(status_label);
    }
    const dialogRef = this.matDialog.open(MatDialogChangeTitleComponent, {
      width: '50rem',
      data: {
        'titleControl': control.get('generalInformation.title') || control.get('title') as FormControl,
        'titleControlConfiguration': titleControlConfiguration,
        'statusControl': control.get('generalInformation.status') || this.instanceStatusFormGroup.get('status') as FormControl,
        'statusControlConfiguration': statusControlConfiguration,
        'tagControl': control.get('tags') as FormControl,
        'tagControlConfiguration': tagConfiguration,
        'service': service
      },
      panelClass: 'no-action-dialog-container',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((caseObjectData) => {
        if (caseObjectData) {
          this.titleDataChanged.emit(caseObjectData);
        }
    });
  }

  changeActionTitle(control: FormControl, controlConfiguration: FormControlConfiguration) {
    this.matDialog.open(MatDialogChangeActionTitleComponent, {
      width: '50rem',
      data: {
        'control': control,
        'controlConfiguration': controlConfiguration
      }
    });
  }


  getCaseAction(status: string): string {
    switch (status.toUpperCase()) {
      case 'DRAFT': {
        return 'DEFINE';
      }
      case 'NEW': {
        return 'SUBMIT';
      }
      case 'SOLUTION DEFINED': {
        return 'DEFINE-SOLUTION';
      }
      case 'IMPACT ANALYZED': {
        return 'ANALYZE-IMPACT';
      }
      case 'APPROVED': {
        return 'APPROVE';
      }
      case 'REJECTED': {
        return 'REJECT';
      }
      case 'CLOSED': {
        return 'CLOSE';
      }
      case 'PLANNED': {
        return 'COMMIT';
      }
      case 'CREATED': {
        return 'CREATE';
      }
      case 'READY FOR RELEASE': {
        return 'READY';
      }
      case 'RELEASED': {
        return 'RELEASE';
      }
      default:
        break;
    }
    return '';
  }

  navigateToCase(): string {
    let url = '';
    if (this.link.type === 'ChangeRequest') {
      url = '/change-requests/' + this.link.ID;
    } else if (this.link.type === 'ChangeNotice') {
      url = '/change-notices/' + this.link.ID;
    } else if (this.link.type === 'ReleasePackage') {
      url = '/release-packages/' + this.link.ID;
    } else if (this.link.type === 'Review') {
      url = '/reviews/' + this.link.ID;
    }
    return url;
  }

  getPreviousStatusList(): [string] {
    const caseStatus = (this.formGroup.get('generalInformation.status') && this.formGroup.get('generalInformation.status').value) || this.formGroup.get('status').value;
    let sequenceNumber = 0;
    const previousStatus = [];
    const statusList: FormControlEnumeration[] =
      ((this.formConfiguration['generalInformation'] && this.formConfiguration['generalInformation']['status'].options) ||
        this.formConfiguration['status']['options'])
      .map(function (status) {
        if (status.name === caseStatus) {
          sequenceNumber = Number(status.sequence);
        }
        status.sequence = Number(status.sequence);
        return status;
      });
    for (const status of statusList) {
      if ((status.sequence < sequenceNumber) && !(this.service.toUpperCase() === 'RELEASEPACKAGE' && status.value === 'NEW')) {
        previousStatus.push(status.label);
      }
    }
    return previousStatus as [string];
  }

  getPriorityStatus(): string {
    let status = 'None';
    let priority = this.service.toUpperCase() === 'CHANGEREQUEST' ? 'implementation_priority' : 'implementationPriority';
    this.priorityTitle = 'Priority of implementation';
    const statusList = [1, 2, 3];
    if (this.formGroup) {
      if (this.service.toUpperCase() === 'CHANGEREQUEST' && statusList.indexOf(this.formGroup.value.status) > -1 ) {
        priority = 'analysis_priority';
        this.priorityTitle = 'Priority of analysis';
      }
      const priorityStatus = this.formGroup.value[priority];
      if (this.formConfiguration[priority] && this.formConfiguration[priority]['options']) {
        this.formConfiguration[priority]['options']
          .map(function (item) {
            if (Number(item.value) === Number(priorityStatus)) {
              status = item.label;
            }
          });
      }
      return status;
    }
  }

  subscribeToFieldUpdateStore() {
    this.progressFields = [];
    this.fieldUpdateSubscriptions$ = this.appStore.pipe(select(selectAllFieldUpdates)).subscribe((fieldUpdateData: FieldUpdateData[]) => {
      if (fieldUpdateData && fieldUpdateData.length) {
        this.progressFields = fieldUpdateData.filter((item) =>
          ((item.id === 'generalInformation.title') || (item.id === 'generalInformation.status')  || (item.id === 'status')) && (item.serviceStatus === 'PROGRESS'));
      }
    });
  }

  isCaseObjectInFinalState(): boolean {
    return HelpersService.isCaseObjectInFinalState(this.service,
      (this.formGroup.get('generalInformation.status') && this.formGroup.get('generalInformation.status').value) ||
      (this.formGroup.get('status') && this.formGroup.get('status').value));
  }

  getTagLabels(tagNames: string[]): string[] {
    const tagLabels = [];
    tagNames.forEach(tagName => {
      tagLabels.push(this.configurationService.getFormFieldOptionDataByValue('ReleasePackage', 'tags', tagName));
    });
    return tagLabels;
  }

  ngOnDestroy(): void {
    if (this.fieldUpdateSubscriptions$) {
      this.fieldUpdateSubscriptions$.unsubscribe();
    }
  }
}
