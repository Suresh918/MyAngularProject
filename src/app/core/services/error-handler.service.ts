import {Injectable, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ParallelUpdateService} from '../../core/services/parallel-update.service';
import {MatDialogErrorComponent} from '../../shared/components/mat-dialog-error/mat-dialog-error.component';
import {
  clearErrorResponse,
  errorPopupClosed,
  selectHighSeverityStackState,
  selectLowSeverityStackState,
  selectMediumSeverityStackState,
  selectServiceError
} from '../../shared/store';
import {environment} from '../../../environments/environment';
import {ErrorResponseModel, ErrorState, MyChangeState, ParallelUpdateCaseObject, ParallelUpdateState, ServiceError} from '../../shared/models/mc-store.model';
import {DeltaItem, ErrorPayLoad} from '../../shared/models/error-handling.model';
import {selectParallelUpdateCaseObject} from '../../store';
import {updateParallelUpdateCaseObject} from '../../store/actions/parallel-update.actions';

@Injectable({
  'providedIn': 'root'
})
export class ErrorHandlerService implements OnDestroy {
  dialogRef: any;
  isErrorDialogOpen: boolean;
  serviceError: ServiceError;
  errorState: ErrorState;
  serviceErrorSubscription$: Subscription;
  lowSeverityErrorSubscription$: Subscription;
  mediumSeverityErrorSubscription$: Subscription;
  errorResponseSubscription$: Subscription;
  errorDialogSubscription$: Subscription;
  parallelUpdateSubscription$: Subscription;
  currentObject: any;
  objectType: string;
  caseAction: string;
  newCaseObject: any;
  controlConfiguration: any;
  deltaListKeysMap: Map<string, string>;
  deltaFieldsToBeSetFromService: any;
  deltaFieldsToBeIgnoreed: any;
  private readonly url = `${environment.rootURL}mc${environment.version}/error-reports`;

  constructor(private readonly errorDialog: MatDialog,
              private readonly errorStore: Store<ErrorState>,
              private readonly httpClient: HttpClient,
              private readonly parallelUpdateService: ParallelUpdateService,
              private readonly parallelUpdateStore: Store<ParallelUpdateState>,
              private readonly appStore: Store<MyChangeState>) {
    this.deltaFieldsToBeSetFromService = [
      {'minutes.attendeesPresent': {'isExists': false, 'label': ''}},
      {'presenter': {'isExists': false, 'label': ''}},
      {'specialInvitees': {'isExists': false, 'label': ''}},
    ];
    this.deltaFieldsToBeIgnoreed = [
      {'plannedStartDate': {'isExists': false, 'label': ''}}
    ];

  }


  subscribeServiceErrorStateStore(): void {
    this.serviceErrorSubscription$ = this.errorStore.pipe(select(selectServiceError)).subscribe((serviceError: ServiceError) => {
      if (serviceError) {
        this.serviceError = serviceError;
      }
    });
  }

  subscribeLowSeverity(): void {
    this.lowSeverityErrorSubscription$ = this.errorStore.pipe(select(selectLowSeverityStackState)).subscribe((res: any) => {
      if (res) {
        this.saveErrorStateObj();
      }
    });
  }

  subscribeMediumSeverity(): void {
    this.mediumSeverityErrorSubscription$ = this.errorStore.pipe(select(selectMediumSeverityStackState)).subscribe((res: any) => {
      if (res) {
        this.saveErrorStateObj();
      }
    });
  }

  subscribeHighSeverity(): void {
    this.errorResponseSubscription$ = this.errorStore.pipe(select(selectHighSeverityStackState)).subscribe((res: any) => {
      if (res) {
        this.saveErrorStateObj();
      }
    });
  }

  subscribeErrorStore(): void {
    this.subscribeToParallelUpdateStore();
    this.errorDialogSubscription$ = this.errorStore.pipe(select(selectHighSeverityStackState)).subscribe((res: ErrorResponseModel[]) => {
      /*if (res && res.length && res[0].statusCode === 'BPM-CASE-002') {
        this.checkParallelUpdateChanges();
        return;
      }*/
      let dialogRef;
      if (!this.isErrorDialogOpen && res && res.length > 0) {
        dialogRef = this.errorDialog.open(MatDialogErrorComponent, {
          width: '50rem'
        });
        this.isErrorDialogOpen = true;
      }
      if (dialogRef) {
        dialogRef.afterClosed().subscribe((errorPayLoad: ErrorPayLoad) => {
          this.isErrorDialogOpen = false;
          this.errorStore.dispatch(clearErrorResponse());
          this.errorStore.dispatch(errorPopupClosed(true));
        });
      }
    });
  }

  subscribeToParallelUpdateStore() {
    this.parallelUpdateSubscription$ = this.appStore.pipe(select(selectParallelUpdateCaseObject)).subscribe((res) => {
      this.caseAction = res.caseAction;
      this.objectType = res.objectType;
      this.currentObject = res.currentObject;
      this.controlConfiguration = res.controlConfiguration;
    });
  }


