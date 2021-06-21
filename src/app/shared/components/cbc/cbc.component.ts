import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CBCFormConfiguration} from '../../models/mc-configuration.model';


@Component({
  selector: 'mc-cbc',
  templateUrl: './cbc.component.html',
  styleUrls: ['./cbc.component.scss']
})
export class MCCbcComponent implements OnInit {
  @Input()
  caseActions?: string[];
  @Input()
  control: FormGroup;
  @Input()
  controlConfiguration: CBCFormConfiguration;
  @Input()
  isDisabled: boolean;
  @Input()
  isExpanded: boolean;
  @Input()
  mode?: string;
  @Input()
  fontSize: string;

  toNumber(data: string) {
    return +data;
  }

  getAbsoluteValue(data: number) {
    return Math.abs(data);
  }

  ngOnInit(): void {
  }
}
