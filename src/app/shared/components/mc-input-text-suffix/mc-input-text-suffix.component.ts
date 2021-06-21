import {Component, Input, OnInit} from '@angular/core';
import {MCFieldComponent} from '../mc-field/mc-field.component';

@Component({
  selector: 'mc-input-text-suffix',
  templateUrl: './mc-input-text-suffix.component.html',
  styleUrls: ['./mc-input-text-suffix.component.scss']
})
export class McInputTextSuffixComponent extends MCFieldComponent implements OnInit {
  @Input()
  suffix?: string;
  @Input()
  fontSize: string;
  @Input()
  textStyle: string;
}
