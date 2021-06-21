import {Component, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-input-text-area',
  templateUrl: './mc-input-text-area.component.html',
  styleUrls: ['./mc-input-text-area.component.scss']
})
export class MCInputTextAreaComponent extends MCFieldComponent implements OnInit {
  maxLength: number;

  ngOnInit() {
    super.ngOnInit();
    this.maxLength = (this.fieldConfiguration && this.fieldConfiguration.validatorConfiguration) ? this.fieldConfiguration.validatorConfiguration.maxLength : null;
  }

}
