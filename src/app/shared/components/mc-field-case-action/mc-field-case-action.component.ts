import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FieldUpdateStates, RequestTypes} from '../../models/mc-enums';
import {UpdateFieldService} from '../../../core/services/update-field.service';
import {Store} from '@ngrx/store';
import {MyChangeState} from '../../models/mc-store.model';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {HelpersService} from '../../../core/utilities/helpers.service';
import {CaseActionService} from '../../../core/services/case-action-service';
import {loadCaseObject} from '../../../store/actions/case-object.actions';
import {refreshNotificationsCount} from '../../../store';
import {StoreHelperService} from '../../../core/utilities/store-helper.service';
import {CaseObjectServicePath} from '../case-object-list/case-object.enum';

@Component({
  selector: 'mc-field-case-action',
  template: ''

})
export class MCFieldCaseActionComponent extends MCFieldComponent {
  @Input()
  caseObjectId: number;
  @Output()
  readonly caseActionChangeSuccess: EventEmitter<void> = new EventEmitter<void>();

  constructor(public readonly updateFieldService: UpdateFieldService,
              public readonly helpersService: HelpersService,
              public readonly appStore: Store<MyChangeState>,
              public readonly caseActionService: CaseActionService,
              public readonly storeHelperService: StoreHelperService) {
    super(updateFieldService, helpersService, appStore, caseActionService, storeHelperService);
  }

  onAcceptChanges($event: AcceptedChange) {
    if (!this.caseObject) {
      return;
    }
    if (this.requestType === RequestTypes.Instance) {
      this.saveInstanceStatusChanges(this.caseObject, $event);
    } else {
      this.saveStatusChanges(this.caseObject, $event);
    }
    this.isBusy = true;
  }

  saveStatusChanges(caseObject, field): void {
    this.updateFieldState(field.ID, FieldUpdateStates.progress);
    this.updateFieldService.updateStatusField$(caseObject.ID,
      this.helpersService.getCaseObjectForms(this.caseObjectType).path,
      this.getCaseActionForStatus(field.value)).subscribe((response: any) => {
      if (response && (response.ChangeRequestElement || response.ChangeNoticeElement || response.ReleasePackageElement)) {
        this.updateFieldStatusResponse(response.ChangeRequestElement || response.ChangeNoticeElement || response.ReleasePackageElement);
        this.updateFieldState(field.ID, FieldUpdateStates.success);
        this.appStore.dispatch(refreshNotificationsCount(true));
        this.isBusy = false;
        this.caseActionChangeSuccess.emit();
      } else {
        this.updateFieldStatusResponse({'error': ''});
        this.updateFieldState(field.ID, FieldUpdateStates.error);
        this.serverError = new Info(response);
        this.isBusy = false;
      }
    });
  }

  saveInstanceStatusChanges(caseObject, field): void {
    this.updateFieldState(field.ID, FieldUpdateStates.progress);
      const caseObjectPath = this.caseObject.type === 'ChangeRequest' ? CaseObjectServicePath['ChangeRequest'] : CaseObjectServicePath['ReleasePackage'];
      this.updateFieldService.updateCaseObjectStatusField(caseObject.ID, this.getCaseActionForStatus(field.value), caseObjectPath).subscribe((response: any) => {
        if (response) {
          if (this.caseObject && this.caseObject.type === 'ChangeRequest') {
            this.updateFieldService.getChangeRequestDetails$(response.id).subscribe(res => {
              this.updateFieldStatusResponse(res);
            });
          } else if (this.caseObject && this.caseObject.type === 'ReleasePackage') {
            this.updateFieldService.getReleasePackageDetails(response.id).subscribe(res => {
              this.updateFieldStatusResponse(res);
            });
          }
          this.updateFieldState(field.ID, FieldUpdateStates.success);
          this.appStore.dispatch(refreshNotificationsCount(true));
          this.isBusy = false;
          this.caseActionChangeSuccess.emit();
        } else {
          this.updateFieldStatusResponse({'error': ''});
          this.updateFieldState(field.ID, FieldUpdateStates.error);
          this.serverError = new Info(response);
          this.isBusy = false;
        }
      });
  }

  getCaseActionForStatus(status: string): string {
    let caseAction = '';
    this.caseActionService.getCaseActionsForStatuses().subscribe(allCaseActions => {
      const statusCaseActionMapping = allCaseActions[this.caseObject.type];
      caseAction = statusCaseActionMapping.find((obj) => obj.status === status.toUpperCase()).caseAction;
    });
    return caseAction;
  }

  updateFieldStatusResponse(response) {
    this.appStore.dispatch(loadCaseObject({caseObject: response, caseObjectType: this.caseObjectType}));
  }

}
