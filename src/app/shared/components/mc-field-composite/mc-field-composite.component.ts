import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {BehaviorSubject, Subscription} from 'rxjs';

import {MCFieldComponent} from '../mc-field/mc-field.component';
import {FormControlConfiguration} from '../../models/mc-configuration.model';
import {UpdateFieldRequest, UpdateInstanceRequest} from '../../models/field-element.model';
import {RequestTypes} from "../../models/mc-enums";

@Component({
  selector: 'mc-composite-field',
  template: ''
})
export class MCFieldCompositeComponent extends MCFieldComponent implements OnInit, OnDestroy {
  _descriptionControl: FormControl;
  selectControl: FormControl;
  oldControlValue: string;
  @Input()
  set descriptionControl(control: FormControl) {
    if (control) {
      this._descriptionControl = control;
      this.oldControlValue = JSON.parse(JSON.stringify(control.value));
    }
  }

  get descriptionControl() {
    return this._descriptionControl;
  }

  @Input()
  descriptionControlConfiguration: FormControlConfiguration;
  @Input()
  showDescriptionForOptions: string[];
  @Input()
  showMandatoryDescriptionForOptions?: string[];
  @Input()
  selectionControl?: FormControl;
  @Input()
  secondaryControlMaxLength?: number;
  @Input()
  secondaryControlMinLength?: number;
  @Input()
  secondaryControlIsHistoryEnabled?: boolean;
  @Input()
  clearDescriptionOnControlValueChange: boolean;
  @Input()
  isSecondaryControlValueHTML: boolean;
  @Input()
  bypassBubbleAcceptChangeForID: string;
  descriptionControlData: AcceptedChange;
  controlUpdated$: BehaviorSubject<any> = new BehaviorSubject(undefined);
  controlUpdateSubscription$: Subscription;
  acceptedChange: AcceptedChange;

  @Input()
  set control(frmcontrol: FormControl) {
    this.selectControl = frmcontrol;
    if (frmcontrol && frmcontrol.value && typeof frmcontrol.value === 'number') {
      this.selectControl.setValue(frmcontrol.value.toString());
    }
  }

  ngOnInit(): void {
    this.controlUpdateSubscription$ = this.controlUpdated$.subscribe(value => {
      if (value !== undefined) {
        this.updateDescriptionControl(this.acceptedChange);
      }
    });
    super.ngOnInit();
  }

  onRevertedChanges($event: AcceptedChange) {
    $event.value = '';
    this.descriptionControlData = null;
    this.onAcceptChanges($event);
  }

  onAcceptChanges($event: AcceptedChange) {
    this.acceptedChange = $event;
    if (!this.caseObject) {
      return;
    }
    // Added condition to satisfy the case where fieldSaveNotApplicable for secondaryControl
    // The default behaviour is as follows: Whenever fieldSaveNotApplicable is true and bubbleAcceptChanges is true, bubbleAcceptChanges is triggered for both the primary control and the description control
    if (this.bubbleAcceptChanges && this.fieldSaveNotApplicable && (this.fieldConfiguration.ID === $event.ID || this.descriptionControlConfiguration.ID === $event.ID)
      && (!(this.bypassBubbleAcceptChangeForID === $event.ID))) {
      this.bubbledAcceptChanges.emit($event);
    } else {
      if (this.clearDescriptionOnControlValueChange && this.descriptionControlConfiguration.ID !== $event.ID) {
        this.descriptionControl = new FormControl(undefined, this.descriptionControl.validator);
        this.descriptionControl.disable();
      }
      if (this.requestType === RequestTypes.Instance) {
        const updateInstanceRequest: UpdateInstanceRequest = this.processInstanceRequest($event);
        this.saveInstanceChanges(updateInstanceRequest, $event.ID, this.controlUpdated$);
      } else {
        const updateFieldRequest: UpdateFieldRequest | UpdateInstanceRequest = this.processRequest($event);
        this.saveFieldChanges(updateFieldRequest, $event.ID, this.controlUpdated$);
      }
    }
  }

  updateDescriptionControl($event: AcceptedChange) {
    this.descriptionControl.enable();
    if (this.descriptionControlData && this.descriptionControlConfiguration.ID !== $event.ID) {
      this.onAcceptChanges(this.descriptionControlData);
      this.descriptionControlData = null;
    }
  }

  ngOnDestroy() {
    if (this.controlUpdateSubscription$) {
      this.controlUpdateSubscription$.unsubscribe();
    }
    super.ngOnDestroy();
  }
}