  getRequest(currentObject) {
    switch (this.objectType) {
      case 'change-requests':
        return {'ChangeRequestElement': currentObject};
      case 'change-notices':
        return {'ChangeNoticeElement': currentObject};
      case 'actions':
        return {'ActionElement': currentObject};
      case 'release-packages':
        return {'ReleasePackageElement': currentObject};
      case 'agendas':
      case 'agenda-edit':
        return {'AgendaElement': currentObject};
      case 'agenda-item':
        return {'AgendaItemElement': currentObject};
      case 'agenda-items':
        return {'AgendaItemElement': currentObject};
      case 'reviews':
        return {'ReviewElement': currentObject};
      default:
        return {};
    }
  }

  updateCurrentRecord(deltaList, noteConflictExists?: boolean, otherFields?) {
    const fieldsToMerge = ['notes', 'documents'];
    const differencesList = deltaList.diff.differences;
    differencesList.forEach((item) => {
      if (item.field.indexOf('lastModifiedOn') > -1) {
        this.currentObject.generalInformation.lastModifiedOn = item.oldValue;
        return;
      }
    });
    if (deltaList.merge) {
      fieldsToMerge.forEach((field) => {
        this.currentObject[field] = deltaList.merge[field];
      });
    }
    this.updateParallelUpdateStore();
  }

  updateParallelUpdateStore(): void {
    this.parallelUpdateStore.dispatch(updateParallelUpdateCaseObject({
        currentObject: this.currentObject,
        caseAction: this.caseAction,
        objectType: this.objectType,
        saveObject: true
      } as ParallelUpdateCaseObject
    ));
  }

  saveErrorStateObj(): void {
    if (environment.sendErrorReports) {
      const payload = {
        'errorReport': this.getErrorPayLoad(this.serviceError)
      };
      if (payload.errorReport.transactionIDs.length > 0) {
        this.httpClient.post(this.url, payload).subscribe(res => {
        });
      }
    }
  }


  getErrorPayLoad(serviceError: ServiceError): ErrorPayLoad {
    return {
      transactionIDs: serviceError.transactionIDs,
      requestStack: serviceError.requestStack,
      responseStack: serviceError.responseStack
    } as ErrorPayLoad;
  }

  ngOnDestroy() {
    if (this.serviceErrorSubscription$) {
      this.serviceErrorSubscription$.unsubscribe();
    }
    if (this.lowSeverityErrorSubscription$) {
      this.lowSeverityErrorSubscription$.unsubscribe();
    }
    if (this.mediumSeverityErrorSubscription$) {
      this.mediumSeverityErrorSubscription$.unsubscribe();
    }
    if (this.errorResponseSubscription$) {
      this.errorResponseSubscription$.unsubscribe();
    }
    if (this.errorDialogSubscription$) {
      this.errorDialogSubscription$.unsubscribe();
    }
    if (this.parallelUpdateSubscription$) {
      this.parallelUpdateSubscription$.unsubscribe();
    }
  }

  setDeltaFieldsFromNewCaseObject(deltaListProcessed: DeltaItem[]) {
    for (const item of this.deltaFieldsToBeSetFromService) {
      // TODO: we need to do service call here using key state
      if (item.isExists) {
        const key = Object.keys(item)[0];
        let newValue = this.newCaseObject;
        let oldValue = this.currentObject;
        const keyArray = key.split('.');
        for (let i = 0; i < keyArray.length; i++) {
          if (oldValue) {
            oldValue = oldValue[keyArray[i]];
          }
          if (newValue) {
            newValue = newValue[keyArray[i]];
          }
        }
        this.setDeltaItem(key, oldValue, newValue, item.label, deltaListProcessed);
      }
    }
  }

  getDeltaListKeys(deltaList: DeltaItem[]): void {
    const deltaListKeysSet = new Set();
    this.deltaListKeysMap = new Map();
    deltaList.forEach(deltaItem => {
      deltaListKeysSet.add(deltaItem.field);
    });
    deltaListKeysSet.forEach((key: string) => {
      this.deltaListKeysMap[key] = '';
    });
  }

  hasFieldInDeltaList(field: string): boolean {
    return this.deltaListKeysMap && this.deltaListKeysMap.has(field);
  }

  hasDeltaItemFieldInSpecifiedList(deltaItem: DeltaItem, isIgnoreList: boolean): boolean {
    let hasField = false;
    if (deltaItem.field.indexOf('lastModifiedOn') > -1) {
      this.currentObject.generalInformation.lastModifiedOn = deltaItem.oldValue;
    }
    const currentDeltaFieldsConfiguration = isIgnoreList ? this.deltaFieldsToBeIgnoreed : this.deltaFieldsToBeSetFromService;
    for (const item of currentDeltaFieldsConfiguration) {
      const key = Object.keys(item)[0];
      if (deltaItem.field.indexOf(key) !== -1) {
        item.isExists = true;
        hasField = true;
        break;
      }
    }
    return hasField;
  }

  setDeltaItem(field: string, oldValue: any, newValue: any, label: string, deltaList: DeltaItem[]): void {
    deltaList.push({
      'field': field,
      'label': label,
      'newValue': newValue,
      'oldValue': oldValue,
      'newValueSelected': null,
      'oldValueSelected': null,
    } as DeltaItem);
  }
}
