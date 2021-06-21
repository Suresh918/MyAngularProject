import { Component, OnInit, Input } from '@angular/core';
import {CaseObject} from '../../models/mc.model';

@Component({
  selector: 'mc-button-ims',
  templateUrl: './mc-button-ims.component.html',
  styleUrls: ['./mc-button-ims.component.scss']
})
export class MCButtonImsComponent implements OnInit {
  @Input()
  changeRequestID: string;
  @Input()
  caseObject: CaseObject;

  constructor() { }

  ngOnInit() {
  }

  openImplementationStrategy(): void {
      window.open('/change-requests/cr-implementation-strategy/' + this.changeRequestID, '_blank');
  }
}
