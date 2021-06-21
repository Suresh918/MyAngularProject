import {Component, Input, OnInit} from '@angular/core';
import {FormArray} from '@angular/forms';

@Component({
  selector: 'mc-overwrite-or-not',
  templateUrl: './overwrite-or-not.component.html',
  styleUrls: ['./overwrite-or-not.component.scss']
})
export class OverwriteOrNotComponent implements OnInit {
  @Input()
  selectedAirPbsItems: FormArray;
  @Input()
  importContentFormConfiguration: any;
  @Input()
  errorSummary?: string;
  @Input()
  importLoading: string;
  @Input()
  portationFormGroupArray: FormArray;

  ngOnInit() {

  }

}
