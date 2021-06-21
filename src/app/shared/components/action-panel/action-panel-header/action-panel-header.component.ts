import {Component, Input, OnInit} from '@angular/core';
import {CaseObjectOverview} from '../../case-object-list/case-object-list.model';

@Component({
  selector: 'mc-action-panel-header',
  templateUrl: './action-panel-header.component.html',
  styleUrls: ['./action-panel-header.component.scss']
})
export class ActionPanelHeaderComponent implements OnInit {
  type: string;
  priorityTooltip: string;
  @Input()
  set caseObjectType(type: string) {
    this.type = type;
    this.priorityTooltip = type === 'ChangeRequest' ? 'Priority Of Analysis' :  (type === 'ChangeNotice' ? 'Priority of Implementation' : '');
  }
  get caseObjectType() {
      return this.type;
  }
  @Input()
  caseObject: CaseObjectOverview;

  @Input()
  caseObjectFrom: string;

  @Input()
  title: string;

  constructor() {
  }

  ngOnInit() {
    if (this.caseObject && (this.caseObjectType !== 'ChangeRequest' && this.caseObjectType !== 'ReleasePackage')) {
      this.caseObject.totalOpenActions = this.caseObject.totalOpenActions || 0;
      this.caseObject.totalDueSoonActions = this.caseObject.totalDueSoonActions || 0;
      this.caseObject.totalOverdueActions = this.caseObject.totalOverdueActions || 0;
    } else if (this.caseObject && (this.caseObjectType === 'ChangeRequest' || this.caseObjectType === 'ReleasePackage')) {
      this.caseObject.open_actions = this.caseObject.open_actions || 0;
      this.caseObject.total_actions = this.caseObject.total_actions || 0;
    }
  }
}
