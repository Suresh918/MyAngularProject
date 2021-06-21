import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CBCFormConfiguration, CompleteBusinessCaseFormConfiguration} from '../../models/mc-configuration.model';
import {CaseObject} from "../../models/mc.model";


@Component({
  selector: 'mc-cbc-cr',
  templateUrl: './cbc-cr.component.html',
  styleUrls: ['./cbc-cr.component.scss']
})
export class MCCBCCRComponent implements OnInit {
  @Input()
  caseActions?: string[];
  @Input()
  control: FormGroup;
  @Input()
  controlConfiguration: CompleteBusinessCaseFormConfiguration;
  @Input()
  isDisabled: boolean;
  @Input()
  caseObject: CaseObject;
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
