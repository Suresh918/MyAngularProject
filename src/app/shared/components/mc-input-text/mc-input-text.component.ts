import {Component, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-input-text',
  templateUrl: './mc-input-text.component.html',
  styleUrls: ['./mc-input-text.component.scss']
})
export class MCInputTextComponent extends MCFieldComponent implements OnInit {
  maxLength: number;

  ngOnInit() {
    super.ngOnInit();
    this.maxLength = (this.fieldConfiguration && this.fieldConfiguration.validatorConfiguration) ? this.fieldConfiguration.validatorConfiguration.maxLength : null;
  }
}
