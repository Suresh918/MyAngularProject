import { Component, OnInit } from '@angular/core';
import { MCFieldComponent } from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-input-link',
  templateUrl: './mc-input-link.component.html',
  styleUrls: ['./mc-input-link.component.scss']
})
export class MCInputLinkComponent extends MCFieldComponent implements OnInit {
  maxLength: number;

  ngOnInit() {
    super.ngOnInit();
    this.maxLength = (this.fieldConfiguration && this.fieldConfiguration.validatorConfiguration) ? this.fieldConfiguration.validatorConfiguration.maxLength : null;
  }

}
