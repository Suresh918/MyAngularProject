import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CaseObjectOverview} from "../../../case-object-list/case-object-list.model";

@Component({
  selector: 'mc-case-object-overview-card-item',
  templateUrl: './case-object-overview-card-item.component.html',
  styleUrls: ['./case-object-overview-card-item.component.scss']
})
export class MCCaseObjectOverviewCardItemComponent  {
  @Input()
  caseObjectType: string;

  @Input()
  caseObjectLabel: string;

  @Input()
  caseObjectRouterPath: string;

  @Input()
  caseObject: CaseObjectOverview;

  @Input()
  hasPagination: boolean;

  @Input()
  showItemDeleteButton: boolean;

  @Input()
  deleteButtonCaseAction: string;

  @Input()
  referenceComponent: string;

  @Output()
  readonly deleteItem: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  onDeleteItem($event): void {
    this.deleteItem.emit($event);
  }

}
