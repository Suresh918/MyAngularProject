import {Component, Input, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-input-duration',
  templateUrl: './mc-input-duration.component.html',
  styleUrls: ['./mc-input-duration.component.scss']
})
export class MCInputDurationComponent extends MCFieldComponent implements OnInit {
  @Input()
  prefixInReadMode;
  @Input()
  pattern: RegExp;
  @Input()
  formatStringHint: string;
  @Input()
  durationType: string;
  @Input()
  displayOutputFormat: string;
  ngOnInit() {
    super.ngOnInit();
  }
}
