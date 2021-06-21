import {Component, Input, OnInit} from '@angular/core';

import {MCButtonComponent} from '../mc-button/mc-button.component';

@Component({
  selector: 'mc-button-dynamic',
  templateUrl: './mc-button-dynamic.component.html',
  styleUrls: ['./mc-button-dynamic.component.scss']
})
export class MCButtonDynamicComponent extends MCButtonComponent implements OnInit {
@Input()
showStatusUpdate: boolean;
  currentState: string;
  statesConfiguration: ButtonStateConfiguration;

  ngOnInit() {
    // this.currentState = 'INITIAL';
    this.statesConfiguration = {
      'initial': {
        'icon': 'cloud_download',
        'tooltip': 'Create Delta 1 In TeamCenter, then Download Excel File',
        'toast': 'Delta 1 created in TeamCenter',
        'toastDuration': 2000
      },
      'inprogress': {
        'icon': '',
        'tooltip': 'Preparing To Download Excel File',
        'toast': 'Download in progress',
        'toastDuration': 2000
      },
      'success': {
        'icon': 'check',
        'tooltip': 'Successful',
        'toast': 'Download Started. Check Your Downloads Folder',
        'toastDuration': 2000
      },
      'failure': {
        'icon': 'warning',
        'tooltip': 'Failed',
        'toast': 'Something went wrong',
        'toastDuration': 2000
      }
    };
  }


}
