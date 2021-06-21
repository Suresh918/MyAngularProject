import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MCFieldComponent } from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-input-text-list',
  templateUrl: './mc-input-text-list.component.html',
  styleUrls: ['./mc-input-text-list.component.scss']
})
export class MCInputTextListComponent extends MCFieldComponent implements OnInit, OnChanges {
  maxLength: number;

  ngOnInit() {
    super.ngOnInit();
    this.maxLength = (this.fieldConfiguration && this.fieldConfiguration.validatorConfiguration) ? this.fieldConfiguration.validatorConfiguration.maxLength : null;
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.control && simpleChanges.control.currentValue.value.length) {
      this.control.setValue(simpleChanges.control.currentValue.value[0]);
    }
  }

  onAcceptChanges($event: any) {
    if ($event.value) {
      $event.value = [$event.value];
    }
    if ($event.oldValue) {
      $event.oldValue = [$event.oldValue];
    }
    super.onAcceptChanges($event);
  }

}
