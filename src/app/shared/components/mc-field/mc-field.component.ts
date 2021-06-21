import {Component, ContentChild, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';


import {UpdateFieldService} from '../../../core/services/update-field.service';
import {
  FieldElement,
  FieldElementUpdateDetail,
  ListFieldElement,
  UpdateFieldRequest,
  UpdateInstanceRequest
} from '../../models/field-element.model';
import {FormControlConfiguration, FormControlEnumeration} from '../../models/mc-configuration.model';
import {CaseObject} from '../../models/mc.model';
import {CaseObjectTabStatus, MyChangeState} from '../../models/mc-store.model';
import {mcFieldUpdated} from '../../../store/actions/field-update.actions';
import {FieldUpdateStates, FieldValueTypes, RequestTypes} from '../../models/mc-enums';
import {
  selectAllFieldUpdates,
  selectCaseAction,
  selectCaseObject,
  selectCaseObjectTabStatus,
  selectCaseObjectType,
  selectReadOnlyFields,
  selectWriteAllowFields,
  showLoader
} from '../../../store';
import {FieldValueType} from '../../models/mc-presentation.model';
import {CaseActionService} from '../../../core/services/case-action-service';
import {FieldUpdateData} from '../../models/mc-field-update.model';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';

@Component({
  selector: 'mc-field',
  template: ''
})
export class MCFieldComponent implements OnInit, OnDestroy {
  private _control: FormControl;

  @Input()
  options: string;
  @Input()
  public get control(): FormControl {
    return this._control;
  }
  public set control(value: FormControl) {
    this._control = value;
  }
  @Input()
  mode: Mode;
  @Input()
  showLengthHint?: boolean;
  @Input()
  caseObject: CaseObject;
  @Input()
  fieldValueType: FieldValueType;
  @Input()
  isHistoryEnabled: boolean;
  @Input()
  fontSize: string;
  @Input()
  fieldSaveNotApplicable: boolean;
  @Input()
  lockMode?: Modes;
  @Input()
  isBusy: boolean;
  @Input()
  isGenericField: boolean;
  @Input()
  hideHelp: boolean;
  @Input()
  hideConfirmationToolBar: boolean;
  @Input()
  groupType: string;
  @Input()
  showValueChip: boolean;
  @Input()
  hideLabel: boolean;
  @Input()
  ellipsisAfter: number;
  @Input()
  valueAsObject: boolean;
  @Input()
  valuesWhereOtherOptionsDisabled: any[];
  @Input()
  isNullable: boolean;
  @Input()
  align: string;
  @Input()
  bubbleAcceptChanges: boolean;
  @Input()
  requestType: RequestTypes;
  @Input()
  isReviewEntry: true;
  @Input()
  referenceId: number;
  @Input()
  instanceId: string;
  @Input()
  disableControl: boolean;
  // when fieldSaveNotApplicable is true it returns AcceptedChange otherwise the response from the field update service
  @Output()
  readonly bubbledAcceptChanges: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  readonly bubblePreAcceptChanges: EventEmitter<void> = new EventEmitter<void>();
  @Input()
  serverError: Info;
  @Input()
  checkModeCaseActions: boolean;
  @Input()
  byPassCaseActionCheck: boolean;


  fieldConfiguration: FormControlConfiguration;
  help: Info;
  enumeration: FormControlEnumeration[];
  caseObjectTabSubscription$: Subscription;
  caseObjectTab: number;
  changeObjectSubscriptions$: Subscription;
  fieldUpdateSubscriptions$: Subscription;
  modeFixed: string;
  fieldModeSubscription$: Subscription;
  fieldReadOnlySubscription$: Subscription;
  fieldWriteAllowSubscription$: Subscription;
  caseObjectType: string;
  sourceSystemID: string;
  instancePath: string;
  fieldTab: number;
  instanceResponse$: BehaviorSubject<any> = new BehaviorSubject({});
  blacklist = ['__proto__', 'prototype', 'constructor'];
  @ContentChild('alertTempRef') alertTempRef: ElementRef;

  constructor(public readonly updateFieldService: UpdateFieldService,
              public readonly helpersService: HelpersService,
              public appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    this.fieldTab = -1;
  }

  @Input()
  set controlConfiguration(configuration: FormControlConfiguration) {
    this.fieldConfiguration = configuration;
    if (configuration) {
      this.help = new Info(this.fieldConfiguration.help ? this.fieldConfiguration.help['message'] : '',
        '', '', '', '');
      this.enumeration = configuration.options;
    }
  }

  ngOnInit(): void {
    this.bubbleAcceptChanges = this.bubbleAcceptChanges || false;
    this.isBusy = false;
    this.serverError = null;
    this.isHistoryEnabled = this.isHistoryEnabled || false;
    // to avoid overwriting of mode based on case actions
    if (this.mode === Modes.PROTECTED || this.mode === Modes.EDIT || this.mode === Modes.READ) {
      this.modeFixed = Modes.PROTECTED;
    }
    if (this.caseObject) {
      this.caseObjectType = this.caseObject.type;
      this.setMode();
    } else {
      this.subscribeToCaseObjectType();
      this.subscribeToCaseObjectChange();
    }
    this.subscribeToFieldUpdateStore();
    this.subscribeToTabStatus();
  }

  subscribeToCaseObjectType() {
    this.appStore.pipe(select(selectCaseObjectType)).subscribe((type) => {
      this.caseObjectType = type;
    });
  }

  onChangeObjectChanged(changeObjectState: any): void {
    if ((changeObjectState && (changeObjectState.ID || changeObjectState.id)) || this.isGenericField) {
      if (changeObjectState.ID || changeObjectState.id) {
        this.caseObject = new CaseObject(changeObjectState.ID || changeObjectState.id, changeObjectState.revision || '', this.caseObjectType);
        if (changeObjectState.sourceSystemID) {
          this.sourceSystemID = changeObjectState.sourceSystemID;
        }
      }
      // mode should not be updated if the mode is set as protected in parent component: eg: createdBy and IMS page
      this.setMode();
    } else if (!this.modeFixed) {
      this.mode = Modes.PROTECTED;
    }
  }

  setMode(): void {
    if (!this.modeFixed || (this.modeFixed && this.checkModeCaseActions)) {
      const caseObjectAction =
        (this.caseObjectType === 'Review' ||
          this.caseObjectType === 'ReviewEntry' ||
          this.caseObjectType === 'ReviewTask' ||
          this.caseObjectType === 'ChangeRequest' ||
          this.caseObjectType === 'ReleasePackage')
          ? 'UPDATE' : 'SAVE';
      this.fieldModeSubscription$ = this.appStore.pipe(select(selectCaseAction,
        {
          actionData: {
            caseObjectId: this.caseObject.ID,
            revision: this.caseObject.revision || '',
            type: this.caseObjectType,
            action: caseObjectAction
          }
        })).subscribe((isAllowed: boolean) => {
          if (!this.byPassCaseActionCheck) {
            this.mode = isAllowed ? (this.lockMode || Modes.READ) : Modes.PROTECTED;
          } else {
            this.mode = this.lockMode || Modes.READ;
          }
      });
      this.subscribeToReadOnlyState();
      this.subscribeToWriteAllowState();
    }
  }

  subscribeToReadOnlyState() {
    this.fieldReadOnlySubscription$ = this.appStore.pipe(select(selectReadOnlyFields,
      {
        readOnlyData : {
          caseObjectId: this.caseObject.ID,
          revision: this.caseObject.revision || '',
          type: this.caseObjectType
        }
      })).subscribe((data) => {
      if (data) {
        if (!this.fieldConfiguration) {
          this.mode = this.mode || Modes.READ;
        } else {
          let canEdit = true;
          data.forEach((readOnlyParameter) => {
            if (this.fieldConfiguration.ID.match(new RegExp(readOnlyParameter))) {
              canEdit = false;
              return;
            }
          });
          this.mode = canEdit ? (this.mode || Modes.READ) : Modes.PROTECTED ;
        }
      }
    });
  }

  subscribeToWriteAllowState() {
    this.fieldWriteAllowSubscription$ = this.appStore.pipe(select(selectWriteAllowFields,
      {
        writeAllowedData : {
          caseObjectId: this.caseObject.ID,
          revision: this.caseObject.revision || '',
          type: this.caseObjectType
        }
      })).subscribe((data) => {
      if (data && data.length > 0) {
        let canEdit = false;
        data.forEach((readOnlyParameter) => {
          if (this.fieldConfiguration.ID.match(new RegExp(readOnlyParameter))) {
            canEdit = true;
            return;
          }
        });
        this.mode = canEdit ?  Modes.READ : Modes.PROTECTED;
      }
    });
  }

  onAcceptChanges($event: AcceptedChange) {
    if (this.fieldSaveNotApplicable) {
      this.bubbledAcceptChanges.emit($event);
      return;
    }
    // field save is dependent on case object data, if no case object data, field save results in error
    if (!this.caseObject) {
      return;
    }

    if (this.requestType === RequestTypes.Instance) {
      if (this.isReviewEntry) {
        this.caseObject.ID = JSON.stringify(this.referenceId);
        this.caseObject.type = 'ReviewEntry';
      }
      const updateFieldRequest: UpdateInstanceRequest = this.processInstanceRequest($event);
      this.saveInstanceChanges(updateFieldRequest, $event.ID);
    } else {
      const updateFieldRequest: UpdateFieldRequest = this.processRequest($event);
      this.saveFieldChanges(updateFieldRequest, $event.ID);
    }
  }

  saveFieldChanges(req: UpdateFieldRequest, fieldID: string, updated$?: BehaviorSubject<any>, error$?: BehaviorSubject<Info>): void {
    if (this.isInFieldRequestFormat(req as UpdateFieldRequest)) {
      this.bubblePreAcceptChanges.emit();
      this.handleBusy(fieldID, true);
      this.serverError = null;
      this.updateFieldState(fieldID, FieldUpdateStates.progress);
      this.updateFieldService.updateField$(this.caseObject, req, this.sourceSystemID).subscribe((response: any) => {
        if (response && (response.FieldElement || response.ListFieldElement)) {
          this.ProcessElementResponse(fieldID, response, updated$);
        } else {
          this.updateFieldState(fieldID, FieldUpdateStates.error);
          this.serverError = new Info(this.helpersService.getErrorMessage(response), null, null, null, InfoLevels.ERROR);
        }
        if (this.serverError && error$) {
          error$.next(this.serverError);
        }
        this.emitSaveEvent(response);
        this.handleBusy(fieldID, false);
      });
    } else {
      return;
    }
  }


  saveInstanceChanges(instanceRequest: UpdateInstanceRequest, fieldID: string, updated$?: BehaviorSubject<any>, error$?: BehaviorSubject<Info>): void {
    if (this.isInInstanceRequestFormat(instanceRequest as UpdateInstanceRequest)) {
      this.bubblePreAcceptChanges.emit();
      this.handleBusy(fieldID, true);
      this.serverError = null;
      this.updateFieldState(fieldID, FieldUpdateStates.progress);
      this.updateFieldService.updateInstance$(
        this.caseObject,
        this.instanceId,
        this.instancePath,
        instanceRequest)
        .subscribe((response: any) => {
        if (response && response.id) {
          this.processInstanceResponse(fieldID, response, updated$);
          this.instanceResponse$.next(response);
        } else {
          this.updateFieldState(fieldID, FieldUpdateStates.error);
          this.serverError = new Info(this.helpersService.getErrorMessage(response), null, null, null, InfoLevels.ERROR);
        }
        if (this.serverError && error$) {
          error$.next(this.serverError);
        }

        this.emitSaveEvent(response);
        this.handleBusy(fieldID, false);
      });
    } else {
      return;
    }
  }


  ProcessElementResponse(fieldID, response, updated$?: BehaviorSubject<any>) {
    let fieldElementResponse: FieldElement;
    if (response.FieldElement) {
      fieldElementResponse = (Array.isArray(response.FieldElement)) ?
        response.FieldElement.find(value => value.ID === fieldID) :
        response.FieldElement;
    }
    if (response.ListFieldElement) {
      fieldElementResponse = (Array.isArray(response.ListFieldElement)) ?
        response.ListFieldElement.find(value => value.ID === fieldID) :
        response.ListFieldElement;
    }
    if (fieldElementResponse && fieldElementResponse.response && fieldElementResponse.response.status === FieldUpdateStates.success) {
      this.handleBusy(fieldID, false);
      this.serverError = null;
      this.updateFieldState(fieldID, FieldUpdateStates.success);
      if (updated$) {
        updated$.next(response.FieldElement ?
          (Array.isArray(response.FieldElement) ? response.FieldElement[0].newValue : response.FieldElement.newValue)
          : (Array.isArray(response.ListFieldElement) ? response.ListFieldElement[0].newValues : response.ListFieldElement.newValue));
      }
    } else if (fieldElementResponse && fieldElementResponse.response && fieldElementResponse.response.status === FieldUpdateStates.error) {
      this.updateFieldState(fieldID, FieldUpdateStates.error, fieldElementResponse.response);
      this.serverError = new Info(fieldElementResponse.response.details,
        null, null, null, fieldElementResponse.response && fieldElementResponse.response.severity === -2 ? InfoLevels.WARN : InfoLevels.ERROR);
    } else if (fieldElementResponse && !(fieldElementResponse.response && fieldElementResponse.response.status)) {
      this.updateFieldState(fieldID, FieldUpdateStates.error);
      this.serverError = new Info(this.helpersService.getErrorMessage(response), null, null, null, InfoLevels.ERROR);
    }
  }

  processInstanceResponse(fieldID, response, updated$?: BehaviorSubject<any>) {
    if (response && response.id) {
      this.handleBusy(fieldID, false);
      this.serverError = null;
      this.updateFieldState(fieldID, FieldUpdateStates.success);
      if (updated$) {
        updated$.next(response ? response : {});
      }
    }
  }

  handleBusy(fieldID: string, isBusy: boolean): void {
    if ((fieldID === 'generalInformation.title' || fieldID === 'generalInformation.status') && this.caseObjectType !== 'Action') {
      this.appStore.dispatch(showLoader(isBusy));
    } else {
      this.isBusy = isBusy;
    }
  }

  emitSaveEvent(response) {
    if (this.bubbleAcceptChanges) {
      this.bubbledAcceptChanges.emit(response);
    }
  }

  isInFieldRequestFormat(req: UpdateFieldRequest) {
    if (req.FieldElement && req.FieldElement[0] && req.FieldElement[0]['ID'] && (req.FieldElement[0]['oldValue'] ||
      req.FieldElement[0]['newValue'])) {
      return true;
    }
    return (req.ListFieldElement && req.ListFieldElement[0] && req.ListFieldElement[0]['ID'] &&
      (req.ListFieldElement[0]['oldValues'] || req.ListFieldElement[0]['newValues']));
  }

  isInInstanceRequestFormat(req: UpdateInstanceRequest) {
    return (req.oldIns && req.newIns && Object.keys(req.oldIns).length > 0 && Object.keys(req.newIns).length);
  }

  processInstanceRequest($event: AcceptedChange): UpdateInstanceRequest {
    this.instancePath = this.helpersService.getPathByInstanceId($event.ID, this.caseObject.type);
    const oldInst = this.convertDotToObject($event.ID, $event.oldValue);
    const newInst = this.convertDotToObject($event.ID, $event.value);
    return new UpdateInstanceRequest(oldInst, newInst);
  }


  processRequest($event: AcceptedChange): UpdateFieldRequest {
    const listFieldElement: ListFieldElement[] = [];
    const fieldElement: FieldElement[] = [];
    if (this.fieldValueType === FieldValueTypes.Multiple || Array.isArray($event.value) || Array.isArray($event.oldValue)) {
      listFieldElement.push(new ListFieldElement($event.ID, $event.oldValue, $event.value));
    } else {
      fieldElement.push(new FieldElement($event.ID, $event.oldValue, $event.value));
    }
    return new UpdateFieldRequest(fieldElement, listFieldElement);
  }

  convertDotToObject(path, value) {
    const obj = {};
    const pathArray = path.split('.');
    // remove parent id from path if it has parent
    if (this.instancePath && this.instancePath !== '' && pathArray.length > 1) {
      pathArray.splice(0, pathArray.length - 1);
      path = pathArray.join('.');
    }
    const parsedPath = this.parsePath(path, '.').join('.');
    if (path.indexOf('.') !== -1) {
      this.constructObject(parsedPath.split('.'), obj, value);
    } else {
      obj[path] = value;
    }
    return obj;
  }

  blacklistFilter(part) {
    return this.blacklist.indexOf(part) === -1;
  }

  parsePath(path, sep) {
    if (path.indexOf('[') >= 0) {
      path = path.replace(/\[/g, '.').replace(/]/g, '');
    }
    const parts = path.split(sep);
    const check = parts.filter((part) => this.blacklistFilter(part));
    if (check.length !== parts.length) {
      throw Error('Refusing to update blacklisted property ' + path);
    }
    return parts;
  }

  isArrayOrObject(val) {
    return Object(val) === val;
  }

  isEmptyObject(val) {
    return Object.keys(val).length === 0;
  }

  constructObject(pathArray, object, value) {
    const k = pathArray.shift();
    if (pathArray.length > 0) {
      object[k] = object[k] || {};
      this.constructObject(pathArray, object[k], value);
    } else {
      if (this.isArrayOrObject(object[k]) && !this.isEmptyObject(object[k])) {
        if (!(this.isArrayOrObject(value) && this.isEmptyObject(value))) {
          throw new Error('Trying to redefine non-empty obj["' + k + '"]');
        }
        return;
      }
      object[k] = value;
    }
  }


  updateFieldState(id: string, status: string, errorInfo?: FieldElementUpdateDetail): void {
    if (this.fieldTab === -1) {
      this.fieldTab = this.caseObjectTab;
    }
    if (status !== FieldUpdateStates.error) {
      this.serverError = null;
    }
    this.appStore.dispatch(mcFieldUpdated(new FieldUpdateData({
      caseObject: this.caseObject,
      fieldId: id,
      tab: this.fieldTab,
      serviceStatus: status,
      errorInfo: errorInfo
    })));
  }

  subscribeToFieldUpdateStore() {
    this.fieldUpdateSubscriptions$ = this.appStore.pipe(select(selectAllFieldUpdates)).subscribe(
      (fieldUpdateData: FieldUpdateData[]) => {
        if (fieldUpdateData && fieldUpdateData.length) {
          fieldUpdateData.forEach((field) => {
            if (this.fieldConfiguration
              && this.caseObject
              && field.fieldId === this.fieldConfiguration.ID
              && field.caseObject.ID === this.caseObject.ID &&
              field.mandatoryState === FieldUpdateStates.error && !this.serverError) {
              this.serverError = new Info('Required field. Fill and try again.',
                null, null, null, InfoLevels.ERROR);
            }
          });
        }
      });
  }

  subscribeToTabStatus() {
    this.caseObjectTabSubscription$ = this.appStore.pipe(select(selectCaseObjectTabStatus)).subscribe(
      (res: CaseObjectTabStatus) => {
        if (res) {
          this.caseObjectTab = res.currentTab || 0;
        }
      });
  }

  subscribeToCaseObjectChange() {
    this.changeObjectSubscriptions$ = this.appStore.pipe(select(selectCaseObject)).subscribe(
      (changeObjectState: CaseObject) => {
        this.onChangeObjectChanged(changeObjectState);
      });

    /*this.appStore.pipe(select(selectAllFieldUpdates)).subscribe(data => {
       console.log(data);
     });
     this.appStore.pipe(select(selectFieldUpdateEntities)).subscribe(data => {
       console.log(data);
     });*/
  }

  ngOnDestroy() {
    if (this.caseObjectTabSubscription$) {
      this.caseObjectTabSubscription$.unsubscribe();
    }
    if (this.changeObjectSubscriptions$) {
      this.changeObjectSubscriptions$.unsubscribe();
    }
    if (this.fieldUpdateSubscriptions$) {
      this.fieldUpdateSubscriptions$.unsubscribe();
    }
    if (this.fieldModeSubscription$) {
      this.fieldModeSubscription$.unsubscribe();
    }
    if (this.fieldReadOnlySubscription$) {
      this.fieldReadOnlySubscription$.unsubscribe();
    }
    if (this.fieldWriteAllowSubscription$) {
      this.fieldWriteAllowSubscription$.unsubscribe();
    }
  }
}
