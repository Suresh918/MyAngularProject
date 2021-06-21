import {Component, Input, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';
import {FormControl} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {RequestTypes} from '../../models/mc-enums';

@Component({
  selector: 'mc-rich-text-area',
  templateUrl: './mc-rich-text-area.component.html',
  styleUrls: ['./mc-rich-text-area.component.scss']
})
export class MCRichTextAreaComponent extends MCFieldComponent implements OnInit {
  maxLength: number;
  oldControlValue: string;
  richTextControl: FormControl;
  @Input()
  public get control(): FormControl {
    return this.richTextControl;
  }
  public set control(richTextControl: FormControl) {
    if (richTextControl) {
      this.richTextControl = richTextControl;
      this.oldControlValue = JSON.parse(JSON.stringify(richTextControl.value));
    }
  }
  ngOnInit() {
    super.ngOnInit();
    this.maxLength = (this.fieldConfiguration && this.fieldConfiguration.validatorConfiguration) ? this.fieldConfiguration.validatorConfiguration.maxLength : null;
  }

  onFormAcceptChanges($event: AcceptedChange) {
    if (this.fieldSaveNotApplicable) {
      this.bubbledAcceptChanges.emit($event);
      return;
    }
    if (!this.caseObject) {
      return;
    }
    $event.oldValue = this.oldControlValue;
    // Update instance data when CR or RP
    if (this.requestType === RequestTypes.Instance) {
      const fieldUpdated$: BehaviorSubject<any> = new BehaviorSubject({});
      const updateFieldRequest = this.processInstanceRequest($event);
      this.saveInstanceChanges(updateFieldRequest, $event.ID, fieldUpdated$);
      fieldUpdated$.subscribe(() => {
        this.oldControlValue = $event.value;
      });
    } else { // Update instance data when CN, Agenda or Others
      const fieldUpdated$: BehaviorSubject<any> = new BehaviorSubject({});
      const updateFieldRequest = this.processRequest($event);
      this.saveFieldChanges(updateFieldRequest, $event.ID, fieldUpdated$);
      fieldUpdated$.subscribe(() => {
        this.oldControlValue = $event.value;
      });
    }
  }
}
