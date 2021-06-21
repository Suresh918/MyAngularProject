import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {FormControlConfiguration} from '../../models/mc-configuration.model';

@Component({
  selector: 'mc-toggle-font-size',
  templateUrl: './toggle-font-size.component.html',
  styleUrls: ['./toggle-font-size.component.scss']
})
export class ToggleFontSizeComponent implements OnChanges {
  @Output() readonly onChangeFontSize: EventEmitter<any> = new EventEmitter();
  @Input() fontSize: string;
  changeFontSizeControlConfiguration: FormControlConfiguration;
  changeFontSizeControl: FormControl;

  constructor() {
    this.changeFontSizeControlConfiguration = {
      'placeholder': '',
      'options': [{
        'name': 'small',
        'label': 'A',
        'help': 'Regular'
      }, {
        'name': 'regular',
        'label': 'A',
        'help': 'Large'
      }, {
        'name': 'large',
        'label': 'A',
        'help': 'Extra-Large'
      }]
    } as any;
    this.changeFontSizeControl = new FormControl();
    this.changeFontSizeControl.setValue(this.fontSize);
  }

  ngOnChanges() {
    this.changeFontSizeControl.setValue(this.fontSize);
  }

  onSelectFontSize() {
    this.onChangeFontSize.emit(this.changeFontSizeControl.value);
  }
}
