import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CaseObjectOverview} from '../../case-object-list/case-object-list.model';

@Component({
  selector: 'mc-case-object-overview-card-list',
  templateUrl: './case-object-overview-card-list.component.html',
  styleUrls: ['./case-object-overview-card-list.component.scss']
})
export class MCCaseObjectOverviewCardListComponent {
  caseObjectListId: string[];
  caseObjectData: CaseObjectOverview[];
  @Input()
  caseObjectType: string;
  @Input()
  caseObjectLabel: string;
  @Input()
  caseObjectRouterPath: string;
  @Input()
  showItemDeleteButton: boolean;
  @Input()
  deleteButtonCaseAction: string;
  @Output()
  readonly deleteItem: EventEmitter<string> = new EventEmitter<string>();

  get caseObjectList(): CaseObjectOverview[] {
    return this.caseObjectData;
  }

  @Input()
  set caseObjectList(value: CaseObjectOverview[]) {
    this.caseObjectData = value;
  }

  constructor() {
  }

  onDeleteItem($event) {
    this.deleteItem.emit($event);
  }

}
