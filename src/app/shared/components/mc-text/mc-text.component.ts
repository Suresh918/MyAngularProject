import {Component, Input, OnInit} from '@angular/core';
@Component({
  selector: 'mc-text',
  templateUrl: './mc-text.component.html',
  styleUrls: ['./mc-text.component.scss']
})
export class MCTextComponent {
  helpMsg: Info;
  @Input()
  label: string;
  @Input()
  value: string;
  @Input()
  align: string;
  @Input()
  isSingleLine: boolean;
  @Input()
  showFullText: boolean;
  @Input()
  set help(msg: string | any) {
    if (typeof msg === 'string') {
      // this.helpMsg = new Info(msg);
    } else {
      this.helpMsg = msg;
    }
  }
  @Input()
  fontSize: string;
  @Input()
  tooltip: string;

  constructor() {
  }

  getValue() {
    return Array.isArray(this.value) ? this.value.join(', ') : this.value;
  }

}
