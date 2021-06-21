import { Component, Input } from '@angular/core';

@Component({
  selector: 'mc-object',
  templateUrl: './object.component.html'
})
export class ObjectComponent {
  @Input()
  key: any;
  @Input()
  keyClass: any;
  @Input()
  value: any;
  @Input()
  valueClass: any;
  @Input()
  color: string;
  @Input()
  delimiter: string;
  @Input()
  direction: string;
  @Input()
  link?: string;
  @Input()
  noMargin: boolean;
  @Input()
  toolTip: string;

  constructor() {
    this.direction = 'row';
    this.delimiter = ':';
  }
}
